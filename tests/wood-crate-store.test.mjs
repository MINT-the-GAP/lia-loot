import assert from "node:assert/strict"
import test from "node:test"

import { parseCourseWoodCrateDeclarations } from "../src/course-chests.ts"
import {
  WOOD_CRATE_DURABILITY,
  WoodCrateStore,
} from "../src/wood-crate-store.ts"

function browserSession(search = "?wood-crates=1", data = new Map()) {
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/wood-crate-course",
      search,
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, String(value)),
      removeItem: (key) => data.delete(key),
    },
  }
  return data
}

test("speichert jeden Steinaxt-Hieb bis zur zerstörten Kiste", () => {
  browserSession()
  const store = new WoodCrateStore()

  assert.deepEqual(store.state(), {
    version: 2,
    broken: [],
    damage: {},
  })
  for (let hit = 1; hit < WOOD_CRATE_DURABILITY; hit += 1) {
    assert.deepEqual(store.strike("wood-crate:one", 1), {
      accepted: true,
      broken: false,
      damage: hit,
    })
    assert.equal(store.damage("wood-crate:one"), hit)
  }
  assert.deepEqual(store.strike("wood-crate:one", 1), {
    accepted: true,
    broken: true,
    damage: 8,
  })
  assert.equal(store.isBroken("wood-crate:one"), true)
  assert.equal(store.damage("wood-crate:one"), 0)
  assert.equal(store.strike("wood-crate:one", 8).accepted, false)
})

test("bildet Stein-, Eisen-, Gold- und Diamantaxt auf 8, 4, 2 und 1 Hieb ab", () => {
  for (const [index, power, hits] of [
    [0, 1, 8],
    [1, 2, 4],
    [2, 4, 2],
    [3, 8, 1],
  ]) {
    browserSession("?power=" + index)
    const store = new WoodCrateStore()
    const id = "wood-crate:" + index
    for (let hit = 1; hit <= hits; hit += 1) {
      const result = store.strike(id, power)
      assert.equal(result.accepted, true)
      assert.equal(result.broken, hit === hits)
    }
  }
})

test("persistiert Teilschäden und trennt sie zwischen Kursen", () => {
  const data = browserSession("?course=one")
  const first = new WoodCrateStore()
  first.strike("wood-crate:one", 1)
  first.strike("wood-crate:one", 1)

  assert.equal(new WoodCrateStore().damage("wood-crate:one"), 2)
  browserSession("?course=two", data)
  assert.deepEqual(new WoodCrateStore().state(), {
    version: 2,
    broken: [],
    damage: {},
  })
})

test("übernimmt bereits zerstörte Kisten aus dem alten v1-Zustand", () => {
  const data = browserSession("?migration")
  new WoodCrateStore().strike("seed", 1)
  const [storageKey] = data.keys()
  data.set(
    storageKey,
    JSON.stringify({ version: 1, broken: ["wood-crate:old"] }),
  )

  assert.deepEqual(new WoodCrateStore().state(), {
    version: 2,
    broken: ["wood-crate:old"],
    damage: {},
  })
})

test("verwirft beschädigte oder widersprüchliche Kistenzustände", () => {
  for (const state of [
    {
      version: 2,
      broken: ["wood-crate:one"],
      damage: { "wood-crate:one": 2 },
    },
    { version: 2, broken: [], damage: { "wood-crate:one": 8 } },
    {
      version: 2,
      broken: ["wood-crate:one", "wood-crate:one"],
      damage: {},
    },
  ]) {
    const data = browserSession("?corrupt=" + JSON.stringify(state))
    new WoodCrateStore().strike("seed", 1)
    const [storageKey] = data.keys()
    data.set(storageKey, JSON.stringify(state))
    assert.deepEqual(new WoodCrateStore().state(), {
      version: 2,
      broken: [],
      damage: {},
    })
  }
})

test("liest direkte und geschützte verschachtelte Kisten-Inhalte", () => {
  const markdown = `
# Holzkisten

@Kiste(@Katze)
@Kiste(\`@Schluessel(blau)\`)

\`@Kiste(@Schatztruhe)\`

\`\`\`markdown
@Kiste(@Lupe)
\`\`\`
`

  assert.deepEqual(parseCourseWoodCrateDeclarations(markdown), [
    { content: "@Katze", section: 0, sourceOrder: 0 },
    { content: "@Schluessel(blau)", section: 0, sourceOrder: 1 },
  ])
})
