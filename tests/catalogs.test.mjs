import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  parseCourseAchievementsDeclaration,
  parseCourseChestCatalogDeclarations,
  parseCourseChestDeclarations,
  parseCourseLockCatalogDeclarations,
  parseCourseLockDeclarations,
  parseCourseResourceDeclaration,
  parseCourseSecretSlideDeclarations,
} from "../src/course-chests.ts"
import { requestedKeyColor } from "../src/key-colors.ts"

const previousHTMLElement = globalThis.HTMLElement
globalThis.HTMLElement ??= class {}
const [
  { courseLockUnitCount },
  { courseChestUnitCount, courseChestUnitCounts },
] = await Promise.all([
  import("../src/object-lock.ts"),
  import("../src/treasure-chest.ts"),
])
if (previousHTMLElement === undefined) delete globalThis.HTMLElement
else globalThis.HTMLElement = previousHTMLElement

function visibleMarkdownLines(markdown) {
  const visible = []
  let fence = null
  for (const line of markdown.split(/\r?\n/u)) {
    const marker = /^ {0,3}(`{3,}|~{3,})/u.exec(line)?.[1]
    if (fence) {
      if (
        marker &&
        marker[0] === fence[0] &&
        marker.length >= fence.length
      ) {
        fence = null
      }
      continue
    }
    if (marker) {
      fence = marker
      continue
    }
    visible.push(line)
  }
  return visible
}

function visiblePortalCalls(markdown) {
  const calls = []
  let section = -1
  for (const line of visibleMarkdownLines(markdown)) {
    if (/^ {0,3}#{1,6}(?:\s+|$)/u.test(line)) section += 1
    const match = /^@(Portal|Einwegportal|Einbahnportal)\((\d+)/u.exec(line)
    if (match) {
      calls.push({
        macro: match[1],
        section,
        target: Number(match[2]),
      })
    }
  }
  return calls
}

test("zählt jede unabhängig sammelbare Truhe genau einmal", () => {
  const declarations = parseCourseChestDeclarations(`
@Schatztruhe
@Diamanttruhe(anker; 12s)
@Energiekiste(toc; menu; toc)
@Schatztruhe(unbekannt)
`)

  assert.equal(courseChestUnitCount(declarations), 4)
  assert.deepEqual(courseChestUnitCounts(declarations), {
    gold: 1,
    diamonds: 1,
    energy: 2,
  })
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

test("zählt jedes Portalschloss einzeln und ignoriert Beispiele sowie Kommentare", () => {
  const declarations = parseCourseLockDeclarations(`
# Abschnitt A

@Portal(2)
@Schloss(portal, rot)
@Portal(2)
@Schloss(portal, rot)

\`\`\`markdown
@Schloss(portal, rot)
\`\`\`

<!-- @Schloss(portal, rot) -->

# Abschnitt B

@Einwegportal(1)
@Schloss(folienportal, rot)
`)

  assert.deepEqual(
    declarations.map(({ section, target }) => ({ section, target })),
    [
      { section: 0, target: "portal" },
      { section: 0, target: "portal" },
      { section: 1, target: "folienportal" },
    ],
  )
  assert.equal(courseLockUnitCount(declarations), 3)
})

test("zählt globale Schlösser kursweit und anker-Schlösser je Folie", () => {
  const declarations = parseCourseLockDeclarations(`
# Abschnitt A
@Schloss(boardmode, rot)
@Schloss(boardmodefontbutton, rot; anker)
@Schloss(boardmode, rot; anker)

# Abschnitt B
@Schloss(boardmode, rot)
@Schloss(boardmodefontbutton, rot; anker)
`)

  assert.equal(courseLockUnitCount(declarations), 3)
})

