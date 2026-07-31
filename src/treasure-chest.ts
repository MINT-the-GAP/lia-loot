import type { ResourceKind } from "./types.ts"
import {
  discoverCourseChests,
  type CourseChestDeclaration,
} from "./course-chests.ts"
import {
  CollectibleVisibilityGate,
  collectibleVisibilitySignature,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  setHostConcealment,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  observeLiaSlideActivity,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"
import {
  findTemplateTarget,
  isTemplateTarget,
  resolveTemplateTarget,
  templateDocumentCandidates,
  templateTargetDefinition,
  type TemplateChestPosition,
  type TemplateTarget,
} from "./template-targets.ts"

const CHEST_TAG = "lia-loot-chest"
const LEGACY_CHEST_ID = "lia-loot-treasure-chest"
const PORTAL_ATTRIBUTE = "data-loot-chest-portal"
const TRAY_ATTRIBUTE = "data-loot-chest-tray"
const SVG_NS = "http://www.w3.org/2000/svg"
const OPENING_DURATION = 650

type CoreChestPlacement =
  | "toc"
  | "menu"
  | "classroom"
  | "info"
  | "translator"
  | "mode"
type ChestPlacement = CoreChestPlacement | TemplateTarget
type ChestLocation = ChestPlacement | "inline"

interface TreasureChestController {
  active(reward: ResourceKind): boolean
  catalogReady(total: number): void
  collected(chestId: string): boolean
  collect(chestId: string, reward: ResourceKind): boolean
}

interface HostRequest {
  baseId: string
  concealment: ConcealmentMode | null
  errors: string[]
  inline: boolean
  placements: ChestPlacement[]
  reward: ResourceKind
  sourceHost: HTMLElement
  sourceSection: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

interface PortalRequest {
  concealment: ConcealmentMode | null
  placements: Set<ChestPlacement>
  reward: ResourceKind
  sourceHost?: HTMLElement
  sourceSection: number | null
  visibility: CollectibleVisibilityRule
}

interface PortalDestination {
  anchor: HTMLElement
  container: HTMLElement
  grouped: boolean
  template: boolean
  templateLayout: "floating" | "inside" | null
  templatePosition: TemplateChestPosition | null
}

const PLACEMENT_ALIASES: Readonly<Record<string, CoreChestPlacement>> = {
  toc: "toc",
  menu: "menu",
  classroom: "classroom",
  info: "info",
  translator: "translator",
  translate: "translator",
  translation: "translator",
  lang: "translator",
  übersetzer: "translator",
  uebersetzer: "translator",
  mode: "mode",
  display: "mode",
  view: "mode",
  darstellung: "mode",
}

const TARGET_SELECTORS: Record<CoreChestPlacement, string> = {
  toc: "#lia-toc .lia-toc__content",
  menu:
    "#lia-support-menu .lia-support-menu__item--settings .lia-support-menu__submenu",
  classroom:
    "#lia-support-menu .lia-support-menu__item--share .lia-support-menu__submenu",
  info:
    "#lia-support-menu .lia-support-menu__item--info .lia-support-menu__submenu",
  translator:
    "#lia-support-menu .lia-support-menu__item--lang .lia-support-menu__submenu",
  mode:
    "#lia-support-menu .lia-support-menu__item--mode .lia-support-menu__submenu",
}

const portalRequests = new Map<string, PortalRequest>()
const pendingPortalRequests = new Map<string, PortalRequest>()
const sourceRequestIds = new Set<string>()
const sourceSignatureCounts = new Map<string, number>()
const matchedSourceHosts = new Map<string, string>()
const openingIds = new Set<string>()
const eligibleChestIds = new Set<string>()
const warnedInvalidSpecs = new Set<string>()
const visibilityGate = new CollectibleVisibilityGate()
let controller: TreasureChestController | null = null
const observers: MutationObserver[] = []
let syncTimer: number | null = null
let runtimeId = 0
let sourceDiscovery: "idle" | "pending" | "complete" = "idle"
let slideActivityInstalled = false
let viewportListenersInstalled = false

function removeEmptyPortalTray(candidate: HTMLElement | null): void {
  if (
    candidate?.hasAttribute(TRAY_ATTRIBUTE) &&
    !candidate.querySelector(`[${PORTAL_ATTRIBUTE}]`)
  ) {
    candidate.remove()
  }
}

function removePortal(portal: HTMLElement | null | undefined): void {
  if (!portal) return
  const tray = portal.parentElement
  portal.remove()
  removeEmptyPortalTray(tray)
}

function chestGraphic(
  reward: ResourceKind,
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 64 56")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-treasure-chest-graphic")
  if (reward === "diamonds") {
    svg.classList.add("loot-treasure-chest-graphic--diamonds")
  } else if (reward === "energy") {
    svg.classList.add("loot-treasure-chest-graphic--energy")
  }
  const lockDecoration =
    reward === "diamonds"
      ? `
        <polygon class="loot-chest-diamond-outline" points="32,31 41,36 32,47 23,36"/>
        <polygon class="loot-chest-diamond-dark" points="32,33 38,36 32,44 26,36"/>
        <polygon class="loot-chest-diamond" points="32,33 38,36 32,41 26,36"/>
        <polygon class="loot-chest-diamond-light" points="32,33 32,40 26,36"/>
      `
      : reward === "energy"
        ? `
          <polygon class="loot-chest-energy-outline" points="33,31 40,31 35,36 39,36 28,47 31,39 24,39"/>
          <polygon class="loot-chest-energy" points="34,33 37,33 33,37 36,37 30,43 32,38 27,38"/>
          <polygon class="loot-chest-energy-light" points="34,33 36,33 33,36 32,36"/>
        `
        : `
          <rect class="loot-chest-keyhole" x="31" y="37" width="2" height="5"/>
          <rect class="loot-chest-keyhole" x="30" y="40" width="4" height="2"/>
        `
  svg.innerHTML = `
    <rect class="loot-chest-shadow" x="8" y="50" width="48" height="4"/>
    <g class="loot-chest-lid">
      <rect class="loot-chest-outline" x="8" y="6" width="48" height="18"/>
      <rect class="loot-chest-wood-dark" x="12" y="10" width="40" height="12"/>
      <rect class="loot-chest-wood" x="16" y="10" width="32" height="4"/>
      <rect class="loot-chest-wood-light" x="16" y="10" width="20" height="2"/>
      <rect class="loot-chest-wood" x="12" y="16" width="40" height="6"/>
      <rect class="loot-chest-metal-dark" x="28" y="6" width="8" height="18"/>
      <rect class="loot-chest-metal" x="30" y="8" width="4" height="14"/>
      <rect class="loot-chest-outline" x="4" y="22" width="56" height="10"/>
      <rect class="loot-chest-metal-dark" x="8" y="24" width="48" height="6"/>
      <rect class="loot-chest-metal" x="8" y="24" width="48" height="2"/>
      <rect class="loot-chest-metal-light" x="12" y="24" width="16" height="2"/>
    </g>
    <rect class="loot-chest-outline" x="8" y="30" width="48" height="20"/>
    <rect class="loot-chest-wood-dark" x="12" y="34" width="40" height="12"/>
    <rect class="loot-chest-wood" x="12" y="34" width="40" height="6"/>
    <rect class="loot-chest-wood-light" x="16" y="34" width="18" height="2"/>
    <rect class="loot-chest-metal-dark" x="28" y="30" width="8" height="20"/>
    <rect class="loot-chest-metal" x="30" y="32" width="4" height="16"/>
    <rect class="loot-chest-outline" x="24" y="30" width="16" height="16"/>
    <rect class="loot-chest-metal-dark" x="28" y="34" width="8" height="8"/>
    <rect class="loot-chest-metal" x="30" y="34" width="4" height="4"/>
    ${lockDecoration}
    <rect class="loot-chest-outline" x="12" y="50" width="8" height="4"/>
    <rect class="loot-chest-outline" x="44" y="50" width="8" height="4"/>
  `
  return svg
}

function rewardBadge(
  rewardKind: ResourceKind,
  ownerDocument: Document = document,
): HTMLSpanElement {
  const reward = ownerDocument.createElement("span")
  reward.className = "loot-treasure-reward"
  if (rewardKind === "diamonds") {
    reward.classList.add("loot-treasure-reward--diamonds")
  } else if (rewardKind === "energy") {
    reward.classList.add("loot-treasure-reward--energy")
  }
  reward.setAttribute("aria-hidden", "true")
  reward.innerHTML =
    rewardKind === "diamonds"
      ? '<span class="loot-treasure-reward__gem"></span><span>+1</span>'
      : rewardKind === "energy"
        ? '<span class="loot-treasure-reward__energy"></span><span>+1</span>'
        : '<span class="loot-treasure-reward__coin"></span><span>+1</span>'
  return reward
}

function showResourceRequirement(
  button: HTMLButtonElement,
  reward: ResourceKind,
): void {
  button.querySelector(".loot-treasure-requirement")?.remove()

  const requirement = button.ownerDocument.createElement("span")
  requirement.className = "loot-treasure-requirement"
  requirement.setAttribute("role", "status")
  requirement.textContent =
    reward === "energy"
      ? "Zuerst Energie mit @Ressourcen(Gold, Diamanten, Energie) festlegen"
      : "Zuerst @Ressourcen(...) ausführen"
  button.appendChild(requirement)

  button.classList.remove("loot-treasure-chest--waiting")
  void button.offsetWidth
  button.classList.add("loot-treasure-chest--waiting")

  window.setTimeout(() => {
    requirement.remove()
    button.classList.remove("loot-treasure-chest--waiting")
  }, 2200)
}

function createChestButton(
  chestId: string,
  location: ChestLocation,
  reward: ResourceKind,
  ownerDocument: Document = document,
): HTMLButtonElement {
  const button = ownerDocument.createElement("button")
  button.type = "button"
  button.className = "loot-treasure-chest"
  if (reward === "diamonds") {
    button.classList.add("loot-treasure-chest--diamonds")
  } else if (reward === "energy") {
    button.classList.add("loot-treasure-chest--energy")
  }
  button.dataset.lootChestButton = chestId
  button.dataset.lootChestLocation = location
  button.dataset.lootChestReward = reward
  button.setAttribute(
    "aria-label",
    reward === "diamonds"
      ? "Diamanttruhe öffnen und einen Diamanten erhalten"
      : reward === "energy"
        ? "Energiekiste öffnen und einen Energiepunkt erhalten"
        : "Schatztruhe öffnen und eine Goldmünze erhalten",
  )
  button.append(
    chestGraphic(reward, ownerDocument),
    rewardBadge(reward, ownerDocument),
  )

  button.addEventListener("click", () => {
    if (!controller || openingIds.has(chestId)) return

    // LiaScript can finish a slide transition after the button was rendered.
    // Re-check synchronously so a still visible chest cannot be left behind by
    // a cleared eligibility cache while a scheduled DOM sync is pending.
    if (!eligibleChestIds.has(chestId)) {
      syncAll()
      if (!button.isConnected || !eligibleChestIds.has(chestId)) return
    }
    if (!controller.active(reward)) {
      showResourceRequirement(button, reward)
      return
    }

    openingIds.add(chestId)
    if (!controller.collect(chestId, reward)) {
      openingIds.delete(chestId)
      refreshTreasureChests()
      return
    }

    button.disabled = true
    button.classList.add("loot-treasure-chest--opened")

    window.setTimeout(() => {
      openingIds.delete(chestId)
      const portal = button.closest<HTMLElement>(`[${PORTAL_ATTRIBUTE}]`)
      if (portal) removePortal(portal)
      else button.remove()
      scheduleSync()
    }, OPENING_DURATION)
  })

  return button
}

function resolveBaseId(host: HTMLElement): string {
  const authoredId = host.getAttribute("data-chest-id")?.trim()
  if (authoredId && !authoredId.startsWith("@")) return authoredId

  const existingId = host.dataset.lootRuntimeId
  if (existingId) return existingId

  runtimeId += 1
  const generatedId = `runtime-${runtimeId}`
  host.dataset.lootRuntimeId = generatedId
  return generatedId
}

function readReward(host: HTMLElement): ResourceKind {
  const reward = host.getAttribute("data-reward")?.trim().toLowerCase()
  return reward === "diamonds" ||
    reward === "diamond" ||
    reward === "gems" ||
    reward === "diamant" ||
    reward === "diamanten"
    ? "diamonds"
    : reward === "energy" ||
        reward === "energie" ||
        reward === "power" ||
        reward === "bolt"
      ? "energy"
      : "gold"
}

function readPlacements(values: readonly string[]): ChestPlacement[] {
  return [
    ...new Set(
      values
        .map((placement) =>
          resolveChestPlacement(placement),
        )
        .filter(
          (placement): placement is ChestPlacement => placement !== null,
        ),
    ),
  ]
}

function invalidPlacementErrors(values: readonly string[]): string[] {
  return values
    .filter((placement) => resolveChestPlacement(placement) === null)
    .map((placement) => `Unbekanntes Truhenziel oder Option: ${placement}`)
}

function resolveChestPlacement(value: string): ChestPlacement | null {
  return (
    PLACEMENT_ALIASES[value.trim().toLowerCase()] ??
    resolveTemplateTarget(value)
  )
}

export function parseTreasureChestOptions(rawSpecification: string): {
  concealment: ConcealmentMode | null
  errors: string[]
  inline: boolean
  placements: ChestPlacement[]
  valid: boolean
  visibility: CollectibleVisibilityRule
} {
  const parsed = parseCollectibleOptions(rawSpecification)
  const concealment = extractConcealmentOptions(parsed.values)
  const errors = [
    ...parsed.errors,
    ...concealment.errors,
    ...invalidPlacementErrors(concealment.values),
  ]
  const placements = readPlacements(concealment.values)
  const hasOptions = parsed.hasOptions || concealment.mode !== null
  const inline =
    rawSpecification.trim() === "" ||
    (hasOptions && concealment.values.length === 0)

  return {
    concealment: concealment.mode,
    errors,
    inline,
    placements,
    valid: errors.length === 0,
    visibility: parsed.rule,
  }
}

export function courseChestUnitCount(
  declarations: readonly CourseChestDeclaration[],
  templateAvailable: (target: TemplateTarget) => boolean = () => true,
): number {
  let total = 0
  for (const declaration of declarations) {
    const parsed = parseTreasureChestOptions(declaration.placement)
    if (!parsed.valid) continue
    total += parsed.inline
      ? 1
      : new Set(
          parsed.placements.filter(
            (placement) =>
              !isTemplateTarget(placement) || templateAvailable(placement),
          ),
        ).size
  }
  return total
}

function readHostRequest(host: HTMLElement): HostRequest {
  const baseId = resolveBaseId(host)
  const reward = readReward(host)
  const authoredPlacement = host.getAttribute("data-placement")?.trim() ?? ""
  const rawPlacement = authoredPlacement === "@0" ? "" : authoredPlacement
  const parsed = parseTreasureChestOptions(rawPlacement)

  return {
    baseId,
    concealment: parsed.concealment,
    errors: parsed.errors,
    inline: parsed.inline,
    placements: parsed.placements,
    reward,
    sourceHost: host,
    sourceSection: sectionFromLootId(baseId),
    valid: parsed.valid,
    visibility: parsed.visibility,
  }
}

function portalSignature(request: PortalRequest): string {
  return `${request.reward}:${[
    ...request.placements,
  ].sort().join(";")}:${collectibleVisibilitySignature(request.visibility)}:${request.concealment ?? "none"}`
}

function sourceMatchKey(
  section: number,
  request: PortalRequest,
): string {
  return `${section}:${portalSignature(request)}`
}

function warnInvalidSpecification(id: string, errors: readonly string[]): void {
  if (warnedInvalidSpecs.has(id)) return
  warnedInvalidSpecs.add(id)
  console.warn(
    `Loot: Fund ${id} bleibt wegen ungültiger Optionen verborgen. ${errors.join(" ")}`,
  )
}

function matchedCount(signature: string): number {
  let count = 0
  for (const matchedSignature of matchedSourceHosts.values()) {
    if (matchedSignature === signature) count += 1
  }
  return count
}

function registerDomPortal(baseId: string, request: PortalRequest): void {
  const section = request.sourceSection
  const matchKey = section === null ? null : sourceMatchKey(section, request)
  const previousMatchKey = matchedSourceHosts.get(baseId)
  if (matchKey !== null && previousMatchKey === matchKey) {
    portalRequests.delete(baseId)
    return
  }
  if (previousMatchKey) matchedSourceHosts.delete(baseId)

  const sourceCount = matchKey === null ? 0 : sourceSignatureCounts.get(matchKey) ?? 0
  if (matchKey !== null && matchedCount(matchKey) < sourceCount) {
    matchedSourceHosts.set(baseId, matchKey)
    portalRequests.delete(baseId)
    return
  }

  portalRequests.set(baseId, request)
}

function registerSourceDeclarations(
  declarations: readonly CourseChestDeclaration[],
  catalog: readonly CourseChestDeclaration[],
): void {
  for (const requestId of sourceRequestIds) portalRequests.delete(requestId)
  sourceRequestIds.clear()
  sourceSignatureCounts.clear()
  matchedSourceHosts.clear()

  for (const declaration of declarations) {
    const parsed = parseTreasureChestOptions(declaration.placement)
    if (!parsed.valid) {
      warnInvalidSpecification(declaration.baseId, parsed.errors)
      continue
    }
    const placements = new Set(parsed.placements)
    if (placements.size === 0) continue
    const request: PortalRequest = {
      concealment: parsed.concealment,
      placements,
      reward: declaration.reward,
      sourceSection: declaration.section,
      visibility: parsed.visibility,
    }
    portalRequests.set(declaration.baseId, request)
    sourceRequestIds.add(declaration.baseId)
    const signature = sourceMatchKey(declaration.section, request)
    sourceSignatureCounts.set(
      signature,
      (sourceSignatureCounts.get(signature) ?? 0) + 1,
    )
  }

  sourceDiscovery = "complete"
  controller?.catalogReady(courseChestUnitCount(catalog))
  for (const [baseId, request] of pendingPortalRequests) {
    registerDomPortal(baseId, request)
  }
  pendingPortalRequests.clear()
  scheduleSync()
}

function discoverSourcePortals(): void {
  if (sourceDiscovery !== "idle") return
  sourceDiscovery = "pending"
  void discoverCourseChests()
    .then(({ declarations, catalog }) =>
      registerSourceDeclarations(declarations, catalog),
    )
    .catch(() => registerSourceDeclarations([], []))
}

function registerHost(host: HTMLElement): HostRequest {
  const request = readHostRequest(host)

  if (!request.valid) {
    warnInvalidSpecification(request.baseId, request.errors)
    pendingPortalRequests.delete(request.baseId)
    portalRequests.delete(request.baseId)
    matchedSourceHosts.delete(request.baseId)
    setHostConcealment(host, null)
    host.classList.add("loot-treasure-host--portal-source")
    host.setAttribute("aria-hidden", "true")
    if (host.childElementCount > 0) host.replaceChildren()
  } else if (request.inline) {
    pendingPortalRequests.delete(request.baseId)
    portalRequests.delete(request.baseId)
    matchedSourceHosts.delete(request.baseId)
    host.classList.remove("loot-treasure-host--portal-source")
    if (request.concealment === null) setHostConcealment(host, null)
  } else {
    const portalRequest: PortalRequest = {
      concealment: request.concealment,
      placements: new Set(request.placements),
      reward: request.reward,
      sourceHost: request.sourceHost,
      sourceSection: request.sourceSection,
      visibility: request.visibility,
    }
    if (sourceDiscovery === "complete") {
      registerDomPortal(request.baseId, portalRequest)
    } else {
      pendingPortalRequests.set(request.baseId, portalRequest)
    }
    setHostConcealment(host, null)
    host.classList.add("loot-treasure-host--portal-source")
    host.setAttribute("aria-hidden", "true")
    if (host.childElementCount > 0) host.replaceChildren()
  }

  return request
}

function buttonIn(
  container: ParentNode,
  chestId: string,
  reward: ResourceKind,
): HTMLButtonElement | null {
  const buttons = container.querySelectorAll<HTMLButtonElement>(
    "[data-loot-chest-button]",
  )
  return (
    [...buttons].find(
      (button) =>
        button.dataset.lootChestButton === chestId &&
        button.dataset.lootChestReward === reward,
    ) ??
    null
  )
}

function portalFor(chestId: string): HTMLElement | null {
  for (const candidate of templateDocumentCandidates(document)) {
    const portals = candidate.querySelectorAll<HTMLElement>(
      `[${PORTAL_ATTRIBUTE}]`,
    )
    const portal = [...portals].find(
      (element) => element.dataset.lootChestPortal === chestId,
    )
    if (portal) return portal
  }
  return null
}

function allPortals(): HTMLElement[] {
  const portals: HTMLElement[] = []
  for (const candidate of templateDocumentCandidates(document)) {
    for (const portal of candidate.querySelectorAll<HTMLElement>(
      `[${PORTAL_ATTRIBUTE}]`,
    )) {
      if (!portals.includes(portal)) portals.push(portal)
    }
  }
  return portals
}

function syncInline(
  host: HTMLElement,
  chestId: string,
  request: HostRequest,
): void {
  if (!controller) return

  const opening = openingIds.has(chestId)
  const unavailable = controller.collected(chestId) && !opening

  if (unavailable) {
    eligibleChestIds.delete(chestId)
    visibilityGate.forget(`chest:${request.baseId}`)
    setHostConcealment(host, null)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }

  const visible = visibilityGate.visible(
    `chest:${request.baseId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    scheduleSync,
  )
  if (visible) eligibleChestIds.add(chestId)
  else eligibleChestIds.delete(chestId)

  if (!visible && !opening) {
    if (host.childElementCount > 0) host.replaceChildren()
    setHostConcealment(host, null)
    return
  }
  if (!opening && !buttonIn(host, chestId, request.reward)) {
    host.replaceChildren(createChestButton(chestId, "inline", request.reward))
  }
  setHostConcealment(host, request.concealment)
}

function portalDestination(
  placement: ChestPlacement,
  request: PortalRequest,
): PortalDestination | null {
  if (isTemplateTarget(placement)) {
    const match = findTemplateTarget(placement, "chest", document)
    if (!match) return null
    if (
      templateTargetDefinition(placement).scope === "slide" &&
      !sourceSlideIsActive(request.sourceSection, match.root)
    ) {
      return null
    }
    return {
      anchor: match.chestAnchor,
      container:
        match.chestContainer ?? match.chestAnchor.ownerDocument.body,
      grouped: Boolean(match.chestContainer),
      template: true,
      templateLayout: match.chestContainer ? "inside" : "floating",
      templatePosition: match.chestContainer
        ? null
        : (match.chestPosition ?? "overlay"),
    }
  }

  const target = document.querySelector<HTMLElement>(TARGET_SELECTORS[placement])
  return target
    ? {
        anchor: target,
        container: target,
        grouped: placement !== "toc",
        template: false,
        templateLayout: null,
        templatePosition: null,
      }
    : null
}

function setPortalStyle(
  wrapper: HTMLElement,
  property: "height" | "left" | "top" | "width",
  value: string,
): void {
  if (wrapper.style[property] !== value) wrapper.style[property] = value
}

export function templatePortalGeometry(
  rect: Pick<DOMRectReadOnly, "bottom" | "left" | "right" | "top" | "width">,
  viewportWidth: number,
  viewportHeight: number,
  position: TemplateChestPosition = "overlay",
): { height: number; left: number; top: number; width: number } {
  const width = Math.min(58, Math.max(44, rect.width))
  const height = Math.min(51, Math.max(40, width * 0.875))
  const maxLeft = Math.max(4, viewportWidth - width - 4)
  const maxTop = Math.max(4, viewportHeight - height - 4)
  const preferredLeft =
    position === "below"
      ? rect.left + (rect.width - width) / 2
      : rect.right - width - 4
  const preferredTop =
    position === "below" ? rect.bottom + 8 : rect.bottom - height - 4

  return {
    height,
    left: Math.max(4, Math.min(preferredLeft, maxLeft)),
    top: Math.max(4, Math.min(preferredTop, maxTop)),
    width,
  }
}

function positionTemplatePortal(
  wrapper: HTMLElement,
  anchor: HTMLElement,
  position: TemplateChestPosition,
): void {
  const rect = anchor.getBoundingClientRect()
  const view = anchor.ownerDocument.defaultView ?? window
  const visible =
    anchor.isConnected &&
    rect.width > 0 &&
    rect.height > 0 &&
    rect.right > 0 &&
    rect.bottom > 0 &&
    rect.left < view.innerWidth &&
    rect.top < view.innerHeight
  if (wrapper.hidden === visible) wrapper.hidden = !visible
  if (!visible) return

  const geometry = templatePortalGeometry(
    rect,
    view.innerWidth,
    view.innerHeight,
    position,
  )

  setPortalStyle(wrapper, "left", `${geometry.left}px`)
  setPortalStyle(wrapper, "top", `${geometry.top}px`)
  setPortalStyle(wrapper, "width", `${geometry.width}px`)
  setPortalStyle(wrapper, "height", `${geometry.height}px`)
}

function ensurePortalTray(
  destination: PortalDestination,
  placement: ChestPlacement,
): HTMLElement {
  const selector = `:scope > [${TRAY_ATTRIBUTE}="${placement}"]`
  const existing =
    destination.container.querySelector<HTMLElement>(selector)
  if (existing) return existing

  const ownerDocument = destination.container.ownerDocument
  const listTarget = destination.container.matches("ul, ol")
  const tray = ownerDocument.createElement(listTarget ? "li" : "div")
  tray.className = [
    "loot-chest-tray",
    destination.template
      ? "loot-chest-tray--template"
      : "loot-chest-tray--support",
  ].join(" ")
  tray.dataset.lootChestTray = placement
  tray.setAttribute("role", "group")
  tray.setAttribute("aria-label", "Versteckte Funde")
  destination.container.appendChild(tray)
  return tray
}

function portalMount(
  destination: PortalDestination,
  placement: ChestPlacement,
): HTMLElement {
  return destination.grouped
    ? ensurePortalTray(destination, placement)
    : destination.container
}

function ensurePortal(
  chestId: string,
  placement: ChestPlacement,
  request: PortalRequest,
): void {
  const destination = portalDestination(placement, request)
  let wrapper = portalFor(chestId)
  if (!destination) {
    removePortal(wrapper)
    return
  }

  if (wrapper?.dataset.lootChestReward !== request.reward) {
    removePortal(wrapper)
    wrapper = null
  }

  const mount = portalMount(destination, placement)
  if (!wrapper) {
    const ownerDocument = mount.ownerDocument
    const listTarget = !destination.template &&
      mount.matches("ul, ol")
    wrapper = ownerDocument.createElement(listTarget ? "li" : "div")
    wrapper.className = `loot-chest-placement loot-chest-placement--${placement}`
    wrapper.dataset.lootChestPortal = chestId
    wrapper.dataset.lootChestLocation = placement
    wrapper.dataset.lootChestReward = request.reward
    if (destination.template) {
      wrapper.dataset.lootChestTemplateTarget = placement
    }
    if (listTarget) {
      wrapper.classList.add("nav__item", "lia-support-menu__item")
      wrapper.setAttribute("role", "none")
    }
    wrapper.append(
      createChestButton(
        chestId,
        placement,
        request.reward,
        ownerDocument,
      ),
    )
  }

  if (wrapper.parentElement !== mount) {
    const previousParent = wrapper.parentElement
    mount.appendChild(wrapper)
    removeEmptyPortalTray(previousParent)
  }
  wrapper.classList.toggle(
    "loot-chest-placement--template",
    destination.templateLayout === "floating",
  )
  wrapper.classList.toggle(
    "loot-chest-placement--template-inside",
    destination.templateLayout === "inside",
  )
  wrapper.classList.toggle(
    "loot-chest-placement--template-below",
    destination.templateLayout === "floating" &&
      destination.templatePosition === "below",
  )
  if (destination.templatePosition) {
    wrapper.dataset.lootChestTemplatePosition = destination.templatePosition
  } else {
    delete wrapper.dataset.lootChestTemplatePosition
  }
  setHostConcealment(wrapper, request.concealment)
  if (destination.templateLayout === "floating") {
    positionTemplatePortal(
      wrapper,
      destination.anchor,
      destination.templatePosition ?? "overlay",
    )
  } else if (destination.templateLayout === "inside") {
    wrapper.hidden = false
    for (const property of ["height", "left", "top", "width"] as const) {
      setPortalStyle(wrapper, property, "")
    }
  }
}

function syncPortals(): void {
  if (!controller) return

  const activeIds = new Set<string>()
  for (const [baseId, request] of portalRequests) {
    const visible = visibilityGate.visible(
      `chest:${baseId}`,
      request.visibility,
      sourceSlideIsActive(request.sourceSection, request.sourceHost),
      scheduleSync,
    )

    for (const placement of request.placements) {
      const chestId = `${baseId}:${placement}`
      const opening = openingIds.has(chestId)
      const unavailable = controller.collected(chestId) && !opening

      if (!visible && !opening) {
        eligibleChestIds.delete(chestId)
        removePortal(portalFor(chestId))
        continue
      }

      activeIds.add(chestId)
      if (visible && !unavailable) eligibleChestIds.add(chestId)
      else eligibleChestIds.delete(chestId)

      if (unavailable) {
        removePortal(portalFor(chestId))
      } else if (!opening) {
        ensurePortal(
          chestId,
          placement,
          request,
        )
      }
    }
  }

  for (const portal of allPortals()) {
    const chestId = portal.dataset.lootChestPortal
    if (!chestId || (!activeIds.has(chestId) && !openingIds.has(chestId))) {
      removePortal(portal)
    }
  }
}

function syncAll(): void {
  if (!controller) return

  eligibleChestIds.clear()
  const hosts = document.querySelectorAll<HTMLElement>(CHEST_TAG)
  for (const host of hosts) {
    const request = registerHost(host)
    if (request.valid && request.inline) {
      syncInline(host, `${request.baseId}:inline`, request)
    }
  }

  syncPortals()
}

function scheduleSync(): void {
  if (syncTimer !== null) return

  syncTimer = window.setTimeout(() => {
    syncTimer = null
    syncAll()
  }, 0)
}

function observedDocumentMutations(mutations: MutationRecord[]): void {
  const needsSync = mutations.some((mutation) => {
    const target = mutation.target as Node & { nodeType?: number }
    if (target.nodeType !== 1) return true
    const element = target as unknown as Element
    return !element.closest(`${CHEST_TAG}, [${PORTAL_ATTRIBUTE}]`)
  })
  if (needsSync) scheduleSync()
}

class LootTreasureChestElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-chest-id", "data-placement", "data-reward"]
  }

  connectedCallback(): void {
    registerHost(this)
    scheduleSync()
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return
    eligibleChestIds.clear()
    registerHost(this)
    scheduleSync()
  }
}

export function refreshTreasureChests(): void {
  syncAll()
}

export function installTreasureChests(
  nextController: TreasureChestController,
): void {
  controller = nextController
  document.getElementById(LEGACY_CHEST_ID)?.remove()
  discoverSourcePortals()

  if (!slideActivityInstalled) {
    slideActivityInstalled = true
    observeLiaSlideActivity(() => {
      eligibleChestIds.clear()
      scheduleSync()
      for (const delay of [80, 250, 650]) {
        window.setTimeout(scheduleSync, delay)
      }
    })
  }

  if (!customElements.get(CHEST_TAG)) {
    customElements.define(CHEST_TAG, LootTreasureChestElement)
  }

  if (observers.length === 0) {
    for (const candidate of templateDocumentCandidates(document)) {
      const Observer = candidate.defaultView?.MutationObserver ?? MutationObserver
      const candidateObserver = new Observer(observedDocumentMutations)
      candidateObserver.observe(candidate.documentElement, {
        attributeFilter: [
          "aria-hidden",
          "aria-pressed",
          "class",
          "data-active",
          "data-open",
          "hidden",
          "style",
        ],
        attributes: true,
        childList: true,
        subtree: true,
      })
      observers.push(candidateObserver)
    }
  }

  if (!viewportListenersInstalled) {
    viewportListenersInstalled = true
    const views = new Set<Window>()
    for (const candidate of templateDocumentCandidates(document)) {
      const view = candidate.defaultView
      if (!view || views.has(view)) continue
      views.add(view)
      view.addEventListener("resize", scheduleSync, { passive: true })
      view.addEventListener("scroll", scheduleSync, {
        capture: true,
        passive: true,
      })
      view.visualViewport?.addEventListener("resize", scheduleSync, {
        passive: true,
      })
      view.visualViewport?.addEventListener("scroll", scheduleSync, {
        passive: true,
      })
    }
  }

  refreshTreasureChests()
}
