import assert from "node:assert/strict"
import test from "node:test"

import {
  COLLECTIBLE_THEMES,
  COLLECTIBLE_VARIANTS,
  CollectibleVisibilityGate,
  MAX_COLLECTIBLE_DELAY_MS,
  advanceCollectibleReveal,
  collectibleEnvironmentMatches,
  collectibleVisibilitySignature,
  currentCollectibleEnvironment,
  parseCollectibleOptions,
} from "../src/collectible-visibility.ts"
import { sectionFromLootId } from "../src/slide-activity.ts"

function rule(overrides = {}) {
  return {
    delayMs: 0,
    onlyOnSlide: false,
    onlyWithoutAnnotations: false,
    themes: [],
    variants: [],
    ...overrides,
  }
}

function fakeClassList(names) {
  const values = new Set(names)
  return {
    [Symbol.iterator]: () => values[Symbol.iterator](),
    contains: (name) => values.has(name),
  }
}

function fakeDocument({
  annotationApi,
  classes = [],
  parentDocument = null,
  settings,
  toggleAttributes = null,
} = {}) {
  const toggle = toggleAttributes
    ? {
        getAttribute(name) {
          return toggleAttributes[name] ?? null
        },
      }
    : null
  const toolbar = toggle
    ? {
        querySelector(selector) {
          return selector === "button[data-act='toggle']" ? toggle : null
        },
      }
    : null
  const documentRoot = {
    defaultView: null,
    documentElement: { classList: fakeClassList(classes) },
    querySelectorAll(selector) {
      return selector === ".lia-annot-toolbar" && toolbar ? [toolbar] : []
    },
  }
  const runtime = {
    document: documentRoot,
  }
  runtime.parent = parentDocument ? { document: parentDocument } : runtime
  runtime.top = runtime.parent
  if (settings !== undefined) runtime.LIA = { settings }
  if (annotationApi !== undefined) {
    runtime.__LIA_ANNOTATION__ = {
      getStore: () => ({ ui: { visible: annotationApi } }),
    }
  }
  documentRoot.defaultView = runtime
  return documentRoot
}

test("parst Anker und reine Zeitwerte mit verbleibenden Werten", () => {
  assert.deepEqual(parseCollectibleOptions("mode; anker; 12s"), {
    errors: [],
    hasOptions: true,
    rule: rule({ delayMs: 12_000, onlyOnSlide: true }),
    valid: true,
    values: ["mode"],
  })

  assert.deepEqual(
    parseCollectibleOptions(
      "toc; Anker; 10s; menu",
    ),
    {
      errors: [],
      hasOptions: true,
      rule: rule({ delayMs: 10_000, onlyOnSlide: true }),
      valid: true,
      values: ["toc", "menu"],
    },
  )
  assert.deepEqual(
    parseCollectibleOptions("gruen; 1.5 Minuten"),
    {
      errors: [],
      hasOptions: true,
      rule: rule({ delayMs: 90_000 }),
      valid: true,
      values: ["gruen"],
    },
  )
})

test("unterstützt Anker, Großschreibung und reine null Sekunden", () => {
  assert.deepEqual(
    parseCollectibleOptions("MODE; ANKER; 0s"),
    {
      errors: [],
      hasOptions: true,
      rule: rule({ onlyOnSlide: true }),
      valid: true,
      values: ["MODE"],
    },
  )
  assert.equal(
    parseCollectibleOptions("2min").rule.delayMs,
    120_000,
  )
})

test("lässt alte Platzierungs-, Farb- und Sichtbarkeitswerte unverändert", () => {
  assert.deepEqual(parseCollectibleOptions("toc; menu"), {
    errors: [],
    hasOptions: false,
    rule: rule(),
    valid: true,
    values: ["toc", "menu"],
  })
  assert.deepEqual(parseCollectibleOptions("gruen").values, ["gruen"])
  assert.deepEqual(
    parseCollectibleOptions("nur-auf-folie; nach=2min").rule,
    rule({ delayMs: 120_000, onlyOnSlide: true }),
  )
})

