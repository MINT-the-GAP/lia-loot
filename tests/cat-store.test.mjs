import assert from "node:assert/strict"
import test from "node:test"

import {
  extractCatVariantOptions,
} from "../src/cat-catalog.ts"
import { CatCompanionStore } from "../src/cat-store.ts"

function browserSession(search = "?cats=1", data = new Map()) {
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/cat-course",
      search,
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, String(value)),
    },
  }
  return data
}

test("schaltet Katzenfarben frei und merkt sich die aktive Katze", () => {
  browserSession()
  const store = new CatCompanionStore()

  assert.deepEqual(store.state(), {
    version: 3,
    unlocked: [],
    selected: null,
    unlockedCollars: [],
    selectedCollar: null,
  })
  assert.equal(store.collect("orange"), true)
  assert.equal(store.collect("orange"), false)
  assert.equal(store.collect("grey"), true)
  assert.equal(store.selectedVariant(), "grey")
  assert.deepEqual(store.unlockedVariants(), ["orange", "grey"])

  assert.equal(store.select("black"), false)
  assert.equal(store.select("orange"), true)
  assert.equal(new CatCompanionStore().selectedVariant(), "orange")
})

test("migriert eine früher gefundene Einzelkatze zur orangefarbenen Variante", () => {
  const data = browserSession("?legacy-cat")
  new CatCompanionStore().collect("orange")
  const [storageKey] = data.keys()
  data.set(storageKey, JSON.stringify({ version: 1, collected: true }))

  assert.deepEqual(new CatCompanionStore().state(), {
    version: 3,
    unlocked: ["orange"],
    selected: "orange",
    unlockedCollars: [],
    selectedCollar: null,
  })
})

test("schaltet Katzenhalsbänder frei, wählt sie und merkt sich die Auswahl", () => {
  browserSession("?cat-collars")
  const store = new CatCompanionStore()

  assert.equal(store.collectCollar("red"), true)
  assert.equal(store.collectCollar("red"), false)
  assert.equal(store.collectCollar("blue"), true)
  assert.deepEqual(store.unlockedCollars(), ["red", "blue"])
  assert.equal(store.selectedCollar(), "blue")
  assert.equal(store.selectCollar("green"), false)
  assert.equal(store.selectCollar("red"), true)
  assert.equal(new CatCompanionStore().selectedCollar(), "red")
  assert.equal(store.selectCollar(null), true)
  assert.equal(new CatCompanionStore().selectedCollar(), null)
})

test("migriert Katzenzustand ohne Halsbänder auf die aktuelle Version", () => {
  const data = browserSession("?legacy-cat-v2")
  new CatCompanionStore().collect("orange")
  const [storageKey] = data.keys()
  data.set(storageKey, JSON.stringify({
    version: 2,
    unlocked: ["orange"],
    selected: "orange",
  }))

  assert.deepEqual(new CatCompanionStore().state(), {
    version: 3,
    unlocked: ["orange"],
    selected: "orange",
    unlockedCollars: [],
    selectedCollar: null,
  })
})

test("liest deutsche Farbnamen und lässt andere Katzenoptionen übrig", () => {
  assert.deepEqual(extractCatVariantOptions(["grau", "12s"]), {
    errors: [],
    values: ["12s"],
    variant: "grey",
  })
  assert.deepEqual(extractCatVariantOptions(["farbe=weiß"]), {
    errors: [],
    values: [],
    variant: "white",
  })
  assert.equal(
    extractCatVariantOptions(["schwarz", "dreifarbig"]).errors.length,
    1,
  )
})
