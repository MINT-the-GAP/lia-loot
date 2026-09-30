import {
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  parseExplorationOptions,
  type RevealLayerOption,
} from "./exploration-options.ts"
import { parseShopProduct } from "./shop-options.ts"
import type { ShopGrant } from "./shop-store.ts"

export type BonusPickupKind = "atlas" | "perk"

export interface ParsedBonusPickupOptions {
  concealment: ConcealmentMode | null
  errors: string[]
  fog: boolean
  grant: ShopGrant | null
  layers: RevealLayerOption[]
  valid: boolean
  visibility: CollectibleVisibilityRule
}

const FOG_OPTIONS = new Set([
  "darkness",
  "dunkel",
  "dunkelheit",
  "fog",
  "nebel",
])

function normalize(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("de-DE")
}

function splitPerkOptions(rawOptions: string): {
  options: string
  product: string | null
} {
  const tokens = rawOptions
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean)

  return {
    options: tokens.slice(1).join("; "),
    product: tokens[0] ?? null,
  }
}

function extractFogOptions(raw: string): {
  enabled: boolean
  errors: string[]
  options: string
} {
  const errors: string[] = []
  const values: string[] = []
  let enabled = false
  for (const rawToken of raw.split(";")) {
    const token = rawToken.trim()
    if (!token) continue
    if (!FOG_OPTIONS.has(normalize(token))) {
      values.push(token)
      continue
    }
    if (enabled) {
      errors.push("Nebel beziehungsweise Dunkelheit darf nur einmal angegeben werden.")
    }
    enabled = true
  }
  return { enabled, errors, options: values.join("; ") }
}

function perkGrant(
  values: readonly string[],
): { errors: string[]; grant: ShopGrant | null } {
  if (values.length !== 1) {
    return {
      errors: [
        values.length === 0
          ? "Der Perk fehlt."
          : "Unbekannte Perkoptionen: " + values.slice(1).join("; "),
      ],
      grant: null,
    }
  }
  const parsed = parseShopProduct(values[0])
  if (parsed.error || !parsed.product) {
    return { errors: [parsed.error ?? "Der Perk ist ungültig."], grant: null }
  }
  if (parsed.product.kind === "perk") {
    return {
      errors: [],
      grant: {
        kind: "perk",
        percent: parsed.product.percent,
        perk: parsed.product.perk,
      },
    }
  }
  if (parsed.product.kind === "unlock") {
    return {
      errors: [],
      grant: { kind: "unlock", unlock: parsed.product.unlock },
    }
  }
  if (parsed.product.kind === "collar") {
    return {
      errors: [],
      grant: { kind: "collar", color: parsed.product.color },
    }
  }
  return {
    errors: [
      parsed.product.kind === "atlas"
        ? "Die Atlaskarte wird mit @Atlaskarte platziert."
        : "„" + values[0] + "“ ist kein findbarer Perk.",
    ],
    grant: null,
  }
}

export function parseBonusPickupOptions(
  kind: BonusPickupKind,
  rawOptions: string,
): ParsedBonusPickupOptions {
  const authored =
    kind === "perk"
      ? splitPerkOptions(rawOptions)
      : { options: rawOptions, product: null }
  const fog = extractFogOptions(authored.options)
  const visibility = parseCollectibleOptions(fog.options)
  const concealment = extractConcealmentOptions(visibility.values)
  const exploration = parseExplorationOptions(concealment.values)
  const parsedGrant =
    kind === "atlas"
      ? exploration.values.length === 0
        ? {
            errors: [] as string[],
            grant: {
              kind: "unlock",
              unlock: "atlas",
            } as ShopGrant,
          }
        : {
            errors: [
              "Unbekannte Atlasoptionen: " + exploration.values.join("; "),
            ],
            grant: null,
          }
      : perkGrant(authored.product ? [authored.product] : [])
  if (kind === "perk" && exploration.values.length > 0) {
    parsedGrant.errors.push(
      `Unbekannte Perkoptionen: ${exploration.values.join(", ")}.`,
    )
  }
  const errors = [
    ...fog.errors,
    ...visibility.errors,
    ...concealment.errors,
    ...parsedGrant.errors,
  ]
  return {
    concealment: concealment.mode,
    errors,
    fog: fog.enabled,
    grant: errors.length === 0 ? parsedGrant.grant : null,
    layers: exploration.layers,
    valid: errors.length === 0 && parsedGrant.grant !== null,
    visibility: visibility.rule,
  }
}
