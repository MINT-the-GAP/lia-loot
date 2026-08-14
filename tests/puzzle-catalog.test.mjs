import assert from "node:assert/strict"
import test from "node:test"

import { parseCoursePuzzleDeclarations } from "../src/course-chests.ts"
import {
  buildPuzzleCatalog,
  validPuzzleGateConfigurations,
} from "../src/puzzle-catalog.ts"

function markdown(...lines) {
  return lines.join("\n")
}

test("katalogisiert das gewünschte Semikolon-Puzzle mit stabiler Reihenfolge", () => {
  const discovery = parseCoursePuzzleDeclarations(
    markdown(
      "# Start",
      "@Puzzleteil(rot; 1)",
      "@Puzzleteil(rot; 2)",
      "@Puzzleteil(rot; 3)",
      "@Puzzleteil(rot; 4)",
      "@Puzzleteil(rot; 5)",
      "@Puzzleteil(rot; 6)",
      "@Puzzletor(rot; [[2;3];[1;6];[5;4]])",
      "",
      "# Danach",
    ),
  )
  const catalog = buildPuzzleCatalog(discovery)
  assert.equal(catalog.errors.length, 0)
  assert.equal(catalog.gates.length, 1)
  assert.equal(catalog.gates[0].valid, true)
  assert.deepEqual(catalog.gates[0].pattern, [2, 3, 1, 6, 5, 4])
  assert.deepEqual(
    validPuzzleGateConfigurations(catalog),
    [{ color: "red", pattern: [2, 3, 1, 6, 5, 4] }],
  )
  assert.match(catalog.signature, /^puzzle-[a-z0-9]+$/u)
})

test("katalogisiert mehrere Puzzleteile innerhalb derselben Textzeile", () => {
  const discovery = parseCoursePuzzleDeclarations(
    markdown(
      "# Start",
      "Auch gibt es Puzzleteile @Puzzleteil(blau; 1) @Puzzleteil(blau; 2) @Puzzleteil(blau; 3), die Sie einsammeln.",
      "@Puzzletor(blau; [[1;2;3]])",
    ),
  )
  const catalog = buildPuzzleCatalog(discovery)

  assert.deepEqual(
    discovery.pieces.map((piece) => piece.options),
    ["blau; 1", "blau; 2", "blau; 3"],
  )
  assert.deepEqual(
    catalog.pieces.map((piece) => piece.number),
    [1, 2, 3],
  )
  assert.equal(new Set(catalog.pieces.map((piece) => piece.sourceOrder)).size, 3)
  assert.equal(catalog.errors.length, 0)
  assert.equal(catalog.gates[0].valid, true)
  assert.deepEqual(catalog.gates[0].pattern, [1, 2, 3])
})

test("katalogisiert Puzzleteile und Tore in allen neuen Farben", () => {
  for (const [authored, internal] of [
    ["magenta", "magenta"],
    ["weiss", "white"],
    ["schwarz", "black"],
    ["tuerkis", "turquoise"],
    ["grau", "gray"],
    ["braun", "brown"],
  ]) {
    const catalog = buildPuzzleCatalog(
      parseCoursePuzzleDeclarations(
        markdown(
          "# Start",
          "@Puzzleteil(" + authored + "; 1)",
          "@Puzzletor(" + authored + "; [[1]])",
        ),
      ),
    )
    assert.equal(catalog.errors.length, 0, authored)
    assert.deepEqual(
      validPuzzleGateConfigurations(catalog),
      [{ color: internal, pattern: [1] }],
      authored,
    )
  }
})

test("ignoriert Puzzlebeispiele in Kommentaren, Code und Inline-Code", () => {
  const discovery = parseCoursePuzzleDeclarations(
    markdown(
      "# Start",
      "<!-- @Puzzleteil(rot; 1) -->",
      "```markdown",
      "@Puzzleteil(rot; 1)",
      "@Puzzletor(rot; [[1]])",
      "```",
      "Text mit `@Puzzletor(rot; [[1]])`.",
      "Text mit `@Puzzleteil(blau; 2)`.",
      "@Puzzleteil(blau; 1)",
      "@Puzzletor(blau; [[1]])",
    ),
  )
  assert.equal(discovery.pieces.length, 1)
  assert.equal(discovery.gates.length, 1)
  assert.equal(buildPuzzleCatalog(discovery).gates[0].valid, true)
})

test("scannt Inline-Aufrufe eindeutig und fail-closed", () => {
  const slash = String.fromCharCode(92)
  const discovery = parseCoursePuzzleDeclarations(
    markdown(
      "# Start",
      "@@Puzzleteil(rot; 1)",
      slash + "@Puzzleteil(rot; 2)",
      "@Puzzleteilchen(rot; 3)",
      "@Puzzleteilähnlich(rot; 4)",
      "Verschachtelt @Puzzleteil(rot; 1; @Puzzleteil(blau; 1)).",
      "Offen @Puzzleteil(gelb; 1; @Puzzleteil(gelb; 2)",
    ),
  )

  assert.equal(discovery.pieces.length, 1)
  assert.equal(
    discovery.pieces[0].options,
    "rot; 1; @Puzzleteil(blau; 1)",
  )
  const catalog = buildPuzzleCatalog(discovery)
  assert.equal(catalog.pieces.length, 1)
  assert.equal(catalog.pieces[0].valid, false)
})

