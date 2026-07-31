import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  discoverCourseLockDeclarations,
  discoverCourseResourceDeclaration,
  discoverCourseSecretSlideDeclarations,
  parseCourseAchievementsDeclaration,
  parseCourseChestCatalogDeclarations,
  parseCourseChestDeclarations,
  parseCourseLockCatalogDeclarations,
  parseCourseLockDeclarations,
  parseCourseResourceDeclaration,
  parseCourseSecretSlideDeclarations,
} from "../src/course-chests.ts"

test("katalogisiert interne Live-Demos ohne sie als Source-Aufrufe zu aktivieren", () => {
  const markdown = [
    "<!--",
    "@LootSchloss_(@uid,annotation,orange)",
    "@LootTruhe_(@uid,boardmode; anker,energy)",
    "-->",
    "",
    "```markdown",
    "@LootSchloss_(@uid,timer,blau)",
    "@LootTruhe_(@uid,timer,diamonds)",
    "```",
    "",
    "# Live",
    "@Schloss(info, gruen)",
    "@LootSchloss_(@uid,boardmodefontbutton,orange)",
    "@Schatztruhe",
    "@LootTruhe_(@uid,annotation; anker,energy)",
  ].join("\n")

  assert.deepEqual(
    parseCourseLockDeclarations(markdown).map(({ target }) => target),
    ["info"],
  )
  assert.deepEqual(
    parseCourseLockCatalogDeclarations(markdown).map(({ target }) => target),
    ["info", "boardmodefontbutton"],
  )
  assert.deepEqual(
    parseCourseChestDeclarations(markdown).map(({ placement, reward }) => ({
      placement,
      reward,
    })),
    [{ placement: "", reward: "gold" }],
  )
  assert.deepEqual(
    parseCourseChestCatalogDeclarations(markdown).map(
      ({ placement, reward }) => ({ placement, reward }),
    ),
    [
      { placement: "", reward: "gold" },
      { placement: "annotation; anker", reward: "energy" },
    ],
  )
})

test("findet Portal- und Inline-Kistentypen im Kursquelltext", () => {
  const declarations = parseCourseChestDeclarations(`
# Start
@Schatztruhe(toc; menu)
@Diamanttruhe(translator; mode)
@Energiekiste(info; classroom)
@Schatztruhe
`)

  assert.deepEqual(
    declarations.map(({ placement, reward, section }) => ({
      placement,
      reward,
      section,
    })),
    [
      { placement: "toc; menu", reward: "gold", section: 0 },
      { placement: "translator; mode", reward: "diamonds", section: 0 },
      { placement: "info; classroom", reward: "energy", section: 0 },
      { placement: "", reward: "gold", section: 0 },
    ],
  )
  assert.equal(new Set(declarations.map(({ baseId }) => baseId)).size, 4)
})

test("bewahrt Sichtbarkeitsoptionen für Portaltruhen und alte IDs unverändert", () => {
  const [legacy, delayed] = parseCourseChestDeclarations(`
@Schatztruhe(toc; menu)
@Diamanttruhe(mode; anker; 2min)
`)

  assert.equal(legacy.baseId, "source-gold-1gdda0j-1")
  assert.equal(legacy.placement, "toc; menu")
  assert.deepEqual(
    {
      placement: delayed.placement,
      reward: delayed.reward,
      section: delayed.section,
    },
    {
      placement: "mode; anker; 2min",
      reward: "diamonds",
      section: -1,
    },
  )
})

test("ignoriert Makrodefinitionen, Kommentare sowie Block- und Inline-Code", () => {
  const declarations = parseCourseChestDeclarations(`
<!--
@Schatztruhe: definition
@Schatztruhe(toc)
-->

\`\`\`markdown
@Diamanttruhe(mode)
\`\`\`

~~~markdown
@Energiekiste(info)
~~~

    @Schatztruhe(menu)
\`@Diamanttruhe(translator)\`
Text mit \`@Energiekiste(classroom)\`.

<script>
@Schatztruhe(classroom)
</script>

<pre>
@Diamanttruhe(info)
</pre>

@Schatztruhe(toc) <!-- echter Aufruf -->
`)

  assert.equal(declarations.length, 1)
  assert.equal(declarations[0].reward, "gold")
  assert.equal(declarations[0].placement, "toc")
})

