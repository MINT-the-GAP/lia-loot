import { createExplorationToolGraphic } from "./exploration-visual.ts"
import { createFlashlightGraphic } from "./flashlight-visual.ts"
import { KEY_COLOR_DETAILS } from "./key-colors.ts"
import { createMagnifierGraphic } from "./magnifier-visual.ts"
import { createPuzzlePieceGraphic } from "./puzzle-visual.ts"
import { createAtlasGraphic } from "./atlas-visual.ts"
import { catCollarLabel } from "./cat-collar.ts"
import { createCatCollarGraphic } from "./cat-visual.ts"
import {
  AXE_TIER_DETAILS,
  axeTierForUnlock,
} from "./axe.ts"
import { createResourceGraphic } from "./resource-visual.ts"
import {
  parseShopOptions,
  type ShopOffer,
  type ShopPerkKind,
  type ShopPrice,
} from "./shop-options.ts"
import type { ResourceState } from "./types.ts"

const SHOP_TAG = "lia-loot-shop"
const SVG_NS = "http://www.w3.org/2000/svg"

export type ShopOfferState =
  | "available"
  | "insufficient"
  | "owned"
  | "purchased"
  | "unavailable"

export interface ShopAvailability {
  message: string
  state: ShopOfferState
}

export interface ShopPurchaseResult {
  message: string
  ok: boolean
}

export interface ShopController {
  availability(purchaseId: string, offer: ShopOffer): ShopAvailability
  buy(purchaseId: string, offer: ShopOffer): ShopPurchaseResult
  resources(): ResourceState | null
}

interface ActiveDialog {
  host: HTMLElement
  message: string
  opener: HTMLButtonElement
  overlay: HTMLDivElement
}

let controller: ShopController | null = null
let runtimeId = 0
let activeDialog: ActiveDialog | null = null
let keyListenerInstalled = false
const warned = new Set<string>()

function shopId(host: HTMLElement): string {
  const authored = host.getAttribute("data-shop-id")?.trim()
  if (authored && !authored.startsWith("@")) return authored
  if (!host.dataset.lootShopRuntimeId) {
    runtimeId += 1
    host.dataset.lootShopRuntimeId = `runtime-${runtimeId}`
  }
  return host.dataset.lootShopRuntimeId
}

function purchaseId(host: HTMLElement, offer: ShopOffer): string {
  return `shop:${shopId(host)}:offer:${offer.index}`
}

function buildingGraphic(ownerDocument: Document): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 96 80")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-shop-building")
  svg.innerHTML = `
    <rect class="loot-shop-shadow" x="8" y="72" width="80" height="5"/>
    <path class="loot-shop-outline" d="M17 28h62v44H17V28Zm-7-4h76v8H10v-8Z"/>
    <rect class="loot-shop-wall" x="21" y="32" width="54" height="36"/>
    <rect class="loot-shop-wall-light" x="25" y="36" width="46" height="5"/>
    <path class="loot-shop-roof-outline" d="M8 16h80v8H8v-8Zm8-8h64v8H16V8Z"/>
    <path class="loot-shop-roof" d="M12 16h72v8H12v-8Zm8-8h56v8H20V8Z"/>
    <path class="loot-shop-roof-light" d="M20 8h14v16H20V8Zm28 0h14v16H48V8Zm28 8h8v8h-8v-8Z"/>
    <rect class="loot-shop-sign-outline" x="31" y="27" width="34" height="17"/>
    <rect class="loot-shop-sign" x="35" y="31" width="26" height="9"/>
    <circle class="loot-shop-sign-coin" cx="48" cy="35.5" r="3"/>
    <rect class="loot-shop-window-outline" x="23" y="47" width="18" height="15"/>
    <rect class="loot-shop-window" x="27" y="51" width="10" height="7"/>
    <rect class="loot-shop-window-light" x="27" y="51" width="4" height="3"/>
    <rect class="loot-shop-door-outline" x="51" y="46" width="18" height="22"/>
    <rect class="loot-shop-door" x="55" y="50" width="10" height="18"/>
    <rect class="loot-shop-handle" x="61" y="58" width="3" height="3"/>
  `
  return svg
}

function resourceGraphic(kind: "gold" | "diamonds" | "energy", ownerDocument: Document): SVGSVGElement {
  const visualKind = kind === "gold" ? "coins" : kind === "diamonds" ? "gems" : "energy"
  const svg = createResourceGraphic(visualKind, ownerDocument)
  svg.classList.add("loot-shop-product-graphic", `loot-shop-product-graphic--${kind}`)
  return svg
}

