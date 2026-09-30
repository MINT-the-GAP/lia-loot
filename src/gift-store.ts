import { loadGifts, saveGifts } from "./storage.ts"
import type { GiftState } from "./types.ts"

function emptyState(): GiftState {
  return { version: 1, opened: [] }
}

export class GiftStore {
  private current: GiftState = loadGifts() ?? emptyState()

  open(giftId: string): boolean {
    if (this.current.opened.includes(giftId)) return false
    this.current = {
      version: 1,
      opened: [...this.current.opened, giftId],
    }
    saveGifts(this.current)
    return true
  }

  isOpened(giftId: string): boolean {
    return this.current.opened.includes(giftId)
  }

  state(): GiftState {
    return { ...this.current, opened: [...this.current.opened] }
  }
}
