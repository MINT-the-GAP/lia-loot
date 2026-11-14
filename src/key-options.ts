import { isKeyColorRequest } from "./key-colors.ts"
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
import { resolveSurfaceTarget, type SurfaceTarget } from "./surface-targets.ts"

export interface ParsedKeyPickupOptions {
  concealment: ConcealmentMode | null
  errors: string[]
  inline: boolean
  initiallyOwned?: true
  layers: RevealLayerOption[]
  placement: SurfaceTarget | null
  requestedColor: string | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

export function parseKeyPickupOptions(
  rawSpecification: string,
): ParsedKeyPickupOptions {
  const parsed = parseCollectibleOptions(
    rawSpecification.trim() === "@0" ? "" : rawSpecification,
  )
  const exploration = parseExplorationOptions(parsed.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const errors = [...parsed.errors, ...concealment.errors]
  let placement: SurfaceTarget | null = null
  let requestedColor: string | null = null

  for (const value of concealment.values) {
    const target = resolveSurfaceTarget(value)
    if (target) {
      if (placement) {
        errors.push("Für einen Schlüssel darf höchstens ein Oberflächenziel angegeben werden.")
      } else {
        placement = target
      }
      continue
    }

    if (isKeyColorRequest(value)) {
      if (requestedColor !== null) {
        errors.push("Für einen Schlüssel darf höchstens eine Farbe angegeben werden.")
      } else {
        requestedColor = value
      }
      continue
    }

    errors.push(`Unbekannte Schlüsselfarbe, Zielangabe oder Option: ${value}`)
  }

  errors.push(
    ...startInventoryConflictErrors(
      parsed.initiallyOwned,
      [
        ...(concealment.mode ? ["unsichtbar/zauberstaub"] : []),
        ...(exploration.layers.length > 0
          ? ["erde-/pflanze-Schichten"]
          : []),
        ...(placement ? ["Oberflächenziel"] : []),
      ],
    ),
  )

  return {
    concealment: concealment.mode,
    errors,
    inline: placement === null,
    ...(parsed.initiallyOwned ? { initiallyOwned: true as const } : {}),
    layers: exploration.layers,
    placement,
    requestedColor,
    valid: errors.length === 0,
    visibility: parsed.rule,
  }
}
