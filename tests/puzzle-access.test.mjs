import assert from "node:assert/strict"
import test from "node:test"

import {
  earliestUnsolvedPuzzleGate,
  navigationPuzzleGates,
  puzzleFallbackSection,
  puzzleSectionAllowed,
} from "../src/puzzle-access.ts"

function gate(
  gateId,
  section,
  sourceOrder,
  mode = "navigation",
  color = "red",
) {
  return { color, gateId, mode, section, sourceOrder }
}

test("sortiert Navigationstore nach sourceOrder und ignoriert Anker", () => {
  const authored = [
    gate("blue", 4, 30, "navigation", "blue"),
    gate("local", 1, 5, "anchor", "green"),
    gate("red", 1, 10),
    gate("yellow", 3, 20, "navigation", "yellow"),
  ]

  assert.deepEqual(
    navigationPuzzleGates(authored).map(({ gateId }) => gateId),
    ["red", "yellow", "blue"],
  )
  assert.deepEqual(
    authored.map(({ gateId }) => gateId),
    ["blue", "local", "red", "yellow"],
    "die Eingabe bleibt unveraendert",
  )
})

test("findet das frueheste ungeloeste Navigationstor", () => {
  const gates = [
    gate("later", 5, 20, "navigation", "blue"),
    gate("local", 0, 1, "anchor", "green"),
    gate("first", 2, 10),
  ]

  assert.equal(
    earliestUnsolvedPuzzleGate(gates, new Set())?.gateId,
    "first",
  )
  assert.equal(
    earliestUnsolvedPuzzleGate(gates, new Set(["first"]))?.gateId,
    "later",
  )
  assert.equal(
    earliestUnsolvedPuzzleGate(gates, new Set(["first", "later"])),
    null,
  )
})

test("erlaubt die Torfolie und alle Sections davor", () => {
  const frontier = gate("red", 3, 10)

  assert.equal(puzzleSectionAllowed(0, frontier), true)
  assert.equal(puzzleSectionAllowed(3, frontier), true)
  assert.equal(puzzleSectionAllowed(4, frontier), false)
  assert.equal(puzzleSectionAllowed(-1, frontier), false)
  assert.equal(puzzleSectionAllowed(1.5, frontier), false)
  assert.equal(puzzleSectionAllowed(99, null), true)
})

test("ignoriert reine Ankertore fuer die Navigationsgrenze", () => {
  const frontier = earliestUnsolvedPuzzleGate(
    [gate("local", 1, 1, "anchor")],
    new Set(),
  )

  assert.equal(frontier, null)
  assert.equal(puzzleSectionAllowed(50, frontier), true)
})

test("haelt mehrere Tore derselben Section bis zum letzten Solve geschlossen", () => {
  const gates = [
    gate("red", 2, 10, "navigation", "red"),
    gate("blue", 2, 20, "navigation", "blue"),
    gate("green", 5, 30, "navigation", "green"),
  ]

  const first = earliestUnsolvedPuzzleGate(gates, new Set())
  const second = earliestUnsolvedPuzzleGate(gates, new Set(["red"]))
  const third = earliestUnsolvedPuzzleGate(
    gates,
    new Set(["red", "blue"]),
  )

  assert.equal(first?.section, 2)
  assert.equal(second?.section, 2)
  assert.equal(puzzleSectionAllowed(3, second), false)
  assert.equal(third?.section, 5)
  assert.equal(puzzleSectionAllowed(5, third), true)
})

test("faellt hinter der Grenze auf die Torfolie zurueck", () => {
  const frontier = gate("red", 3, 10)

  assert.equal(puzzleFallbackSection(8, frontier), 3)
  assert.equal(puzzleFallbackSection(4, frontier), 3)
  assert.equal(puzzleFallbackSection(2, frontier), 2)
})

test("sucht unterhalb der Torfolie die naechste zusaetzlich erlaubte Section", () => {
  const frontier = gate("red", 4, 10)
  const secretSections = new Set([4, 3])

  assert.equal(
    puzzleFallbackSection(
      9,
      frontier,
      (section) => !secretSections.has(section),
    ),
    2,
  )
  assert.equal(
    puzzleFallbackSection(9, frontier, () => false),
    null,
  )
  assert.equal(puzzleFallbackSection(-1, frontier), null)
  assert.equal(puzzleFallbackSection(2.5, frontier), null)
})
