import assert from "node:assert/strict"
import test from "node:test"

import { ResourceStore } from "../src/resource-store.ts"

function browserSession() {
  const data = new Map()
  globalThis.window = {
    location: { origin: "https://example.test", pathname: "/course", search: "?demo=1" },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, value),
    },
  }
  return data
}

test("verbraucht Gold für Hinweise und Diamanten zum Auflösen", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(2, 1)

  assert.equal(store.spend("gold"), true)
  assert.equal(store.spend("diamonds"), true)
  assert.deepEqual(store.state(), {
    version: 1,
    initialGold: 2,
    initialDiamonds: 1,
    initialEnergy: null,
    gold: 1,
    diamonds: 0,
    energy: null,
    collectedChests: [],
  })
  assert.equal(store.spend("diamonds"), false)
  assert.equal(store.spend("energy"), true)
})

test("begrenzt Prüfen nur bei konfigurierter Energie", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(2, 1, 2)

  assert.equal(store.spend("energy"), true)
  assert.equal(store.state()?.energy, 1)
  assert.equal(store.spend("energy"), true)
  assert.equal(store.state()?.energy, 0)
  assert.equal(store.spend("energy"), false)
  assert.equal(store.state()?.gold, 2)
  assert.equal(store.state()?.diamonds, 1)
})

test("behält den Verbrauch bei erneuter Konfiguration mit gleichen Startwerten", () => {
  browserSession()
  const first = new ResourceStore()
  first.configure(3, 2)
  first.spend("gold")

  const restored = new ResourceStore()
  assert.equal(restored.configure(3, 2).gold, 2)
})

test("setzt den Bestand nur bei geänderten Startwerten neu", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(3, 2)
  store.spend("gold")

  assert.deepEqual(store.configure(5, 4, 3), {
    version: 1,
    initialGold: 5,
    initialDiamonds: 4,
    initialEnergy: 3,
    gold: 5,
    diamonds: 4,
    energy: 3,
    collectedChests: [],
  })
})

test("lässt native Buttons ohne Ressourcen-Konfiguration unverändert", () => {
  browserSession()
  const store = new ResourceStore()

  assert.equal(store.spend("gold"), true)
  assert.equal(store.spend("diamonds"), true)
  assert.equal(store.spend("energy"), true)
  assert.equal(store.state(), null)
})

test("aktiviert einen gespeicherten Bestand erst durch die Makro-Konfiguration", () => {
  browserSession()
  const previousPageLoad = new ResourceStore()
  previousPageLoad.configure(2, 1)
  previousPageLoad.spend("gold")

  const currentPageLoad = new ResourceStore()
  assert.equal(currentPageLoad.spend("gold"), true)
  assert.equal(currentPageLoad.state(), null)
  assert.equal(currentPageLoad.configure(2, 1).gold, 1)
})

test("vergibt die Goldmünze jeder Schatztruhe nur einmal", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(2, 1)

  assert.equal(store.collectChest("seite-1:inline"), true)
  assert.equal(store.state()?.gold, 3)
  assert.deepEqual(store.state()?.collectedChests, ["seite-1:inline"])
  assert.equal(store.collectChest("seite-1:inline"), false)
  assert.equal(store.state()?.gold, 3)

  assert.equal(store.collectChest("seite-1:toc"), true)
  assert.equal(store.state()?.gold, 4)
  assert.equal(store.isChestCollected("seite-1:toc"), true)

  assert.equal(store.collectChest("seite-1:translator"), true)
  assert.equal(store.collectChest("seite-1:mode"), true)
  assert.equal(store.state()?.gold, 6)
  assert.deepEqual(store.state()?.collectedChests, [
    "seite-1:inline",
    "seite-1:toc",
    "seite-1:translator",
    "seite-1:mode",
  ])
})

test("vergibt für eine Diamanttruhe genau einen Diamanten", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(2, 1)

  assert.equal(
    store.collectChest("seite-2:diamant:inline", "diamonds"),
    true,
  )
  assert.equal(store.state()?.gold, 2)
  assert.equal(store.state()?.diamonds, 2)
  assert.equal(
    store.collectChest("seite-2:diamant:inline", "diamonds"),
    false,
  )
  assert.equal(store.state()?.diamonds, 2)
  assert.equal(store.isChestCollected("seite-2:diamant:inline"), true)
})

