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
} from "../src/course-chests.ts"
import { requestedKeyColor } from "../src/key-colors.ts"
import { resolveLockTarget } from "../src/lock-targets.ts"
import {
  isTemplateTarget,
  TEMPLATE_TARGETS,
} from "../src/template-targets.ts"

const previousHTMLElement = globalThis.HTMLElement
globalThis.HTMLElement ??= class {}
const [{ courseLockUnitCount }, {
  courseChestUnitCount,
  parseTreasureChestOptions,
}] = await Promise.all([
  import("../src/object-lock.ts"),
  import("../src/treasure-chest.ts"),
])
if (previousHTMLElement === undefined) delete globalThis.HTMLElement
else globalThis.HTMLElement = previousHTMLElement

const markdown = readFileSync(
  new URL("../StressTest.md", import.meta.url),
  "utf8",
)
const chests = parseCourseChestDeclarations(markdown)
const locks = parseCourseLockDeclarations(markdown)

function countBy(values) {
  const counts = {}
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1
  return counts
}

function keyColorsBySection(source) {
  const colors = new Map()
  let section = -1
  let fence = null
  let inComment = false

  for (const line of source.split(/\r?\n/u)) {
    if (inComment) {
      if (line.includes("-->")) inComment = false
      continue
    }
    if (line.includes("<!--") && !line.includes("-->")) {
      inComment = true
      continue
    }
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/u.exec(line)
    if (fenceMatch) {
      if (!fence) fence = [fenceMatch[1][0], fenceMatch[1].length]
      else if (
        fence[0] === fenceMatch[1][0] &&
        fenceMatch[1].length >= fence[1]
      ) {
        fence = null
      }
      continue
    }
    if (fence) continue
    if (/^ {0,3}#{1,6}(?:\s+|$)/u.test(line)) section += 1

    const match = /^\s*@Schluessel\s*\(\s*([^;()\r\n]+).*\)\s*$/u.exec(line)
    if (!match) continue
    const color = requestedKeyColor(match[1])
    assert.ok(color, "Jeder Stresskurs-Schlüssel braucht eine gültige Farbe")
    const sectionColors = colors.get(section) ?? []
    sectionColors.push(color)
    colors.set(section, sectionColors)
  }
  return colors
}

test("hält jeden externen Demoimport im Stresstest genau einmal", () => {
  const importLines = (source) => {
    const frontmatter = /^<!--([\s\S]*?)-->/u.exec(source)?.[1] ?? ""
    return [...frontmatter.matchAll(/^import:\s+(\S+)\s*$/gmu)].map(
      (match) => match[1],
    )
  }
  const imports = importLines(markdown)
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8")
  const smoke = readFileSync(
    new URL("../TemplateTargets.md", import.meta.url),
    "utf8",
  )
  const externalImports = imports.filter((url) => url.startsWith("https://"))

  assert.deepEqual(importLines(readme), [])
  assert.equal(imports.length, 13)
  assert.equal(new Set(imports).size, imports.length)
  assert.equal(externalImports.length, 12)
  assert.equal(imports.at(-1), "./README.md")
  assert.deepEqual(imports, importLines(smoke))
  assert.equal(parseCourseAchievementsDeclaration(markdown), true)
  assert.deepEqual(parseCourseResourceDeclaration(markdown), {
    gold: 8,
    diamonds: 8,
    energy: 40,
    section: 0,
  })
  assert.match(markdown, /^@Highscore\(100, 5, 2, 60, 0\)$/mu)
  assert.doesNotMatch(markdown, /^@Loot(?:Truhe|Schloss|Schluessel)_/mu)

  const headings = [...markdown.matchAll(/^(#{1,6})\s+(.+)$/gmu)]
  assert.equal(headings.length, 9)
  assert.deepEqual(
    headings.map((match) => match[1]),
    ["#", "##", "##", "##", "##", "##", "##", "##", "##"],
  )
  assert.equal(new Set(headings.map((match) => match[2])).size, 9)
})

test("katalogisiert 26 Truhen-Einheiten aus zwölf echten Aufrufen", () => {
  assert.equal(chests.length, 12)
  assert.equal(parseCourseChestCatalogDeclarations(markdown).length, 12)
  assert.equal(courseChestUnitCount(chests), 26)
  assert.equal(
    courseChestUnitCount(parseCourseChestCatalogDeclarations(markdown)),
    26,
  )

  assert.deepEqual(
    countBy(
      chests.flatMap((declaration) => {
        const units = courseChestUnitCount([declaration])
        return Array.from({ length: units }, () => declaration.reward)
      }),
    ),
    { diamonds: 13, gold: 10, energy: 3 },
  )

  const unitsBySection = Array.from({ length: 9 }, (_, section) =>
    courseChestUnitCount(
      chests.filter((declaration) => declaration.section === section),
    ),
  )
  assert.deepEqual(unitsBySection, [7, 3, 1, 2, 1, 5, 3, 1, 3])

  const parsed = chests.map((declaration) =>
    parseTreasureChestOptions(declaration.placement),
  )
  assert.equal(parsed.filter(({ inline }) => inline).length, 5)
  const placements = parsed.flatMap(({ placements }) => placements)
  assert.equal(placements.filter(isTemplateTarget).length, 13)
  assert.equal(
    placements.filter((placement) => !isTemplateTarget(placement)).length,
    8,
  )
  assert.equal(
    placements.filter((placement) => placement === "dynflex").length,
    2,
  )
  assert.ok(parsed.every(({ valid }) => valid))
})

test("hält für 23 Schloss-Units exakt 23 erreichbare Farbschlüssel bereit", () => {
  assert.equal(locks.length, 23)
  assert.equal(parseCourseLockCatalogDeclarations(markdown).length, 23)
  assert.equal(courseLockUnitCount(locks), 23)
  assert.equal(
    courseLockUnitCount(parseCourseLockCatalogDeclarations(markdown)),
    23,
  )

  const unitsBySection = Array.from({ length: 9 }, (_, section) =>
    courseLockUnitCount(
      locks.filter((declaration) => declaration.section === section),
    ),
  )
  assert.deepEqual(unitsBySection, [8, 0, 5, 2, 1, 3, 3, 1, 0])

  const keysBySection = keyColorsBySection(markdown)
  const allKeys = [...keysBySection.values()].flat()
  assert.equal(allKeys.length, 23)
  assert.deepEqual(countBy(allKeys), {
    orange: 3,
    green: 4,
    red: 6,
    blue: 3,
    yellow: 4,
    purple: 3,
  })
  assert.deepEqual(countBy(locks.map(({ color }) => color)), countBy(allKeys))

  for (let section = 0; section < 9; section += 1) {
    const sectionLocks = locks
      .filter((declaration) => declaration.section === section)
      .map(({ color }) => color)
    assert.deepEqual(
      countBy(keysBySection.get(section) ?? []),
      countBy(sectionLocks),
      `Schlüsselbudget auf Folie ${section + 1}`,
    )
  }

  assert.ok(locks.slice(0, 8).every(({ section }) => section === 0))
  assert.ok(locks.slice(0, 8).every(({ onlyOnSlide }) => !onlyOnSlide))
  const firstLock = markdown.indexOf("@Schloss(seitenwechsel, orange)")
  for (const color of ["orange", "gruen", "rot", "blau", "gelb"]) {
    assert.ok(markdown.indexOf(`@Schluessel(${color})`) < firstLock)
  }
})

test("deckt alle Template-Ziele als kombinierte Truhe und Schloss ab", () => {
  const chestTargets = new Set(
    chests.flatMap(({ placement }) =>
      parseTreasureChestOptions(placement).placements.filter(isTemplateTarget),
    ),
  )
  const lockTargets = new Set(
    locks
      .map(({ target }) => resolveLockTarget(target))
      .filter((target) => target && isTemplateTarget(target)),
  )

  assert.deepEqual([...chestTargets].sort(), [...TEMPLATE_TARGETS].sort())
  assert.deepEqual([...lockTargets].sort(), [...TEMPLATE_TARGETS].sort())

  for (const target of TEMPLATE_TARGETS) {
    assert.ok(chestTargets.has(target), `Truhe für ${target}`)
    assert.ok(lockTargets.has(target), `Schloss für ${target}`)
  }
})

test("bewahrt Mehrfach-, Verschachtelungs- und Zustandsfälle im Kurs", () => {
  assert.match(
    markdown,
    /## Zwei Quizze und fünf lokale Aktionsschlösser[\s\S]*?@Schloss\(check, rot\)\s*@Schloss\(resolve, blau\)\s*@Schloss\(hint, gelb\)[\s\S]*?@Schloss\(check, rot\)\s*@Schloss\(hint, lila\)/u,
  )
  assert.match(
    markdown,
    /<section class="dynFlex">[\s\S]*?<div class="markerquiz">[\s\S]*?@TextmarkerQuiz[\s\S]*?@Unsichtbar\(Das geheime Wort im verschachtelten Container lautet NESTED\.\)[\s\S]*?<\/section>/u,
  )
  assert.equal(
    [...markdown.matchAll(/^<section class="dynFlex">$/gmu)].length,
    3,
  )
  assert.match(
    markdown,
    /<details>[\s\S]*?<section class="dynFlex">[\s\S]*?<\/details>\s*<section class="dynFlex">[\s\S]*?@Energiekiste\(dynflex; anker\)/u,
  )
  assert.match(
    markdown,
    /^@Diamanttruhe\(toc; menu; timer; canvasocr; coordinate; anker; 1\.5s\)$/mu,
  )
  assert.match(
    markdown,
    /@Schatztruhe\(kachel; llm; freeze; anker\)[\s\S]*?@Schloss\(kachel, orange\)[\s\S]*?@Schloss\(llm, lila\)[\s\S]*?@Schloss\(freeze, gelb\)/u,
  )
  assert.doesNotMatch(
    markdown,
    /^\s*@(?:Schloss|Schatztruhe|Diamanttruhe|Energiekiste)\([^\r\n]*(?:orthography|mathe|algebrite|jsxgraph|resetter)/gimu,
  )
})
