import assert from "node:assert/strict"
import test from "node:test"

import {
  parseSlidePortalOptions,
  validateSlidePortalTarget,
} from "../src/slide-portal-options.ts"
import {
  normalizeSlidePortalRoute,
  transitionSlidePortalRoute,
} from "../src/slide-portal-route.ts"

const assertValidOptions = (raw, defaultMode, targetSection, mode) => {
  const parsed = parseSlidePortalOptions(raw, defaultMode)

  assert.equal(parsed.valid, true, raw)
  assert.equal(parsed.targetSection, targetSection, raw)
  assert.equal(parsed.mode, mode, raw)
  assert.deepEqual(parsed.errors, [], raw)
}

const assertInvalidOptions = (raw, defaultMode = "two-way") => {
  const parsed = parseSlidePortalOptions(raw, defaultMode)

  assert.equal(parsed.valid, false, raw)
  assert.equal(parsed.targetSection, null, raw)
  assert.ok(parsed.errors.length > 0, raw)
}

test("liest Folienziele 1-basiert und speichert sie intern 0-basiert", () => {
  assertValidOptions("1", "two-way", 0, "two-way")
  assertValidOptions(" 7 ", "one-way", 6, "one-way")
  assertValidOptions("42", "two-way", 41, "two-way")
})

test("verwirft leere, nicht-positive, gebrochene und textuelle Ziele", () => {
  for (const raw of ["", "   ", "0", "-1", "2.5", "drei"]) {
    assertInvalidOptions(raw)
  }
})

test("normalisiert Einweg- und Zweiweg-Aliase unabhängig von Großschreibung", () => {
  assertValidOptions("3; einweg", "two-way", 2, "one-way")
  assertValidOptions("3; EINBAHNSTRASSE", "two-way", 2, "one-way")
  assertValidOptions("3; hinundher", "one-way", 2, "two-way")
  assertValidOptions("3; ZWEIWEG", "one-way", 2, "two-way")
})

test("verwendet ohne Modusoption den vom Makro vorgegebenen Standard", () => {
  assertValidOptions("2", "two-way", 1, "two-way")
  assertValidOptions("2", "one-way", 1, "one-way")
})

test("weist widersprüchliche und unbekannte Portaloptionen zurück", () => {
  for (const raw of [
    "2; einweg; hinundher",
    "2; teleport",
    "2; 3",
  ]) {
    assertInvalidOptions(raw)
  }
})

test("validiert Ziel, Quellfolie und noch unbekannte Kurslänge getrennt", () => {
  assert.equal(validateSlidePortalTarget(2, 0, 5), "valid")
  assert.equal(validateSlidePortalTarget(2, 2, 5), "same-slide")
  assert.equal(validateSlidePortalTarget(2, 2, null), "same-slide")
  assert.equal(validateSlidePortalTarget(2, 0, null), "pending")
  assert.equal(validateSlidePortalTarget(-1, 0, null), "missing")
  assert.equal(validateSlidePortalTarget(5, 0, 5), "missing")
  assert.equal(validateSlidePortalTarget(1.5, 0, 5), "missing")
})

const pendingRoute = {
  version: 1,
  portalId: "portal-a",
  sourceSection: 0,
  targetSection: 3,
  phase: "pending",
  expiresAt: 5_000,
}

test("normalisiert einen gültigen, noch nicht abgelaufenen Portalrückweg", () => {
  assert.deepEqual(normalizeSlidePortalRoute(pendingRoute, 1_000), pendingRoute)
})

test("verwirft beschädigte und abgelaufene Portalrückwege fail-closed", () => {
  const invalidRoutes = [
    null,
    "portal",
    {},
    { ...pendingRoute, version: 2 },
    { ...pendingRoute, portalId: "" },
    { ...pendingRoute, sourceSection: -1 },
    { ...pendingRoute, sourceSection: 0.5 },
    { ...pendingRoute, targetSection: -1 },
    { ...pendingRoute, targetSection: 3.5 },
    { ...pendingRoute, targetSection: pendingRoute.sourceSection },
    { ...pendingRoute, phase: "unknown" },
    { ...pendingRoute, expiresAt: "5000" },
    { ...pendingRoute, expiresAt: Number.POSITIVE_INFINITY },
  ]

  for (const value of invalidRoutes) {
    assert.equal(normalizeSlidePortalRoute(value, 1_000), null)
  }

  assert.equal(
    normalizeSlidePortalRoute({ ...pendingRoute, expiresAt: 1_000 }, 1_000),
    null,
  )
})

test("führt einen Rückweg von pending über arrived zurück zur Quelle", () => {
  assert.deepEqual(transitionSlidePortalRoute(pendingRoute, null), {
    route: pendingRoute,
    showReturn: false,
  })
  assert.deepEqual(transitionSlidePortalRoute(pendingRoute, 0), {
    route: pendingRoute,
    showReturn: false,
  })

  const arrived = { ...pendingRoute, phase: "arrived" }
  assert.deepEqual(transitionSlidePortalRoute(pendingRoute, 3), {
    route: arrived,
    showReturn: true,
  })
  assert.deepEqual(transitionSlidePortalRoute(arrived, 3), {
    route: arrived,
    showReturn: true,
  })
  assert.deepEqual(transitionSlidePortalRoute(arrived, 0), {
    route: null,
    showReturn: false,
  })
})

test("löscht den Rückweg, sobald statt Ziel oder Quelle eine dritte Folie aktiv wird", () => {
  assert.deepEqual(transitionSlidePortalRoute(pendingRoute, 2), {
    route: null,
    showReturn: false,
  })
  assert.deepEqual(
    transitionSlidePortalRoute({ ...pendingRoute, phase: "arrived" }, 2),
    { route: null, showReturn: false },
  )
})
