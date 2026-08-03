import { liaCourseIdentity } from "./course-identity.ts"
import { resolveLockTarget, type LockTarget } from "./lock-targets.ts"
import {
  MARKER_COLORS,
  normalizeHighlightedWord,
  type MarkerColor,
} from "./loot-if-options.ts"

const LOOT_IF_STORAGE_PREFIX = "lia-loot:loot-if:v1:"
const MAX_HIGHLIGHT_LENGTH = 512

export interface StoredHighlight {
  color: MarkerColor
  word: string
}

export interface LootIfState {
  version: 1
  highlightedColors: MarkerColor[]
  highlightedWords: StoredHighlight[]
  openedLockTargets: LockTarget[]
  secretSlideVisited: boolean
  solvedQuizzes: string[]
  spawned: string[]
}

function emptyState(): LootIfState {
  return {
    version: 1,
    highlightedColors: [],
    highlightedWords: [],
    openedLockTargets: [],
    secretSlideVisited: false,
    solvedQuizzes: [],
    spawned: [],
  }
}

function cloneState(state: LootIfState): LootIfState {
  return {
    version: 1,
    highlightedColors: [...state.highlightedColors],
    highlightedWords: state.highlightedWords.map((entry) => ({ ...entry })),
    openedLockTargets: [...state.openedLockTargets],
    secretSlideVisited: state.secretSlideVisited,
    solvedQuizzes: [...state.solvedQuizzes],
    spawned: [...state.spawned],
  }
}

function normalizedIds(value: unknown): string[] | null {
  if (
    !Array.isArray(value) ||
    !value.every((id) => typeof id === "string" && id.trim().length > 0)
  ) {
    return null
  }
  const ids = value.map((id: string) => id.trim())
  return new Set(ids).size === ids.length ? ids : null
}

function normalizedHighlights(value: unknown): StoredHighlight[] | null {
  if (!Array.isArray(value)) return null
  const highlights: StoredHighlight[] = []
  const seen = new Set<string>()
  for (const raw of value) {
    if (!raw || typeof raw !== "object") return null
    const entry = raw as Record<string, unknown>
    if (
      !MARKER_COLORS.includes(entry.color as MarkerColor) ||
      typeof entry.word !== "string"
    ) {
      return null
    }
    const word = normalizeHighlightedWord(entry.word)
    if (!word || word.length > MAX_HIGHLIGHT_LENGTH) return null
    const key = `${entry.color}:${word}`
    if (seen.has(key)) return null
    seen.add(key)
    highlights.push({ color: entry.color as MarkerColor, word })
  }
  return highlights
}

function normalizeState(value: unknown): LootIfState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (state.version !== 1 || typeof state.secretSlideVisited !== "boolean") {
    return null
  }
  const highlightedWords = normalizedHighlights(state.highlightedWords)
  if (
    !Array.isArray(state.highlightedColors) ||
    !state.highlightedColors.every((color) =>
      MARKER_COLORS.includes(color as MarkerColor),
    )
  ) {
    return null
  }
  const highlightedColors = [...state.highlightedColors] as MarkerColor[]
  if (new Set(highlightedColors).size !== highlightedColors.length) return null
  const solvedQuizzes = normalizedIds(state.solvedQuizzes)
  const spawned = normalizedIds(state.spawned)
  const rawOpenedLockTargets =
    state.openedLockTargets === undefined ? [] : state.openedLockTargets
  if (
    !Array.isArray(rawOpenedLockTargets) ||
    !rawOpenedLockTargets.every(
      (target) =>
        typeof target === "string" && resolveLockTarget(target) === target,
    )
  ) {
    return null
  }
  const openedLockTargets = [...rawOpenedLockTargets] as LockTarget[]
  if (new Set(openedLockTargets).size !== openedLockTargets.length) return null
  if (!highlightedWords || !solvedQuizzes || !spawned) return null
  return {
    version: 1,
    highlightedColors,
    highlightedWords,
    openedLockTargets,
    secretSlideVisited: state.secretSlideVisited,
    solvedQuizzes,
    spawned,
  }
}

function storageKey(): string {
  return `${LOOT_IF_STORAGE_PREFIX}${encodeURIComponent(liaCourseIdentity())}`
}

function loadState(): LootIfState | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey())
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return normalizeState(parsed)
  } catch {
    return null
  }
}

function saveState(state: LootIfState): void {
  try {
    window.sessionStorage.setItem(storageKey(), JSON.stringify(state))
  } catch {
    // Conditions continue in memory when browser storage is unavailable.
  }
}

function normalizedId(value: string): string | null {
  const id = value.trim()
  return id || null
}

export class LootIfStore {
  private current: LootIfState = loadState() ?? emptyState()

  isSpawned(id: string): boolean {
    const normalized = normalizedId(id)
    return normalized !== null && this.current.spawned.includes(normalized)
  }

  spawn(id: string): boolean {
    return this.recordId(id, this.current.spawned)
  }

  isQuizSolved(id: string): boolean {
    const normalized = normalizedId(id)
    return (
      normalized !== null && this.current.solvedQuizzes.includes(normalized)
    )
  }

  recordSolvedQuiz(id: string): boolean {
    return this.recordId(id, this.current.solvedQuizzes)
  }

  recordSecretSlideVisit(): boolean {
    if (this.current.secretSlideVisited) return false
    this.current.secretSlideVisited = true
    saveState(this.current)
    return true
  }

  recordOpenedLockTarget(value: string): boolean {
    const target = resolveLockTarget(value)
    if (!target || this.current.openedLockTargets.includes(target)) return false
    this.current.openedLockTargets.push(target)
    saveState(this.current)
    return true
  }

  hasOpenedLockTarget(value: string): boolean {
    const target = resolveLockTarget(value)
    return target !== null && this.current.openedLockTargets.includes(target)
  }

  recordHighlight(color: MarkerColor, value: string): boolean {
    if (!MARKER_COLORS.includes(color)) return false
    const word = normalizeHighlightedWord(value)
    if (!word || word.length > MAX_HIGHLIGHT_LENGTH) return false
    const colorChanged = this.recordHighlightColor(color, false)
    if (
      this.current.highlightedWords.some(
        (entry) => entry.color === color && entry.word === word,
      )
    ) {
      if (colorChanged) saveState(this.current)
      return colorChanged
    }
    this.current.highlightedWords.push({ color, word })
    saveState(this.current)
    return true
  }

  recordHighlightColor(color: MarkerColor, persist = true): boolean {
    if (
      !MARKER_COLORS.includes(color) ||
      this.current.highlightedColors.includes(color)
    ) {
      return false
    }
    this.current.highlightedColors.push(color)
    if (persist) saveState(this.current)
    return true
  }

  hasHighlight(color: MarkerColor, value?: string | null): boolean {
    if (value === null || value === undefined) {
      return this.current.highlightedColors.includes(color)
    }
    const word = normalizeHighlightedWord(value)
    return (
      Boolean(word) &&
      this.current.highlightedWords.some(
        (entry) => entry.color === color && entry.word === word,
      )
    )
  }

  state(): LootIfState {
    return cloneState(this.current)
  }

  private recordId(value: string, target: string[]): boolean {
    const id = normalizedId(value)
    if (!id || target.includes(id)) return false
    target.push(id)
    saveState(this.current)
    return true
  }
}
