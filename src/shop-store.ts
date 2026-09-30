import { liaCourseIdentity } from "./course-identity.ts"
import {
  axeTierForUnlock,
  axeTierRank,
  type AxeTier,
} from "./axe.ts"
import type { ShopPerkKind, ShopUnlockKind } from "./shop-options.ts"
import {
  isCatCollarColor,
  type CatCollarColor,
} from "./cat-collar.ts"

const STORAGE_PREFIX = "lia-loot:shop:v1:"
const PERK_KINDS: readonly ShopPerkKind[] = [
  "energy-chest",
  "magnifier-radius",
  "flashlight-radius",
]
const UNLOCK_KINDS: readonly ShopUnlockKind[] = [
  "atlas",
  "atlas-course-counts",
  "atlas-slide-info",
  "axe-iron",
  "axe-gold",
  "axe-diamond",
]

export type ShopGrant =
  | { kind: "perk"; perk: ShopPerkKind; percent: number }
  | { kind: "unlock"; unlock: ShopUnlockKind }
  | { kind: "collar"; color: CatCollarColor }

export interface ShopState {
  version: 1
  purchased: string[]
  perks: Record<ShopPerkKind, number>
  unlocks: Record<ShopUnlockKind, boolean>
}

function emptyState(): ShopState {
  return {
    version: 1,
    purchased: [],
    perks: {
      "energy-chest": 0,
      "flashlight-radius": 0,
      "magnifier-radius": 0,
    },
    unlocks: {
      atlas: false,
      "atlas-course-counts": false,
      "atlas-slide-info": false,
      "axe-iron": false,
      "axe-gold": false,
      "axe-diamond": false,
    },
  }
}

function cloneState(state: ShopState): ShopState {
  return {
    version: 1,
    purchased: [...state.purchased],
    perks: { ...state.perks },
    unlocks: { ...state.unlocks },
  }
}

function storageKey(): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(liaCourseIdentity())}`
}

function normalizeState(value: unknown): ShopState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (
    state.version !== 1 ||
    !Array.isArray(state.purchased) ||
    !state.purchased.every(
      (id) => typeof id === "string" && id.trim().length > 0 && id.length <= 512,
    ) ||
    new Set(state.purchased).size !== state.purchased.length ||
    !state.perks ||
    typeof state.perks !== "object" ||
    Array.isArray(state.perks)
  ) {
    return null
  }
  const rawPerks = state.perks as Record<string, unknown>
  const defaults = emptyState()
  const perks = defaults.perks
  for (const kind of PERK_KINDS) {
    const amount = rawPerks[kind]
    if (!Number.isSafeInteger(amount) || Number(amount) < 0) {
      return null
    }
    perks[kind] = Number(amount)
  }
  const rawUnlocks = state.unlocks
  const unlocks = defaults.unlocks
  if (rawUnlocks !== undefined) {
    if (!rawUnlocks || typeof rawUnlocks !== "object" || Array.isArray(rawUnlocks)) {
      return null
    }
    for (const kind of UNLOCK_KINDS) {
      const unlocked = (rawUnlocks as Record<string, unknown>)[kind]
      if (unlocked !== undefined && typeof unlocked !== "boolean") return null
      unlocks[kind] = unlocked === true
    }
  }
  return {
    version: 1,
    purchased: state.purchased.map((id) => String(id).trim()),
    perks,
    unlocks,
  }
}

function loadState(): ShopState | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey())
    return raw ? normalizeState(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function saveState(state: ShopState): void {
  try {
    window.sessionStorage.setItem(storageKey(), JSON.stringify(state))
  } catch {
    // Shop progress continues in memory when browser storage is unavailable.
  }
}

export function percentageRadius(baseRadius: number, percent: number): number {
  if (!Number.isFinite(baseRadius) || baseRadius <= 0) return 0
  const safePercent = Number.isFinite(percent) ? Math.max(0, percent) : 0
  return Math.round(baseRadius * (1 + safePercent / 100))
}

export function applyPercentageBonus(
  baseAmount: number,
  percent: number,
  random: () => number = Math.random,
): number {
  if (!Number.isSafeInteger(baseAmount) || baseAmount <= 0) return baseAmount
  const safePercent = Number.isFinite(percent) ? Math.max(0, percent) : 0
  const exactExtra = (baseAmount * safePercent) / 100
  const guaranteed = Math.floor(exactExtra)
  const fraction = exactExtra - guaranteed
  const roll = Math.max(0, Math.min(0.999999999999, Number(random()) || 0))
  return baseAmount + guaranteed + (roll < fraction ? 1 : 0)
}

export class ShopStore {
  private current: ShopState = loadState() ?? emptyState()

  isPurchased(purchaseId: string): boolean {
    return this.current.purchased.includes(purchaseId.trim())
  }

  recordPurchase(
    purchaseId: string,
    grant?: ShopGrant,
  ): boolean {
    const id = purchaseId.trim()
    if (!id || id.length > 512 || this.isPurchased(id)) return false
    if (
      grant?.kind === "perk" &&
      (!PERK_KINDS.includes(grant.perk) ||
        !Number.isSafeInteger(grant.percent) ||
        grant.percent <= 0 ||
        !Number.isSafeInteger(this.current.perks[grant.perk] + grant.percent))
    ) {
      return false
    }
    if (
      grant?.kind === "unlock" &&
      (!UNLOCK_KINDS.includes(grant.unlock) || this.current.unlocks[grant.unlock])
    ) return false
    if (grant?.kind === "collar" && !isCatCollarColor(grant.color)) return false
    this.current.purchased.push(id)
    if (grant?.kind === "perk") {
      this.current.perks[grant.perk] += grant.percent
    } else if (grant?.kind === "unlock") {
      this.current.unlocks[grant.unlock] = true
    }
    saveState(this.current)
    return true
  }

  perk(kind: ShopPerkKind): number {
    return this.current.perks[kind]
  }

  axeTier(): AxeTier {
    for (const unlock of [
      "axe-diamond",
      "axe-gold",
      "axe-iron",
    ] as const) {
      if (this.current.unlocks[unlock]) {
        return axeTierForUnlock(unlock) ?? "stone"
      }
    }
    return "stone"
  }

  hasEffectiveUnlock(kind: ShopUnlockKind): boolean {
    const requestedTier = axeTierForUnlock(kind)
    return requestedTier
      ? axeTierRank(this.axeTier()) >= axeTierRank(requestedTier)
      : this.hasUnlock(kind)
  }

  hasUnlock(kind: ShopUnlockKind): boolean {
    return this.current.unlocks[kind]
  }

  state(): ShopState {
    return cloneState(this.current)
  }
}