test("schließt fehlende, doppelte, verwaiste und zu späte Teile aus", () => {
  const cases = [
    ["fehlend", ["@Puzzleteil(rot; 1)", "@Puzzletor(rot; [[1;2]])"]],
    [
      "doppelt",
      [
        "@Puzzleteil(rot; 1)",
        "@Puzzleteil(rot; 1)",
        "@Puzzletor(rot; [[1]])",
      ],
    ],
    ["verwaist", ["@Puzzleteil(blau; 1)"]],
    ["zu spät", ["@Puzzletor(rot; [[1]])", "@Puzzleteil(rot; 1)"]],
  ]
  for (const [name, body] of cases) {
    const catalog = buildPuzzleCatalog(
      parseCoursePuzzleDeclarations(markdown("# Start", ...body)),
    )
    assert.equal(
      catalog.gates.every((gate) => !gate.valid) || catalog.errors.length > 0,
      true,
      name,
    )
  }
})

test("markiert Tore in anderen geschlossenen Bereichen als ungültig", () => {
  const catalog = buildPuzzleCatalog(
    parseCoursePuzzleDeclarations(
      markdown(
        "# Start",
        "@Puzzleteil(rot; 1)",
        "@lootif(Gold >= 1; spawn)",
        "@Puzzletor(rot; [[1]])",
        "@Endelootif",
      ),
    ),
  )
  assert.equal(catalog.gates.length, 1)
  assert.equal(catalog.gates[0].gated, true)
  assert.equal(catalog.gates[0].valid, false)
})

test("trennt Farben und weist mehrere Tore derselben Farbe zurück", () => {
  const catalog = buildPuzzleCatalog(
    parseCoursePuzzleDeclarations(
      markdown(
        "# Start",
        "@Puzzleteil(rot; 1)",
        "@Puzzletor(rot; [[1]])",
        "@Puzzletor(rot; [[1]]; anker)",
      ),
    ),
  )
  assert.equal(catalog.gates.length, 2)
  assert.equal(catalog.gates.every((gate) => !gate.valid), true)
})

test("behält ein Tor mit ungültiger Farbe als geschlossene Barriere im Katalog", () => {
  const catalog = buildPuzzleCatalog(
    parseCoursePuzzleDeclarations(
      markdown(
        "# Start",
        "@Puzzleteil(rot; 1)",
        "@Puzzletor(pink; [[1]])",
        "# Dahinter",
      ),
    ),
  )

  assert.equal(catalog.gates.length, 1)
  assert.equal(catalog.gates[0].color, null)
  assert.equal(catalog.gates[0].valid, false)
  assert.equal(catalog.gates[0].onlyOnSlide, false)
  assert.deepEqual(validPuzzleGateConfigurations(catalog), [])
  assert.match(catalog.errors.join(" "), /Puzzletor auf Folie 1/u)
})

test("katalogisiert auch nackte Puzzle-Makros für fail-closed Diagnosen", () => {
  const discovery = parseCoursePuzzleDeclarations(
    markdown("# Start", "@Puzzleteil", "@Puzzletor", "# Dahinter"),
  )
  const catalog = buildPuzzleCatalog(discovery)

  assert.equal(discovery.pieces.length, 1)
  assert.equal(discovery.pieces[0].options, "")
  assert.equal(discovery.gates.length, 1)
  assert.equal(discovery.gates[0].options, "")
  assert.equal(catalog.gates.length, 1)
  assert.equal(catalog.gates[0].valid, false)
  assert.equal(catalog.gates[0].color, null)
})

test("bindet die Signatur an Puzzleordnung und Sections, nicht an fremde Textzeilen", () => {
  const compact = buildPuzzleCatalog(
    parseCoursePuzzleDeclarations(
      markdown(
        "# Start",
        "@Puzzleteil(rot; 1)",
        "@Puzzletor(rot; [[1]])",
      ),
    ),
  )
  const withProse = buildPuzzleCatalog(
    parseCoursePuzzleDeclarations(
      markdown(
        "# Start",
        "Zusätzlicher Text.",
        "",
        "@Puzzleteil(rot; 1)",
        "Noch mehr Text.",
        "@Puzzletor(rot; [[1]])",
      ),
    ),
  )
  const reordered = buildPuzzleCatalog(
    parseCoursePuzzleDeclarations(
      markdown(
        "# Start",
        "@Puzzletor(rot; [[1]])",
        "@Puzzleteil(rot; 1)",
      ),
    ),
  )

  assert.equal(withProse.signature, compact.signature)
  assert.notEqual(reordered.signature, compact.signature)
})
