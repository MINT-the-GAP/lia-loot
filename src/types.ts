import type { KeyCounts } from "./key-colors"

export type TrophyTier = "gold" | "silver" | "copper" | null
export type ResourceKind = "gold" | "diamonds" | "energy"

export const ACHIEVEMENT_IDS = [
  "all-quizzes-solved",
  "perfect-highscore",
  "all-chests-opened",
  "all-locks-opened",
  "secret-slide-found",
] as const

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number]

export interface HighscoreConfig {
  maxPoints: number
  failedCheckPenalty: number
  hintPenalty: number
  graceMinutes: number
  perMinutePenalty: number
}

export interface HighscoreState {
  version: 1
  config: HighscoreConfig
  startedAt: number
  failedChecks: number
  hintsUsed: number
  finishedAt: number | null
  finalScore: number | null
}

export interface ResourceState {
  version: 1
  initialGold: number
  initialDiamonds: number
  initialEnergy: number | null
  gold: number
  diamonds: number
  energy: number | null
  collectedChests: string[]
}

export interface KeyInventoryState {
  version: 1
  keys: KeyCounts
  collectedKeys: string[]
  unlockedLocks: string[]
}

export interface MagnifierState {
  version: 1
  collected: boolean
}

export interface AchievementState {
  version: 1
  unlocked: AchievementId[]
}

export interface HighscoreApi {
  readonly version: string
  configure(
    maxPoints: number,
    failedCheckPenalty: number,
    hintPenalty: number,
    graceMinutes: number,
    perMinutePenalty: number,
  ): void
  fail(count?: number): void
  hint(count?: number): void
  finish(): number | null
  reset(): void
  score(at?: number): number | null
  show(): void
  enableAchievements(): void
  resources(gold: number, diamonds: number, energy?: number): void
  state(): HighscoreState | null
}

export interface LootRuntimeState {
  readonly version: string
  status: "booting" | "ready" | "failed"
}

declare global {
  interface Window {
    __LIA_LOOT_HIGHSCORE__?: HighscoreApi
    __LIA_LOOT_RUNTIME__?: LootRuntimeState
  }
}
