import {
  isKeyColorRequest,
  KEY_COLOR_DETAILS,
  resolveKeyAppearance,
} from "./key-colors"
import { createKeyGraphic } from "./key-visual"
import type { KeyColor } from "./key-colors"
import {
  CollectibleVisibilityGate,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  observeLiaSlideActivity,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"

const KEY_TAG = "lia-loot-key"
const COLLECT_DURATION = 650

interface KeyPickupController {
  collected(keyId: string): boolean
  collect(keyId: string, color: KeyColor): boolean
  focusInventory(): void
}

interface KeyRequest {
  errors: string[]
  requestedColor: string | null
  sourceSection: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

let controller: KeyPickupController | null = null
let runtimeId = 0
const collectingIds = new Set<string>()
const eligibleKeyIds = new Set<string>()
const warnedInvalidSpecs = new Set<string>()
const visibilityGate = new CollectibleVisibilityGate()
let slideActivityInstalled = false

function resolvePickupId(host: HTMLElement): string {
  const authoredId = host.getAttribute("data-key-id")?.trim()
  if (authoredId && !authoredId.startsWith("@")) {
    return `key:${authoredId}:inline`
  }

  const existingId = host.dataset.lootKeyRuntimeId
  if (existingId) return existingId

  runtimeId += 1
  const generatedId = `key:runtime-${runtimeId}:inline`
  host.dataset.lootKeyRuntimeId = generatedId
  return generatedId
}

function createRewardBadge(): HTMLSpanElement {
  const reward = document.createElement("span")
  reward.className = "loot-key-pickup__reward"
  reward.setAttribute("aria-hidden", "true")
  reward.textContent = "+1"
  return reward
}

function createKeyButton(
  keyId: string,
  color: KeyColor,
): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = `loot-key-pickup loot-key-color--${color}`
  button.dataset.lootKeyButton = keyId
  button.dataset.lootKeyColor = color
  button.setAttribute(
    "aria-label",
    `${KEY_COLOR_DETAILS[color].pickupLabel} einsammeln`,
  )
  button.append(createKeyGraphic(color), createRewardBadge())

  button.addEventListener("click", (event) => {
    if (
      !controller ||
      collectingIds.has(keyId) ||
      !eligibleKeyIds.has(keyId)
    ) {
      return
    }
    collectingIds.add(keyId)

    if (!controller.collect(keyId, color)) {
      collectingIds.delete(keyId)
      syncAllKeys()
      return
    }

    const keyboardActivated = event.detail === 0
    button.disabled = true
    button.classList.add("loot-key-pickup--collected")
    button.setAttribute("aria-label", KEY_COLOR_DETAILS[color].foundMessage)

    window.setTimeout(() => {
      collectingIds.delete(keyId)
      button.remove()
      if (keyboardActivated) controller?.focusInventory()
    }, COLLECT_DURATION)
  })

  return button
}

function readKeyRequest(host: HTMLElement, keyId: string): KeyRequest {
  const authored = host.getAttribute("data-color")?.trim() ?? ""
  const parsed = parseCollectibleOptions(authored === "@0" ? "" : authored)
  const errors = [...parsed.errors]
  if (parsed.values.length > 1) {
    errors.push("Für einen Schlüssel darf höchstens eine Farbe angegeben werden.")
  } else if (
    parsed.values.length === 1 &&
    !isKeyColorRequest(parsed.values[0])
  ) {
    errors.push(`Unbekannte Schlüsselfarbe oder Option: ${parsed.values[0]}`)
  }

  return {
    errors,
    requestedColor: parsed.values[0] ?? null,
    sourceSection: sectionFromLootId(keyId),
    valid: errors.length === 0,
    visibility: parsed.rule,
  }
}

function warnInvalidSpecification(
  keyId: string,
  errors: readonly string[],
): void {
  if (warnedInvalidSpecs.has(keyId)) return
  warnedInvalidSpecs.add(keyId)
  console.warn(
    `Loot: Schlüssel ${keyId} bleibt wegen ungültiger Optionen verborgen. ${errors.join(" ")}`,
  )
}

function syncKey(host: HTMLElement): void {
  if (!controller) return
  const keyId = resolvePickupId(host)
  if (controller.collected(keyId) && !collectingIds.has(keyId)) {
    eligibleKeyIds.delete(keyId)
    visibilityGate.forget(`pickup:${keyId}`)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }

  const request = readKeyRequest(host, keyId)
  if (!request.valid) {
    eligibleKeyIds.delete(keyId)
    warnInvalidSpecification(keyId, request.errors)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }

  const { color } = resolveKeyAppearance(keyId, request.requestedColor)
  if (collectingIds.has(keyId)) return

  const visible = visibilityGate.visible(
    `pickup:${keyId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    syncAllKeys,
  )
  if (!visible) {
    eligibleKeyIds.delete(keyId)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }
  eligibleKeyIds.add(keyId)

  const existingButton = [
    ...host.querySelectorAll<HTMLButtonElement>("[data-loot-key-button]"),
  ].find((button) => button.dataset.lootKeyButton === keyId)
  if (existingButton?.dataset.lootKeyColor === color) return

  host.replaceChildren(createKeyButton(keyId, color))
}

function syncAllKeys(): void {
  eligibleKeyIds.clear()
  document.querySelectorAll<HTMLElement>(KEY_TAG).forEach(syncKey)
}

class LootKeyElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-key-id", "data-color"]
  }

  connectedCallback(): void {
    syncKey(this)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncKey(this)
  }
}

export function installKeyPickups(nextController: KeyPickupController): void {
  controller = nextController
  if (!slideActivityInstalled) {
    slideActivityInstalled = true
    observeLiaSlideActivity(syncAllKeys)
  }
  if (!customElements.get(KEY_TAG)) {
    customElements.define(KEY_TAG, LootKeyElement)
  }
  syncAllKeys()
}
