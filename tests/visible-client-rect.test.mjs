import assert from "node:assert/strict"
import test from "node:test"

import {
  clientRectClipPath,
  intersectClientRects,
} from "../src/visible-client-rect.ts"

const rect = { bottom: 160, left: 100, right: 220, top: 80 }

test("schneidet Client-Rechtecke vollständig und teilweise", () => {
  assert.deepEqual(
    intersectClientRects(rect, { bottom: 200, left: 0, right: 300, top: 0 }),
    rect,
  )
  assert.deepEqual(
    intersectClientRects(rect, {
      bottom: 145,
      left: 115,
      right: 205,
      top: 95,
    }),
    { bottom: 145, left: 115, right: 205, top: 95 },
  )
})

test("berücksichtigt horizontales und vertikales Overflow getrennt", () => {
  const clip = { bottom: 140, left: 120, right: 200, top: 100 }
  assert.deepEqual(
    intersectClientRects(rect, clip, { x: true, y: false }),
    { bottom: 160, left: 120, right: 200, top: 80 },
  )
  assert.deepEqual(
    intersectClientRects(rect, clip, { x: false, y: true }),
    { bottom: 140, left: 100, right: 220, top: 100 },
  )
})

test("bildet verschachtelte Clip-Bereiche nacheinander ab", () => {
  const outer = { bottom: 155, left: 90, right: 210, top: 70 }
  const inner = { bottom: 150, left: 110, right: 230, top: 90 }
  const first = intersectClientRects(rect, outer)
  assert.ok(first)
  assert.deepEqual(intersectClientRects(first, inner), {
    bottom: 150,
    left: 110,
    right: 210,
    top: 90,
  })
})

test("verwirft Kantenkontakt und ungültige Rechtecke", () => {
  assert.equal(
    intersectClientRects(rect, {
      bottom: 80,
      left: 100,
      right: 220,
      top: 0,
    }),
    null,
  )
  assert.equal(
    intersectClientRects(rect, {
      bottom: 100,
      left: Number.NaN,
      right: 100,
      top: 0,
    }),
    null,
  )
  assert.equal(
    intersectClientRects(rect, { bottom: 0, left: 2, right: 1, top: 0 }),
    null,
  )
})

test("erzeugt nur bei Teilüberdeckung einen Insets-Clip", () => {
  assert.equal(
    clientRectClipPath(rect, {
      bottom: 200,
      left: 0,
      right: 300,
      top: 0,
    }),
    "",
  )
  assert.equal(
    clientRectClipPath(rect, {
      bottom: 130,
      left: 105,
      right: 200,
      top: 90,
    }),
    "inset(10px 20px 30px 5px)",
  )
  assert.equal(
    clientRectClipPath(rect, {
      bottom: 70,
      left: 100,
      right: 220,
      top: 0,
    }),
    null,
  )
})
