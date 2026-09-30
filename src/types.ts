import type { KeyColor, KeyCounts } from "./key-colors"
import type { InlineRevealRenderingApi } from "./inline-reveal"
import type { GiftRenderingApi } from "./gift"
import type { WoodCrateRenderingApi } from "./wood-crate"
import type { CatFoodRenderingApi } from "./cat-food"

export type TrophyTier = "gold" | "silver" | "copper" | null
export const RESOURCE_KINDS = ["gold", "diamonds", "energy"] as const
export type ResourceKind = (typeof RESOURCE_KINDS)[number]
export type ResourceCounts = Record<ResourceKind, number>

export const ACHIEVEMENT_IDS = [
  "all-quizzes-solved",
  "perfect-highscore",
  "all-treasure-chests-opened",
  "all-diamond-chests-opened",
  "all-energy-chests-opened",
  "all-invisible-objects-found",
  "all-magic-dust-objects-found",
  "all-soil-dug",
  "all-plants-bloomed",
  "all-locks-opened",
  "all-puzzle-gates-opened",
  "secret-slide-found",
] as const

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number]

export const LEGACY_ACHIEVEMENT_IDS = ["all-chests-opened"] as const
export type LegacyAchievementId = (typeof LEGACY_ACHIEVEMENT_IDS)[number]

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

export interface ChestRewardState {
  version: 1
  collected: Record<ResourceKind, string[]>
}

export interface KeyInventoryState {
  version: 1
  keys: KeyCounts
  collectedKeys: string[]
  unlockedLocks: string[]
}

export type PuzzleCollectedPieces = Record<KeyColor, number[]>
export type PuzzlePlacements = Record<KeyColor, Array<number | null>>

export interface PuzzleState {
  version: 1
  signature: string
  collected: PuzzleCollectedPieces
  placements: PuzzlePlacements
  solvedGates: KeyColor[]
}

export interface MagnifierState {
  version: 1
  collected: boolean
}

export interface FlashlightState {
  version: 1
  collected: boolean
}

export interface CatCompanionState {
  version: 3
  unlocked: import("./cat-catalog.ts").CatVariant[]
  selected: import("./cat-catalog.ts").CatVariant | null
  unlockedCollars: import("./cat-collar.ts").CatCollarColor[]
  selectedCollar: import("./cat-collar.ts").CatCollarColor | null
}

export interface CatFoodState {
  version: 1
  collected: string[]
  fed: string[]
}

export interface GiftState {
  version: 1
  opened: string[]
}

export interface WoodCrateState {
  version: 2
  broken: string[]
  damage: Record<string, number>
}

export interface AchievementState {
  version: 1
  unlocked: AchievementId[]
  legacyAllChestsOpened?: boolean
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
  resources(
    gold: number,
    diamonds: number,
    energyOrOption?: number | string,
    ...options: string[]
  ): void
  state(): HighscoreState | null
}

export interface LootRuntimeState {
  readonly version: string
  status: "booting" | "ready" | "failed"
}

declare global {
  interface Window {
    __LIA_LOOT_HIGHSCORE__?: HighscoreApi
    __LIA_LOOT_GIFTS__?: GiftRenderingApi
    __LIA_LOOT_WOOD_CRATES__?: WoodCrateRenderingApi
    __LIA_LOOT_CAT_FOOD__?: CatFoodRenderingApi
    __LIA_LOOT_INLINE_REVEALS__?: InlineRevealRenderingApi
    __LIA_LOOT_RUNTIME__?: LootRuntimeState
  }
}
