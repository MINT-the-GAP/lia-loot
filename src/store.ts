import { calculateScore, sameConfig } from "./score"
import { clearState, loadState, saveState } from "./storage"
import type { HighscoreConfig, HighscoreState } from "./types"

function cloneState(state: HighscoreState): HighscoreState {
  return {
    ...state,
    config: { ...state.config },
  }
}

function positiveInteger(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.floor(value))
}

export class HighscoreStore {
  private current: HighscoreState | null = loadState()

  configure(config: HighscoreConfig, now = Date.now()): void {
    if (this.current && sameConfig(this.current.config, config)) return

    this.current = {
      version: 1,
      config,
      startedAt: now,
      failedChecks: 0,
      hintsUsed: 0,
      finishedAt: null,
      finalScore: null,
    }
    saveState(this.current)
  }

  isRunning(): boolean {
    return this.current !== null && this.current.finishedAt === null
  }

  fail(count = 1): void {
    if (!this.isRunning() || !this.current) return
    this.current.failedChecks += positiveInteger(count)
    saveState(this.current)
  }

  hint(count = 1): void {
    if (!this.isRunning() || !this.current) return
    this.current.hintsUsed += positiveInteger(count)
    saveState(this.current)
  }

  score(at = Date.now()): number | null {
    if (!this.current) return null
    if (this.current.finalScore !== null) return this.current.finalScore
    return calculateScore(this.current.config, this.current, at)
  }

  finish(now = Date.now()): number | null {
    if (!this.current) return null
    if (this.current.finalScore !== null) return this.current.finalScore

    const score = calculateScore(this.current.config, this.current, now)
    this.current.finishedAt = now
    this.current.finalScore = score
    saveState(this.current)
    return score
  }

  reset(now = Date.now()): void {
    if (!this.current) {
      clearState()
      return
    }

    const config = { ...this.current.config }
    clearState()
    this.current = null
    this.configure(config, now)
  }

  state(): HighscoreState | null {
    return this.current ? cloneState(this.current) : null
  }
}
