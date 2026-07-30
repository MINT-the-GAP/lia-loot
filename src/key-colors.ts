export const KEY_COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
] as const

export type KeyColor = (typeof KEY_COLORS)[number]
export type KeyCounts = Record<KeyColor, number>

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
  return {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
    purple: 0,
    orange: 0,
  }
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
  return KEY_COLORS[(hash >>> 0) % KEY_COLORS.length]
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
