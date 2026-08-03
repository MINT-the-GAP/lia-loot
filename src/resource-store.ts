import {
  loadChestRewards,
  loadResources,
  saveChestRewards,
  saveResources,
} from "./storage.ts"
import {
  RESOURCE_KINDS,
  type ChestRewardState,
  type ResourceCounts,
  type ResourceKind,
  type ResourceState,
} from "./types.ts"

function resourceAmount(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(`${name} muss eine nichtnegative Zahl sein.`)
  }
  return Math.floor(value)
}

function cloneState(state: ResourceState): ResourceState {
  return { ...state, collectedChests: [...state.collectedChests] }
}

function emptyChestRewards(): ChestRewardState {
  return {
    version: 1,
    collected: {
      gold: [],
      diamonds: [],
      energy: [],
    },
  }
}

function isResourceKind(value: unknown): value is ResourceKind {
  return RESOURCE_KINDS.includes(value as ResourceKind)
}

export class ResourceStore {
  private current: ResourceState | null
  private chestRewards: ChestRewardState
  private enabled = false

  constructor() {
    this.current = loadResources()
    this.chestRewards = loadChestRewards() ?? emptyChestRewards()
    this.reconcileChestRewards()
  }

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
      this.chestRewards = emptyChestRewards()
      saveResources(this.current)
      saveChestRewards(this.chestRewards)
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

  collectChest(
    chestId: string,
    reward: ResourceKind = "gold",
    amount = 1,
  ): boolean {
    const normalizedId = chestId.trim()
    if (
      !normalizedId ||
      !isResourceKind(reward) ||
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      !this.enabled ||
      !this.current ||
      this.current.collectedChests.includes(normalizedId)
    ) {
      return false
    }

    if (reward === "energy") {
      if (this.current.energy === null) return false
      const energy = this.current.energy + amount
      if (!Number.isSafeInteger(energy)) return false
      this.current.energy = energy
    } else {
      const resource = this.current[reward] + amount
      if (!Number.isSafeInteger(resource)) return false
      this.current[reward] = resource
    }
    this.current.collectedChests.push(normalizedId)
    this.chestRewards.collected[reward].push(normalizedId)
    saveResources(this.current)
    saveChestRewards(this.chestRewards)
    return true
  }

  classifyCollectedChest(chestId: string, reward: ResourceKind): boolean {
    const normalizedId = chestId.trim()
    if (
      !normalizedId ||
      !isResourceKind(reward) ||
      !this.current?.collectedChests.includes(normalizedId)
    ) {
      return false
    }

    for (const kind of RESOURCE_KINDS) {
      if (this.chestRewards.collected[kind].includes(normalizedId)) {
        return false
      }
    }

    this.chestRewards.collected[reward].push(normalizedId)
    saveChestRewards(this.chestRewards)
    return true
  }

  collectedChestCounts(): ResourceCounts {
    return {
      gold: this.chestRewards.collected.gold.length,
      diamonds: this.chestRewards.collected.diamonds.length,
      energy: this.chestRewards.collected.energy.length,
    }
  }

  isChestCollected(chestId: string): boolean {
    return Boolean(this.current?.collectedChests.includes(chestId.trim()))
  }

  state(): ResourceState | null {
    return this.enabled && this.current ? cloneState(this.current) : null
  }

  private reconcileChestRewards(): void {
    const collected = new Set(this.current?.collectedChests ?? [])
    const claimed = new Set<string>()
    let changed = false

    for (const reward of RESOURCE_KINDS) {
      const filtered = this.chestRewards.collected[reward].filter((chestId) => {
        if (!collected.has(chestId) || claimed.has(chestId)) {
          changed = true
          return false
        }
        claimed.add(chestId)
        return true
      })
      if (filtered.length !== this.chestRewards.collected[reward].length) {
        changed = true
      }
      this.chestRewards.collected[reward] = filtered
    }

    if (changed) saveChestRewards(this.chestRewards)
  }
}
