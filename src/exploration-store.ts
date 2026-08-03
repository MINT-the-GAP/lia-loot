import { liaCourseIdentity } from "./course-identity.ts"
import type { ConcealmentMode } from "./concealment.ts"
import { TOOL_KINDS, type ToolKind } from "./exploration-options.ts"

const EXPLORATION_STORAGE_PREFIX = "lia-loot:exploration:v1:"

export interface ExplorationState {
  version: 1
  collectedTools: ToolKind[]
  dugLayers: string[]
  foundDustObjects: string[]
  foundInvisibleObjects: string[]
  wateredPlants: string[]
  openedPlants: string[]
}

function emptyState(): ExplorationState {
  return {
    version: 1,
    collectedTools: [],
    dugLayers: [],
    foundDustObjects: [],
    foundInvisibleObjects: [],
    wateredPlants: [],
    openedPlants: [],
  }
}

function cloneState(state: ExplorationState): ExplorationState {
  return {
    version: 1,
    collectedTools: [...state.collectedTools],
    dugLayers: [...state.dugLayers],
    foundDustObjects: [...state.foundDustObjects],
    foundInvisibleObjects: [...state.foundInvisibleObjects],
    wateredPlants: [...state.wateredPlants],
    openedPlants: [...state.openedPlants],
  }
}

export function isToolKind(value: unknown): value is ToolKind {
  return TOOL_KINDS.includes(value as ToolKind)
}

function normalizedIds(value: unknown): string[] | null {
  if (
    !Array.isArray(value) ||
    !value.every((id) => typeof id === "string" && id.trim().length > 0)
  ) {
    return null
  }

  const ids = value.map((id: string) => id.trim())
  return new Set(ids).size === ids.length ? ids : null
}

function normalizeState(value: unknown): ExplorationState | null {
  if (!value || typeof value !== "object") return null
  const state = value as Record<string, unknown>
  if (
    state.version !== 1 ||
    !Array.isArray(state.collectedTools) ||
    !state.collectedTools.every(isToolKind)
  ) {
    return null
  }

  const collectedTools = [...state.collectedTools] as ToolKind[]
  if (new Set(collectedTools).size !== collectedTools.length) return null

  const dugLayers = normalizedIds(state.dugLayers)
  const foundDustObjects = normalizedIds(state.foundDustObjects ?? [])
  const foundInvisibleObjects = normalizedIds(
    state.foundInvisibleObjects ?? [],
  )
  const wateredPlants = normalizedIds(state.wateredPlants)
  const openedPlants = normalizedIds(state.openedPlants)
  if (
    !dugLayers ||
    !foundDustObjects ||
    !foundInvisibleObjects ||
    !wateredPlants ||
    !openedPlants
  ) {
    return null
  }

  const watered = new Set(wateredPlants)
  if (!openedPlants.every((plantId) => watered.has(plantId))) return null

  return {
    version: 1,
    collectedTools,
    dugLayers,
    foundDustObjects,
    foundInvisibleObjects,
    wateredPlants,
    openedPlants,
  }
}

function storageKey(): string {
  return `${EXPLORATION_STORAGE_PREFIX}${encodeURIComponent(liaCourseIdentity())}`
}

function loadState(): ExplorationState | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey())
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    return normalizeState(value)
  } catch {
    return null
  }
}

function saveState(state: ExplorationState): void {
  try {
    window.sessionStorage.setItem(storageKey(), JSON.stringify(state))
  } catch {
    // Exploration continues in memory when browser storage is unavailable.
  }
}

function normalizedId(value: string): string | null {
  const id = value.trim()
  return id || null
}

export class ExplorationStore {
  private current: ExplorationState = loadState() ?? emptyState()
  private active: ToolKind | null = null

  collectTool(kind: ToolKind): boolean {
    if (!isToolKind(kind) || this.current.collectedTools.includes(kind)) {
      return false
    }
    this.current.collectedTools.push(kind)
    saveState(this.current)
    return true
  }

  isToolCollected(kind: ToolKind): boolean {
    return isToolKind(kind) && this.current.collectedTools.includes(kind)
  }

  setActiveTool(kind: ToolKind | null): boolean {
    if (kind === null) {
      if (this.active === null) return false
      this.active = null
      return true
    }
    if (!this.isToolCollected(kind) || this.active === kind) return false
    this.active = kind
    return true
  }

  activeTool(): ToolKind | null {
    return this.active
  }

  digLayer(layerId: string): boolean {
    return this.recordId(layerId, this.current.dugLayers)
  }

  isLayerDug(layerId: string): boolean {
    return this.hasId(layerId, this.current.dugLayers)
  }

  findConcealedObject(
    concealmentId: string,
    mode: ConcealmentMode,
  ): boolean {
    return this.recordId(
      concealmentId,
      mode === "dust"
        ? this.current.foundDustObjects
        : this.current.foundInvisibleObjects,
    )
  }

  isConcealedObjectFound(
    concealmentId: string,
    mode: ConcealmentMode,
  ): boolean {
    return this.hasId(
      concealmentId,
      mode === "dust"
        ? this.current.foundDustObjects
        : this.current.foundInvisibleObjects,
    )
  }

  waterPlant(plantId: string): boolean {
    return this.recordId(plantId, this.current.wateredPlants)
  }

  isPlantWatered(plantId: string): boolean {
    return this.hasId(plantId, this.current.wateredPlants)
  }

  openPlant(plantId: string): boolean {
    const id = normalizedId(plantId)
    if (
      !id ||
      !this.current.wateredPlants.includes(id) ||
      this.current.openedPlants.includes(id)
    ) {
      return false
    }
    this.current.openedPlants.push(id)
    saveState(this.current)
    return true
  }

  isPlantOpened(plantId: string): boolean {
    return this.hasId(plantId, this.current.openedPlants)
  }

  state(): ExplorationState {
    return cloneState(this.current)
  }

  private recordId(value: string, ids: string[]): boolean {
    const id = normalizedId(value)
    if (!id || ids.includes(id)) return false
    ids.push(id)
    saveState(this.current)
    return true
  }

  private hasId(value: string, ids: readonly string[]): boolean {
    const id = normalizedId(value)
    return id !== null && ids.includes(id)
  }
}