test("dedupliziert Template-Schlösser gemäß Scope und Importverfügbarkeit", () => {
  const declarations = parseCourseLockDeclarations(`
# Abschnitt A

@Schloss(boardmode, rot)
@Schloss(boardmode, rot)
@Schloss(dynflex, blau)
@Schloss(dynflex, blau)
@Schloss(markerquiz, gruen)

# Abschnitt B

@Schloss(boardmode, rot)
@Schloss(dynflex, blau)
@Schloss(markerquiz, gruen)
@Schloss(timer, gelb)
`)

  assert.equal(courseLockUnitCount(declarations), 6)

  const checkedTargets = []
  assert.equal(
    courseLockUnitCount(declarations, (target) => {
      checkedTargets.push(target)
      return target === "boardmode" || target === "markerquiz"
    }),
    3,
  )
  assert.deepEqual([...new Set(checkedTargets)], [
    "boardmode",
    "dynflex",
    "markerquiz",
    "timer",
  ])
})

test("hält fremdabhängige README-Beispiele aus dem Livekatalog heraus", () => {
  const markdown = readFileSync(
    new URL("../README.md", import.meta.url),
    "utf8",
  )
  const publicChests = parseCourseChestDeclarations(markdown)
  const publicLocks = parseCourseLockDeclarations(markdown)
  const chestCatalog = parseCourseChestCatalogDeclarations(markdown)
  const lockCatalog = parseCourseLockCatalogDeclarations(markdown)

  assert.equal(courseChestUnitCount(publicChests), 19)
  assert.equal(courseChestUnitCount(chestCatalog), 19)
  assert.equal(courseLockUnitCount(publicLocks), 2)
  assert.equal(courseLockUnitCount(lockCatalog), 2)

  const portalCalls = visiblePortalCalls(markdown)
  const slideCount = visibleMarkdownLines(markdown).filter((line) =>
    /^ {0,3}#{1,6}(?:\s+|$)/u.test(line)
  ).length
  assert.deepEqual(portalCalls, [
    { macro: "Portal", section: 9, target: 11 },
    { macro: "Einwegportal", section: 9, target: 8 },
  ])
  assert.ok(
    portalCalls.every(
      ({ section, target }) =>
        target >= 1 && target <= slideCount && target !== section + 1,
    ),
  )
  assert.match(
    markdown,
    /^@Portal\(11\)\r?\n@Schloss\(portal, blau\)$/mu,
  )
})

