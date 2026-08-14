import assert from "node:assert/strict"
import test from "node:test"

import {
  DEFAULT_COURSE_VERSION,
  parseCourseKeyDeclarations,
  parseCourseVersion,
} from "../src/course-chests.ts"
import {
  resolveSurfaceTarget,
  surfaceTargetElement,
  SURFACE_TARGETS,
} from "../src/surface-targets.ts"

const previousHTMLElement = globalThis.HTMLElement
globalThis.HTMLElement ??= class {}
const {
  discardObservedKeyWrites,
  keyMutationBatchNeedsSync,
  parseKeyPickupOptions,
  pruneStaleKeySourceMatches,
  sourceCatalogCoversKeyHost,
  splitSurfaceKeyPlacements,
  surfaceKeyInstanceId,
} = await import("../src/key-pickup.ts")
if (previousHTMLElement === undefined) delete globalThis.HTMLElement
else globalThis.HTMLElement = previousHTMLElement

test("setzt TOC-Funde in die scrollbare lia-navigation-Liste", () => {
  const enhancedToc = { id: "enhanced" }
  const nativeToc = { id: "native" }
  const enhancedQueries = []
  const enhancedDocument = {
    querySelector(selector) {
      enhancedQueries.push(selector)
      return selector === "#lia-toc #lia-bm-toc5 > .bm-list"
        ? enhancedToc
        : nativeToc
    },
  }

  assert.equal(surfaceTargetElement("toc", enhancedDocument), enhancedToc)
  assert.deepEqual(enhancedQueries, [
    "#lia-toc #lia-bm-toc5 > .bm-list",
  ])

  const fallbackQueries = []
  const fallbackDocument = {
    querySelector(selector) {
      fallbackQueries.push(selector)
      return selector === "#lia-toc .lia-toc__content" ? nativeToc : null
    },
  }

  assert.equal(surfaceTargetElement("toc", fallbackDocument), nativeToc)
  assert.deepEqual(fallbackQueries, [
    "#lia-toc #lia-bm-toc5 > .bm-list",
    "#lia-toc .lia-toc__content",
  ])
})

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

test("bewahrt alle bisherigen Inline-Schluesselformen", () => {
  assert.deepEqual(parseKeyPickupOptions(""), {
    concealment: null,
    errors: [],
    inline: true,
    layers: [],
    placement: null,
    requestedColor: null,
    valid: true,
    visibility: visibility(),
  })
  assert.deepEqual(
    parseKeyPickupOptions("gruen; anker; 30s; zauberstaub"),
    {
      concealment: "dust",
      errors: [],
      inline: true,
      layers: [],
      placement: null,
      requestedColor: "gruen",
      valid: true,
      visibility: visibility({ delayMs: 30_000, onlyOnSlide: true }),
    },
  )
  assert.equal(parseKeyPickupOptions("anker; 1min").valid, true)
})

test("akzeptiert alle neuen Schlüsselfarben als Inline-Funde", () => {
  for (const authored of [
    "magenta",
    "weiß",
    "schwarz",
    "türkis",
    "grau",
    "braun",
  ]) {
    const parsed = parseKeyPickupOptions(authored)
    assert.equal(parsed.valid, true, authored)
    assert.equal(parsed.requestedColor, authored, authored)
  }
})

test("trennt Schluesselfarbe und gemeinsame Sichtbarkeitsoptionen", () => {
  assert.deepEqual(
    parseKeyPickupOptions(
      "blau; translator; theme-blau; darkmode; ohne-annotation; anker; 2s",
    ),
    {
      concealment: null,
      errors: [],
      inline: false,
      layers: [],
      placement: "translator",
      requestedColor: "blau",
      valid: true,
      visibility: visibility({
        delayMs: 2_000,
        onlyOnSlide: true,
        onlyWithoutAnnotations: true,
        themes: ["blue"],
        variants: ["dark"],
      }),
    },
  )
})

