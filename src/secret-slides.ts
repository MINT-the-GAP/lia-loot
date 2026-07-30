import {
  requireCourseSecretSlideDeclarations,
  type CourseSecretSlideDeclaration,
} from "./course-chests.ts"
import {
  activeLiaSection,
  refreshLiaSlideActivity,
  sectionFromLootId,
  setLiaSlideAccessGuard,
} from "./slide-activity.ts"

const SECRET_TAG = "lia-loot-secret-slide"
const SEARCH_ID = "lia-input-search"
const STATUS_ID = "lia-loot-secret-slide-status"
const SECRET_LINK_CLASS = "loot-secret-slide-link"
const FOUND_LINK_CLASS = "loot-secret-slide-link--found"
const BLOCKED_ROOT_CLASS = "loot-secret-slide-blocked"
const DISCOVERING_ROOT_CLASS = "loot-secret-slide-discovering"
const DISCOVERY_FAILED_ROOT_CLASS = "loot-secret-slide-discovery-failed"
const PERMIT_KEY = "lia-loot-secret-slide-permit:v1"
const PERMIT_TTL = 15_000
const GATE_MESSAGE_DELAY = 250
const SWIPE_THRESHOLD = 150
const SWIPE_RESTRAINT = 100
const SWIPE_TIME_LIMIT = 300
const TOC_LINK_SELECTOR =
  "#lia-toc .lia-toc__content > a.lia-toc__link[href*='#']"

interface SecretPermit {
  course: string
  expiresAt: number
  section: number
}

interface GatedElementState {
  ariaHidden: string | null
  inert: boolean
  pointerEvents: string
  visibility: string
}

interface GestureStart {
  kind: "mouse" | "touch"
  startedAt: number
  x: number
  y: number
}

interface SecretSlideController {
  found(section: number): void
}

const secretSections = new Set<number>()
const gatedElements = new Map<HTMLElement, GatedElementState>()
let tocObserver: MutationObserver | null = null
let documentObserver: MutationObserver | null = null
let rootClassObserver: MutationObserver | null = null
let observedToc: HTMLElement | null = null
let syncTimer: number | null = null
let gateMessageTimer: number | null = null
let installed = false
let discoveryState: "pending" | "complete" | "failed" = "pending"
let sourceDeclarationsReady = false
let routeBlocked = false
let pendingPermitSection: number | null = null
let allowedCurrentSection: number | null = null
let lastAcceptedSection: number | null = null
let redirectingFromSection: number | null = null
let gestureStart: GestureStart | null = null
let controller: SecretSlideController | null = null

export function normalizeSecretTitle(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("de-DE")
}

export function nextPublicSection(
  secrets: ReadonlySet<number>,
  totalSections: number,
  fromSection: number,
  direction: -1 | 1,
): number | null {
  for (
    let section = fromSection + direction;
    section >= 0 && section < totalSections;
    section += direction
  ) {
    if (!secrets.has(section)) return section
  }
  return null
}

export function publicFallbackSection(
  secrets: ReadonlySet<number>,
  totalSections: number,
  blockedSection: number,
  previousSection: number | null,
): number | null {
  const preferredDirection: -1 | 1 =
    previousSection === null
      ? -1
      : blockedSection > previousSection
        ? 1
        : -1
  return (
    nextPublicSection(
      secrets,
      totalSections,
      blockedSection,
      preferredDirection,
    ) ??
    nextPublicSection(
      secrets,
      totalSections,
      blockedSection,
      preferredDirection === 1 ? -1 : 1,
    )
  )
}

function courseIdentity(): string {
  try {
    const url = new URL(window.location.href)
    url.hash = ""
    return url.href
  } catch {
    return `${window.location.pathname}${window.location.search}`
  }
}

function removeStoredPermit(): void {
  try {
    window.sessionStorage.removeItem(PERMIT_KEY)
  } catch {
    // Storage can be disabled without disabling secret-slide navigation.
  }
}

function readStoredPermit(): number | null {
  try {
    const raw = window.sessionStorage.getItem(PERMIT_KEY)
    if (!raw) return null
    const permit = JSON.parse(raw) as Partial<SecretPermit>
    if (
      permit.course !== courseIdentity() ||
      !Number.isInteger(permit.section) ||
      (permit.section as number) < 0 ||
      typeof permit.expiresAt !== "number" ||
      permit.expiresAt < Date.now()
    ) {
      removeStoredPermit()
      return null
    }
    return permit.section as number
  } catch {
    removeStoredPermit()
    return null
  }
}

