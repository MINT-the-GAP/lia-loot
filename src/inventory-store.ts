import { createEmptyKeyCounts } from "./key-colors.ts"
import { loadKeyInventory, saveKeyInventory } from "./storage.ts"
import type { KeyColor } from "./key-colors.ts"
import type { KeyInventoryState } from "./types.ts"

export type UnlockResult =
  | "unlocked"
  | "already-unlocked"
  | "missing-key"
  | "invalid-lock-id"

function emptyState(): KeyInventoryState {
  return {
    version: 1,
    keys: createEmptyKeyCounts(),
    collectedKeys: [],
    unlockedLocks: [],
  }
}

function cloneState(state: KeyInventoryState): KeyInventoryState {
  return {
    ...state,
    keys: { ...state.keys },
    collectedKeys: [...state.collectedKeys],
    unlockedLocks: [...state.unlockedLocks],
  }
}

export class KeyInventoryStore {
  private current: KeyInventoryState = loadKeyInventory() ?? emptyState()

  collectKey(keyId: string, color: KeyColor): boolean {
    const normalizedId = keyId.trim()
    if (!normalizedId || this.current.collectedKeys.includes(normalizedId)) {
      return false
    }

    this.current.keys[color] += 1
    this.current.collectedKeys.push(normalizedId)
    saveKeyInventory(this.current)
    return true
  }

  isKeyCollected(keyId: string): boolean {
    return this.current.collectedKeys.includes(keyId.trim())
  }

  useKeyForLock(lockId: string, color: KeyColor): UnlockResult {
    const normalizedId = lockId.trim()
    if (!normalizedId) return "invalid-lock-id"
    if (this.current.unlockedLocks.includes(normalizedId)) {
      return "already-unlocked"
    }
    if (this.current.keys[color] <= 0) return "missing-key"

    this.current.keys[color] -= 1
    this.current.unlockedLocks.push(normalizedId)
    saveKeyInventory(this.current)
    return "unlocked"
  }

  isLockUnlocked(lockId: string): boolean {
    return this.current.unlockedLocks.includes(lockId.trim())
  }

  state(): KeyInventoryState {
    return cloneState(this.current)
  }
}
