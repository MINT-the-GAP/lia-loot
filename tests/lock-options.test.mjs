import assert from "node:assert/strict"
import test from "node:test"

import { parseLockOptions } from "../src/lock-options.ts"

test("liest Farbe und optionale Folienbindung unabhängig von der Reihenfolge", () => {
  assert.deepEqual(parseLockOptions("gruen"), {
    color: "green",
    errors: [],
    onlyOnSlide: false,
    valid: true,
  })
  assert.deepEqual(parseLockOptions("anker; GRÜN"), {
    color: "green",
    errors: [],
    onlyOnSlide: true,
    valid: true,
  })
  assert.deepEqual(parseLockOptions("orange; only-on-slide"), {
    color: "orange",
    errors: [],
    onlyOnSlide: true,
    valid: true,
  })
})

test("unterstützt alle neuen Schlossfarben", () => {
  for (const [authored, internal] of [
    ["magenta", "magenta"],
    ["weiß", "white"],
    ["schwarz", "black"],
    ["türkis", "turquoise"],
    ["grau", "gray"],
    ["braun", "brown"],
  ]) {
    const parsed = parseLockOptions(authored)
    assert.equal(parsed.valid, true, authored)
    assert.equal(parsed.color, internal, authored)
  }
})

test("weist fehlende, mehrfache und unbekannte Schlosswerte fail-closed zurück", () => {
  for (const specification of [
    "",
    "anker",
    "rot; blau",
    "rot; 2s",
    "rot; ankerr",
    "unbekannt",
  ]) {
    const parsed = parseLockOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.equal(parsed.color, null, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})
