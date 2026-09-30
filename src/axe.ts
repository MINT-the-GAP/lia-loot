export const AXE_TIERS = ["stone", "iron", "gold", "diamond"] as const
export type AxeTier = (typeof AXE_TIERS)[number]

export type AxeUpgradeUnlock =
  | "axe-iron"
  | "axe-gold"
  | "axe-diamond"

export const AXE_TIER_DETAILS: Readonly<
  Record<
    AxeTier,
    {
      hits: number
      label: string
      power: number
      unlock: AxeUpgradeUnlock | null
    }
  >
> = {
  stone: {
    hits: 8,
    label: "Steinaxt",
    power: 1,
    unlock: null,
  },
  iron: {
    hits: 4,
    label: "Eisenaxt",
    power: 2,
    unlock: "axe-iron",
  },
  gold: {
    hits: 2,
    label: "Goldaxt",
    power: 4,
    unlock: "axe-gold",
  },
  diamond: {
    hits: 1,
    label: "Diamantaxt",
    power: 8,
    unlock: "axe-diamond",
  },
}

const AXE_UNLOCK_TIERS: Readonly<Record<AxeUpgradeUnlock, AxeTier>> = {
  "axe-iron": "iron",
  "axe-gold": "gold",
  "axe-diamond": "diamond",
}

export function isAxeUpgradeUnlock(
  value: unknown,
): value is AxeUpgradeUnlock {
  return (
    value === "axe-iron" ||
    value === "axe-gold" ||
    value === "axe-diamond"
  )
}

export function axeTierForUnlock(
  unlock: string,
): AxeTier | null {
  return isAxeUpgradeUnlock(unlock) ? AXE_UNLOCK_TIERS[unlock] : null
}

export function axeTierRank(tier: AxeTier): number {
  return AXE_TIERS.indexOf(tier)
}
