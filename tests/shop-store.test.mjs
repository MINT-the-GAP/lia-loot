import assert from "node:assert/strict"
import test from "node:test"

import {
  applyPercentageBonus,
  percentageRadius,
  ShopStore,
} from "../src/shop-store.ts"

function browserSession() {
  const data = new Map()
  globalThis.window = {
    LIA: { defaultCourseURL: "https://example.test/shop.md" },
    location: {
      href: "https://viewer.example/?shop#1",
      origin: "https://viewer.example",
      pathname: "/",
      search: "?shop",
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      removeItem: (key) => data.delete(key),
      setItem: (key, value) => data.set(key, String(value)),
    },
  }
  return data
}

test("speichert Einmalkäufe und stapelt Perks im aktuellen Kurstab", () => {
  browserSession()
  const first = new ShopStore()
  assert.equal(
    first.recordPurchase("shop:a:offer:0", {
      kind: "perk",
      perk: "magnifier-radius",
      percent: 15,
    }),
    true,
  )
  assert.equal(
    first.recordPurchase("shop:a:offer:1", {
      kind: "perk",
      perk: "magnifier-radius",
      percent: 10,
    }),
    true,
  )
  assert.equal(first.recordPurchase("shop:a:offer:0"), false)
  assert.equal(first.perk("magnifier-radius"), 25)

  const restored = new ShopStore()
  assert.equal(restored.isPurchased("shop:a:offer:0"), true)
  assert.equal(restored.perk("magnifier-radius"), 25)
})

test("speichert Atlaskarte und beide Atlas-Perks kursgebunden", () => {
  browserSession()
  const first = new ShopStore()
  assert.equal(
    first.recordPurchase("shop:atlas:offer:0", {
      kind: "unlock",
      unlock: "atlas",
    }),
    true,
  )
  assert.equal(
    first.recordPurchase("shop:atlas:offer:1", {
      kind: "unlock",
      unlock: "atlas-course-counts",
    }),
    true,
  )
  assert.equal(
    first.recordPurchase("shop:atlas:offer:2", {
      kind: "unlock",
      unlock: "atlas-slide-info",
    }),
    true,
  )
  const restored = new ShopStore()
  assert.equal(restored.hasUnlock("atlas"), true)
  assert.equal(restored.hasUnlock("atlas-course-counts"), true)
  assert.equal(restored.hasUnlock("atlas-slide-info"), true)
})

test("wendet stets den stärksten freigeschalteten Axt-Perk an", () => {
  browserSession()
  const store = new ShopStore()
  assert.equal(store.axeTier(), "stone")

  assert.equal(
    store.recordPurchase("shop:axe:iron", {
      kind: "unlock",
      unlock: "axe-iron",
    }),
    true,
  )
  assert.equal(store.axeTier(), "iron")
  assert.equal(store.hasEffectiveUnlock("axe-iron"), true)

  assert.equal(
    store.recordPurchase("shop:axe:diamond", {
      kind: "unlock",
      unlock: "axe-diamond",
    }),
    true,
  )
  assert.equal(store.axeTier(), "diamond")
  assert.equal(store.hasEffectiveUnlock("axe-iron"), true)
  assert.equal(store.hasEffectiveUnlock("axe-gold"), true)
  assert.equal(store.hasEffectiveUnlock("axe-diamond"), true)

  const restored = new ShopStore()
  assert.equal(restored.axeTier(), "diamond")
})

test("würfelt nur den gebrochenen Anteil eines Energiekistenbonus", () => {
  assert.equal(applyPercentageBonus(1, 10, () => 0.09), 2)
  assert.equal(applyPercentageBonus(1, 10, () => 0.1), 1)
  assert.equal(applyPercentageBonus(10, 10, () => 0.99), 11)
  assert.equal(applyPercentageBonus(3, 150, () => 0.49), 8)
  assert.equal(applyPercentageBonus(3, 150, () => 0.5), 7)
})

test("berechnet sichtbare Werkzeugradien aus additiven Prozentwerten", () => {
  assert.equal(percentageRadius(72, 10), 79)
  assert.equal(percentageRadius(92, 25), 115)
  assert.equal(percentageRadius(92, Number.NaN), 92)
})
