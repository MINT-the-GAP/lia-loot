import assert from "node:assert/strict"
import test from "node:test"

import { concealmentIdOf } from "../src/concealment.ts"

function fakeElement(attributes = {}, descendants = {}) {
  return {
    getAttribute(name) {
      return Object.hasOwn(attributes, name) ? attributes[name] : null
    },
    querySelector(selector) {
      const attribute = /^\[([^\]]+)\]$/u.exec(selector)?.[1]
      const value = attribute ? descendants[attribute] : undefined
      return value === undefined
        ? null
        : fakeElement({ [attribute]: value })
    },
  }
}

test("vergibt stabile IDs für Textwrapper und Reveal-Cover", () => {
  assert.equal(
    concealmentIdOf(fakeElement({ "data-secret-id": " 17_4 " })),
    "secret:17_4",
  )
  assert.equal(
    concealmentIdOf(
      fakeElement({ "data-loot-reveal-cover-slot": "plant-1:reveal:0" }),
    ),
    "reveal:plant-1:reveal:0",
  )
})

test("leitet Item-Verbergungen aus der konkreten Fundinstanz ab", () => {
  assert.equal(
    concealmentIdOf(
      fakeElement({}, { "data-loot-chest-button": "source-gold-1:menu" }),
    ),
    "chest:source-gold-1:menu",
  )
  assert.equal(
    concealmentIdOf(
      fakeElement({}, { "data-loot-key-button": "key:source-1:inline" }),
    ),
    "key:key:source-1:inline",
  )
  assert.equal(
    concealmentIdOf(
      fakeElement({}, { "data-loot-magnifier-button": "magnifier:1:inline" }),
    ),
    "magnifier:magnifier:1:inline",
  )
  assert.equal(
    concealmentIdOf(
      fakeElement({}, { "data-loot-tool-pickup": "tool:shovel:1" }),
    ),
    "tool:tool:shovel:1",
  )
})

test("ignoriert nicht aufgelöste LiaScript-Platzhalter", () => {
  assert.equal(
    concealmentIdOf(fakeElement({ "data-secret-id": "@uid" })),
    null,
  )
})
