import { AchievementManager } from "./achievements"
import { showAchievement } from "./achievement-overlay"
import { AchievementStore } from "./achievement-store"
import { KeyInventoryStore } from "./inventory-store"
import { KEY_COLOR_DETAILS } from "./key-colors"
import {
  announceKeyFound,
  focusKeyInventory,
  renderKeyInventory,
} from "./key-inventory-bar"
import { installKeyPickups } from "./key-pickup"
import { installMagnifier } from "./magnifier"
import { MagnifierStore } from "./magnifier-store"
import { installObjectLocks } from "./object-lock"
import {
  discoverCourseAchievementsDeclaration,
  discoverCourseResourceDeclaration,
  discoverCourseVersion,
} from "./course-chests"
import { prepareLiaCourseIdentity } from "./course-identity"
import { hideHighscore, showHighscore } from "./popup"
import {
  allRenderedCourseQuizzesSolved,
  installQuizEventTracking,
} from "./quiz-events"
import {
  announceResource,
  renderResources,
  showInsufficientResource,
} from "./resource-bar"
import { ResourceStore } from "./resource-store"
import { createConfig } from "./score"
import { installSecretSlides } from "./secret-slides"
import { installSlidePortals } from "./slide-portal"
import { injectStyles } from "./style"
import { HighscoreStore } from "./store"
import { installTimerEventTracking } from "./timer-events"
import {
  installTreasureChests,
  refreshTreasureChests,
} from "./treasure-chest"
import type { HighscoreApi, LootRuntimeState, ResourceKind } from "./types"

const VERSION = "0.0.1"

