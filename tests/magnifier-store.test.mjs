import assert from "node:assert/strict"
import test from "node:test"

import { MagnifierStore } from "../src/magnifier-store.ts"

function browserSession(search = "?magnifier=1", data = new Map()) {
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/magnifier-course",
      search,
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, String(value)),
    },
  }
  return data
}

test("startet ohne Lupe und sammelt das einmalige Werkzeug genau einmal", () => {
  browserSession()
  const store = new MagnifierStore()

  assert.deepEqual(store.state(), { version: 1, collected: false })
  assert.equal(store.collect(), true)
  assert.equal(store.collect(), false)
  assert.equal(store.isCollected(), true)
  assert.deepEqual(store.state(), { version: 1, collected: true })
})

test("merkt sich eine gefundene Lupe beim Neuladen im selben Tab", () => {
  browserSession()
  const first = new MagnifierStore()
  first.collect()

  const restored = new MagnifierStore()
  assert.equal(restored.isCollected(), true)
})

test("trennt den Lupenfund zwischen unterschiedlichen Kurs-URLs", () => {
  const data = browserSession("?course=one")
  new MagnifierStore().collect()

  browserSession("?course=two", data)
  assert.equal(new MagnifierStore().isCollected(), false)
})

test("verwirft einen beschädigten Lupenstatus", () => {
  const data = browserSession()
  const first = new MagnifierStore()
  first.collect()
  const [storageKey] = data.keys()

  data.set(storageKey, JSON.stringify({ version: 1, collected: "yes" }))
  assert.deepEqual(new MagnifierStore().state(), {
    version: 1,
    collected: false,
  })
})
