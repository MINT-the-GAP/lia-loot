import assert from "node:assert/strict"
import test from "node:test"

import {
  MAX_PUZZLE_SLOTS,
  parsePuzzleGateOptions,
  parsePuzzlePieceOptions,
} from "../src/puzzle-options.ts"

function visibility(overrides = {}) {
  return {
    delayMs: 0,
    onlyOnSlide: false,
    onlyWithoutAnnotations: false,
    themes: [],
    variants: [],
    ...overrides,
  }
}

test("parst die öffentliche Puzzletor-Matrix mit Semikolons auf beiden Ebenen", () => {
  assert.deepEqual(
    parsePuzzleGateOptions("rot; [[2;3];[1;6];[5;4]]"),
    {
      color: "red",
      columns: 2,
      errors: [],
      matrix: [
        [2, 3],
        [1, 6],
        [5, 4],
      ],
      onlyOnSlide: false,
      rows: 3,
      slotCount: 6,
      valid: true,
    },
  )
})

test("unterstützt genau eine optionale Ankerbindung am Puzzletor", () => {
  const parsed = parsePuzzleGateOptions(
    "anker; blau; [[1;2;3];[4;5;6]]",
  )
  assert.equal(parsed.valid, true)
  assert.equal(parsed.color, "blue")
  assert.equal(parsed.onlyOnSlide, true)
  assert.equal(parsed.rows, 2)
  assert.equal(parsed.columns, 3)
})

test("unterstützt die zwölf kanonischen Puzzlefarben", () => {
  const colors = new Map([
    ["rot", "red"],
    ["blau", "blue"],
    ["gruen", "green"],
    ["gelb", "yellow"],
    ["lila", "purple"],
    ["orange", "orange"],
    ["magenta", "magenta"],
    ["weiss", "white"],
    ["schwarz", "black"],
    ["tuerkis", "turquoise"],
    ["grau", "gray"],
    ["braun", "brown"],
  ])
  for (const [authored, internal] of colors) {
    assert.equal(
      parsePuzzleGateOptions(`${authored}; [[1]]`).color,
      internal,
      authored,
    )
    assert.equal(
      parsePuzzlePieceOptions(`${authored}; 1`).color,
      internal,
      authored,
    )
  }

  const naturalAliases = new Map([
    ["grün", "green"],
    ["weiß", "white"],
    ["türkis", "turquoise"],
    ["brau", "brown"],
  ])
  for (const [authored, internal] of naturalAliases) {
    assert.equal(
      parsePuzzleGateOptions(`${authored}; [[1]]`).color,
      internal,
      authored,
    )
    assert.equal(
      parsePuzzlePieceOptions(`${authored}; 1`).color,
      internal,
      authored,
    )
  }

  for (const unsupported of ["red", "green", "white", "violett", "auto"]) {
    assert.equal(
      parsePuzzleGateOptions(`${unsupported}; [[1]]`).valid,
      false,
      unsupported,
    )
    assert.equal(
      parsePuzzlePieceOptions(`${unsupported}; 1`).valid,
      false,
      unsupported,
    )
  }
})

test("verlangt eine rechteckige Permutation von 1 bis N mit höchstens 16 Slots", () => {
  const seventeen = Array.from({ length: 17 }, (_, index) => index + 1).join(
    ";",
  )
  for (const specification of [
    "rot; [[1;2];[3]]",
    "rot; [[1;1];[3;4]]",
    "rot; [[1;2];[3;5]]",
    "rot; [[0;1]]",
    "rot; [[-1;2]]",
    "rot; [[1.5;2]]",
    "rot; [[1,2];[3,4]]",
    "rot; [[1;2];;[3;4]]",
    `rot; [[${seventeen}]]`,
  ]) {
    const parsed = parsePuzzleGateOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
  assert.equal(MAX_PUZZLE_SLOTS, 16)
})

test("weist fehlende, unbekannte, doppelte und mehrdeutige Torwerte fail-closed zurück", () => {
  for (const specification of [
    "",
    "rot",
    "[[1]]",
    "rot; blau; [[1]]",
    "rot; [[1]]; [[1]]",
    "rot; [[1]]; anker; anker",
    "rot;; [[1]]",
    "rot; [[1]",
    "rot; [[1]]; unbekannt",
  ]) {
    const parsed = parsePuzzleGateOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})

test("parst exakt Farbe und positive Nummer eines Puzzleteils", () => {
  assert.deepEqual(parsePuzzlePieceOptions("rot; 4"), {
    color: "red",
    concealment: null,
    errors: [],
    layers: [],
    number: 4,
    valid: true,
    visibility: visibility(),
  })
})

test("übernimmt die gemeinsamen Fundoptionen ohne Oberflächenziel", () => {
  assert.deepEqual(
    parsePuzzlePieceOptions(
      "gruen; 4; anker; 1.5 Minuten; theme=rot; theme=blau; darkmode; lightmode; ohne-annotation; zauberstaub; erde-unsichtbar; pflanze",
    ),
    {
      color: "green",
      concealment: "dust",
      errors: [],
      layers: [
        { kind: "soil", concealment: "solid" },
        { kind: "plant", concealment: null },
      ],
      number: 4,
      valid: true,
      visibility: visibility({
        delayMs: 90_000,
        onlyOnSlide: true,
        onlyWithoutAnnotations: true,
        themes: ["red", "blue"],
        variants: ["dark", "light"],
      }),
    },
  )
})

test("lässt geordnete gleichartige Direktschichten bewusst mehrfach zu", () => {
  const parsed = parsePuzzlePieceOptions(
    "gelb; 2; erde; erde-unsichtbar; pflanze; pflanze-zauberstaub",
  )
  assert.equal(parsed.valid, true)
  assert.deepEqual(parsed.layers, [
    { kind: "soil", concealment: null },
    { kind: "soil", concealment: "solid" },
    { kind: "plant", concealment: null },
    { kind: "plant", concealment: "dust" },
  ])
})

test("weist Oberflächenziele für Puzzleteile ausdrücklich zurück", () => {
  for (const target of [
    "toc",
    "menu",
    "classroom",
    "info",
    "translator",
    "mode",
  ]) {
    const parsed = parsePuzzlePieceOptions(`rot; 1; ${target}`)
    assert.equal(parsed.valid, false, target)
    assert.match(parsed.errors.join(" "), /Oberflächenziele/u, target)
  }
})

test("weist fehlende, falsch platzierte und ungültige Teilstammdaten zurück", () => {
  for (const specification of [
    "",
    "rot",
    "4; rot",
    "rot; 0",
    "rot; -1",
    "rot; 1.5",
    "rot; 17",
    "rot;; 4",
    "rot; 4; blau",
    "rot; 4; 5",
    "rot; 4; unbekannt",
  ]) {
    const parsed = parsePuzzlePieceOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})

test("weist doppelte und widersprüchliche gemeinsame Fundoptionen zurück", () => {
  for (const specification of [
    "rot; 4; anker; anker",
    "rot; 4; 1s; 2s",
    "rot; 4; theme=rot; theme-rot",
    "rot; 4; darkmode; farbmodus=dunkel",
    "rot; 4; ohne-annotation; annotationen=aus",
    "rot; 4; unsichtbar; solid",
    "rot; 4; unsichtbar; zauberstaub",
  ]) {
    const parsed = parsePuzzlePieceOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})
