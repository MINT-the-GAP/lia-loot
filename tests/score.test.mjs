import assert from "node:assert/strict"
import test from "node:test"

import {
  calculateScore,
  createConfig,
  formatScore,
  trophyTier,
} from "../src/score.ts"

test("berechnet den Minutenabzug sekundengenau", () => {
  const config = createConfig(100, 10, 5, 1, 6)
  const state = { startedAt: 0, failedChecks: 1, hintsUsed: 1 }

  assert.equal(calculateScore(config, state, 60_999), 85)
  assert.equal(calculateScore(config, state, 61_000), 84.9)
  assert.equal(calculateScore(config, state, 90_000), 82)
})

test("berechnet auch nach gebrochenen Freiminuten nur volle Sekunden", () => {
  const config = createConfig(100, 0, 0, 0.01, 6)
  const state = { startedAt: 0, failedChecks: 0, hintsUsed: 0 }

  assert.equal(calculateScore(config, state, 1_599), 100)
  assert.equal(calculateScore(config, state, 1_600), 99.9)
})

test("begrenzt den Punktestand auf null", () => {
  const config = createConfig(100, 10, 5, 0, 0)
  const state = { startedAt: 0, failedChecks: 20, hintsUsed: 0 }

  assert.equal(calculateScore(config, state, 0), 0)
})

test("wendet die Trophäenschwellen auf den ungerundeten Wert an", () => {
  assert.equal(trophyTier(90, 100), "gold")
  assert.equal(trophyTier(75, 100), "silver")
  assert.equal(trophyTier(50, 100), "copper")
  assert.equal(trophyTier(49.999, 100), null)
})

test("formatiert höchstens eine Nachkommastelle", () => {
  assert.equal(formatScore(87.54), "87,5")
  assert.equal(formatScore(100), "100")
})

test("weist ungültige Konfigurationen zurück", () => {
  assert.throws(() => createConfig(0, 1, 1, 1, 1), TypeError)
  assert.throws(() => createConfig(100, -1, 1, 1, 1), TypeError)
})
