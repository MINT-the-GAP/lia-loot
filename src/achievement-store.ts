import { loadAchievements, saveAchievements } from "./storage.ts"
import type { AchievementId, AchievementState } from "./types.ts"

function emptyState(): AchievementState {
  return { version: 1, unlocked: [] }
}

function cloneState(state: AchievementState): AchievementState {
  return { ...state, unlocked: [...state.unlocked] }
}

export class AchievementStore {
  private current: AchievementState = loadAchievements() ?? emptyState()

  unlock(achievementId: AchievementId): boolean {
    if (this.current.unlocked.includes(achievementId)) return false

    this.current.unlocked.push(achievementId)
    saveAchievements(this.current)
    return true
  }

  state(): AchievementState {
    return cloneState(this.current)
  }
}
