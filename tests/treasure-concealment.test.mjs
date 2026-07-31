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

test("parst vollständig unsichtbare und staubverdeckte Inline-Truhen", () => {
  assert.deepEqual(parseTreasureChestOptions("unsichtbar"), {
    concealment: "solid",
    errors: [],
    inline: true,
    placements: [],
    valid: true,
    visibility: { delayMs: 0, onlyOnSlide: false },
  })
  assert.deepEqual(parseTreasureChestOptions("zauberstaub; anker; 12s"), {
    concealment: "dust",
    errors: [],
    inline: true,
    placements: [],
    valid: true,
    visibility: { delayMs: 12_000, onlyOnSlide: true },
  })
})

test("kombiniert Verbergung mit Zeit, Anker und mehreren Portalzielen", () => {
  assert.deepEqual(
    parseTreasureChestOptions(
      "toc; mode; zauberstaub; anker; 1.5 Minuten",
    ),
    {
      concealment: "dust",
      errors: [],
      inline: false,
      placements: ["toc", "mode"],
      valid: true,
      visibility: { delayMs: 90_000, onlyOnSlide: true },
    },
  )
})

test("parst alle zwölf Template-Ziele als unabhängige Portalplätze", () => {
  const parsed = parseTreasureChestOptions(TEMPLATE_TARGETS.join("; "))

  assert.deepEqual(parsed, {
    concealment: null,
    errors: [],
    inline: false,
    placements: [...TEMPLATE_TARGETS],
    valid: true,
    visibility: { delayMs: 0, onlyOnSlide: false },
  })
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
@Schatztruhe(unsichtbar)
@Diamanttruhe(zauberstaub; anker; 2s)
@Energiekiste(toc; menu; unsichtbar; 10s)
@Schatztruhe(unsichtbar; zauberstaub)
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
    /wrapper\.append\(\s*createChestButton[\s\S]*?setHostConcealment\(wrapper, request\.concealment\)/u,
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
