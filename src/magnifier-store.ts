import { loadMagnifier, saveMagnifier } from "./storage.ts"
import type { MagnifierState } from "./types.ts"

function emptyState(): MagnifierState {
  return { version: 1, collected: false }
}

export class MagnifierStore {
  private current: MagnifierState = loadMagnifier() ?? emptyState()

  collect(): boolean {
    if (this.current.collected) return false
    this.current = { version: 1, collected: true }
    saveMagnifier(this.current)
    return true
  }

  isCollected(): boolean {
    return this.current.collected
  }

  state(): MagnifierState {
    return { ...this.current }
  }
}
