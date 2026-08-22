import {
  CollectibleVisibilityGate,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  concealmentIdOf,
  concealedContentOf,
  CONCEALMENT_CHANGED_EVENT,
  CONCEALMENT_SELECTOR,
  extractConcealmentOptions,
  prepareConcealedHost,
  setHostConcealment,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  parseExplorationOptions,
  type RevealLayerOption,
} from "./exploration-options.ts"
import { normalizeHiddenMacroArgumentText } from "./hidden-arguments.ts"
import {
  clearHostRevealLayers,
  hostIsRevealBlocked,
  REVEAL_CHANGED_EVENT,
  setHostRevealLayers,
} from "./exploration.ts"
import {
  MAGNIFIER_RADIUS,
  magnifierIntersectsRect,
} from "./magnifier-geometry.ts"
import { createMagnifierGraphic } from "./magnifier-visual.ts"
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

const MAGNIFIER_TAG = "lia-loot-magnifier"
const HIDDEN_TAG = "lia-loot-hidden"
const MAGNIFIER_TOOL_ID = "lia-loot-magnifier-tool"
const MAGNIFIER_LENS_ID = "lia-loot-magnifier-lens"
const COLLECT_DURATION = 650
const TOUCH_LENS_MARGIN = 8
const TOUCH_PAN_STEP = 12

interface MagnifierController {
  collected(): boolean
  collect(): boolean
  find(concealmentId: string, mode: ConcealmentMode): void
}

