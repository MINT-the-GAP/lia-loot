import assert from "node:assert/strict"
import test from "node:test"

import { setRangeGate } from "../src/range-gate.ts"

class FakeElement {
  constructor({ ariaHidden = null, inert = false } = {}) {
    this.attributes = new Map()
    this.attributeWrites = 0
    this.inert = inert
    if (ariaHidden !== null) this.attributes.set("aria-hidden", ariaHidden)
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  hasAttribute(name) {
    return this.attributes.has(name)
  }

  removeAttribute(name) {
    this.attributeWrites += 1
    this.attributes.delete(name)
  }

  setAttribute(name, value) {
    this.attributeWrites += 1
    this.attributes.set(name, String(value))
  }
}

test("haelt verschachtelte lootif- und Reveal-Gates gemeinsam inert", () => {
  const element = new FakeElement()

  assert.equal(setRangeGate(element, "reveal", "data-reveal", true), true)
  assert.equal(setRangeGate(element, "loot-if", "data-loot-if", true), true)
  assert.equal(element.inert, true)
  assert.equal(element.getAttribute("aria-hidden"), "true")

  assert.equal(setRangeGate(element, "reveal", "data-reveal", false), true)
  assert.equal(element.inert, true)
  assert.equal(element.getAttribute("aria-hidden"), "true")
  assert.equal(element.hasAttribute("data-loot-if"), true)

  assert.equal(setRangeGate(element, "loot-if", "data-loot-if", false), true)
  assert.equal(element.inert, false)
  assert.equal(element.getAttribute("aria-hidden"), null)
})

test("restauriert authored aria-hidden und inert exakt", () => {
  const element = new FakeElement({ ariaHidden: "false", inert: true })

  setRangeGate(element, "loot-if", "data-loot-if", true)
  assert.equal(element.getAttribute("aria-hidden"), "true")
  assert.equal(element.inert, true)

  setRangeGate(element, "loot-if", "data-loot-if", false)
  assert.equal(element.getAttribute("aria-hidden"), "false")
  assert.equal(element.inert, true)
})

test("behandelt wiederholte Gate-Synchronisation idempotent", () => {
  const element = new FakeElement()

  assert.equal(setRangeGate(element, "loot-if", "data-loot-if", true), true)
  const writesAfterBlock = element.attributeWrites
  assert.equal(setRangeGate(element, "loot-if", "data-loot-if", true), false)
  assert.equal(element.attributeWrites, writesAfterBlock)
  assert.equal(setRangeGate(element, "loot-if", "data-loot-if", false), true)
  const writesAfterRelease = element.attributeWrites
  assert.equal(setRangeGate(element, "loot-if", "data-loot-if", false), false)
  assert.equal(element.attributeWrites, writesAfterRelease)
})
