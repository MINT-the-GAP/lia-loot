import { createConfig } from "./score.ts"
import { createEmptyKeyCounts, KEY_COLORS } from "./key-colors.ts"
import type {
  AchievementState,
  HighscoreState,
  KeyInventoryState,
  MagnifierState,
  ResourceState,
} from "./types"
import { ACHIEVEMENT_IDS } from "./types.ts"

const STORAGE_PREFIX = "lia-loot:highscore:v1:"
const RESOURCES_STORAGE_PREFIX = "lia-loot:resources:v1:"
const KEY_INVENTORY_STORAGE_PREFIX = "lia-loot:key-inventory:v1:"
const MAGNIFIER_STORAGE_PREFIX = "lia-loot:magnifier:v1:"
const ACHIEVEMENTS_STORAGE_PREFIX = "lia-loot:achievements:v1:"

function storageKey(): string {
  const course = `${window.location.origin}${window.location.pathname}${window.location.search}`
  return `${STORAGE_PREFIX}${encodeURIComponent(course)}`
}

function resourcesStorageKey(): string {
  const course = `${window.location.origin}${window.location.pathname}${window.location.search}`
  return `${RESOURCES_STORAGE_PREFIX}${encodeURIComponent(course)}`
}

function keyInventoryStorageKey(): string {
  const course = `${window.location.origin}${window.location.pathname}${window.location.search}`
  return `${KEY_INVENTORY_STORAGE_PREFIX}${encodeURIComponent(course)}`
}

function magnifierStorageKey(): string {
  const course = `${window.location.origin}${window.location.pathname}${window.location.search}`
  return `${MAGNIFIER_STORAGE_PREFIX}${encodeURIComponent(course)}`
}

function achievementsStorageKey(): string {
  const course = `${window.location.origin}${window.location.pathname}${window.location.search}`
  return `${ACHIEVEMENTS_STORAGE_PREFIX}${encodeURIComponent(course)}`
}

function isState(value: unknown): value is HighscoreState {
  if (!value || typeof value !== "object") return false

  const state = value as Partial<HighscoreState>
  if (state.version !== 1 || !state.config) return false

  try {
    createConfig(
      state.config.maxPoints,
      state.config.failedCheckPenalty,
      state.config.hintPenalty,
      state.config.graceMinutes,
      state.config.perMinutePenalty,
    )
  } catch {
    return false
  }

  return (
    Number.isFinite(state.startedAt) &&
    Number.isInteger(state.failedChecks) &&
    Number(state.failedChecks) >= 0 &&
    Number.isInteger(state.hintsUsed) &&
    Number(state.hintsUsed) >= 0 &&
    (state.finishedAt === null || Number.isFinite(state.finishedAt)) &&
    (state.finalScore === null || Number.isFinite(state.finalScore))
  )
}

export function loadState(): HighscoreState | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey())
    if (!raw) return null

    const value: unknown = JSON.parse(raw)
    return isState(value) ? value : null
  } catch {
    return null
  }
}

export function saveState(state: HighscoreState): void {
  try {
    window.sessionStorage.setItem(storageKey(), JSON.stringify(state))
  } catch {
    // The highscore still works in memory when browser storage is unavailable.
  }
}

export function clearState(): void {
  try {
    window.sessionStorage.removeItem(storageKey())
  } catch {
    // Nothing else to clear when browser storage is unavailable.
  }
}

function normalizeResourceState(value: unknown): ResourceState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>

  if (
    state.version !== 1 ||
    !Number.isInteger(state.initialGold) ||
    Number(state.initialGold) < 0 ||
    !Number.isInteger(state.initialDiamonds) ||
    Number(state.initialDiamonds) < 0 ||
    !Number.isInteger(state.gold) ||
    Number(state.gold) < 0 ||
    !Number.isInteger(state.diamonds) ||
    Number(state.diamonds) < 0
  ) {
    return null
  }

  const hasInitialEnergy =
    state.initialEnergy !== undefined && state.initialEnergy !== null
  const hasEnergy = state.energy !== undefined && state.energy !== null

  if (
    hasInitialEnergy !== hasEnergy ||
    (hasInitialEnergy &&
      (!Number.isInteger(state.initialEnergy) ||
        Number(state.initialEnergy) < 0 ||
        !Number.isInteger(state.energy) ||
        Number(state.energy) < 0))
  ) {
    return null
  }

  if (
    state.collectedChests !== undefined &&
    (!Array.isArray(state.collectedChests) ||
      !state.collectedChests.every(
        (chestId) => typeof chestId === "string" && chestId.trim().length > 0,
      ))
  ) {
    return null
  }

  if (state.chestCollected !== undefined && typeof state.chestCollected !== "boolean") {
    return null
  }

  const collectedChests = Array.isArray(state.collectedChests)
    ? [...new Set(state.collectedChests.map((chestId) => chestId.trim()))]
    : state.chestCollected === true
      ? ["legacy:auto"]
      : []

  return {
    version: 1,
    initialGold: Number(state.initialGold),
    initialDiamonds: Number(state.initialDiamonds),
    initialEnergy: hasInitialEnergy ? Number(state.initialEnergy) : null,
    gold: Number(state.gold),
    diamonds: Number(state.diamonds),
    energy: hasEnergy ? Number(state.energy) : null,
    collectedChests,
  }
}

