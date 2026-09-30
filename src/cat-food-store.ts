import { loadCatFood, saveCatFood } from "./storage.ts"
import type { CatFoodState } from "./types.ts"

function emptyState(): CatFoodState {
  return { version: 1, collected: [], fed: [] }
}

function normalizedId(value: string): string | null {
  const id = value.trim()
  return id || null
}

export class CatFoodStore {
  private current: CatFoodState = loadCatFood() ?? emptyState()

  collect(foodId: string): boolean {
    const id = normalizedId(foodId)
    if (!id || this.current.collected.includes(id)) return false
    this.current = {
      ...this.current,
      collected: [...this.current.collected, id],
    }
    saveCatFood(this.current)
    return true
  }

  feed(foodId: string): boolean {
    const id = normalizedId(foodId)
    if (
      !id ||
      !this.current.collected.includes(id) ||
      this.current.fed.includes(id)
    ) {
      return false
    }
    this.current = {
      ...this.current,
      fed: [...this.current.fed, id],
    }
    saveCatFood(this.current)
    return true
  }

  isCollected(foodId: string): boolean {
    const id = normalizedId(foodId)
    return id !== null && this.current.collected.includes(id)
  }

  isFed(foodId: string): boolean {
    const id = normalizedId(foodId)
    return id !== null && this.current.fed.includes(id)
  }

  availableIds(): string[] {
    const fed = new Set(this.current.fed)
    return this.current.collected.filter((id) => !fed.has(id))
  }

  state(): CatFoodState {
    return {
      version: 1,
      collected: [...this.current.collected],
      fed: [...this.current.fed],
    }
  }
}
