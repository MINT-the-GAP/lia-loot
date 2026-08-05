import { createPortalGraphic } from "./portal-visual.ts"
import {
  permitPortalSlideNavigation,
  portalSlideNavigationBlockMessage,
} from "./secret-slides.ts"
import {
  navigateToLiaSection,
} from "./slide-navigation.ts"
import {
  parseSlidePortalOptions,
  validateSlidePortalTarget,
  type SlidePortalMode,
  type SlidePortalOptions,
  type SlidePortalTargetStatus,
} from "./slide-portal-options.ts"
import {
  clearSlidePortalRoute,
  loadSlidePortalRoute,
  saveSlidePortalRoute,
  transitionSlidePortalRoute,
  type SlidePortalRoute,
} from "./slide-portal-route.ts"
import {
  activeLiaSection,
  observeLiaSlideActivity,
  sectionFromLootId,
} from "./slide-activity.ts"

const PORTAL_TAG = "lia-loot-slide-portal"
const STATUS_ID = "lia-loot-slide-portal-status"
const RETURN_SELECTOR = "[data-loot-slide-portal-return]"
const ROUTE_TTL = 4 * 60 * 60 * 1000
const FOCUS_TIMEOUT = 2_000

interface PortalRequest extends SlidePortalOptions {
  portalId: string
  sourceSection: number | null
  status: SlidePortalTargetStatus
}

let installed = false
let runtimeId = 0
let syncQueued = false
let rootObserver: MutationObserver | null = null
let activeRoute: SlidePortalRoute | null = null
let focusTimer: number | null = null
let focusDeadline = 0
let pendingFocusSection: number | null = null
const warnedSpecifications = new Set<string>()

function statusRegion(): HTMLElement {
  const existing = document.getElementById(STATUS_ID)
  if (existing) return existing
  const status = document.createElement("div")
  status.id = STATUS_ID
  status.className = "loot-slide-portal-status"
  status.setAttribute("role", "status")
  status.setAttribute("aria-live", "polite")
  status.setAttribute("aria-atomic", "true")
  document.body.appendChild(status)
  return status
}

function announce(message: string): void {
  const status = statusRegion()
  status.textContent = ""
  window.setTimeout(() => {
    status.textContent = message
  }, 0)
}

function resolvePortalId(host: HTMLElement): string {
  const authored = host.getAttribute("data-portal-id")?.trim()
  if (authored && !authored.startsWith("@")) {
    return `slide-portal:${authored}`
  }
  const existing = host.dataset.lootSlidePortalRuntimeId
  if (existing) return existing
  runtimeId += 1
  const generated = `slide-portal:runtime-${runtimeId}`
  host.dataset.lootSlidePortalRuntimeId = generated
  return generated
}

function sectionFromHost(host: HTMLElement, portalId: string): number | null {
  const authored = sectionFromLootId(portalId)
  if (authored !== null) return authored
  const slide = host.closest<HTMLElement>("main.lia-slide__content")
  const container = slide?.parentElement
  if (!slide || !container) return null
  const slides = [...container.children].filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.tagName === "MAIN",
  )
  const section = slides.indexOf(slide)
  return section >= 0 ? section : null
}

function sectionFromHashValue(value: string): number | null {
  let hash = value
  try {
    hash = new URL(value, window.location.href).hash
  } catch {
    // A plain #N value is handled by the same expression below.
  }
  const match = /^#(\d+)$/.exec(hash)
  if (!match) return null
  const section = Number(match[1]) - 1
  return Number.isInteger(section) && section >= 0 ? section : null
}

function knownSectionCount(): number | null {
  let highest = -1
  document
    .querySelectorAll<HTMLElement>(".lia-slide__container")
    .forEach((container) => {
      const count = [...container.children].filter(
        (element) =>
          element instanceof HTMLElement && element.tagName === "MAIN",
      ).length
      highest = Math.max(highest, count - 1)
    })
  document
    .querySelectorAll<HTMLAnchorElement>("#lia-toc a[href*='#']")
    .forEach((link) => {
      const section = sectionFromHashValue(
        link.getAttribute("href") ?? link.href,
      )
      if (section !== null) highest = Math.max(highest, section)
    })
  return highest >= 0 ? highest + 1 : null
}

