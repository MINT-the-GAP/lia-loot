import {
  CollectibleVisibilityGate,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  setHostConcealment,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  parseExplorationOptions,
  type RevealLayerOption,
} from "./exploration-options.ts"
import {
  clearHostRevealLayers,
  hostIsRevealBlocked,
  REVEAL_CHANGED_EVENT,
  setHostRevealLayers,
} from "./exploration.ts"
import { createFlashlightGraphic } from "./flashlight-visual.ts"
import { normalizeHiddenMacroArgumentText } from "./hidden-arguments.ts"
import { magnifierIntersectsRect } from "./magnifier-geometry.ts"
import { setRangeGate } from "./range-gate.ts"
import {
  announceResource,
  installResourceBar,
  refreshResourceBarVisibility,
} from "./resource-bar.ts"
import {
  liaSlideIsAccessible,
  observeLiaSlideActivity,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"
import { templateDocumentCandidates } from "./template-targets.ts"
const FLASHLIGHT_TAG = "lia-loot-flashlight"
const FOG_TAG = "lia-loot-fog"
const FOG_START_TAG = "lia-loot-fog-start"
const FOG_END_TAG = "lia-loot-fog-end"
const FOG_RENDERER_ATTRIBUTE = "data-loot-fog-renderer"
const FOG_RENDERER_ORIGIN_ATTRIBUTE = `${FOG_RENDERER_ATTRIBUTE}-origin`
const FOG_PRESENTATION_ATTRIBUTE = "data-loot-fog-presentation"
const FLASHLIGHT_TOOL_ID = "lia-loot-flashlight-tool"
const FLASHLIGHT_BEAM_ID = "lia-loot-flashlight-beam"
const FOG_GATE = "fog"
const FOG_BLOCKED_ATTRIBUTE = "data-loot-fog-blocked"
const DIRECT_FOG_ATTRIBUTE = "data-loot-fog-direct"
const COLLECT_DURATION = 650
const TOUCH_BEAM_MARGIN = 8
const TOUCH_PAN_STEP = 12
const FOG_RANGE_PADDING_X = 8
const FOG_RANGE_PADDING_Y = 0
const FOG_EFFECT_MARGIN = 20
const FOG_COMPONENT_MIN_REACH = 18
const FOG_COMPONENT_MAX_REACH_X = 48
const FOG_COMPONENT_MAX_REACH_Y = 56
export const FLASHLIGHT_RADIUS = 92

const FOG_OVERLAY_SURFACE_SELECTOR = [
  "[data-loot-reveal-payload]",
  "[data-loot-reveal-layer-content]",
  "main.lia-slide__content",
  ".lia-slide__footer",
  ".lia-header",
  "#lia-toc",
  "header",
  "footer",
  "nav",
  "[role='banner']",
  "[role='navigation']",
  "[role='contentinfo']",
  "main",
].join(", ")

interface FlashlightController {
  collected(): boolean
  collect(): boolean
  radius?(): number
}

interface FlashlightRequest {
  concealment: ConcealmentMode | null
  errors: string[]
  layers: RevealLayerOption[]
  sourceSection: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

interface PointerPosition {
  x: number
  y: number
}

interface FogRange {
  start: HTMLElement
  units: HTMLElement[]
}

interface FogCollection {
  rangeTargets: Set<HTMLElement>
  ranges: FogRange[]
  targets: Set<HTMLElement>
}

interface FogRect {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

interface FogLayout {
  bounds: FogRect
  clouds: FogRect[]
  presentation: "item" | "line" | "range"
}

interface FogPuffSpec {
  connector: boolean
  height: number
  left: number
  opacity: number
  rotation: number
  top: number
  width: number
}

interface TouchPanGesture {
  origin: PointerPosition
  pointerId: number
  start: PointerPosition
}

let controller: FlashlightController | null = null
let runtimeId = 0
let flashlightActive = false
let pointing = false
let touchMode = false
let touchPanGesture: TouchPanGesture | null = null
let lastPrimaryPointerType = ""
let lastPointer: PointerPosition | null = null
let pendingPointer: PointerPosition | null = null
let pointerFrame: number | null = null
let fogLayoutFrame: number | null = null
let runtimeSyncQueued = false
let observersInstalled = false
const collectingIds = new Set<string>()
const eligibleFlashlightIds = new Set<string>()
const boundPickupButtons = new WeakSet<HTMLButtonElement>()
const boundPanHandles = new WeakSet<HTMLButtonElement>()
const warnedInvalidSpecs = new Set<string>()
const fogTargets = new Set<HTMLElement>()
const fogRangeOverlays = new Set<HTMLDivElement>()
const fogOverlayByStart = new WeakMap<HTMLElement, HTMLDivElement>()
const visibilityGate = new CollectibleVisibilityGate()

function currentFlashlightRadius(): number {
  const radius = controller?.radius?.() ?? FLASHLIGHT_RADIUS
  return Number.isFinite(radius) && radius > 0 ? radius : FLASHLIGHT_RADIUS
}

function resolveFlashlightId(host: HTMLElement): string {
  const authoredId = host.getAttribute("data-flashlight-id")?.trim()
  if (authoredId && !authoredId.startsWith("@")) {
    return `flashlight:${authoredId}:inline`
  }
  const existingId = host.dataset.lootFlashlightRuntimeId
  if (existingId) return existingId
  runtimeId += 1
  const generatedId = `flashlight:runtime-${runtimeId}:inline`
  host.dataset.lootFlashlightRuntimeId = generatedId
  return generatedId
}

function normalizeMacroPlaceholder(value: string): string {
  return /^@\d+$/u.test(value) ? "" : value
}

function readFlashlightRequest(
  host: HTMLElement,
  flashlightId: string,
): FlashlightRequest {
  const authored = normalizeMacroPlaceholder(
    host.getAttribute("data-options")?.trim() ?? "",
  )
  const parsed = parseCollectibleOptions(authored)
  const exploration = parseExplorationOptions(parsed.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const errors = [...parsed.errors, ...concealment.errors]
  if (concealment.values.length > 0) {
    errors.push(
      `Unbekannte Taschenlampenoption: ${concealment.values.join("; ")}`,
    )
  }
  return {
    concealment: concealment.mode,
    errors,
    layers: exploration.layers,
    sourceSection: sectionFromLootId(flashlightId),
    valid: errors.length === 0,
    visibility: parsed.rule,
  }
}

function warnInvalidSpecification(
  flashlightId: string,
  errors: readonly string[],
): void {
  if (warnedInvalidSpecs.has(flashlightId)) return
  warnedInvalidSpecs.add(flashlightId)
  console.warn(
    `Loot: Taschenlampe ${flashlightId} bleibt wegen ungültiger Optionen verborgen. ${errors.join(" ")}`,
  )
}

function rewardBadge(): HTMLSpanElement {
  const reward = document.createElement("span")
  reward.className = "loot-flashlight-pickup__reward"
  reward.setAttribute("aria-hidden", "true")
  reward.textContent = "GEFUNDEN"
  return reward
}

function pickupButtonFromEvent(event: MouseEvent): HTMLButtonElement | null {
  for (const candidate of event.composedPath()) {
    if (
      candidate instanceof HTMLButtonElement &&
      candidate.hasAttribute("data-loot-flashlight-button")
    ) {
      return candidate
    }
  }
  return event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>(
        "[data-loot-flashlight-button]",
      )
    : null
}

function handlePickupClick(event: MouseEvent): void {
  const button = pickupButtonFromEvent(event)
  const flashlightId = button?.dataset.lootFlashlightButton
  if (
    !button ||
    !flashlightId ||
    !controller ||
    collectingIds.has(flashlightId) ||
    !eligibleFlashlightIds.has(flashlightId)
  ) {
    return
  }
  collectingIds.add(flashlightId)
  if (!controller.collect()) {
    collectingIds.delete(flashlightId)
    syncAllFlashlights()
    return
  }

  const keyboardActivated = event.detail === 0
  button.disabled = true
  button.classList.add("loot-flashlight-pickup--collected")
  button.setAttribute("aria-label", "Taschenlampe gefunden")
  renderFlashlightTool()
  announceResource(
    "Taschenlampe gefunden. Du kannst sie jetzt in der Leiste aktivieren.",
  )
  syncAllFlashlights()

  window.setTimeout(() => {
    collectingIds.delete(flashlightId)
    button.remove()
    syncAllFlashlights()
    if (keyboardActivated) focusFlashlightTool()
  }, COLLECT_DURATION)
}

function bindPickupButton(button: HTMLButtonElement): void {
  if (boundPickupButtons.has(button)) return
  boundPickupButtons.add(button)
  button.addEventListener("click", handlePickupClick)
}

function createPickupButton(flashlightId: string): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-flashlight-pickup"
  button.dataset.lootFlashlightButton = flashlightId
  button.setAttribute("aria-label", "Taschenlampe einsammeln")
  button.append(createFlashlightGraphic(), rewardBadge())
  bindPickupButton(button)
  return button
}

function syncFlashlight(host: HTMLElement): void {
  if (!controller) return
  const flashlightId = resolveFlashlightId(host)
  if (controller.collected() && !collectingIds.has(flashlightId)) {
    eligibleFlashlightIds.delete(flashlightId)
    visibilityGate.forget(`flashlight:${flashlightId}`)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }

  const request = readFlashlightRequest(host, flashlightId)
  if (!request.valid) {
    eligibleFlashlightIds.delete(flashlightId)
    warnInvalidSpecification(flashlightId, request.errors)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }
  if (hostIsRevealBlocked(host, false)) {
    eligibleFlashlightIds.delete(flashlightId)
    host.hidden = true
    return
  }
  if (!liaSlideIsAccessible(request.sourceSection)) {
    eligibleFlashlightIds.delete(flashlightId)
    clearHostRevealLayers(host)
    host.hidden = true
    return
  }

  const visible = visibilityGate.visible(
    `flashlight:${flashlightId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    syncAllFlashlights,
  )
  if (!visible) {
    eligibleFlashlightIds.delete(flashlightId)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }
  host.hidden = false

  const contentHost = setHostRevealLayers(host, flashlightId, request.layers)
  const existing = [
    ...contentHost.querySelectorAll<HTMLButtonElement>(
      "[data-loot-flashlight-button]",
    ),
  ].find(
    (candidate) => candidate.dataset.lootFlashlightButton === flashlightId,
  )
  if (!existing) {
    setHostConcealment(contentHost, null)
    contentHost.replaceChildren(createPickupButton(flashlightId))
  } else {
    bindPickupButton(existing)
  }
  setHostConcealment(contentHost, request.concealment)
  if (!hostIsRevealBlocked(host)) eligibleFlashlightIds.add(flashlightId)
  else eligibleFlashlightIds.delete(flashlightId)
}

function syncAllFlashlights(): void {
  eligibleFlashlightIds.clear()
  document.querySelectorAll<HTMLElement>(FLASHLIGHT_TAG).forEach(syncFlashlight)
}

function markerBoundary(marker: HTMLElement): ChildNode {
  let boundary: ChildNode = marker
  while (boundary.parentElement) {
    const parent = boundary.parentElement
    const emptyWrapper =
      parent.tagName === "DIV" && parent.attributes.length === 0
    if (
      parent.tagName !== "P" &&
      parent.tagName !== "SPAN" &&
      parent.tagName !== "LIA-KEEP" &&
      !emptyWrapper
    ) {
      break
    }
    const otherContent = [...parent.childNodes].some(
      (node) =>
        node !== boundary &&
        node.nodeType !== Node.COMMENT_NODE &&
        (node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())),
    )
    if (otherContent) break
    boundary = parent
  }
  return boundary
}

function fogScope(marker: HTMLElement): HTMLElement {
  return (
    marker.closest<HTMLElement>(
      "[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main",
    ) ?? document.body
  )
}

function rangeUnits(
  scope: HTMLElement,
  start: HTMLElement,
  end: HTMLElement,
): HTMLElement[] {
  const startBoundary = markerBoundary(start)
  const endBoundary = markerBoundary(end)
  if (!startBoundary.isConnected || !endBoundary.isConnected) return []

  const range = scope.ownerDocument.createRange()
  try {
    range.setStartAfter(startBoundary)
    range.setEndBefore(endBoundary)
  } catch {
    return []
  }
  const units: HTMLElement[] = []
  const collect = (parent: HTMLElement): void => {
    for (const child of [...parent.children] as HTMLElement[]) {
      if (!range.intersectsNode(child)) continue
      let contained = false
      try {
        contained =
          range.comparePoint(child, 0) === 0 &&
          range.comparePoint(child, child.childNodes.length) === 0
      } catch {
        contained = false
      }
      if (contained) units.push(child)
      else collect(child)
    }
  }
  collect(scope)
  return units
}

function fogTargetIsRendered(target: HTMLElement): boolean {
  if (!target.isConnected || target.getClientRects().length === 0) return false
  const rect = target.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return false
  let ancestor = target.parentElement
  while (ancestor) {
    if (
      ancestor.hidden ||
      ancestor.getAttribute("aria-hidden") === "true" ||
      (ancestor.inert && !ancestor.classList.contains("loot-fog-target"))
    ) {
      return false
    }
    ancestor = ancestor.parentElement
  }
  return true
}

function applyFogTarget(
  target: HTMLElement,
  position: PointerPosition | null,
  belongsToRange: boolean,
): void {
  const rect = target.getBoundingClientRect()
  target.classList.add("loot-fog-target")
  target.classList.toggle("loot-fog-target--range", belongsToRange)
  target.dataset.lootFogReady = "true"
  target.style.setProperty(
    "--loot-flashlight-radius",
    `${currentFlashlightRadius()}px`,
  )
  target.style.setProperty("--loot-flashlight-x", `${(position?.x ?? -9999) - rect.left}px`)
  target.style.setProperty("--loot-flashlight-y", `${(position?.y ?? -9999) - rect.top}px`)
  const hitRects =
    belongsToRange && !target.hasAttribute(FOG_PRESENTATION_ATTRIBUTE)
      ? fogUnitRects(target)
      : [rect]
  const illuminated = Boolean(
    position &&
      flashlightActive &&
      pointing &&
      fogTargetIsRendered(target) &&
      hitRects.some((hitRect) =>
        magnifierIntersectsRect(
          position.x,
          position.y,
          hitRect,
          currentFlashlightRadius(),
        ),
      ),
  )
  target.classList.toggle("loot-fog-target--under-beam", illuminated)
  setRangeGate(target, FOG_GATE, FOG_BLOCKED_ATTRIBUTE, !illuminated)
}

function releaseFogTarget(target: HTMLElement): void {
  setRangeGate(target, FOG_GATE, FOG_BLOCKED_ATTRIBUTE, false)
  target.classList.remove(
    "loot-fog-target",
    "loot-fog-target--range",
    "loot-fog-target--under-beam",
  )
  delete target.dataset.lootFogReady
  target.style.removeProperty("--loot-flashlight-x")
  target.style.removeProperty("--loot-flashlight-y")
}

function normalizeFogArguments(host: HTMLElement): void {
  const pending: Node[] = [...host.childNodes]
  while (pending.length > 0) {
    const node = pending.pop()
    if (!node) continue
    if (node.nodeType === 3 && node.nodeValue !== null) {
      const normalized = normalizeHiddenMacroArgumentText(node.nodeValue)
      if (normalized !== node.nodeValue) node.nodeValue = normalized
      continue
    }
    pending.push(...node.childNodes)
  }
}

function removeDuplicateFogPayloads(host: HTMLElement): void {
  const identities = new Set<string>()
  const nestedLootElements = [...host.querySelectorAll<HTMLElement>("*")].filter(
    (element) => element.localName.startsWith("lia-loot-"),
  )
  nestedLootElements.forEach((element) => {
    const identityAttribute = [...element.attributes].find(
      (attribute) =>
        /^data-[\w-]+-id$/u.test(attribute.name) &&
        Boolean(attribute.value.trim()) &&
        !attribute.value.includes("@"),
    )
    if (!identityAttribute) return
    const identity = `${element.localName}:${identityAttribute.name}:${identityAttribute.value}`
    if (!identities.has(identity)) {
      identities.add(identity)
      return
    }

    let branch: Node = element
    while (branch.parentNode && branch.parentNode !== host) {
      branch = branch.parentNode
    }
    if (branch.parentNode !== host) return
    const separator = branch.previousSibling
    host.removeChild(branch)
    if (separator?.textContent?.trim() === ",") {
      separator.parentNode?.removeChild(separator)
    }
  })
}

function removeFogRendererArtifacts(host: HTMLElement): void {
  const wrapperTagArtifact = /`?\s*<\/?lia-keep\s*>\s*`?/giu
  const standaloneBacktickArtifact = /^\s*`\s*$/u
  const textNodes: Text[] = []
  const walker = host.ownerDocument.createTreeWalker(
    host,
    NodeFilter.SHOW_TEXT,
  )
  let current = walker.nextNode()
  while (current) {
    if (current instanceof Text) textNodes.push(current)
    current = walker.nextNode()
  }

  textNodes.forEach((node) => {
    const value = node.nodeValue ?? ""
    const cleaned = value.replace(wrapperTagArtifact, "")
    if (cleaned === value && !standaloneBacktickArtifact.test(cleaned)) return
    if (!cleaned.trim() || standaloneBacktickArtifact.test(cleaned)) {
      node.parentNode?.removeChild(node)
      return
    }
    node.nodeValue = cleaned
  })
}

function retireFogRenderer(renderer: HTMLElement, fogId: string): void {
  renderer.setAttribute(FOG_RENDERER_ORIGIN_ATTRIBUTE, fogId)
  renderer.removeAttribute(FOG_RENDERER_ATTRIBUTE)
  if (renderer.childNodes.length > 0) renderer.replaceChildren()
  renderer.hidden = true
  renderer.inert = true
  renderer.setAttribute("aria-hidden", "true")
  renderer.style.setProperty("display", "none", "important")
}

function renderFogMacroContent(host: HTMLElement): void {
  const fogId = host.getAttribute("data-fog-id")?.trim()
  if (!fogId) return
  const renderer = [
    ...host.ownerDocument.querySelectorAll<HTMLElement>(
      `[${FOG_RENDERER_ATTRIBUTE}], [${FOG_RENDERER_ORIGIN_ATTRIBUTE}]`,
    ),
  ].find(
    (candidate) =>
      candidate.getAttribute(FOG_RENDERER_ATTRIBUTE) === fogId ||
      candidate.getAttribute(FOG_RENDERER_ORIGIN_ATTRIBUTE) === fogId,
  )
  if (host.hasAttribute("data-loot-fog-rendered")) {
    removeFogRendererArtifacts(host)
    removeDuplicateFogPayloads(host)
    if (renderer) retireFogRenderer(renderer, fogId)
    return
  }
  const output = renderer?.querySelector<HTMLElement>("output > span")
  if (!renderer || !output) return

  const meaningfulChildren = [...output.childNodes].filter(
    (node) => node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim()),
  )
  const onlyChild = meaningfulChildren.length === 1 ? meaningfulChildren[0] : null
  const contentRoot =
    onlyChild instanceof HTMLElement &&
    onlyChild.tagName === "DIV" &&
    onlyChild.attributes.length === 0
      ? onlyChild
      : output
  host.replaceChildren(...contentRoot.childNodes)
  removeFogRendererArtifacts(host)
  removeDuplicateFogPayloads(host)
  host.setAttribute("data-loot-fog-rendered", "true")
  retireFogRenderer(renderer, fogId)
}

export function setHostFog(host: HTMLElement, fogId: string | null): void {
  const normalizedId = fogId?.trim() ?? ""
  if (normalizedId) {
    if (host.getAttribute(DIRECT_FOG_ATTRIBUTE) === normalizedId) return
    host.setAttribute(DIRECT_FOG_ATTRIBUTE, normalizedId)
  } else {
    if (!host.hasAttribute(DIRECT_FOG_ATTRIBUTE)) return
    host.removeAttribute(DIRECT_FOG_ATTRIBUTE)
  }
  scheduleFogLayoutSync()
}

export function clearHostFog(host: HTMLElement): void {
  const directTargets = [
    ...(host.matches(`[${DIRECT_FOG_ATTRIBUTE}]`) ? [host] : []),
    ...host.querySelectorAll<HTMLElement>(`[${DIRECT_FOG_ATTRIBUTE}]`),
  ]
  if (directTargets.length === 0) return
  directTargets.forEach((target) =>
    target.removeAttribute(DIRECT_FOG_ATTRIBUTE),
  )
  scheduleFogLayoutSync()
}

function collectFogTargets(): FogCollection {
  const targets = new Set<HTMLElement>()
  const rangeTargets = new Set<HTMLElement>()
  const ranges: FogRange[] = []
  const directHosts = new Set<HTMLElement>()
  const candidateDocuments = templateDocumentCandidates(document)
  candidateDocuments.forEach((candidateDocument) => {
    candidateDocument.querySelectorAll<HTMLElement>(FOG_TAG).forEach((host) => {
      renderFogMacroContent(host)
      normalizeFogArguments(host)
      targets.add(host)
      directHosts.add(host)
    })
    candidateDocument
      .querySelectorAll<HTMLElement>(`[${DIRECT_FOG_ATTRIBUTE}]`)
      .forEach((host) => {
        targets.add(host)
        directHosts.add(host)
      })
  })

  const markersByScope = new Map<HTMLElement, HTMLElement[]>()
  candidateDocuments.forEach((candidateDocument) => {
    candidateDocument
      .querySelectorAll<HTMLElement>(`${FOG_START_TAG}, ${FOG_END_TAG}`)
      .forEach((marker) => {
        const scope = fogScope(marker)
        const markers = markersByScope.get(scope) ?? []
        markers.push(marker)
        markersByScope.set(scope, markers)
      })
  })
  for (const [scope, markers] of markersByScope) {
    const starts: HTMLElement[] = []
    for (const marker of markers) {
      if (marker.matches(FOG_START_TAG)) {
        starts.push(marker)
        continue
      }
      const start = starts.pop()
      if (!start) continue
      const units = rangeUnits(scope, start, marker)
      if (units.length === 0) continue
      units.forEach((unit) => {
        targets.add(unit)
        rangeTargets.add(unit)
      })
      ranges.push({ start, units })
    }
  }
  directHosts.forEach((host) => {
    if (rangeTargets.has(host)) return
    rangeTargets.add(host)
    ranges.push({ start: host, units: [host] })
  })
  return { rangeTargets, ranges, targets }
}

function fogRect(rect: DOMRect): FogRect | null {
  if (rect.width <= 0 || rect.height <= 0) return null
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
  }
}

function fogUnitRects(unit: HTMLElement): FogRect[] {
  if (!fogTargetIsRendered(unit)) return []
  const usesElementBox = unit.matches(
    "button, input, textarea, select, option, img, svg, canvas, video, audio, iframe, table, [role='button'], [role='img']",
  )
  if (!usesElementBox) {
    const range = unit.ownerDocument.createRange()
    range.selectNodeContents(unit)
    const contentRects = [...range.getClientRects()]
      .map(fogRect)
      .filter((rect): rect is FogRect => rect !== null)
    if (contentRects.length > 0) return contentRects
  }
  return [...unit.getClientRects()]
    .map(fogRect)
    .filter((rect): rect is FogRect => rect !== null)
}

function paddedFogRect(rect: FogRect): FogRect {
  const left = rect.left - FOG_RANGE_PADDING_X
  const top = rect.top - FOG_RANGE_PADDING_Y
  const right = rect.right + FOG_RANGE_PADDING_X
  const bottom = rect.bottom + FOG_RANGE_PADDING_Y
  return {
    bottom,
    height: bottom - top,
    left,
    right,
    top,
    width: right - left,
  }
}

function fogRectWithMinimumSize(
  rect: FogRect,
  minimumWidth: number,
  minimumHeight: number,
): FogRect {
  const width = Math.max(rect.width, minimumWidth)
  const height = Math.max(rect.height, minimumHeight)
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const left = centerX - width / 2
  const top = centerY - height / 2
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
  }
}

function fogIntervalGap(
  firstStart: number,
  firstEnd: number,
  secondStart: number,
  secondEnd: number,
): number {
  if (firstEnd < secondStart) return secondStart - firstEnd
  if (secondEnd < firstStart) return firstStart - secondEnd
  return 0
}

function fogRectsConnect(first: FogRect, second: FogRect): boolean {
  const gapX = fogIntervalGap(first.left, first.right, second.left, second.right)
  const gapY = fogIntervalGap(first.top, first.bottom, second.top, second.bottom)
  const minimumHeight = Math.min(first.height, second.height)
  const reachX = Math.min(
    FOG_COMPONENT_MAX_REACH_X,
    Math.max(FOG_COMPONENT_MIN_REACH, minimumHeight * 1.25),
  )
  const reachY = Math.min(
    FOG_COMPONENT_MAX_REACH_Y,
    Math.max(FOG_COMPONENT_MIN_REACH, minimumHeight * 2),
  )
  return gapX <= reachX && gapY <= reachY
}

function fogConnectedComponents(rects: readonly FogRect[]): FogRect[] {
  const parents = rects.map((_, index) => index)
  const find = (index: number): number => {
    let root = index
    while (parents[root] !== root) root = parents[root] ?? root
    while (parents[index] !== index) {
      const parent = parents[index] ?? index
      parents[index] = root
      index = parent
    }
    return root
  }
  const union = (first: number, second: number): void => {
    const firstRoot = find(first)
    const secondRoot = find(second)
    if (firstRoot !== secondRoot) parents[secondRoot] = firstRoot
  }
  for (let first = 0; first < rects.length; first += 1) {
    for (let second = first + 1; second < rects.length; second += 1) {
      const firstRect = rects[first]
      const secondRect = rects[second]
      if (firstRect && secondRect && fogRectsConnect(firstRect, secondRect)) {
        union(first, second)
      }
    }
  }

  const bounds = new Map<number, FogRect>()
  rects.forEach((rect, index) => {
    const root = find(index)
    const current = bounds.get(root)
    if (!current) {
      bounds.set(root, { ...rect })
      return
    }
    current.left = Math.min(current.left, rect.left)
    current.top = Math.min(current.top, rect.top)
    current.right = Math.max(current.right, rect.right)
    current.bottom = Math.max(current.bottom, rect.bottom)
    current.width = current.right - current.left
    current.height = current.bottom - current.top
  })
  return [...bounds.values()]
}

function fogRangePresentation(range: FogRange): FogLayout["presentation"] {
  const directHost =
    range.units.length === 1 &&
    range.units[0] === range.start &&
    (range.start.matches(FOG_TAG) || range.start.hasAttribute(DIRECT_FOG_ATTRIBUTE))
  if (!directHost) {
    if (range.start.hasAttribute(FOG_PRESENTATION_ATTRIBUTE)) {
      range.start.removeAttribute(FOG_PRESENTATION_ATTRIBUTE)
    }
    return "range"
  }
  const containsItem = Boolean(
    range.start.querySelector(
      "lia-loot-chest, lia-loot-key, lia-loot-puzzle-piece, lia-loot-reveal, button, [role='button'], img, svg, canvas",
    ),
  )
  const presentation = containsItem ? "item" : "line"
  if (range.start.getAttribute(FOG_PRESENTATION_ATTRIBUTE) !== presentation) {
    range.start.setAttribute(FOG_PRESENTATION_ATTRIBUTE, presentation)
  }
  return presentation
}

function fogRangeLayout(range: FogRange): FogLayout | null {
  const presentation = fogRangePresentation(range)
  const minimumWidth = presentation === "item" ? 140 : presentation === "line" ? 96 : 0
  const minimumHeight = presentation === "item" ? 96 : presentation === "line" ? 64 : 0
  const clouds = fogConnectedComponents(
    range.units
      .flatMap(fogUnitRects)
      .map(paddedFogRect)
      .map((rect) => fogRectWithMinimumSize(rect, minimumWidth, minimumHeight)),
  )
  if (clouds.length === 0) return null
  let left = Number.POSITIVE_INFINITY
  let top = Number.POSITIVE_INFINITY
  let right = Number.NEGATIVE_INFINITY
  let bottom = Number.NEGATIVE_INFINITY
  for (const cloud of clouds) {
    left = Math.min(left, cloud.left)
    top = Math.min(top, cloud.top)
    right = Math.max(right, cloud.right)
    bottom = Math.max(bottom, cloud.bottom)
  }
  if (![left, top, right, bottom].every(Number.isFinite)) return null
  left -= FOG_EFFECT_MARGIN
  top -= FOG_EFFECT_MARGIN
  right += FOG_EFFECT_MARGIN
  bottom += FOG_EFFECT_MARGIN
  return {
    bounds: {
      bottom,
      height: bottom - top,
      left,
      right,
      top,
      width: right - left,
    },
    clouds,
    presentation,
  }
}

function fogPuffSpecs(
  width: number,
  height: number,
  presentation: FogLayout["presentation"],
): FogPuffSpec[] {
  const inset = Math.min(4, width * 0.04, height * 0.08)
  const availableWidth = Math.max(1, width - inset * 2)
  const availableHeight = Math.max(1, height - inset * 2)
  const usesSingleCloudRow = availableHeight < 140
  const puffHeight = Math.min(
    availableHeight,
    usesSingleCloudRow
      ? availableHeight * 0.94
      : Math.max(76, Math.min(118, availableHeight * 0.48)),
  )
  const puffWidth = Math.min(
    availableWidth,
    Math.max(64, puffHeight * (presentation === "line" ? 2.05 : 1.55)),
  )
  const columns =
    presentation === "item"
      ? 1
      : Math.max(
          1,
          Math.ceil(
            Math.max(0, availableWidth - puffWidth) /
              Math.max(1, puffWidth * (presentation === "line" ? 0.66 : 0.46)),
          ) + 1,
        )
  const rows = usesSingleCloudRow
    ? 1
    : Math.max(
        2,
        Math.ceil(
          Math.max(0, availableHeight - puffHeight) /
            Math.max(1, puffHeight * 0.42),
        ) + 1,
      )
  const specs: FogPuffSpec[] = []
  for (let row = 0; row < rows; row += 1) {
    const rowSpecs: FogPuffSpec[] = []
    for (let column = 0; column < columns; column += 1) {
      const variant = (row * 3 + column * 2) % 5
      const widthScale = [0.84, 0.96, 1.08, 0.9, 1.02][variant] ?? 1
      const heightScale = [0.88, 1, 0.93, 0.9, 0.97][variant] ?? 1
      const reinforcesEdge =
        presentation === "range" &&
        (column <= 1 || column >= columns - 2)
      const currentWidth = Math.min(availableWidth, puffWidth * widthScale)
      const currentHeight = Math.min(
        availableHeight,
        puffHeight * (reinforcesEdge ? Math.max(1, heightScale) : heightScale),
      )
      const baseHorizontalProgress =
        columns === 1 ? 0.5 : column / (columns - 1)
      const horizontalJitter =
        columns <= 2 || column === 0 || column === columns - 1
          ? 0
          : (((row * 11 + column * 13) % 7) - 3) / (columns * 18)
      const horizontalProgress = Math.max(
        0,
        Math.min(
          1,
          baseHorizontalProgress + horizontalJitter + (row % 2 === 1 ? 0.012 : 0),
        ),
      )
      const verticalProgress = rows === 1 ? 0.5 : row / (rows - 1)
      const spec: FogPuffSpec = {
        connector: false,
        height: currentHeight,
        left:
          inset +
          Math.max(0, availableWidth - currentWidth) * horizontalProgress,
        opacity: [0.84, 0.9, 0.94, 0.87, 0.92][variant] ?? 0.9,
        rotation: [-2.4, 1.6, -0.7, 2.2, 0.5][variant] ?? 0,
        top:
          inset +
          Math.max(0, availableHeight - currentHeight) * verticalProgress,
        width: currentWidth,
      }
      rowSpecs.push(spec)
      specs.push(spec)
    }
    if (presentation === "item") continue
    for (let column = 0; column < rowSpecs.length - 1; column += 1) {
      const first = rowSpecs[column]
      const second = rowSpecs[column + 1]
      if (!first || !second) continue
      const centerX =
        (first.left + first.width / 2 + second.left + second.width / 2) / 2
      const centerY =
        (first.top + first.height / 2 + second.top + second.height / 2) / 2
      const connectorWidth = Math.min(
        availableWidth,
        puffWidth * (presentation === "line" ? 0.76 : 0.68),
      )
      const connectorHeight = Math.min(availableHeight, puffHeight * 0.72)
      specs.push({
        connector: true,
        height: connectorHeight,
        left: Math.max(
          inset,
          Math.min(
            inset + availableWidth - connectorWidth,
            centerX - connectorWidth / 2,
          ),
        ),
        opacity: 0.86,
        rotation: ((row * 5 + column * 3) % 5) - 2,
        top: Math.max(
          inset,
          Math.min(
            inset + availableHeight - connectorHeight,
            centerY - connectorHeight / 2,
          ),
        ),
        width: connectorWidth,
      })
    }
  }
  return specs
}

function syncFogClouds(overlay: HTMLDivElement, layout: FogLayout): void {
  const existing = [
    ...overlay.querySelectorAll<HTMLDivElement>(":scope > .loot-fog-cloud"),
  ]
  layout.clouds.forEach((rect, index) => {
    const cloud = existing[index] ?? overlay.ownerDocument.createElement("div")
    cloud.className = "loot-fog-cloud"
    cloud.setAttribute("aria-hidden", "true")
    cloud.style.left = `${rect.left - layout.bounds.left}px`
    cloud.style.top = `${rect.top - layout.bounds.top}px`
    cloud.style.width = `${rect.width}px`
    cloud.style.height = `${rect.height}px`
    const existingPuffs = [
      ...cloud.querySelectorAll<HTMLSpanElement>(
        ":scope > .loot-fog-cloud__puff",
      ),
    ]
    const puffSpecs = fogPuffSpecs(rect.width, rect.height, layout.presentation)
    puffSpecs.forEach((spec, puffIndex) => {
      const puff =
        existingPuffs[puffIndex] ?? overlay.ownerDocument.createElement("span")
      const spriteSequence =
        layout.presentation === "item"
          ? [2, 3, 0, 1]
          : layout.presentation === "line"
            ? [1]
            : [0, 3, 1, 2]
      const connectorSequence = layout.presentation === "line" ? [2, 3] : [1, 2, 3]
      const spriteVariant = spec.connector
        ? (connectorSequence[puffIndex % connectorSequence.length] ?? 2)
        : (spriteSequence[puffIndex % spriteSequence.length] ?? 0)
      puff.className =
        "loot-fog-cloud__puff loot-fog-cloud__puff--body " +
        `loot-fog-cloud__puff--variant-${spriteVariant}` +
        (spec.connector ? " loot-fog-cloud__puff--connector" : "")
      puff.dataset.lootFogPuff = String(puffIndex)
      puff.dataset.lootFogSprite = String(spriteVariant)
      puff.dataset.lootFogConnector = String(spec.connector)
      puff.style.left = `${spec.left}px`
      puff.style.top = `${spec.top}px`
      puff.style.width = `${spec.width}px`
      puff.style.height = `${spec.height}px`
      puff.style.opacity = String(spec.opacity)
      puff.style.transform =
        (layout.presentation === "item" ? "scale(0.9) " : "") +
        `scaleX(${puffIndex % 2 === 1 ? -1 : 1}) rotate(${spec.rotation}deg)`
      puff.style.zIndex = spec.connector
        ? "6"
        : String(1 + ((puffIndex * 3) % 5))
      puff.style.animationDelay = `${-((puffIndex * 1.37) % 10)}s`
      if (!puff.isConnected) cloud.appendChild(puff)
    })
    existingPuffs.slice(puffSpecs.length).forEach((extraPuff) => extraPuff.remove())
    if (!cloud.isConnected) overlay.appendChild(cloud)
  })
  existing.slice(layout.clouds.length).forEach((cloud) => cloud.remove())
}

function fogOverlaySurface(start: HTMLElement): HTMLElement {
  return (
    start.closest<HTMLElement>(FOG_OVERLAY_SURFACE_SELECTOR) ??
    start.ownerDocument.body
  )
}

function mountFogOverlay(overlay: HTMLDivElement, start: HTMLElement): HTMLElement {
  const surface = fogOverlaySurface(start)
  if (
    surface !== start.ownerDocument.body &&
    getComputedStyle(surface).position === "static"
  ) {
    surface.classList.add("loot-fog-overlay-surface")
  }
  if (overlay.parentElement !== surface) surface.appendChild(overlay)
  return surface
}

function placeFogOverlay(
  overlay: HTMLDivElement,
  surface: HTMLElement,
  rect: FogRect,
): void {
  const view = surface.ownerDocument.defaultView
  let left = rect.left + (view?.scrollX ?? 0)
  let top = rect.top + (view?.scrollY ?? 0)
  if (surface !== surface.ownerDocument.body) {
    const surfaceRect = surface.getBoundingClientRect()
    left = rect.left - surfaceRect.left + surface.scrollLeft - surface.clientLeft
    top = rect.top - surfaceRect.top + surface.scrollTop - surface.clientTop
  }
  overlay.style.left = `${left}px`
  overlay.style.top = `${top}px`
  overlay.style.width = `${rect.width}px`
  overlay.style.height = `${rect.height}px`
}

function ensureFogRangeOverlay(start: HTMLElement): HTMLDivElement {
  let overlay = fogOverlayByStart.get(start)
  if (!overlay) {
    overlay = start.ownerDocument.createElement("div")
    overlay.className = "loot-fog-overlay"
    overlay.setAttribute("aria-hidden", "true")
    const authoredId =
      start.getAttribute("data-fog-id")?.trim() ??
      start.getAttribute(DIRECT_FOG_ATTRIBUTE)?.trim()
    overlay.dataset.lootFogOverlay =
      authoredId && !authoredId.startsWith("@") ? authoredId : "range"
    fogOverlayByStart.set(start, overlay)
  }
  mountFogOverlay(overlay, start)
  return overlay
}

function applyFogOverlayIllumination(
  overlay: HTMLDivElement,
  position: PointerPosition | null,
): void {
  const rect = overlay.getBoundingClientRect()
  overlay.style.setProperty(
    "--loot-flashlight-radius",
    `${currentFlashlightRadius()}px`,
  )
  overlay.style.setProperty(
    "--loot-flashlight-x",
    `${(position?.x ?? -9999) - rect.left}px`,
  )
  overlay.style.setProperty(
    "--loot-flashlight-y",
    `${(position?.y ?? -9999) - rect.top}px`,
  )
  const illuminated = Boolean(
    position &&
      flashlightActive &&
      pointing &&
      magnifierIntersectsRect(
        position.x,
        position.y,
        rect,
        currentFlashlightRadius(),
      ),
  )
  overlay.classList.toggle("loot-fog-overlay--under-beam", illuminated)
}

function applyFogRangeOverlay(
  range: FogRange,
  position: PointerPosition | null,
): HTMLDivElement {
  const layout = fogRangeLayout(range)
  const overlay = ensureFogRangeOverlay(range.start)
  if (!layout) {
    overlay.hidden = true
    overlay.classList.remove("loot-fog-overlay--under-beam")
    overlay.replaceChildren()
    return overlay
  }
  const rect = layout.bounds
  const surface = mountFogOverlay(overlay, range.start)
  overlay.hidden = false
  placeFogOverlay(overlay, surface, rect)
  syncFogClouds(overlay, layout)
  applyFogOverlayIllumination(overlay, position)
  return overlay
}

function syncFogRangeOverlays(
  ranges: readonly FogRange[],
  position: PointerPosition | null,
): void {
  const next = new Set<HTMLDivElement>()
  ranges.forEach((range) => {
    const overlay = applyFogRangeOverlay(range, position)
    next.add(overlay)
  })
  fogRangeOverlays.forEach((overlay) => {
    if (!next.has(overlay)) overlay.remove()
  })
  fogRangeOverlays.clear()
  next.forEach((overlay) => fogRangeOverlays.add(overlay))
}

function syncFogTargets(position: PointerPosition | null): void {
  const collection = collectFogTargets()
  fogTargets.forEach((target) => {
    if (!collection.targets.has(target)) releaseFogTarget(target)
  })
  fogTargets.clear()
  collection.targets.forEach((target) => {
    fogTargets.add(target)
    applyFogTarget(target, position, collection.rangeTargets.has(target))
  })
  syncFogRangeOverlays(collection.ranges, position)
}

function syncFogIllumination(position: PointerPosition | null): void {
  fogTargets.forEach((target) =>
    applyFogTarget(
      target,
      position,
      target.classList.contains("loot-fog-target--range"),
    ),
  )
  fogRangeOverlays.forEach((overlay) =>
    applyFogOverlayIllumination(overlay, position),
  )
}

function scheduleFogLayoutSync(): void {
  if (fogLayoutFrame !== null) return
  fogLayoutFrame = window.requestAnimationFrame(() => {
    fogLayoutFrame = null
    syncFogTargets(pointing ? lastPointer : null)
  })
}

function clampTouchBeamPosition(position: PointerPosition): PointerPosition {
  const radius = currentFlashlightRadius()
  const horizontalMargin = Math.min(
    radius + TOUCH_BEAM_MARGIN,
    window.innerWidth / 2,
  )
  const verticalMargin = Math.min(
    radius + TOUCH_BEAM_MARGIN,
    window.innerHeight / 2,
  )
  return {
    x: Math.max(
      horizontalMargin,
      Math.min(position.x, window.innerWidth - horizontalMargin),
    ),
    y: Math.max(
      verticalMargin,
      Math.min(position.y, window.innerHeight - verticalMargin),
    ),
  }
}

function defaultTouchBeamPosition(): PointerPosition {
  return clampTouchBeamPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })
}