interface MagnifierRequest {
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

interface TouchPanGesture {
  origin: PointerPosition
  pointerId: number
  start: PointerPosition
}

let controller: MagnifierController | null = null
let runtimeId = 0
let magnifierActive = false
let pointing = false
let touchMode = false
let touchPanGesture: TouchPanGesture | null = null
let lastPrimaryPointerType = ""
let lastPointer: PointerPosition | null = null
let pendingPointer: PointerPosition | null = null
let pointerFrame: number | null = null
let pointerTrackingInstalled = false
let pickupListenerInstalled = false
let slideActivityInstalled = false
let revealListenerInstalled = false
let revealSyncQueued = false
const collectingIds = new Set<string>()
const eligibleMagnifierIds = new Set<string>()
const boundMagnifierButtons = new WeakSet<HTMLButtonElement>()
const boundMagnifierPanHandles = new WeakSet<HTMLButtonElement>()
const warnedInvalidSpecs = new Set<string>()
const visibilityGate = new CollectibleVisibilityGate()

function resolveMagnifierId(host: HTMLElement): string {
  const authoredId = host.getAttribute("data-magnifier-id")?.trim()
  if (authoredId && !authoredId.startsWith("@")) {
    return `magnifier:${authoredId}:inline`
  }

  const existingId = host.dataset.lootMagnifierRuntimeId
  if (existingId) return existingId

  runtimeId += 1
  const generatedId = `magnifier:runtime-${runtimeId}:inline`
  host.dataset.lootMagnifierRuntimeId = generatedId
  return generatedId
}

function normalizeMacroPlaceholder(value: string): string {
  return /^@\d+$/u.test(value) ? "" : value
}

function readMagnifierRequest(
  host: HTMLElement,
  magnifierId: string,
): MagnifierRequest {
  const authored = normalizeMacroPlaceholder(
    host.getAttribute("data-options")?.trim() ?? "",
  )
  const parsed = parseCollectibleOptions(authored)
  const exploration = parseExplorationOptions(parsed.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const errors = [...parsed.errors, ...concealment.errors]
  if (concealment.values.length > 0) {
    errors.push(`Unbekannte Lupenoption: ${concealment.values.join("; ")}`)
  }
  return {
    concealment: concealment.mode,
    errors,
    layers: exploration.layers,
    sourceSection: sectionFromLootId(magnifierId),
    valid: errors.length === 0,
    visibility: parsed.rule,
  }
}

function warnInvalidSpecification(
  magnifierId: string,
  errors: readonly string[],
): void {
  if (warnedInvalidSpecs.has(magnifierId)) return
  warnedInvalidSpecs.add(magnifierId)
  console.warn(
    `Loot: Lupe ${magnifierId} bleibt wegen ungültiger Optionen verborgen. ${errors.join(" ")}`,
  )
}

function rewardBadge(): HTMLSpanElement {
  const reward = document.createElement("span")
  reward.className = "loot-magnifier-pickup__reward"
  reward.setAttribute("aria-hidden", "true")
  reward.textContent = "GEFUNDEN"
  return reward
}

function magnifierButtonFromEvent(
  event: MouseEvent,
): HTMLButtonElement | null {
  for (const candidate of event.composedPath()) {
    if (
      candidate instanceof HTMLButtonElement &&
      candidate.hasAttribute("data-loot-magnifier-button")
    ) {
      return candidate
    }
  }
  return event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>(
        "[data-loot-magnifier-button]",
      )
    : null
}

function handleMagnifierPickupClick(event: MouseEvent): void {
  const button = magnifierButtonFromEvent(event)
  const magnifierId = button?.dataset.lootMagnifierButton
  if (
    !button ||
    !magnifierId ||
    !controller ||
    collectingIds.has(magnifierId) ||
    !eligibleMagnifierIds.has(magnifierId)
  ) {
    return
  }
  collectingIds.add(magnifierId)
  if (!controller.collect()) {
    collectingIds.delete(magnifierId)
    syncAllMagnifiers()
    return
  }

  const keyboardActivated = event.detail === 0
  button.disabled = true
  button.classList.add("loot-magnifier-pickup--collected")
  button.setAttribute("aria-label", "Lupe gefunden")
  renderMagnifierTool()
  announceResource("Lupe gefunden. Du kannst sie jetzt in der Leiste aktivieren.")
  syncAllMagnifiers()

  window.setTimeout(() => {
    collectingIds.delete(magnifierId)
    button.remove()
    syncAllMagnifiers()
    if (keyboardActivated) focusMagnifierTool()
  }, COLLECT_DURATION)
}

function bindMagnifierButton(button: HTMLButtonElement): void {
  if (boundMagnifierButtons.has(button)) return
  boundMagnifierButtons.add(button)
  button.addEventListener("click", handleMagnifierPickupClick)
}

function createMagnifierButton(magnifierId: string): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-magnifier-pickup"
  button.dataset.lootMagnifierButton = magnifierId
  button.setAttribute("aria-label", "Lupe einsammeln")
  button.append(createMagnifierGraphic(), rewardBadge())
  bindMagnifierButton(button)
  return button
}

function syncMagnifier(host: HTMLElement): void {
  if (!controller) return
  const magnifierId = resolveMagnifierId(host)
  if (controller.collected() && !collectingIds.has(magnifierId)) {
    eligibleMagnifierIds.delete(magnifierId)
    visibilityGate.forget(`magnifier:${magnifierId}`)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }

  const request = readMagnifierRequest(host, magnifierId)
  if (!request.valid) {
    eligibleMagnifierIds.delete(magnifierId)
    warnInvalidSpecification(magnifierId, request.errors)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }
  if (hostIsRevealBlocked(host, false)) {
    eligibleMagnifierIds.delete(magnifierId)
    host.hidden = true
    return
  }
  if (!liaSlideIsAccessible(request.sourceSection)) {
    eligibleMagnifierIds.delete(magnifierId)
    clearHostRevealLayers(host)
    host.hidden = true
    return
  }

  const visible = visibilityGate.visible(
    `magnifier:${magnifierId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    syncAllMagnifiers,
  )
  if (!visible) {
    eligibleMagnifierIds.delete(magnifierId)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }
  host.hidden = false

  const contentHost = setHostRevealLayers(host, magnifierId, request.layers)
  const existing = [
    ...contentHost.querySelectorAll<HTMLButtonElement>("[data-loot-magnifier-button]"),
  ].find((candidate) => candidate.dataset.lootMagnifierButton === magnifierId)
  if (!existing) {
    setHostConcealment(contentHost, null)
    contentHost.replaceChildren(createMagnifierButton(magnifierId))
  } else bindMagnifierButton(existing)
  setHostConcealment(contentHost, request.concealment)
  if (!hostIsRevealBlocked(host)) eligibleMagnifierIds.add(magnifierId)
  else eligibleMagnifierIds.delete(magnifierId)
}

function syncAllMagnifiers(): void {
  eligibleMagnifierIds.clear()
  document.querySelectorAll<HTMLElement>(MAGNIFIER_TAG).forEach(syncMagnifier)
}

function clampTouchLensPosition(position: PointerPosition): PointerPosition {
  const horizontalMargin = Math.min(
    MAGNIFIER_RADIUS + TOUCH_LENS_MARGIN,
    window.innerWidth / 2,
  )
  const verticalMargin = Math.min(
    MAGNIFIER_RADIUS + TOUCH_LENS_MARGIN,
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

function defaultTouchLensPosition(): PointerPosition {
  return clampTouchLensPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })
}

function finishTouchPan(handle: HTMLButtonElement, pointerId?: number): void {
  if (
    pointerId !== undefined &&
    touchPanGesture?.pointerId !== pointerId
  ) {
    return
  }
  touchPanGesture = null
  handle.classList.remove("loot-magnifier-pan--dragging")
  if (
    pointerId !== undefined &&
    handle.hasPointerCapture(pointerId)
  ) {
    handle.releasePointerCapture(pointerId)
  }
}

function bindMagnifierPanHandle(handle: HTMLButtonElement): void {
  if (boundMagnifierPanHandles.has(handle)) return
  boundMagnifierPanHandles.add(handle)

  handle.addEventListener("pointerdown", (event) => {
    if (
      !magnifierActive ||
      !touchMode ||
      !event.isPrimary ||
      event.pointerType !== "touch"
    ) {
      return
    }
    event.stopPropagation()
    const origin = pendingPointer ?? lastPointer ?? defaultTouchLensPosition()
    touchPanGesture = {
      origin,
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
    }
    handle.classList.add("loot-magnifier-pan--dragging")
    handle.setPointerCapture(event.pointerId)
  })

  handle.addEventListener("pointermove", (event) => {
    const gesture = touchPanGesture
    if (!gesture || gesture.pointerId !== event.pointerId) return
    event.stopPropagation()
    queuePointer(
      clampTouchLensPosition({
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
  handle.addEventListener("lostpointercapture", () => {
    finishTouchPan(handle)
  })
  handle.addEventListener("keydown", (event) => {
    if (!magnifierActive || !touchMode) return
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
    const origin = pendingPointer ?? lastPointer ?? defaultTouchLensPosition()
    queuePointer(
      clampTouchLensPosition({
        x: origin.x + movement.x,
        y: origin.y + movement.y,
      }),
    )
  })
}

function ensureMagnifierPanHandle(lens: HTMLDivElement): HTMLButtonElement {
  let handle = lens.querySelector<HTMLButtonElement>(".loot-magnifier-pan")
  if (!handle) {
    handle = document.createElement("button")
    handle.type = "button"
    handle.className = "loot-magnifier-pan"
    handle.setAttribute("aria-label", "Lupe verschieben")
    handle.title = "Lupe verschieben"
    handle.hidden = true
    lens.appendChild(handle)
  }
  bindMagnifierPanHandle(handle)
  return handle
}

function ensureLens(): HTMLDivElement {
  const existing = document.getElementById(MAGNIFIER_LENS_ID)
  const lens =
    existing instanceof HTMLDivElement ? existing : document.createElement("div")
  if (!(existing instanceof HTMLDivElement)) {
    lens.id = MAGNIFIER_LENS_ID
    lens.className = "loot-magnifier-lens"
    lens.hidden = true
    lens.setAttribute("aria-hidden", "true")
    document.body.appendChild(lens)
  }
  ensureMagnifierPanHandle(lens)
  return lens
}

function setSecretRevealed(
  target: HTMLElement,
  revealed: boolean,
): void {
  target.classList.toggle("loot-magnifier-secret--under-lens", revealed)
  target.setAttribute("aria-hidden", String(!revealed))
  target.inert = !revealed
}

function concealedTargetIsRendered(
  target: HTMLElement,
  content: HTMLElement,
): boolean {
  if (!target.isConnected || content.getClientRects().length === 0) return false
  const rect = content.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return false

  let ancestor = target.parentElement
  while (ancestor) {
    if (
      ancestor.hidden ||
      ancestor.inert ||
      ancestor.getAttribute("aria-hidden") === "true"
    ) {
      return false
    }
    ancestor = ancestor.parentElement
  }
  return true
}

function updateSecretTarget(
  target: HTMLElement,
  position: PointerPosition | null,
): void {
  normalizeHiddenMacroArguments(target)
  const mode = prepareConcealedHost(target)
  if (!mode) return
  const content = concealedContentOf(target)
  if (!content) return
  const targetRect = target.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  target.style.setProperty(
    "--loot-secret-left",
    `${contentRect.left - targetRect.left}px`,
  )
  target.style.setProperty(
    "--loot-secret-top",
    `${contentRect.top - targetRect.top}px`,
  )
  target.style.setProperty("--loot-secret-width", `${contentRect.width}px`)
  target.style.setProperty("--loot-secret-height", `${contentRect.height}px`)
  if (!position || !magnifierActive || !pointing) {
    setSecretRevealed(target, false)
    return
  }

  target.style.setProperty(
    "--loot-magnifier-x",
    `${position.x - contentRect.left}px`,
  )
  target.style.setProperty(
    "--loot-magnifier-y",
    `${position.y - contentRect.top}px`,
  )
  const wasRevealed = target.classList.contains(
    "loot-magnifier-secret--under-lens",
  )
  const revealed =
    concealedTargetIsRendered(target, content) &&
    magnifierIntersectsRect(position.x, position.y, contentRect)
  setSecretRevealed(target, revealed)
  if (!revealed || wasRevealed) return

  const concealmentId = concealmentIdOf(target)
  if (concealmentId) controller?.find(concealmentId, mode)
}

function updateSecretTargets(position: PointerPosition | null): void {
  document
    .querySelectorAll<HTMLElement>(CONCEALMENT_SELECTOR)
    .forEach((target) => updateSecretTarget(target, position))
}

function syncMagnifierRuntime(): void {
  syncAllMagnifiers()
  updateSecretTargets(pointing ? lastPointer : null)
}

function scheduleMagnifierRuntimeSync(): void {
  if (revealSyncQueued) return
  revealSyncQueued = true
  queueMicrotask(() => {
    revealSyncQueued = false
    syncMagnifierRuntime()
  })
}

function paintPointer(): void {
  pointerFrame = null
  if (!pendingPointer || !magnifierActive) return
  lastPointer = pendingPointer
  pendingPointer = null
  pointing = true
  const lens = ensureLens()
  lens.style.left = `${lastPointer.x}px`
  lens.style.top = `${lastPointer.y}px`
  lens.hidden = false
  document.body.classList.add("loot-magnifier-pointing")
  updateSecretTargets(lastPointer)
}

function queuePointer(position: PointerPosition): void {
  pendingPointer = position
  if (pointerFrame !== null) return
  pointerFrame = window.requestAnimationFrame(paintPointer)
}

function applyTouchMode(active: boolean): void {
  touchMode = Boolean(active && magnifierActive)
  const lens = ensureLens()
  const handle = ensureMagnifierPanHandle(lens)
  lens.classList.toggle("loot-magnifier-lens--touch", touchMode)
  document.body.classList.toggle("loot-magnifier-touch", touchMode)
  handle.hidden = !touchMode
  handle.tabIndex = touchMode ? 0 : -1
  lens.setAttribute("aria-hidden", String(!touchMode))
  if (!touchMode) finishTouchPan(handle)
}

function showPersistentTouchLens(): void {
  if (!magnifierActive) return
  applyTouchMode(true)
  queuePointer(clampTouchLensPosition(lastPointer ?? defaultTouchLensPosition()))
}

function stopPointing(): void {
  pointing = false
  pendingPointer = null
  if (pointerFrame !== null) window.cancelAnimationFrame(pointerFrame)
  pointerFrame = null
  ensureLens().hidden = true
  document.body.classList.remove("loot-magnifier-pointing")
  updateSecretTargets(null)
}

function focusMagnifierTool(): void {
  document.getElementById(MAGNIFIER_TOOL_ID)?.focus({ preventScroll: true })
}

function applyMagnifierActive(
  active: boolean,
  announce = true,
  activationPointerType = "",
): void {
  magnifierActive = Boolean(active && controller?.collected())
  document.body.classList.toggle(
    "loot-magnifier-active",
    magnifierActive,
  )
  const button = document.getElementById(MAGNIFIER_TOOL_ID)
  button?.classList.toggle("loot-magnifier-tool--active", magnifierActive)
  button?.setAttribute("aria-pressed", String(magnifierActive))
  button?.setAttribute(
    "aria-label",
    magnifierActive ? "Lupe deaktivieren" : "Lupe aktivieren",
  )
  if (!magnifierActive) {
    applyTouchMode(false)
    stopPointing()
  } else if (activationPointerType === "touch" || touchMode) {
    showPersistentTouchLens()
  }
  if (announce) {
    announceResource(
      magnifierActive
        ? touchMode
          ? "Lupe aktiviert. Ziehe sie am Griff und tippe Inhalte im Lupenkreis an."
          : "Lupe aktiviert. Bewege den Zeiger über verborgene Bereiche."
        : "Lupe deaktiviert.",
    )
  }
}

function renderMagnifierTool(): void {
  if (!controller?.collected()) {
    document.getElementById(MAGNIFIER_TOOL_ID)?.remove()
    applyMagnifierActive(false, false)
    refreshResourceBarVisibility()
    return
  }

  let button = document.getElementById(
    MAGNIFIER_TOOL_ID,
  ) as HTMLButtonElement | null
  if (!button) {
    button = document.createElement("button")
    button.id = MAGNIFIER_TOOL_ID
    button.type = "button"
    button.className = "loot-magnifier-tool"
    button.dataset.lootMagnifierTool = "true"
    button.append(createMagnifierGraphic())
    button.addEventListener("click", (event) => {
      const activationPointerType =
        event.detail === 0 ? "" : lastPrimaryPointerType
      applyMagnifierActive(
        !magnifierActive,
        true,
        activationPointerType,
      )
    })
    installResourceBar().appendChild(button)
  }
  applyMagnifierActive(magnifierActive, false)
  refreshResourceBarVisibility()
}

function installPointerTracking(): void {
  if (pointerTrackingInstalled) return
  pointerTrackingInstalled = true

  window.addEventListener(
    "pointermove",
    (event) => {
      if (
        !magnifierActive ||
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
      if (!magnifierActive) return
      if (event.pointerType === "touch") {
        if (!touchMode || !pointing) showPersistentTouchLens()
        return
      }
      if (event.pointerType === "mouse") return
      queuePointer({ x: event.clientX, y: event.clientY })
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
  window.addEventListener(
    "scroll",
    () => {
      if (magnifierActive && pointing && lastPointer) queuePointer(lastPointer)
    },
    { passive: true },
  )
  window.addEventListener(
    "resize",
    () => {
      if (!magnifierActive || !pointing || !lastPointer) return
      queuePointer(
        touchMode ? clampTouchLensPosition(lastPointer) : lastPointer,
      )
    },
    { passive: true },
  )
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !magnifierActive) return
    event.preventDefault()
    applyMagnifierActive(false)
    focusMagnifierTool()
  })
  document.addEventListener(CONCEALMENT_CHANGED_EVENT, () => {
    updateSecretTargets(pointing ? lastPointer : null)
  })
}

class LootMagnifierElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-magnifier-id", "data-options"]
  }

  connectedCallback(): void {
    syncMagnifier(this)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncMagnifier(this)
  }
}

class LootHiddenElement extends HTMLElement {
  private childObserver: MutationObserver | null = null

  static get observedAttributes(): string[] {
    return ["data-loot-concealment"]
  }

  connectedCallback(): void {
    normalizeHiddenMacroArguments(this)
    updateSecretTarget(this, pointing ? lastPointer : null)
    this.childObserver ??= new MutationObserver(() => {
      queueMicrotask(() => {
        if (this.isConnected) {
          normalizeHiddenMacroArguments(this)
          updateSecretTarget(this, pointing ? lastPointer : null)
        }
      })
    })
    this.childObserver.observe(this, { childList: true })
    queueMicrotask(() => {
      if (this.isConnected) {
        normalizeHiddenMacroArguments(this)
        updateSecretTarget(this, pointing ? lastPointer : null)
      }
    })
  }

  disconnectedCallback(): void {
    this.childObserver?.disconnect()
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      updateSecretTarget(this, pointing ? lastPointer : null)
    }
  }
}

function normalizeHiddenMacroArguments(host: HTMLElement): void {
  const content = concealedContentOf(host)
  const roots = content ? [host, content] : [host]
  for (const root of roots) {
    for (const node of root.childNodes) {
      if (!(node instanceof Text) || node.nodeValue === null) continue
      const normalized = normalizeHiddenMacroArgumentText(node.nodeValue)
      if (normalized !== node.nodeValue) node.nodeValue = normalized
    }
  }
}

export function installMagnifier(nextController: MagnifierController): void {
  controller = nextController
  installPointerTracking()
  ensureLens()
  if (!slideActivityInstalled) {
    slideActivityInstalled = true
    observeLiaSlideActivity(syncMagnifierRuntime)
  }
  if (!revealListenerInstalled) {
    revealListenerInstalled = true
    document.addEventListener(REVEAL_CHANGED_EVENT, scheduleMagnifierRuntimeSync)
  }
  if (!pickupListenerInstalled) {
    pickupListenerInstalled = true
    document.addEventListener("click", handleMagnifierPickupClick, true)
  }
  if (!customElements.get(HIDDEN_TAG)) {
    customElements.define(HIDDEN_TAG, LootHiddenElement)
  }
  if (!customElements.get(MAGNIFIER_TAG)) {
    customElements.define(MAGNIFIER_TAG, LootMagnifierElement)
  }
  renderMagnifierTool()
  syncAllMagnifiers()
  updateSecretTargets(null)
}

export { MAGNIFIER_RADIUS }