function boot(): void {
  const store = new HighscoreStore()
  const resourceStore = new ResourceStore()
  const keyInventoryStore = new KeyInventoryStore()
  const magnifierStore = new MagnifierStore()
  const achievementStore = new AchievementStore()
  const achievements = new AchievementManager(
    achievementStore,
    showAchievement,
  )

  const enableAchievements = (): void => {
    const highscore = store.state()
    achievements.highscoreFinished(
      highscore?.finalScore ?? null,
      highscore?.config.maxPoints ?? Number.NaN,
    )
    if (allRenderedCourseQuizzesSolved(document)) {
      achievements.quizzesCompleted()
    }
    achievements.enable()
  }

  const spendResource = (kind: ResourceKind): boolean => {
    const allowed = resourceStore.spend(kind)
    const resources = resourceStore.state()
    if (resources) {
      renderResources(resources.gold, resources.diamonds, resources.energy)
    }
    if (!allowed) {
      showInsufficientResource(
        kind === "gold" ? "coins" : kind === "diamonds" ? "gems" : "energy",
      )
    }
    return allowed
  }

  const collectTreasureChest = (
    chestId: string,
    reward: ResourceKind,
  ): boolean => {
    if (!resourceStore.collectChest(chestId, reward)) return false
    const resources = resourceStore.state()
    if (!resources) return false
    achievements.chestCollected(resources.collectedChests.length)
    renderResources(resources.gold, resources.diamonds, resources.energy)
    announceResource(
      reward === "diamonds"
        ? "Diamanttruhe geöffnet: einen Diamanten erhalten."
        : reward === "energy"
          ? "Energiekiste geöffnet: einen Energiepunkt erhalten."
          : "Schatztruhe geöffnet: eine Goldmünze erhalten.",
    )
    return true
  }

  const configureResources = (
    gold: number,
    diamonds: number,
    energy?: number,
  ): void => {
    const resources = resourceStore.configure(gold, diamonds, energy)
    achievements.chestCollected(resources.collectedChests.length)
    renderResources(resources.gold, resources.diamonds, resources.energy)
    refreshTreasureChests()
  }

  const api: HighscoreApi = {
    version: VERSION,

    configure(maxPoints, failedCheckPenalty, hintPenalty, graceMinutes, perMinutePenalty) {
      const config = createConfig(
        maxPoints,
        failedCheckPenalty,
        hintPenalty,
        graceMinutes,
        perMinutePenalty,
      )
      store.configure(config)
      achievements.highscoreFinished(null, config.maxPoints)
    },

    fail(count = 1) {
      store.fail(count)
    },

    hint(count = 1) {
      store.hint(count)
    },

    finish() {
      const score = store.finish()
      const state = store.state()
      if (score !== null && state) {
        achievements.highscoreFinished(score, state.config.maxPoints)
        showHighscore(score, state.config.maxPoints)
      }
      return score
    },

    reset() {
      hideHighscore()
      store.reset()
      const state = store.state()
      achievements.highscoreFinished(
        null,
        state?.config.maxPoints ?? Number.NaN,
      )
    },

    score(at) {
      return store.score(at)
    },

    show() {
      const state = store.state()
      if (state?.finalScore !== null && state?.finalScore !== undefined) {
        showHighscore(state.finalScore, state.config.maxPoints)
      }
    },

    enableAchievements() {
      enableAchievements()
    },

    state() {
      return store.state()
    },

    resources(gold, diamonds, energy) {
      configureResources(gold, diamonds, energy)
    },
  }

  injectStyles()
  installSecretSlides({
    found: () => achievements.secretSlideFound(),
  })
  installSlidePortals()

  void discoverCourseAchievementsDeclaration()
    .then((enabled) => {
      if (enabled) enableAchievements()
    })
    .catch(() => {
      // The rendered macro remains the fallback when source loading fails.
    })

  void discoverCourseResourceDeclaration()
    .then((declaration) => {
      if (!declaration || resourceStore.state() !== null) return
      configureResources(
        declaration.gold,
        declaration.diamonds,
        declaration.energy,
      )
    })
    .catch(() => {
      // The rendered @Ressourcen macro remains the fallback when source loading fails.
    })

  const savedResources = resourceStore.state()
  if (savedResources) {
    renderResources(
      savedResources.gold,
      savedResources.diamonds,
      savedResources.energy,
    )
  }

  installTreasureChests({
    active: (reward) => {
      const resources = resourceStore.state()
      return (
        resources !== null &&
        (reward !== "energy" || resources.energy !== null)
      )
    },
    catalogReady: (total) => {
      achievements.chestCatalogReady(
        total,
        resourceStore.state()?.collectedChests.length ?? 0,
      )
    },
    collected: (chestId) => resourceStore.isChestCollected(chestId),
    collect: collectTreasureChest,
  })

  installMagnifier({
    collected: () => magnifierStore.isCollected(),
    collect: () => magnifierStore.collect(),
  })

  const savedKeys = keyInventoryStore.state()
  if (Object.values(savedKeys.keys).some((count) => count > 0)) {
    renderKeyInventory(savedKeys.keys)
  }

  installKeyPickups({
    collected: (keyId) => keyInventoryStore.isKeyCollected(keyId),
    collect: (keyId, color) => {
      if (!keyInventoryStore.collectKey(keyId, color)) return false
      renderKeyInventory(keyInventoryStore.state().keys)
      announceKeyFound(KEY_COLOR_DETAILS[color].foundMessage)
      return true
    },
    focusInventory: focusKeyInventory,
  })

  installObjectLocks({
    catalogReady: (total) => {
      achievements.lockCatalogReady(
        total,
        keyInventoryStore.state().unlockedLocks.length,
      )
    },
    unlocked: (lockId) => keyInventoryStore.isLockUnlocked(lockId),
    unlock: (lockId, color) => {
      const result = keyInventoryStore.useKeyForLock(lockId, color)
      if (result === "unlocked") {
        const inventory = keyInventoryStore.state()
        renderKeyInventory(inventory.keys)
        achievements.lockUnlocked(inventory.unlockedLocks.length)
      }
      return result
    },
  })

  installTimerEventTracking({
    useStart: () => spendResource("energy"),
  })

  installQuizEventTracking({
    active: () => store.isRunning() || achievements.isEnabled(),
    failed: () => store.fail(),
    hint: (count) => store.hint(count),
    solved: () => {
      if (allRenderedCourseQuizzesSolved(document)) {
        achievements.quizzesCompleted()
      }
    },
    courseCompleted: () => api.finish(),
    useCheck: () => spendResource("energy"),
    useHint: () => spendResource("gold"),
    useResolve: () => spendResource("diamonds"),
  })

  window.__LIA_LOOT_HIGHSCORE__ = api
}

function claimRuntime(): LootRuntimeState | null {
  const current = window.__LIA_LOOT_RUNTIME__
  if (current?.status === "booting" || current?.status === "ready") {
    return null
  }
  if (window.__LIA_LOOT_HIGHSCORE__) {
    window.__LIA_LOOT_RUNTIME__ = { version: VERSION, status: "ready" }
    return null
  }

  const runtime: LootRuntimeState = { version: VERSION, status: "booting" }
  window.__LIA_LOOT_RUNTIME__ = runtime
  return runtime
}

async function start(runtime: LootRuntimeState): Promise<void> {
  try {
    await prepareLiaCourseIdentity(discoverCourseVersion)
    boot()
    if (window.__LIA_LOOT_RUNTIME__ === runtime) runtime.status = "ready"
  } catch (error) {
    if (window.__LIA_LOOT_RUNTIME__ === runtime) runtime.status = "failed"
    console.error("[lia-loot] Initialisierung fehlgeschlagen.", error)
  }
}

const runtime = claimRuntime()
if (runtime) void start(runtime)
