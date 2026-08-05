import {
  isOnlyOnSlideOption,
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
import type { KeyColor } from "./key-colors.ts"
import { resolveSurfaceTarget } from "./surface-targets.ts"

export const MAX_PUZZLE_SLOTS = 16

export const PUZZLE_COLORS = [
  "rot",
  "blau",
  "gruen",
  "gelb",
  "lila",
  "orange",
  "magenta",
  "weiss",
  "schwarz",
  "tuerkis",
  "grau",
  "braun",
] as const

export type PuzzleColor = (typeof PUZZLE_COLORS)[number]

const INTERNAL_COLOR: Readonly<Record<string, KeyColor>> = {
  rot: "red",
  blau: "blue",
  gruen: "green",
  grün: "green",
  gelb: "yellow",
  lila: "purple",
  orange: "orange",
  magenta: "magenta",
  weiss: "white",
  weiß: "white",
  schwarz: "black",
  tuerkis: "turquoise",
  türkis: "turquoise",
  grau: "gray",
  braun: "brown",
  brau: "brown",
}

export interface ParsedPuzzleGateOptions {
  color: KeyColor | null
  columns: number
  errors: string[]
  matrix: number[][]
  onlyOnSlide: boolean
  rows: number
  slotCount: number
  valid: boolean
}

export interface ParsedPuzzlePieceOptions {
  color: KeyColor | null
  concealment: ConcealmentMode | null
  errors: string[]
  layers: RevealLayerOption[]
  number: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

interface SplitOptions {
  errors: string[]
  tokens: string[]
}

interface ParsedMatrix {
  errors: string[]
  matrix: number[][]
}

const NUMBER_LIKE_TOKEN =
  /^[+-]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:e[+-]?\d+)?$/iu

function normalizeToken(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("de-DE")
}

function puzzleColor(value: string): KeyColor | null {
  const normalized = normalizeToken(value)
  return INTERNAL_COLOR[normalized] ?? null
}

function splitBracketAwareOptions(
  rawSpecification: string,
  emptyOptionMessage: string,
): SplitOptions {
  if (rawSpecification.trim() === "") return { errors: [], tokens: [] }

  const errors: string[] = []
  const rawTokens: string[] = []
  let depth = 0
  let tokenStart = 0

  for (let index = 0; index < rawSpecification.length; index += 1) {
    const character = rawSpecification[index]
    if (character === "[") {
      depth += 1
      continue
    }
    if (character === "]") {
      depth -= 1
      if (depth < 0) {
        errors.push("Die Puzzle-Angabe enthält eine schließende Klammer ohne Öffnung.")
        depth = 0
      }
      continue
    }
    if (character === ";" && depth === 0) {
      rawTokens.push(rawSpecification.slice(tokenStart, index))
      tokenStart = index + 1
    }
  }
  rawTokens.push(rawSpecification.slice(tokenStart))

  if (depth !== 0) {
    errors.push("Die eckigen Klammern der Puzzle-Angabe sind nicht ausgeglichen.")
  }

  const tokens = rawTokens.map((token) => token.trim())
  if (tokens.some((token) => token === "")) errors.push(emptyOptionMessage)

  return {
    errors,
    tokens: tokens.filter((token) => token !== ""),
  }
}

function parseMatrixToken(rawMatrix: string): ParsedMatrix {
  const errors: string[] = []
  const token = rawMatrix.trim()
  if (!token.startsWith("[") || !token.endsWith("]")) {
    return {
      errors: [
        "Die Puzzle-Matrix muss als [[Zelle;Zelle];[Zelle;Zelle]] angegeben werden.",
      ],
      matrix: [],
    }
  }

  const rows = splitBracketAwareOptions(
    token.slice(1, -1),
    "Die Puzzle-Matrix enthält eine leere Zeile.",
  )
  errors.push(...rows.errors)
  const matrix: number[][] = []

  for (const rawRow of rows.tokens) {
    const row = rawRow.trim()
    if (!row.startsWith("[") || !row.endsWith("]")) {
      errors.push(`Ungültige Puzzle-Zeile: ${rawRow}`)
      continue
    }

    const content = row.slice(1, -1)
    if (content.includes("[") || content.includes("]")) {
      errors.push(`Ungültig verschachtelte Puzzle-Zeile: ${rawRow}`)
      continue
    }

    const cells = content.split(";").map((cell) => cell.trim())
    if (cells.length === 0 || cells.some((cell) => cell === "")) {
      errors.push(`Die Puzzle-Zeile enthält eine leere Zelle: ${rawRow}`)
      continue
    }

    const parsedRow: number[] = []
    let rowValid = true
    for (const cell of cells) {
      if (!/^[1-9]\d*$/u.test(cell)) {
        errors.push(`Ungültige Puzzleteilnummer in der Matrix: ${cell}`)
        rowValid = false
        continue
      }
      const value = Number(cell)
      if (!Number.isSafeInteger(value)) {
        errors.push(`Zu große Puzzleteilnummer in der Matrix: ${cell}`)
        rowValid = false
        continue
      }
      parsedRow.push(value)
    }
    if (rowValid) matrix.push(parsedRow)
  }

  if (matrix.length === 0) {
    errors.push("Die Puzzle-Matrix benötigt mindestens eine Zeile mit einer Zelle.")
    return { errors, matrix: [] }
  }

  const columns = matrix[0].length
  if (matrix.some((row) => row.length !== columns)) {
    errors.push("Die Puzzle-Matrix muss streng rechteckig sein.")
  }

  const values = matrix.flat()
  if (values.length > MAX_PUZZLE_SLOTS) {
    errors.push(`Ein Puzzletor darf höchstens ${MAX_PUZZLE_SLOTS} Slots enthalten.`)
  }

  const expected = new Set(
    Array.from({ length: values.length }, (_, index) => index + 1),
  )
  const actual = new Set(values)
  if (
    actual.size !== values.length ||
    actual.size !== expected.size ||
    [...expected].some((value) => !actual.has(value))
  ) {
    errors.push(
      `Die Puzzle-Matrix muss jede Zahl von 1 bis ${values.length} genau einmal enthalten.`,
    )
  }

  return { errors, matrix }
}

function duplicateVisibilityErrors(tokens: readonly string[]): string[] {
  const errors: string[] = []
  const seen = new Set<string>()

  for (const token of tokens) {
    const parsed = parseCollectibleOptions(token)
    if (!parsed.valid || !parsed.hasOptions || parsed.values.length > 0) continue

    let optionKey: string | null = null
    let label = token
    if (parsed.rule.onlyOnSlide) {
      optionKey = "anker"
      label = "anker"
    } else if (parsed.rule.themes?.length === 1) {
      optionKey = `theme:${parsed.rule.themes[0]}`
      label = `Theme ${parsed.rule.themes[0]}`
    } else if (parsed.rule.variants?.length === 1) {
      optionKey = `variant:${parsed.rule.variants[0]}`
      label = `Farbmodus ${parsed.rule.variants[0]}`
    } else if (parsed.rule.onlyWithoutAnnotations) {
      optionKey = "annotations:hidden"
      label = "Annotationen aus"
    } else {
      optionKey = "duration"
      label = "Verzögerung"
    }

    if (seen.has(optionKey)) {
      errors.push(`Die Puzzleteiloption „${label}“ wurde doppelt angegeben.`)
    } else {
      seen.add(optionKey)
    }
  }

  return errors
}

function invalidPieceOptionErrors(values: readonly string[]): string[] {
  return values.map((value) => {
    if (resolveSurfaceTarget(value)) {
      return `Oberflächenziele sind für Puzzleteile nicht zulässig: ${value}`
    }
    if (puzzleColor(value)) {
      return `Die Puzzleteilfarbe darf nur einmal und an erster Stelle angegeben werden: ${value}`
    }
    if (NUMBER_LIKE_TOKEN.test(value)) {
      return `Die Puzzleteilnummer darf nur einmal und an zweiter Stelle angegeben werden: ${value}`
    }
    return `Unbekannte Puzzleteiloption: ${value}`
  })
}

export function parsePuzzleGateOptions(
  rawSpecification: string,
): ParsedPuzzleGateOptions {
  const split = splitBracketAwareOptions(
    rawSpecification,
    "Das Puzzletor enthält eine leere Option.",
  )
  const errors = [...split.errors]
  const colors: KeyColor[] = []
  const matrices: ParsedMatrix[] = []
  let anchorCount = 0

  for (const token of split.tokens) {
    const color = puzzleColor(token)
    if (color) {
      colors.push(color)
      continue
    }
    if (normalizeToken(token) === "anker") {
      anchorCount += 1
      continue
    }
    if (token.startsWith("[") || token.endsWith("]")) {
      matrices.push(parseMatrixToken(token))
      continue
    }
    errors.push(`Unbekannte Puzzletoroption: ${token}`)
  }

  if (colors.length !== 1) {
    errors.push("Ein Puzzletor benötigt genau eine Farbe.")
  }
  if (matrices.length !== 1) {
    errors.push("Ein Puzzletor benötigt genau eine Puzzle-Matrix.")
  }
  if (anchorCount > 1) {
    errors.push("Die Puzzletoroption „anker“ darf nur einmal angegeben werden.")
  }

  const parsedMatrix = matrices.length === 1 ? matrices[0] : null
  if (parsedMatrix) errors.push(...parsedMatrix.errors)
  const matrix = parsedMatrix?.matrix ?? []
  const rows = matrix.length
  const columns = rows > 0 ? matrix[0].length : 0
  const slotCount = matrix.reduce((total, row) => total + row.length, 0)
  const color = colors.length === 1 ? colors[0] : null

  return {
    color,
    columns,
    errors,
    matrix,
    onlyOnSlide: anchorCount === 1,
    rows,
    slotCount,
    valid:
      errors.length === 0 &&
      color !== null &&
      rows > 0 &&
      columns > 0 &&
      slotCount <= MAX_PUZZLE_SLOTS,
  }
}

export function parsePuzzlePieceOptions(
  rawSpecification: string,
): ParsedPuzzlePieceOptions {
  const split = splitBracketAwareOptions(
    rawSpecification,
    "Das Puzzleteil enthält eine leere Option.",
  )
  const errors = [...split.errors]
  const colorToken = split.tokens[0]
  const numberToken = split.tokens[1]
  const optionTokens = split.tokens.slice(2)

  const color = colorToken ? puzzleColor(colorToken) : null
  if (!colorToken) {
    errors.push("Ein Puzzleteil benötigt als erste Angabe eine Farbe.")
  } else if (!color) {
    errors.push(`Unbekannte Puzzleteilfarbe: ${colorToken}`)
  }

  let number: number | null = null
  if (!numberToken) {
    errors.push("Ein Puzzleteil benötigt als zweite Angabe eine positive Nummer.")
  } else if (!/^[1-9]\d*$/u.test(numberToken)) {
    errors.push(`Ungültige Puzzleteilnummer: ${numberToken}`)
  } else {
    const parsedNumber = Number(numberToken)
    if (
      !Number.isSafeInteger(parsedNumber) ||
      parsedNumber > MAX_PUZZLE_SLOTS
    ) {
      errors.push(
        `Die Puzzleteilnummer muss zwischen 1 und ${MAX_PUZZLE_SLOTS} liegen: ${numberToken}`,
      )
    } else {
      number = parsedNumber
    }
  }

  const rawOptions = optionTokens.join("; ")
  const visibility = parseCollectibleOptions(rawOptions)
  const exploration = parseExplorationOptions(visibility.values)
  const concealment = extractConcealmentOptions(exploration.values)
  errors.push(
    ...visibility.errors,
    ...duplicateVisibilityErrors(optionTokens),
    ...concealment.errors,
    ...invalidPieceOptionErrors(concealment.values),
  )

  return {
    color,
    concealment: concealment.mode,
    errors,
    layers: exploration.layers,
    number,
    valid: errors.length === 0 && color !== null && number !== null,
    visibility: visibility.rule,
  }
}
