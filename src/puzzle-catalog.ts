import type {
  CoursePuzzleDiscovery,
  CoursePuzzleGateDeclaration,
  CoursePuzzlePieceDeclaration,
} from "./puzzle-declarations.ts"
import type { KeyColor } from "./key-colors.ts"
import {
  parsePuzzleGateOptions,
  parsePuzzlePieceOptions,
  type ParsedPuzzleGateOptions,
  type ParsedPuzzlePieceOptions,
} from "./puzzle-options.ts"
import type { PuzzleGateConfiguration } from "./puzzle-store.ts"

export interface PuzzlePieceDefinition
  extends CoursePuzzlePieceDeclaration,
    ParsedPuzzlePieceOptions {
  id: string
}

export interface PuzzleGateDefinition
  extends CoursePuzzleGateDeclaration,
    ParsedPuzzleGateOptions {
  id: string
  pattern: number[]
}

export interface PuzzleCatalog {
  errors: string[]
  gates: PuzzleGateDefinition[]
  pieces: PuzzlePieceDefinition[]
  signature: string
}

function hash(value: string): string {
  let result = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 0x01000193)
  }
  return (result >>> 0).toString(36)
}

function colorName(color: KeyColor): string {
  return {
    red: "rot",
    blue: "blau",
    green: "gruen",
    yellow: "gelb",
    purple: "lila",
    orange: "orange",
    magenta: "magenta",
    white: "weiss",
    black: "schwarz",
    turquoise: "tuerkis",
    gray: "grau",
    brown: "braun",
  }[color]
}

function puzzleSignature(discovery: CoursePuzzleDiscovery): string {
  const declarations = [
    ...discovery.gates.map(({ gated, options, section, sourceOrder }) => ({
      kind: "gate" as const,
      gated,
      options: options.trim(),
      section,
      sourceOrder,
    })),
    ...discovery.pieces.map(({ gated, options, section, sourceOrder }) => ({
      kind: "piece" as const,
      gated,
      options: options.trim(),
      section,
      sourceOrder,
    })),
  ].sort((left, right) => left.sourceOrder - right.sourceOrder)
  const normalized = declarations.map(({ sourceOrder: _sourceOrder, ...entry }) =>
    entry,
  )
  return "puzzle-" + hash(JSON.stringify(normalized))
}

function parsedPiece(
  declaration: CoursePuzzlePieceDeclaration,
): PuzzlePieceDefinition | null {
  const parsed = parsePuzzlePieceOptions(declaration.options)
  if (!parsed.color || parsed.number === null) return null
  return {
    ...declaration,
    ...parsed,
    errors: [...parsed.errors],
    id: "puzzle-piece:" + parsed.color + ":" + parsed.number,
  }
}

function parsedGate(
  declaration: CoursePuzzleGateDeclaration,
): PuzzleGateDefinition {
  const parsed = parsePuzzleGateOptions(declaration.options)
  return {
    ...declaration,
    ...parsed,
    errors: [...parsed.errors],
    id: parsed.color
      ? "puzzle-gate:" + parsed.color
      : "puzzle-gate:invalid:" +
        declaration.section +
        ":" +
        declaration.sourceOrder,
    pattern: parsed.matrix.flat(),
  }
}

function addGateError(gate: PuzzleGateDefinition, message: string): void {
  if (!gate.errors.includes(message)) gate.errors.push(message)
  gate.valid = false
}

export function buildPuzzleCatalog(
  discovery: CoursePuzzleDiscovery,
): PuzzleCatalog {
  const errors: string[] = []
  const gates: PuzzleGateDefinition[] = []
  const pieces: PuzzlePieceDefinition[] = []

  for (const declaration of discovery.gates) {
    const gate = parsedGate(declaration)
    if (!gate.color) {
      errors.push(
        "Puzzletor auf Folie " +
          (declaration.section + 1) +
          ": " +
          gate.errors.join(" "),
      )
    }
    gates.push(gate)
  }
  for (const declaration of discovery.pieces) {
    const piece = parsedPiece(declaration)
    if (!piece) {
      const parsed = parsePuzzlePieceOptions(declaration.options)
      errors.push(
        "Puzzleteil auf Folie " +
          (declaration.section + 1) +
          ": " +
          parsed.errors.join(" "),
      )
      continue
    }
    pieces.push(piece)
  }

  const gatesByColor = new Map<KeyColor, PuzzleGateDefinition[]>()
  for (const gate of gates) {
    if (!gate.color) continue
    const group = gatesByColor.get(gate.color) ?? []
    group.push(gate)
    gatesByColor.set(gate.color, group)
  }

  for (const [color, group] of gatesByColor) {
    if (group.length > 1) {
      const message =
        "Für die Farbe " + colorName(color) + " darf es nur ein Puzzletor geben."
      group.forEach((gate) => addGateError(gate, message))
    }
  }

  const piecesByColor = new Map<KeyColor, PuzzlePieceDefinition[]>()
  for (const piece of pieces) {
    const group = piecesByColor.get(piece.color!) ?? []
    group.push(piece)
    piecesByColor.set(piece.color!, group)
  }

  for (const gate of gates) {
    if (gate.gated) {
      addGateError(
        gate,
        "Ein Puzzletor darf nicht innerhalb von @lootif, @Erdhaufen oder @Pflanze stehen.",
      )
    }
    if (!gate.color) {
      gate.valid = false
      continue
    }
    const color = gate.color
    const colorPieces = piecesByColor.get(color) ?? []
    for (const piece of colorPieces) {
      if (!piece.valid) {
        addGateError(
          gate,
          "Puzzleteil " + piece.number + ": " + piece.errors.join(" "),
        )
      }
    }

    const counts = new Map<number, number>()
    colorPieces.forEach((piece) =>
      counts.set(piece.number!, (counts.get(piece.number!) ?? 0) + 1),
    )
    for (const expected of gate.pattern) {
      const count = counts.get(expected) ?? 0
      if (count === 0) {
        addGateError(gate, "Das Puzzleteil " + expected + " fehlt.")
      } else if (count > 1) {
        addGateError(
          gate,
          "Das Puzzleteil " + expected + " wurde mehrfach deklariert.",
        )
      }
    }
    for (const piece of colorPieces) {
      if (!gate.pattern.includes(piece.number!)) {
        addGateError(
          gate,
          "Puzzleteil " + piece.number + " gehört nicht zur Matrix dieses Tors.",
        )
      }
      if (
        piece.section > gate.section ||
        (piece.section === gate.section && piece.sourceOrder > gate.sourceOrder)
      ) {
        addGateError(
          gate,
          "Puzzleteil " + piece.number + " liegt hinter seinem eigenen Tor.",
        )
      }
    }
    gate.valid = gate.valid && gate.errors.length === 0
  }

  for (const [color, colorPieces] of piecesByColor) {
    if (gatesByColor.has(color)) continue
    errors.push(
      "Für " +
        colorPieces.length +
        " Puzzleteil(e) der Farbe " +
        colorName(color) +
        " fehlt ein Puzzletor.",
    )
  }

  gates.sort((left, right) => left.sourceOrder - right.sourceOrder)
  pieces.sort((left, right) => left.sourceOrder - right.sourceOrder)
  return {
    errors,
    gates,
    pieces,
    signature: puzzleSignature(discovery),
  }
}

export function validPuzzleGateConfigurations(
  catalog: PuzzleCatalog,
): PuzzleGateConfiguration[] {
  return catalog.gates
    .filter((gate) => gate.valid && gate.color !== null)
    .map((gate) => ({
      color: gate.color!,
      pattern: [...gate.pattern],
    }))
}
