import {
  parseCollectibleOptions,
  startInventoryConflictErrors,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  extractCatVariantOptions,
  type CatVariant,
} from "./cat-catalog.ts"
import {
  parseExplorationOptions,
  type RevealLayerOption,
} from "./exploration-options.ts"

export interface ParsedCatPickupOptions {
  concealment: ConcealmentMode | null
  errors: string[]
  initiallyOwned?: true
  layers: RevealLayerOption[]
  valid: boolean
  variant: CatVariant
  visibility: CollectibleVisibilityRule
}

export function parseCatPickupOptions(
  rawOptions: string,
): ParsedCatPickupOptions {
  const visibility = parseCollectibleOptions(rawOptions)
  const exploration = parseExplorationOptions(visibility.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const color = extractCatVariantOptions(concealment.values)
  const conflicts: string[] = []
  if (concealment.mode) conflicts.push("unsichtbar/zauberstaub")
  if (exploration.layers.length > 0) conflicts.push("erde-/pflanze-Schichten")
  const errors = [
    ...visibility.errors,
    ...concealment.errors,
    ...color.errors,
    ...startInventoryConflictErrors(visibility.initiallyOwned, conflicts),
  ]
  if (color.values.length > 0) {
    errors.push(`Unbekannte Katzenoption: ${color.values.join("; ")}`)
  }
  return {
    concealment: concealment.mode,
    errors,
    ...(visibility.initiallyOwned ? { initiallyOwned: true as const } : {}),
    layers: exploration.layers,
    valid: errors.length === 0,
    variant: color.variant,
    visibility: visibility.rule,
  }
}
