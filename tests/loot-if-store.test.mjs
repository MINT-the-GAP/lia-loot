import assert from "node:assert/strict"
import test from "node:test"

import { LootIfStore } from "../src/loot-if-store.ts"

function browserSession(search = "?loot-if=1", data = new Map()) {
  globalThis.window = {
    location: {
      href: `https://example.test/loot-course${search}`,
      origin: "https://example.test",
      pathname: "/loot-course",
      search,
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, String(value)),
    },
  }
  return data
}

function emptyState() {
  return {
    version: 1,
    highlightedColors: [],
    highlightedWords: [],
    openedLockTargets: [],
    secretSlideVisited: false,
    solvedQuizzes: [],
    spawned: [],
  }
}

test("speichert Spawns, Quizloesungen und Geheimfolienbesuch idempotent", () => {
  browserSession()
  const store = new LootIfStore()

  assert.deepEqual(store.state(), emptyState())
  assert.equal(store.spawn(" spawn-1 "), true)
  assert.equal(store.spawn("spawn-1"), false)
  assert.equal(store.spawn("   "), false)
  assert.equal(store.isSpawned("spawn-1"), true)

  assert.equal(store.recordSolvedQuiz(" quiz-1 "), true)
  assert.equal(store.recordSolvedQuiz("quiz-1"), false)
  assert.equal(store.recordSolvedQuiz(""), false)
  assert.equal(store.isQuizSolved(" quiz-1 "), true)

  assert.equal(store.recordSecretSlideVisit(), true)
  assert.equal(store.recordSecretSlideVisit(), false)
  assert.equal(store.state().secretSlideVisited, true)

  assert.equal(store.recordOpenedLockTarget("Übersetzer"), true)
  assert.equal(store.recordOpenedLockTarget("translator"), false)
  assert.equal(store.recordOpenedLockTarget("unbekannt"), false)
  assert.equal(store.hasOpenedLockTarget("translator"), true)
})

test("speichert Markierungen farb- und optional wortgenau", () => {
  browserSession("?highlights=1")
  const store = new LootIfStore()

  assert.equal(store.recordHighlightColor("yellow"), true)
  assert.equal(store.recordHighlightColor("yellow"), false)
  assert.equal(store.recordHighlightColor("violet"), false)
  assert.equal(store.hasHighlight("yellow"), true)
  assert.equal(store.hasHighlight("yellow", "Wort"), false)

  assert.equal(store.recordHighlight("red", "  SCHÖNE   Häuser "), true)
  assert.equal(store.recordHighlight("red", "schöne häuser"), false)
  assert.equal(store.recordHighlight("blue", "schöne häuser"), true)
  assert.equal(store.recordHighlight("violet", "Wort"), false)
  assert.equal(store.recordHighlight("red", "   "), false)
  assert.equal(store.recordHighlight("red", "x".repeat(513)), false)

  assert.equal(store.hasHighlight("red"), true)
  assert.equal(store.hasHighlight("red", "Schöne\tHäuser"), true)
  assert.equal(store.hasHighlight("blue", "Schöne Häuser"), true)
  assert.equal(store.hasHighlight("orange"), false)
  assert.equal(store.hasHighlight("red", "anderes Wort"), false)
  assert.equal(store.hasHighlight("red", ""), false)
})

test("persistiert den vollstaendigen Zustand innerhalb desselben Kurses", () => {
  const data = browserSession("?persistence=1")
  const first = new LootIfStore()
  first.spawn("spawn-1")
  first.recordSolvedQuiz("0:0")
  first.recordSolvedQuiz("1:2")
  first.recordSecretSlideVisit()
  first.recordOpenedLockTarget("check")
  first.recordHighlight("orange", "Fundwort")

  browserSession("?persistence=1", data)
  const restored = new LootIfStore()
  assert.deepEqual(restored.state(), first.state())
  assert.equal(restored.isSpawned("spawn-1"), true)
  assert.equal(restored.isQuizSolved("1:2"), true)
  assert.equal(restored.hasHighlight("orange", "fundwort"), true)
  assert.equal(restored.hasOpenedLockTarget("Prüfen"), true)
})

test("migriert den fruehen v1-Zustand ohne gespeicherte Schlossziele", () => {
  const data = browserSession("?v1-lock-target-migration=1")
  const seed = new LootIfStore()
  seed.spawn("seed")
  const key = [...data.keys()].find((candidate) =>
    candidate.includes("lia-loot:loot-if:v1:"),
  )
  assert.ok(key)
  const legacyState = {
    ...emptyState(),
    highlightedColors: ["yellow"],
    spawned: ["spawn-1"],
  }
  delete legacyState.openedLockTargets
  data.set(key, JSON.stringify(legacyState))

  const restored = new LootIfStore()
  assert.equal(restored.isSpawned("spawn-1"), true)
  assert.equal(restored.hasHighlight("yellow"), true)
  assert.deepEqual(restored.state().openedLockTargets, [])
})