test("parst Farbe, Surface-Ziel und Optionen in beliebiger Reihenfolge", () => {
  assert.deepEqual(parseKeyPickupOptions("gelb; menu; unsichtbar"), {
    concealment: "solid",
    errors: [],
    inline: false,
    layers: [],
    placement: "menu",
    requestedColor: "gelb",
    valid: true,
    visibility: visibility(),
  })

  assert.deepEqual(
    parseKeyPickupOptions(
      "zauberstaub; 12s; classroom; anker; orange",
    ),
    {
      concealment: "dust",
      errors: [],
      inline: false,
      layers: [],
      placement: "classroom",
      requestedColor: "orange",
      valid: true,
      visibility: visibility({ delayMs: 12_000, onlyOnSlide: true }),
    },
  )

  for (const target of SURFACE_TARGETS) {
    const parsed = parseKeyPickupOptions(`${target}; gelb`)
    assert.equal(parsed.valid, true, target)
    assert.equal(parsed.inline, false, target)
    assert.equal(parsed.placement, target, target)
    assert.equal(parsed.requestedColor, "gelb", target)
  }
  assert.equal(resolveSurfaceTarget("translation"), "translator")
  assert.equal(resolveSurfaceTarget("display"), "mode")
})

test("kombiniert geordnete Exploration-Layer mit allen Schlüsseloptionen", () => {
  assert.deepEqual(
    parseKeyPickupOptions(
      "pflanze-unsichtbar; gelb; erde; menu; 12s; erde-zauberstaub; anker; unsichtbar",
    ),
    {
      concealment: "solid",
      errors: [],
      inline: false,
      layers: [
        { kind: "plant", concealment: "solid" },
        { kind: "soil", concealment: null },
        { kind: "soil", concealment: "dust" },
      ],
      placement: "menu",
      requestedColor: "gelb",
      valid: true,
      visibility: visibility({ delayMs: 12_000, onlyOnSlide: true }),
    },
  )
})

test("behält identische Schlüssel-Layer in deklarierter Reihenfolge", () => {
  const parsed = parseKeyPickupOptions(
    "erde; pflanze; erde; pflanze-unsichtbar; erde",
  )

  assert.equal(parsed.valid, true)
  assert.deepEqual(parsed.layers, [
    { kind: "soil", concealment: null },
    { kind: "plant", concealment: null },
    { kind: "soil", concealment: null },
    { kind: "plant", concealment: "solid" },
    { kind: "soil", concealment: null },
  ])
})

test("weist mehrere Ziele, Farben und unbekannte Werte fail-closed zurueck", () => {
  for (const options of [
    "gelb; menu; classroom",
    "gelb; orange; menu",
    "gelb; nirgends",
  ]) {
    const parsed = parseKeyPickupOptions(options)
    assert.equal(parsed.valid, false, options)
    assert.ok(parsed.errors.length > 0, options)
  }
})

test("vergibt stabile getrennte Source-IDs fuer Surface-Schluessel", () => {
  const original = parseCourseKeyDeclarations(`
# Start
@Schluessel(gelb; menu)
@Schluessel(orange; classroom)
@Schluessel(gelb; menu)
`)
  const withUnrelatedText = parseCourseKeyDeclarations(`
# Neue Ueberschrift
Text ohne Fund.

@Schluessel(gelb; menu)
@Schluessel(orange; classroom)
@Schluessel(gelb; menu)
`)

  assert.deepEqual(
    original.map(({ options }) => options),
    ["gelb; menu", "orange; classroom", "gelb; menu"],
  )
  assert.equal(new Set(original.map(({ baseId }) => baseId)).size, 3)
  assert.deepEqual(
    original.map(({ baseId }) => baseId),
    withUnrelatedText.map(({ baseId }) => baseId),
  )
})

test("disambiguiert auch kollidierende Source-Hashes stabil", () => {
  const markdown = [
    "@Schluessel(gelb; menu; 549599s)",
    "@Schluessel(gelb; menu; 712382s)",
  ].join("\n")
  const firstParse = parseCourseKeyDeclarations(markdown)
  const secondParse = parseCourseKeyDeclarations(markdown)

  assert.equal(firstParse.length, 2)
  assert.equal(new Set(firstParse.map(({ baseId }) => baseId)).size, 2)
  assert.deepEqual(
    firstParse.map(({ baseId }) => baseId),
    secondParse.map(({ baseId }) => baseId),
  )
})

