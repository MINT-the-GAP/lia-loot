import assert from "node:assert/strict"
import test from "node:test"

import {
  isSequentialSlideNavigationKey,
  isSequentialSlideNavigationSwipe,
} from "../src/slide-navigation-lock.ts"

function keyEvent(key, options = {}) {
  return {
    altKey: false,
    ctrlKey: false,
    isComposing: false,
    key,
    metaKey: false,
    shiftKey: false,
    ...options,
  }
}

test("erkennt beide Pfeiltasten als sequenzielle Foliennavigation", () => {
  assert.equal(isSequentialSlideNavigationKey(keyEvent("ArrowLeft")), true)
  assert.equal(isSequentialSlideNavigationKey(keyEvent("ArrowRight")), true)
})

test("erkennt die LiaScript-Kurzbefehle Alt+Shift+N/P", () => {
  assert.equal(
    isSequentialSlideNavigationKey(
      keyEvent("n", { altKey: true, shiftKey: true }),
    ),
    true,
  )
  assert.equal(
    isSequentialSlideNavigationKey(
      keyEvent("P", { altKey: true, shiftKey: true }),
    ),
    true,
  )
})

test("lässt andere Kurzbefehle durch und blockiert Lia auch während IME", () => {
  assert.equal(isSequentialSlideNavigationKey(keyEvent("n")), false)
  assert.equal(
    isSequentialSlideNavigationKey(keyEvent("n", { altKey: true })),
    false,
  )
  assert.equal(
    isSequentialSlideNavigationKey(
      keyEvent("n", {
        altKey: true,
        ctrlKey: true,
        shiftKey: true,
      }),
    ),
    false,
  )
  assert.equal(
    isSequentialSlideNavigationKey(
      keyEvent("ArrowRight", { isComposing: true }),
    ),
    true,
  )
})

function swipe(overrides = {}) {
  return {
    elapsedMs: 120,
    endX: 300,
    endY: 100,
    startX: 500,
    startY: 100,
    ...overrides,
  }
}

test("erkennt LiaScripts Swipe-Grenzen in beide Richtungen einschließlich Rand", () => {
  assert.equal(isSequentialSlideNavigationSwipe(swipe()), true)
  assert.equal(
    isSequentialSlideNavigationSwipe(
      swipe({ elapsedMs: 300, endX: 650, endY: 200 }),
    ),
    true,
  )
})

test("lässt Klicks, kleine, vertikale und langsame Drags unverändert", () => {
  assert.equal(
    isSequentialSlideNavigationSwipe(swipe({ endX: 500 })),
    false,
  )
  assert.equal(
    isSequentialSlideNavigationSwipe(swipe({ endX: 351 })),
    false,
  )
  assert.equal(
    isSequentialSlideNavigationSwipe(swipe({ endY: 201 })),
    false,
  )
  assert.equal(
    isSequentialSlideNavigationSwipe(swipe({ elapsedMs: 301 })),
    false,
  )
  assert.equal(
    isSequentialSlideNavigationSwipe(swipe({ elapsedMs: -1 })),
    false,
  )
  assert.equal(
    isSequentialSlideNavigationSwipe(swipe({ endX: Number.NaN })),
    false,
  )
})
