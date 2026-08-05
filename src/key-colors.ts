export const KEY_COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "magenta",
  "white",
  "black",
  "turquoise",
  "gray",
  "brown",
] as const

export type KeyColor = (typeof KEY_COLORS)[number]
export type KeyCounts = Record<KeyColor, number>

const MYSTERY_KEY_COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
] as const satisfies readonly KeyColor[]

export interface KeyColorDetails {
  label: string
  inventoryLabel: string
  pickupLabel: string
  foundMessage: string
}

export const KEY_COLOR_DETAILS: Readonly<Record<KeyColor, KeyColorDetails>> = {
  red: {
    label: "Rot",
    inventoryLabel: "Rote Schlüssel",
    pickupLabel: "Roten Schlüssel",
    foundMessage: "Roter Schlüssel gefunden.",
  },
  blue: {
    label: "Blau",
    inventoryLabel: "Blaue Schlüssel",
    pickupLabel: "Blauen Schlüssel",
    foundMessage: "Blauer Schlüssel gefunden.",
  },
  green: {
    label: "Grün",
    inventoryLabel: "Grüne Schlüssel",
    pickupLabel: "Grünen Schlüssel",
    foundMessage: "Grüner Schlüssel gefunden.",
  },
  yellow: {
    label: "Gelb",
    inventoryLabel: "Gelbe Schlüssel",
    pickupLabel: "Gelben Schlüssel",
    foundMessage: "Gelber Schlüssel gefunden.",
  },
  purple: {
    label: "Lila",
    inventoryLabel: "Lilafarbene Schlüssel",
    pickupLabel: "Lilafarbenen Schlüssel",
    foundMessage: "Lilafarbener Schlüssel gefunden.",
  },
  orange: {
    label: "Orange",
    inventoryLabel: "Orangefarbene Schlüssel",
    pickupLabel: "Orangefarbenen Schlüssel",
    foundMessage: "Orangefarbener Schlüssel gefunden.",
  },
  magenta: {
    label: "Magenta",
    inventoryLabel: "Magentafarbene Schlüssel",
    pickupLabel: "Magentafarbenen Schlüssel",
    foundMessage: "Magentafarbener Schlüssel gefunden.",
  },
  white: {
    label: "Weiß",
    inventoryLabel: "Weiße Schlüssel",
    pickupLabel: "Weißen Schlüssel",
    foundMessage: "Weißer Schlüssel gefunden.",
  },
  black: {
    label: "Schwarz",
    inventoryLabel: "Schwarze Schlüssel",
    pickupLabel: "Schwarzen Schlüssel",
    foundMessage: "Schwarzer Schlüssel gefunden.",
  },
  turquoise: {
    label: "Türkis",
    inventoryLabel: "Türkisfarbene Schlüssel",
    pickupLabel: "Türkisfarbenen Schlüssel",
    foundMessage: "Türkisfarbener Schlüssel gefunden.",
  },
  gray: {
    label: "Grau",
    inventoryLabel: "Graue Schlüssel",
    pickupLabel: "Grauen Schlüssel",
    foundMessage: "Grauer Schlüssel gefunden.",
  },
  brown: {
    label: "Braun",
    inventoryLabel: "Braune Schlüssel",
    pickupLabel: "Braunen Schlüssel",
    foundMessage: "Brauner Schlüssel gefunden.",
  },
}

const COLOR_ALIASES: Readonly<Record<string, KeyColor>> = {
  red: "red",
  rot: "red",
  blue: "blue",
  blau: "blue",
  green: "green",
  grün: "green",
  gruen: "green",
  yellow: "yellow",
  gelb: "yellow",
  purple: "purple",
  violet: "purple",
  violett: "purple",
  lila: "purple",
  orange: "orange",
  magenta: "magenta",
  white: "white",
  weiss: "white",
  weiß: "white",
  black: "black",
  schwarz: "black",
  turquoise: "turquoise",
  türkis: "turquoise",
  tuerkis: "turquoise",
  gray: "gray",
  grey: "gray",
  grau: "gray",
  brown: "brown",
  braun: "brown",
  brau: "brown",
}

const MYSTERY_ALIASES = new Set([
  "",
  "?",
  "auto",
  "random",
  "zufall",
  "mystery",
  "unbekannt",
])

function normalizedColorRequest(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? ""
}

export function isKeyColorRequest(
  value: string | null | undefined,
): boolean {
  const normalized = normalizedColorRequest(value)
  return (
    MYSTERY_ALIASES.has(normalized) ||
    /^@\d+$/.test(normalized) ||
    COLOR_ALIASES[normalized] !== undefined
  )
}

export function createEmptyKeyCounts(): KeyCounts {
  return Object.fromEntries(
    KEY_COLORS.map((color) => [color, 0]),
  ) as KeyCounts
}

export function requestedKeyColor(
  value: string | null | undefined,
): KeyColor | null {
  const normalized = normalizedColorRequest(value)
  if (MYSTERY_ALIASES.has(normalized) || /^@\d+$/.test(normalized)) return null
  return COLOR_ALIASES[normalized] ?? null
}

export function deterministicKeyColor(keyId: string): KeyColor {
  const input = keyId.trim() || "loot-key"
  let hash = 0x811c9dc5
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  // Keep the original mystery-key palette stable so existing authored IDs do
  // not change appearance when explicit colors are added.
  return MYSTERY_KEY_COLORS[(hash >>> 0) % MYSTERY_KEY_COLORS.length]
}

export function resolveKeyAppearance(
  keyId: string,
  requested: string | null | undefined,
): { color: KeyColor; mystery: boolean } {
  const explicitColor = requestedKeyColor(requested)
  return {
    color: explicitColor ?? deterministicKeyColor(keyId),
    mystery: explicitColor === null,
  }
}