test("ignoriert Schluesselbeispiele in Kommentaren und Code", () => {
  const declarations = parseCourseKeyDeclarations(
    [
      "<!-- @Schluessel(gelb; menu) -->",
      "```markdown",
      "@Schluessel(orange; classroom)",
      "```",
      "Text mit `@Schluessel(rot; toc)`.",
      "@Schluessel(gelb; menu)",
    ].join("\n"),
  )
  assert.equal(declarations.length, 1)
  assert.equal(declarations[0].options, "gelb; menu")
})

test("liefert Kursversion aus dem Kopf und sonst den offiziellen Default", () => {
  assert.equal(
    parseCourseVersion(`\uFEFF
<!--
author: Test
version: 2.4.1-beta
-->
# Kurs
`),
    "2.4.1-beta",
  )
  assert.equal(parseCourseVersion("# Kurs ohne Kopf"), DEFAULT_COURSE_VERSION)
  assert.equal(
    parseCourseVersion("<!--\nversion:   \n-->\n# Kurs"),
    DEFAULT_COURSE_VERSION,
  )
})

test("waehlt pro stabiler ID genau eine Surface-Platzierung", () => {
  const first = {
    name: "first",
    dataset: { lootKeyPlacement: "key:source-a:menu" },
  }
  const duplicate = {
    name: "duplicate",
    dataset: { lootKeyPlacement: "key:source-a:menu" },
  }
  const other = {
    name: "other",
    dataset: { lootKeyPlacement: "key:source-b:menu" },
  }

  assert.deepEqual(
    splitSurfaceKeyPlacements(
      [first, other, duplicate],
      "key:source-a:menu",
    ),
    { duplicates: [duplicate], primary: first },
  )
  assert.equal(
    surfaceKeyInstanceId("source-a", "classroom"),
    "key:source-a:classroom",
  )
})

test("verwirft eigene DOM-Commits, repariert aber spaetere externe Entfernung einmal", () => {
  const records = []
  const observer = {
    takeRecords() {
      return records.splice(0)
    },
  }
  let synchronizations = 0
  const deliver = () => {
    const mutations = observer.takeRecords()
    if (keyMutationBatchNeedsSync(mutations)) synchronizations += 1
  }

  records.push({ type: "childList", change: "own-insert" })
  discardObservedKeyWrites(observer)
  deliver()
  assert.equal(synchronizations, 0)

  records.push({ type: "childList", change: "external-placement-removal" })
  deliver()
  deliver()
  assert.equal(synchronizations, 1)
})

test("behaelt bei Remount und Renderer-Clone genau den Source-Request", () => {
  const signature = "4:yellow:menu:0:0:none:none"
  const matches = new Map([["old-runtime-id", signature]])
  const surfaceRequests = new Set(["source-key-id"])
  const registerDomRequest = (baseId, nextSignature, sourceCount) => {
    if (
      !sourceCatalogCoversKeyHost(
        matches,
        baseId,
        nextSignature,
        sourceCount,
      )
    ) {
      surfaceRequests.add(baseId)
    }
  }

  pruneStaleKeySourceMatches(matches, new Set(["new-runtime-id"]))
  assert.equal(matches.has("old-runtime-id"), false)
  registerDomRequest("new-runtime-id", signature, 1)
  registerDomRequest("unexpected-renderer-clone", signature, 1)
  assert.deepEqual([...matches], [["new-runtime-id", signature]])
  assert.deepEqual([...surfaceRequests], ["source-key-id"])

  registerDomRequest("dom-only-key", "9:orange:classroom:0:0:none:none", 0)
  assert.deepEqual(
    [...surfaceRequests],
    ["source-key-id", "dom-only-key"],
  )
})