function defaultMode(host: HTMLElement): SlidePortalMode {
  return host.getAttribute("data-default-mode") === "one-way"
    ? "one-way"
    : "two-way"
}

function readPortalRequest(host: HTMLElement): PortalRequest {
  const portalId = resolvePortalId(host)
  const parsed = parseSlidePortalOptions(
    host.getAttribute("data-options")?.trim() ?? "",
    defaultMode(host),
  )
  const sourceSection = sectionFromHost(host, portalId)
  const status =
    parsed.valid && sourceSection === null
      ? "pending"
      : parsed.valid
        ? validateSlidePortalTarget(
            parsed.targetSection,
            sourceSection,
            knownSectionCount(),
          )
        : "missing"
  return { ...parsed, portalId, sourceSection, status }
}

function portalProblem(request: PortalRequest): string {
  if (request.errors.length > 0) return request.errors.join(" ")
  if (request.status === "same-slide") {
    return "Quelle und Ziel eines Portals müssen verschiedene Folien sein."
  }
  if (request.status === "missing") {
    return `Die Zielfolie ${request.targetSlide ?? "?"} existiert nicht.`
  }
  return "Die Kursfolien werden noch vorbereitet."
}

function warnInvalidPortal(request: PortalRequest): void {
  if (
    request.status === "pending" ||
    warnedSpecifications.has(request.portalId)
  ) {
    return
  }
  warnedSpecifications.add(request.portalId)
  console.warn(
    `Loot: Portal ${request.portalId} ist defekt. ${portalProblem(request)}`,
  )
}

function buttonLabel(request: PortalRequest): string {
  if (request.status === "pending") return "Portal wird vorbereitet"
  if (!request.valid || request.status !== "valid") {
    return `Defektes Portal. ${portalProblem(request)}`
  }
  const kind =
    request.mode === "one-way" ? "Einwegportal" : "Zweiwegportal"
  return `${kind} zu Folie ${request.targetSlide} öffnen`
}

function createPortalButton(request: PortalRequest): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = `loot-slide-portal loot-slide-portal--${request.mode}`
  button.dataset.lootSlidePortalButton = request.portalId
  button.dataset.lootSlidePortalMode = request.mode
  button.dataset.lootSlidePortalTarget = String(request.targetSlide ?? "")
  button.setAttribute("aria-label", buttonLabel(request))
  const disabled = !request.valid || request.status !== "valid"
  button.disabled = disabled
  if (disabled) {
    button.classList.add(
      request.status === "pending"
        ? "loot-slide-portal--pending"
        : "loot-slide-portal--broken",
    )
    button.title = portalProblem(request)
  }
  button.append(createPortalGraphic(request.mode))

  const number = document.createElement("span")
  number.className = "loot-slide-portal__number"
  number.setAttribute("aria-hidden", "true")
  number.textContent =
    request.status === "pending" ? "…" : String(request.targetSlide ?? "?")
  button.append(number)
  button.addEventListener("click", () => activatePortal(request.portalId))
  return button
}

function requestSignature(request: PortalRequest): string {
  return [
    request.mode,
    request.targetSlide ?? "",
    request.status,
    request.errors.join("|"),
  ].join(":")
}

function syncPortalHost(host: HTMLElement): void {
  const request = readPortalRequest(host)
  const signature = requestSignature(request)
  if (
    host.dataset.lootSlidePortalSignature === signature &&
    host.querySelector("[data-loot-slide-portal-button]")
  ) {
    return
  }
  if (
    request.status !== "pending" &&
    (!request.valid || request.status !== "valid")
  ) {
    warnInvalidPortal(request)
  }
  host.dataset.lootSlidePortalSignature = signature
  const button = createPortalButton(request)
  if (
    request.status !== "pending" &&
    (!request.valid || request.status !== "valid")
  ) {
    const problem = document.createElement("span")
    problem.id = `lia-loot-slide-portal-problem-${request.portalId.replace(
      /[^a-zA-Z0-9_-]/gu,
      "-",
    )}`
    problem.className = "loot-slide-portal__problem"
    problem.setAttribute("role", "note")
    problem.textContent = `Defektes Portal: ${portalProblem(request)}`
    button.setAttribute("aria-describedby", problem.id)
    host.replaceChildren(button, problem)
    return
  }
  host.replaceChildren(button)
}

