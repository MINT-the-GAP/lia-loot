import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { parseCourseChestDeclarations } from "../src/course-chests.ts"
import { TEMPLATE_TARGETS } from "../src/template-targets.ts"

const previousHTMLElement = globalThis.HTMLElement
globalThis.HTMLElement ??= class {}
const {
  courseChestUnitCount,
  parseTreasureChestOptions,
  templatePortalGeometry,
} = await import("../src/treasure-chest.ts")
if (previousHTMLElement === undefined) delete globalThis.HTMLElement
else globalThis.HTMLElement = previousHTMLElement

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

test("parst vollständig unsichtbare und staubverdeckte Inline-Truhen", () => {
  assert.deepEqual(parseTreasureChestOptions("unsichtbar"), {
    amount: 1,
    concealment: "solid",
    errors: [],
    inline: true,
    layers: [],
    placements: [],
    valid: true,
    visibility: visibility(),
  })
  assert.deepEqual(parseTreasureChestOptions("zauberstaub; anker; 12s"), {
    amount: 1,
    concealment: "dust",
    errors: [],
    inline: true,
    layers: [],
    placements: [],
    valid: true,
    visibility: visibility({ delayMs: 12_000, onlyOnSlide: true }),
  })
})

test("parst eine positive Ganzzahl am Anfang als Belohnungsmenge", () => {
  assert.equal(parseTreasureChestOptions("").amount, 1)
  assert.equal(parseTreasureChestOptions("").inline, true)
  assert.deepEqual(parseTreasureChestOptions("3"), {
    amount: 3,
    concealment: null,
    errors: [],
    inline: true,
    layers: [],
    placements: [],
    valid: true,
    visibility: visibility(),
  })
  assert.deepEqual(
    parseTreasureChestOptions("3; menu; anker; 1.5 Minuten"),
    {
      amount: 3,
      concealment: null,
      errors: [],
      inline: false,
      layers: [],
      placements: ["menu"],
      valid: true,
      visibility: visibility({ delayMs: 90_000, onlyOnSlide: true }),
    },
  )
  assert.equal(parseTreasureChestOptions("3s").amount, 1)
  assert.equal(parseTreasureChestOptions("3s").visibility.delayMs, 3_000)
})

test("trennt Annotation-Portal und gemeinsame Sichtbarkeitsoptionen", () => {
  assert.deepEqual(
    parseTreasureChestOptions(
      "2; annotation; theme-blau; lightmode; ohne-annotation; anker; 2s",
    ),
    {
      amount: 2,
      concealment: null,
      errors: [],
      inline: false,
      layers: [],
      placements: ["annotation"],
      valid: true,
      visibility: visibility({
        delayMs: 2_000,
        onlyOnSlide: true,
        onlyWithoutAnnotations: true,
        themes: ["blue"],
        variants: ["light"],
      }),
    },
  )
})

