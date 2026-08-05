import assert from "node:assert/strict"
import test from "node:test"

import { setLiaCourseVersion } from "../src/course-identity.ts"
import { PuzzleStore } from "../src/puzzle-store.ts"

function browserSession(version = "1.0.0") {
  const data = new Map()
  globalThis.window = {
    LIA: { defaultCourseURL: "https://example.test/puzzle-course.md" },
    location: {
      href: "https://viewer.example/?puzzle#1",
      origin: "https://viewer.example",
      pathname: "/",
      search: "?puzzle",
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      removeItem: (key) => data.delete(key),
      setItem: (key, value) => data.set(key, String(value)),
    },
  }
  setLiaCourseVersion(version)
  return data
}

const gates = [
  { color: "red", pattern: [2, 3, 1, 6, 5, 4] },
  { color: "blue", pattern: [1, 2] },
]

test("sammelt jedes konfigurierte Puzzleteil genau einmal", () => {
  browserSession()
  const store = new PuzzleStore()
  store.configure("sig-a", gates)
  assert.equal(store.collectPiece("red", 4), true)
  assert.equal(store.collectPiece("red", 4), false)
  assert.equal(store.collectPiece("red", 9), false)
  assert.deepEqual(store.availablePieces("red"), [4])
})

test("verschiebt und verdrängt Teile und öffnet nur bei exakter Anordnung", () => {
  browserSession()
  const store = new PuzzleStore()
  store.configure("sig-b", gates)
  for (let number = 1; number <= 6; number += 1) {
    store.collectPiece("red", number)
  }

  assert.equal(store.placePiece("red", 1, 0), "placed")
  assert.equal(store.placePiece("red", 2, 0), "placed")
  assert.deepEqual(store.placement("red"), [2, null, null, null, null, null])
  assert.deepEqual(store.availablePieces("red"), [1, 3, 4, 5, 6])

  const pattern = [2, 3, 1, 6, 5, 4]
  pattern.forEach((number, slot) => {
    const result = store.placePiece("red", number, slot)
    assert.equal(result, slot === pattern.length - 1 ? "solved" : "placed")
  })
  assert.equal(store.isGateSolved("red"), true)
  assert.equal(store.placePiece("red", 4, 0), "invalid")
})

test("stellt Sammlung, Belegung und geöffnete Tore im selben Tab wieder her", () => {
  browserSession()
  const first = new PuzzleStore()
  first.configure("sig-c", [{ color: "blue", pattern: [1, 2] }])
  first.collectPiece("blue", 1)
  first.collectPiece("blue", 2)
  first.placePiece("blue", 1, 0)
  first.placePiece("blue", 2, 1)

  const restored = new PuzzleStore()
  restored.configure("sig-c", [{ color: "blue", pattern: [1, 2] }])
  assert.deepEqual(restored.placement("blue"), [1, 2])
  assert.equal(restored.isGateSolved("blue"), true)
})

test("setzt Fortschritt bei geänderter Konfigurationssignatur zurück", () => {
  browserSession()
  const first = new PuzzleStore()
  first.configure("sig-old", [{ color: "blue", pattern: [1, 2] }])
  first.collectPiece("blue", 1)

  const changed = new PuzzleStore()
  changed.configure("sig-new", [{ color: "blue", pattern: [2, 1] }])
  assert.deepEqual(changed.state().collected.blue, [])
  assert.deepEqual(changed.placement("blue"), [null, null])
})

test("verwirft beschädigte Puzzle-Zustände fail-closed", () => {
  const data = browserSession()
  const first = new PuzzleStore()
  first.configure("sig-d", [{ color: "red", pattern: [1, 2] }])
  first.collectPiece("red", 1)
  const [key] = data.keys()
  const damaged = JSON.parse(data.get(key))
  damaged.placements.red = [1, 1]
  data.set(key, JSON.stringify(damaged))

  const restored = new PuzzleStore()
  restored.configure("sig-d", [{ color: "red", pattern: [1, 2] }])
  assert.deepEqual(restored.state().collected.red, [])
  assert.deepEqual(restored.placement("red"), [null, null])
})

test("trennt Puzzlefortschritt nach Kursversion", () => {
  browserSession("1.0.0")
  const first = new PuzzleStore()
  first.configure("sig-e", [{ color: "orange", pattern: [1] }])
  first.collectPiece("orange", 1)

  setLiaCourseVersion("2.0.0")
  const second = new PuzzleStore()
  second.configure("sig-e", [{ color: "orange", pattern: [1] }])
  assert.equal(second.isPieceCollected("orange", 1), false)
})

test("verwaltet alle neuen Puzzlefarben unabhängig", () => {
  browserSession()
  const colors = ["magenta", "white", "black", "turquoise", "gray", "brown"]
  const store = new PuzzleStore()
  store.configure(
    "sig-new-colors",
    colors.map((color) => ({ color, pattern: [1] })),
  )

  for (const color of colors) {
    assert.equal(store.collectPiece(color, 1), true)
    assert.equal(store.placePiece(color, 1, 0), "solved")
    assert.equal(store.isGateSolved(color), true)
  }
  assert.deepEqual(store.solvedColors(), colors)
})

test("ergänzt neue Farbfelder in alten Puzzle-Zuständen", () => {
  const data = browserSession()
  const first = new PuzzleStore()
  first.configure("legacy-colors", [{ color: "red", pattern: [1] }])
  first.collectPiece("red", 1)
  const [key] = data.keys()
  const legacy = JSON.parse(data.get(key))
  for (const color of [
    "magenta",
    "white",
    "black",
    "turquoise",
    "gray",
    "brown",
  ]) {
    delete legacy.collected[color]
    delete legacy.placements[color]
  }
  data.set(key, JSON.stringify(legacy))

  const restored = new PuzzleStore()
  restored.configure("legacy-colors", [{ color: "red", pattern: [1] }])
  assert.equal(restored.isPieceCollected("red", 1), true)
  for (const color of [
    "magenta",
    "white",
    "black",
    "turquoise",
    "gray",
    "brown",
  ]) {
    assert.deepEqual(restored.state().collected[color], [])
    assert.deepEqual(restored.state().placements[color], [])
  }
})

test("meldet vor der Katalogkonfiguration keinen alten Torstatus", () => {
  browserSession()
  const first = new PuzzleStore()
  first.configure("same-signature", [
    { color: "red", pattern: [1] },
  ])
  first.collectPiece("red", 1)
  assert.equal(first.placePiece("red", 1, 0), "solved")

  const reloaded = new PuzzleStore()
  assert.equal(reloaded.isGateSolved("red"), false)
  assert.deepEqual(reloaded.solvedColors(), [])

  reloaded.configure("same-signature", [
    { color: "red", pattern: [1] },
  ])
  assert.equal(reloaded.isGateSolved("red"), true)
  assert.deepEqual(reloaded.solvedColors(), ["red"])
})