function perkGraphic(
  perk: ShopPerkKind,
  ownerDocument: Document,
): SVGSVGElement {
  const svg =
    perk === "energy-chest"
      ? resourceGraphic("energy", ownerDocument)
      : perk === "magnifier-radius"
        ? createMagnifierGraphic()
        : createFlashlightGraphic(ownerDocument)
  svg.classList.add(
    "loot-shop-perk-graphic",
    `loot-shop-perk-graphic--${perk}`,
  )
  return svg
}

function productGraphic(offer: ShopOffer, ownerDocument: Document): SVGElement {
  const product = offer.product
  if (product.kind === "tool") {
    if (product.tool === "shovel" || product.tool === "watering-can") {
      return createExplorationToolGraphic(product.tool, ownerDocument)
    }
    return product.tool === "magnifier"
      ? createMagnifierGraphic()
      : createFlashlightGraphic()
  }
  if (product.kind === "puzzle-piece") {
    return createPuzzlePieceGraphic(product.color, product.number)
  }
  if (product.kind === "resource") {
    return resourceGraphic(product.resource, ownerDocument)
  }
  if (product.kind === "collar") {
    return createCatCollarGraphic(ownerDocument, product.color)
  }
  if (product.kind === "perk") return perkGraphic(product.perk, ownerDocument)
  if (product.kind === "unlock") {
    const axeTier = axeTierForUnlock(product.unlock)
    if (axeTier) {
      return createExplorationToolGraphic("axe", ownerDocument, axeTier)
    }
  }
  return createAtlasGraphic(ownerDocument)
}

function productText(offer: ShopOffer): { description: string; title: string } {
  const product = offer.product
  if (product.kind === "tool") {
    const title = {
      flashlight: "Taschenlampe",
      magnifier: "Lupe",
      shovel: "Schaufel",
      "watering-can": "Gießkanne",
    }[product.tool]
    return { description: "Werkzeug dauerhaft ins Inventar legen.", title }
  }
  if (product.kind === "puzzle-piece") {
    return {
      description: "Direkt ins Puzzle-Inventar legen.",
      title: `Puzzleteil ${product.number} · ${KEY_COLOR_DETAILS[product.color].label}`,
    }
  }
  if (product.kind === "resource") {
    const noun =
      product.resource === "gold"
        ? product.amount === 1 ? "Goldmünze" : "Goldmünzen"
        : product.resource === "diamonds"
          ? product.amount === 1 ? "Diamant" : "Diamanten"
          : product.amount === 1 ? "Energiepunkt" : "Energiepunkte"
    return {
      description: "Sofort dem Ressourcenbestand gutschreiben.",
      title: `${product.amount} ${noun}`,
    }
  }
  if (product.kind === "atlas") {
    return {
      description: "Zeigt den aktuellen Stand deiner Erfolge.",
      title: "Atlaskarte",
    }
  }
  if (product.kind === "collar") {
    return {
      description: "Schaltet die Farbe frei und legt das Halsband sofort an.",
      title: catCollarLabel(product.color),
    }
  }
  if (product.kind === "unlock") {
    const axeTier = axeTierForUnlock(product.unlock)
    if (axeTier) {
      const details = AXE_TIER_DETAILS[axeTier]
      return {
        description: `Zerstört eine Holzkiste mit ${details.hits} ${details.hits === 1 ? "Hieb" : "Hieben"}.`,
        title: `Axt-Perk: ${details.label}`,
      }
    }
    return product.unlock === "atlas-course-counts"
      ? {
          description: "Blendet exakte Kursmengen und Fortschrittszahlen ein.",
          title: "Atlas-Perk: genaue Kurszahlen",
        }
      : {
          description: "Zeigt, welche Funde auf der aktuellen Folie noch offen sind.",
          title: "Atlas-Perk: Folieninfo",
        }
  }
  const title =
    product.perk === "energy-chest"
      ? `+${product.percent} % Energie aus Energiekisten`
      : product.perk === "magnifier-radius"
        ? `+${product.percent} % Lupenradius`
        : `+${product.percent} % Taschenlampenradius`
  return {
    description:
      product.perk === "energy-chest"
        ? "Gilt für alle künftig geöffneten Energiekisten."
        : "Wirkt sofort und stapelt sich mit weiteren Radius-Perks.",
    title,
  }
}

function resourceLabel(kind: keyof ShopPrice, amount: number): string {
  return kind === "gold"
    ? `${amount} Gold`
    : kind === "diamonds"
      ? `${amount} ${amount === 1 ? "Diamant" : "Diamanten"}`
      : `${amount} Energie`
}

