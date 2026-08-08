import { AchievementStore } from "./achievement-store.ts"
import type { ConcealmentMode } from "./concealment.ts"
import {
  RESOURCE_KINDS,
  type AchievementId,
  type AchievementState,
  type ResourceCounts,
  type ResourceKind,
} from "./types.ts"

export interface AchievementDefinition {
  id: AchievementId
  title: string
  message: string
}

export const ACHIEVEMENT_EXPLORATION_KINDS = [
  "solid",
  "dust",
  "soil",
  "plant",
] as const

export type AchievementExplorationKind =
  (typeof ACHIEVEMENT_EXPLORATION_KINDS)[number]

export type AchievementExplorationCounts = Record<
  AchievementExplorationKind,
  number
>

type AchievementNotifier = (achievement: AchievementDefinition) => void

const CHEST_ACHIEVEMENT_BY_REWARD: Readonly<
  Record<ResourceKind, AchievementId>
> = {
  gold: "all-treasure-chests-opened",
  diamonds: "all-diamond-chests-opened",
  energy: "all-energy-chests-opened",
}

const EXPLORATION_ACHIEVEMENT_BY_KIND: Readonly<
  Record<AchievementExplorationKind, AchievementId>
> = {
  solid: "all-invisible-objects-found",
  dust: "all-magic-dust-objects-found",
  soil: "all-soil-dug",
  plant: "all-plants-bloomed",
}

export const ACHIEVEMENTS: Readonly<
  Record<AchievementId, AchievementDefinition>
> = {
  "all-quizzes-solved": {
    id: "all-quizzes-solved",
    title: "Aufgaben-Meister",
    message: "Du hast alle Aufgaben geschafft.",
  },
  "perfect-highscore": {
    id: "perfect-highscore",
    title: "Perfekter Highscore",
    message: "Du hast die maximale Punktzahl erreicht.",
  },
  "all-treasure-chests-opened": {
    id: "all-treasure-chests-opened",
    title: "Schatzjäger",
    message: "Du hast alle Schatztruhen geöffnet.",
  },
  "all-diamond-chests-opened": {
    id: "all-diamond-chests-opened",
    title: "Diamantensammler",
    message: "Du hast alle Diamanttruhen geöffnet.",
  },
  "all-energy-chests-opened": {
    id: "all-energy-chests-opened",
    title: "Energiesammler",
    message: "Du hast alle Energiekisten geöffnet.",
  },
  "all-invisible-objects-found": {
    id: "all-invisible-objects-found",
    title: "Unsichtbares entdeckt",
    message: "Du hast alle unsichtbaren Objekte gefunden.",
  },
  "all-magic-dust-objects-found": {
    id: "all-magic-dust-objects-found",
    title: "Zauberstaubspürnase",
    message: "Du hast alle Zauberstaub-Objekte gefunden.",
  },
  "all-soil-dug": {
    id: "all-soil-dug",
    title: "Ausgrabungsprofi",
    message: "Du hast alle Erdhaufen weggebuddelt.",
  },
  "all-plants-bloomed": {
    id: "all-plants-bloomed",
    title: "Grüner Daumen",
    message: "Du hast alle Pflanzen zum Blühen gebracht.",
  },
  "all-locks-opened": {
    id: "all-locks-opened",
    title: "Schlossknacker",
    message: "Du hast alle Schlösser geöffnet.",
  },
  "all-puzzle-gates-opened": {
    id: "all-puzzle-gates-opened",
    title: "Puzzlemeister",
    message: "Du hast alle Puzzletore geöffnet.",
  },
  "secret-slide-found": {
    id: "secret-slide-found",
    title: "Geheimnis entdeckt",
    message: "Du hast eine geheime Folie gefunden.",
  },
}

export class AchievementManager {
  private readonly store: AchievementStore
  private readonly notify: AchievementNotifier
  private enabled = false
  private allQuizzesCompleted = false
  private perfectHighscore = false
  private chestTotals = emptyNullableResourceCounts()
  private collectedChests = emptyResourceCounts()
  private explorationTotals = emptyNullableExplorationCounts()
  private explorationCompleted = emptyExplorationCounts()
  private lockTotal: number | null = null
  private unlockedLocks = 0
  private puzzleGateTotal: number | null = null
  private solvedPuzzleGates = 0
  private secretFound = false

  constructor(store: AchievementStore, notify: AchievementNotifier) {
    this.store = store
    this.notify = notify
  }

  enable(): void {
    if (this.enabled) return
    this.enabled = true
    this.evaluateAll()
  }

  isEnabled(): boolean {
    return this.enabled
  }

  quizzesCompleted(): void {
    this.allQuizzesCompleted = true
    this.evaluate("all-quizzes-solved", true)
  }

  highscoreFinished(score: number | null, maxPoints: number): void {
    this.perfectHighscore =
      score !== null && Number.isFinite(maxPoints) && score === maxPoints
    this.evaluate("perfect-highscore", this.perfectHighscore)
  }

  chestCatalogReady(
    totals: ResourceCounts,
    collected: ResourceCounts,
  ): void {
    this.chestTotals = normalizedResourceCounts(totals)
    this.collectedChests = normalizedResourceCounts(collected)
    this.evaluateChestProgress()
  }

