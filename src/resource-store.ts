import { loadResources, saveResources } from "./storage.ts"
import type { ResourceKind, ResourceState } from "./types"

function resourceAmount(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(`${name} muss eine nichtnegative Zahl sein.`)
  }
  return Math.floor(value)
}

function cloneState(state: ResourceState): ResourceState {
  return { ...state, collectedChests: [...state.collectedChests] }
}

export class ResourceStore {
  private current: ResourceState | null = loadResources()
  private enabled = false

  configure(
    initialGold: number,
    initialDiamonds: number,
    initialEnergy?: number,
  ): ResourceState {
    const gold = resourceAmount(initialGold, "Gold")
    const diamonds = resourceAmount(initialDiamonds, "Diamanten")
    const energy =
      initialEnergy === undefined
        ? null
        : resourceAmount(initialEnergy, "Energie")

    if (
      !this.current ||
      this.current.initialGold !== gold ||
      this.current.initialDiamonds !== diamonds ||
      this.current.initialEnergy !== energy
    ) {
      this.current = {
        version: 1,
        initialGold: gold,
        initialDiamonds: diamonds,
        initialEnergy: energy,
        gold,
        diamonds,
        energy,
        collectedChests: [],
      }
      saveResources(this.current)
    }

    this.enabled = true
    return cloneState(this.current)
  }

  spend(kind: ResourceKind): boolean {
    if (!this.enabled || !this.current) return true

    if (kind === "energy") {
      if (this.current.energy === null) return true
      if (this.current.energy <= 0) return false
      this.current.energy -= 1
    } else {
      if (this.current[kind] <= 0) return false
      this.current[kind] -= 1
    }

    saveResources(this.current)
    return true
  }

  collectChest(chestId: string, reward: ResourceKind = "gold"): boolean {
    const normalizedId = chestId.trim()
    if (
      !normalizedId ||
      !this.enabled ||
      !this.current ||
      this.current.collectedChests.includes(normalizedId)
    ) {
      return false
    }

    if (reward === "energy") {
      if (this.current.energy === null) return false
      this.current.energy += 1
    } else {
      this.current[reward] += 1
    }
    this.current.collectedChests.push(normalizedId)
    saveResources(this.current)
    return true
  }

  isChestCollected(chestId: string): boolean {
    return Boolean(this.current?.collectedChests.includes(chestId.trim()))
  }

  state(): ResourceState | null {
    return this.enabled && this.current ? cloneState(this.current) : null
  }
}