test("parst Theme, Darstellungsvariante und ausgeblendete Annotationen gemeinsam", () => {
  assert.deepEqual(
    parseCollectibleOptions(
      "menu; theme-blau; Theme-Rot; darkmode; ohne-annotation",
    ),
    {
      errors: [],
      hasOptions: true,
      rule: rule({
        onlyWithoutAnnotations: true,
        themes: ["red", "blue"],
        variants: ["dark"],
      }),
      valid: true,
      values: ["menu"],
    },
  )

  for (const [token, theme] of [
    ["theme-gelb", "yellow"],
    ["theme-türkis", "turquoise"],
    ["theme-tuerkis", "turquoise"],
    ["theme-standard", "turquoise"],
  ]) {
    assert.deepEqual(parseCollectibleOptions(token).rule.themes, [theme])
  }
  assert.deepEqual(
    parseCollectibleOptions("lightmode; hellmodus; dark-mode").rule.variants,
    ["dark", "light"],
  )
})

test("parst kanonische Sichtbarkeitsoptionen, Aliasse und NFKC-Schreibweisen", () => {
  for (const [token, expected] of [
    ["theme-rot", "red"],
    ["theme-gelb", "yellow"],
    ["theme-tuerkis", "turquoise"],
    ["theme-blau", "blue"],
    ["farbtheme:red", "red"],
    ["theme=yellow", "yellow"],
    ["theme_default", "turquoise"],
    ["theme turquoise", "turquoise"],
    ["theme-tu\u0308rkis", "turquoise"],
    ["ｔｈｅｍｅ－ｒｏｔ", "red"],
  ]) {
    const parsed = parseCollectibleOptions(token)
    assert.equal(parsed.valid, true, token)
    assert.deepEqual(parsed.rule.themes, [expected], token)
    assert.deepEqual(parsed.values, [], token)
  }

  for (const [token, expected] of [
    ["darkmode", "dark"],
    ["dunkelmodus", "dark"],
    ["variant:dunkel", "dark"],
    ["lightmode", "light"],
    ["hellmodus", "light"],
    ["farbmodus=hell", "light"],
    ["ｄａｒｋｍｏｄｅ", "dark"],
  ]) {
    const parsed = parseCollectibleOptions(token)
    assert.equal(parsed.valid, true, token)
    assert.deepEqual(parsed.rule.variants, [expected], token)
  }

  for (const token of [
    "annotationen=aus",
    "ohne-annotation",
    "ohne annotationen",
    "annotation-aus",
    "annotations-hidden",
    "without-annotations",
    "ｏｈｎｅ－ａｎｎｏｔａｔｉｏｎ",
  ]) {
    const parsed = parseCollectibleOptions(token)
    assert.equal(parsed.valid, true, token)
    assert.equal(parsed.rule.onlyWithoutAnnotations, true, token)
  }
})

test("bewahrt nackte Farben, mode und annotation kollisionsfrei als Itemwerte", () => {
  const parsed = parseCollectibleOptions(
    "rot; gelb; tuerkis; blau; mode; annotation; ohne-annotation",
  )

  assert.equal(parsed.valid, true)
  assert.equal(parsed.hasOptions, true)
  assert.deepEqual(parsed.values, [
    "rot",
    "gelb",
    "tuerkis",
    "blau",
    "mode",
    "annotation",
  ])
  assert.deepEqual(parsed.rule, rule({ onlyWithoutAnnotations: true }))
})

test("sortiert und dedupliziert Sichtbarkeitsoptionen deterministisch", () => {
  const parsed = parseCollectibleOptions(
    "theme-blau; lightmode; theme-rot; darkmode; theme-blau; lightmode; ohne-annotation",
  )
  const expectedRule = rule({
    onlyWithoutAnnotations: true,
    themes: ["red", "blue"],
    variants: ["dark", "light"],
  })

  assert.equal(parsed.valid, true)
  assert.deepEqual(parsed.rule, expectedRule)
  assert.equal(
    collectibleVisibilitySignature(expectedRule),
    "0:0:red,blue:dark,light:1",
  )
  assert.equal(
    collectibleVisibilitySignature({
      delayMs: 0,
      onlyOnSlide: false,
      onlyWithoutAnnotations: true,
      themes: ["blue", "red", "blue"],
      variants: ["light", "dark", "light"],
    }),
    "0:0:red,blue:dark,light:1",
  )
  assert.equal(
    collectibleVisibilitySignature({ delayMs: 0, onlyOnSlide: false }),
    collectibleVisibilitySignature(rule()),
  )
})