test("weist ungültige, doppelte und nachgestellte Mengen fail-closed zurück", () => {
  for (const specification of [
    "0",
    "-1",
    "1.5",
    "1,5",
    "1e3",
    "menu; 3",
    "3; 4; menu",
    "9007199254740992",
  ]) {
    const parsed = parseTreasureChestOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})

test("kombiniert Verbergung mit Zeit, Anker und mehreren Portalzielen", () => {
  assert.deepEqual(
    parseTreasureChestOptions(
      "toc; mode; zauberstaub; anker; 1.5 Minuten",
    ),
    {
      amount: 1,
      concealment: "dust",
      errors: [],
      inline: false,
      layers: [],
      placements: ["toc", "mode"],
      valid: true,
      visibility: visibility({ delayMs: 90_000, onlyOnSlide: true }),
    },
  )
})

test("parst alle zwölf Template-Ziele als unabhängige Portalplätze", () => {
  const parsed = parseTreasureChestOptions(TEMPLATE_TARGETS.join("; "))

  assert.deepEqual(parsed, {
    amount: 1,
    concealment: null,
    errors: [],
    inline: false,
    layers: [],
    placements: [...TEMPLATE_TARGETS],
    valid: true,
    visibility: visibility(),
  })
})

test("bewahrt Erde und Pflanze in Optionsreihenfolge vor dem Enditem", () => {
  assert.deepEqual(
    parseTreasureChestOptions(
      "3; translator; erde-unsichtbar; pflanze; anker; 12s; zauberstaub",
    ),
    {
      amount: 3,
      concealment: "dust",
      errors: [],
      inline: false,
      layers: [
        { kind: "soil", concealment: "solid" },
        { kind: "plant", concealment: null },
      ],
      placements: ["translator"],
      valid: true,
      visibility: visibility({ delayMs: 12_000, onlyOnSlide: true }),
    },
  )

  const nestedInline = parseTreasureChestOptions("erde; blume-zauberstaub")
  assert.equal(nestedInline.inline, true)
  assert.deepEqual(nestedInline.layers, [
    { kind: "soil", concealment: null },
    { kind: "plant", concealment: "dust" },
  ])
})

test("weist doppelte und widersprüchliche Verbergungsoptionen fail-closed zurück", () => {
  for (const specification of [
    "unsichtbar; solid",
    "unsichtbar; zauberstaub",
    "dust; zauberstaub; toc",
  ]) {
    const parsed = parseTreasureChestOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})

test("zählt alle drei verborgenen Truhentypen mit ihren Portalinstanzen", () => {
  const declarations = parseCourseChestDeclarations(`
@Schatztruhe(3; unsichtbar)
@Diamanttruhe(4; zauberstaub; anker; 2s)
@Energiekiste(5; toc; menu; unsichtbar; 10s)
@Schatztruhe(unsichtbar; zauberstaub)
@Energiekiste(0)
`)

  assert.equal(courseChestUnitCount(declarations), 4)
})

test("filtert Portalplätze optional über ihre aktuelle Verfügbarkeit", () => {
  const declarations = parseCourseChestDeclarations(`
@Schatztruhe(dynflex; timer; toc)
@Diamanttruhe(boardmode; marker; info)
@Energiekiste(coordinate; freeze)
@Schatztruhe
`)

  assert.equal(courseChestUnitCount(declarations), 9)

  const checkedTargets = []
  const availableTargets = new Set([
    "toc",
    "timer",
    "marker",
    "coordinate",
  ])
  assert.equal(
    courseChestUnitCount(declarations, (target) => {
      checkedTargets.push(target)
      return availableTargets.has(target)
    }),
    6,
  )
  assert.deepEqual(checkedTargets, [
    "dynflex",
    "timer",
    "boardmode",
    "marker",
    "coordinate",
    "freeze",
  ])
})

test("positioniert die Annotation-Truhe mit Abstand unterhalb der Toolbar", () => {
  const toolbar = {
    bottom: 390,
    left: 12,
    right: 56,
    top: 100,
    width: 44,
  }
  const below = templatePortalGeometry(toolbar, 800, 600, "below")

  assert.deepEqual(below, {
    height: 40,
    left: 12,
    top: 398,
    width: 44,
  })
  assert.ok(below.top >= toolbar.bottom + 8)

  const overlay = templatePortalGeometry(toolbar, 800, 600, "overlay")
  assert.ok(overlay.top < toolbar.bottom)
})

test("propagiert Portalmodi und räumt unsichtbare Inline-Hosts vollständig auf", () => {
  const source = readFileSync(
    new URL("../src/treasure-chest.ts", import.meta.url),
    "utf8",
  )

  assert.match(
    source,
    /const contentHost = setHostRevealLayers\(wrapper, chestId, request\.layers\)[\s\S]*?contentHost\.replaceChildren\(\s*createChestButton[\s\S]*?setHostConcealment\(contentHost, request\.concealment\)/u,
  )
  assert.match(
    source,
    /if \(unavailable\)[\s\S]*?setHostConcealment\(host, null\)[\s\S]*?host\.replaceChildren/u,
  )
  assert.match(
    source,
    /if \(!visible && !opening\)[\s\S]*?setHostConcealment\(host, null\)/u,
  )
  assert.match(
    source,
    /if \(!request\.valid\)[\s\S]*?setHostConcealment\(host, null\)/u,
  )
})
