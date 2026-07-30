import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  parseCourseAchievementsDeclaration,
  parseCourseChestDeclarations,
  parseCourseLockDeclarations,
  parseCourseResourceDeclaration,
  parseCourseSecretSlideDeclarations,
} from "../src/course-chests.ts"

const previousHTMLElement = globalThis.HTMLElement
globalThis.HTMLElement ??= class {}
const [{ courseLockUnitCount }, { courseChestUnitCount }] = await Promise.all([
  import("../src/object-lock.ts"),
  import("../src/treasure-chest.ts"),
])
if (previousHTMLElement === undefined) delete globalThis.HTMLElement
else globalThis.HTMLElement = previousHTMLElement

test("zählt jede unabhängig sammelbare Truhe genau einmal", () => {
  const declarations = parseCourseChestDeclarations(`
@Schatztruhe
@Diamanttruhe(anker; 12s)
@Energiekiste(toc; menu; toc)
@Schatztruhe(unbekannt)
`)

  assert.equal(courseChestUnitCount(declarations), 4)
})

test("dedupliziert globale Schlösser und zählt lokale Makros einzeln", () => {
  const declarations = parseCourseLockDeclarations(`
@Schloss(info, gruen)
@Schloss(info, gruen)
@Schloss(info, blau)
@Schloss(check, rot)
@Schloss(check, rot)
@Schloss(unbekannt, gelb)
`)

  assert.equal(courseLockUnitCount(declarations), 4)
})

test("hält den Escape-Room als vollständigen Import- und Feature-Testkurs", () => {
  const markdown = readFileSync(
    new URL("../EscapeRoom.md", import.meta.url),
    "utf8",
  )
  const chests = parseCourseChestDeclarations(markdown)
  const locks = parseCourseLockDeclarations(markdown)

  assert.match(markdown, /^import:\s+\.\/README\.md\s*$/mu)
  assert.doesNotMatch(markdown, /^\s*@archievments\s*$/gimu)
  assert.equal(parseCourseAchievementsDeclaration(markdown), true)
  assert.deepEqual(parseCourseResourceDeclaration(markdown), {
    gold: 4,
    diamonds: 2,
    energy: 8,
    section: 0,
  })
  assert.equal(courseChestUnitCount(chests), 16)
  assert.equal(courseLockUnitCount(locks), 10)
  assert.deepEqual(
    locks.map(({ target }) => target),
    [
      "seitenwechsel",
      "toc",
      "mode",
      "menu",
      "translator",
      "classroom",
      "info",
      "check",
      "resolve",
      "hint",
    ],
  )
  assert.deepEqual(parseCourseSecretSlideDeclarations(markdown), [{ section: 6 }])
  assert.match(markdown, /## Ausgang – Das letzte Zahlenschloss[\s\S]*\[\[ESCAPE\]\]\s*$/u)
})