function finishTouchPan(handle: HTMLButtonElement, pointerId?: number): void {
  if (pointerId !== undefined && touchPanGesture?.pointerId !== pointerId) return
  touchPanGesture = null
  handle.classList.remove("loot-flashlight-pan--dragging")
  if (pointerId !== undefined && handle.hasPointerCapture(pointerId)) {
    handle.releasePointerCapture(pointerId)
  }
}

function bindPanHandle(handle: HTMLButtonElement): void {
  if (boundPanHandles.has(handle)) return
  boundPanHandles.add(handle)
  handle.addEventListener("pointerdown", (event) => {
    if (
      !flashlightActive ||
      !touchMode ||
      !event.isPrimary ||
      event.pointerType !== "touch"
    ) {
      return
    }
    event.stopPropagation()
    touchPanGesture = {
      origin: pendingPointer ?? lastPointer ?? defaultTouchBeamPosition(),
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
    }
    handle.classList.add("loot-flashlight-pan--dragging")
    handle.setPointerCapture(event.pointerId)
  })
  handle.addEventListener("pointermove", (event) => {
    const gesture = touchPanGesture
    if (!gesture || gesture.pointerId !== event.pointerId) return
    event.stopPropagation()
    queuePointer(
      clampTouchBeamPosition({
        x: gesture.origin.x + event.clientX - gesture.start.x,
        y: gesture.origin.y + event.clientY - gesture.start.y,
      }),
    )
  })
  handle.addEventListener("pointerup", (event) => {
    if (touchPanGesture?.pointerId !== event.pointerId) return
    event.stopPropagation()
    finishTouchPan(handle, event.pointerId)
  })
  handle.addEventListener("pointercancel", (event) => {
    finishTouchPan(handle, event.pointerId)
  })
  handle.addEventListener("lostpointercapture", () => finishTouchPan(handle))
  handle.addEventListener("keydown", (event) => {
    if (!flashlightActive || !touchMode) return
    const delta = event.shiftKey ? TOUCH_PAN_STEP * 2 : TOUCH_PAN_STEP
    const movement: PointerPosition | null =
      event.key === "ArrowLeft"
        ? { x: -delta, y: 0 }
        : event.key === "ArrowRight"
          ? { x: delta, y: 0 }
          : event.key === "ArrowUp"
            ? { x: 0, y: -delta }
            : event.key === "ArrowDown"
              ? { x: 0, y: delta }
              : null
    if (!movement) return
    event.preventDefault()
    event.stopPropagation()
    const origin = pendingPointer ?? lastPointer ?? defaultTouchBeamPosition()
    queuePointer(
      clampTouchBeamPosition({
        x: origin.x + movement.x,
        y: origin.y + movement.y,
      }),
    )
  })
}