function findSlideMain(section: number): HTMLElement | null {
  const candidates: HTMLElement[] = []
  for (const container of document.querySelectorAll<HTMLElement>(
    ".lia-slide__container",
  )) {
    const slides = [...container.children].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element.tagName === "MAIN",
    )
    if (slides[section]) candidates.push(slides[section])
  }
  return candidates.find((slide) => !slide.hidden) ?? candidates[0] ?? null
}

function removeReturnPortals(exceptRouteId?: string): void {
  document
    .querySelectorAll<HTMLElement>(RETURN_SELECTOR)
    .forEach((placement) => {
      if (
        exceptRouteId &&
        placement.dataset.lootSlidePortalReturn === exceptRouteId
      ) {
        return
      }
      placement.remove()
    })
}

function routeId(route: SlidePortalRoute): string {
  return `${route.portalId}:${route.sourceSection}:${route.targetSection}`
}

function clearRoute(): void {
  activeRoute = null
  clearSlidePortalRoute()
  removeReturnPortals()
  rootObserver?.takeRecords()
}

function setRoute(route: SlidePortalRoute): void {
  activeRoute = route
  saveSlidePortalRoute(route)
}

function clearFocusRequest(): void {
  if (focusTimer !== null) window.clearTimeout(focusTimer)
  focusTimer = null
  focusDeadline = 0
  pendingFocusSection = null
}

function tryFocusDestination(): void {
  focusTimer = null
  const section = pendingFocusSection
  if (section === null) return
  const slide = findSlideMain(section)
  if (activeLiaSection() === section && slide && !slide.hidden) {
    const heading = slide.querySelector<HTMLElement>(
      "h1, h2, h3, h4, h5, h6",
    )
    const target = heading ?? slide
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1")
      target.dataset.lootSlidePortalFocus = "true"
    }
    target.focus({ preventScroll: true })
    clearFocusRequest()
    return
  }
  if (Date.now() >= focusDeadline) {
    clearFocusRequest()
    return
  }
  focusTimer = window.setTimeout(tryFocusDestination, 50)
}

function focusDestination(section: number): void {
  if (focusTimer !== null) window.clearTimeout(focusTimer)
  pendingFocusSection = section
  focusDeadline = Date.now() + FOCUS_TIMEOUT
  focusTimer = window.setTimeout(tryFocusDestination, 0)
}

function activatePortal(portalId: string): void {
  const host = [...document.querySelectorAll<HTMLElement>(PORTAL_TAG)].find(
    (candidate) => resolvePortalId(candidate) === portalId,
  )
  if (!host) return
  const request = readPortalRequest(host)
  if (
    !request.valid ||
    request.status !== "valid" ||
    request.targetSection === null ||
    request.sourceSection === null
  ) {
    announce(portalProblem(request))
    return
  }

  if (request.mode === "one-way") {
    if (!permitPortalSlideNavigation(request.targetSection)) {
      announce(portalSlideNavigationBlockMessage(request.targetSection))
      return
    }
    clearRoute()
    navigateToLiaSection(request.targetSection, "replace")
    focusDestination(request.targetSection)
    announce(`Einwegportal zu Folie ${request.targetSlide} geöffnet.`)
    scheduleSync()
    return
  }

  const route: SlidePortalRoute = {
    expiresAt: Date.now() + ROUTE_TTL,
    phase: "pending",
    portalId: request.portalId,
    sourceSection: request.sourceSection,
    targetSection: request.targetSection,
    version: 1,
  }
  if (!permitPortalSlideNavigation(request.targetSection)) {
    announce(portalSlideNavigationBlockMessage(request.targetSection))
    return
  }
  setRoute(route)
  navigateToLiaSection(request.targetSection, "push")
  focusDestination(request.targetSection)
  announce(`Portal zu Folie ${request.targetSlide} geöffnet.`)
  scheduleSync()
}

