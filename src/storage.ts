import { createConfig } from "./score.ts"
import { createEmptyKeyCounts, KEY_COLORS } from "./key-colors.ts"
import { liaCourseIdentity } from "./course-identity.ts"
import type {
  AchievementState,
  ChestRewardState,
  HighscoreState,
  KeyInventoryState,
  MagnifierState,
  PuzzleState,
  ResourceKind,
  ResourceState,
} from "./types"
import {
  ACHIEVEMENT_IDS,
  LEGACY_ACHIEVEMENT_IDS,
  RESOURCE_KINDS,
} from "./types.ts"

const STORAGE_PREFIX = "lia-loot:highscore:v1:"
const RESOURCES_STORAGE_PREFIX = "lia-loot:resources:v1:"
const CHEST_REWARDS_STORAGE_PREFIX = "lia-loot:chest-rewards:v1:"
const KEY_INVENTORY_STORAGE_PREFIX = "lia-loot:key-inventory:v1:"
const MAGNIFIER_STORAGE_PREFIX = "lia-loot:magnifier:v1:"
const ACHIEVEMENTS_STORAGE_PREFIX = "lia-loot:achievements:v1:"
const PUZZLE_STORAGE_PREFIX = "lia-loot:puzzles:v1:"

function legacyCourseStorageKey(prefix: string): string {
  const course = `${window.location.origin}${window.location.pathname}${window.location.search}`
  return `${prefix}${encodeURIComponent(course)}`
}

function migrateLegacyCourseStorage(
  prefix: string,
  targetKey: string,
): void {
  const legacyKey = legacyCourseStorageKey(prefix)
  if (legacyKey === targetKey) return

  const legacyValue = window.sessionStorage.getItem(legacyKey)
  if (legacyValue === null) return
  if (window.sessionStorage.getItem(targetKey) === null) {
    window.sessionStorage.setItem(targetKey, legacyValue)
  }
  window.sessionStorage.removeItem(legacyKey)
}

function courseStorageKey(prefix: string): string {
  const targetKey = `${prefix}${encodeURIComponent(liaCourseIdentity())}`
  migrateLegacyCourseStorage(prefix, targetKey)
  return targetKey
}

function storageKey(): string {
  return courseStorageKey(STORAGE_PREFIX)
}

function resourcesStorageKey(): string {
  return courseStorageKey(RESOURCES_STORAGE_PREFIX)
}

function chestRewardsStorageKey(): string {
  return courseStorageKey(CHEST_REWARDS_STORAGE_PREFIX)
}

function keyInventoryStorageKey(): string {
  return courseStorageKey(KEY_INVENTORY_STORAGE_PREFIX)
}

function magnifierStorageKey(): string {
  return courseStorageKey(MAGNIFIER_STORAGE_PREFIX)
}

function achievementsStorageKey(): string {
  return courseStorageKey(ACHIEVEMENTS_STORAGE_PREFIX)
}

function puzzleStorageKey(): string {
  return courseStorageKey(PUZZLE_STORAGE_PREFIX)
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

function normalizeChestRewardState(value: unknown): ChestRewardState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (
    state.version !== 1 ||
    !state.collected ||
    typeof state.collected !== "object" ||
    Array.isArray(state.collected)
  ) {
    return null
  }

  const rawCollected = state.collected as Record<string, unknown>
  if (
    Object.keys(rawCollected).some(
      (reward) => !RESOURCE_KINDS.includes(reward as ResourceKind),
    )
  ) {
    return null
  }

  const collected = {
    gold: [] as string[],
    diamonds: [] as string[],
    energy: [] as string[],
  }
  const allIds = new Set<string>()
  for (const reward of RESOURCE_KINDS) {
    const rawIds = rawCollected[reward] ?? []
    if (
      !Array.isArray(rawIds) ||
      !rawIds.every(
        (chestId) => typeof chestId === "string" && chestId.trim().length > 0,
      )
    ) {
      return null
    }
    const ids = rawIds.map((chestId: string) => chestId.trim())
    if (new Set(ids).size !== ids.length) return null
    for (const id of ids) {
      if (allIds.has(id)) return null
      allIds.add(id)
    }
    collected[reward] = ids
  }

  return { version: 1, collected }
}

