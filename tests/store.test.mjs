import assert from "node:assert/strict"
import test from "node:test"

import { ResourceStore } from "../src/resource-store.ts"
import { createConfig } from "../src/score.ts"
import { HighscoreStore } from "../src/store.ts"

function browserSession(run) {
  const previousWindow = globalThis.window
  const values = new Map()
  globalThis.window = {
    location: { origin: "https://example.test", pathname: "/course", search: "?bonus" },
    sessionStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  }
  try {
    run()
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
}

test("wertet Restressourcen live und friert sie beim Abschluss genau einmal ein", () => {
  browserSession(() => {
    const resources = new ResourceStore()
    const store = new HighscoreStore(() => resources.scoreBonus())
    const config = createConfig(100, 10, 5, 1, 6)
    assert.equal(store.score(0), null)
    assert.equal(store.finish(0), null)
    store.configure(config, 0)
    assert.equal(store.score(0), 100)
    resources.configure(3, 2, 5)
    assert.equal(store.score(0), 900)
    resources.spend("gold")
    store.hint()
    resources.spend("diamonds")
    resources.spend("energy")
    store.fail()
    assert.equal(store.score(61_000), 534.9)
    resources.collectChest("gold", "gold", 2)
    assert.equal(store.score(61_000), 734.9)
    assert.equal(store.finish(61_000), 734.9)
    assert.equal(store.state().finalScore, 734.9)

    resources.collectChest("late-diamond", "diamonds")
    resources.configure(3, 2, 5, 0, 0)
    store.fail()
    store.hint()
    assert.equal(store.score(600_000), 734.9)
    assert.equal(store.finish(600_000), 734.9)
    assert.equal(store.state().finishedAt, 61_000)

    const restored = new HighscoreStore(() => resources.scoreBonus())
    restored.configure(config, 600_000)
    assert.equal(restored.score(600_000), 734.9)
    assert.equal(restored.finish(600_000), 734.9)
    restored.reset(600_000)
    assert.equal(restored.state().finalScore, null)
    assert.equal(restored.score(600_000), 100)
  })
})

test("addiert den Ressourcenbonus nach der Nullgrenze der Basiswertung", () => {
  browserSession(() => {
    const resources = new ResourceStore()
    const store = new HighscoreStore(() => resources.scoreBonus())
    store.configure(createConfig(100, 100, 0, 0, 0), 0)
    resources.configure(1, 1, undefined, 80, 400)
    store.fail(3)
    assert.equal(store.score(0), 480)
    assert.equal(store.finish(0), 480)
  })
})

test("bewahrt die bisherige Wertung ohne Ressourcen", () => {
  browserSession(() => {
    const store = new HighscoreStore()
    store.configure(createConfig(100, 10, 5, 0, 0), 0)
    store.fail()
    store.hint()
    assert.equal(store.score(0), 85)
    assert.equal(store.finish(0), 85)
  })
})
