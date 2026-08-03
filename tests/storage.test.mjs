import assert from "node:assert/strict"
import test from "node:test"

import { ResourceStore } from "../src/resource-store.ts"

function withBrowserSession(search, run) {
  const previous = globalThis.window
  const values = new Map()
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/course/",
      search,
    },
    sessionStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  }
  try {
    return run(values)
  } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
}

test("persistiert Truhenfortschritt getrennt nach Belohnungstyp", () => {
  withBrowserSession("?typed-chests", () => {
    const first = new ResourceStore()
    first.configure(0, 0, 0)
    first.collectChest("gold-1", "gold")
    first.collectChest("gold-2", "gold")
    first.collectChest("diamonds-1", "diamonds")
    first.collectChest("energy-1", "energy")

    assert.deepEqual(first.collectedChestCounts(), {
      gold: 2,
      diamonds: 1,
      energy: 1,
    })

    const restored = new ResourceStore()
    assert.deepEqual(restored.collectedChestCounts(), {
      gold: 2,
      diamonds: 1,
      energy: 1,
    })
    assert.equal(restored.configure(0, 0, 0).collectedChests.length, 4)
  })
})

test("klassifiziert alte untypisierte Truhen-IDs schrittweise und eindeutig", () => {
  withBrowserSession("?classify-legacy", (values) => {
    const first = new ResourceStore()
    first.configure(0, 0)
    first.collectChest("legacy-diamond", "diamonds")

    const chestRewardKey = [...values.keys()].find((key) =>
      key.includes("chest-rewards"),
    )
    assert.ok(chestRewardKey)
    values.delete(chestRewardKey)

    const restored = new ResourceStore()
    assert.deepEqual(restored.collectedChestCounts(), {
      gold: 0,
      diamonds: 0,
      energy: 0,
    })
    assert.equal(
      restored.classifyCollectedChest("legacy-diamond", "diamonds"),
      true,
    )
    assert.equal(
      restored.classifyCollectedChest("legacy-diamond", "diamonds"),
      false,
    )
    assert.equal(
      restored.classifyCollectedChest("legacy-diamond", "gold"),
      false,
    )
    assert.equal(
      restored.classifyCollectedChest("unknown", "gold"),
      false,
    )
    assert.deepEqual(restored.collectedChestCounts(), {
      gold: 0,
      diamonds: 1,
      energy: 0,
    })

    const reloaded = new ResourceStore()
    assert.deepEqual(reloaded.collectedChestCounts(), {
      gold: 0,
      diamonds: 1,
      energy: 0,
    })
  })
})

test("setzt typisierten Truhenfortschritt mit geänderter Ressourcenkonfiguration zurück", () => {
  withBrowserSession("?reset-chest-types", () => {
    const store = new ResourceStore()
    store.configure(0, 0, 0)
    store.collectChest("energy-1", "energy")
    assert.equal(store.collectedChestCounts().energy, 1)

    store.configure(1, 2)
    assert.deepEqual(store.collectedChestCounts(), {
      gold: 0,
      diamonds: 0,
      energy: 0,
    })
  })
})

test("verwirft beschädigte Typzuordnungen ohne den Ressourcenstand zu verlieren", () => {
  withBrowserSession("?corrupt-chest-types", (values) => {
    const first = new ResourceStore()
    first.configure(2, 1)
    first.collectChest("gold-1", "gold")

    const chestRewardKey = [...values.keys()].find((key) =>
      key.includes("chest-rewards"),
    )
    assert.ok(chestRewardKey)
    values.set(
      chestRewardKey,
      JSON.stringify({
        version: 1,
        collected: {
          gold: ["same-id"],
          diamonds: ["same-id"],
          energy: [],
        },
      }),
    )

    const restored = new ResourceStore()
    assert.deepEqual(restored.collectedChestCounts(), {
      gold: 0,
      diamonds: 0,
      energy: 0,
    })
    const state = restored.configure(2, 1)
    assert.equal(state.gold, 3)
    assert.deepEqual(state.collectedChests, ["gold-1"])
  })
})
