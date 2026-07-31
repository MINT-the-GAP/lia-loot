import assert from "node:assert/strict"
import test from "node:test"

import {
  GLOBAL_LOCK_TARGETS,
  isGlobalLockTarget,
  isItemLockTarget,
  isLocalLockTarget,
  isTemplateLockTarget,
  ITEM_LOCK_TARGETS,
  LOCAL_LOCK_TARGETS,
  resolveLockTarget,
  TEMPLATE_LOCK_TARGETS,
} from "../src/lock-targets.ts"
import { TEMPLATE_TARGETS } from "../src/template-targets.ts"

const CORE_GLOBAL_TARGETS = [
  "toc",
  "mode",
  "menu",
  "translator",
  "classroom",
  "info",
  "seitenwechsel",
]

const EXPECTED_TEMPLATE_TARGETS = [
  "dynflex",
  "timer",
  "boardmode",
  "marker",
  "markerquiz",
  "annotation",
  "canvasocr",
  "kachel",
  "mathpath",
  "llm",
  "coordinate",
  "freeze",
]

test("definiert sieben Kern-, zwölf Template-, drei Quiz- und ein Item-Schlossziel", () => {
  assert.deepEqual(CORE_GLOBAL_TARGETS, [
    "toc",
    "mode",
    "menu",
    "translator",
    "classroom",
    "info",
    "seitenwechsel",
  ])
  assert.deepEqual([...TEMPLATE_TARGETS], EXPECTED_TEMPLATE_TARGETS)
  assert.deepEqual([...GLOBAL_LOCK_TARGETS], CORE_GLOBAL_TARGETS)
  assert.deepEqual([...TEMPLATE_LOCK_TARGETS], EXPECTED_TEMPLATE_TARGETS)
  assert.deepEqual([...LOCAL_LOCK_TARGETS], ["check", "resolve", "hint"])
  assert.deepEqual([...ITEM_LOCK_TARGETS], ["portal"])

  const allTargets = [
    ...GLOBAL_LOCK_TARGETS,
    ...TEMPLATE_LOCK_TARGETS,
    ...LOCAL_LOCK_TARGETS,
    ...ITEM_LOCK_TARGETS,
  ]
  assert.equal(GLOBAL_LOCK_TARGETS.length, 7)
  assert.equal(allTargets.length, 23)
  assert.equal(new Set(allTargets).size, 23)
})

test("löst jeden kanonischen Zielnamen unverändert auf", () => {
  for (const target of [
    ...GLOBAL_LOCK_TARGETS,
    ...TEMPLATE_LOCK_TARGETS,
    ...LOCAL_LOCK_TARGETS,
    ...ITEM_LOCK_TARGETS,
  ]) {
    assert.equal(resolveLockTarget(target), target)
  }
})

test("normalisiert sinnvolle deutsche Aliase, Umlaute und Trennzeichen", () => {
  const aliases = [
    ["  INHALTS-VERZEICHNIS  ", "toc"],
    ["Darstellung", "mode"],
    ["Ansicht", "mode"],
    ["Men\u00fc", "menu"],
    ["Einstellungen", "menu"],
    ["\u00dcbersetzer", "translator"],
    ["Sprache", "translator"],
    ["Klasse", "classroom"],
    ["Teilen", "classroom"],
    ["Informationen", "info"],
    ["SEITEN_NAVIGATION", "seitenwechsel"],
    ["Pr\u00fcfen", "check"],
    ["Aufl\u00f6sen", "resolve"],
    ["L\u00f6sung", "resolve"],
    ["Hinweis", "hint"],
    ["Portal", "portal"],
    ["Folien-Portal", "portal"],
    ["slide_portal", "portal"],
    ["lia-DynFlex", "dynflex"],
    ["Quiz Timer", "timer"],
    ["lia-board-mode", "boardmode"],
    ["boardmodefontbutton", "boardmode"],
    ["Textmarker", "marker"],
    ["textmarkerbutton", "marker"],
    ["TextmarkerQuiz", "markerquiz"],
    ["lia_annotation", "annotation"],
    ["annotationsbar", "annotation"],
    ["Canvas OCR", "canvasocr"],
    ["Kachelfolge", "kachel"],
    ["lia-mathpath", "mathpath"],
    ["KI Quiz", "llm"],
    ["Koordinaten_System", "coordinate"],
    ["lia-freeze-v2", "freeze"],
  ]

  for (const [alias, expected] of aliases) {
    assert.equal(resolveLockTarget(alias), expected, alias)
  }
})

test("klassifiziert globale, Template-, Quiz- und Item-Ziele disjunkt", () => {
  for (const target of CORE_GLOBAL_TARGETS) {
    assert.equal(isGlobalLockTarget(target), true, target)
    assert.equal(isItemLockTarget(target), false, target)
    assert.equal(isLocalLockTarget(target), false, target)
    assert.equal(isTemplateLockTarget(target), false, target)
  }

  for (const target of TEMPLATE_TARGETS) {
    assert.equal(isGlobalLockTarget(target), false, target)
    assert.equal(isItemLockTarget(target), false, target)
    assert.equal(isLocalLockTarget(target), false, target)
    assert.equal(isTemplateLockTarget(target), true, target)
  }

  for (const target of LOCAL_LOCK_TARGETS) {
    assert.equal(isGlobalLockTarget(target), false, target)
    assert.equal(isItemLockTarget(target), false, target)
    assert.equal(isLocalLockTarget(target), true, target)
    assert.equal(isTemplateLockTarget(target), false, target)
  }

  for (const target of ITEM_LOCK_TARGETS) {
    assert.equal(isGlobalLockTarget(target), false, target)
    assert.equal(isItemLockTarget(target), true, target)
    assert.equal(isLocalLockTarget(target), false, target)
    assert.equal(isTemplateLockTarget(target), false, target)
  }
})

test("verwirft leere, unbekannte und nur ähnlich klingende Werte", () => {
  const invalidValues = [
    null,
    undefined,
    "",
    "   ",
    "auto",
    "@1",
    "quiz",
    "info-button",
    "checks",
    "seitenwechsel!",
    "orthography",
    "Rechtschreibung",
    "mathe",
    "Bruchquiz",
    "jsxgraph",
    "JSX Graph",
    "resetter",
    "lia-resetter",
  ]

  for (const value of invalidValues) {
    assert.equal(resolveLockTarget(value), null, String(value))
  }

  assert.equal(isGlobalLockTarget("unknown"), false)
  assert.equal(isItemLockTarget("unknown"), false)
  assert.equal(isLocalLockTarget("unknown"), false)
  assert.equal(isTemplateLockTarget("unknown"), false)
})
