import { AchievementManager } from "./achievements"
import { showAchievement } from "./achievement-overlay"
import { AchievementStore } from "./achievement-store"
import {
  AXE_TIER_DETAILS,
  axeTierForUnlock,
} from "./axe"
import { installAtlas, refreshAtlas } from "./atlas"
import {
  installBonusPickups,
  refreshBonusPickups,
} from "./bonus-pickup"
import {
  installCatCompanion,
  notifyCatItemFound,
  notifyCatTaskSolved,
  refreshCatCompanion,
} from "./cat"
import { catCollarLabel } from "./cat-collar"
import { CatCompanionStore } from "./cat-store"
import { installCatFood } from "./cat-food"
import { CatFoodStore } from "./cat-food-store"
import { KeyInventoryStore } from "./inventory-store"
import {
  FLASHLIGHT_RADIUS,
  installFlashlight,
  refreshFlashlight,
} from "./flashlight"
import { FlashlightStore } from "./flashlight-store"
import { installGifts } from "./gift"
import { GiftStore } from "./gift-store"
import {
  installWoodCrates,
  refreshWoodCrates,
} from "./wood-crate"
import { WoodCrateStore } from "./wood-crate-store"
import { installInlineRevealRendering } from "./inline-reveal"
import { KEY_COLOR_DETAILS } from "./key-colors"
import {
  announceKeyFound,
  focusKeyInventory,
  renderKeyInventory,
} from "./key-inventory-bar"
import { installKeyPickups } from "./key-pickup"
import {
  installMagnifier,
  MAGNIFIER_RADIUS,
  refreshMagnifier,
} from "./magnifier"
import { MagnifierStore } from "./magnifier-store"
import { installExploration, refreshExploration } from "./exploration"
import { ExplorationStore } from "./exploration-store"
import {
  installLootIf,
  recordLootIfQuizSolved,
  recordLootIfSecretSlideVisited,
  refreshLootIf,
} from "./loot-if"
import { LootIfStore } from "./loot-if-store"
import { installObjectLocks } from "./object-lock"
import {
  discoverCourseAchievementCatalog,
  discoverCourseAchievementsDeclaration,
  discoverCourseIdentity,
  discoverCourseResourceDeclaration,
  installCourseMarkdownCapture,
} from "./course-chests"
import { prepareLiaCourseIdentity } from "./course-identity"
import { hideHighscore, showHighscore } from "./popup"
import { installQuizEventTracking } from "./quiz-events"
import {
  announceResource,
  renderResources,
  showInsufficientResource,
} from "./resource-bar"
import { ResourceStore } from "./resource-store"
import { parseResourceOptions } from "./resource-options"
import {
  deferReserveEntryForQuiz,
  installReserveSlides,
  reserveQuizCheckIsFree,
  reserveSlideCountsForCourseProgress,
  rewardReserveQuiz,
  settleReserveQuizCheck,
} from "./reserve-slide"
import { calculateScore, createConfig } from "./score"
import { installSecretSlides } from "./secret-slides"
import { installSlidePortals } from "./slide-portal"
import { installPuzzles, refreshPuzzles } from "./puzzle-runtime"
import { PuzzleStore } from "./puzzle-store"
import {
  installShops,
  refreshShops,
  type ShopAvailability,
  type ShopPurchaseResult,
} from "./shop"
import type { ShopOffer } from "./shop-options"
import {
  applyPercentageBonus,
  percentageRadius,
  ShopStore,
} from "./shop-store"
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
  const resourceStore = new ResourceStore()
  const store = new HighscoreStore(() => resourceStore.scoreBonus())
  const keyInventoryStore = new KeyInventoryStore()
  const flashlightStore = new FlashlightStore()
  const giftStore = new GiftStore()
  const woodCrateStore = new WoodCrateStore()
  const magnifierStore = new MagnifierStore()
  const explorationStore = new ExplorationStore()
  const lootIfStore = new LootIfStore()
  const achievementStore = new AchievementStore()
  const puzzleStore = new PuzzleStore()
  const shopStore = new ShopStore()
  const catStore = new CatCompanionStore()
  const catFoodStore = new CatFoodStore()
  const achievements = new AchievementManager(
    achievementStore,
    showAchievement,
  )

  const enableAchievements = (): void => {
    const highscore = store.state()
    achievements.highscoreFinished(
      highscore?.finishedAt != null
        ? calculateScore(highscore.config, highscore, highscore.finishedAt)
        : null,
      highscore?.config.maxPoints ?? Number.NaN,
    )
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
    refreshLootIf()
    refreshShops()
    return allowed
  }

  const collectTreasureChest = (
    chestId: string,
    reward: ResourceKind,
    amount: number,
  ): boolean => {
    const rewardedAmount =
      reward === "energy"
        ? applyPercentageBonus(amount, shopStore.perk("energy-chest"))
        : amount
    if (!resourceStore.collectChest(chestId, reward, rewardedAmount)) return false
    const resources = resourceStore.state()
    if (!resources) return false
    achievements.chestCollected(resourceStore.collectedChestCounts())
    renderResources(resources.gold, resources.diamonds, resources.energy)
    announceResource(
      rewardedAmount === 1
        ? reward === "diamonds"
          ? "Diamanttruhe geöffnet: einen Diamanten erhalten."
          : reward === "energy"
            ? "Energiekiste geöffnet: einen Energiepunkt erhalten."
            : "Schatztruhe geöffnet: eine Goldmünze erhalten."
        : reward === "diamonds"
          ? "Diamanttruhe geöffnet: " + rewardedAmount + " Diamanten erhalten."
          : reward === "energy"
            ? "Energiekiste geöffnet: " + rewardedAmount + " Energiepunkte erhalten."
            : "Schatztruhe geöffnet: " + rewardedAmount + " Goldmünzen erhalten.",
    )
    refreshLootIf()
    refreshShops()
    notifyCatItemFound()
    return true
  }

  const configureResources = (
    gold: number,
    diamonds: number,
    energy?: number,
    goldValue?: number,
    diamondValue?: number,
  ): void => {
    const resources = resourceStore.configure(
      gold,
      diamonds,
      energy,
      goldValue,
      diamondValue,
    )
    achievements.chestCollected(resourceStore.collectedChestCounts())
    renderResources(resources.gold, resources.diamonds, resources.energy)
    refreshTreasureChests()
    refreshLootIf()
    refreshShops()
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
        achievements.highscoreFinished(
          calculateScore(state.config, state, state.finishedAt!),
          state.config.maxPoints,
        )
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

    resources(gold, diamonds, energyOrOption, ...options) {
      const parsed = parseResourceOptions([energyOrOption, ...options])
      configureResources(
        gold,
        diamonds,
        parsed.energy,
        parsed.goldValue,
        parsed.diamondValue,
      )
    },
  }

  injectStyles()
  installGifts({
    isOpened: (giftId) => giftStore.isOpened(giftId),
    open: (giftId) => giftStore.open(giftId),
  })
  installWoodCrates({
    activeTool: () => explorationStore.activeTool(),
    axeTier: () => shopStore.axeTier(),
    damage: (crateId) => woodCrateStore.damage(crateId),
    isAxeCollected: () => explorationStore.isToolCollected("axe"),
    isBroken: (crateId) => woodCrateStore.isBroken(crateId),
    strike: (crateId) =>
      woodCrateStore.strike(
        crateId,
        AXE_TIER_DETAILS[shopStore.axeTier()].power,
      ),
  })
  installCatCompanion({
    collar: () => catStore.selectedCollar(),
    collars: () => catStore.unlockedCollars(),
    collected: () => catStore.isCollected(),
    collectCollar: (color) => catStore.collectCollar(color),
    collect: (variant) => catStore.collect(variant),
    isCollarUnlocked: (color) => catStore.isCollarUnlocked(color),
    isUnlocked: (variant) => catStore.isUnlocked(variant),
    selectCollar: (color) => catStore.selectCollar(color),
    select: (variant) => catStore.select(variant),
    selected: () => catStore.selectedVariant(),
    unlocked: () => catStore.unlockedVariants(),
  })
  installCatFood({
    availableIds: () => catFoodStore.availableIds(),
    collect: (foodId) => catFoodStore.collect(foodId),
    feed: (foodId) => catFoodStore.feed(foodId),
    isCatCollected: () => catStore.isCollected(),
    isCollected: (foodId) => catFoodStore.isCollected(foodId),
    isFed: (foodId) => catFoodStore.isFed(foodId),
  })
  installLootIf(
    {
      chestCounts: () => resourceStore.collectedChestCounts(),
      magnifierFound: () => magnifierStore.isCollected(),
      resourceState: () => resourceStore.state(),
      unlockedLockIds: () => keyInventoryStore.state().unlockedLocks,
      openedPuzzleColors: () => puzzleStore.solvedColors(),
    },
    lootIfStore,
  )
  installPuzzles(puzzleStore, {
    catalogReady: (total, solved) => {
      achievements.puzzleCatalogReady(total, solved)
      refreshLootIf()
      refreshShops()
    },
    changed: () => {
      refreshLootIf()
      refreshShops()
    },
    pieceCollected: notifyCatItemFound,
    gateSolved: (solved) => {
      achievements.puzzleGateSolved(solved)
      refreshLootIf()
    },
  })
  installSecretSlides({
    found: () => {
      achievements.secretSlideFound()
      recordLootIfSecretSlideVisited()
    },
  })
  installReserveSlides({
    currentEnergy: () => resourceStore.state()?.energy ?? null,
    rewardEnergy: (amount) => {
      if (!resourceStore.exchange({}, { energy: amount })) return false
      const resources = resourceStore.state()
      if (!resources) return false
      renderResources(resources.gold, resources.diamonds, resources.energy)
      refreshLootIf()
      refreshShops()
      return true
    },
    subscribeEnergy: (listener) =>
      resourceStore.subscribe((previous, current) => {
        listener(previous?.energy ?? null, current?.energy ?? null)
      }),
  })
  installSlidePortals()

  void discoverCourseAchievementsDeclaration()
    .then((enabled) => {
      if (enabled) enableAchievements()
    })

  void discoverCourseAchievementCatalog()
    .then((catalog) => {
      const exploration = explorationStore.state()
      achievements.explorationCatalogReady(catalog, {
        dust: exploration.foundDustObjects.length,
        plant: exploration.wateredPlants.length,
        soil: exploration.dugLayers.length,
        solid: exploration.foundInvisibleObjects.length,
      })
    })
    .catch(() => {
      // A missing source must never turn an unknown aggregate into an achievement.
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
        declaration.goldValue,
        declaration.diamondValue,
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

  installMagnifier({
    collected: () => magnifierStore.isCollected(),
    collect: () => {
      const collected = magnifierStore.collect()
      if (collected) {
        refreshLootIf()
        refreshShops()
        notifyCatItemFound()
      }
      return collected
    },
    find: (concealmentId, mode) => {
      if (!explorationStore.findConcealedObject(concealmentId, mode)) return
      const exploration = explorationStore.state()
      achievements.concealmentFound(
        mode,
        mode === "dust"
          ? exploration.foundDustObjects.length
          : exploration.foundInvisibleObjects.length,
      )
    },
    radius: () =>
      percentageRadius(
        MAGNIFIER_RADIUS,
        shopStore.perk("magnifier-radius"),
      ),
  })

  installFlashlight({
    collected: () => flashlightStore.isCollected(),
    collect: () => {
      const collected = flashlightStore.collect()
      if (collected) {
        refreshShops()
        notifyCatItemFound()
      }
      return collected
    },
    radius: () =>
      percentageRadius(
        FLASHLIGHT_RADIUS,
        shopStore.perk("flashlight-radius"),
      ),
  })

  installExploration({
    activeTool: () => explorationStore.activeTool(),
    axeTier: () => shopStore.axeTier(),
    collectTool: (kind) => {
      const collected = explorationStore.collectTool(kind)
      if (collected) {
        refreshShops()
        notifyCatItemFound()
      }
      return collected
    },
    digLayer: (layerId) => {
      if (!explorationStore.digLayer(layerId)) return false
      achievements.soilDug(explorationStore.state().dugLayers.length)
      return true
    },
    isLayerDug: (layerId) => explorationStore.isLayerDug(layerId),
    isPlantOpened: (plantId) => explorationStore.isPlantOpened(plantId),
    isPlantWatered: (plantId) => explorationStore.isPlantWatered(plantId),
    isToolCollected: (kind) => explorationStore.isToolCollected(kind),
    openPlant: (plantId) => explorationStore.openPlant(plantId),
    setActiveTool: (kind) => explorationStore.setActiveTool(kind),
    waterPlant: (plantId) => {
      if (!explorationStore.waterPlant(plantId)) return false
      achievements.plantBloomed(
        explorationStore.state().wateredPlants.length,
      )
      return true
    },
  })

  const shopAvailability = (
    purchaseId: string,
    offer: ShopOffer,
  ): ShopAvailability => {
    if (shopStore.isPurchased(purchaseId)) {
      return {
        message: "Dieses Angebot wurde bereits gekauft.",
        state: "purchased",
      }
    }
    if (offer.product.kind === "atlas" && shopStore.hasUnlock("atlas")) {
      return {
        message: "Die Atlaskarte ist bereits im Inventar.",
        state: "owned",
      }
    }
    if (
      offer.product.kind === "collar" &&
      catStore.isCollarUnlocked(offer.product.color)
    ) {
      return {
        message: "Dieses Katzenhalsband ist bereits freigeschaltet.",
        state: "owned",
      }
    }
    if (
      offer.product.kind === "unlock" &&
      shopStore.hasEffectiveUnlock(offer.product.unlock)
    ) {
      const axeTier = axeTierForUnlock(offer.product.unlock)
      return {
        message: axeTier
          ? "Diese oder eine bessere Axtstufe ist bereits freigeschaltet."
          : "Dieser Atlas-Perk ist bereits freigeschaltet.",
        state: "owned",
      }
    }
    if (
      offer.product.kind === "unlock" &&
      !axeTierForUnlock(offer.product.unlock) &&
      !shopStore.hasUnlock("atlas")
    ) {
      return {
        message: "Kaufe zuerst die Atlaskarte.",
        state: "unavailable",
      }
    }
    const resources = resourceStore.state()
    if (!resources) {
      return {
        message: "Aktiviere zuerst @Ressourcen(...), damit der Shop Preise abbuchen kann.",
        state: "unavailable",
      }
    }
    if (
      (offer.price.energy > 0 ||
        (offer.product.kind === "resource" &&
          offer.product.resource === "energy")) &&
      resources.energy === null
    ) {
      return {
        message: "Dieses Angebot benötigt den Energiebestand von @Ressourcen(...).",
        state: "unavailable",
      }
    }
    if (offer.product.kind === "tool") {
      const owned =
        offer.product.tool === "magnifier"
          ? magnifierStore.isCollected()
          : offer.product.tool === "flashlight"
            ? flashlightStore.isCollected()
            : explorationStore.isToolCollected(offer.product.tool)
      if (owned) {
        return {
          message: "Dieses Werkzeug ist bereits im Inventar.",
          state: "owned",
        }
      }
    }
    if (offer.product.kind === "puzzle-piece") {
      if (
        puzzleStore.isPieceCollected(
          offer.product.color,
          offer.product.number,
        )
      ) {
        return {
          message: "Dieses Puzzleteil ist bereits im Inventar.",
          state: "owned",
        }
      }
      if (
        !puzzleStore.canCollectPiece(
          offer.product.color,
          offer.product.number,
        )
      ) {
        return {
          message: "Das Puzzleteil gehört zu keinem gültig konfigurierten Puzzletor.",
          state: "unavailable",
        }
      }
    }
    if (!resourceStore.canAfford(offer.price)) {
      return {
        message: "Für dieses Angebot fehlen Ressourcen.",
        state: "insufficient",
      }
    }
    return { message: "Angebot kaufen.", state: "available" }
  }

  const buyShopOffer = (
    purchaseId: string,
    offer: ShopOffer,
  ): ShopPurchaseResult => {
    const availability = shopAvailability(purchaseId, offer)
    if (availability.state !== "available") {
      return { message: availability.message, ok: false }
    }

    const product = offer.product
    let granted = false
    if (product.kind === "resource") {
      granted = resourceStore.exchange(offer.price, {
        [product.resource]: product.amount,
      })
    } else if (resourceStore.exchange(offer.price)) {
      granted =
        product.kind === "perk"
          ? true
          : product.kind === "collar"
            ? catStore.collectCollar(product.color)
          : product.kind === "atlas" || product.kind === "unlock"
            ? true
          : product.kind === "puzzle-piece"
            ? puzzleStore.collectPiece(product.color, product.number)
            : product.tool === "magnifier"
              ? magnifierStore.collect()
              : product.tool === "flashlight"
                ? flashlightStore.collect()
                : explorationStore.collectTool(product.tool)
    }

    if (!granted) {
      return {
        message: "Der Kauf konnte nicht abgeschlossen werden.",
        ok: false,
      }
    }
    const recorded = shopStore.recordPurchase(
      purchaseId,
      product.kind === "perk"
        ? { kind: "perk", perk: product.perk, percent: product.percent }
        : product.kind === "collar"
          ? { kind: "collar", color: product.color }
        : product.kind === "atlas" || product.kind === "unlock"
          ? { kind: "unlock", unlock: product.unlock }
          : undefined,
    )
    if (!recorded) {
      return { message: "Der Kauf war bereits verbucht.", ok: false }
    }

    const resources = resourceStore.state()
    if (resources) {
      renderResources(resources.gold, resources.diamonds, resources.energy)
    }
    refreshMagnifier()
    refreshFlashlight()
    refreshExploration()
    refreshWoodCrates()
    refreshPuzzles()
    refreshAtlas()
    refreshCatCompanion()
    refreshBonusPickups()
    refreshLootIf()
    refreshShops()
    const message =
      product.kind === "atlas"
        ? "Atlaskarte gekauft und ins Inventar gelegt."
        : product.kind === "collar"
          ? `${catCollarLabel(product.color)} gekauft und der Pixelkatze angelegt.`
        : product.kind === "unlock"
          ? axeTierForUnlock(product.unlock)
            ? `${AXE_TIER_DETAILS[axeTierForUnlock(product.unlock)!].label} gekauft und freigeschaltet.`
            : "Atlas-Perk gekauft und freigeschaltet."
          : product.kind === "perk"
        ? `Perk gekauft: +${product.percent} %.`
        : "Gekauft und sofort ins Inventar übernommen."
    announceResource(message)
    return { message, ok: true }
  }

  installAtlas({
    achievements: () => achievements.progress(),
    courseCountsUnlocked: () => shopStore.hasUnlock("atlas-course-counts"),
    owned: () => shopStore.hasUnlock("atlas"),
    runtime: () => ({
      collectedChestIds: resourceStore.state()?.collectedChests ?? [],
      exploration: explorationStore.state(),
      puzzle: puzzleStore.state(),
      unlockedLockIds: keyInventoryStore.state().unlockedLocks,
    }),
    slideInfoUnlocked: () => shopStore.hasUnlock("atlas-slide-info"),
  })

  installBonusPickups({
    collect: (id, grant) => {
      const recorded = shopStore.recordPurchase("pickup:" + id, grant)
      if (!recorded) return false
      if (grant.kind === "collar" && !catStore.collectCollar(grant.color)) {
        return false
      }
      refreshMagnifier()
      refreshFlashlight()
      refreshExploration()
      refreshWoodCrates()
      refreshAtlas()
      refreshCatCompanion()
      refreshLootIf()
      refreshShops()
      refreshBonusPickups()
      notifyCatItemFound()
      return true
    },
    collected: (id, grant) =>
      shopStore.isPurchased("pickup:" + id) ||
      (grant.kind === "collar" && catStore.isCollarUnlocked(grant.color)) ||
      (grant.kind === "unlock" &&
        shopStore.hasEffectiveUnlock(grant.unlock)),
  })

  installShops({
    availability: shopAvailability,
    buy: buyShopOffer,
    resources: () => resourceStore.state(),
  })

  installTreasureChests({
    active: (reward) => {
      const resources = resourceStore.state()
      return (
        resources !== null &&
        (reward !== "energy" || resources.energy !== null)
      )
    },
    catalogReady: (totals) => {
      achievements.chestCatalogReady(
        totals,
        resourceStore.collectedChestCounts(),
      )
    },
    classify: (chestId, reward) => {
      if (!resourceStore.classifyCollectedChest(chestId, reward)) return
      achievements.chestCollected(resourceStore.collectedChestCounts())
      refreshLootIf()
    },
    collected: (chestId) => resourceStore.isChestCollected(chestId),
    collect: collectTreasureChest,
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
      notifyCatItemFound()
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
    unlock: (lockId, color, target) => {
      const result = keyInventoryStore.useKeyForLock(lockId, color)
      if (result === "unlocked") {
        const inventory = keyInventoryStore.state()
        renderKeyInventory(inventory.keys)
        achievements.lockUnlocked(inventory.unlockedLocks.length)
        lootIfStore.recordOpenedLockTarget(target)
        refreshLootIf()
      }
      return result
    },
  })

  installTimerEventTracking({
    useStart: () => spendResource("energy"),
  })

  installQuizEventTracking({
    active: () => true,
    checkSettled: settleReserveQuizCheck,
    failed: () => store.fail(),
    hint: (count) => store.hint(count),
    includeSection: reserveSlideCountsForCourseProgress,
    solved: (quiz) => {
      rewardReserveQuiz(quiz)
      recordLootIfQuizSolved(quiz)
      notifyCatTaskSolved()
    },
    allSolved: () => achievements.quizzesCompleted(),
    courseCompleted: () => api.finish() !== null,
    useCheck: (quiz) => {
      if (reserveQuizCheckIsFree(quiz)) return true
      deferReserveEntryForQuiz(quiz)
      const allowed = spendResource("energy")
      if (!allowed) settleReserveQuizCheck(quiz)
      return allowed
    },
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
    // Visual compiler markers must disappear before source identity discovery,
    // which can legitimately take several seconds in the LiveEditor.
    injectStyles()
    installCourseMarkdownCapture()
    installInlineRevealRendering()
    await prepareLiaCourseIdentity(discoverCourseIdentity)
    boot()
    if (window.__LIA_LOOT_RUNTIME__ === runtime) runtime.status = "ready"
  } catch (error) {
    if (window.__LIA_LOOT_RUNTIME__ === runtime) runtime.status = "failed"
    console.error("[lia-loot] Initialisierung fehlgeschlagen.", error)
  }
}

const runtime = claimRuntime()
if (runtime) void start(runtime)