function ensureBeam(): HTMLDivElement {
  const existing = document.getElementById(FLASHLIGHT_BEAM_ID)
  const beam =
    existing instanceof HTMLDivElement ? existing : document.createElement("div")
  if (!(existing instanceof HTMLDivElement)) {
    beam.id = FLASHLIGHT_BEAM_ID
    beam.className = "loot-flashlight-beam"
    beam.hidden = true
    beam.setAttribute("aria-hidden", "true")
    const handle = document.createElement("button")
    handle.type = "button"
    handle.className = "loot-flashlight-pan"
    handle.setAttribute("aria-label", "Lichtkegel verschieben")
    handle.title = "Lichtkegel verschieben"
    handle.hidden = true
    handle.append(createFlashlightGraphic())
    beam.appendChild(handle)
    document.body.appendChild(beam)
  }
  beam.style.setProperty(
    "--loot-flashlight-radius",
    `${currentFlashlightRadius()}px`,
  )
  const handle = beam.querySelector<HTMLButtonElement>(".loot-flashlight-pan")
  if (handle) bindPanHandle(handle)
  return beam
}

function paintPointer(): void {
  pointerFrame = null
  if (!pendingPointer || !flashlightActive) return
  lastPointer = pendingPointer
  pendingPointer = null
  pointing = true
  const beam = ensureBeam()
  beam.style.left = `${lastPointer.x}px`
  beam.style.top = `${lastPointer.y}px`
  beam.hidden = false
  document.body.classList.add("loot-flashlight-pointing")
  syncFogIllumination(lastPointer)
}

