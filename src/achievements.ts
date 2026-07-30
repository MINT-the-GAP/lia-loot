import { AchievementStore } from "./achievement-store.ts"
import type { AchievementId, AchievementState } from "./types.ts"

export interface AchievementDefinition {
  id: AchievementId
  title: string
  message: string
}

type AchievementNotifier = (achievement: AchievementDefinition) => void

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
  "all-chests-opened": {
    id: "all-chests-opened",
    title: "Schatzjäger",
    message: "Du hast alle Truhen geöffnet.",
  },
  "all-locks-opened": {
    id: "all-locks-opened",
    title: "Schlossknacker",
    message: "Du hast alle Schlösser geöffnet.",
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
  private chestTotal: number | null = null
  private collectedChests = 0
  private lockTotal: number | null = null
  private unlockedLocks = 0
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

  chestCatalogReady(total: number, collected: number): void {
    this.chestTotal = normalizedCount(total)
    this.collectedChests = normalizedCount(collected)
    this.evaluateChestProgress()
  }

  chestCollected(collected: number): void {
    this.collectedChests = normalizedCount(collected)
    this.evaluateChestProgress()
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
    this.evaluateLockProgress()
    this.evaluate("secret-slide-found", this.secretFound)
  }

  private evaluateChestProgress(): void {
    this.evaluate(
      "all-chests-opened",
      this.chestTotal !== null &&
        this.chestTotal > 0 &&
        this.collectedChests >= this.chestTotal,
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

  private evaluate(achievementId: AchievementId, achieved: boolean): void {
    if (!this.enabled || !achieved || !this.store.unlock(achievementId)) return
    this.notify(ACHIEVEMENTS[achievementId])
  }
}

function normalizedCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
}
