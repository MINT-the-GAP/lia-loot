import assert from "node:assert/strict"
import test from "node:test"

import { CatFoodStore } from "../src/cat-food-store.ts"
import { parseCourseCatFoodDeclarations } from "../src/course-chests.ts"

function browserSession(search = "?cat-food=1", data = new Map()) {
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/cat-food-course",
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

test("sammelt und verfüttert jede Portion genau einmal", () => {
  browserSession()
  const store = new CatFoodStore()

  assert.deepEqual(store.state(), { version: 1, collected: [], fed: [] })
  assert.equal(store.collect("cat-food:one"), true)
  assert.equal(store.collect("cat-food:one"), false)
  assert.equal(store.collect("cat-food:two"), true)
  assert.deepEqual(store.availableIds(), ["cat-food:one", "cat-food:two"])
  assert.equal(store.feed("cat-food:missing"), false)
  assert.equal(store.feed("cat-food:one"), true)
  assert.equal(store.feed("cat-food:one"), false)
  assert.deepEqual(store.availableIds(), ["cat-food:two"])
  assert.deepEqual(new CatFoodStore().state(), {
    version: 1,
    collected: ["cat-food:one", "cat-food:two"],
    fed: ["cat-food:one"],
  })
})

test("trennt Katzenfutter zwischen Kursen", () => {
  const data = browserSession("?course=one")
  const first = new CatFoodStore()
  first.collect("cat-food:one")
  first.feed("cat-food:one")

  browserSession("?course=two", data)
  assert.deepEqual(new CatFoodStore().state(), {
    version: 1,
    collected: [],
    fed: [],
  })
})

test("verwirft doppelte und widersprüchliche Futterzustände", () => {
  for (const state of [
    { version: 1, collected: ["one", "one"], fed: [] },
    { version: 1, collected: ["one"], fed: ["two"] },
    { version: 1, collected: ["one"], fed: ["one", "one"] },
  ]) {
    const data = browserSession("?corrupt=" + JSON.stringify(state))
    new CatFoodStore().collect("seed")
    const [storageKey] = data.keys()
    data.set(storageKey, JSON.stringify(state))
    assert.deepEqual(new CatFoodStore().state(), {
      version: 1,
      collected: [],
      fed: [],
    })
  }
})

test("liest direkte und geschützte Futter-Inhalte nur aus sichtbarem Kursquelltext", () => {
  const markdown = `
# Katzenfutter

@Futter(@Katze)
@Futter(\`@Schluessel(blau)\`)

\`@Futter(@Schatztruhe)\`

\`\`\`markdown
@Futter(@Lupe)
\`\`\`
`

  assert.deepEqual(parseCourseCatFoodDeclarations(markdown), [
    { content: "@Katze", section: 0, sourceOrder: 0 },
    { content: "@Schluessel(blau)", section: 0, sourceOrder: 1 },
  ])
})
