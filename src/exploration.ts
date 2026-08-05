import {
  CollectibleVisibilityGate,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  notifyConcealmentLayoutChanged,
  setHostConcealment,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  parseExplorationOptions,
  TOOL_KINDS,
  type RevealKind,
  type RevealLayerOption,
  type ToolKind,
} from "./exploration-options.ts"
import {
  createExplorationToolGraphic,
  createRevealCoverGraphic,
} from "./exploration-visual.ts"
import { setRangeGate } from "./range-gate.ts"
import {
  announceResource,
  installResourceBar,
  refreshResourceBarVisibility,
} from "./resource-bar.ts"
import {
  observeLiaSlideActivity,
  liaSlideIsAccessible,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"
import { templateDocumentCandidates } from "./template-targets.ts"

const TOOL_TAG = "lia-loot-tool"
const REVEAL_TAG = "lia-loot-reveal"
const REVEAL_START_TAG = "lia-loot-reveal-start"
const REVEAL_END_TAG = "lia-loot-reveal-end"
const REVEAL_END_LINK_SELECTOR = 'a[href^="#lia-loot-reveal-end-"]'
const RANGE_CONTROLLER_ATTRIBUTE = "data-loot-reveal-range-controller"
const RANGE_CONFIGURING_ATTRIBUTE = "data-loot-reveal-range-configuring"
const RANGE_BLOCKED_ATTRIBUTE = "data-loot-reveal-range-blocked"
const CONDITIONAL_RANGE_BLOCKED_ATTRIBUTE = "data-loot-if-range-blocked"
const MANAGED_ROOT_ATTRIBUTE = "data-loot-managed-reveal-root"
const STACK_SIGNATURE_ATTRIBUTE = "data-loot-reveal-stack-signature"
const FINAL_CONTENT_ATTRIBUTE = "data-loot-reveal-final-content"
const ACTIVE_TOOL_ATTRIBUTE = "data-loot-active-tool"
const COLLECT_DURATION = 650
const TRANSITION_DURATION = 520

export const REVEAL_CHANGED_EVENT = "lia-loot:reveal-changed"
export const EXPLORATION_CHANGED_EVENT = "lia-loot:exploration-changed"

const TOOL_DETAILS: Readonly<
  Record<
    ToolKind,
    {
      collectLabel: string
      collectedMessage: string
      label: string
      slug: string
    }
  >
> = {
  shovel: {
    collectLabel: "Schaufel einsammeln",
    collectedMessage: "Schaufel gefunden.",
    label: "Schaufel",
    slug: "shovel",
  },
  "watering-can": {
    collectLabel: "Gießkanne einsammeln",
    collectedMessage: "Gießkanne gefunden.",
    label: "Gießkanne",
    slug: "watering-can",
  },
}

export interface ExplorationController {
  activeTool(): ToolKind | null
  collectTool(kind: ToolKind): boolean
  digLayer(layerId: string): boolean
  isLayerDug(layerId: string): boolean
  isPlantOpened(plantId: string): boolean
  isPlantWatered(plantId: string): boolean
  isToolCollected(kind: ToolKind): boolean
  openPlant(plantId: string): boolean
  setActiveTool(kind: ToolKind | null): boolean
  waterPlant(plantId: string): boolean
}

interface ToolRequest {
  concealment: ConcealmentMode | null
  errors: string[]
  layers: RevealLayerOption[]
  sourceSection: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

interface RevealRequest {
  errors: string[]
  layers: RevealLayerOption[]
  sourceSection: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

type RevealState = "locked" | "bloomed" | "revealed"
type TransitionKind = "digging" | "opening" | "watering"
interface RevealRangeBinding {
  controller: HTMLElement | null
  end: HTMLElement | null
  scope: HTMLElement
  start: HTMLElement
}

let controller: ExplorationController | null = null
let runtimeId = 0
let slideActivityInstalled = false
let toolPickupListenerInstalled = false
let revealMarkerSyncQueued = false
let revealMarkerObserver: MutationObserver | null = null
let revealRangeBindings: RevealRangeBinding[] = []
const collectingIds = new Set<string>()
const eligibleToolIds = new Set<string>()
const activeToolDocuments = new Set<Document>()
const boundToolPickupButtons = new WeakSet<HTMLButtonElement>()
const rangeGatedElements = new Set<HTMLElement>()
const warnedSpecifications = new Set<string>()
const transitions = new Map<string, TransitionKind>()
const revealVisibility = new CollectibleVisibilityGate()
const toolVisibility = new CollectibleVisibilityGate()
const authoredPayloads = new WeakMap<HTMLElement, HTMLElement>()

function isToolKind(value: unknown): value is ToolKind {
  return TOOL_KINDS.includes(value as ToolKind)
}

function normalizePlaceholders(value: string): string {
  return value
    .split(";")
    .map((token) => token.trim())
    .filter((token) => token && !/^@\d+$/u.test(token))
    .join("; ")
}

function resolveRuntimeId(
  host: HTMLElement,
  authoredAttribute: string,
  runtimeAttribute: "lootRevealRuntimeId" | "lootToolRuntimeId",
  prefix: string,
): string {
  const authored = host.getAttribute(authoredAttribute)?.trim()
  if (authored && !authored.startsWith("@")) return authored
  const existing = host.dataset[runtimeAttribute]
  if (existing) return existing
  runtimeId += 1
  const generated = `${prefix}:runtime-${runtimeId}`
  host.dataset[runtimeAttribute] = generated
  return generated
}

function warnOnce(id: string, subject: string, errors: readonly string[]): void {
  const warningId = `${subject}:${id}`
  if (warnedSpecifications.has(warningId)) return
  warnedSpecifications.add(warningId)
  console.warn(
    `Loot: ${subject} ${id} bleibt wegen ungültiger Optionen verborgen. ${errors.join(" ")}`,
  )
}

function canonicalLayer(layer: RevealLayerOption): string {
  return `${layer.kind}:${layer.concealment ?? "visible"}`
}

export function revealLayerSignature(
  layers: readonly RevealLayerOption[],
): string {
  return layers.map(canonicalLayer).join(">")
}

function managedRoot(host: HTMLElement): HTMLElement | null {
  return (
    ([...host.children].find((child) =>
      child.hasAttribute(MANAGED_ROOT_ATTRIBUTE),
    ) as HTMLElement | undefined) ?? null
  )
}

function markerBoundary(marker: HTMLElement): ChildNode {
  let boundary: ChildNode = marker
  while (boundary.parentElement) {
    const parent = boundary.parentElement
    const isEmptyHtmlWrapper =
      parent.tagName === "DIV" && parent.attributes.length === 0
    if (
      parent.tagName !== "P" &&
      parent.tagName !== "SPAN" &&
      parent.tagName !== "LIA-KEEP" &&
      !isEmptyHtmlWrapper
    ) {
      break
    }
    const hasOtherContent = [...parent.childNodes].some(
      (node) =>
        node !== boundary &&
        node.nodeType !== Node.COMMENT_NODE &&
        (node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())),
    )
    if (hasOtherContent) break
    boundary = parent
  }
  return boundary
}

function materializeRevealPair(
  start: HTMLElement,
  end: HTMLElement,
): HTMLElement | null {
  if (!start.isConnected || !end.isConnected) return null
  let host = [...start.children].find(
    (child) =>
      child.matches(REVEAL_TAG) &&
      child.hasAttribute(RANGE_CONTROLLER_ATTRIBUTE),
  ) as HTMLElement | undefined
  if (!host) {
    host = start.ownerDocument.createElement(REVEAL_TAG)
    host.setAttribute(RANGE_CONTROLLER_ATTRIBUTE, "true")
  }
  host.setAttribute(RANGE_CONFIGURING_ATTRIBUTE, "true")
  host.setAttribute(
    "data-reveal-id",
    start.getAttribute("data-reveal-id") ?? "",
  )
  host.setAttribute("data-options", start.getAttribute("data-options") ?? "")
  host.removeAttribute(RANGE_CONFIGURING_ATTRIBUTE)
  if (!host.isConnected) start.appendChild(host)
  return host
}

function revealMarkerScope(marker: HTMLElement): HTMLElement {
  return (
    marker.closest<HTMLElement>(
      "[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main",
    ) ?? document.body
  )
}

function materializeRevealRanges(): void {
  const markersByScope = new Map<HTMLElement, HTMLElement[]>()
  document
    .querySelectorAll<HTMLElement>(
      `${REVEAL_START_TAG}, ${REVEAL_END_TAG}, ${REVEAL_END_LINK_SELECTOR}`,
    )
    .forEach((marker) => {
      const scope = revealMarkerScope(marker)
      const markers = markersByScope.get(scope) ?? []
      markers.push(marker)
      markersByScope.set(scope, markers)
    })

  const nextBindings: RevealRangeBinding[] = []
  for (const [scope, markers] of markersByScope) {
    const starts: HTMLElement[] = []
    const pairs: Array<{ end: HTMLElement; start: HTMLElement }> = []
    for (const marker of markers) {
      if (marker.matches(REVEAL_START_TAG)) {
        starts.push(marker)
        continue
      }
      const start = starts[starts.length - 1]
      if (!start) continue
      const startKind = start.getAttribute("data-reveal-kind")?.trim()
      const endKind =
        marker.getAttribute("data-reveal-kind")?.trim() ||
        (marker.matches(REVEAL_END_LINK_SELECTOR)
          ? marker
              .getAttribute("href")
              ?.slice("#lia-loot-reveal-end-".length)
              .trim()
          : undefined)
      if (startKind && endKind && startKind !== endKind) {
        continue
      }
      starts.pop()
      pairs.push({ end: marker, start })
    }
    pairs.forEach(({ end, start }) => {
      const rangeController = materializeRevealPair(start, end)
      if (rangeController) {
        nextBindings.push({
          controller: rangeController,
          end,
          scope,
          start,
        })
      }
    })
    starts.forEach((start) => {
      nextBindings.push({
        controller: null,
        end: null,
        scope,
        start,
      })
    })
  }
  const activeControllers = new Set<HTMLElement>()
  nextBindings.forEach((binding) => {
    if (binding.controller) activeControllers.add(binding.controller)
  })
  document
    .querySelectorAll<HTMLElement>(
      `${REVEAL_TAG}[${RANGE_CONTROLLER_ATTRIBUTE}]`,
    )
    .forEach((rangeController) => {
      if (!activeControllers.has(rangeController)) rangeController.remove()
    })
  revealRangeBindings = nextBindings
}

function rangeUnits(binding: RevealRangeBinding): HTMLElement[] {
  const startBoundary = markerBoundary(binding.start)
  const endBoundary = binding.end ? markerBoundary(binding.end) : null
  if (
    !startBoundary.isConnected ||
    (endBoundary !== null && !endBoundary.isConnected) ||
    !binding.scope.isConnected
  ) {
    return []
  }
  const range = binding.scope.ownerDocument.createRange()
  try {
    range.setStartAfter(startBoundary)
    if (endBoundary) range.setEndBefore(endBoundary)
    else range.setEnd(binding.scope, binding.scope.childNodes.length)
  } catch {
    return []
  }

  const units: HTMLElement[] = []
  const collectContainedElements = (parent: HTMLElement): void => {
    for (const child of [...parent.children] as HTMLElement[]) {
      if (!range.intersectsNode(child)) continue
      let fullyContained = false
      try {
        fullyContained =
          range.comparePoint(child, 0) === 0 &&
          range.comparePoint(child, child.childNodes.length) === 0
      } catch {
        fullyContained = false
      }
      if (fullyContained) units.push(child)
      else collectContainedElements(child)
    }
  }
  collectContainedElements(binding.scope)
  return units
}

function setRangeElementBlocked(
  element: HTMLElement,
  blocked: boolean,
): void {
  setRangeGate(element, "reveal", RANGE_BLOCKED_ATTRIBUTE, blocked)
}

function syncRevealRangeGates(): void {
  const nextGated = new Set<HTMLElement>()
  for (const binding of revealRangeBindings) {
    const blocked =
      binding.controller === null ||
      !binding.controller.isConnected ||
      binding.controller.hidden ||
      binding.controller.dataset.lootRevealState !== "revealed"
    if (!blocked) continue
    rangeUnits(binding).forEach((unit) => nextGated.add(unit))
  }
  rangeGatedElements.forEach((element) => {
    if (!nextGated.has(element)) setRangeElementBlocked(element, false)
  })
  nextGated.forEach((element) => setRangeElementBlocked(element, true))
  rangeGatedElements.clear()
  nextGated.forEach((element) => rangeGatedElements.add(element))
}

function scheduleRevealRangeMaterialization(): void {
  if (revealMarkerSyncQueued) return
  revealMarkerSyncQueued = true
  queueMicrotask(() => {
    revealMarkerSyncQueued = false
    materializeRevealRanges()
    syncAllRevealContainers()
    document.dispatchEvent(new CustomEvent(REVEAL_CHANGED_EVENT))
  })
}

function nodeContainsRevealMarker(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false
  const element = node as Element
  const selector =
    `${REVEAL_START_TAG}, ${REVEAL_END_TAG}, ${REVEAL_END_LINK_SELECTOR}`
  return element.matches(selector) || element.querySelector(selector) !== null
}

function mutationChangesRevealMarkers(record: MutationRecord): boolean {
  if (record.type === "attributes") {
    const target = record.target as Element
    if (
      target.matches(
        `${REVEAL_START_TAG}, ${REVEAL_END_TAG}, ${REVEAL_END_LINK_SELECTOR}`,
      )
    ) {
      return true
    }
    return (
      record.attributeName === "href" &&
      Boolean(record.oldValue?.startsWith("#lia-loot-reveal-end-"))
    )
  }
  if (
    [...record.addedNodes, ...record.removedNodes].some(
      nodeContainsRevealMarker,
    )
  ) {
    return true
  }
  if (record.target.nodeType !== Node.ELEMENT_NODE) return false
  const target = record.target as Element
  if (
    target.closest(
      `${REVEAL_TAG}[${RANGE_CONTROLLER_ATTRIBUTE}]`,
    )
  ) {
    return false
  }
  return revealRangeBindings.some((binding) => {
    const boundaries = [binding.start, binding.end].filter(
      (boundary): boundary is HTMLElement => boundary !== null,
    )
    return (
      target === binding.scope ||
      boundaries.some(
        (boundary) =>
          target === boundary ||
          target.contains(boundary) ||
          boundary.contains(target),
      )
    )
  })
}

function installRevealMarkerObserver(): void {
  if (revealMarkerObserver || !document.documentElement) return
  revealMarkerObserver = new MutationObserver((records) => {
    if (records.some(mutationChangesRevealMarkers)) {
      scheduleRevealRangeMaterialization()
    }
  })
  revealMarkerObserver.observe(document.documentElement, {
    attributeFilter: [
      "data-options",
      "data-reveal-id",
      "data-reveal-kind",
      "href",
    ],
    attributeOldValue: true,
    attributes: true,
    childList: true,
    subtree: true,
  })
}

function layerContent(layer: ParentNode): HTMLElement | null {
  return [...layer.children].find((child) =>
    child.hasAttribute("data-loot-reveal-layer-content") ||
    child.hasAttribute("data-loot-reveal-payload"),
  ) as HTMLElement | null
}

function deepestLayerContent(root: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = root
  let content: HTMLElement | null = null
  while (current) {
    content = layerContent(current)
    if (!content) return null
    current = [...content.children].find((child) =>
      child.hasAttribute("data-loot-reveal-kind"),
    ) as HTMLElement | null
  }
  return content
}

function finalContent(root: HTMLElement): HTMLElement | null {
  return deepestLayerContent(root)?.querySelector<HTMLElement>(
    `:scope > [${FINAL_CONTENT_ATTRIBUTE}]`,
  ) ?? null
}

function layerId(
  stableId: string,
  layer: RevealLayerOption,
  index: number,
): string {
  return `${stableId}:reveal:${index}:${canonicalLayer(layer)}`
}

function coverLabel(kind: RevealKind, state: RevealState): string {
  if (kind === "soil") return "Erdhaufen mit Schaufel wegbuddeln"
  return state === "bloomed"
    ? "Blühende Pflanze öffnen"
    : "Pflanze mit Gießkanne gießen"
}

function createCoverButton(
  id: string,
  kind: RevealKind,
  ownerDocument: Document,
): HTMLButtonElement {
  const button = ownerDocument.createElement("button")
  button.type = "button"
  button.className = `loot-reveal-cover loot-reveal-cover--${kind}`
  button.dataset.lootRevealCover = id
  button.dataset.lootRevealCoverPhase = "locked"
  button.setAttribute("aria-label", coverLabel(kind, "locked"))
  button.append(createRevealCoverGraphic(kind, "seedling", ownerDocument))
  button.addEventListener("click", handleCoverClick)
  return button
}

function createLayer(
  stableId: string,
  layer: RevealLayerOption,
  index: number,
  ownerDocument: Document,
): { content: HTMLElement; layer: HTMLElement } {
  const id = layerId(stableId, layer, index)
  const wrapper = ownerDocument.createElement("div")
  wrapper.className = `loot-reveal-layer loot-reveal-layer--${layer.kind}`
  wrapper.dataset.lootRevealId = id
  wrapper.dataset.lootRevealKind = layer.kind
  wrapper.dataset.lootRevealState = "locked"
  wrapper.dataset.lootRevealConcealment = layer.concealment ?? ""

  const cover = ownerDocument.createElement("div")
  cover.className = "loot-reveal-layer__cover"
  cover.dataset.lootRevealCoverSlot = id
  cover.append(createCoverButton(id, layer.kind, ownerDocument))

  const content = ownerDocument.createElement("div")
  content.className = "loot-reveal-layer__content"
  content.dataset.lootRevealLayerContent = id
  content.hidden = true
  content.inert = true
  content.setAttribute("aria-hidden", "true")

  wrapper.append(cover, content)
  setHostConcealment(cover, layer.concealment)
  return { content, layer: wrapper }
}

function announce(message: string): void {
  installResourceBar()
  announceResource(message)
}

function transitionDelay(): number {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ? 0
    : TRANSITION_DURATION
}

function stageState(layer: HTMLElement): RevealState {
  if (!controller) return "locked"
  const id = layer.dataset.lootRevealId ?? ""
  const kind = layer.dataset.lootRevealKind as RevealKind | undefined
  const transitioning = transitions.get(id)

  if (kind === "soil") {
    return controller.isLayerDug(id) && transitioning !== "digging"
      ? "revealed"
      : "locked"
  }
  if (kind !== "plant") return "locked"
  if (controller.isPlantOpened(id) && transitioning !== "opening") {
    return "revealed"
  }
  return controller.isPlantWatered(id) && transitioning !== "watering"
    ? "bloomed"
    : "locked"
}

function updateCoverButton(
  button: HTMLButtonElement,
  kind: RevealKind,
  state: RevealState,
): void {
  const phase = state === "bloomed" ? "bloomed" : "locked"
  button.setAttribute("aria-label", coverLabel(kind, state))
  if (button.dataset.lootRevealCoverPhase === phase) return
  button.dataset.lootRevealCoverPhase = phase
  button.replaceChildren(
    createRevealCoverGraphic(
      kind,
      phase === "bloomed" ? "bloomed" : "seedling",
      button.ownerDocument,
    ),
  )
}

function syncLayer(layer: HTMLElement): boolean {
  const kind = layer.dataset.lootRevealKind as RevealKind | undefined
  if (kind !== "soil" && kind !== "plant") return false
  const state = stageState(layer)
  const previousState = layer.dataset.lootRevealState
  const cover = [...layer.children].find((child) =>
    child.hasAttribute("data-loot-reveal-cover-slot"),
  ) as HTMLElement | undefined
  const content = layerContent(layer)
  if (!cover || !content) return false

  const button = cover.querySelector<HTMLButtonElement>(
    ":scope [data-loot-reveal-cover]",
  )
  if (button) updateCoverButton(button, kind, state)

  const revealed = state === "revealed"
  content.hidden = !revealed
  content.inert = !revealed
  content.setAttribute("aria-hidden", String(!revealed))
  cover.hidden = revealed
  cover.inert = revealed
  layer.dataset.lootRevealState = state
  layer.classList.toggle("loot-reveal-layer--bloomed", state === "bloomed")
  layer.classList.toggle("loot-reveal-layer--revealed", revealed)

  const concealment = layer.dataset.lootRevealConcealment as
    | ConcealmentMode
    | ""
    | undefined
  setHostConcealment(
    cover,
    revealed || !concealment ? null : concealment,
  )
  return previousState !== state
}

function announceRevealChange(host: HTMLElement): void {
  notifyConcealmentLayoutChanged(host)
  host.dispatchEvent(
    new CustomEvent(REVEAL_CHANGED_EVENT, {
      bubbles: true,
    }),
  )
}

function syncRevealStack(host: HTMLElement): void {
  const root = managedRoot(host)
  if (!root) {
    delete host.dataset.lootRevealBlocked
    return
  }
  const layers: HTMLElement[] = []
  let layer: HTMLElement | null = root
  while (layer) {
    layers.push(layer)
    const content = layerContent(layer)
    layer = content
      ? ([...content.children].find((child) =>
          child.hasAttribute("data-loot-reveal-kind"),
        ) as HTMLElement | undefined) ?? null
      : null
  }
  let changed = false
  let blocked = false
  layers.forEach((currentLayer) => {
    changed = syncLayer(currentLayer) || changed
    blocked =
      currentLayer.dataset.lootRevealState !== "revealed" || blocked
  })
  const previousBlocked = host.dataset.lootRevealBlocked
  host.dataset.lootRevealBlocked = String(blocked)
  if (changed || previousBlocked !== String(blocked)) {
    announceRevealChange(host)
  }
}

export function setHostRevealLayers(
  host: HTMLElement,
  stableId: string,
  layers: readonly RevealLayerOption[],
): HTMLElement {
  const signature = revealLayerSignature(layers)
  const existingRoot = managedRoot(host)
  if (
    existingRoot &&
    host.getAttribute(STACK_SIGNATURE_ATTRIBUTE) === signature
  ) {
    syncRevealStack(host)
    return finalContent(existingRoot) ?? host
  }
  if (!existingRoot && layers.length === 0) return host

  let payloadNodes: Node[]
  if (existingRoot) {
    const existingContent = finalContent(existingRoot)
    if (existingContent) {
      setHostConcealment(existingContent, null)
      payloadNodes = [...existingContent.childNodes]
    } else {
      payloadNodes = []
    }
  } else {
    setHostConcealment(host, null)
    payloadNodes = [...host.childNodes]
  }

  host.replaceChildren()
  host.removeAttribute(STACK_SIGNATURE_ATTRIBUTE)
  delete host.dataset.lootRevealBlocked
  if (layers.length === 0) {
    host.append(...payloadNodes)
    announceRevealChange(host)
    return host
  }

  let outer: HTMLElement | null = null
  let content: HTMLElement | null = null
  for (const [index, layer] of layers.entries()) {
    const created = createLayer(stableId, layer, index, host.ownerDocument)
    if (!outer) {
      outer = created.layer
      outer.setAttribute(MANAGED_ROOT_ATTRIBUTE, "true")
    } else {
      content?.appendChild(created.layer)
    }
    content = created.content
  }
  if (!outer || !content) return host
  const final = host.ownerDocument.createElement("div")
  final.className = "loot-reveal-layer__final-content"
  final.setAttribute(FINAL_CONTENT_ATTRIBUTE, "true")
  final.append(...payloadNodes)
  content.appendChild(final)
  host.appendChild(outer)
  host.setAttribute(STACK_SIGNATURE_ATTRIBUTE, signature)
  syncRevealStack(host)
  return final
}

export function clearHostRevealLayers(host: HTMLElement): void {
  const root = managedRoot(host)
  const changed =
    root !== null ||
    host.hasAttribute(STACK_SIGNATURE_ATTRIBUTE) ||
    host.hasAttribute("data-loot-reveal-blocked")
  if (root) {
    const content = finalContent(root)
    const payloadNodes = content ? [...content.childNodes] : []
    if (content) setHostConcealment(content, null)
    host.replaceChildren(...payloadNodes)
  }
  setHostConcealment(host, null)
  host.removeAttribute(STACK_SIGNATURE_ATTRIBUTE)
  delete host.dataset.lootRevealBlocked
  if (changed) announceRevealChange(host)
}

export function hostIsRevealBlocked(
  host: HTMLElement,
  includeOwnLayers = true,
): boolean {
  if (includeOwnLayers) syncRevealStack(host)
  const ownContainerBlocked =
    includeOwnLayers &&
    host.matches(REVEAL_TAG) &&
    host.dataset.lootRevealState !== "revealed"
  return (
    (includeOwnLayers && host.dataset.lootRevealBlocked === "true") ||
    ownContainerBlocked ||
    host.closest(`[${RANGE_BLOCKED_ATTRIBUTE}]`) !== null ||
    host.closest(`[${CONDITIONAL_RANGE_BLOCKED_ATTRIBUTE}]`) !== null ||
    !ancestorRevealAllows(host)
  )
}

function closestLayer(button: HTMLElement): HTMLElement | null {
  return button.closest<HTMLElement>("[data-loot-reveal-kind]")
}

function focusFirstPayloadControl(layer: HTMLElement): void {
  const content = layerContent(layer)
  const selector =
    "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
  const candidates = content
    ? [...content.querySelectorAll<HTMLElement>(selector)]
    : []
  const binding = revealRangeBindings.find(
    (candidate) => candidate.controller === layer,
  )
  if (binding) {
    rangeUnits(binding).forEach((unit) => {
      if (unit.matches(selector)) candidates.push(unit)
      candidates.push(...unit.querySelectorAll<HTMLElement>(selector))
    })
  }
  const target = candidates.find(
    (candidate) =>
      candidate.closest(
        `[hidden], [inert], [aria-hidden="true"], [${RANGE_BLOCKED_ATTRIBUTE}]`,
      ) === null && candidate.getClientRects().length > 0,
  )
  if (target) {
    target.focus({ preventScroll: true })
    return
  }
  layer.tabIndex = -1
  layer.focus({ preventScroll: true })
}

function finishTransition(
  layer: HTMLElement,
  id: string,
  keyboardActivated: boolean,
): void {
  window.setTimeout(() => {
    transitions.delete(id)
    layer.classList.remove(
      "loot-reveal-layer--digging",
      "loot-reveal-layer--opening",
      "loot-reveal-layer--watering",
    )
    syncAllRevealStacks()
    syncAllToolPickups()
    if (keyboardActivated && layer.dataset.lootRevealState === "revealed") {
      focusFirstPayloadControl(layer)
    }
  }, transitionDelay())
}

function handleCoverClick(event: MouseEvent): void {
  const button = event.currentTarget
  if (!(button instanceof HTMLButtonElement) || !controller) return
  const layer = closestLayer(button)
  const id = layer?.dataset.lootRevealId
  const kind = layer?.dataset.lootRevealKind as RevealKind | undefined
  if (
    !layer ||
    !id ||
    transitions.has(id) ||
    !ancestorRevealAllows(layer)
  ) {
    return
  }
  const keyboardActivated = event.detail === 0

  if (kind === "soil") {
    if (controller.activeTool() !== "shovel") {
      announce("Aktiviere zuerst die Schaufel, um den Erdhaufen wegzubuddeln.")
      return
    }
    if (!controller.digLayer(id)) return
    transitions.set(id, "digging")
    layer.classList.add("loot-reveal-layer--digging")
    announce("Der Erdhaufen wird weggebuddelt.")
    finishTransition(layer, id, keyboardActivated)
    return
  }

  if (kind !== "plant") return
  if (!controller.isPlantWatered(id)) {
    if (controller.activeTool() !== "watering-can") {
      announce("Aktiviere zuerst die Gießkanne, um die Pflanze zu gießen.")
      return
    }
    if (!controller.waterPlant(id)) return
    transitions.set(id, "watering")
    layer.classList.add("loot-reveal-layer--watering")
    announce("Die Pflanze wächst und beginnt zu blühen.")
    finishTransition(layer, id, keyboardActivated)
    return
  }
  if (!controller.openPlant(id)) return
  transitions.set(id, "opening")
  layer.classList.add("loot-reveal-layer--opening")
  announce("Die Blüte gibt den verborgenen Inhalt frei.")
  finishTransition(layer, id, keyboardActivated)
}

function parseToolRequest(host: HTMLElement, toolId: string): ToolRequest {
  const rawOptions = normalizePlaceholders(
    host.getAttribute("data-options")?.trim() ?? "",
  )
  const visibility = parseCollectibleOptions(rawOptions)
  const exploration = parseExplorationOptions(visibility.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const errors = [
    ...visibility.errors,
    ...concealment.errors,
  ]
  if (concealment.values.length > 0) {
    errors.push(`Unbekannte Werkzeugoption: ${concealment.values.join("; ")}`)
  }
  return {
    concealment: concealment.mode,
    errors,
    layers: exploration.layers,
    sourceSection: sectionFromLootId(toolId),
    valid: errors.length === 0,
    visibility: visibility.rule,
  }
}

function resolveTool(host: HTMLElement): ToolKind | null {
  const value = host.getAttribute("data-tool")?.trim()
  return isToolKind(value) ? value : null
}

function resolveToolId(host: HTMLElement, kind: ToolKind): string {
  return `tool:${kind}:${resolveRuntimeId(
    host,
    "data-tool-id",
    "lootToolRuntimeId",
    `tool:${kind}`,
  )}:inline`
}

function rewardBadge(ownerDocument: Document): HTMLSpanElement {
  const badge = ownerDocument.createElement("span")
  badge.className = "loot-exploration-pickup__reward"
  badge.setAttribute("aria-hidden", "true")
  badge.textContent = "GEFUNDEN"
  return badge
}

function toolPickupButtonFromEvent(
  event: MouseEvent,
): HTMLButtonElement | null {
  for (const candidate of event.composedPath()) {
    if (
      candidate instanceof HTMLButtonElement &&
      candidate.hasAttribute("data-loot-tool-pickup")
    ) {
      return candidate
    }
  }
  return event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>("[data-loot-tool-pickup]")
    : null
}

function handleToolPickupClick(event: MouseEvent): void {
  const button = toolPickupButtonFromEvent(event)
  const toolId = button?.dataset.lootToolPickup
  const rawKind = button?.dataset.lootToolKind
  if (
    !button ||
    !toolId ||
    !isToolKind(rawKind) ||
    !controller ||
    collectingIds.has(toolId) ||
    !eligibleToolIds.has(toolId)
  ) {
    return
  }
  const kind = rawKind
  collectingIds.add(toolId)
  if (!controller.collectTool(kind)) {
    collectingIds.delete(toolId)
    syncAllToolPickups()
    return
  }
  const keyboardActivated = event.detail === 0
  button.disabled = true
  button.classList.add("loot-exploration-pickup--collected")
  button.setAttribute("aria-label", `${TOOL_DETAILS[kind].label} gefunden`)
  renderActionTools()
  announce(
    `${TOOL_DETAILS[kind].collectedMessage} Du kannst sie jetzt in der Leiste aktivieren.`,
  )
  syncAllToolPickups()
  window.setTimeout(() => {
    collectingIds.delete(toolId)
    syncAllToolPickups()
    if (keyboardActivated) focusToolControl(kind)
  }, COLLECT_DURATION)
}

function bindToolPickupButton(button: HTMLButtonElement): void {
  if (boundToolPickupButtons.has(button)) return
  boundToolPickupButtons.add(button)
  button.addEventListener("click", handleToolPickupClick)
}

function createToolPickup(
  toolId: string,
  kind: ToolKind,
  ownerDocument: Document,
): HTMLButtonElement {
  const button = ownerDocument.createElement("button")
  button.type = "button"
  button.className = `loot-exploration-pickup loot-exploration-pickup--${kind}`
  button.dataset.lootToolPickup = toolId
  button.dataset.lootToolKind = kind
  button.setAttribute("aria-label", TOOL_DETAILS[kind].collectLabel)
  button.append(
    createExplorationToolGraphic(kind, ownerDocument),
    rewardBadge(ownerDocument),
  )
  bindToolPickupButton(button)
  return button
}

function clearToolHost(host: HTMLElement): void {
  clearHostRevealLayers(host)
  if (host.childNodes.length > 0) host.replaceChildren()
  host.hidden = false
}

function syncToolPickup(host: HTMLElement): void {
  if (!controller) return
  const kind = resolveTool(host)
  if (!kind) {
    clearToolHost(host)
    return
  }
  const toolId = resolveToolId(host, kind)
  if (controller.isToolCollected(kind) && !collectingIds.has(toolId)) {
    eligibleToolIds.delete(toolId)
    toolVisibility.forget(`tool:${toolId}`)
    clearToolHost(host)
    return
  }

  const request = parseToolRequest(host, toolId)
  if (!request.valid) {
    eligibleToolIds.delete(toolId)
    warnOnce(toolId, TOOL_DETAILS[kind].label, request.errors)
    clearToolHost(host)
    return
  }
  if (hostIsRevealBlocked(host, false)) {
    eligibleToolIds.delete(toolId)
    host.hidden = true
    return
  }
  if (!liaSlideIsAccessible(request.sourceSection)) {
    eligibleToolIds.delete(toolId)
    host.hidden = true
    return
  }
  const visible = toolVisibility.visible(
    `tool:${toolId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    syncAllToolPickups,
  )
  host.hidden = !visible
  if (!visible) {
    eligibleToolIds.delete(toolId)
    return
  }

  const contentHost = setHostRevealLayers(
    host,
    toolId,
    request.layers,
  )
  let button = contentHost.querySelector<HTMLButtonElement>(
    `[data-loot-tool-pickup="${toolId}"]`,
  )
  if (!button) {
    setHostConcealment(contentHost, null)
    contentHost.replaceChildren(
      createToolPickup(toolId, kind, host.ownerDocument),
    )
    setHostConcealment(contentHost, request.concealment)
    button = contentHost.querySelector("[data-loot-tool-pickup]")
  } else {
    setHostConcealment(contentHost, request.concealment)
  }
  if (button) bindToolPickupButton(button)
  const blocked = hostIsRevealBlocked(host)
  if (!blocked && !collectingIds.has(toolId)) eligibleToolIds.add(toolId)
  else eligibleToolIds.delete(toolId)
  button?.toggleAttribute("data-loot-reveal-blocked", blocked)
}

function syncAllToolPickups(): void {
  eligibleToolIds.clear()
  document.querySelectorAll<HTMLElement>(TOOL_TAG).forEach(syncToolPickup)
}

function controlId(kind: ToolKind): string {
  return `lia-loot-${TOOL_DETAILS[kind].slug}-tool`
}

function focusToolControl(kind: ToolKind): void {
  document.getElementById(controlId(kind))?.focus({ preventScroll: true })
}

function toolControlLabel(kind: ToolKind, active: boolean): string {
  return `${TOOL_DETAILS[kind].label} ${active ? "deaktivieren" : "aktivieren"}`
}

function createToolControl(kind: ToolKind): HTMLButtonElement {
  const button = document.createElement("button")
  button.id = controlId(kind)
  button.type = "button"
  button.className = `loot-exploration-tool loot-exploration-tool--${kind}`
  button.dataset.lootToolControl = kind
  button.append(createExplorationToolGraphic(kind))
  button.addEventListener("click", () => {
    if (!controller) return
    const active = controller.activeTool()
    controller.setActiveTool(active === kind ? null : kind)
    renderActionTools()
    announce(
      controller.activeTool() === kind
        ? `${TOOL_DETAILS[kind].label} aktiviert.`
        : `${TOOL_DETAILS[kind].label} deaktiviert.`,
    )
  })
  return button
}

function syncActiveToolCursor(activeTool: ToolKind | null): void {
  const candidates = new Set(templateDocumentCandidates(document))
  for (const candidate of activeToolDocuments) {
    if (activeTool && candidates.has(candidate)) continue
    candidate.documentElement?.removeAttribute(ACTIVE_TOOL_ATTRIBUTE)
    activeToolDocuments.delete(candidate)
  }
  if (!activeTool) return

  for (const candidate of candidates) {
    const root = candidate.documentElement
    if (!root) continue
    root.setAttribute(ACTIVE_TOOL_ATTRIBUTE, activeTool)
    activeToolDocuments.add(candidate)
  }
}

function renderActionTools(): void {
  const activeTool = controller?.activeTool() ?? null
  syncActiveToolCursor(activeTool)
  if (!controller) return
  const bar = installResourceBar()
  for (const kind of TOOL_KINDS) {
    let button = document.getElementById(
      controlId(kind),
    ) as HTMLButtonElement | null
    if (!controller.isToolCollected(kind)) {
      button?.remove()
      continue
    }
    if (!button) {
      button = createToolControl(kind)
      bar.appendChild(button)
    }
    const active = activeTool === kind
    button.classList.toggle("loot-exploration-tool--active", active)
    button.setAttribute("aria-pressed", String(active))
    button.setAttribute("aria-label", toolControlLabel(kind, active))
  }
  refreshResourceBarVisibility()
}

function parseRevealRequest(host: HTMLElement, revealId: string): RevealRequest {
  const rawOptions = normalizePlaceholders(
    host.getAttribute("data-options")?.trim() ?? "",
  )
  const visibility = parseCollectibleOptions(rawOptions)
  const exploration = parseExplorationOptions(visibility.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const layers = exploration.layers.map((layer) => ({ ...layer }))
  const errors = [...visibility.errors, ...concealment.errors]
  if (concealment.mode && layers.length > 0) {
    if (layers[0].concealment) {
      errors.push("Die äußere Freigabeschicht besitzt zwei Verbergungsarten.")
    } else {
      layers[0].concealment = concealment.mode
    }
  }
  if (concealment.values.length > 0) {
    errors.push(
      `Unbekannte Freigabeoption: ${concealment.values.join("; ")}`,
    )
  }
  if (layers.length === 0) {
    errors.push("Eine Freigabe benötigt mindestens Erde oder eine Pflanze.")
  } else if (layers.length > 1) {
    errors.push("Ein Freigabe-Container darf genau eine Schicht beschreiben.")
  }
  return {
    errors,
    layers,
    sourceSection: sectionFromLootId(revealId),
    valid: errors.length === 0,
    visibility: visibility.rule,
  }
}

function ensureAuthoredPayload(host: HTMLElement): HTMLElement {
  const remembered = authoredPayloads.get(host)
  if (remembered?.isConnected) return remembered
  let payload = host.querySelector<HTMLElement>("[data-loot-reveal-payload]")
  if (!payload) {
    payload = host.ownerDocument.createElement("div")
    payload.dataset.lootRevealPayload = "true"
    payload.hidden = true
    payload.inert = true
    payload.setAttribute("aria-hidden", "true")
    payload.append(...host.childNodes)
    host.appendChild(payload)
  }
  authoredPayloads.set(host, payload)
  return payload
}

function ancestorRevealAllows(host: HTMLElement): boolean {
  let ancestor = host.parentElement
  while (ancestor) {
    if (ancestor.hasAttribute(RANGE_BLOCKED_ATTRIBUTE)) return false
    if (
      (ancestor.hasAttribute("data-loot-reveal-layer-content") ||
        ancestor.hasAttribute("data-loot-reveal-payload")) &&
      (ancestor.hidden || ancestor.inert)
    ) {
      return false
    }
    ancestor = ancestor.parentElement
  }
  return true
}

function ensureAuthoredLayer(
  host: HTMLElement,
  payload: HTMLElement,
  stableId: string,
  layer: RevealLayerOption,
): void {
  if (managedRoot(host)) clearHostRevealLayers(host)
  const id = layerId(stableId, layer, 0)
  let cover = [...host.children].find((child) =>
    child.hasAttribute("data-loot-reveal-cover-slot"),
  ) as HTMLElement | undefined
  if (cover?.dataset.lootRevealCoverSlot !== id) {
    if (cover) {
      setHostConcealment(cover, null)
      cover.remove()
    }
    cover = host.ownerDocument.createElement("div")
    cover.className = "loot-reveal-layer__cover"
    cover.dataset.lootRevealCoverSlot = id
    cover.append(createCoverButton(id, layer.kind, host.ownerDocument))
  }
  if (cover.parentElement !== host || cover.nextElementSibling !== payload) {
    host.insertBefore(cover, payload)
  }

  host.classList.remove(
    "loot-reveal-layer--soil",
    "loot-reveal-layer--plant",
  )
  host.classList.add("loot-reveal-layer", `loot-reveal-layer--${layer.kind}`)
  host.dataset.lootRevealId = id
  host.dataset.lootRevealKind = layer.kind
  host.dataset.lootRevealConcealment = layer.concealment ?? ""
  host.dataset.lootRevealState ??= "locked"
  setHostConcealment(cover, layer.concealment)
}

function syncRevealContainer(host: HTMLElement): void {
  const revealId = `reveal:${resolveRuntimeId(
    host,
    "data-reveal-id",
    "lootRevealRuntimeId",
    "reveal",
  )}`
  const payload = ensureAuthoredPayload(host)
  const request = parseRevealRequest(host, revealId)
  if (!request.valid) {
    host.hidden = true
    payload.hidden = true
    payload.inert = true
    payload.setAttribute("aria-hidden", "true")
    warnOnce(revealId, "Freigabe", request.errors)
    return
  }

  ensureAuthoredLayer(host, payload, revealId, request.layers[0])
  const changed = syncLayer(host)
  if (changed) announceRevealChange(host)

  if (
    !host.hasAttribute(RANGE_CONTROLLER_ATTRIBUTE) &&
    !ancestorRevealAllows(host)
  ) {
    host.hidden = true
    return
  }
  if (!liaSlideIsAccessible(request.sourceSection)) {
    host.hidden = true
    return
  }
  const visible = revealVisibility.visible(
    `reveal:${revealId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    syncAllRevealContainers,
  )
  host.hidden = !visible
  if (visible) {
    const revealedChanged = syncLayer(host)
    if (revealedChanged) announceRevealChange(host)
  }
}

function syncAllRevealContainers(): void {
  document
    .querySelectorAll<HTMLElement>(REVEAL_TAG)
    .forEach(syncRevealContainer)
  syncRevealRangeGates()
}

function syncAllRevealStacks(): void {
  document
    .querySelectorAll<HTMLElement>(`[${STACK_SIGNATURE_ATTRIBUTE}]`)
    .forEach(syncRevealStack)
  syncAllRevealContainers()
}

function syncExplorationRuntime(): void {
  scheduleRevealRangeMaterialization()
  syncAllRevealContainers()
  syncAllRevealStacks()
  syncAllToolPickups()
  renderActionTools()
}

class LootToolElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-tool-id", "data-tool", "data-options"]
  }

  connectedCallback(): void {
    syncToolPickup(this)
  }

  disconnectedCallback(): void {
    const kind = resolveTool(this)
    if (!kind) return
    const id = resolveToolId(this, kind)
    toolVisibility.forget(`tool:${id}`)
    eligibleToolIds.delete(id)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncToolPickup(this)
  }
}

class LootRevealElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-reveal-id", "data-options"]
  }

  connectedCallback(): void {
    if (this.hasAttribute(RANGE_CONFIGURING_ATTRIBUTE)) return
    syncRevealContainer(this)
  }

  disconnectedCallback(): void {
    if (this.hasAttribute(RANGE_CONTROLLER_ATTRIBUTE)) return
    const id = resolveRuntimeId(
      this,
      "data-reveal-id",
      "lootRevealRuntimeId",
      "reveal",
    )
    revealVisibility.forget(`reveal:reveal:${id}`)
  }

  attributeChangedCallback(): void {
    if (
      this.isConnected &&
      !this.hasAttribute(RANGE_CONFIGURING_ATTRIBUTE)
    ) {
      syncRevealContainer(this)
    }
  }
}

class LootRevealStartElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-reveal-id", "data-reveal-kind", "data-options"]
  }

  connectedCallback(): void {
    scheduleRevealRangeMaterialization()
  }

  disconnectedCallback(): void {
    scheduleRevealRangeMaterialization()
    const id = resolveRuntimeId(
      this,
      "data-reveal-id",
      "lootRevealRuntimeId",
      "reveal",
    )
    queueMicrotask(() => {
      if (this.isConnected) return
      const replacementExists = [
        ...document.querySelectorAll<HTMLElement>(REVEAL_START_TAG),
      ].some(
        (candidate) =>
          candidate !== this &&
          resolveRuntimeId(
            candidate,
            "data-reveal-id",
            "lootRevealRuntimeId",
            "reveal",
          ) === id,
      )
      if (!replacementExists) {
        revealVisibility.forget(`reveal:reveal:${id}`)
      }
    })
  }

  attributeChangedCallback(): void {
    if (this.isConnected) scheduleRevealRangeMaterialization()
  }
}

class LootRevealEndElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-reveal-kind"]
  }

  connectedCallback(): void {
    scheduleRevealRangeMaterialization()
  }

  disconnectedCallback(): void {
    scheduleRevealRangeMaterialization()
  }

  attributeChangedCallback(): void {
    if (this.isConnected) scheduleRevealRangeMaterialization()
  }
}

export function installExploration(
  nextController: ExplorationController,
): void {
  controller = nextController
  if (!customElements.get(REVEAL_TAG)) {
    customElements.define(REVEAL_TAG, LootRevealElement)
  }
  if (!customElements.get(TOOL_TAG)) {
    customElements.define(TOOL_TAG, LootToolElement)
  }
  if (!customElements.get(REVEAL_START_TAG)) {
    customElements.define(REVEAL_START_TAG, LootRevealStartElement)
  }
  if (!customElements.get(REVEAL_END_TAG)) {
    customElements.define(REVEAL_END_TAG, LootRevealEndElement)
  }
  if (!slideActivityInstalled) {
    slideActivityInstalled = true
    observeLiaSlideActivity(syncExplorationRuntime)
  }
  if (!toolPickupListenerInstalled) {
    toolPickupListenerInstalled = true
    document.addEventListener("click", handleToolPickupClick, true)
  }
  installRevealMarkerObserver()
  scheduleRevealRangeMaterialization()
  renderActionTools()
  syncAllRevealContainers()
  syncAllToolPickups()
}
