import { loadFlashlight, saveFlashlight } from "./storage.ts"
import type { FlashlightState } from "./types.ts"

function emptyState(): FlashlightState {
  return { version: 1, collected: false }
}

export class FlashlightStore {
  private current: FlashlightState = loadFlashlight() ?? emptyState()

  collect(): boolean {
    if (this.current.collected) return false
    this.current = { version: 1, collected: true }
    saveFlashlight(this.current)
    return true
  }

  isCollected(): boolean {
    return this.current.collected
  }

  state(): FlashlightState {
    return { ...this.current }
  }
}
