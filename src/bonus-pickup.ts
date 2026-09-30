import { createAtlasGraphic } from "./atlas-visual.ts"
import {
  catCollarLabel,
} from "./cat-collar.ts"
import { createCatCollarGraphic } from "./cat-visual.ts"
import {
  parseBonusPickupOptions,
  type BonusPickupKind,
  type ParsedBonusPickupOptions,
} from "./bonus-options.ts"
import { CollectibleVisibilityGate } from "./collectible-visibility.ts"
import {
  setHostConcealment,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  clearHostRevealLayers,
  hostIsRevealBlocked,
  setHostRevealLayers,
} from "./exploration.ts"
import { clearHostFog, setHostFog } from "./flashlight.ts"
import { createFlashlightGraphic } from "./flashlight-visual.ts"
import { createMagnifierGraphic } from "./magnifier-visual.ts"
import { announceResource } from "./resource-bar.ts"
import { createResourceGraphic } from "./resource-visual.ts"
import {
  AXE_TIER_DETAILS,
  axeTierForUnlock,
} from "./axe.ts"
import { createExplorationToolGraphic } from "./exploration-visual.ts"
import {
  liaSlideIsAccessible,
  observeLiaSlideActivity,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"
import type { ShopGrant } from "./shop-store.ts"

const BONUS_TAG = "lia-loot-bonus"
const COLLECT_DURATION = 620

export interface BonusPickupController {
  collect(id: string, grant: ShopGrant): boolean
  collected(id: string, grant: ShopGrant): boolean
}

interface BonusRequest extends ParsedBonusPickupOptions {
  sourceSection: number | null
}

let controller: BonusPickupController | null = null
let runtimeId = 0
let slideObserverInstalled = false
let revealListenerInstalled = false
let syncQueued = false
const visibilityGate = new CollectibleVisibilityGate()
const eligibleIds = new Set<string>()
const collectingIds = new Set<string>()
const grantsById = new Map<string, ShopGrant>()
const warnedIds = new Set<string>()

function bonusKind(host: HTMLElement): BonusPickupKind | null {
  const kind = host.getAttribute("data-bonus-kind")?.trim()
  return kind === "atlas" || kind === "perk" ? kind : null
}

function resolveBonusId(host: HTMLElement, kind: BonusPickupKind): string {
  const authored = host.getAttribute("data-bonus-id")?.trim()
  if (authored && !authored.startsWith("@")) {
    return "bonus:" + kind + ":" + authored + ":inline"
  }
  if (!host.dataset.lootBonusRuntimeId) {
    runtimeId += 1
    host.dataset.lootBonusRuntimeId = "runtime-" + runtimeId
  }
  return "bonus:" + kind + ":" + host.dataset.lootBonusRuntimeId + ":inline"
}

function normalizedOptions(host: HTMLElement): string {
  const value = host.getAttribute("data-options")?.trim() ?? ""
  return /^@\d+$/u.test(value) ? "" : value
}

function requestFor(
  host: HTMLElement,
  id: string,
  kind: BonusPickupKind,
): BonusRequest {
  return {
    ...parseBonusPickupOptions(kind, normalizedOptions(host)),
    sourceSection: sectionFromLootId(id),
  }
}

function warnInvalid(id: string, errors: readonly string[]): void {
  if (warnedIds.has(id)) return
  warnedIds.add(id)
  console.warn(
    "Loot: Bonusfund " +
      id +
      " bleibt wegen ungültiger Optionen verborgen. " +
      errors.join(" "),
  )
}

function grantName(grant: ShopGrant): string {
  if (grant.kind === "collar") return catCollarLabel(grant.color)
  if (grant.kind === "unlock") {
    const axeTier = axeTierForUnlock(grant.unlock)
    if (axeTier) return `Axt-Perk „${AXE_TIER_DETAILS[axeTier].label}“`
    return grant.unlock === "atlas"
      ? "Atlaskarte"
      : grant.unlock === "atlas-course-counts"
        ? "Atlas-Perk „Kurszahlen“"
        : "Atlas-Perk „Folieninfo“"
  }
  return grant.perk === "energy-chest"
    ? "Perk +" + grant.percent + " % Energie aus Energiekisten"
    : grant.perk === "magnifier-radius"
      ? "Perk +" + grant.percent + " % Lupenradius"
      : "Perk +" + grant.percent + " % Taschenlampenradius"
}

function grantMessage(grant: ShopGrant): string {
  if (grant.kind === "collar") {
    return `${catCollarLabel(grant.color)} gefunden und der Pixelkatze angelegt.`
  }
  if (grant.kind === "unlock") {
    const axeTier = axeTierForUnlock(grant.unlock)
    if (axeTier) {
      const details = AXE_TIER_DETAILS[axeTier]
      return `Axt-Perk gefunden: ${details.label} benötigt nur noch ${details.hits} ${details.hits === 1 ? "Hieb" : "Hiebe"} pro Holzkiste.`
    }
    return grant.unlock === "atlas"
      ? "Atlaskarte gefunden. Du kannst sie jetzt in der Leiste öffnen."
      : grant.unlock === "atlas-course-counts"
        ? "Atlas-Perk gefunden: genaue Kurszahlen freigeschaltet."
        : "Atlas-Perk gefunden: Informationen zur aktuellen Folie freigeschaltet."
  }
  return grant.perk === "energy-chest"
    ? "Perk gefunden: +" + grant.percent + " % Energie aus Energiekisten."
    : grant.perk === "magnifier-radius"
      ? "Perk gefunden: +" + grant.percent + " % Lupenradius."
      : "Perk gefunden: +" + grant.percent + " % Taschenlampenradius."
}

function grantChip(grant: ShopGrant): string {
  if (grant.kind === "collar") return "HALSBAND"
  if (grant.kind === "perk") return "+" + grant.percent + " %"
  const axeTier = axeTierForUnlock(grant.unlock)
  if (axeTier) return AXE_TIER_DETAILS[axeTier].hits + "×"
  return grant.unlock === "atlas"
    ? "ATLAS"
    : grant.unlock === "atlas-course-counts"
      ? "KURS"
      : "FOLIE"
}

function grantGraphic(
  grant: ShopGrant,
  ownerDocument: Document,
): HTMLElement {
  const visual = ownerDocument.createElement("span")
  visual.className = "loot-bonus-pickup__visual"
  let graphic: SVGElement
  const axeTier =
    grant.kind === "unlock" ? axeTierForUnlock(grant.unlock) : null
  if (grant.kind === "collar") {
    graphic = createCatCollarGraphic(ownerDocument, grant.color)
  } else if (axeTier) {
    graphic = createExplorationToolGraphic("axe", ownerDocument, axeTier)
  } else if (grant.kind === "unlock") {
    graphic = createAtlasGraphic(ownerDocument)
  } else if (grant.perk === "energy-chest") {
    graphic = createResourceGraphic("energy", ownerDocument)
  } else if (grant.perk === "magnifier-radius") {
    graphic = createMagnifierGraphic()
  } else {
    graphic = createFlashlightGraphic(ownerDocument)
  }
  graphic.classList.add("loot-bonus-pickup__graphic")
  const chip = ownerDocument.createElement("span")
  chip.className = "loot-bonus-pickup__chip"
  chip.textContent = grantChip(grant)
  visual.append(graphic, chip)
  return visual
}

function foundBadge(ownerDocument: Document): HTMLSpanElement {
  const badge = ownerDocument.createElement("span")
  badge.className = "loot-bonus-pickup__reward"
  badge.setAttribute("aria-hidden", "true")
  badge.textContent = "GEFUNDEN"
  return badge
}

function createBonusButton(
  id: string,
  grant: ShopGrant,
  ownerDocument: Document,
): HTMLButtonElement {
  const button = ownerDocument.createElement("button")
  button.type = "button"
  button.className = "loot-bonus-pickup"
  button.dataset.lootBonusPickup = id
  button.setAttribute("aria-label", grantName(grant) + " einsammeln")
  button.append(grantGraphic(grant, ownerDocument), foundBadge(ownerDocument))
  button.addEventListener("click", handlePickup)
  return button
}

function buttonFromEvent(event: MouseEvent): HTMLButtonElement | null {
  for (const candidate of event.composedPath()) {
    if (
      candidate instanceof HTMLButtonElement &&
      candidate.hasAttribute("data-loot-bonus-pickup")
    ) {
      return candidate
    }
  }
  return event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>("[data-loot-bonus-pickup]")
    : null
}

function buttonIsCurrentlyEligible(
  button: HTMLButtonElement,
  id: string,
): boolean {
  const host = button.closest<HTMLElement>(BONUS_TAG)
  if (
    !host?.isConnected ||
    host.hidden ||
    button.disabled ||
    button.hasAttribute("data-loot-reveal-blocked")
  ) {
    return false
  }
  const kind = bonusKind(host)
  return Boolean(kind && resolveBonusId(host, kind) === id)
}

function focusGrantedControl(grant: ShopGrant): void {
  const selector =
    grant.kind === "collar"
      ? "#lia-loot-pet-control"
      : grant.kind === "unlock" && axeTierForUnlock(grant.unlock)
      ? "#lia-loot-axe-tool"
      : grant.kind === "unlock"
      ? "#lia-loot-atlas-tool"
      : grant.perk === "magnifier-radius"
        ? "#lia-loot-magnifier-tool"
        : grant.perk === "flashlight-radius"
          ? "#lia-loot-flashlight-tool"
          : "#lia-loot-resource-bar button"
  document.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true })
}