function storePermit(section: number): void {
  pendingPermitSection = section
  const permit: SecretPermit = {
    course: courseIdentity(),
    expiresAt: Date.now() + PERMIT_TTL,
    section,
  }
  try {
    window.sessionStorage.setItem(PERMIT_KEY, JSON.stringify(permit))
  } catch {
    // The in-memory permit still works when LiaScript does not reload the page.
  }
}

function statusRegion(): HTMLElement {
  const existing = document.getElementById(STATUS_ID)
  if (existing) return existing
  const status = document.createElement("div")
  status.id = STATUS_ID
  status.className = "loot-secret-slide-status"
  status.setAttribute("role", "status")
  status.setAttribute("aria-live", "polite")
  status.setAttribute("aria-atomic", "true")
  document.body.appendChild(status)
  return status
}

function announce(message: string): void {
  const status = statusRegion()
  status.classList.remove("loot-secret-slide-status--visible")
  status.setAttribute("role", "status")
  status.setAttribute("aria-live", "polite")
  status.textContent = ""
  window.setTimeout(() => {
    status.textContent = message
  }, 0)
}

function showGateStatus(message: string, failed = false): void {
  const status = statusRegion()
  status.classList.add("loot-secret-slide-status--visible")
  status.setAttribute("role", failed ? "alert" : "status")
  status.setAttribute("aria-live", failed ? "assertive" : "polite")
  status.textContent = message
}

function hideGateStatus(): void {
  if (gateMessageTimer !== null) {
    window.clearTimeout(gateMessageTimer)
    gateMessageTimer = null
  }
  const status = statusRegion()
  status.classList.remove("loot-secret-slide-status--visible")
  status.textContent = ""
}

function restoreAttribute(
  element: HTMLElement,
  name: string,
  value: string | null,
): void {
  if (value === null) element.removeAttribute(name)
  else element.setAttribute(name, value)
}

function desiredGatedElements(): Set<HTMLElement> {
  const selectors = [
    "main.lia-slide__content:not([hidden])",
    ".lia-pagination",
    ".loot-object-lock-button--local",
  ]
  if (discoveryState !== "complete") {
    selectors.push("#lia-toc .lia-toc__content")
  }
  const elements = new Set<HTMLElement>()
  for (const selector of selectors) {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      elements.add(element)
    })
  }
  return elements
}

function syncInteractionGate(): void {
  const active = discoveryState !== "complete" || routeBlocked
  const desired = active ? desiredGatedElements() : new Set<HTMLElement>()

  for (const [element, state] of [...gatedElements]) {
    if (desired.has(element)) continue
    element.inert = state.inert
    if (element.getAttribute("aria-hidden") === "true") {
      restoreAttribute(element, "aria-hidden", state.ariaHidden)
    }
    if (element.style.pointerEvents === "none") {
      element.style.pointerEvents = state.pointerEvents
    }
    if (element.style.visibility === "hidden") {
      element.style.visibility = state.visibility
    }
    gatedElements.delete(element)
  }

  for (const element of desired) {
    if (!gatedElements.has(element)) {
      gatedElements.set(element, {
        ariaHidden: element.getAttribute("aria-hidden"),
        inert: element.inert,
        pointerEvents: element.style.pointerEvents,
        visibility: element.style.visibility,
      })
    }
    element.inert = true
    element.setAttribute("aria-hidden", "true")
    element.style.pointerEvents = "none"
    element.style.visibility = "hidden"
  }

  const focused = document.activeElement
  if (
    focused instanceof HTMLElement &&
    [...desired].some(
      (element) => element === focused || element.contains(focused),
    )
  ) {
    focused.blur()
  }
}

function sectionFromLink(link: HTMLAnchorElement): number | null {
  const href = link.getAttribute("href") ?? ""
  let hash = href
  try {
    hash = new URL(href, window.location.href).hash
  } catch {
    // The regular expression below rejects malformed links.
  }
  const match = /^#(\d+)$/.exec(hash)
  if (!match) return null
  const section = Number(match[1]) - 1
  return Number.isInteger(section) && section >= 0 ? section : null
}

