import {
  isKeyColorRequest,
  requestedKeyColor,
  type KeyColor,
} from "./key-colors.ts"
import type { AxeUpgradeUnlock } from "./axe.ts"
import {
  requestedCatCollarColor,
  type CatCollarColor,
} from "./cat-collar.ts"
import type { ResourceKind } from "./types.ts"

export type ShopPerkKind =
  | "energy-chest"
  | "magnifier-radius"
  | "flashlight-radius"

export type ShopUnlockKind =
  | "atlas"
  | "atlas-course-counts"
  | "atlas-slide-info"
  | AxeUpgradeUnlock

export type ShopProduct =
  | { kind: "tool"; tool: "shovel" | "watering-can" | "magnifier" | "flashlight" }
  | { kind: "puzzle-piece"; color: KeyColor; number: number }
  | { kind: "resource"; resource: ResourceKind; amount: number }
  | { kind: "perk"; perk: ShopPerkKind; percent: number }
  | { kind: "collar"; color: CatCollarColor }
  | { kind: "atlas"; unlock: "atlas" }
  | {
      kind: "unlock"
      unlock: Exclude<ShopUnlockKind, "atlas">
    }

export type ShopPrice = Record<ResourceKind, number>

export interface ShopOffer {
  index: number
  product: ShopProduct
  price: ShopPrice
  source: string
}

export interface ParsedShopOptions {
  errors: string[]
  offers: ShopOffer[]
}

const MAX_OFFERS = 24
const MAX_AMOUNT = 999_999
const MAX_PERCENT = 500

function normalized(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .trim()
    .toLocaleLowerCase("de-DE")
}

function emptyPrice(): ShopPrice {
  return { diamonds: 0, energy: 0, gold: 0 }
}

function resourceKind(value: string): ResourceKind | null {
  const token = normalized(value).replace(/[\s_-]+/g, "")
  if (["gold", "goldmuenze", "goldmuenzen", "coin", "coins"].includes(token)) {
    return "gold"
  }
  if (["diamant", "diamanten", "diamond", "diamonds"].includes(token)) {
    return "diamonds"
  }
  if (["energie", "energiepunkt", "energiepunkte", "energy"].includes(token)) {
    return "energy"
  }
  return null
}

function parsePrice(raw: string): { error: string | null; price: ShopPrice } {
  const price = emptyPrice()
  const parts = raw.split("+").map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) {
    return { error: "Der Preis fehlt.", price }
  }

  for (const part of parts) {
    const match = part.match(/^(\d+)\s*([\p{L}_-]+)$/u)
    const amount = match ? Number(match[1]) : Number.NaN
    const kind = match ? resourceKind(match[2]) : null
    if (!kind || !Number.isSafeInteger(amount) || amount <= 0 || amount > MAX_AMOUNT) {
      return {
        error: `Ungültiger Preis „${part}“. Erlaubt sind z. B. 3gold, 2diamanten oder 4energie.`,
        price,
      }
    }
    if (price[kind] > 0) {
      return { error: `Die Preisressource „${kind}“ steht doppelt im selben Angebot.`, price }
    }
    price[kind] = amount
  }
  return { error: null, price }
}

function positiveValue(
  raw: string,
  label: string,
  maximum: number,
): { error: string | null; value: number } {
  const value = Number(raw)
  return Number.isSafeInteger(value) && value > 0 && value <= maximum
    ? { error: null, value }
    : { error: `${label} muss eine positive ganze Zahl bis ${maximum} sein.`, value: 0 }
}