function createReturnPlacement(route: SlidePortalRoute): HTMLElement {
  const placement = document.createElement("aside")
  placement.className = "loot-slide-portal-return"
  placement.dataset.lootSlidePortalReturn = routeId(route)
  placement.setAttribute("aria-label", "Portal-Rückweg")

  const text = document.createElement("span")
  text.className = "loot-slide-portal-return__label"
  text.textContent = `Rückportal zu Folie ${route.sourceSection + 1}`

  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-slide-portal loot-slide-portal--return"
  button.dataset.lootSlidePortalReturnButton = routeId(route)
  button.setAttribute(
    "aria-label",
    `Rückportal zu Folie ${route.sourceSection + 1} öffnen`,
  )
  button.append(createPortalGraphic("two-way", true))
  const number = document.createElement("span")
  number.className = "loot-slide-portal__number"
  number.setAttribute("aria-hidden", "true")
  number.textContent = String(route.sourceSection + 1)
  button.append(number)
  button.addEventListener("click", () => {
    const sourceSection = route.sourceSection
    if (!permitPortalSlideNavigation(sourceSection)) {
      announce(
        "Das Rückportal wartet, bis die Kursnavigation vorbereitet ist.",
      )
      return
    }
    clearRoute()
    navigateToLiaSection(sourceSection, "push")
    focusDestination(sourceSection)
    announce(`Rückportal zu Folie ${sourceSection + 1} geöffnet.`)
  })
  placement.append(button, text)
  return placement
}

function syncReturnPortal(): void {
  if (!activeRoute) {
    removeReturnPortals()
    return
  }
  if (activeRoute.expiresAt <= Date.now()) {
    clearRoute()
    return
  }
  const transition = transitionSlidePortalRoute(
    activeRoute,
    activeLiaSection(),
  )
  if (!transition.route) {
    clearRoute()
    return
  }
  if (transition.route.phase !== activeRoute.phase) {
    setRoute(transition.route)
  } else {
    activeRoute = transition.route
  }
  if (!transition.showReturn) {
    removeReturnPortals()
    return
  }

  const id = routeId(transition.route)
  removeReturnPortals(id)
  const existing = [...document.querySelectorAll<HTMLElement>(
    RETURN_SELECTOR,
  )].find((placement) => placement.dataset.lootSlidePortalReturn === id)
  if (existing) return
  const target = findSlideMain(transition.route.targetSection)
  target?.append(createReturnPlacement(transition.route))
}

function syncAll(): void {
  syncQueued = false
  document
    .querySelectorAll<HTMLElement>(PORTAL_TAG)
    .forEach(syncPortalHost)
  syncReturnPortal()
  if (pendingFocusSection !== null && focusTimer === null) {
    tryFocusDestination()
  }
  rootObserver?.takeRecords()
}

function scheduleSync(): void {
  if (syncQueued) return
  syncQueued = true
  window.setTimeout(syncAll, 0)
}

function relevantNode(node: Node): boolean {
  const selector =
    `${PORTAL_TAG}, ${RETURN_SELECTOR}, .lia-slide__container, ` +
    'main.lia-slide__content, #lia-toc, #lia-toc a[href*="#"]'
  return (
    node instanceof Element &&
    (node.matches(selector) || node.querySelector(selector) !== null)
  )
}

export function installSlidePortals(): void {
  if (installed) return
  installed = true
  activeRoute = loadSlidePortalRoute()
  statusRegion()

  if (!customElements.get(PORTAL_TAG)) {
    class LootSlidePortalElement extends HTMLElement {
      static get observedAttributes(): string[] {
        return [
          "data-portal-id",
          "data-options",
          "data-default-mode",
        ]
      }

      connectedCallback(): void {
        syncPortalHost(this)
        scheduleSync()
      }

      attributeChangedCallback(): void {
        if (this.isConnected) syncPortalHost(this)
      }
    }
    customElements.define(PORTAL_TAG, LootSlidePortalElement)
  }

  observeLiaSlideActivity(scheduleSync)
  rootObserver = new MutationObserver((mutations) => {
    if (
      mutations.some((mutation) =>
        mutation.type === "attributes"
          ? mutation.target instanceof HTMLAnchorElement &&
            mutation.target.closest("#lia-toc") !== null
          :
          [...mutation.addedNodes, ...mutation.removedNodes].some(
            relevantNode,
          ),
      )
    ) {
      scheduleSync()
    }
  })
  rootObserver.observe(document.documentElement, {
    attributeFilter: ["href"],
    attributes: true,
    childList: true,
    subtree: true,
  })
  syncAll()
}
