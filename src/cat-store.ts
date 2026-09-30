import { loadCatCompanion, saveCatCompanion } from "./storage.ts"
import {
  DEFAULT_CAT_VARIANT,
  type CatVariant,
} from "./cat-catalog.ts"
import type { CatCompanionState } from "./types.ts"
import type { CatCollarColor } from "./cat-collar.ts"

function emptyState(): CatCompanionState {
  return {
    version: 3,
    unlocked: [],
    selected: null,
    unlockedCollars: [],
    selectedCollar: null,
  }
}

export class CatCompanionStore {
  private current: CatCompanionState = loadCatCompanion() ?? emptyState()

  collect(variant: CatVariant = DEFAULT_CAT_VARIANT): boolean {
    if (this.current.unlocked.includes(variant)) return false
    this.current = {
      ...this.current,
      version: 3,
      unlocked: [...this.current.unlocked, variant],
      selected: variant,
    }
    saveCatCompanion(this.current)
    return true
  }

  isCollected(): boolean {
    return this.current.unlocked.length > 0
  }

  isUnlocked(variant: CatVariant): boolean {
    return this.current.unlocked.includes(variant)
  }

  select(variant: CatVariant): boolean {
    if (!this.isUnlocked(variant) || this.current.selected === variant) {
      return false
    }
    this.current = { ...this.current, selected: variant }
    saveCatCompanion(this.current)
    return true
  }

  selectedVariant(): CatVariant | null {
    return this.current.selected
  }

  unlockedVariants(): CatVariant[] {
    return [...this.current.unlocked]
  }

  collectCollar(color: CatCollarColor): boolean {
    if (this.current.unlockedCollars.includes(color)) return false
    this.current = {
      ...this.current,
      unlockedCollars: [...this.current.unlockedCollars, color],
      selectedCollar: color,
    }
    saveCatCompanion(this.current)
    return true
  }

  isCollarUnlocked(color: CatCollarColor): boolean {
    return this.current.unlockedCollars.includes(color)
  }

  selectCollar(color: CatCollarColor | null): boolean {
    if (
      (color !== null && !this.isCollarUnlocked(color)) ||
      this.current.selectedCollar === color
    ) {
      return false
    }
    this.current = { ...this.current, selectedCollar: color }
    saveCatCompanion(this.current)
    return true
  }

  selectedCollar(): CatCollarColor | null {
    return this.current.selectedCollar
  }

  unlockedCollars(): CatCollarColor[] {
    return [...this.current.unlockedCollars]
  }

  state(): CatCompanionState {
    return {
      ...this.current,
      unlocked: [...this.current.unlocked],
      unlockedCollars: [...this.current.unlockedCollars],
    }
  }
}
