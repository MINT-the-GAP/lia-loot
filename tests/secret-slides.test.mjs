import assert from "node:assert/strict"
import test from "node:test"

import {
  deduplicateSecretSections,
  nextPublicSection,
  normalizeSecretTitle,
  publicFallbackSection,
} from "../src/secret-slides.ts"

test("dedupliziert native und geklonte Geheimlinks pro Folie", () => {
  assert.deepEqual(deduplicateSecretSections([2, 2, 4, 2, 4]), [2, 4])
  assert.deepEqual(deduplicateSecretSections([4, 2]), [4, 2])
})

test("normalisiert Geheimtitel exakt, aber tolerant für Unicode und Leerraum", () => {
  assert.equal(
    normalizeSecretTitle("  DAS   geheime\nLabor  "),
    "das geheime labor",
  )
  assert.equal(normalizeSecretTitle("GRU\u0308NE TÜR"), "grüne tür")
  assert.notEqual(normalizeSecretTitle("Geheimes Labor"), "geheimes")
})

test("überspringt zusammenhängende Geheimfolien in beide Richtungen", () => {
  const secrets = new Set([2, 3, 4])
  assert.equal(nextPublicSection(secrets, 7, 1, 1), 5)
  assert.equal(nextPublicSection(secrets, 7, 5, -1), 1)
  assert.equal(nextPublicSection(secrets, 7, 6, 1), null)
})

test("wählt den öffentlichen Fallback anhand der Navigationsrichtung", () => {
  const secrets = new Set([2, 3])
  assert.equal(publicFallbackSection(secrets, 6, 2, 1), 4)
  assert.equal(publicFallbackSection(secrets, 6, 3, 4), 1)
})

test("weicht an Kursrändern auf die andere Richtung aus", () => {
  assert.equal(publicFallbackSection(new Set([0]), 3, 0, null), 1)
  assert.equal(publicFallbackSection(new Set([2]), 3, 2, 1), 1)
  assert.equal(publicFallbackSection(new Set([0, 1]), 2, 0, null), null)
})