function priceElement(price: ShopPrice, ownerDocument: Document): HTMLDivElement {
  const row = ownerDocument.createElement("div")
  row.className = "loot-shop-offer__price"
  for (const kind of ["gold", "diamonds", "energy"] as const) {
    if (price[kind] <= 0) continue
    const chip = ownerDocument.createElement("span")
    chip.className = `loot-shop-price loot-shop-price--${kind}`
    chip.append(
      createResourceGraphic(
        kind === "gold" ? "coins" : kind === "diamonds" ? "gems" : "energy",
        ownerDocument,
      ),
      ownerDocument.createTextNode(resourceLabel(kind, price[kind])),
    )
    row.appendChild(chip)
  }
  return row
}

function balanceElement(ownerDocument: Document): HTMLDivElement {
  const row = ownerDocument.createElement("div")
  row.className = "loot-shop-balance"
  row.setAttribute("aria-label", "Aktueller Ressourcenbestand")
  const resources = controller?.resources() ?? null
  if (!resources) {
    row.textContent = "Ressourcen sind noch nicht aktiviert."
    return row
  }
  const values: Array<[keyof ShopPrice, number | null]> = [
    ["gold", resources.gold],
    ["diamonds", resources.diamonds],
    ["energy", resources.energy],
  ]
  for (const [kind, amount] of values) {
    if (amount === null) continue
    const chip = ownerDocument.createElement("span")
    chip.className = `loot-shop-balance__item loot-shop-price--${kind}`
    chip.append(
      createResourceGraphic(
        kind === "gold" ? "coins" : kind === "diamonds" ? "gems" : "energy",
        ownerDocument,
      ),
      ownerDocument.createTextNode(resourceLabel(kind, amount)),
    )
    row.appendChild(chip)
  }
  return row
}

function buttonText(availability: ShopAvailability): string {
  return availability.state === "available"
    ? "Kaufen"
    : availability.state === "insufficient"
      ? "Nicht genug"
      : availability.state === "purchased"
        ? "Gekauft"
        : availability.state === "owned"
          ? "Schon vorhanden"
          : "Nicht verfügbar"
}

function offerCard(
  host: HTMLElement,
  offer: ShopOffer,
  ownerDocument: Document,
): HTMLElement {
  const id = purchaseId(host, offer)
  const availability = controller?.availability(id, offer) ?? {
    message: "Der Shop wird noch geladen.",
    state: "unavailable" as const,
  }
  const card = ownerDocument.createElement("article")
  card.className = "loot-shop-offer"
  card.dataset.lootShopOffer = String(offer.index)

  const icon = ownerDocument.createElement("div")
  icon.className = "loot-shop-offer__icon"
  if (
    offer.product.kind === "perk" ||
    offer.product.kind === "unlock" ||
    offer.product.kind === "collar"
  ) {
    icon.classList.add(
      "loot-shop-offer__icon--perk",
      `loot-shop-offer__icon--${
        offer.product.kind === "perk"
          ? offer.product.perk
          : offer.product.kind === "collar"
            ? `collar-${offer.product.color}`
            : offer.product.unlock
      }`,
    )
  }
  icon.appendChild(productGraphic(offer, ownerDocument))

  const copy = ownerDocument.createElement("div")
  copy.className = "loot-shop-offer__copy"
  const text = productText(offer)
  const title = ownerDocument.createElement("h3")
  title.textContent = text.title
  const description = ownerDocument.createElement("p")
  description.textContent = text.description
  copy.append(title, description, priceElement(offer.price, ownerDocument))

  const action = ownerDocument.createElement("button")
  action.type = "button"
  action.className = "loot-shop-offer__buy"
  action.dataset.lootShopBuy = String(offer.index)
  action.disabled = availability.state !== "available"
  action.textContent = buttonText(availability)
  action.title = availability.message
  action.addEventListener("click", () => {
    if (!controller || !activeDialog) return
    const result = controller.buy(id, offer)
    activeDialog.message = result.message
    renderDialog(false, offer.index)
  })
  card.append(icon, copy, action)
  return card
}

function closeDialog(): void {
  const active = activeDialog
  if (!active) return
  activeDialog = null
  active.overlay.remove()
  document.body.classList.remove("loot-shop-open")
  if (active.opener.isConnected) active.opener.focus({ preventScroll: true })
}

function focusableDialogElements(): HTMLElement[] {
  if (!activeDialog) return []
  return [...activeDialog.overlay.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hidden)
}

