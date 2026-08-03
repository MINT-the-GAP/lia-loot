import assert from "node:assert/strict"
import test from "node:test"

import { AchievementStore } from "../src/achievement-store.ts"
import { AchievementManager } from "../src/achievements.ts"

function storageWindow(search) {
  const values = new Map()
  return {
    __values: values,
    location: {
      origin: "https://example.test",
      pathname: "/course/",
      search,
    },
    sessionStorage: {
      getItem(key) {
        return values.get(key) ?? null
      },
      setItem(key, value) {
        values.set(key, String(value))
      },
      removeItem(key) {
        values.delete(key)
      },
    },
  }
}

function withWindow(search, run) {
  const previous = globalThis.window
  const current = storageWindow(search)
  globalThis.window = current
  try {
    return run(current)
  } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
}

function chests(gold, diamonds, energy) {
  return { gold, diamonds, energy }
}

function exploration(solid, dust, soil, plant) {
  return { solid, dust, soil, plant }
}

test("speichert jeden Erfolg genau einmal und lädt ihn im selben Tab", () => {
  withWindow("?store", () => {
    const first = new AchievementStore()
    assert.equal(first.unlock("secret-slide-found"), true)
    assert.equal(first.unlock("secret-slide-found"), false)

    const restored = new AchievementStore()
    assert.deepEqual(restored.state(), {
      version: 1,
      unlocked: ["secret-slide-found"],
    })
  })
})

test("wertet vor Aktivierung gesammelte Fakten in stabiler Reihenfolge aus", () => {
  withWindow("?all", () => {
    const notifications = []
    const manager = new AchievementManager(
      new AchievementStore(),
      (achievement) => notifications.push(achievement.id),
    )

    manager.quizzesCompleted()
    manager.highscoreFinished(100, 100)
    manager.chestCatalogReady(chests(1, 1, 1), chests(1, 1, 1))
    manager.explorationCatalogReady(
      exploration(1, 1, 1, 1),
      exploration(1, 1, 1, 1),
    )
    manager.lockCatalogReady(1, 1)
    manager.secretSlideFound()
    assert.deepEqual(notifications, [])

    manager.enable()
    assert.deepEqual(notifications, [
      "all-quizzes-solved",
      "perfect-highscore",
      "all-treasure-chests-opened",
      "all-diamond-chests-opened",
      "all-energy-chests-opened",
      "all-invisible-objects-found",
      "all-magic-dust-objects-found",
      "all-soil-dug",
      "all-plants-bloomed",
      "all-locks-opened",
      "secret-slide-found",
    ])
  })
})

test("trennt die drei Truhentypen und schaltet jeden exakt am eigenen Ziel frei", () => {
  withWindow("?chest-types", () => {
    const notifications = []
    const manager = new AchievementManager(
      new AchievementStore(),
      (achievement) => notifications.push(achievement.id),
    )
    manager.enable()
    manager.chestCatalogReady(chests(2, 2, 2), chests(1, 1, 1))

    manager.chestCollected(chests(2, 1, 1))
    assert.deepEqual(notifications, ["all-treasure-chests-opened"])

    manager.chestCollected(chests(20, 2, 1))
    assert.deepEqual(notifications, [
      "all-treasure-chests-opened",
      "all-diamond-chests-opened",
    ])

    manager.chestCollected(chests(20, 20, 2))
    manager.chestCollected(chests(20, 20, 20))
    assert.deepEqual(notifications, [
      "all-treasure-chests-opened",
      "all-diamond-chests-opened",
      "all-energy-chests-opened",
    ])
  })
})

test("trennt Lupenfunde, Erde und Blühfortschritt", () => {
  withWindow("?exploration", () => {
    const notifications = []
    const manager = new AchievementManager(
      new AchievementStore(),
      (achievement) => notifications.push(achievement.id),
    )
    manager.enable()
    manager.explorationCatalogReady(
      exploration(2, 2, 2, 2),
      exploration(1, 1, 1, 1),
    )

    manager.concealmentFound("solid", 2)
    manager.concealmentFound("dust", 2)
    manager.soilDug(2)
    manager.plantBloomed(2)
    assert.deepEqual(notifications, [
      "all-invisible-objects-found",
      "all-magic-dust-objects-found",
      "all-soil-dug",
      "all-plants-bloomed",
    ])
  })
})

test("vergibt keinen Katalogerfolg für einen leeren Katalog", () => {
  withWindow("?empty-catalogs", () => {
    const notifications = []
    const manager = new AchievementManager(
      new AchievementStore(),
      (achievement) => notifications.push(achievement.id),
    )
    manager.enable()

    manager.chestCollected(chests(50, 50, 50))
    manager.chestCatalogReady(chests(0, 0, 0), chests(50, 50, 50))
    manager.concealmentFound("solid", 50)
    manager.concealmentFound("dust", 50)
    manager.soilDug(50)
    manager.plantBloomed(50)
    manager.explorationCatalogReady(
      exploration(0, 0, 0, 0),
      exploration(50, 50, 50, 50),
    )
    manager.lockUnlocked(50)
    manager.lockCatalogReady(0, 50)

    assert.deepEqual(notifications, [])
  })
})

test("migriert den alten Gesamttruhenerfolg nur auf vorhandene Truhentypen", () => {
  withWindow("?legacy-chests", (browser) => {
    const seed = new AchievementStore()
    seed.unlock("perfect-highscore")
    const [storageKey] = browser.__values.keys()
    browser.__values.set(
      storageKey,
      JSON.stringify({
        version: 1,
        unlocked: ["perfect-highscore", "all-chests-opened"],
      }),
    )

    const restored = new AchievementStore()
    assert.deepEqual(restored.state(), {
      version: 1,
      unlocked: ["perfect-highscore"],
      legacyAllChestsOpened: true,
    })

    const notifications = []
    const manager = new AchievementManager(
      restored,
      (achievement) => notifications.push(achievement.id),
    )
    manager.enable()
    assert.deepEqual(notifications, [])

    manager.chestCatalogReady(chests(3, 0, 2), chests(0, 0, 0))
    assert.deepEqual(notifications, [
      "all-treasure-chests-opened",
      "all-energy-chests-opened",
    ])
  })
})

test("vergibt den Highscore-Erfolg nur für die exakte Maximalpunktzahl", () => {
  withWindow("?score", () => {
    const notifications = []
    const manager = new AchievementManager(
      new AchievementStore(),
      (achievement) => notifications.push(achievement.id),
    )
    manager.enable()
    manager.highscoreFinished(99.999, 100)
    manager.highscoreFinished(null, 100)
    assert.deepEqual(notifications, [])

    manager.highscoreFinished(100, 100)
    manager.highscoreFinished(100, 100)
    assert.deepEqual(notifications, ["perfect-highscore"])
  })
})