test("verknüpft Werte einer Gruppe mit ODER und Gruppen untereinander mit UND", () => {
  const conditional = rule({
    onlyWithoutAnnotations: true,
    themes: ["red", "blue"],
    variants: ["dark"],
  })
  assert.equal(
    collectibleEnvironmentMatches(conditional, {
      annotationsVisible: false,
      theme: "red",
      variant: "dark",
    }),
    true,
  )
  assert.equal(
    collectibleEnvironmentMatches(conditional, {
      annotationsVisible: false,
      theme: "blue",
      variant: "dark",
    }),
    true,
  )
  for (const environment of [
    { annotationsVisible: false, theme: "yellow", variant: "dark" },
    { annotationsVisible: false, theme: "red", variant: "light" },
    { annotationsVisible: true, theme: "red", variant: "dark" },
    { annotationsVisible: false, theme: null, variant: "dark" },
  ]) {
    assert.equal(
      collectibleEnvironmentMatches(conditional, environment),
      false,
    )
  }
})

test("deckt alle vier Themes, zwei Varianten und beide Annotationszustaende ab", () => {
  const environments = COLLECTIBLE_THEMES.flatMap((theme) =>
    COLLECTIBLE_VARIANTS.flatMap((variant) =>
      [false, true].map((annotationsVisible) => ({
        annotationsVisible,
        theme,
        variant,
      })),
    ),
  )

  assert.equal(environments.length, 16)
  assert.equal(
    environments.filter((environment) =>
      collectibleEnvironmentMatches(rule(), environment),
    ).length,
    16,
  )
  assert.equal(
    environments.filter((environment) =>
      collectibleEnvironmentMatches(
        rule({ onlyWithoutAnnotations: true }),
        environment,
      ),
    ).length,
    8,
  )

  for (const theme of COLLECTIBLE_THEMES) {
    assert.equal(
      environments.filter((environment) =>
        collectibleEnvironmentMatches(rule({ themes: [theme] }), environment),
      ).length,
      4,
      theme,
    )
    for (const variant of COLLECTIBLE_VARIANTS) {
      const exactRule = rule({
        onlyWithoutAnnotations: true,
        themes: [theme],
        variants: [variant],
      })
      assert.equal(
        environments.filter((environment) =>
          collectibleEnvironmentMatches(exactRule, environment),
        ).length,
        1,
        `${theme}/${variant}`,
      )
    }
  }

  for (const variant of COLLECTIBLE_VARIANTS) {
    assert.equal(
      environments.filter((environment) =>
        collectibleEnvironmentMatches(rule({ variants: [variant] }), environment),
      ).length,
      8,
      variant,
    )
  }
})

test("behandelt fehlende und unbekannte Theme- oder Variantwerte fail-closed", () => {
  const conditional = rule({ themes: ["red"], variants: ["dark"] })
  for (const environment of [
    { annotationsVisible: false, theme: null, variant: "dark" },
    { annotationsVisible: false, theme: "purple", variant: "dark" },
    { annotationsVisible: false, theme: "red", variant: null },
    { annotationsVisible: false, theme: "red", variant: "sepia" },
  ]) {
    assert.equal(
      collectibleEnvironmentMatches(conditional, environment),
      false,
      JSON.stringify(environment),
    )
  }
})

test("weist fehlerhafte, doppelte und übergroße Optionen fail-closed zurück", () => {
  for (const specification of [
    "erst nach -1 Sekunden",
    "erst nach Sekunden",
    "erst nach 4 Stunden",
    "nur auf Folien",
    "nach=1s; erst nach 2 Sekunden",
    `erst nach ${Math.ceil(MAX_COLLECTIBLE_DELAY_MS / 1000) + 1} Sekunden`,
    "toc; nurr auf Folie",
    "nurr auf Folie",
    "erst nack 2 Sekunden",
    "10 Sekundn",
    "ankerr",
    "theme-lila",
    "farbmodus=sepia",
    "annotationen=an",
    "darkmod",
    "ohne-annotationsanzeige",
  ]) {
    const parsed = parseCollectibleOptions(specification)
    assert.equal(parsed.valid, false, specification)
    assert.ok(parsed.errors.length > 0, specification)
  }
})

test("startet eine globale Verzögerung sofort und wird exakt zur Deadline sichtbar", () => {
  const visibility = rule({ delayMs: 10_000 })
  const first = advanceCollectibleReveal(visibility, null, 1_000, false)
  assert.deepEqual(first, {
    state: {
      signature: collectibleVisibilitySignature(visibility),
      startedAt: 1_000,
    },
    visible: false,
    wakeAt: 11_000,
  })
  assert.equal(
    advanceCollectibleReveal(visibility, first.state, 10_999, false).visible,
    false,
  )
  assert.equal(
    advanceCollectibleReveal(visibility, first.state, 11_000, false).visible,
    true,
  )
})