test("vergibt für gleiche Aufrufe stabile, aber getrennte Source-IDs", () => {
  const original = parseCourseChestDeclarations(`
@Schatztruhe(toc; menu)
@Schatztruhe(toc; menu)
`)
  const withUnrelatedText = parseCourseChestDeclarations(`
# Eine neue Überschrift

@Schatztruhe(toc; menu)
@Schatztruhe(toc; menu)
`)

  assert.equal(original.length, 2)
  assert.notEqual(original[0].baseId, original[1].baseId)
  assert.deepEqual(
    original.map(({ baseId }) => baseId),
    withUnrelatedText.map(({ baseId }) => baseId),
  )
})

test("findet ein globales Schloss mit Ziel, Farbe und Folie", () => {
  const declarations = parseCourseLockDeclarations(`
# Start
Noch kein Schloss.

## Aufgabe
@Schloss(info, gruen)
`)

  assert.equal(declarations.length, 1)
  assert.deepEqual(
    {
      target: declarations[0].target,
      color: declarations[0].color,
      section: declarations[0].section,
    },
    { target: "info", color: "green", section: 1 },
  )
  assert.match(declarations[0].baseId, /^source-lock-/)
})

test("ignoriert Schloss-Beispiele in Kommentaren und Code", () => {
  const declarations = parseCourseLockDeclarations(`
<!-- @Schloss(info, gruen) -->

\`\`\`markdown
@Schloss(info, gruen)
\`\`\`

Text mit \`@Schloss(info, gruen)\`.

<template>
@Schloss(info, gruen)
</template>

<textarea>
@Schloss(info, gruen)
</textarea>

@Schloss(info, gruen)
`)

  assert.equal(declarations.length, 1)
})

test("normalisiert Schlossfarben und ignoriert ungültige Farben", () => {
  const declarations = parseCourseLockDeclarations(`
@Schloss(info, gruen)
@Schloss(info, GRÜN)
@Schloss(info, unbekannt)
@Schloss(info, auto)
`)

  assert.deepEqual(
    declarations.map(({ color }) => color),
    ["green", "green"],
  )
  assert.notEqual(declarations[0].baseId, declarations[1].baseId)
})

test("bindet globale Schlösser nur mit anker an ihre Quellfolie", () => {
  const markdown = `
# Abschnitt A
@Schloss(boardmodefontbutton, gruen)
@Schloss(textmarkerbutton, gelb; anker)
@LootSchloss_(@uid,annotationsbar,orange; anker)
@Schloss(info, rot; 12s)
@Schloss(menu, blau; ankerr)
`

  assert.deepEqual(
    parseCourseLockDeclarations(markdown).map(
      ({ target, color, onlyOnSlide, section }) => ({
        target,
        color,
        onlyOnSlide,
        section,
      }),
    ),
    [
      {
        target: "boardmodefontbutton",
        color: "green",
        onlyOnSlide: false,
        section: 0,
      },
      {
        target: "textmarkerbutton",
        color: "yellow",
        onlyOnSlide: true,
        section: 0,
      },
    ],
  )
  assert.deepEqual(
    parseCourseLockCatalogDeclarations(markdown).map(
      ({ target, color, onlyOnSlide, section }) => ({
        target,
        color,
        onlyOnSlide,
        section,
      }),
    ),
    [
      {
        target: "boardmodefontbutton",
        color: "green",
        onlyOnSlide: false,
        section: 0,
      },
      {
        target: "textmarkerbutton",
        color: "yellow",
        onlyOnSlide: true,
        section: 0,
      },
      {
        target: "annotationsbar",
        color: "orange",
        onlyOnSlide: true,
        section: 0,
      },
    ],
  )
})

test("findet die erste gültige Ressourcen-Konfiguration", () => {
  const declaration = parseCourseResourceDeclaration(`
# Start
@Ressourcen(-1, 2)
@Ressourcen(10, 3, 0)
@Ressourcen(99, 99, 99)
`)

  assert.deepEqual(declaration, {
    gold: 10,
    diamonds: 3,
    energy: 0,
    section: 0,
  })
})

test("unterstützt Ressourcen ohne Energielimit", () => {
  assert.deepEqual(
    parseCourseResourceDeclaration("# Kurs\n@Ressourcen(4, .5)\n"),
    {
      gold: 4,
      diamonds: 0.5,
      section: 0,
    },
  )
})

