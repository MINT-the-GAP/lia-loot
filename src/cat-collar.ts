import {
  KEY_COLORS,
  requestedKeyColor,
  type KeyColor,
} from "./key-colors.ts"

export const CAT_COLLAR_COLORS = KEY_COLORS

export type CatCollarColor = KeyColor

const LABELS: Readonly<Record<CatCollarColor, string>> = {
  red: "Rotes Halsband",
  blue: "Blaues Halsband",
  green: "Grünes Halsband",
  yellow: "Gelbes Halsband",
  purple: "Lilafarbenes Halsband",
  orange: "Orangefarbenes Halsband",
  magenta: "Magentafarbenes Halsband",
  white: "Weißes Halsband",
  black: "Schwarzes Halsband",
  turquoise: "Türkisfarbenes Halsband",
  gray: "Graues Halsband",
  brown: "Braunes Halsband",
}

export function isCatCollarColor(value: unknown): value is CatCollarColor {
  return (
    typeof value === "string" &&
    CAT_COLLAR_COLORS.includes(value as CatCollarColor)
  )
}

export function catCollarLabel(color: CatCollarColor): string {
  return LABELS[color]
}

export function requestedCatCollarColor(value: string): CatCollarColor | null {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("de-DE")
  const alias =
    normalized === "grun"
      ? "gruen"
      : normalized === "turkis"
        ? "tuerkis"
        : normalized
  return requestedKeyColor(alias)
}
