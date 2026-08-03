import assert from "node:assert/strict"
import test from "node:test"

import {
  compareLootIfNumbers,
  normalizeHighlightedWord,
  parseLootIfCondition,
  parseLootIfOptions,
} from "../src/loot-if-options.ts"

test("parst den Trigger fuer die vorherige bewertbare Aufgabe", () => {
  for (const trigger of [
    "vorherige-aufgabe",
    "Vorherige Aufgabe gelöst",
  ]) {
    assert.deepEqual(parseLootIfCondition(trigger), {
      kind: "previous-quiz",
    })
  }
})

test("parst den Trigger fuer alle Aufgaben der aktuellen Folie", () => {
  for (const trigger of [
    "folienaufgaben-geloest",
    "Aktuelle Folie gelöst",
    "Alle Aufgaben der aktuellen Folie gelöst",
  ]) {
    assert.deepEqual(parseLootIfCondition(trigger), {
      kind: "current-slide-quizzes",
    })
  }
})

test("parst kanonische und natuerliche Mindestzahlen geloester Aufgaben", () => {
  assert.deepEqual(parseLootIfCondition("aufgaben >= 3"), {
    kind: "solved-quizzes",
    comparator: ">=",
    value: 3,
  })
  assert.deepEqual(
    parseLootIfCondition("Mindestens 4 bewertbare Aufgaben gelöst"),
    {
      kind: "solved-quizzes",
      comparator: ">=",
      value: 4,
    },
  )
})

test("parst Ressourcenvergleiche mit allen Operatoren und deutschen Aliasen", () => {
  const cases = [
    ["Gold > 1", "gold", ">", 1],
    ["Diamanten >= 2", "diamonds", ">=", 2],
    ["Energie = 3", "energy", "=", 3],
    ["Gold <= 4", "gold", "<=", 4],
    ["Gold < 5", "gold", "<", 5],
    ["Gold größer 1,5", "gold", ">", 1.5],
    ["Diamanten größer oder gleich 2", "diamonds", ">=", 2],
    ["Energie höchstens 3", "energy", "<=", 3],
  ]

  for (const [trigger, resource, comparator, value] of cases) {
    assert.deepEqual(
      parseLootIfCondition(trigger),
      { kind: "resource", resource, comparator, value },
      trigger,
    )
  }
})

test("parst typgenaue Kistenanzahlen kanonisch und natuerlich", () => {
  const cases = [
    ["schatztruhen >= 2", "gold", ">=", 2],
    ["diamantkisten = 1", "diamonds", "=", 1],
    ["energiekisten < 4", "energy", "<", 4],
    ["2 Schatztruhen geöffnet", "gold", ">=", 2],
    ["3 Diamantenkisten geöffnet", "diamonds", ">=", 3],
    ["1 Energiekiste eingesammelt", "energy", ">=", 1],
  ]

  for (const [trigger, reward, comparator, value] of cases) {
    assert.deepEqual(
      parseLootIfCondition(trigger),
      { kind: "opened-chests", reward, comparator, value },
      trigger,
    )
  }
})

test("parst ein bestimmtes Schloss ueber kanonisches Ziel oder Alias", () => {
  assert.deepEqual(parseLootIfCondition("schloss:translator"), {
    kind: "lock-opened",
    target: "translator",
  })
  assert.deepEqual(
    parseLootIfCondition("Schloss Übersetzer geöffnet"),
    { kind: "lock-opened", target: "translator" },
  )
  assert.deepEqual(parseLootIfCondition("schloss:textmarkerbutton"), {
    kind: "lock-opened",
    target: "marker",
  })
})

test("parst Besuch einer Geheimfolie und Fund der Lupe", () => {
  for (const trigger of ["geheimfolie-besucht", "Geheime Folie besucht"]) {
    assert.deepEqual(parseLootIfCondition(trigger), {
      kind: "secret-slide-visited",
    })
  }
  for (const trigger of ["lupe-gefunden", "Lupe eingesammelt"]) {
    assert.deepEqual(parseLootIfCondition(trigger), {
      kind: "magnifier-found",
    })
  }
})

test("parst farbige Markierungen optional wortgenau", () => {
  for (const trigger of [
    "markiert:rot",
    "markiert = red",
    "Ein Wort wurde mit der Farbe Rot markiert",
  ]) {
    assert.deepEqual(
      parseLootIfCondition(trigger),
      { kind: "word-highlighted", color: "red", word: null },
      trigger,
    )
  }

  assert.deepEqual(parseLootIfCondition("markiert:rot:Haus"), {
    kind: "word-highlighted",
    color: "red",
    word: "Haus",
  })
  assert.deepEqual(
    parseLootIfCondition('Wort "Schöne Häuser" mit der Farbe grün markiert'),
    {
      kind: "word-highlighted",
      color: "green",
      word: "Schöne Häuser",
    },
  )
})

test("normalisiert markierte Woerter defensiv fuer exakte Vergleiche", () => {
  assert.equal(normalizeHighlightedWord("  SCHÖNE\t Häuser  "), "schöne häuser")
  assert.equal(normalizeHighlightedWord("ＡＢＣ"), "abc")
})

test("wertet alle Zahlenoperatoren aus und verwirft nichtendliche Werte", () => {
  const cases = [
    [3, ">", 2, true],
    [3, ">=", 3, true],
    [3, "=", 3, true],
    [3, "<=", 3, true],
    [3, "<", 4, true],
    [3, ">", 3, false],
    [3, "<", 3, false],
  ]
  for (const [actual, comparator, expected, result] of cases) {
    assert.equal(
      compareLootIfNumbers(actual, comparator, expected),
      result,
      `${actual} ${comparator} ${expected}`,
    )
  }
  assert.equal(compareLootIfNumbers(Number.NaN, ">", 0), false)
  assert.equal(compareLootIfNumbers(1, "<", Number.POSITIVE_INFINITY), false)
})

test("akzeptiert als Dann-Aktion ausschliesslich spawn", () => {
  assert.deepEqual(parseLootIfOptions("vorherige-aufgabe; spawn"), {
    action: "spawn",
    condition: { kind: "previous-quiz" },
    errors: [],
    valid: true,
  })

  const unsupported = parseLootIfOptions("vorherige-aufgabe; verstecken")
  assert.equal(unsupported.valid, false)
  assert.equal(unsupported.action, null)
  assert.ok(unsupported.errors.some((error) => error.includes("spawn")))

  assert.equal(
    parseLootIfOptions("vorherige-aufgabe; spawn; extra").valid,
    false,
  )
  assert.equal(
    parseLootIfOptions("vorherige-aufgabe;; spawn").valid,
    false,
  )
  assert.equal(
    parseLootIfOptions("vorherige-aufgabe; spawn;").valid,
    false,
  )
  assert.equal(parseLootIfOptions("vorherige-aufgabe").valid, false)
})

test("verwirft unbekannte und ungueltige Trigger fail-closed", () => {
  const invalid = [
    "",
    "unbekannt",
    "aufgaben >= -1",
    "aufgaben >= 1,5",
    `aufgaben >= ${Number.MAX_SAFE_INTEGER + 1}`,
    "schatztruhen >= 1,5",
    "Energie ungefähr 3",
    "schloss:unbekannt",
    "markiert:violett",
    "markiert:rot:",
    "-1 Schatztruhen geöffnet",
  ]

  for (const trigger of invalid) {
    assert.equal(parseLootIfCondition(trigger), null, trigger)
    const parsed = parseLootIfOptions(`${trigger}; spawn`)
    assert.equal(parsed.valid, false, trigger)
    assert.equal(parsed.condition, null, trigger)
  }
})
