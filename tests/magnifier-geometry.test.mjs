import assert from "node:assert/strict"
import test from "node:test"

import {
  MAGNIFIER_RADIUS,
  magnifierIntersectsRect,
} from "../src/magnifier-geometry.ts"

const rect = { left: 100, right: 200, top: 100, bottom: 160 }

test("erkennt Ziele innerhalb und am Rand des Lupenkreises", () => {
  assert.equal(magnifierIntersectsRect(150, 130, rect), true)
  assert.equal(magnifierIntersectsRect(100 - MAGNIFIER_RADIUS, 130, rect), true)
  assert.equal(
    magnifierIntersectsRect(100 - MAGNIFIER_RADIUS - 1, 130, rect),
    false,
  )
})

test("berücksichtigt diagonale Kreisabstände statt eines Rechteckausschnitts", () => {
  assert.equal(magnifierIntersectsRect(95, 95, rect, 8), true)
  assert.equal(magnifierIntersectsRect(90, 90, rect, 8), false)
})

test("verwirft ungültige Koordinaten und Rechtecke", () => {
  assert.equal(magnifierIntersectsRect(Number.NaN, 0, rect), false)
  assert.equal(
    magnifierIntersectsRect(0, 0, {
      left: 2,
      right: 1,
      top: 0,
      bottom: 1,
    }),
    false,
  )
  assert.equal(magnifierIntersectsRect(0, 0, rect, -1), false)
})
