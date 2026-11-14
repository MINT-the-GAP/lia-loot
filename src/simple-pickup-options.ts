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
  parseExplorationOptions,
  type RevealLayerOption,
} from "./exploration-options.ts"

export interface ParsedSimplePickupOptions {
  concealment: ConcealmentMode | null
  errors: string[]
  initiallyOwned?: true
  layers: RevealLayerOption[]
  valid: boolean
  visibility: CollectibleVisibilityRule
}

export function parseSimplePickupOptions(
  rawOptions: string,
  unknownOptionLabel: string,
): ParsedSimplePickupOptions {
  const visibility = parseCollectibleOptions(rawOptions)
  const exploration = parseExplorationOptions(visibility.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const conflicts: string[] = []
  if (concealment.mode) conflicts.push("unsichtbar/zauberstaub")
  if (exploration.layers.length > 0) conflicts.push("erde-/pflanze-Schichten")
  const errors = [
    ...visibility.errors,
    ...concealment.errors,
    ...startInventoryConflictErrors(visibility.initiallyOwned, conflicts),
  ]
  if (concealment.values.length > 0) {
    errors.push(`${unknownOptionLabel}: ${concealment.values.join("; ")}`)
  }
  return {
    concealment: concealment.mode,
    errors,
    ...(visibility.initiallyOwned ? { initiallyOwned: true as const } : {}),
    layers: exploration.layers,
    valid: errors.length === 0,
    visibility: visibility.rule,
  }
}
