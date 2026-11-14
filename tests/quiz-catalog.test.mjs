import assert from "node:assert/strict"
import test from "node:test"

import { parseCourseQuizCounts } from "../src/quiz-catalog.ts"

test("zählt LiaScript-Quizgruppen je Folie statt einzelner Optionen", () => {
  const markdown = [
    "<!--",
    "@Demo: [[kein Kursquiz]]",
    "-->",
    "# Erste Folie",
    "Lücken [[eins]] und [[zwei]].",
    "[[?]] Ein Hinweis.",
    "",
    "- [[X]] Richtig",
    "",
    "        ``` markdown",
    "        - [[X]] nur ein Beispiel",
    "        ```",
    "",
    "- [[ ]] Falsch",
    "# Zweite Folie",
    "[[drei]]",
    "[[vier]]",
    "",
    "[[Spalte A] [Spalte B]]",
    "[ [X] [ ] ] Zeile A",
    "[ [ ] [X] ] Zeile B",
    "",
    "``` markdown",
    "[[kein Quiz im Codeblock]]",
    "```",
  ].join("\n")

  assert.deepEqual([...parseCourseQuizCounts(markdown)], [
    [0, 2],
    [1, 3],
  ])
})

test("zählt mehrzeilige Auswahl- und Drag-and-drop-Blöcke einmal", () => {
  const markdown = [
    "# Quiz",
    "[[ Option A",
    "| (Option B)",
    "]]",
    "",
    "[->[ Karte A",
    "| (Karte B)",
    "]]",
    "",
    "[[!]]",
  ].join("\n")

  assert.deepEqual([...parseCourseQuizCounts(markdown)], [[0, 3]])
})
