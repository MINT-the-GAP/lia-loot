import assert from "node:assert/strict"
import test from "node:test"

import { parseShopOptions } from "../src/shop-options.ts"

test("liest Werkzeuge, Ressourcen, Puzzleteile und variable Perks", () => {
  const parsed = parseShopOptions(
    "schaufel=3gold; giesskanne=2diamanten; lupe=4energie; " +
      "taschenlampe=2gold+1diamant; energie-5=1gold; gold-7=2diamanten; " +
      "diamanten-2=6energie; puzzleteil-türkis-3=2gold; " +
      "energiekistenbonus-10=3diamanten; lupenradius-15=4gold; " +
      "taschenlampenradius-20=5gold; atlaskarte=2gold; " +
      "atlas-kurszahlen=1gold; atlas-folieninfo=1diamant; " +
      "eisenaxt=2gold; goldaxt=4gold; diamantaxt=3diamanten",
  )

  assert.deepEqual(parsed.errors, [])
  assert.equal(parsed.offers.length, 17)
  assert.deepEqual(parsed.offers[0].product, { kind: "tool", tool: "shovel" })
  assert.deepEqual(parsed.offers[3].price, {
    diamonds: 1,
    energy: 0,
    gold: 2,
  })
  assert.deepEqual(parsed.offers[4].product, {
    amount: 5,
    kind: "resource",
    resource: "energy",
  })
  assert.deepEqual(parsed.offers[7].product, {
    color: "turquoise",
    kind: "puzzle-piece",
    number: 3,
  })
  assert.deepEqual(parsed.offers.slice(8, 11).map((offer) => offer.product), [
    { kind: "perk", percent: 10, perk: "energy-chest" },
    { kind: "perk", percent: 15, perk: "magnifier-radius" },
    { kind: "perk", percent: 20, perk: "flashlight-radius" },
  ])
  assert.deepEqual(parsed.offers.slice(11, 14).map((offer) => offer.product), [
    { kind: "atlas", unlock: "atlas" },
    { kind: "unlock", unlock: "atlas-course-counts" },
    { kind: "unlock", unlock: "atlas-slide-info" },
  ])
  assert.deepEqual(parsed.offers.slice(14).map((offer) => offer.product), [
    { kind: "unlock", unlock: "axe-iron" },
    { kind: "unlock", unlock: "axe-gold" },
    { kind: "unlock", unlock: "axe-diamond" },
  ])
})

test("lässt ungültige Angebote einzeln geschlossen und behält gültige", () => {
  const parsed = parseShopOptions(
    "schaufel=3gold; unbekannt=2gold; energie-0=1gold; " +
      "lupenradius-999=1gold; lupe=gold; taschenlampe=2gold+3gold",
  )

  assert.equal(parsed.offers.length, 1)
  assert.deepEqual(parsed.offers[0].product, { kind: "tool", tool: "shovel" })
  assert.equal(parsed.errors.length, 5)
})

test("liest Katzenhalsbänder in der gemeinsamen Loot-Farbpalette", () => {
  const parsed = parseShopOptions(
    "katzenhalsband-rot=2gold; halsband-grün=1diamant; cat-collar-türkis=3energie",
  )

  assert.deepEqual(parsed.errors, [])
  assert.deepEqual(parsed.offers.map((offer) => offer.product), [
    { color: "red", kind: "collar" },
    { color: "green", kind: "collar" },
    { color: "turquoise", kind: "collar" },
  ])
  assert.match(
    parseShopOptions("katzenhalsband-rosa=1gold").errors[0],
    /Halsbandfarbe/u,
  )
})

test("begrenzt Angebotszahl, Mengen, Prozentwerte und leere Shops", () => {
  assert.equal(parseShopOptions("").offers.length, 0)
  assert.match(parseShopOptions("").errors[0], /keine Angebote/u)
  assert.match(parseShopOptions("gold-1000000=1gold").errors[0], /999999/u)
  assert.match(parseShopOptions("lupenradius-0=1gold").errors[0], /positive/u)

  const tooMany = parseShopOptions(
    Array.from({ length: 25 }, (_, index) => `energie-${index + 1}=1gold`).join(";"),
  )
  assert.equal(tooMany.offers.length, 24)
  assert.match(tooMany.errors[0], /höchstens 24/u)
})
