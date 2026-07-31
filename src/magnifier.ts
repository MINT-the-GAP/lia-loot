import {
  CollectibleVisibilityGate,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  concealedContentOf,
  CONCEALMENT_CHANGED_EVENT,
  CONCEALMENT_SELECTOR,
  prepareConcealedHost,
} from "./concealment.ts"
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
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"

const MAGNIFIER_TAG = "lia-loot-magnifier"
const HIDDEN_TAG = "lia-loot-hidden"
const MAGNIFIER_TOOL_ID = "lia-loot-magnifier-tool"
const MAGNIFIER_LENS_ID = "lia-loot-magnifier-lens"
const COLLECT_DURATION = 650

interface MagnifierController {
  collected(): boolean
  collect(): boolean
}

interface MagnifierRequest {
  errors: string[]
  sourceSection: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

interface PointerPosition {
  x: number
  y: number
}

let controller: MagnifierController | null = null
let runtimeId = 0
let magnifierActive = false
let pointing = false
let lastPointer: PointerPosition | null = null
let pendingPointer: PointerPosition | null = null
let pointerFrame: number | null = null
let pointerTrackingInstalled = false
let slideActivityInstalled = false
const collectingIds = new Set<string>()
const eligibleMagnifierIds = new Set<string>()
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
  const errors = [...parsed.errors]
  if (parsed.values.length > 0) {
    errors.push(`Unbekannte Lupenoption: ${parsed.values.join("; ")}`)
  }
  return {
    errors,
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

function createMagnifierButton(magnifierId: string): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-magnifier-pickup"
  button.dataset.lootMagnifierButton = magnifierId
  button.setAttribute("aria-label", "Lupe einsammeln")
  button.append(createMagnifierGraphic(), rewardBadge())

  button.addEventListener("click", (event) => {
    if (
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
  })
  return button
}

function syncMagnifier(host: HTMLElement): void {
  if (!controller) return
  const magnifierId = resolveMagnifierId(host)
  if (controller.collected() && !collectingIds.has(magnifierId)) {
    eligibleMagnifierIds.delete(magnifierId)
    visibilityGate.forget(`magnifier:${magnifierId}`)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }

  const request = readMagnifierRequest(host, magnifierId)
  if (!request.valid) {
    eligibleMagnifierIds.delete(magnifierId)
    warnInvalidSpecification(magnifierId, request.errors)
    if (host.childElementCount > 0) host.replaceChildren()
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
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }
  eligibleMagnifierIds.add(magnifierId)

  const existing = [
    ...host.querySelectorAll<HTMLButtonElement>("[data-loot-magnifier-button]"),
  ].find((candidate) => candidate.dataset.lootMagnifierButton === magnifierId)
  if (existing) return
  host.replaceChildren(createMagnifierButton(magnifierId))
}

function syncAllMagnifiers(): void {
  eligibleMagnifierIds.clear()
  document.querySelectorAll<HTMLElement>(MAGNIFIER_TAG).forEach(syncMagnifier)
}

function ensureLens(): HTMLDivElement {
  const existing = document.getElementById(MAGNIFIER_LENS_ID)
  if (existing instanceof HTMLDivElement) return existing

  const lens = document.createElement("div")
  lens.id = MAGNIFIER_LENS_ID
  lens.className = "loot-magnifier-lens"
  lens.hidden = true
  lens.setAttribute("aria-hidden", "true")
  document.body.appendChild(lens)
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

function updateSecretTarget(
  target: HTMLElement,
  position: PointerPosition | null,
): void {
  if (!prepareConcealedHost(target)) return
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
  setSecretRevealed(
    target,
    magnifierIntersectsRect(position.x, position.y, contentRect),
  )
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
  document.documentElement.classList.add("loot-magnifier-pointing")
  updateSecretTargets(lastPointer)
}

function queuePointer(position: PointerPosition): void {
  pendingPointer = position
  if (pointerFrame !== null) return
  pointerFrame = window.requestAnimationFrame(paintPointer)
}

function stopPointing(): void {
  pointing = false
  pendingPointer = null
  if (pointerFrame !== null) window.cancelAnimationFrame(pointerFrame)
  pointerFrame = null
  ensureLens().hidden = true
  document.documentElement.classList.remove("loot-magnifier-pointing")
  updateSecretTargets(null)
}

function focusMagnifierTool(): void {
  document.getElementById(MAGNIFIER_TOOL_ID)?.focus({ preventScroll: true })
}

function applyMagnifierActive(active: boolean, announce = true): void {
  magnifierActive = Boolean(active && controller?.collected())
  document.documentElement.classList.toggle(
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
  if (!magnifierActive) stopPointing()
  if (announce) {
    announceResource(
      magnifierActive
        ? "Lupe aktiviert. Bewege den Zeiger über verborgene Bereiche."
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
    button.addEventListener("click", () => {
      applyMagnifierActive(!magnifierActive)
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
      if (!magnifierActive || !event.isPrimary) return
      queuePointer({ x: event.clientX, y: event.clientY })
    },
    { passive: true },
  )
  window.addEventListener(
    "pointerdown",
    (event) => {
      if (!magnifierActive || !event.isPrimary || event.pointerType === "mouse") {
        return
      }
      queuePointer({ x: event.clientX, y: event.clientY })
    },
    { passive: true },
  )
  window.addEventListener("pointerout", (event) => {
    if (event.pointerType === "mouse" && event.relatedTarget === null) {
      stopPointing()
    }
  })
  window.addEventListener("pointercancel", stopPointing)
  window.addEventListener("blur", stopPointing)
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
      if (magnifierActive && pointing && lastPointer) queuePointer(lastPointer)
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
    updateSecretTarget(this, pointing ? lastPointer : null)
    this.childObserver ??= new MutationObserver(() => {
      queueMicrotask(() => {
        if (this.isConnected) {
          updateSecretTarget(this, pointing ? lastPointer : null)
        }
      })
    })
    this.childObserver.observe(this, { childList: true })
    queueMicrotask(() => {
      if (this.isConnected) {
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

export function installMagnifier(nextController: MagnifierController): void {
  controller = nextController
  installPointerTracking()
  ensureLens()
  if (!slideActivityInstalled) {
    slideActivityInstalled = true
    observeLiaSlideActivity(syncMagnifierRuntime)
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
