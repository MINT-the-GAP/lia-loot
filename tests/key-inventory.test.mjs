import assert from "node:assert/strict"
import test from "node:test"

import {
  isKeyColorRequest,
  deterministicKeyColor,
  KEY_COLORS,
  requestedKeyColor,
  resolveKeyAppearance,
} from "../src/key-colors.ts"
import { KeyInventoryStore } from "../src/inventory-store.ts"
import { ResourceStore } from "../src/resource-store.ts"
import { setLiaCourseVersion } from "../src/course-identity.ts"

function browserSession() {
  setLiaCourseVersion("0.0.1")
  const data = new Map()
  globalThis.window = {
    LIA: { defaultCourseURL: "https://example.test/key-course.md" },
    location: {
      href: "https://viewer.example/?demo=1#1",
      origin: "https://example.test",
      pathname: "/key-course",
      search: "?demo=1",
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      removeItem: (key) => data.delete(key),
      setItem: (key, value) => data.set(key, value),
    },
  }
  return data
}

test("startet mit einem leeren Schlüssel-Inventar", () => {
  browserSession()
  assert.deepEqual(new KeyInventoryStore().state(), {
    version: 1,
    keys: {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      purple: 0,
      orange: 0,
      magenta: 0,
      white: 0,
      black: 0,
      turquoise: 0,
      gray: 0,
      brown: 0,
    },
    collectedKeys: [],
    unlockedLocks: [],
  })
})

test("sammelt jeden Schlüssel genau einmal und zählt Farben getrennt", () => {
  browserSession()
  const store = new KeyInventoryStore()

  assert.equal(store.collectKey("seite-1:rot", "red"), true)
  assert.equal(store.collectKey("seite-1:rot", "red"), false)
  assert.equal(store.collectKey("seite-2:rot", "red"), true)
  assert.equal(store.collectKey("seite-2:blau", "blue"), true)

  const state = store.state()
  assert.equal(state.keys.red, 2)
  assert.equal(state.keys.blue, 1)
  assert.equal(state.keys.green, 0)
  assert.deepEqual(state.collectedKeys, [
    "seite-1:rot",
    "seite-2:rot",
    "seite-2:blau",
  ])
})

test("merkt sich Schlüssel und Inventar beim Neuladen", () => {
  browserSession()
  const first = new KeyInventoryStore()
  first.collectKey("kurs:gelb", "yellow")
  first.collectKey("kurs:lila", "purple")

  const restored = new KeyInventoryStore()
  assert.equal(restored.isKeyCollected("kurs:gelb"), true)
  assert.equal(restored.state().keys.yellow, 1)
  assert.equal(restored.state().keys.purple, 1)
})

test("verbraucht genau einen passenden Schlüssel für ein Schloss", () => {
  browserSession()
  const store = new KeyInventoryStore()
  store.collectKey("kurs:gruen-1", "green")
  store.collectKey("kurs:gruen-2", "green")
  store.collectKey("kurs:rot", "red")

  assert.equal(store.useKeyForLock("schloss:info", "green"), "unlocked")
  assert.equal(store.state().keys.green, 1)
  assert.equal(store.state().keys.red, 1)
  assert.deepEqual(store.state().unlockedLocks, ["schloss:info"])
  assert.equal(store.isLockUnlocked("schloss:info"), true)
})

test("verbraucht für dasselbe Schloss nie einen zweiten Schlüssel", () => {
  browserSession()
  const store = new KeyInventoryStore()
  store.collectKey("kurs:gruen-1", "green")
  store.collectKey("kurs:gruen-2", "green")

  assert.equal(store.useKeyForLock("schloss:info", "green"), "unlocked")
  assert.equal(
    store.useKeyForLock("schloss:info", "green"),
    "already-unlocked",
  )
  assert.equal(store.state().keys.green, 1)
})

test("lässt ein Schloss ohne passenden Schlüssel geschlossen", () => {
  browserSession()
  const store = new KeyInventoryStore()
  store.collectKey("kurs:rot", "red")

  assert.equal(store.useKeyForLock("schloss:info", "green"), "missing-key")
  assert.equal(store.useKeyForLock("  ", "red"), "invalid-lock-id")
  assert.equal(store.state().keys.red, 1)
  assert.deepEqual(store.state().unlockedLocks, [])
})

test("merkt sich verbrauchte Schlüssel und entsperrte Schlösser", () => {
  browserSession()
  const first = new KeyInventoryStore()
  first.collectKey("kurs:gruen", "green")
  assert.equal(first.useKeyForLock("schloss:info", "green"), "unlocked")

  const restored = new KeyInventoryStore()
  assert.equal(restored.state().keys.green, 0)
  assert.equal(restored.isKeyCollected("kurs:gruen"), true)
  assert.equal(restored.isLockUnlocked("schloss:info"), true)
})

test("migriert alte Inventare ohne Schlossliste verlustfrei", () => {
  const data = browserSession()
  const first = new KeyInventoryStore()
  first.collectKey("kurs:gruen", "green")
  const [storageKey] = data.keys()
  const legacy = JSON.parse(data.get(storageKey))
  delete legacy.unlockedLocks
  data.set(storageKey, JSON.stringify(legacy))

  const restored = new KeyInventoryStore()
  assert.equal(restored.state().keys.green, 1)
  assert.deepEqual(restored.state().unlockedLocks, [])
})

test("verwaltet alle zwölf Farben unabhängig", () => {
  browserSession()
  const store = new KeyInventoryStore()
  KEY_COLORS.forEach((color, index) => {
    assert.equal(store.collectKey(`farbe-${index}`, color), true)
  })

  for (const color of KEY_COLORS) {
    assert.equal(store.state().keys[color], 1)
  }
})