test("ignoriert Ressourcen-Beispiele, Makrodefinitionen und ungültige Literale", () => {
  const declaration = parseCourseResourceDeclaration(`
@Ressourcen
<script>
@Ressourcen(100, 100, 100)
</script>

<!-- @Ressourcen(90, 90, 90) -->

\`\`\`markdown
@Ressourcen(80, 80, 80)
\`\`\`

Text mit \`@Ressourcen(70, 70, 70)\`.
@Ressourcen(Infinity, 1)
@Ressourcen(1e309, 1)
@Ressourcen(1 + 1, 2)
@Ressourcen(6, 2) <!-- echter Aufruf -->
`)

  assert.deepEqual(declaration, {
    gold: 6,
    diamonds: 2,
    section: -1,
  })
})

test("findet alleinstehende Geheimfolien nullbasiert und dedupliziert pro Folie", () => {
  const declarations = parseCourseSecretSlideDeclarations(`
@Geheimfolie

# Start
@Geheimfolie
@Geheimfolie <!-- derselbe Folienmarker -->

## Aufgabe
@Geheimfolie

### Ohne Geheimnis
Text.

## Noch eine Aufgabe
@Geheimfolie
`)

  assert.deepEqual(declarations, [
    { section: 0 },
    { section: 1 },
    { section: 3 },
  ])
})

test("ignoriert Geheimfolien in Kommentaren und jeder Codeform", () => {
  const declarations = parseCourseSecretSlideDeclarations(`
<!--
# Verdeckte Überschrift
@Geheimfolie
-->

\`\`\`markdown
# Fence-Überschrift
@Geheimfolie
\`\`\`

~~~markdown
@Geheimfolie
~~~

# Sichtbare Folie
    @Geheimfolie
\t@Geheimfolie
\`@Geheimfolie\`
Text mit \`@Geheimfolie\`.

<script>
@Geheimfolie
</script>

<code>@Geheimfolie</code>
@Geheimfolie: Makrodefinition
Text @Geheimfolie

@Geheimfolie <!-- echter Aufruf -->
`)

  assert.deepEqual(declarations, [{ section: 0 }])
})

test("erkennt das korrekt geschriebene Achievement-Makro und seine Aliasse", () => {
  assert.equal(parseCourseAchievementsDeclaration("@achievements"), true)
  assert.equal(parseCourseAchievementsDeclaration("@Achievements"), true)
  assert.equal(parseCourseAchievementsDeclaration("@Erfolge"), true)
  assert.equal(parseCourseAchievementsDeclaration("@archievments"), false)
  assert.equal(
    parseCourseAchievementsDeclaration(`
<!-- @achievements -->

\`\`\`markdown
@Achievements
\`\`\`
`),
    false,
  )
})

test("enthält das geheime Labor als echte Live-Demo außerhalb des Codeblocks", () => {
  const markdown = readFileSync(
    new URL("../README.md", import.meta.url),
    "utf8",
  )
  const declarations = parseCourseSecretSlideDeclarations(markdown)
  const laboratoryHeadings = markdown.match(/^## Das geheime Labor\s*$/gmu) ?? []

  assert.equal(laboratoryHeadings.length, 2)
  assert.deepEqual(declarations, [{ section: 11 }])
})

test("wiederholt die frühe Quelltextladung nach einem vorübergehenden Fehler", async () => {
  const previousWindow = globalThis.window
  let fetchAttempts = 0
  globalThis.window = {
    location: {
      href: "https://runner.test/liascript/index.html",
      search: "?https://example.test/course.md",
    },
    fetch: async () => {
      fetchAttempts += 1
      if (fetchAttempts === 1) throw new Error("temporary failure")
      return {
        ok: true,
        text: async () =>
          "# Kurs\n@Ressourcen(7, 2, 0)\n@Schloss(info, gruen)\n@Geheimfolie\n",
      }
    },
    setTimeout: (callback) => globalThis.setTimeout(callback, 0),
    clearTimeout: (timer) => globalThis.clearTimeout(timer),
  }

  try {
    const [declarations, resources, secretSlides] = await Promise.all([
      discoverCourseLockDeclarations(),
      discoverCourseResourceDeclaration(),
      discoverCourseSecretSlideDeclarations(),
    ])
    assert.equal(fetchAttempts, 2)
    assert.equal(declarations.length, 1)
    assert.equal(declarations[0].color, "green")
    assert.deepEqual(resources, {
      gold: 7,
      diamonds: 2,
      energy: 0,
      section: 0,
    })
    assert.deepEqual(secretSlides, [{ section: 0 }])
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})
