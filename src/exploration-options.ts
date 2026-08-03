import type { ConcealmentMode } from "./concealment.ts"

export const TOOL_KINDS = ["shovel", "watering-can"] as const
export type ToolKind = (typeof TOOL_KINDS)[number]

export const REVEAL_KINDS = ["soil", "plant"] as const
export type RevealKind = (typeof REVEAL_KINDS)[number]

export interface RevealLayerOption {
  kind: RevealKind
  concealment: ConcealmentMode | null
}

export interface ParsedExplorationOptions {
  layers: RevealLayerOption[]
  values: string[]
}

const DIRECT_LAYER_KINDS: Readonly<Record<string, RevealKind>> = {
  erde: "soil",
  erdhaufen: "soil",
  soil: "soil",
  dirt: "soil",
  pflanze: "plant",
  blume: "plant",
  plant: "plant",
  flower: "plant",
}

const COUPLED_CONCEALMENTS: Readonly<Record<string, ConcealmentMode>> = {
  dust: "dust",
  solid: "solid",
  unsichtbar: "solid",
  verdeckt: "solid",
  zauberstaub: "dust",
}

function normalizeToken(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("de-DE")
}

function optionTokens(input: string | readonly string[]): string[] {
  const values = typeof input === "string" ? [input] : input
  return values.flatMap((value) => value.split(";"))
}

export function parseExplorationOptions(
  input: string | readonly string[],
): ParsedExplorationOptions {
  const layers: RevealLayerOption[] = []
  const values: string[] = []

  for (const rawToken of optionTokens(input)) {
    const token = rawToken.trim()
    if (!token) continue

    const normalized = normalizeToken(token)
    const coupledSeparator = normalized.lastIndexOf("-")
    if (coupledSeparator > 0) {
      const kind = DIRECT_LAYER_KINDS[normalized.slice(0, coupledSeparator)]
      const concealment =
        COUPLED_CONCEALMENTS[normalized.slice(coupledSeparator + 1)]
      if (kind && concealment) {
        layers.push({ kind, concealment })
        continue
      }
    }

    const kind = DIRECT_LAYER_KINDS[normalized]
    if (kind) {
      layers.push({ kind, concealment: null })
      continue
    }

    values.push(token)
  }

  return { layers, values }
}
