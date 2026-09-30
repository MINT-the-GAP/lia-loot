import assert from "node:assert/strict"
import test from "node:test"

import {
  energyReachedZero,
  selectReserveSlideDeclaration,
} from "../src/reserve-slide.ts"

test("aktiviert genau eine gültige Reservefolie", () => {
  const valid = { energy: 2, section: 4 }

  assert.deepEqual(selectReserveSlideDeclaration([valid]), valid)
  assert.equal(
    selectReserveSlideDeclaration([{ energy: null, section: 4 }]),
    null,
  )
  assert.equal(
    selectReserveSlideDeclaration([valid, { energy: 1, section: 7 }]),
    null,
  )
  assert.equal(selectReserveSlideDeclaration([]), null)
})

test("öffnet die Reserve nur beim Übergang von positiver Energie auf null", () => {
  assert.equal(energyReachedZero(1, 0), true)
  assert.equal(energyReachedZero(5, 0), true)
  assert.equal(energyReachedZero(null, 0), false)
  assert.equal(energyReachedZero(0, 0), false)
  assert.equal(energyReachedZero(0, 2), false)
  assert.equal(energyReachedZero(2, 1), false)
})
