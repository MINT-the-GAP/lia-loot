import assert from "node:assert/strict"
import test from "node:test"

import { normalizeHiddenMacroArgumentText } from "../src/hidden-arguments.ts"

const marker = (index) => `LIALOOTHIDDEN7QARGSEP${index}X9END`
const missingTail = (start) =>
  Array.from(
    { length: 10 - start },
    (_, offset) => `${marker(start + offset)}@${start + offset}`,
  ).join("")

test("setzt durch LiaScript getrennte Kommafragmente wieder zusammen", () => {
  const authored =
    `Hallo${marker(1)} das hier ist ein Test` + missingTail(2)

  assert.equal(
    normalizeHiddenMacroArgumentText(authored),
    "Hallo, das hier ist ein Test",
  )
})

test("bewahrt mehrere Kommas und geschuetzten Gesamtinhalt", () => {
  const fragments = [
    "Eins",
    " zwei",
    " drei",
    " vier",
    " fuenf",
    " sechs",
    " sieben",
    " acht",
    " neun",
    " zehn",
  ]
  const split = fragments
    .map((fragment, index) =>
      index === 0 ? fragment : `${marker(index)}${fragment}`,
    )
    .join("")
  const protectedText =
    "Mit Backticks, bleibt alles erhalten" + missingTail(1)

  assert.equal(normalizeHiddenMacroArgumentText(split), fragments.join(","))
  assert.equal(
    normalizeHiddenMacroArgumentText(protectedText),
    "Mit Backticks, bleibt alles erhalten",
  )
})

test("laesst interne Payloads ohne Trenner unangetastet", () => {
  assert.equal(normalizeHiddenMacroArgumentText("@1"), "@1")
  assert.equal(
    normalizeHiddenMacroArgumentText("Direkter Inhalt"),
    "Direkter Inhalt",
  )
  assert.equal(normalizeHiddenMacroArgumentText("@0" + missingTail(1)), "")
})