  chestCollected(collected: ResourceCounts): void {
    this.collectedChests = normalizedResourceCounts(collected)
    this.evaluateChestProgress()
  }

  explorationCatalogReady(
    totals: AchievementExplorationCounts,
    completed: AchievementExplorationCounts,
  ): void {
    this.explorationTotals = normalizedExplorationCounts(totals)
    this.explorationCompleted = normalizedExplorationCounts(completed)
    this.evaluateExplorationProgress()
  }

  concealmentFound(mode: ConcealmentMode, found: number): void {
    if (mode !== "solid" && mode !== "dust") return
    this.explorationCompleted[mode] = normalizedCount(found)
    this.evaluateExplorationKind(mode)
  }

  soilDug(dug: number): void {
    this.explorationCompleted.soil = normalizedCount(dug)
    this.evaluateExplorationKind("soil")
  }

  plantBloomed(bloomed: number): void {
    this.explorationCompleted.plant = normalizedCount(bloomed)
    this.evaluateExplorationKind("plant")
  }

  lockCatalogReady(total: number, unlocked: number): void {
    this.lockTotal = normalizedCount(total)
    this.unlockedLocks = normalizedCount(unlocked)
    this.evaluateLockProgress()
  }

  lockUnlocked(unlocked: number): void {
    this.unlockedLocks = normalizedCount(unlocked)
    this.evaluateLockProgress()
  }

  puzzleCatalogReady(total: number, solved: number): void {
    this.puzzleGateTotal = normalizedCount(total)
    this.solvedPuzzleGates = normalizedCount(solved)
    this.evaluatePuzzleProgress()
  }

  puzzleGateSolved(solved: number): void {
    this.solvedPuzzleGates = normalizedCount(solved)
    this.evaluatePuzzleProgress()
  }

  secretSlideFound(): void {
    this.secretFound = true
    this.evaluate("secret-slide-found", true)
  }

  state(): AchievementState {
    return this.store.state()
  }

  private evaluateAll(): void {
    this.evaluate("all-quizzes-solved", this.allQuizzesCompleted)
    this.evaluate("perfect-highscore", this.perfectHighscore)
    this.evaluateChestProgress()
    this.evaluateExplorationProgress()
    this.evaluateLockProgress()
    this.evaluatePuzzleProgress()
    this.evaluate("secret-slide-found", this.secretFound)
  }

  private evaluateChestProgress(): void {
    for (const reward of RESOURCE_KINDS) {
      const total = this.chestTotals[reward]
      this.evaluateCatalogProgress(
        CHEST_ACHIEVEMENT_BY_REWARD[reward],
        total,
        this.collectedChests[reward],
      )
    }
  }

  private evaluateExplorationProgress(): void {
    for (const kind of ACHIEVEMENT_EXPLORATION_KINDS) {
      this.evaluateExplorationKind(kind)
    }
  }

  private evaluateExplorationKind(kind: AchievementExplorationKind): void {
    this.evaluateCatalogProgress(
      EXPLORATION_ACHIEVEMENT_BY_KIND[kind],
      this.explorationTotals[kind],
      this.explorationCompleted[kind],
    )
  }

  private evaluateCatalogProgress(
    achievementId: AchievementId,
    total: number | null,
    completed: number,
  ): void {
    this.evaluate(
      achievementId,
      total !== null &&
        total > 0 &&
        completed >= total,
    )
  }

  private evaluateLockProgress(): void {
    this.evaluate(
      "all-locks-opened",
      this.lockTotal !== null &&
        this.lockTotal > 0 &&
        this.unlockedLocks >= this.lockTotal,
    )
  }

  private evaluatePuzzleProgress(): void {
    this.evaluate(
      "all-puzzle-gates-opened",
      this.puzzleGateTotal !== null &&
        this.puzzleGateTotal > 0 &&
        this.solvedPuzzleGates >= this.puzzleGateTotal,
    )
  }

  private evaluate(achievementId: AchievementId, achieved: boolean): void {
    if (!this.enabled || !achieved || !this.store.unlock(achievementId)) return
    this.notify(ACHIEVEMENTS[achievementId])
  }
}

function emptyResourceCounts(): ResourceCounts {
  return { gold: 0, diamonds: 0, energy: 0 }
}

function emptyNullableResourceCounts(): Record<ResourceKind, number | null> {
  return { gold: null, diamonds: null, energy: null }
}

function emptyExplorationCounts(): AchievementExplorationCounts {
  return { solid: 0, dust: 0, soil: 0, plant: 0 }
}

function emptyNullableExplorationCounts(): Record<
  AchievementExplorationKind,
  number | null
> {
  return { solid: null, dust: null, soil: null, plant: null }
}

function normalizedResourceCounts(values: ResourceCounts): ResourceCounts {
  return {
    gold: normalizedCount(values?.gold),
    diamonds: normalizedCount(values?.diamonds),
    energy: normalizedCount(values?.energy),
  }
}

function normalizedExplorationCounts(
  values: AchievementExplorationCounts,
): AchievementExplorationCounts {
  return {
    solid: normalizedCount(values?.solid),
    dust: normalizedCount(values?.dust),
    soil: normalizedCount(values?.soil),
    plant: normalizedCount(values?.plant),
  }
}

function normalizedCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
}
