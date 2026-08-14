import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  courseSourceRevision,
  discoverCourseAchievementCatalog,
  discoverCourseIdentity,
  discoverCourseLockDeclarations,
  discoverCourseResourceDeclaration,
  discoverCourseSecretSlideDeclarations,
  discoverCourseVersion,
  parseCourseAchievementsDeclaration,
  parseCourseAchievementCatalog,
  parseCourseChestCatalogDeclarations,
  parseCourseChestDeclarations,
  parseCourseKeyDeclarations,
  parseCourseLockCatalogDeclarations,
  parseCourseLockDeclarations,
  parseCourseResourceDeclaration,
  parseCourseSecretSlideDeclarations,
} from "../src/course-chests.ts"

test("bindet den Kurszustand stabil an den tatsächlichen Quelltext", () => {
  const unix = "<!--\nversion: 1.2.3\n-->\n# Kurs\n@Unsichtbar(A)\n"
  const windows = unix.replaceAll("\n", "\r\n")

  assert.equal(courseSourceRevision(unix), courseSourceRevision(windows))
  assert.notEqual(
    courseSourceRevision(unix),
    courseSourceRevision(unix.replace("@Unsichtbar(A)", "@Unsichtbar(B)")),
  )
})

test("hält Surface-Funde in geschlossenen Reveal-Containern zurück", () => {
  const markdown = `
# Fundkette
@Schatztruhe(menu)
@Erdhaufen(unsichtbar)
@Schluessel(blau; translator)
@Pflanze(zauberstaub)
@Diamanttruhe(info)
@Schloss(mode, gruen)
@EndePflanze
@EndeErdhaufen
@Energiekiste(toc)
`

  assert.deepEqual(
    parseCourseChestDeclarations(markdown).map(({ reward }) => reward),
    ["gold", "diamonds", "energy"],
    "der vollständige Katalog behält Funde hinter Gates",
  )
  assert.deepEqual(
    parseCourseChestDeclarations(markdown, false).map(({ reward }) => reward),
    ["gold", "energy"],
    "aktive Source-Portale enthalten nur bereits freigelegte Funde",
  )
  assert.equal(parseCourseKeyDeclarations(markdown).length, 1)
  assert.equal(parseCourseKeyDeclarations(markdown, false).length, 0)
  assert.equal(parseCourseLockDeclarations(markdown).length, 1)
  assert.equal(parseCourseLockDeclarations(markdown, false).length, 0)
})

test("schließt Reveal-Container nur in korrekter LIFO-Reihenfolge", () => {
  const markdown = `
@Erdhaufen
@Pflanze
@EndeErdhaufen
@Schatztruhe(menu)
@EndePflanze
@Schatztruhe(info)
@EndeErdhaufen
@Schatztruhe(toc)
`

  assert.deepEqual(
    parseCourseChestDeclarations(markdown, false).map(({ placement }) => placement),
    ["toc"],
  )
})

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

test("haelt gueltige lootif-Ranges aktiv zurueck und vollstaendig im Katalog", () => {
  const markdown = `
# Bedingungen
@lootif(Gold >= 2; spawn)
@Schatztruhe(menu)
@Schluessel(blau; translator)
@Schloss(info, gruen)
@lootif(Lupe gefunden; spawn)
@Diamanttruhe
@LootTruhe_(@uid,annotation; anker,energy)
@LootSchloss_(@uid,annotationsbar,orange)
@EndeLootif
@Endelootif
@lootif(Energie > 0; spawn)
@Energiekiste
@endlootif
@lootif(Geheimfolie besucht; spawn)
@Schatztruhe(toc)
@EndLootIf
`

  assert.deepEqual(
    parseCourseChestDeclarations(markdown).map(({ reward }) => reward),
    ["gold", "diamonds", "energy", "gold"],
  )
  assert.deepEqual(parseCourseChestDeclarations(markdown, false), [])
  assert.deepEqual(
    parseCourseChestCatalogDeclarations(markdown).map(({ reward }) => reward),
    ["gold", "diamonds", "energy", "gold", "energy"],
  )
  assert.equal(parseCourseKeyDeclarations(markdown).length, 1)
  assert.equal(parseCourseKeyDeclarations(markdown, false).length, 0)
  assert.equal(parseCourseLockDeclarations(markdown).length, 1)
  assert.equal(parseCourseLockDeclarations(markdown, false).length, 0)
  assert.equal(parseCourseLockCatalogDeclarations(markdown).length, 2)
})