export function loadChestRewards(): ChestRewardState | null {
  try {
    const raw = window.sessionStorage.getItem(chestRewardsStorageKey())
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    return normalizeChestRewardState(value)
  } catch {
    return null
  }
}

export function saveChestRewards(state: ChestRewardState): void {
  try {
    window.sessionStorage.setItem(
      chestRewardsStorageKey(),
      JSON.stringify(state),
    )
  } catch {
    // Chest achievements still work in memory when browser storage is unavailable.
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

function normalizePuzzleState(value: unknown): PuzzleState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (
    state.version !== 1 ||
    typeof state.signature !== "string" ||
    state.signature.length === 0 ||
    state.signature.length > 512 ||
    !state.collected ||
    typeof state.collected !== "object" ||
    Array.isArray(state.collected) ||
    !state.placements ||
    typeof state.placements !== "object" ||
    Array.isArray(state.placements) ||
    !Array.isArray(state.solvedGates)
  ) {
    return null
  }

  const rawCollected = state.collected as Record<string, unknown>
  const rawPlacements = state.placements as Record<string, unknown>
  const collected = Object.fromEntries(
    KEY_COLORS.map((color) => [color, [] as number[]]),
  ) as PuzzleState["collected"]
  const placements = Object.fromEntries(
    KEY_COLORS.map((color) => [color, [] as Array<number | null>]),
  ) as PuzzleState["placements"]

  for (const color of KEY_COLORS) {
    const rawNumbers = rawCollected[color] ?? []
    const rawSlots = rawPlacements[color] ?? []
    if (
      !Array.isArray(rawNumbers) ||
      !rawNumbers.every(
        (number) => Number.isInteger(number) && Number(number) >= 1 && Number(number) <= 16,
      ) ||
      new Set(rawNumbers).size !== rawNumbers.length ||
      !Array.isArray(rawSlots) ||
      rawSlots.length > 16 ||
      !rawSlots.every(
        (number) =>
          number === null ||
          (Number.isInteger(number) && Number(number) >= 1 && Number(number) <= 16),
      )
    ) {
      return null
    }
    const placed = rawSlots.filter((number): number is number => number !== null)
    if (
      new Set(placed).size !== placed.length ||
      placed.some((number) => !rawNumbers.includes(number))
    ) {
      return null
    }
    collected[color] = [...rawNumbers]
    placements[color] = [...rawSlots]
  }

  if (
    !state.solvedGates.every(
      (color) => typeof color === "string" && KEY_COLORS.includes(color as typeof KEY_COLORS[number]),
    ) ||
    new Set(state.solvedGates).size !== state.solvedGates.length
  ) {
    return null
  }

  return {
    version: 1,
    signature: state.signature,
    collected,
    placements,
    solvedGates: [...state.solvedGates] as PuzzleState["solvedGates"],
  }
}

export function loadPuzzles(): PuzzleState | null {
  try {
    const raw = window.sessionStorage.getItem(puzzleStorageKey())
    if (!raw) return null
    return normalizePuzzleState(JSON.parse(raw))
  } catch {
    return null
  }
}

export function savePuzzles(state: PuzzleState): void {
  try {
    window.sessionStorage.setItem(puzzleStorageKey(), JSON.stringify(state))
  } catch {
    // Puzzle progress still works in memory when browser storage is unavailable.
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

  if (
    state.legacyAllChestsOpened !== undefined &&
    typeof state.legacyAllChestsOpened !== "boolean"
  ) {
    return null
  }

  const allowed = new Set<string>([
    ...ACHIEVEMENT_IDS,
    ...LEGACY_ACHIEVEMENT_IDS,
  ])
  if (
    !state.unlocked.every(
      (achievementId) =>
        typeof achievementId === "string" && allowed.has(achievementId),
    )
  ) {
    return null
  }

  const storedIds = [...state.unlocked] as string[]
  if (new Set(storedIds).size !== storedIds.length) return null
  const legacyAllChestsOpened =
    state.legacyAllChestsOpened === true ||
    storedIds.includes("all-chests-opened")
  const active = new Set<string>(ACHIEVEMENT_IDS)
  const unlocked = storedIds.filter((id) =>
    active.has(id),
  ) as AchievementState["unlocked"]
  return legacyAllChestsOpened
    ? { version: 1, unlocked, legacyAllChestsOpened: true }
    : { version: 1, unlocked }
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