function queuePointer(position: PointerPosition): void {
  pendingPointer = position
  if (pointerFrame !== null) return
  pointerFrame = window.requestAnimationFrame(paintPointer)
}

function applyTouchMode(active: boolean): void {
  touchMode = Boolean(active && flashlightActive)
  const beam = ensureBeam()
  const handle = beam.querySelector<HTMLButtonElement>(".loot-flashlight-pan")
  beam.classList.toggle("loot-flashlight-beam--touch", touchMode)
  document.body.classList.toggle("loot-flashlight-touch", touchMode)
  if (handle) {
    handle.hidden = !touchMode
    handle.tabIndex = touchMode ? 0 : -1
    if (!touchMode) finishTouchPan(handle)
  }
}

function stopPointing(): void {
  pointing = false
  pendingPointer = null
  if (pointerFrame !== null) window.cancelAnimationFrame(pointerFrame)
  pointerFrame = null
  ensureBeam().hidden = true
  document.body.classList.remove("loot-flashlight-pointing")
  syncFogIllumination(null)
}

function focusFlashlightTool(): void {
  document.getElementById(FLASHLIGHT_TOOL_ID)?.focus({ preventScroll: true })
}

function applyFlashlightActive(
  active: boolean,
  announce = true,
  activationPointerType = "",
): void {
  flashlightActive = Boolean(active && controller?.collected())
  document.body.classList.toggle("loot-flashlight-active", flashlightActive)
  const button = document.getElementById(FLASHLIGHT_TOOL_ID)
  button?.classList.toggle("loot-flashlight-tool--active", flashlightActive)
  button?.setAttribute("aria-pressed", String(flashlightActive))
  button?.setAttribute(
    "aria-label",
    flashlightActive
      ? "Taschenlampe deaktivieren"
      : "Taschenlampe aktivieren",
  )
  if (!flashlightActive) {
    applyTouchMode(false)
    stopPointing()
  } else if (activationPointerType === "touch" || touchMode) {
    applyTouchMode(true)
    queuePointer(
      clampTouchBeamPosition(lastPointer ?? defaultTouchBeamPosition()),
    )
  }
  if (announce) {
    announceResource(
      flashlightActive
        ? touchMode
          ? "Taschenlampe aktiviert. Ziehe den Lichtkegel am Griff über den Nebel."
          : "Taschenlampe aktiviert. Bewege den Lichtkegel über den Nebel."
        : "Taschenlampe deaktiviert.",
    )
  }
}