test("verwirft ungueltige und unbalancierte lootif-Ranges fail-closed", () => {
  const markdown = `
# Fehlerhafte Bereiche
@lootif(Unbekannter Trigger; spawn)
@Schatztruhe(menu)
@Endelootif
@lootif(Gold >= 1; verschwinde)
@Diamanttruhe
@Endelootif
@lootif(Gold >= 1; spawn; extra)
@Energiekiste
@Endelootif
@lootif(Gold >= 1; spawn)
@lootif(Unbekannt; spawn)
@Schatztruhe(info)
@Endelootif
@Endelootif
@lootif(Gold >= 1; spawn
@Schatztruhe(classroom)

# Naechste Folie
@Endelootif
@Energiekiste(toc)
@lootif(Gold >= 1; spawn)
@Schatztruhe(mode)
`

  assert.deepEqual(
    parseCourseChestDeclarations(markdown).map(({ placement, reward }) => ({
      placement,
      reward,
    })),
    [{ placement: "toc", reward: "energy" }],
  )
  assert.deepEqual(
    parseCourseChestCatalogDeclarations(markdown).map(
      ({ placement, reward }) => ({ placement, reward }),
    ),
    [{ placement: "toc", reward: "energy" }],
  )
  assert.deepEqual(
    parseCourseChestDeclarations(markdown, false).map(({ placement }) => placement),
    ["toc"],
  )
})

test("aktiviert kursweite Source-Makros nicht aus lootif-Ranges", () => {
  const gatedOnly = `
# Bedingt
@lootif(Gold >= 1; spawn)
@Ressourcen(99, 99, 99)
@Geheimfolie
@achievements
@Endelootif
`
  assert.equal(parseCourseResourceDeclaration(gatedOnly), null)
  assert.deepEqual(parseCourseSecretSlideDeclarations(gatedOnly), [])
  assert.equal(parseCourseAchievementsDeclaration(gatedOnly), false)

  const withActiveFallbacks = `${gatedOnly}
# Aktiv
@Ressourcen(4, 2, 1)
@Geheimfolie
@achievements
`
  assert.deepEqual(parseCourseResourceDeclaration(withActiveFallbacks), {
    gold: 4,
    diamonds: 2,
    energy: 1,
    section: 1,
  })
  assert.deepEqual(parseCourseSecretSlideDeclarations(withActiveFallbacks), [
    { section: 1 },
  ])
  assert.equal(parseCourseAchievementsDeclaration(withActiveFallbacks), true)
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

test("bewahrt Mengenangaben in Inline- und Portal-Kistendeklarationen", () => {
  const declarations = parseCourseChestDeclarations(`
@Schatztruhe(3)
@Diamanttruhe(4; translator)
@Energiekiste(5; menu; anker)
`)

  assert.deepEqual(
    declarations.map(({ placement, reward }) => ({ placement, reward })),
    [
      { placement: "3", reward: "gold" },
      { placement: "4; translator", reward: "diamonds" },
      { placement: "5; menu; anker", reward: "energy" },
    ],
  )
  assert.equal(new Set(declarations.map(({ baseId }) => baseId)).size, 3)
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
@Schloss(Seitenwechsel; blue; anker)
@Schloss(TOC; blue; anker)
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
      {
        target: "Seitenwechsel",
        color: "blue",
        onlyOnSlide: true,
        section: 0,
      },
      {
        target: "TOC",
        color: "blue",
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
        target: "Seitenwechsel",
        color: "blue",
        onlyOnSlide: true,
        section: 0,
      },
      {
        target: "TOC",
        color: "blue",
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

test("katalogisiert alle verdeckten Itemfamilien und multipliziert Portaltruhen", () => {
  const markdown = [
    "# Fundkette",
    "@Unsichtbar(A) und @Zauberstaub(B (C))",
    "@Schatztruhe(menu; toc; menu; unsichtbar; erde-zauberstaub; pflanze)",
    "@Schluessel(blau; translator; zauberstaub; erde-unsichtbar)",
    "@Lupe(unsichtbar; pflanze-zauberstaub)",
    "@Schaufel(erde; zauberstaub)",
    "@Giesskanne(pflanze-unsichtbar)",
    "@Erdhaufen(unsichtbar)",
    "@Blume(zauberstaub)",
    "@Diamanttruhe(unsichtbar)",
    "@EndeBlume",
    "@EndeErdhaufen",
  ].join("\n")

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 7,
    plant: 5,
    soil: 5,
    solid: 8,
  })
})

test("katalogisiert Inline-Erde und -Pflanzen im Fliesstext", () => {
  const markdown = [
    "# Inline",
    "Vor @Erdhaufen.inline(Hinweis (mit Klammer)) nach.",
    "Neben @Pflanze.inline(Bluetennotiz, unsichtbar; anker) weiter.",
    "Dazu @Blume.inline(Bluete, zauberstaub; 12s).",
    "Zwei: @Erdhaufen.inline(A, zauberstaub) und @Pflanze.inline(B).",
  ].join("\n")

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 2,
    plant: 3,
    soil: 2,
    solid: 1,
  })
})

test("ignoriert maskierte und ungueltige Inline-Reveals fail-closed", () => {
  const tick = String.fromCharCode(96)
  const slash = String.fromCharCode(92)
  const markdown = [
    "<!-- @Erdhaufen.inline(Kommentar) -->",
    "```markdown",
    "@Pflanze.inline(Fence)",
    "```",
    "Text mit " + tick + "@Blume.inline(Inline-Code)" + tick + ".",
    "@@Erdhaufen.inline(Ausgeschaltet)",
    slash + "@Pflanze.inline(Escaped)",
    "@Erdhaufen.inline(Offen",
    "@Pflanze.inline(X, unbekannt)",
    "@Blume.inline(X, unsichtbar; zauberstaub)",
    "@Erdhaufen(unbekannt)",
    "@Pflanze.inline(in ungueltiger Range)",
    "@EndeErdhaufen",
    "@Erdhaufen",
    "Text @Pflanze.inline(gueltig, zauberstaub)",
    "@EndeErdhaufen",
  ].join("\n")

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 1,
    plant: 1,
    soil: 1,
    solid: 0,
  })
})

