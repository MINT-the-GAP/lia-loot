import { KEY_COLORS, type KeyColor } from "./key-colors.ts"
import { loadPuzzles, savePuzzles } from "./storage.ts"
import type { PuzzleState } from "./types.ts"

export interface PuzzleGateConfiguration {
  color: KeyColor
  pattern: readonly number[]
}

export type PuzzlePlacementResult = "invalid" | "placed" | "solved"

function emptyNumberMap(): PuzzleState["collected"] {
  return Object.fromEntries(
    KEY_COLORS.map((color) => [color, [] as number[]]),
  ) as PuzzleState["collected"]
}

function emptyPlacementMap(): PuzzleState["placements"] {
  return Object.fromEntries(
    KEY_COLORS.map((color) => [color, [] as Array<number | null>]),
  ) as PuzzleState["placements"]
}

function emptyState(signature = "unconfigured"): PuzzleState {
  return {
    version: 1,
    signature,
    collected: emptyNumberMap(),
    placements: emptyPlacementMap(),
    solvedGates: [],
  }
}

function cloneState(state: PuzzleState): PuzzleState {
  return {
    ...state,
    collected: Object.fromEntries(
      KEY_COLORS.map((color) => [color, [...state.collected[color]]]),
    ) as PuzzleState["collected"],
    placements: Object.fromEntries(
      KEY_COLORS.map((color) => [color, [...state.placements[color]]]),
    ) as PuzzleState["placements"],
    solvedGates: [...state.solvedGates],
  }
}

function sameNumbers(
  actual: readonly (number | null)[],
  expected: readonly number[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((number, index) => number === expected[index])
  )
}

function validPattern(pattern: readonly number[]): boolean {
  if (pattern.length === 0 || pattern.length > 16) return false
  const values = [...pattern]
  return (
    values.every((number) => Number.isInteger(number) && number >= 1 && number <= 16) &&
    new Set(values).size === values.length &&
    values.every((number) => number <= values.length)
  )
}

export class PuzzleStore {
  private current: PuzzleState = loadPuzzles() ?? emptyState()
  private readonly patterns = new Map<KeyColor, readonly number[]>()
  private configured = false

  configure(
    signature: string,
    gates: readonly PuzzleGateConfiguration[],
  ): PuzzleState {
    const normalizedSignature = signature.trim()
    if (!normalizedSignature || normalizedSignature.length > 512) {
      throw new Error("Die Puzzle-Konfigurationssignatur ist ungültig.")
    }

    this.patterns.clear()
    for (const gate of gates) {
      if (this.patterns.has(gate.color) || !validPattern(gate.pattern)) {
        throw new Error("Die Puzzle-Torkonfiguration ist nicht eindeutig oder ungültig.")
      }
      this.patterns.set(gate.color, [...gate.pattern])
    }

    if (this.current.signature !== normalizedSignature) {
      this.current = emptyState(normalizedSignature)
    }
    for (const color of KEY_COLORS) {
      const pattern = this.patterns.get(color)
      if (!pattern) {
        this.current.collected[color] = []
        this.current.placements[color] = []
        continue
      }
      const allowed = new Set(pattern)
      this.current.collected[color] = this.current.collected[color].filter((number) =>
        allowed.has(number),
      )
      const previous = this.current.placements[color]
      this.current.placements[color] =
        previous.length === pattern.length
          ? previous.map((number) =>
              number !== null &&
              allowed.has(number) &&
              this.current.collected[color].includes(number)
                ? number
                : null,
            )
          : Array.from({ length: pattern.length }, () => null)
    }
    this.current.solvedGates = KEY_COLORS.filter((color) => {
      const pattern = this.patterns.get(color)
      return pattern ? sameNumbers(this.current.placements[color], pattern) : false
    })

    this.configured = true
    savePuzzles(this.current)
    return this.state()
  }

  collectPiece(color: KeyColor, number: number): boolean {
    const pattern = this.patterns.get(color)
    if (
      !this.configured ||
      !pattern?.includes(number) ||
      this.current.collected[color].includes(number)
    ) {
      return false
    }
    this.current.collected[color].push(number)
    this.current.collected[color].sort((left, right) => left - right)
    savePuzzles(this.current)
    return true
  }

  isPieceCollected(color: KeyColor, number: number): boolean {
    return this.current.collected[color].includes(number)
  }

  availablePieces(color: KeyColor): number[] {
    const placed = new Set(
      this.current.placements[color].filter((number): number is number => number !== null),
    )
    return this.current.collected[color].filter((number) => !placed.has(number))
  }

  placement(color: KeyColor): Array<number | null> {
    return [...this.current.placements[color]]
  }

  placePiece(color: KeyColor, number: number, slot: number): PuzzlePlacementResult {
    const pattern = this.patterns.get(color)
    const placement = this.current.placements[color]
    if (
      !this.configured ||
      !pattern ||
      this.isGateSolved(color) ||
      !this.isPieceCollected(color, number) ||
      !Number.isInteger(slot) ||
      slot < 0 ||
      slot >= pattern.length
    ) {
      return "invalid"
    }

    const previousSlot = placement.indexOf(number)
    if (previousSlot >= 0) placement[previousSlot] = null
    placement[slot] = number
    if (sameNumbers(placement, pattern)) {
      this.current.solvedGates.push(color)
      savePuzzles(this.current)
      return "solved"
    }
    savePuzzles(this.current)
    return "placed"
  }

  isGateSolved(color: KeyColor): boolean {
    return this.configured && this.current.solvedGates.includes(color)
  }

  solvedColors(): KeyColor[] {
    return this.configured ? [...this.current.solvedGates] : []
  }

  state(): PuzzleState {
    return cloneState(this.current)
  }
}