function renderFlashlightTool(): void {
  if (!controller?.collected()) {
    document.getElementById(FLASHLIGHT_TOOL_ID)?.remove()
    applyFlashlightActive(false, false)
    refreshResourceBarVisibility()
    return
  }

  let button = document.getElementById(
    FLASHLIGHT_TOOL_ID,
  ) as HTMLButtonElement | null
  if (!button) {
    button = document.createElement("button")
    button.id = FLASHLIGHT_TOOL_ID
    button.type = "button"
    button.className = "loot-flashlight-tool"
    button.dataset.lootFlashlightTool = "true"
    button.append(createFlashlightGraphic())
    button.addEventListener("click", (event) => {
      const pointerType = event.detail === 0 ? "" : lastPrimaryPointerType
      applyFlashlightActive(!flashlightActive, true, pointerType)
    })
    installResourceBar().appendChild(button)
  }
  applyFlashlightActive(flashlightActive, false)
  refreshResourceBarVisibility()
}

function scheduleRuntimeSync(): void {
  if (runtimeSyncQueued) return
  runtimeSyncQueued = true
  queueMicrotask(() => {
    runtimeSyncQueued = false
    syncAllFlashlights()
    syncFogTargets(pointing ? lastPointer : null)
  })
}

function installObservers(): void {
  if (observersInstalled) return
  observersInstalled = true
  window.addEventListener(
    "pointermove",
    (event) => {
      if (
        !flashlightActive ||
        !event.isPrimary ||
        event.pointerType === "touch"
      ) {
        return
      }
      if (touchMode) applyTouchMode(false)
      queuePointer({ x: event.clientX, y: event.clientY })
    },
    { passive: true },
  )
  window.addEventListener(
    "pointerdown",
    (event) => {
      if (!event.isPrimary) return
      lastPrimaryPointerType = event.pointerType
      if (!flashlightActive) return
      if (event.pointerType === "touch") {
        if (!touchMode || !pointing) {
          applyTouchMode(true)
          queuePointer(
            clampTouchBeamPosition(lastPointer ?? defaultTouchBeamPosition()),
          )
        }
        return
      }
      if (event.pointerType !== "mouse") {
        queuePointer({ x: event.clientX, y: event.clientY })
      }
    },
    { passive: true },
  )
  window.addEventListener("pointerout", (event) => {
    if (
      !touchMode &&
      event.pointerType === "mouse" &&
      event.relatedTarget === null
    ) {
      stopPointing()
    }
  })
  window.addEventListener("pointercancel", (event) => {
    if (event.pointerType !== "touch") stopPointing()
  })
  window.addEventListener("blur", () => {
    if (!touchMode) stopPointing()
  })
  const syncAfterViewportChange = (): void => {
    if (flashlightActive && pointing && lastPointer) {
      syncFogIllumination(lastPointer)
    }
  }
  window.addEventListener("scroll", syncAfterViewportChange, { passive: true })
  document.addEventListener("scroll", syncAfterViewportChange, {
    capture: true,
    passive: true,
  })
  window.addEventListener(
    "resize",
    () => {
      if (flashlightActive && pointing && lastPointer) {
        queuePointer(touchMode ? clampTouchBeamPosition(lastPointer) : lastPointer)
      } else {
        scheduleFogLayoutSync()
      }
    },
    { passive: true },
  )
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !flashlightActive) return
    event.preventDefault()
    applyFlashlightActive(false)
    focusFlashlightTool()
  })
  document.addEventListener(REVEAL_CHANGED_EVENT, scheduleRuntimeSync)
  document.addEventListener("click", handlePickupClick, true)
  new MutationObserver(scheduleRuntimeSync).observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
  observeLiaSlideActivity(scheduleRuntimeSync)
}

class LootFlashlightElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-flashlight-id", "data-options"]
  }

  connectedCallback(): void {
    syncFlashlight(this)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncFlashlight(this)
  }
}

class LootFogElement extends HTMLElement {
  private childObserver: MutationObserver | null = null

  connectedCallback(): void {
    normalizeFogArguments(this)
    scheduleRuntimeSync()
    this.childObserver ??= new MutationObserver(() => {
      queueMicrotask(() => {
        if (!this.isConnected) return
        normalizeFogArguments(this)
        scheduleRuntimeSync()
      })
    })
    this.childObserver.observe(this, {
      characterData: true,
      childList: true,
      subtree: true,
    })
  }

  disconnectedCallback(): void {
    this.childObserver?.disconnect()
    scheduleRuntimeSync()
  }
}

class LootFogStartElement extends HTMLElement {
  connectedCallback(): void {
    scheduleRuntimeSync()
  }

  disconnectedCallback(): void {
    scheduleRuntimeSync()
  }
}

class LootFogEndElement extends HTMLElement {
  connectedCallback(): void {
    scheduleRuntimeSync()
  }

  disconnectedCallback(): void {
    scheduleRuntimeSync()
  }
}

export function installFlashlight(nextController: FlashlightController): void {
  controller = nextController
  installObservers()
  ensureBeam()
  if (!customElements.get(FOG_TAG)) {
    customElements.define(FOG_TAG, LootFogElement)
  }
  if (!customElements.get(FOG_START_TAG)) {
    customElements.define(FOG_START_TAG, LootFogStartElement)
  }
  if (!customElements.get(FOG_END_TAG)) {
    customElements.define(FOG_END_TAG, LootFogEndElement)
  }
  if (!customElements.get(FLASHLIGHT_TAG)) {
    customElements.define(FLASHLIGHT_TAG, LootFlashlightElement)
  }
  renderFlashlightTool()
  syncAllFlashlights()
  syncFogTargets(null)
}

export function refreshFlashlight(): void {
  renderFlashlightTool()
  ensureBeam()
  syncAllFlashlights()
  syncFogTargets(pointing ? lastPointer : null)
}