function handlePickup(event: MouseEvent): void {
  const button = buttonFromEvent(event)
  const id = button?.dataset.lootBonusPickup
  const grant = id ? grantsById.get(id) : null
  if (
    !button ||
    !id ||
    !grant ||
    !controller ||
    collectingIds.has(id) ||
    (!eligibleIds.has(id) && !buttonIsCurrentlyEligible(button, id))
  ) {
    return
  }
  collectingIds.add(id)
  if (!controller.collect(id, grant)) {
    collectingIds.delete(id)
    syncAllBonusPickups()
    return
  }
  const keyboardActivated = event.detail === 0
  button.disabled = true
  button.classList.add("loot-bonus-pickup--collected")
  button.setAttribute("aria-label", grantName(grant) + " gefunden")
  announceResource(grantMessage(grant))
  window.setTimeout(() => {
    collectingIds.delete(id)
    syncAllBonusPickups()
    if (keyboardActivated) focusGrantedControl(grant)
  }, COLLECT_DURATION)
}

function clearBonusHost(host: HTMLElement): void {
  clearHostFog(host)
  clearHostRevealLayers(host)
  if (host.childNodes.length > 0) host.replaceChildren()
  host.hidden = false
}

function applyPresentation(
  contentHost: HTMLElement,
  request: BonusRequest,
  id: string,
): void {
  setHostConcealment(contentHost, request.concealment as ConcealmentMode | null)
  setHostFog(contentHost, request.fog ? "bonus-fog:" + id : null)
}