test("zählt nur Puzzleteile eines vollständig gültigen Tors für Aggregaterfolge", () => {
  const markdown = [
    "# Puzzle",
    "Im Satz @Puzzleteil(rot; 1; zauberstaub; erde-unsichtbar) und @Puzzleteil(rot; 2; pflanze-zauberstaub).",
    "@Puzzletor(rot; [[1;2]])",
    "@Puzzleteil(blau; 1; zauberstaub; erde-unsichtbar)",
    "@Puzzleteil(gelb; 1; zauberstaub)",
    "@Puzzleteil(gelb; 1; zauberstaub)",
    "@Puzzletor(gelb; [[1]])",
  ].join("\n")

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 2,
    plant: 1,
    soil: 1,
    solid: 1,
  })
})

test("ignoriert Beispiele, ungültige Items und nicht korrekt gepaarte Ranges", () => {
  const tick = String.fromCharCode(96)
  const slash = String.fromCharCode(92)
  const markdown = [
    "<!--",
    "@Unsichtbar(Kommentar)",
    "@Schaufel(erde-unsichtbar)",
    "-->",
    "~~~markdown",
    "@Zauberstaub(Fence)",
    "@Pflanze(unsichtbar)",
    "@EndePflanze",
    "~~~",
    "Text mit " + tick + "@Unsichtbar(Inline-Code)" + tick + ".",
    "<script>",
    "@Zauberstaub(Script)",
    "</script>",
    "<template>@Unsichtbar(Template)</template>",
    "@@Unsichtbar(Ausgeschaltet)",
    slash + "@Zauberstaub(Escaped)",
    "@Unsichtbar(",
    "@Schatztruhe(menu; unbekannt; unsichtbar)",
    "@Schatztruhe(0; unsichtbar)",
    "@Schluessel(blau; rot; unsichtbar)",
    "@Lupe(unsichtbar; unbekannt)",
    "@Giesskanne(unsichtbar; zauberstaub)",
    "@Erdhaufen(unbekannt; unsichtbar)",
    "@Zauberstaub(Inhalt einer ungültigen Range)",
    "@EndeErdhaufen",
    "@Schaufel(erde-unsichtbar; theme=rot)",
    "@Zauberstaub(Echter Fund)",
    "@Erdhaufen(unsichtbar)",
    "@Pflanze(zauberstaub)",
    "@EndeErdhaufen",
    "@EndePflanze",
  ].join("\n")

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 1,
    plant: 0,
    soil: 1,
    solid: 1,
  })
})

