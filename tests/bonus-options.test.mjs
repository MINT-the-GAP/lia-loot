import assert from "node:assert/strict"
import test from "node:test"

import { parseBonusPickupOptions } from "../src/bonus-options.ts"

test("liest Atlaskarte mit allen gemeinsamen Fundschichten", () => {
  const parsed = parseBonusPickupOptions(
    "atlas",
    "anker; 12s; theme=blau; nebel; erde-unsichtbar; zauberstaub",
  )

  assert.equal(parsed.valid, true)
  assert.deepEqual(parsed.grant, { kind: "unlock", unlock: "atlas" })
  assert.equal(parsed.fog, true)
  assert.equal(parsed.concealment, "dust")
  assert.deepEqual(parsed.layers, [{ concealment: "solid", kind: "soil" }])
  assert.equal(parsed.visibility.delayMs, 12_000)
  assert.equal(parsed.visibility.onlyOnSlide, true)
  assert.deepEqual(parsed.visibility.themes, ["blue"])
})

test("liest alle findbaren Prozent-, Atlas- und Axt-Perks", () => {
  const cases = [
    [
      "energiekistenbonus-10",
      { kind: "perk", percent: 10, perk: "energy-chest" },
    ],
    [
      "lupenradius-15",
      { kind: "perk", percent: 15, perk: "magnifier-radius" },
    ],
    [
      "taschenlampenradius-20",
      { kind: "perk", percent: 20, perk: "flashlight-radius" },
    ],
    [
      "atlas-kurszahlen",
      { kind: "unlock", unlock: "atlas-course-counts" },
    ],
    [
      "atlas-folieninfo",
      { kind: "unlock", unlock: "atlas-slide-info" },
    ],
    ["eisenaxt", { kind: "unlock", unlock: "axe-iron" }],
    ["goldaxt", { kind: "unlock", unlock: "axe-gold" }],
    ["diamantaxt", { kind: "unlock", unlock: "axe-diamond" }],
    ["katzenhalsband-rot", { kind: "collar", color: "red" }],
    ["cat-collar-türkis", { kind: "collar", color: "turquoise" }],
  ]

  for (const [source, grant] of cases) {
    const parsed = parseBonusPickupOptions(
      "perk",
      source + "; farbmodus=dunkel; pflanze",
    )
    assert.equal(parsed.valid, true, source)
    assert.deepEqual(parsed.grant, grant, source)
    assert.deepEqual(parsed.layers, [{ concealment: null, kind: "plant" }])
    assert.deepEqual(parsed.visibility.variants, ["dark"])
  }
})

test("weist fehlende, fremde und mehrdeutige Fund-Perks geschlossen zurück", () => {
  for (const source of [
    "",
    "schaufel",
    "atlaskarte",
    "lupenradius-0",
    "lupenradius-501",
    "lupenradius-10; atlas-kurszahlen",
    "atlas-kurszahlen; unbekannt",
    "atlas-folieninfo; nebel; dunkelheit",
    "katzenhalsband-unsichtbar",
  ]) {
    const parsed = parseBonusPickupOptions("perk", source)
    assert.equal(parsed.valid, false, source)
    assert.equal(parsed.grant, null, source)
    assert.ok(parsed.errors.length > 0, source)
  }
})

test("weist Produktnamen am Atlaskartenmakro geschlossen zurück", () => {
  const parsed = parseBonusPickupOptions("atlas", "lupenradius-10")
  assert.equal(parsed.valid, false)
  assert.equal(parsed.grant, null)
})