function tocLinks(): HTMLAnchorElement[] {
  return [...document.querySelectorAll<HTMLAnchorElement>(TOC_LINK_SELECTOR)]
}

function activeSection(): number | null {
  return activeLiaSection()
}

function searchQuery(): string {
  const input = document.getElementById(SEARCH_ID)
  return input instanceof HTMLInputElement
    ? normalizeSecretTitle(input.value)
    : ""
}

function linkTitle(link: HTMLAnchorElement): string {
  return normalizeSecretTitle(link.textContent ?? "")
}

function exactSecretLinks(): HTMLAnchorElement[] {
  const query = searchQuery()
  if (!query) return []
  return tocLinks().filter((link) => {
    const section = sectionFromLink(link)
    return (
      section !== null && secretSections.has(section) && linkTitle(link) === query
    )
  })
}

function syncTocLinks(): { links: HTMLAnchorElement[]; totalSections: number } {
  const links = tocLinks()
  const query = searchQuery()
  let highestSection = -1

  for (const link of links) {
    const section = sectionFromLink(link)
    if (section === null) continue
    highestSection = Math.max(highestSection, section)
    const secret = secretSections.has(section)
    const found = secret && query !== "" && linkTitle(link) === query
    link.classList.toggle(SECRET_LINK_CLASS, secret)
    link.classList.toggle(FOUND_LINK_CLASS, found)
    if (secret) link.dataset.lootSecretSection = String(section)
    else delete link.dataset.lootSecretSection
  }

  return { links, totalSections: highestSection + 1 }
}

function navigateToSection(section: number, replaceHistory = true): void {
  const hash = `#${section + 1}`
  if (!replaceHistory) {
    window.location.hash = hash
    return
  }
  try {
    window.location.replace(hash)
  } catch {
    window.location.hash = hash
  }
}

function enforceRootClasses(): void {
  const root = document.documentElement
  root.classList.toggle(
    DISCOVERING_ROOT_CLASS,
    discoveryState !== "complete",
  )
  root.classList.toggle(
    DISCOVERY_FAILED_ROOT_CLASS,
    discoveryState === "failed",
  )
  root.classList.toggle(BLOCKED_ROOT_CLASS, routeBlocked)
}

function setRouteBlocked(blocked: boolean): void {
  routeBlocked = blocked
  enforceRootClasses()
  syncInteractionGate()
  refreshLiaSlideActivity()
}

function collectibleSlideAllowed(section: number | null): boolean {
  if (discoveryState !== "complete") return false
  return (
    section === null ||
    !secretSections.has(section) ||
    allowedCurrentSection === section
  )
}

function guardActiveSection(totalSections: number): void {
  if (discoveryState !== "complete") {
    syncInteractionGate()
    return
  }
  const section = activeSection()
  if (section === null || totalSections <= 0) {
    setRouteBlocked(false)
    return
  }

  if (!secretSections.has(section)) {
    lastAcceptedSection = section
    allowedCurrentSection = null
    redirectingFromSection = null
    setRouteBlocked(false)
    return
  }

  if (allowedCurrentSection === section) {
    setRouteBlocked(false)
    return
  }

  if (pendingPermitSection === section) {
    pendingPermitSection = null
    allowedCurrentSection = section
    lastAcceptedSection = section
    redirectingFromSection = null
    removeStoredPermit()
    setRouteBlocked(false)
    controller?.found(section)
    announce("Geheimfolie geöffnet.")
    return
  }

  const fallback = publicFallbackSection(
    secretSections,
    totalSections,
    section,
    lastAcceptedSection,
  )
  if (fallback === null) {
    console.warn(
      "Loot: Der Kurs enthält keine öffentliche Folie; die Geheimfolie bleibt erreichbar.",
    )
    allowedCurrentSection = section
    lastAcceptedSection = section
    setRouteBlocked(false)
    return
  }

  setRouteBlocked(true)
  if (redirectingFromSection === section) return
  redirectingFromSection = section
  navigateToSection(fallback)
}

function syncAll(): void {
  syncTimer = null
  const { totalSections } = syncTocLinks()
  if (
    discoveryState === "pending" &&
    sourceDeclarationsReady &&
    totalSections > 0 &&
    activeSection() !== null
  ) {
    discoveryState = "complete"
  }
  guardActiveSection(totalSections)
  if (discoveryState === "complete") {
    enforceRootClasses()
    hideGateStatus()
  }
  syncInteractionGate()
}

