import { loadWoodCrates, saveWoodCrates } from "./storage.ts"
import type { WoodCrateState } from "./types.ts"

function emptyState(): WoodCrateState {
  return { version: 2, broken: [], damage: {} }
}

export const WOOD_CRATE_DURABILITY = 8

export interface WoodCrateStrikeResult {
  accepted: boolean
  broken: boolean
  damage: number
}

export class WoodCrateStore {
  private current: WoodCrateState = loadWoodCrates() ?? emptyState()

  strike(crateId: string, power: number): WoodCrateStrikeResult {
    const id = crateId.trim()
    if (
      !id ||
      this.current.broken.includes(id) ||
      !Number.isSafeInteger(power) ||
      power <= 0
    ) {
      return {
        accepted: false,
        broken: this.current.broken.includes(id),
        damage: this.damage(id),
      }
    }
    const damage = Math.min(
      WOOD_CRATE_DURABILITY,
      this.damage(id) + power,
    )
    const broken = damage >= WOOD_CRATE_DURABILITY
    const nextDamage = { ...this.current.damage }
    if (broken) delete nextDamage[id]
    else nextDamage[id] = damage
    this.current = {
      version: 2,
      broken: broken ? [...this.current.broken, id] : this.current.broken,
      damage: nextDamage,
    }
    saveWoodCrates(this.current)
    return { accepted: true, broken, damage }
  }

  damage(crateId: string): number {
    return this.current.damage[crateId.trim()] ?? 0
  }

  isBroken(crateId: string): boolean {
    return this.current.broken.includes(crateId)
  }

  state(): WoodCrateState {
    return {
      ...this.current,
      broken: [...this.current.broken],
      damage: { ...this.current.damage },
    }
  }
}