test("hält den Escape-Room als lösbaren anspruchsvollen Ressourcen-Parcours", () => {
  const markdown = readFileSync(
    new URL("../EscapeRoom.md", import.meta.url),
    "utf8",
  )
  const chests = parseCourseChestDeclarations(markdown)
  const locks = parseCourseLockDeclarations(markdown)
  const resource = parseCourseResourceDeclaration(markdown)
  const visibleLines = visibleMarkdownLines(markdown)
  const quizAnswers = visibleLines
    .map((line) => /^\[\[([^?].*)\]\]$/u.exec(line)?.[1] ?? null)
    .filter((answer) => answer !== null)
  const keyColors = visibleLines
    .map((line) =>
      requestedKeyColor(
        /^@Schluessel\((rot|blau|gruen|gelb|lila|orange)(?:;|\))/u.exec(
          line,
        )?.[1],
      ),
    )
    .filter((color) => color !== null)

  assert.match(markdown, /^import:\s+\.\/README\.md\s*$/mu)
  assert.doesNotMatch(markdown, /^\s*@archievments\s*$/gimu)
  assert.equal(parseCourseAchievementsDeclaration(markdown), true)
  assert.deepEqual(resource, {
    gold: 2,
    diamonds: 1,
    energy: 3,
    section: 0,
  })
  assert.match(markdown, /^@Highscore\(100, 6, 3, 45, 1\)$/mu)

  assert.equal(courseChestUnitCount(chests), 13)
  assert.deepEqual(courseChestUnitCounts(chests), {
    gold: 4,
    diamonds: 2,
    energy: 7,
  })
  assert.deepEqual(
    Object.fromEntries(
      ["gold", "diamonds", "energy"].map((reward) => [
        reward,
        courseChestUnitCount(
          chests.filter((declaration) => declaration.reward === reward),
        ),
      ]),
    ),
    { gold: 4, diamonds: 2, energy: 7 },
  )
  const plannedChecksBySection = [1, 1, 1, 0, 1, 1, 1, 1, 2, 1]
  let energyBalance = resource.energy
  for (const [section, checks] of plannedChecksBySection.entries()) {
    energyBalance += courseChestUnitCount(
      chests.filter(
        (declaration) =>
          declaration.reward === "energy" && declaration.section === section,
      ),
    )
    energyBalance -= checks
    assert.ok(
      energyBalance >= 0,
      `Energiedefizit auf Folie ${section + 1}`,
    )
  }
  assert.equal(energyBalance, 0)
  assert.equal(resource.energy + 7, quizAnswers.length - 1)
  assert.equal(resource.diamonds + 2, 3)
  assert.equal(
    visibleLines.filter((line) => /^\[\[\?\]\]/u.test(line)).length,
    quizAnswers.length,
  )
  assert.ok(resource.gold + 4 < quizAnswers.length)
  assert.match(
    markdown,
    /Quarantänekonsole[\s\S]*?genau einen Diamanten[\s\S]*?klicke nicht auf Prüfen/u,
  )
  assert.deepEqual(quizAnswers, [
    "48",
    "3",
    "45",
    "7",
    "B-D-A-C",
    "18",
    "6",
    "NORD",
    "16",
    "58",
    "11-16-07-24",
  ])

  assert.equal(courseLockUnitCount(locks), 16)
  assert.equal(keyColors.length, 16)
  assert.deepEqual(
    [...keyColors].sort(),
    locks.map(({ color }) => color).sort(),
  )
  assert.match(markdown, /^@Lupe\(anker; 1s\)$/mu)
  assert.match(markdown, /^@Schatztruhe\(zauberstaub\)$/mu)
  assert.match(markdown, /^@Diamanttruhe\(unsichtbar; anker\)$/mu)
  assert.match(markdown, /^@Schluessel\(blau; unsichtbar\)$/mu)
  assert.match(
    markdown,
    /^@Unsichtbar\(Der Südwert lautet R minus P\.\)$/mu,
  )

  const portalCalls = visiblePortalCalls(markdown)
  const slideCount = visibleLines.filter((line) =>
    /^ {0,3}#{1,6}(?:\s+|$)/u.test(line),
  ).length
  assert.equal(slideCount, 10)
  assert.deepEqual(portalCalls, [
    { macro: "Portal", section: 4, target: 6 },
    { macro: "Einwegportal", section: 4, target: 7 },
    { macro: "Einwegportal", section: 6, target: 8 },
  ])
  assert.ok(
    portalCalls.every(
      ({ section, target }) =>
        target >= 1 && target <= slideCount && target !== section + 1,
    ),
  )
  assert.match(
    markdown,
    /^@Portal\(6\)\r?\n@Schloss\(portal, lila\)$/mu,
  )
  assert.match(
    markdown,
    /^@Einwegportal\(7\)\r?\n@Schloss\(portal, orange\)$/mu,
  )
  assert.match(
    markdown,
    /^@Einwegportal\(8\)\r?\n@Schloss\(portal, rot\)$/mu,
  )
  assert.deepEqual(
    locks.map(({ target }) => target),
    [
      "seitenwechsel",
      "toc",
      "menu",
      "info",
      "classroom",
      "check",
      "check",
      "hint",
      "resolve",
      "portal",
      "portal",
      "check",
      "seitenwechsel",
      "portal",
      "check",
      "check",
    ],
  )
  assert.deepEqual(
    locks
      .filter(({ target }) => target === "seitenwechsel")
      .map(({ section, color, onlyOnSlide }) => ({
        section,
        color,
        onlyOnSlide,
      })),
    [
      { section: 0, color: "orange", onlyOnSlide: false },
      { section: 6, color: "yellow", onlyOnSlide: true },
    ],
  )
  assert.deepEqual(parseCourseSecretSlideDeclarations(markdown), [{ section: 7 }])
  assert.match(
    markdown,
    /## Ausgang – Das Siegel der Nullschicht[\s\S]*\[\[11-16-07-24\]\][\s\S]*@Schloss\(check, rot\)\s*$/u,
  )
  assert.doesNotMatch(markdown, /bewusst leicht lösbar/iu)
})
