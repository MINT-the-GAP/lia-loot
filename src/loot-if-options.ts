import { resolveLockTarget, type LockTarget } from "./lock-targets.ts"
import type { ResourceKind } from "./types.ts"
import type { KeyColor } from "./key-colors.ts"

export const LOOT_IF_ACTIONS = ["spawn"] as const
export type LootIfAction = (typeof LOOT_IF_ACTIONS)[number]

export const MARKER_COLORS = [
  "yellow",
  "green",
  "blue",
  "pink",
  "orange",
  "red",
] as const
export type MarkerColor = (typeof MARKER_COLORS)[number]

export type LootIfComparator = ">" | ">=" | "=" | "<=" | "<"

export type LootIfCondition =
  | { kind: "previous-quiz" }
  | { kind: "current-slide-quizzes" }
  | {
      kind: "solved-quizzes"
      comparator: LootIfComparator
      value: number
    }
  | {
      kind: "resource"
      resource: ResourceKind
      comparator: LootIfComparator
      value: number
    }
  | {
      kind: "opened-chests"
      reward: ResourceKind
      comparator: LootIfComparator
      value: number
    }
  | { kind: "lock-opened"; target: LockTarget }
  | { kind: "puzzle-gate-opened"; color: KeyColor }
  | { kind: "secret-slide-visited" }
  | { kind: "magnifier-found" }
  | { kind: "word-highlighted"; color: MarkerColor; word: string | null }

export interface LootIfOptions {
  action: LootIfAction | null
  condition: LootIfCondition | null
  errors: string[]
  valid: boolean
}

function normalizedText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/ß/gu, "ss")
    .replace(/[‐‑‒–—−_]+/gu, "-")
    .replace(/\s+/gu, " ")
}

export function normalizeHighlightedWord(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("de-DE")
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
}

function fixedKey(value: string): string {
  return normalizedText(value).replace(/[\s-]+/gu, "-")
}

function parseComparator(value: string): LootIfComparator | null {
  const normalized = normalizedText(value)
  if (normalized === ">" || normalized === "grosser") return ">"
  if (
    normalized === ">=" ||
    normalized === "=>" ||
    normalized === "mindestens" ||
    normalized === "grosser oder gleich"
  ) {
    return ">="
  }
  if (
    normalized === "=" ||
    normalized === "==" ||
    normalized === "gleich"
  ) {
    return "="
  }
  if (
    normalized === "<=" ||
    normalized === "=<" ||
    normalized === "hochstens" ||
    normalized === "kleiner oder gleich"
  ) {
    return "<="
  }
  if (normalized === "<" || normalized === "kleiner") return "<"
  return null
}

function parseNumber(value: string, integerOnly = false): number | null {
  const normalized = value.trim().replace(",", ".")
  if (!/^\d+(?:\.\d+)?$/u.test(normalized)) return null
  const number = Number(normalized)
  if (
    !Number.isFinite(number) ||
    number < 0 ||
    number > Number.MAX_SAFE_INTEGER
  ) {
    return null
  }
  if (integerOnly && !Number.isInteger(number)) return null
  return number
}

function resourceKind(value: string): ResourceKind | null {
  const key = fixedKey(value)
  if (["gold", "munzen", "goldmunzen", "coins"].includes(key)) {
    return "gold"
  }
  if (["diamant", "diamanten", "diamonds", "gems"].includes(key)) {
    return "diamonds"
  }
  if (["energie", "energy"].includes(key)) return "energy"
  return null
}

function chestReward(value: string): ResourceKind | null {
  const key = fixedKey(value)
  if (
    ["schatztruhe", "schatztruhen", "goldkiste", "goldkisten"].includes(
      key,
    )
  ) {
    return "gold"
  }
  if (
    [
      "diamantkiste",
      "diamantkisten",
      "diamantenkiste",
      "diamantenkisten",
      "diamanttruhe",
      "diamanttruhen",
      "diamond-chest",
      "diamond-chests",
    ].includes(key)
  ) {
    return "diamonds"
  }
  if (
    ["energiekiste", "energiekisten", "energy-chest", "energy-chests"].includes(
      key,
    )
  ) {
    return "energy"
  }
  if (["treasure-chest", "treasure-chests"].includes(key)) return "gold"
  return null
}

