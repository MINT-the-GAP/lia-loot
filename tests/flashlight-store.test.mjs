import assert from "node:assert/strict"
import test from "node:test"

import { FlashlightStore } from "../src/flashlight-store.ts"

function browserSession(search = "?flashlight=1", data = new Map()) {
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/flashlight-course",
      search,
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      removeItem: (key) => data.delete(key),
      setItem: (key, value) => data.set(key, String(value)),
    },
  }
  return data
}

test("sammelt die Taschenlampe genau einmal", () => {
  browserSession()
  const store = new FlashlightStore()

  assert.deepEqual(store.state(), { version: 1, collected: false })
  assert.equal(store.collect(), true)
  assert.equal(store.collect(), false)
  assert.equal(store.isCollected(), true)
})

test("persistiert die Taschenlampe kursbezogen im selben Tab", () => {
  const data = browserSession("?course=one")
  new FlashlightStore().collect()
  assert.equal(new FlashlightStore().isCollected(), true)

  browserSession("?course=two", data)
  assert.equal(new FlashlightStore().isCollected(), false)
})

test("verwirft einen beschädigten Taschenlampenstatus", () => {
  const data = browserSession()
  new FlashlightStore().collect()
  const [storageKey] = data.keys()
  data.set(storageKey, JSON.stringify({ version: 1, collected: "yes" }))

  assert.deepEqual(new FlashlightStore().state(), {
    version: 1,
    collected: false,
  })
})
