import assert from "node:assert/strict"
import test from "node:test"

import {
  GLOBAL_LOCK_TARGETS,
  isGlobalLockTarget,
  isLocalLockTarget,
  LOCAL_LOCK_TARGETS,
  resolveLockTarget,
} from "../src/lock-targets.ts"

test("definiert alle zehn kanonischen Schlossziele", () => {
  assert.deepEqual([...GLOBAL_LOCK_TARGETS], [
    "toc",
    "mode",
    "menu",
    "translator",
    "classroom",
    "info",
    "seitenwechsel",
  ])
  assert.deepEqual([...LOCAL_LOCK_TARGETS], ["check", "resolve", "hint"])

  const allTargets = [...GLOBAL_LOCK_TARGETS, ...LOCAL_LOCK_TARGETS]
  assert.equal(allTargets.length, 10)
  assert.equal(new Set(allTargets).size, 10)
})

test("löst jeden kanonischen Zielnamen unverändert auf", () => {
  for (const target of [...GLOBAL_LOCK_TARGETS, ...LOCAL_LOCK_TARGETS]) {
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
  ]

  for (const [alias, expected] of aliases) {
    assert.equal(resolveLockTarget(alias), expected, alias)
  }
})

test("klassifiziert globale und quizlokale Ziele disjunkt", () => {
  for (const target of GLOBAL_LOCK_TARGETS) {
    assert.equal(isGlobalLockTarget(target), true, target)
    assert.equal(isLocalLockTarget(target), false, target)
  }

  for (const target of LOCAL_LOCK_TARGETS) {
    assert.equal(isGlobalLockTarget(target), false, target)
    assert.equal(isLocalLockTarget(target), true, target)
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
  ]

  for (const value of invalidValues) {
    assert.equal(resolveLockTarget(value), null, String(value))
  }

  assert.equal(isGlobalLockTarget("unknown"), false)
  assert.equal(isLocalLockTarget("unknown"), false)
})
