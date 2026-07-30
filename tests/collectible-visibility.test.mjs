import assert from "node:assert/strict"
import test from "node:test"

import {
  MAX_COLLECTIBLE_DELAY_MS,
  advanceCollectibleReveal,
  collectibleVisibilitySignature,
  parseCollectibleOptions,
} from "../src/collectible-visibility.ts"
import { sectionFromLootId } from "../src/slide-activity.ts"

test("parst Anker und reine Zeitwerte mit verbleibenden Werten", () => {
  assert.deepEqual(parseCollectibleOptions("mode; anker; 12s"), {
    errors: [],
    hasOptions: true,
    rule: { delayMs: 12_000, onlyOnSlide: true },
    valid: true,
    values: ["mode"],
  })

  assert.deepEqual(
    parseCollectibleOptions(
      "toc; Anker; 10s; menu",
    ),
    {
      errors: [],
      hasOptions: true,
      rule: { delayMs: 10_000, onlyOnSlide: true },
      valid: true,
      values: ["toc", "menu"],
    },
  )
  assert.deepEqual(
    parseCollectibleOptions("gruen; 1.5 Minuten"),
    {
      errors: [],
      hasOptions: true,
      rule: { delayMs: 90_000, onlyOnSlide: false },
      valid: true,
      values: ["gruen"],
    },
  )
})

test("unterstützt Anker, Großschreibung und reine null Sekunden", () => {
  assert.deepEqual(
    parseCollectibleOptions("MODE; ANKER; 0s"),
    {
      errors: [],
      hasOptions: true,
      rule: { delayMs: 0, onlyOnSlide: true },
      valid: true,
      values: ["MODE"],
    },
  )
  assert.equal(
    parseCollectibleOptions("2min").rule.delayMs,
    120_000,
  )
})

test("lässt alte Platzierungs-, Farb- und Sichtbarkeitswerte unverändert", () => {
  assert.deepEqual(parseCollectibleOptions("toc; menu"), {
    errors: [],
    hasOptions: false,
    rule: { delayMs: 0, onlyOnSlide: false },
    valid: true,
    values: ["toc", "menu"],
  })
  assert.deepEqual(parseCollectibleOptions("gruen").values, ["gruen"])
  assert.deepEqual(
    parseCollectibleOptions("nur-auf-folie; nach=2min").rule,
    { delayMs: 120_000, onlyOnSlide: true },
  )
})

test("weist fehlerhafte, doppelte und übergroße Optionen fail-closed zurück", () => {
  for (const specification of [
    "erst nach -1 Sekunden",
    "erst nach Sekunden",
    "erst nach 4 Stunden",
    "nur auf Folien",
    "nach=1s; erst nach 2 Sekunden",
    `erst nach ${Math.ceil(MAX_COLLECTIBLE_DELAY_MS / 1000) + 1} Sekunden`,
    "toc; nurr auf Folie",
    "nurr auf Folie",
    "erst nack 2 Sekunden",
    "10 Sekundn",
    "ankerr",
  ]) {
    const parsed = parseCollectibleOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})

test("startet eine globale Verzögerung sofort und wird exakt zur Deadline sichtbar", () => {
  const rule = { delayMs: 10_000, onlyOnSlide: false }
  const first = advanceCollectibleReveal(rule, null, 1_000, false)
  assert.deepEqual(first, {
    state: {
      signature: collectibleVisibilitySignature(rule),
      startedAt: 1_000,
    },
    visible: false,
    wakeAt: 11_000,
  })
  assert.equal(
    advanceCollectibleReveal(rule, first.state, 10_999, false).visible,
    false,
  )
  assert.equal(
    advanceCollectibleReveal(rule, first.state, 11_000, false).visible,
    true,
  )
})

test("startet foliengebunden erst beim Betreten und setzt beim Weggehen nicht zurück", () => {
  const rule = { delayMs: 5_000, onlyOnSlide: true }
  const outside = advanceCollectibleReveal(rule, null, 100, false)
  assert.deepEqual(outside, {
    state: null,
    visible: false,
    wakeAt: null,
  })

  const entered = advanceCollectibleReveal(rule, null, 1_000, true)
  const left = advanceCollectibleReveal(rule, entered.state, 3_000, false)
  assert.equal(left.visible, false)
  assert.equal(left.state?.startedAt, 1_000)
  assert.equal(left.wakeAt, 6_000)
  assert.equal(
    advanceCollectibleReveal(rule, left.state, 6_000, true).visible,
    true,
  )
})

test("erkennt LiaScripts section_uid auch in zusammengesetzten Fund-IDs", () => {
  assert.equal(sectionFromLootId("3_17"), 3)
  assert.equal(sectionFromLootId("key:2_8:inline"), 2)
  assert.equal(sectionFromLootId("source-gold-abc-1"), null)
})