function scheduleSync(): void {
  if (syncTimer !== null) return
  syncTimer = window.setTimeout(syncAll, 0)
}

function eventElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) return target
  if (target instanceof Node) return target.parentElement
  return null
}

function authorizeLink(link: HTMLAnchorElement): boolean {
  const section = sectionFromLink(link)
  if (section === null || !secretSections.has(section)) return false
  const matches = exactSecretLinks()
  if (matches.length !== 1 || matches[0] !== link) {
    announce(
      matches.length > 1
        ? "Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien."
        : "Gib zuerst den vollständigen Namen der Geheimfolie in die Suche ein.",
    )
    return false
  }
  if (
    activeSection() === section &&
    allowedCurrentSection === section
  ) {
    pendingPermitSection = null
    removeStoredPermit()
    return true
  }
  storePermit(section)
  return true
}

function handleSecretLinkClick(event: MouseEvent): void {
  const target = eventElement(event.target)
  const link = target?.closest<HTMLAnchorElement>(
    `a.${SECRET_LINK_CLASS}`,
  )
  if (!link) return
  if (authorizeLink(link)) return
  event.preventDefault()
  event.stopImmediatePropagation()
  event.stopPropagation()
}

function handleSearchEnter(event: KeyboardEvent): void {
  const sequentialNavigation =
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    (event.altKey &&
      event.shiftKey &&
      ["n", "p"].includes(event.key.toLocaleLowerCase("en-US")))
  if (discoveryState !== "complete" && sequentialNavigation) {
    event.preventDefault()
    event.stopImmediatePropagation()
    event.stopPropagation()
    return
  }

  if (
    event.key !== "Enter" ||
    event.isComposing ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    !(event.target instanceof HTMLInputElement) ||
    event.target.id !== SEARCH_ID
  ) {
    return
  }

  const matches = exactSecretLinks()
  if (matches.length === 0) return
  event.preventDefault()
  event.stopImmediatePropagation()
  event.stopPropagation()
  if (matches.length > 1) {
    announce(
      "Der Folienname ist nicht eindeutig. Verwende eindeutige Titel für Geheimfolien.",
    )
    return
  }
  const section = sectionFromLink(matches[0])
  if (section !== null && authorizeLink(matches[0])) {
    navigateToSection(section, false)
  }
}

function startDiscoveryGesture(event: TouchEvent | MouseEvent): void {
  if (discoveryState === "complete") {
    gestureStart = null
    return
  }
  if (event instanceof MouseEvent) {
    gestureStart = {
      kind: "mouse",
      startedAt: Date.now(),
      x: event.pageX,
      y: event.pageY,
    }
    return
  }
  const touch = event.changedTouches[0]
  if (!touch) return
  gestureStart = {
    kind: "touch",
    startedAt: Date.now(),
    x: touch.pageX,
    y: touch.pageY,
  }
}

function endDiscoveryGesture(event: TouchEvent | MouseEvent): void {
  const start = gestureStart
  gestureStart = null
  if (!start || discoveryState === "complete") return
  if (event instanceof MouseEvent) {
    if (start.kind !== "mouse") return
  } else if (start.kind !== "touch") {
    return
  }
  const point =
    event instanceof MouseEvent ? event : event.changedTouches[0]
  if (!point) return
  const distanceX = point.pageX - start.x
  const distanceY = point.pageY - start.y
  const horizontalNavigation =
    Date.now() - start.startedAt <= SWIPE_TIME_LIMIT &&
    Math.abs(distanceX) >= SWIPE_THRESHOLD &&
    Math.abs(distanceY) <= SWIPE_RESTRAINT
  if (!horizontalNavigation) return
  if (event.cancelable) event.preventDefault()
  event.stopImmediatePropagation()
  event.stopPropagation()
}

function cancelDiscoveryGesture(): void {
  gestureStart = null
}

function registerDeclarations(
  declarations: readonly CourseSecretSlideDeclaration[],
): void {
  for (const declaration of declarations) {
    if (declaration.section >= 0) secretSections.add(declaration.section)
  }
}

