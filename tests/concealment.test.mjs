import assert from "node:assert/strict"
import test from "node:test"

import { extractConcealmentOptions } from "../src/concealment.ts"

test("liest beide Verbergungsmodi und lässt andere Sammeloptionen stehen", () => {
  assert.deepEqual(
    extractConcealmentOptions(["blau", "zauberstaub", "menu"]),
    {
      errors: [],
      mode: "dust",
      values: ["blau", "menu"],
    },
  )
  assert.deepEqual(extractConcealmentOptions(["unsichtbar"]), {
    errors: [],
    mode: "solid",
    values: [],
  })
})

test("weist doppelte oder widersprüchliche Verbergungsoptionen zurück", () => {
  assert.equal(
    extractConcealmentOptions(["unsichtbar", "zauberstaub"]).errors.length,
    1,
  )
  assert.equal(
    extractConcealmentOptions(["zauberstaub", "dust"]).errors.length,
    1,
  )
})
