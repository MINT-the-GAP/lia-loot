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

function resourceBundle(
  value: Partial<Record<ResourceKind, number>>,
): ResourceCounts | null {
  const bundle = { gold: 0, diamonds: 0, energy: 0 }
  for (const kind of RESOURCE_KINDS) {
    const amount = value[kind] ?? 0
    if (!Number.isSafeInteger(amount) || amount < 0) return null
    bundle[kind] = amount
  }
  return bundle
}

export class ResourceStore {
  private current: ResourceState | null
  private chestRewards: ChestRewardState
  private enabled = false
  private goldValue = 100
  private diamondValue = 250
  private listeners = new Set<
    (previous: ResourceState | null, current: ResourceState | null) => void
  >()

  constructor() {
    this.current = loadResources()
    this.chestRewards = loadChestRewards() ?? emptyChestRewards()
    this.reconcileChestRewards()
  }

  configure(
    initialGold: number,
    initialDiamonds: number,
    initialEnergy?: number,
    goldValue = 100,
    diamondValue = 250,
  ): ResourceState {
    const previous = this.state()
    const gold = resourceAmount(initialGold, "Gold")
    const diamonds = resourceAmount(initialDiamonds, "Diamanten")
    const energy =
      initialEnergy === undefined
        ? null
        : resourceAmount(initialEnergy, "Energie")

    for (const [name, value] of [
      ["goldwert", goldValue],
      ["diamantwert", diamondValue],
    ] as const) {
      if (!Number.isFinite(value) || value < 0) {
        throw new TypeError(`@Ressourcen: ${name} muss eine nichtnegative Zahl sein.`)
      }
    }

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

    this.goldValue = goldValue
    this.diamondValue = diamondValue
    this.enabled = true
    this.notify(previous)
    return cloneState(this.current)
  }

  scoreBonus(): number {
    if (!this.enabled || !this.current) return 0
    return (
      this.current.gold * this.goldValue +
      this.current.diamonds * this.diamondValue
    )
  }

  spend(kind: ResourceKind): boolean {
    if (!this.enabled || !this.current) return true
    const previous = cloneState(this.current)

    if (kind === "energy") {
      if (this.current.energy === null) return true
      if (this.current.energy <= 0) return false
      this.current.energy -= 1
    } else {
      if (this.current[kind] <= 0) return false
      this.current[kind] -= 1
    }

    saveResources(this.current)
    this.notify(previous)
    return true
  }

  canAfford(cost: Partial<Record<ResourceKind, number>>): boolean {
    const bundle = resourceBundle(cost)
    if (!bundle || !this.enabled || !this.current) return false
    if (bundle.energy > 0 && this.current.energy === null) return false
    return (
      this.current.gold >= bundle.gold &&
      this.current.diamonds >= bundle.diamonds &&
      (this.current.energy === null || this.current.energy >= bundle.energy)
    )
  }

  exchange(
    cost: Partial<Record<ResourceKind, number>>,
    reward: Partial<Record<ResourceKind, number>> = {},
  ): boolean {
    const previous = this.state()
    const debit = resourceBundle(cost)
    const credit = resourceBundle(reward)
    if (!debit || !credit || !this.canAfford(debit) || !this.current) return false
    if (
      (debit.energy > 0 || credit.energy > 0) &&
      this.current.energy === null
    ) {
      return false
    }

    const gold = this.current.gold - debit.gold + credit.gold
    const diamonds =
      this.current.diamonds - debit.diamonds + credit.diamonds
    const energy =
      this.current.energy === null
        ? null
        : this.current.energy - debit.energy + credit.energy
    if (
      !Number.isSafeInteger(gold) ||
      gold < 0 ||
      !Number.isSafeInteger(diamonds) ||
      diamonds < 0 ||
      (energy !== null && (!Number.isSafeInteger(energy) || energy < 0))
    ) {
      return false
    }

    this.current.gold = gold
    this.current.diamonds = diamonds
    this.current.energy = energy
    saveResources(this.current)
    this.notify(previous)
    return true
  }

  collectChest(
    chestId: string,
    reward: ResourceKind = "gold",
    amount = 1,
  ): boolean {
    const previous = this.state()
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
    this.notify(previous)
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

  subscribe(
    listener: (
      previous: ResourceState | null,
      current: ResourceState | null,
    ) => void,
  ): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(previous: ResourceState | null): void {
    const current = this.state()
    for (const listener of this.listeners) listener(previous, current)
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