test("startet foliengebunden erst beim Betreten und setzt beim Weggehen nicht zurück", () => {
  const visibility = rule({ delayMs: 5_000, onlyOnSlide: true })
  const outside = advanceCollectibleReveal(visibility, null, 100, false)
  assert.deepEqual(outside, {
    state: null,
    visible: false,
    wakeAt: null,
  })

  const entered = advanceCollectibleReveal(visibility, null, 1_000, true)
  const left = advanceCollectibleReveal(
    visibility,
    entered.state,
    3_000,
    false,
  )
  assert.equal(left.visible, false)
  assert.equal(left.state?.startedAt, 1_000)
  assert.equal(left.wakeAt, 6_000)
  assert.equal(
    advanceCollectibleReveal(visibility, left.state, 6_000, true).visible,
    true,
  )
})

test("erkennt LiaScripts section_uid auch in zusammengesetzten Fund-IDs", () => {
  assert.equal(sectionFromLootId("3_17"), 3)
  assert.equal(sectionFromLootId("key:2_8:inline"), 2)
  assert.equal(sectionFromLootId("source-gold-abc-1"), null)
})

test("liest Theme, Variante und Annotation aus einfachen Dokument-Snapshots", () => {
  assert.deepEqual(
    currentCollectibleEnvironment(
      fakeDocument({
        classes: ["lia-theme-default", "lia-variant-light"],
      }),
    ),
    {
      annotationsVisible: false,
      theme: "turquoise",
      variant: "light",
    },
  )

  assert.deepEqual(
    currentCollectibleEnvironment(
      fakeDocument({
        classes: ["lia-theme-red", "lia-variant-dark"],
        toggleAttributes: {
          "aria-pressed": "false",
          "data-active": "0",
        },
      }),
    ),
    {
      annotationsVisible: false,
      theme: "red",
      variant: "dark",
    },
  )

  assert.deepEqual(
    currentCollectibleEnvironment(
      fakeDocument({
        classes: [],
        settings: { light: false, theme: "blue" },
      }),
    ),
    {
      annotationsVisible: false,
      theme: "blue",
      variant: "dark",
    },
  )
})

test("mischt unvollstaendige Dokumente nicht und behandelt Konflikte fail-closed", () => {
  const variantOnly = fakeDocument({ classes: ["lia-variant-dark"] })
  const themeOnly = fakeDocument({
    classes: ["lia-theme-red"],
    parentDocument: variantOnly,
  })
  assert.deepEqual(currentCollectibleEnvironment(themeOnly), {
    annotationsVisible: false,
    theme: "turquoise",
    variant: "light",
  })

  assert.deepEqual(
    currentCollectibleEnvironment(
      fakeDocument({
        annotationApi: false,
        classes: ["lia-theme-purple", "lia-variant-dark"],
        toggleAttributes: {
          "aria-pressed": "true",
          "data-active": "1",
        },
      }),
    ),
    {
      annotationsVisible: true,
      theme: null,
      variant: "dark",
    },
  )
})

test("laesst den Gate-Timer bei Environmentwechseln weiterlaufen", () => {
  let now = 1_000
  let environment = {
    annotationsVisible: true,
    theme: "blue",
    variant: "light",
  }
  const scheduled = []
  const canceled = []
  let reveals = 0
  const gate = new CollectibleVisibilityGate(
    () => now,
    (callback, delay) => {
      scheduled.push({ callback, delay })
      return scheduled.length
    },
    (handle) => canceled.push(handle),
    () => environment,
  )
  const visibility = rule({
    delayMs: 5_000,
    onlyWithoutAnnotations: true,
    themes: ["red"],
    variants: ["dark"],
  })
  const onReveal = () => {
    reveals += 1
  }

  assert.equal(gate.visible("item", visibility, true, onReveal), false)
  assert.deepEqual(scheduled.map(({ delay }) => delay), [5_000])

  now = 3_000
  environment = {
    annotationsVisible: false,
    theme: "red",
    variant: "dark",
  }
  assert.equal(gate.visible("item", visibility, true, onReveal), false)
  assert.equal(scheduled.length, 1)

  now = 6_000
  scheduled[0].callback()
  assert.equal(reveals, 1)
  assert.equal(gate.visible("item", visibility, true, onReveal), true)

  environment = { ...environment, annotationsVisible: true }
  assert.equal(gate.visible("item", visibility, true, onReveal), false)
  environment = { ...environment, annotationsVisible: false }
  assert.equal(gate.visible("item", visibility, true, onReveal), true)
  assert.deepEqual(canceled, [])
})