test("isoliert lootif-Fortschritt zwischen unterschiedlichen Kurs-URLs", () => {
  const data = browserSession("?course=one")
  const first = new LootIfStore()
  first.spawn("shared-id")
  first.recordSolvedQuiz("0:0")
  first.recordSecretSlideVisit()
  first.recordHighlight("green", "Wort")

  browserSession("?course=two", data)
  assert.deepEqual(new LootIfStore().state(), emptyState())

  browserSession("?course=one", data)
  assert.equal(new LootIfStore().isSpawned("shared-id"), true)
})

test("liefert defensive Kopien einschliesslich verschachtelter Markierungen", () => {
  browserSession("?copies=1")
  const store = new LootIfStore()
  store.spawn("spawn-1")
  store.recordSolvedQuiz("quiz-1")
  store.recordSecretSlideVisit()
  store.recordHighlight("pink", "Wort")

  const snapshot = store.state()
  snapshot.spawned.push("spawn-2")
  snapshot.solvedQuizzes.length = 0
  snapshot.secretSlideVisited = false
  snapshot.highlightedColors.length = 0
  snapshot.openedLockTargets.push("check")
  snapshot.highlightedWords[0].word = "veraendert"
  snapshot.highlightedWords.push({ color: "red", word: "neu" })

  assert.deepEqual(store.state(), {
    version: 1,
    highlightedColors: ["pink"],
    highlightedWords: [{ color: "pink", word: "wort" }],
    openedLockTargets: [],
    secretSlideVisited: true,
    solvedQuizzes: ["quiz-1"],
    spawned: ["spawn-1"],
  })
})

test("verwirft kaputte, inkonsistente und doppelte Speicherzustaende", () => {
  const invalidStates = [
    "{kaputt",
    JSON.stringify({ ...emptyState(), version: 2 }),
    JSON.stringify({ ...emptyState(), secretSlideVisited: "ja" }),
    JSON.stringify({ ...emptyState(), spawned: [""] }),
    JSON.stringify({ ...emptyState(), spawned: ["id", " id "] }),
    JSON.stringify({ ...emptyState(), solvedQuizzes: ["q", "q"] }),
    JSON.stringify({ ...emptyState(), highlightedColors: "red" }),
    JSON.stringify({
      ...emptyState(),
      highlightedColors: ["red", "red"],
    }),
    JSON.stringify({ ...emptyState(), highlightedColors: ["violet"] }),
    JSON.stringify({ ...emptyState(), openedLockTargets: null }),
    JSON.stringify({ ...emptyState(), openedLockTargets: ["unbekannt"] }),
    JSON.stringify({ ...emptyState(), openedLockTargets: ["check", "check"] }),
    JSON.stringify({
      ...emptyState(),
      highlightedWords: [{ color: "violet", word: "Wort" }],
    }),
    JSON.stringify({
      ...emptyState(),
      highlightedWords: [{ color: "red", word: "" }],
    }),
    JSON.stringify({
      ...emptyState(),
      highlightedWords: [{ color: "red", word: "x".repeat(513) }],
    }),
    JSON.stringify({
      ...emptyState(),
      highlightedWords: [
        { color: "red", word: "Wort" },
        { color: "red", word: " wort " },
      ],
    }),
  ]

  for (const [index, invalid] of invalidStates.entries()) {
    const data = browserSession(`?corrupt=${index}`)
    const seed = new LootIfStore()
    seed.spawn("seed")
    const key = [...data.keys()].find((candidate) =>
      candidate.includes("lia-loot:loot-if:v1:"),
    )
    assert.ok(key)
    data.set(key, invalid)

    assert.deepEqual(new LootIfStore().state(), emptyState(), String(index))
  }
})

test("arbeitet bei gesperrtem SessionStorage im Speicher weiter", () => {
  globalThis.window = {
    location: {
      href: "https://example.test/loot-course?blocked-storage",
      origin: "https://example.test",
      pathname: "/loot-course",
      search: "?blocked-storage",
    },
    sessionStorage: {
      getItem() {
        throw new Error("blocked")
      },
      setItem() {
        throw new Error("blocked")
      },
    },
  }

  const store = new LootIfStore()
  assert.equal(store.spawn("spawn-1"), true)
  assert.equal(store.recordSolvedQuiz("quiz-1"), true)
  assert.equal(store.recordSecretSlideVisit(), true)
  assert.equal(store.recordOpenedLockTarget("check"), true)
  assert.equal(store.recordHighlight("yellow", "Wort"), true)
  assert.equal(store.isSpawned("spawn-1"), true)
  assert.equal(store.hasHighlight("yellow", "wort"), true)
})