function markerColor(value: string): MarkerColor | null {
  const key = fixedKey(value)
  const aliases: Readonly<Record<string, MarkerColor>> = {
    yellow: "yellow",
    gelb: "yellow",
    green: "green",
    grun: "green",
    gruen: "green",
    blue: "blue",
    blau: "blue",
    pink: "pink",
    rosa: "pink",
    orange: "orange",
    red: "red",
    rot: "red",
  }
  return aliases[key] ?? null
}

function puzzleColor(value: string): KeyColor | null {
  const aliases: Readonly<Record<string, KeyColor>> = {
    rot: "red",
    red: "red",
    blau: "blue",
    blue: "blue",
    grun: "green",
    gruen: "green",
    green: "green",
    gelb: "yellow",
    yellow: "yellow",
    lila: "purple",
    violett: "purple",
    purple: "purple",
    orange: "orange",
    magenta: "magenta",
    weiss: "white",
    white: "white",
    schwarz: "black",
    black: "black",
    turkis: "turquoise",
    tuerkis: "turquoise",
    turquoise: "turquoise",
    grau: "gray",
    gray: "gray",
    grey: "gray",
    braun: "brown",
    brau: "brown",
    brown: "brown",
  }
  return aliases[fixedKey(value)] ?? null
}

function comparisonMatch(
  trigger: string,
): { comparator: LootIfComparator; label: string; value: string } | null {
  const normalized = normalizedText(trigger)
  const match =
    /^(.*?)\s*(>=|=>|<=|=<|==|=|>|<|mindestens|hochstens|grosser(?:\s+oder\s+gleich)?|kleiner(?:\s+oder\s+gleich)?|gleich)\s*(\d+(?:[.,]\d+)?)$/u.exec(
      normalized,
    )
  if (!match) return null
  const comparator = parseComparator(match[2])
  return comparator
    ? { comparator, label: match[1].trim(), value: match[3] }
    : null
}

function parseHighlightCondition(trigger: string): LootIfCondition | null {
  const comparison =
    /^\s*(?:markiert|marked)\s*(?:=|:)\s*([^:]+?)\s*$/iu.exec(trigger) ??
    /^\s*(?:ein\s+)?wort\s+(?:wurde\s+)?mit\s+(?:der\s+farbe\s+)?([^\s]+)\s+markiert\s*$/iu.exec(
      trigger,
    )
  if (comparison) {
    const color = markerColor(comparison[1])
    if (color) return { kind: "word-highlighted", color, word: null }
  }

  const compact = /^\s*(?:markiert|marked)\s*:\s*([^:]+?)\s*:\s*(.+?)\s*$/iu.exec(
    trigger,
  )
  if (compact) {
    const color = markerColor(compact[1])
    const word = compact[2].trim()
    if (color && word) return { kind: "word-highlighted", color, word }
  }

  const natural =
    /^\s*wort\s+(?:"([^"]+)"|„([^“]+)“|'([^']+)'|(.+?))\s+mit\s+(?:der\s+farbe\s+)?([^\s]+)\s+markiert\s*$/iu.exec(
      trigger,
    )
  if (!natural) return null
  const color = markerColor(natural[5])
  const word = (natural[1] ?? natural[2] ?? natural[3] ?? natural[4] ?? "").trim()
  return color && word ? { kind: "word-highlighted", color, word } : null
}