test("bleibt von Ressourcen und gleichlautenden Truhen-IDs unabhängig", () => {
  browserSession()
  const inventory = new KeyInventoryStore()
  const resources = new ResourceStore()
  resources.configure(0, 0)

  assert.equal(inventory.collectKey("gemeinsame-id", "green"), true)
  assert.equal(resources.collectChest("gemeinsame-id", "gold"), true)
  assert.equal(inventory.state().keys.green, 1)
  assert.equal(resources.state()?.gold, 1)
})

test("verwirft einen beschädigten Inventarzustand", () => {
  const data = browserSession()
  const first = new KeyInventoryStore()
  first.collectKey("kurs:rot", "red")
  const [storageKey] = data.keys()

  data.set(
    storageKey,
    JSON.stringify({
      version: 1,
      keys: { red: -1 },
      collectedKeys: ["kurs:rot"],
    }),
  )

  const restored = new KeyInventoryStore()
  assert.equal(restored.state().keys.red, 0)
  assert.deepEqual(restored.state().collectedKeys, [])
})

test("verwirft voneinander abweichende Schlüsselanzahl und Fund-IDs", () => {
  const data = browserSession()
  const first = new KeyInventoryStore()
  first.collectKey("kurs:blau", "blue")
  const [storageKey] = data.keys()
  const stored = JSON.parse(data.get(storageKey))
  stored.keys.blue = 2
  data.set(storageKey, JSON.stringify(stored))

  const restored = new KeyInventoryStore()
  assert.equal(restored.state().keys.blue, 0)
  assert.deepEqual(restored.state().collectedKeys, [])
})

test("ordnet deutsche und englische Farbnamen zu", () => {
  assert.equal(requestedKeyColor("rot"), "red")
  assert.equal(requestedKeyColor("BLUE"), "blue")
  assert.equal(requestedKeyColor("grün"), "green")
  assert.equal(requestedKeyColor("gelb"), "yellow")
  assert.equal(requestedKeyColor("violett"), "purple")
  assert.equal(requestedKeyColor("orange"), "orange")
  assert.equal(requestedKeyColor("magenta"), "magenta")
  assert.equal(requestedKeyColor("weiß"), "white")
  assert.equal(requestedKeyColor("BLACK"), "black")
  assert.equal(requestedKeyColor("türkis"), "turquoise")
  assert.equal(requestedKeyColor("grey"), "gray")
  assert.equal(requestedKeyColor("braun"), "brown")
  assert.equal(requestedKeyColor("brau"), "brown")
  assert.equal(requestedKeyColor("auto"), null)
  assert.equal(requestedKeyColor("@1"), null)
  assert.equal(isKeyColorRequest("gruen"), true)
  assert.equal(isKeyColorRequest("zufall"), true)
  assert.equal(isKeyColorRequest("@1"), true)
  assert.equal(isKeyColorRequest("nurr auf Fole"), false)
  assert.equal(isKeyColorRequest("nachh 2 s"), false)
})

test("bestimmt Überraschungsfarben stabil aus der Fund-ID", () => {
  const first = deterministicKeyColor("seite-4:fund-1")
  const restored = deterministicKeyColor("seite-4:fund-1")
  assert.equal(first, "orange")
  assert.equal(first, restored)
  assert.equal(KEY_COLORS.includes(first), true)

  assert.deepEqual(resolveKeyAppearance("seite-4:fund-1", "@1"), {
    color: first,
    mystery: true,
  })
  assert.deepEqual(resolveKeyAppearance("seite-4:fund-1", "rot"), {
    color: "red",
    mystery: false,
  })
})

test("trennt Inventare derselben Kurs-URL nach Kursversion", () => {
  browserSession()
  setLiaCourseVersion("1.0.0")
  const firstVersion = new KeyInventoryStore()
  firstVersion.collectKey("kurs:gelb", "yellow")

  setLiaCourseVersion("2.0.0")
  const secondVersion = new KeyInventoryStore()
  assert.equal(secondVersion.isKeyCollected("kurs:gelb"), false)
  secondVersion.collectKey("kurs:orange", "orange")

  setLiaCourseVersion("1.0.0")
  const restoredFirstVersion = new KeyInventoryStore()
  assert.equal(restoredFirstVersion.isKeyCollected("kurs:gelb"), true)
  assert.equal(restoredFirstVersion.isKeyCollected("kurs:orange"), false)
})

test("migriert den versionslosen Altzustand genau einmal", () => {
  const data = browserSession()
  const legacyCourse = "https://example.test/key-course?demo=1"
  const legacyKey =
    `lia-loot:key-inventory:v1:${encodeURIComponent(legacyCourse)}`
  data.set(
    legacyKey,
    JSON.stringify({
      version: 1,
      keys: {
        red: 0,
        blue: 0,
        green: 0,
        yellow: 1,
        purple: 0,
        orange: 0,
      },
      collectedKeys: ["legacy:yellow", "legacy:consumed"],
      unlockedLocks: ["legacy:lock"],
    }),
  )

  setLiaCourseVersion("1.0.0")
  const migrated = new KeyInventoryStore()
  assert.equal(migrated.isKeyCollected("legacy:yellow"), true)
  assert.equal(migrated.isLockUnlocked("legacy:lock"), true)
  for (const color of [
    "magenta",
    "white",
    "black",
    "turquoise",
    "gray",
    "brown",
  ]) {
    assert.equal(migrated.state().keys[color], 0)
  }
  assert.equal(data.has(legacyKey), false)

  setLiaCourseVersion("2.0.0")
  const laterVersion = new KeyInventoryStore()
  assert.equal(laterVersion.isKeyCollected("legacy:yellow"), false)
  assert.equal(laterVersion.isLockUnlocked("legacy:lock"), false)
  setLiaCourseVersion("0.0.1")
})