function parseProduct(raw: string): { error: string | null; product: ShopProduct | null } {
  const token = normalized(raw).replace(/\s+/g, "-")
  const tools: Readonly<Record<string, ShopProduct>> = {
    schaufel: { kind: "tool", tool: "shovel" },
    shovel: { kind: "tool", tool: "shovel" },
    giesskanne: { kind: "tool", tool: "watering-can" },
    wateringcan: { kind: "tool", tool: "watering-can" },
    "watering-can": { kind: "tool", tool: "watering-can" },
    lupe: { kind: "tool", tool: "magnifier" },
    magnifier: { kind: "tool", tool: "magnifier" },
    taschenlampe: { kind: "tool", tool: "flashlight" },
    flashlight: { kind: "tool", tool: "flashlight" },
  }
  if (tools[token]) return { error: null, product: tools[token] }

  if (["atlaskarte", "atlas", "schriftrolle", "atlas-map"].includes(token)) {
    return { error: null, product: { kind: "atlas", unlock: "atlas" } }
  }
  if (
    [
      "atlas-kurszahlen",
      "atlaskarte-kurszahlen",
      "atlas-course-counts",
    ].includes(token)
  ) {
    return {
      error: null,
      product: { kind: "unlock", unlock: "atlas-course-counts" },
    }
  }
  if (
    [
      "atlas-folieninfo",
      "atlaskarte-folieninfo",
      "atlas-slide-info",
    ].includes(token)
  ) {
    return {
      error: null,
      product: { kind: "unlock", unlock: "atlas-slide-info" },
    }
  }

  const axeUpgrades: Readonly<Record<string, AxeUpgradeUnlock>> = {
    eisenaxt: "axe-iron",
    "eisen-axt": "axe-iron",
    ironaxe: "axe-iron",
    "iron-axe": "axe-iron",
    goldaxt: "axe-gold",
    "gold-axt": "axe-gold",
    goldaxe: "axe-gold",
    "gold-axe": "axe-gold",
    diamantaxt: "axe-diamond",
    "diamant-axt": "axe-diamond",
    diamondaxe: "axe-diamond",
    "diamond-axe": "axe-diamond",
  }
  const axeUpgrade = axeUpgrades[token]
  if (axeUpgrade) {
    return {
      error: null,
      product: { kind: "unlock", unlock: axeUpgrade },
    }
  }

  const collar = token.match(/^(?:katzenhalsband|halsband|cat-collar)-(.+)$/u)
  if (collar) {
    const color = requestedCatCollarColor(collar[1])
    return color
      ? { error: null, product: { color, kind: "collar" } }
      : {
          error: `Unbekannte Halsbandfarbe „${collar[1]}“.`,
          product: null,
        }
  }

  const puzzle = token.match(/^(?:puzzleteil|puzzle-piece)-([^-]+)-(\d+)$/u)
  if (puzzle) {
    const colorRequest =
      puzzle[1] === "turkis"
        ? "tuerkis"
        : puzzle[1] === "grun"
          ? "gruen"
          : puzzle[1]
    const color = requestedKeyColor(colorRequest)
    const number = positiveValue(puzzle[2], "Die Puzzleteilnummer", 16)
    if (!isKeyColorRequest(colorRequest) || !color) {
      return { error: `Unbekannte Puzzleteilfarbe „${colorRequest}“.`, product: null }
    }
    if (number.error) return { error: number.error, product: null }
    return {
      error: null,
      product: { color, kind: "puzzle-piece", number: number.value },
    }
  }

  const resource = token.match(/^(gold|diamanten?|diamonds?|energie|energy)-(\d+)$/u)
  if (resource) {
    const kind = resourceKind(resource[1])
    const amount = positiveValue(resource[2], "Die Ressourcenmenge", MAX_AMOUNT)
    if (!kind || amount.error) {
      return { error: amount.error ?? "Unbekannte Ressource.", product: null }
    }
    return { error: null, product: { amount: amount.value, kind: "resource", resource: kind } }
  }

  const perk = token.match(
    /^(energiekistenbonus|energy-chest|lupenradius|magnifier-radius|taschenlampenradius|flashlight-radius)-(\d+)%?$/u,
  )
  if (perk) {
    const percent = positiveValue(perk[2], "Der Prozentbonus", MAX_PERCENT)
    if (percent.error) return { error: percent.error, product: null }
    const perkKind: ShopPerkKind =
      perk[1] === "energiekistenbonus" || perk[1] === "energy-chest"
        ? "energy-chest"
        : perk[1] === "lupenradius" || perk[1] === "magnifier-radius"
          ? "magnifier-radius"
          : "flashlight-radius"
    return { error: null, product: { kind: "perk", percent: percent.value, perk: perkKind } }
  }

  return { error: `Unbekannter Shopartikel „${raw.trim()}“.`, product: null }
}

export function parseShopProduct(
  raw: string,
): { error: string | null; product: ShopProduct | null } {
  return parseProduct(raw)
}

export function parseShopOptions(raw: string): ParsedShopOptions {
  const errors: string[] = []
  const offers: ShopOffer[] = []
  const entries = raw.split(";").map((entry) => entry.trim()).filter(Boolean)

  if (entries.length > MAX_OFFERS) {
    errors.push(`Ein Shop darf höchstens ${MAX_OFFERS} Angebote enthalten.`)
  }

  entries.slice(0, MAX_OFFERS).forEach((source, index) => {
    const separator = source.indexOf("=")
    if (separator <= 0 || separator === source.length - 1) {
      errors.push(`Angebot ${index + 1}: Erwartet wird artikel=preis.`)
      return
    }
    const product = parseProduct(source.slice(0, separator))
    const price = parsePrice(source.slice(separator + 1))
    if (product.error || !product.product || price.error) {
      errors.push(`Angebot ${index + 1}: ${product.error ?? price.error}`)
      return
    }
    offers.push({ index, price: price.price, product: product.product, source })
  })

  if (offers.length === 0 && errors.length === 0) {
    errors.push("Der Shop enthält keine Angebote.")
  }
  return { errors, offers }
}