export function parseLootIfCondition(trigger: string): LootIfCondition | null {
  const key = fixedKey(trigger)
  if (
    [
      "vorherige-aufgabe",
      "vorherige-aufgabe-gelost",
      "vorherige-aufgabe-geloest",
      "previous-task",
      "previous-task-solved",
      "previous-quiz",
      "previous-quiz-solved",
    ].includes(key)
  ) {
    return { kind: "previous-quiz" }
  }
  if (
    [
      "folienaufgaben-gelost",
      "folienaufgaben-geloest",
      "aktuelle-folie-gelost",
      "aktuelle-folie-geloest",
      "alle-aufgaben-der-aktuellen-folie-gelost",
      "alle-aufgaben-der-aktuellen-folie-geloest",
      "slide-tasks-solved",
      "slide-quizzes-solved",
    ].includes(key)
  ) {
    return { kind: "current-slide-quizzes" }
  }
  if (["geheimfolie-besucht", "geheime-folie-besucht"].includes(key)) {
    return { kind: "secret-slide-visited" }
  }
  if (key === "secret-slide-visited") return { kind: "secret-slide-visited" }
  if (["lupe-gefunden", "lupe-eingesammelt"].includes(key)) {
    return { kind: "magnifier-found" }
  }
  if (key === "magnifier-found") return { kind: "magnifier-found" }

  const puzzle =
    /^\s*(?:puzzletor|puzzle-gate)\s*:\s*(.+?)\s*$/iu.exec(trigger) ??
    /^\s*(rot(?:es)?|blau(?:es)?|gr(?:ü|ue)n(?:es)?|gelb(?:es)?|lila(?:farbenes)?|orangefarbenes|magentafarbenes|wei(?:ß|ss)es|schwarzes|t(?:ü|ue)rkisfarbenes|graues|braunes)\s+puzzletor\s+(?:geöffnet|geoeffnet)\s*$/iu.exec(
      trigger,
    )
  if (puzzle) {
    const color = puzzleColor(
      puzzle[1]
        .replace(/farbenes$/iu, "")
        .replace(/es$/iu, ""),
    )
    if (color) return { kind: "puzzle-gate-opened", color }
  }

  const highlighted = parseHighlightCondition(trigger)
  if (highlighted) return highlighted

  const minimumTasks =
    /^mindestens\s+(\d+)\s+(?:bewertbare\s+)?aufgaben\s+(?:gelost|geloest)$/u.exec(
      normalizedText(trigger),
    )
  if (minimumTasks) {
    const value = parseNumber(minimumTasks[1], true)
    if (value === null) return null
    return {
      kind: "solved-quizzes",
      comparator: ">=",
      value,
    }
  }

  const naturalChests =
    /^(\d+)\s+(.+?)\s+(?:geoffnet|geoeffnet|eingesammelt)$/u.exec(
      normalizedText(trigger),
    )
  if (naturalChests) {
    const reward = chestReward(naturalChests[2])
    const value = parseNumber(naturalChests[1], true)
    if (reward && value !== null) {
      return {
        kind: "opened-chests",
        reward,
        comparator: ">=",
        value,
      }
    }
  }

  const lock =
    /^(?:schloss|lock)\s*:\s*(.+?)\s*$/iu.exec(trigger) ??
    /^\s*schloss\s+(.+?)\s+(?:geoffnet|geoeffnet|entsperrt)\s*$/iu.exec(
      normalizedText(trigger),
    )
  if (lock) {
    const target = resolveLockTarget(lock[1])
    if (target) return { kind: "lock-opened", target }
  }

  const comparison = comparisonMatch(trigger)
  if (!comparison) return null
  const value = parseNumber(comparison.value)
  if (value === null) return null

  const taskLabel = fixedKey(comparison.label)
  if (
    [
      "aufgaben",
      "bewertbare-aufgaben",
      "geloste-aufgaben",
      "geloeste-aufgaben",
      "tasks",
      "quizzes",
      "scoreable-tasks",
    ].includes(taskLabel)
  ) {
    if (!Number.isInteger(value)) return null
    return {
      kind: "solved-quizzes",
      comparator: comparison.comparator,
      value,
    }
  }

  const resource = resourceKind(comparison.label)
  if (resource) {
    return {
      kind: "resource",
      resource,
      comparator: comparison.comparator,
      value,
    }
  }

  const reward = chestReward(comparison.label)
  if (reward && Number.isInteger(value)) {
    return {
      kind: "opened-chests",
      reward,
      comparator: comparison.comparator,
      value,
    }
  }
  return null
}

export function compareLootIfNumbers(
  actual: number,
  comparator: LootIfComparator,
  expected: number,
): boolean {
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) return false
  if (comparator === ">") return actual > expected
  if (comparator === ">=") return actual >= expected
  if (comparator === "=") return actual === expected
  if (comparator === "<=") return actual <= expected
  return actual < expected
}

export function parseLootIfOptions(value: string | null | undefined): LootIfOptions {
  const parts = (value ?? "").split(";").map((part) => part.trim())
  const errors: string[] = []
  if (
    parts.length !== 2 ||
    parts.some((part) => part.length === 0 || /^@\d+$/u.test(part))
  ) {
    errors.push("Erwartet wird @lootif(Trigger; spawn).")
  }

  const condition = parts[0] ? parseLootIfCondition(parts[0]) : null
  if (!condition) errors.push("Der lootif-Trigger ist unbekannt oder ungültig.")

  const action = normalizedText(parts[1] ?? "") === "spawn" ? "spawn" : null
  if (!action) errors.push('Als Aktion wird derzeit nur "spawn" unterstützt.')

  return {
    action,
    condition,
    errors,
    valid: errors.length === 0 && parts.length === 2,
  }
}