function installKeyListener(): void {
  if (keyListenerInstalled) return
  keyListenerInstalled = true
  document.addEventListener("keydown", (event) => {
    if (!activeDialog) return
    if (event.key === "Escape") {
      event.preventDefault()
      closeDialog()
      return
    }
    if (event.key !== "Tab") return
    const focusable = focusableDialogElements()
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
}

function renderDialog(initial: boolean, preferredOffer?: number): void {
  const active = activeDialog
  if (!active) return
  const ownerDocument = active.overlay.ownerDocument
  const parsed = parseShopOptions(active.host.getAttribute("data-options") ?? "")
  const panel = ownerDocument.createElement("section")
  panel.className = "loot-shop-dialog"
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-modal", "true")
  panel.setAttribute("aria-labelledby", "lia-loot-shop-title")

  const header = ownerDocument.createElement("header")
  header.className = "loot-shop-dialog__header"
  const heading = ownerDocument.createElement("h2")
  heading.id = "lia-loot-shop-title"
  heading.textContent = "Loot-Laden"
  const close = ownerDocument.createElement("button")
  close.type = "button"
  close.className = "loot-shop-dialog__close"
  close.setAttribute("aria-label", "Shop schließen")
  close.textContent = "×"
  close.addEventListener("click", closeDialog)
  header.append(heading, close)

  const intro = ownerDocument.createElement("p")
  intro.className = "loot-shop-dialog__intro"
  intro.textContent = "Kaufe einmalige Gegenstände und dauerhafte Verbesserungen."

  const offers = ownerDocument.createElement("div")
  offers.className = "loot-shop-offers"
  parsed.offers.forEach((offer) => offers.appendChild(offerCard(active.host, offer, ownerDocument)))

  const status = ownerDocument.createElement("p")
  status.className = "loot-shop-dialog__status"
  status.setAttribute("aria-live", "polite")
  status.textContent = active.message

  panel.append(header, intro, balanceElement(ownerDocument))
  if (parsed.errors.length > 0) {
    const warning = ownerDocument.createElement("p")
    warning.className = "loot-shop-dialog__warning"
    warning.textContent = parsed.errors.join(" ")
    panel.appendChild(warning)
  }
  panel.append(offers, status)
  active.overlay.replaceChildren(panel)

  const preferred = preferredOffer === undefined
    ? null
    : active.overlay.querySelector<HTMLButtonElement>(
        `[data-loot-shop-offer="${preferredOffer}"] .loot-shop-offer__buy:not([disabled])`,
      )
  if (preferred) preferred.focus({ preventScroll: true })
  else if (initial) close.focus({ preventScroll: true })
}

function openDialog(host: HTMLElement, opener: HTMLButtonElement): void {
  closeDialog()
  const overlay = host.ownerDocument.createElement("div")
  overlay.className = "loot-shop-overlay"
  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) closeDialog()
  })
  host.ownerDocument.body.appendChild(overlay)
  host.ownerDocument.body.classList.add("loot-shop-open")
  activeDialog = { host, message: "", opener, overlay }
  installKeyListener()
  renderDialog(true)
}

function renderShop(host: HTMLElement): void {
  const raw = host.getAttribute("data-options") ?? ""
  const parsed = parseShopOptions(raw)
  const signature = `${shopId(host)}|${raw}`
  if (host.dataset.lootShopRender === signature) return
  host.dataset.lootShopRender = signature
  const button = host.ownerDocument.createElement("button")
  button.type = "button"
  button.className = "loot-shop-building-button"
  button.disabled = parsed.offers.length === 0
  button.setAttribute(
    "aria-label",
    parsed.offers.length === 1
      ? "Loot-Laden mit einem Angebot öffnen"
      : `Loot-Laden mit ${parsed.offers.length} Angeboten öffnen`,
  )
  button.appendChild(buildingGraphic(host.ownerDocument))
  const label = host.ownerDocument.createElement("span")
  label.className = "loot-shop-building-label"
  label.textContent = "SHOP"
  button.appendChild(label)
  button.addEventListener("click", () => openDialog(host, button))
  host.replaceChildren(button)

  if (parsed.errors.length > 0) {
    const key = `${shopId(host)}|${parsed.errors.join("|")}`
    if (!warned.has(key)) {
      warned.add(key)
      console.warn("Loot: Shop enthält ungültige Angebote. " + parsed.errors.join(" "))
    }
  }
}

class LootShopElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-options", "data-shop-id"]
  }

  connectedCallback(): void {
    renderShop(this)
  }

  disconnectedCallback(): void {
    if (activeDialog?.host === this) closeDialog()
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return
    delete this.dataset.lootShopRender
    renderShop(this)
    if (activeDialog?.host === this) renderDialog(false)
  }
}

export function refreshShops(): void {
  document.querySelectorAll<HTMLElement>(SHOP_TAG).forEach(renderShop)
  if (activeDialog) renderDialog(false)
}

export function installShops(nextController: ShopController): void {
  controller = nextController
  if (!customElements.get(SHOP_TAG)) {
    customElements.define(SHOP_TAG, LootShopElement)
  }
  refreshShops()
}
