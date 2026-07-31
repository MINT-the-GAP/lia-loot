import assert from "node:assert/strict"
import test from "node:test"

import { AchievementStore } from "../src/achievement-store.ts"
import { AchievementManager } from "../src/achievements.ts"

function storageWindow(search) {
  const values = new Map()
  return {
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
  globalThis.window = storageWindow(search)
  try {
    return run()
  } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
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
    manager.chestCatalogReady(2, 2)
    manager.lockCatalogReady(1, 1)
    manager.secretSlideFound()
    assert.deepEqual(notifications, [])

    manager.enable()
    assert.deepEqual(notifications, [
      "all-quizzes-solved",
      "perfect-highscore",
      "all-chests-opened",
      "all-locks-opened",
      "secret-slide-found",
    ])
  })
})

test("schaltet Gesamtfortschritte erst mit fertigem, nichtleerem Katalog frei", () => {
  withWindow("?catalog", () => {
    const notifications = []
    const manager = new AchievementManager(
      new AchievementStore(),
      (achievement) => notifications.push(achievement.id),
    )
    manager.enable()

    manager.chestCollected(4)
    manager.chestCatalogReady(0, 4)
    manager.lockUnlocked(3)
    manager.lockCatalogReady(0, 3)
    assert.deepEqual(notifications, [])

    manager.chestCatalogReady(2, 1)
    manager.lockCatalogReady(2, 1)
    assert.deepEqual(notifications, [])

    manager.chestCollected(2)
    manager.lockUnlocked(2)
    assert.deepEqual(notifications, [
      "all-chests-opened",
      "all-locks-opened",
    ])
  })
})

test("vergibt README-Gesamterfolge nicht nach dem ersten internen Liveobjekt", () => {
  withWindow("?readme-catalog", () => {
    const notifications = []
    const manager = new AchievementManager(
      new AchievementStore(),
      (achievement) => notifications.push(achievement.id),
    )
    manager.enable()
    manager.chestCatalogReady(30, 0)
    manager.lockCatalogReady(13, 0)

    manager.chestCollected(1)
    manager.lockUnlocked(1)
    assert.deepEqual(notifications, [])

    manager.chestCollected(29)
    manager.lockUnlocked(12)
    assert.deepEqual(notifications, [])

    manager.chestCollected(30)
    manager.lockUnlocked(13)
    assert.deepEqual(notifications, [
      "all-chests-opened",
      "all-locks-opened",
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