test("vergibt Energie nur bei aktiviertem Energielimit", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(1, 1)

  assert.equal(store.collectChest("seite-3:energie:inline", "energy"), false)
  assert.equal(store.isChestCollected("seite-3:energie:inline"), false)

  store.configure(1, 1, 0)
  assert.equal(store.collectChest("seite-3:energie:inline", "energy"), true)
  assert.equal(store.state()?.energy, 1)
  assert.equal(store.collectChest("seite-3:energie:inline", "energy"), false)
  assert.equal(store.state()?.energy, 1)
})

test("vergibt konfigurierte Mengen für Gold, Diamanten und Energie genau einmal", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(0, 0, 0)

  assert.equal(store.collectChest("menge:gold", "gold", 3), true)
  assert.equal(store.collectChest("menge:diamanten", "diamonds", 4), true)
  assert.equal(store.collectChest("menge:energie", "energy", 5), true)
  assert.deepEqual(
    {
      gold: store.state()?.gold,
      diamonds: store.state()?.diamonds,
      energy: store.state()?.energy,
    },
    { gold: 3, diamonds: 4, energy: 5 },
  )

  assert.equal(store.collectChest("menge:gold", "gold", 9), false)
  assert.equal(store.state()?.gold, 3)

  const restored = new ResourceStore()
  const state = restored.configure(0, 0, 0)
  assert.equal(state.gold, 3)
  assert.equal(state.diamonds, 4)
  assert.equal(state.energy, 5)
})

test("sammelt Kisten mit ungültiger oder überlaufender Menge nicht ein", () => {
  browserSession()
  const store = new ResourceStore()
  store.configure(Number.MAX_SAFE_INTEGER, 0, 0)

  for (const [index, amount] of [0, -1, 1.5, Number.NaN].entries()) {
    assert.equal(store.collectChest("ungültig:" + index, "gold", amount), false)
  }
  assert.equal(store.collectChest("überlauf", "gold", 1), false)
  assert.deepEqual(store.state()?.collectedChests, [])
})

test("merkt sich eine eingesammelte Schatztruhe beim Neuladen", () => {
  browserSession()
  const first = new ResourceStore()
  first.configure(1, 0)
  first.collectChest("kurs:menu")

  const restored = new ResourceStore()
  assert.equal(restored.isChestCollected("kurs:menu"), true)
  const state = restored.configure(1, 0)
  assert.equal(state.gold, 2)
  assert.deepEqual(state.collectedChests, ["kurs:menu"])
})

test("merkt sich Diamantbelohnung und Diamanttruhe beim Neuladen", () => {
  browserSession()
  const first = new ResourceStore()
  first.configure(0, 1)
  first.collectChest("kurs:diamant:translator", "diamonds")

  const restored = new ResourceStore()
  assert.equal(restored.isChestCollected("kurs:diamant:translator"), true)
  const state = restored.configure(0, 1)
  assert.equal(state.gold, 0)
  assert.equal(state.diamonds, 2)
  assert.deepEqual(state.collectedChests, ["kurs:diamant:translator"])
})

test("merkt sich Energieverbrauch und Energiekiste beim Neuladen", () => {
  browserSession()
  const first = new ResourceStore()
  first.configure(0, 0, 1)
  first.spend("energy")
  first.collectChest("kurs:energie:mode", "energy")

  const restored = new ResourceStore()
  assert.equal(restored.isChestCollected("kurs:energie:mode"), true)
  const state = restored.configure(0, 0, 1)
  assert.equal(state.energy, 1)
  assert.deepEqual(state.collectedChests, ["kurs:energie:mode"])
})

test("migriert den Zustand der früheren einzelnen Schatztruhe", () => {
  const data = browserSession()
  const first = new ResourceStore()
  first.configure(1, 0)
  const [storageKey] = data.keys()

  data.set(
    storageKey,
    JSON.stringify({
      version: 1,
      initialGold: 1,
      initialDiamonds: 0,
      gold: 2,
      diamonds: 0,
      chestCollected: true,
    }),
  )

  const restored = new ResourceStore()
  const state = restored.configure(1, 0)
  assert.equal(state.initialEnergy, null)
  assert.equal(state.energy, null)
  assert.deepEqual(state.collectedChests, ["legacy:auto"])
})
