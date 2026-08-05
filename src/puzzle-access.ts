import type { KeyColor } from "./key-colors.ts"

export type PuzzleGateMode = "navigation" | "anchor"

export interface PuzzleAccessGate {
  color: KeyColor | null
  gateId: string
  mode: PuzzleGateMode
  section: number
  sourceOrder: number
}

export type PuzzleSectionPredicate = (section: number) => boolean

/**
 * Returns navigation gates in authored source order without mutating the input.
 * Anchor gates reveal local content and never restrict course navigation.
 */
export function navigationPuzzleGates(
  gates: readonly PuzzleAccessGate[],
): PuzzleAccessGate[] {
  return gates
    .filter((gate) => gate.mode === "navigation")
    .slice()
    .sort(
      (left, right) =>
        left.sourceOrder - right.sourceOrder ||
        left.section - right.section ||
        left.gateId.localeCompare(right.gateId),
    )
}

/** The first authored navigation gate whose persistent id is not solved. */
export function earliestUnsolvedPuzzleGate(
  gates: readonly PuzzleAccessGate[],
  solvedGateIds: ReadonlySet<string>,
): PuzzleAccessGate | null {
  return (
    navigationPuzzleGates(gates).find(
      (gate) => !solvedGateIds.has(gate.gateId),
    ) ?? null
  )
}

/**
 * A navigation gate belongs to the accessible part of the course. Only the
 * sections after the earliest unsolved gate are behind the frontier.
 */
export function puzzleSectionAllowed(
  section: number,
  frontier: PuzzleAccessGate | null,
): boolean {
  return (
    Number.isInteger(section) &&
    section >= 0 &&
    (frontier === null || section <= frontier.section)
  )
}

/**
 * Finds the nearest allowed fallback at or before the blocked target. For a
 * target behind a puzzle frontier, the search starts on the gate section.
 * `additionallyAllowed` composes the puzzle boundary with other access rules,
 * such as secret slides.
 */
export function puzzleFallbackSection(
  targetSection: number,
  frontier: PuzzleAccessGate | null,
  additionallyAllowed: PuzzleSectionPredicate = () => true,
): number | null {
  if (!Number.isInteger(targetSection) || targetSection < 0) return null

  const start =
    frontier === null
      ? targetSection
      : Math.min(targetSection, frontier.section)

  for (let section = start; section >= 0; section -= 1) {
    if (
      puzzleSectionAllowed(section, frontier) &&
      additionallyAllowed(section)
    ) {
      return section
    }
  }

  return null
}
