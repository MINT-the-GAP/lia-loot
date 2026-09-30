export const CAT_VARIANTS = [
  "orange",
  "grey",
  "black",
  "white",
  "calico",
] as const

export type CatVariant = (typeof CAT_VARIANTS)[number]

export const DEFAULT_CAT_VARIANT: CatVariant = "orange"

interface CatVariantDefinition {
  label: string
  pickupLabel: string
}

const DEFINITIONS: Readonly<Record<CatVariant, CatVariantDefinition>> = {
  orange: {
    label: "Orange Katze",
    pickupLabel: "Pixelkatze einsammeln",
  },
  grey: {
    label: "Graue Katze",
    pickupLabel: "Graue Pixelkatze einsammeln",
  },
  black: {
    label: "Schwarze Katze",
    pickupLabel: "Schwarze Pixelkatze einsammeln",
  },
  white: {
    label: "Weiße Katze",
    pickupLabel: "Weiße Pixelkatze einsammeln",
  },
  calico: {
    label: "Dreifarbige Katze",
    pickupLabel: "Dreifarbige Pixelkatze einsammeln",
  },
}

const VARIANT_BY_OPTION: Readonly<Record<string, CatVariant>> = {
  orange: "orange",
  rot: "orange",
  rote: "orange",
  grau: "grey",
  graue: "grey",
  gray: "grey",
  grey: "grey",
  schwarz: "black",
  schwarze: "black",
  black: "black",
  weiß: "white",
  weiss: "white",
  weiße: "white",
  weisse: "white",
  white: "white",
  calico: "calico",
  dreifarbig: "calico",
  dreifarbige: "calico",
  glückskatze: "calico",
  glueckskatze: "calico",
}

export interface CatVariantOptions {
  errors: string[]
  values: string[]
  variant: CatVariant
}

function normalize(value: string): string {
  return value.trim().normalize("NFKC").toLocaleLowerCase("de-DE")
}

export function isCatVariant(value: unknown): value is CatVariant {
  return typeof value === "string" && CAT_VARIANTS.includes(value as CatVariant)
}

export function catVariantLabel(variant: CatVariant): string {
  return DEFINITIONS[variant].label
}

export function catVariantPickupLabel(variant: CatVariant): string {
  return DEFINITIONS[variant].pickupLabel
}

export function extractCatVariantOptions(
  values: readonly string[],
): CatVariantOptions {
  const errors: string[] = []
  const remaining: string[] = []
  let variant: CatVariant | null = null

  for (const value of values) {
    const normalized = normalize(value)
    const assignment = /^(?:farbe|color|katze)\s*=\s*(.+)$/u.exec(normalized)
    const nextVariant = VARIANT_BY_OPTION[assignment?.[1] ?? normalized]
    if (!nextVariant) {
      if (assignment) errors.push(`Unbekannte Katzenfarbe: ${value}`)
      else remaining.push(value)
      continue
    }
    if (variant) {
      errors.push(
        variant === nextVariant
          ? `Die Katzenfarbe „${value}“ wurde doppelt angegeben.`
          : "Pro Katze kann nur eine Farbe angegeben werden.",
      )
      continue
    }
    variant = nextVariant
  }

  return {
    errors,
    values: remaining,
    variant: variant ?? DEFAULT_CAT_VARIANT,
  }
}