function renderedMarkerSection(marker: HTMLElement): number | null {
  const authoredId = marker.getAttribute("data-secret-id") ?? ""
  const idSection = sectionFromLootId(authoredId)
  if (idSection !== null) return idSection

  const slide = marker.closest<HTMLElement>("main")
  const container = slide?.parentElement
  if (!slide || !container) return null
  const slides = [...container.children].filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.tagName === "MAIN",
  )
  const section = slides.indexOf(slide)
  return section >= 0 ? section : null
}

function registerRenderedMarker(marker: HTMLElement): void {
  const section = renderedMarkerSection(marker)
  if (section !== null) secretSections.add(section)
  scheduleSync()
}

function completeDiscovery(
  declarations: readonly CourseSecretSlideDeclaration[],
): void {
  registerDeclarations(declarations)
  sourceDeclarationsReady = true
  syncAll()
}

function failDiscovery(error: unknown): void {
  discoveryState = "failed"
  enforceRootClasses()
  showGateStatus(
    "Geheimfolien konnten nicht sicher geladen werden. Bitte prüfe die Kursquelle und lade den Kurs neu.",
    true,
  )
  syncInteractionGate()
  refreshLiaSlideActivity()
  console.error("Loot: Geheimfolien-Initialisierung fehlgeschlagen.", error)
}

function attachTocObserver(): void {
  const toc = document.getElementById("lia-toc")
  if (toc === observedToc) return
  tocObserver?.disconnect()
  observedToc = toc
  if (!toc) return
  tocObserver = new MutationObserver(scheduleSync)
  tocObserver.observe(toc, {
    attributeFilter: ["class", "href", "id"],
    attributes: true,
    childList: true,
    subtree: true,
  })
  scheduleSync()
}

function addedGateElement(node: Node): boolean {
  if (!(node instanceof Element)) return false
  const selector =
    "main.lia-slide__content, .lia-pagination, .loot-object-lock-button--local, #lia-toc .lia-toc__content"
  return node.matches(selector) || node.querySelector(selector) !== null
}

function handleDocumentMutations(mutations: MutationRecord[]): void {
  if (document.getElementById("lia-toc") !== observedToc) attachTocObserver()
  if (discoveryState === "complete" && !routeBlocked) return
  if (
    mutations.some((mutation) =>
      [...mutation.addedNodes].some(addedGateElement),
    )
  ) {
    scheduleSync()
  }
}

export function installSecretSlides(
  nextController?: SecretSlideController,
): void {
  if (nextController) controller = nextController
  if (installed) return
  installed = true
  setLiaSlideAccessGuard(collectibleSlideAllowed)
  rootClassObserver = new MutationObserver(enforceRootClasses)
  rootClassObserver.observe(document.documentElement, {
    attributeFilter: ["class"],
    attributes: true,
  })
  enforceRootClasses()
  pendingPermitSection = readStoredPermit()
  statusRegion()
  gateMessageTimer = window.setTimeout(() => {
    gateMessageTimer = null
    if (discoveryState === "pending") {
      showGateStatus("Kursnavigation wird vorbereitet …")
    }
  }, GATE_MESSAGE_DELAY)

  if (!customElements.get(SECRET_TAG)) {
    class LootSecretSlideElement extends HTMLElement {
      connectedCallback(): void {
        this.hidden = true
        this.setAttribute("aria-hidden", "true")
        registerRenderedMarker(this)
      }
    }
    customElements.define(SECRET_TAG, LootSecretSlideElement)
  }

  document.addEventListener("click", handleSecretLinkClick, true)
  document.addEventListener("keydown", handleSearchEnter, true)
  document.addEventListener("input", scheduleSync)
  document.addEventListener("touchstart", startDiscoveryGesture, {
    capture: true,
    passive: true,
  })
  document.addEventListener("touchend", endDiscoveryGesture, {
    capture: true,
    passive: false,
  })
  document.addEventListener("touchcancel", cancelDiscoveryGesture, true)
  document.addEventListener("mousedown", startDiscoveryGesture, true)
  document.addEventListener("mouseup", endDiscoveryGesture, true)
  window.addEventListener("blur", cancelDiscoveryGesture)
  window.addEventListener("hashchange", scheduleSync)

  attachTocObserver()
  documentObserver = new MutationObserver(handleDocumentMutations)
  documentObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  void requireCourseSecretSlideDeclarations()
    .then(completeDiscovery)
    .catch(failDiscovery)
  scheduleSync()
}