export function loadResources(): ResourceState | null {
  try {
    const raw = window.sessionStorage.getItem(resourcesStorageKey())
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    return normalizeResourceState(value)
  } catch {
    return null
  }
}

export function saveResources(state: ResourceState): void {
  try {
    window.sessionStorage.setItem(resourcesStorageKey(), JSON.stringify(state))
  } catch {
    // Resources still work in memory when browser storage is unavailable.
  }
}

function normalizeKeyInventoryState(value: unknown): KeyInventoryState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (state.version !== 1 || !state.keys || typeof state.keys !== "object") {
    return null
  }

  const rawKeys = state.keys as Record<string, unknown>
  const keys = createEmptyKeyCounts()
  for (const color of KEY_COLORS) {
    const amount = rawKeys[color] ?? 0
    if (!Number.isInteger(amount) || Number(amount) < 0) return null
    keys[color] = Number(amount)
  }

  if (
    !Array.isArray(state.collectedKeys) ||
    !state.collectedKeys.every(
      (keyId) => typeof keyId === "string" && keyId.trim().length > 0,
    )
  ) {
    return null
  }

  const collectedKeys = [
    ...new Set(state.collectedKeys.map((keyId) => keyId.trim())),
  ]
  if (
    state.unlockedLocks !== undefined &&
    (!Array.isArray(state.unlockedLocks) ||
      !state.unlockedLocks.every(
        (lockId) => typeof lockId === "string" && lockId.trim().length > 0,
      ))
  ) {
    return null
  }
  const rawUnlockedLocks = Array.isArray(state.unlockedLocks)
    ? state.unlockedLocks.map((lockId) => lockId.trim())
    : []
  const unlockedLocks = [...new Set(rawUnlockedLocks)]
  if (unlockedLocks.length !== rawUnlockedLocks.length) return null

  const totalKeys = KEY_COLORS.reduce(
    (total, color) => total + keys[color],
    0,
  )
  if (totalKeys + unlockedLocks.length !== collectedKeys.length) return null

  return {
    version: 1,
    keys,
    collectedKeys,
    unlockedLocks,
  }
}

export function loadKeyInventory(): KeyInventoryState | null {
  try {
    const raw = window.sessionStorage.getItem(keyInventoryStorageKey())
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    return normalizeKeyInventoryState(value)
  } catch {
    return null
  }
}

export function saveKeyInventory(state: KeyInventoryState): void {
  try {
    window.sessionStorage.setItem(
      keyInventoryStorageKey(),
      JSON.stringify(state),
    )
  } catch {
    // The key inventory still works in memory when browser storage is unavailable.
  }
}

function normalizeMagnifierState(value: unknown): MagnifierState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (
    state.version !== 1 ||
    typeof state.collected !== "boolean"
  ) {
    return null
  }
  return {
    version: 1,
    collected: state.collected,
  }
}

export function loadMagnifier(): MagnifierState | null {
  try {
    const raw = window.sessionStorage.getItem(magnifierStorageKey())
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    return normalizeMagnifierState(value)
  } catch {
    return null
  }
}

export function saveMagnifier(state: MagnifierState): void {
  try {
    window.sessionStorage.setItem(
      magnifierStorageKey(),
      JSON.stringify(state),
    )
  } catch {
    // The magnifier still works in memory when browser storage is unavailable.
  }
}

function normalizeAchievementState(value: unknown): AchievementState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (state.version !== 1 || !Array.isArray(state.unlocked)) return null

  const allowed = new Set<string>(ACHIEVEMENT_IDS)
  if (
    !state.unlocked.every(
      (achievementId) =>
        typeof achievementId === "string" && allowed.has(achievementId),
    )
  ) {
    return null
  }

  const unlocked = [...state.unlocked] as AchievementState["unlocked"]
  if (new Set(unlocked).size !== unlocked.length) return null
  return { version: 1, unlocked }
}

export function loadAchievements(): AchievementState | null {
  try {
    const raw = window.sessionStorage.getItem(achievementsStorageKey())
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    return normalizeAchievementState(value)
  } catch {
    return null
  }
}

export function saveAchievements(state: AchievementState): void {
  try {
    window.sessionStorage.setItem(
      achievementsStorageKey(),
      JSON.stringify(state),
    )
  } catch {
    // Achievements still work in memory when browser storage is unavailable.
  }
}