test("katalogisiert interne Live-Makros ohne Definitionen mitzuzählen", () => {
  const markdown = [
    "<!--",
    "@LootLupe_(@uid,unsichtbar)",
    "@LootRevealStart_(@uid,erde,zauberstaub)",
    "@LootRevealEnd_(erde)",
    "-->",
    "@LootTruhe_(@uid,menu; toc; erde-unsichtbar; zauberstaub,gold)",
    "@LootSchluessel_(@uid,blau; pflanze-zauberstaub)",
    "@LootLupe_(@uid,unsichtbar)",
    "@LootWerkzeug_(@uid,shovel,erde; zauberstaub)",
    "@LootRevealStart_(@uid,pflanze,unsichtbar)",
    "@LootVersteckt_(@uid,dust,Text)",
    "@LootRevealEnd_(pflanze)",
  ].join("\n")

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 5,
    plant: 2,
    soil: 3,
    solid: 4,
  })
})

test("zaehlt Achievement-Objekte nur in gueltig balancierten lootif-Ranges", () => {
  const markdown = `
@lootif(Gold >= 1; spawn)
@Unsichtbar(Gueltiger Fund)
@Erdhaufen(zauberstaub)
@EndeErdhaufen
@Endelootif
@lootif(Unbekannt; spawn)
@Zauberstaub(Ungueltiger Fund)
@Endelootif
@lootif(Lupe gefunden; spawn)
@Pflanze(unsichtbar)

# Ausserhalb
@Schaufel(erde-unsichtbar)
`

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 1,
    plant: 0,
    soil: 2,
    solid: 2,
  })
})

test("lässt ungeschlossene Reveal-Bereiche nicht in die nächste Folie reichen", () => {
  const markdown = `
# Unvollständig
@Erdhaufen(unsichtbar)
@Unsichtbar(Nicht erreichbar)

# Nächste Folie
@Unsichtbar(Echter Fund)
`

  assert.deepEqual(parseCourseAchievementCatalog(markdown), {
    dust: 0,
    plant: 0,
    soil: 0,
    solid: 1,
  })
  assert.deepEqual(parseCourseChestDeclarations(markdown, false), [])
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
  assert.deepEqual(declarations, [{ section: 13 }])
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
          "<!--\nversion: 3.2.1\n-->\n# Kurs\n@Ressourcen(7, 2, 0)\n@Schloss(info, gruen)\n@Geheimfolie\n@Erdhaufen(zauberstaub)\n@Zauberstaub(Inhalt)\n@EndeErdhaufen\n",
      }
    },
    setTimeout: (callback) => globalThis.setTimeout(callback, 0),
    clearTimeout: (timer) => globalThis.clearTimeout(timer),
  }

  try {
    const [catalog, identity, declarations, resources, secretSlides, version] = await Promise.all([
      discoverCourseAchievementCatalog(),
      discoverCourseIdentity(),
      discoverCourseLockDeclarations(),
      discoverCourseResourceDeclaration(),
      discoverCourseSecretSlideDeclarations(),
      discoverCourseVersion(),
    ])
    assert.equal(fetchAttempts, 2)
    assert.deepEqual(catalog, {
      dust: 2,
      plant: 0,
      soil: 1,
      solid: 0,
    })
    assert.deepEqual(identity, {
      version: "3.2.1",
      revision: courseSourceRevision(
        "<!--\nversion: 3.2.1\n-->\n# Kurs\n@Ressourcen(7, 2, 0)\n@Schloss(info, gruen)\n@Geheimfolie\n@Erdhaufen(zauberstaub)\n@Zauberstaub(Inhalt)\n@EndeErdhaufen\n",
      ),
    })
    assert.equal(declarations.length, 1)
    assert.equal(declarations[0].color, "green")
    assert.deepEqual(resources, {
      gold: 7,
      diamonds: 2,
      energy: 0,
      section: 0,
    })
    assert.deepEqual(secretSlides, [{ section: 0 }])
    assert.equal(version, "3.2.1")
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})
