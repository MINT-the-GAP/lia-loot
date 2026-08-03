import assert from "node:assert/strict"
import test from "node:test"

import { parseExplorationOptions } from "../src/exploration-options.ts"

test("normalisiert alle direkten Erd- und Pflanzenaliase", () => {
  const parsed = parseExplorationOptions(
    "Erde; erdhaufen; SOIL; dirt; Pflanze; blume; PLANT; flower",
  )

  assert.deepEqual(
    parsed.layers.map((layer) => layer.kind),
    ["soil", "soil", "soil", "soil", "plant", "plant", "plant", "plant"],
  )
  assert.ok(parsed.layers.every((layer) => layer.concealment === null))
  assert.deepEqual(parsed.values, [])
})

test("liest gekoppelte Verbergungstokens in ihrer Reihenfolge", () => {
  assert.deepEqual(
    parseExplorationOptions(
      "pflanze-zauberstaub; erde-unsichtbar; pflanze-unsichtbar; erde-zauberstaub",
    ),
    {
      layers: [
        { kind: "plant", concealment: "dust" },
        { kind: "soil", concealment: "solid" },
        { kind: "plant", concealment: "solid" },
        { kind: "soil", concealment: "dust" },
      ],
      values: [],
    },
  )
})

test("behält identische mehrfache Layer vollständig bei", () => {
  assert.deepEqual(parseExplorationOptions("erde; erde; pflanze-unsichtbar; pflanze-unsichtbar"), {
    layers: [
      { kind: "soil", concealment: null },
      { kind: "soil", concealment: null },
      { kind: "plant", concealment: "solid" },
      { kind: "plant", concealment: "solid" },
    ],
    values: [],
  })
})

test("gibt unbekannte Resttokens getrimmt und unverändert zurück", () => {
  assert.deepEqual(
    parseExplorationOptions(
      " anker ; ERDE ; 12s ; erde unsichtbar ; soil-dust ; Blume-verdeckt ; Zauberstaub ",
    ),
    {
      layers: [
        { kind: "soil", concealment: null },
        { kind: "soil", concealment: "dust" },
        { kind: "plant", concealment: "solid" },
      ],
      values: ["anker", "12s", "erde unsichtbar", "Zauberstaub"],
    },
  )
})

test("akzeptiert bereits getrennte Tokenlisten", () => {
  assert.deepEqual(
    parseExplorationOptions(["pflanze", "erde-unsichtbar", "menu; 2min"]),
    {
      layers: [
        { kind: "plant", concealment: null },
        { kind: "soil", concealment: "solid" },
      ],
      values: ["menu", "2min"],
    },
  )
})