function syncBonusPickup(host: HTMLElement): void {
  if (!controller) return
  const kind = bonusKind(host)
  if (!kind) {
    clearBonusHost(host)
    return
  }
  const id = resolveBonusId(host, kind)
  const request = requestFor(host, id, kind)
  if (!request.valid || !request.grant) {
    eligibleIds.delete(id)
    grantsById.delete(id)
    warnInvalid(id, request.errors)
    visibilityGate.forget(id)
    clearBonusHost(host)
    return
  }
  const grant = request.grant
  grantsById.set(id, grant)
  if (controller.collected(id, grant) && !collectingIds.has(id)) {
    eligibleIds.delete(id)
    grantsById.delete(id)
    visibilityGate.forget(id)
    clearBonusHost(host)
    return
  }
  if (
    hostIsRevealBlocked(host, false) ||
    !liaSlideIsAccessible(request.sourceSection)
  ) {
    eligibleIds.delete(id)
    host.hidden = true
    return
  }
  const visible = visibilityGate.visible(
    id,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    scheduleBonusSync,
  )
  host.hidden = !visible
  if (!visible) {
    eligibleIds.delete(id)
    return
  }
  const contentHost = setHostRevealLayers(host, id, request.layers)
  let button = contentHost.querySelector<HTMLButtonElement>(
    '[data-loot-bonus-pickup="' + id + '"]',
  )
  if (!button) {
    setHostConcealment(contentHost, null)
    clearHostFog(contentHost)
    contentHost.replaceChildren(
      createBonusButton(id, grant, host.ownerDocument),
    )
    button = contentHost.querySelector("[data-loot-bonus-pickup]")
  }
  applyPresentation(contentHost, request, id)
  const blocked = hostIsRevealBlocked(host)
  if (!blocked && !collectingIds.has(id)) eligibleIds.add(id)
  else eligibleIds.delete(id)
  button?.toggleAttribute("data-loot-reveal-blocked", blocked)
}

function syncAllBonusPickups(): void {
  eligibleIds.clear()
  document.querySelectorAll<HTMLElement>(BONUS_TAG).forEach(syncBonusPickup)
}

function scheduleBonusSync(): void {
  if (syncQueued) return
  syncQueued = true
  queueMicrotask(() => {
    syncQueued = false
    syncAllBonusPickups()
  })
}

class LootBonusElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-bonus-id", "data-bonus-kind", "data-options"]
  }

  connectedCallback(): void {
    syncBonusPickup(this)
  }

  disconnectedCallback(): void {
    const kind = bonusKind(this)
    if (!kind) return
    const id = resolveBonusId(this, kind)
    visibilityGate.forget(id)
    eligibleIds.delete(id)
    grantsById.delete(id)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncBonusPickup(this)
  }
}

export function installBonusPickups(
  nextController: BonusPickupController,
): void {
  controller = nextController
  if (!customElements.get(BONUS_TAG)) {
    customElements.define(BONUS_TAG, LootBonusElement)
  }
  if (!slideObserverInstalled) {
    slideObserverInstalled = true
    observeLiaSlideActivity(scheduleBonusSync)
  }
  if (!revealListenerInstalled) {
    revealListenerInstalled = true
    document.addEventListener("lia-loot:reveal-changed", scheduleBonusSync)
  }
  syncAllBonusPickups()
}

export function refreshBonusPickups(): void {
  syncAllBonusPickups()
}
