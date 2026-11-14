import assert from "node:assert/strict"
import test from "node:test"

import {
  parseCourseStartInventory,
  seedStartInventory,
} from "../src/start-inventory.ts"
import {
  setLiaCourseRevision,
  setLiaCourseVersion,
} from "../src/course-identity.ts"
import { ShopStore } from "../src/shop-store.ts"

function memoryStorage() {
  const values = new Map()
  return {
    getItem(key) {
      return values.get(key) ?? null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
  }
}

function storesWithShop(shop) {
  return {
    cat: { collect: () => false, collectCollar: () => false },
    exploration: { collectTool: () => false },
    flashlight: { collect: () => false },
    keys: { collectKey: () => false },
    magnifier: { collect: () => false },
    puzzle: {
      collectPiece: () => false,
      isPieceCollected: () => false,
    },
    shop,
  }
}

test("katalogisiert alle unterstützten Startitems und ignoriert inaktive oder verpackte Funde", () => {
  const markdown = `<!--
version: 1.0.0
@HighscoreInfo(startinventar)
-->

# Start

@HighscoreInfo(STARTINVENTAR)
@Perk(HighscoreWert; von-anfang-an)
@Perk(energiekistenbonus-10; start)
@Perk(katzenhalsband-rot; startinventar)
@Atlaskarte(startinventar)
@Lupe(startinventar)
@Taschenlampe(startinventar)
@Schaufel(startinventar)
@Giesskanne(startinventar)
@Axt(startinventar)
@Katze(grau; startinventar)
@Schluessel(rot; startinventar)
Im Text liegt @Puzzleteil(blau; 1; startinventar).
@Puzzletor(blau; [[1]])

\`\`\`markdown
@Lupe(startinventar)
\`\`\`

@Geschenk(\`@Puzzleteil(blau; 1; startinventar)\`)
@Futter(\`@Schluessel(blau; startinventar)\`)
Im Nebel liegt @Nebel( @Puzzleteil(blau; 1; startinventar) ).
Unter der Erde liegt @Erdhaufen.inline( @Puzzleteil(blau; 1; startinventar) ).
@Unsichtbar( @Puzzleteil(blau; 1; startinventar) )

@lootif(Gold >= 1; spawn)
@Katze(schwarz; startinventar)
@Endelootif

@HighscoreInfo(startinventar; anker)
@Lupe(start; startinventar)
@Axt(startinventar; erde)
@Katze(grau; startinventar; unsichtbar)
@Schluessel(rot; menu; startinventar)
@Puzzleteil(blau; 2; startinventar; pflanze)
`

  const parsed = parseCourseStartInventory(markdown)
  assert.equal(parsed.declarations.length, 13)
  assert.deepEqual(
    parsed.declarations.map(({ grant }) => grant.kind),
    [
      "shop",
      "shop",
      "shop",
      "shop",
      "shop",
      "magnifier",
      "flashlight",
      "tool",
      "tool",
      "tool",
      "cat",
      "key",
      "puzzle-piece",
    ],
  )
  assert.deepEqual(parsed.declarations[10].grant, {
    kind: "cat",
    variant: "grey",
  })
  assert.deepEqual(parsed.declarations[11].grant, {
    color: "red",
    kind: "key",
  })
  assert.deepEqual(parsed.declarations[12].grant, {
    color: "blue",
    kind: "puzzle-piece",
    number: 1,
  })
  assert.equal(parsed.diagnostics.length, 6)
  assert.ok(parsed.diagnostics.every(({ message }) => message.includes("nicht ins Startinventar")))
})

test("vergibt Startitems über vorhandene Store-Methoden genau einmal", () => {
  const calls = {
    cats: new Set(),
    collars: new Set(),
    flashlight: 0,
    keys: new Set(),
    magnifier: 0,
    pieces: new Set(),
    purchases: new Set(),
    tools: new Set(),
  }
  const stores = {
    cat: {
      collect(variant) {
        const size = calls.cats.size
        calls.cats.add(variant)
        return calls.cats.size > size
      },
      collectCollar(color) {
        const size = calls.collars.size
        calls.collars.add(color)
        return calls.collars.size > size
      },
    },
    exploration: {
      collectTool(tool) {
        const size = calls.tools.size
        calls.tools.add(tool)
        return calls.tools.size > size
      },
    },
    flashlight: {
      collect() {
        if (calls.flashlight > 0) return false
        calls.flashlight += 1
        return true
      },
    },
    keys: {
      collectKey(id, color) {
        const key = `${id}:${color}`
        const size = calls.keys.size
        calls.keys.add(key)
        return calls.keys.size > size
      },
    },
    magnifier: {
      collect() {
        if (calls.magnifier > 0) return false
        calls.magnifier += 1
        return true
      },
    },
    puzzle: {
      collectPiece(color, number) {
        const key = `${color}:${number}`
        const size = calls.pieces.size
        calls.pieces.add(key)
        return calls.pieces.size > size
      },
      isPieceCollected(color, number) {
        return calls.pieces.has(`${color}:${number}`)
      },
    },
    shop: {
      isPurchased(id) {
        return calls.purchases.has(id)
      },
      recordPurchase(id) {
        const size = calls.purchases.size
        calls.purchases.add(id)
        return calls.purchases.size > size
      },
    },
  }
  const declarations = [
    { grant: { kind: "magnifier" }, id: "m", section: 0, sourceOrder: 0 },
    { grant: { kind: "flashlight" }, id: "f", section: 0, sourceOrder: 1 },
    { grant: { kind: "tool", tool: "axe" }, id: "a", section: 0, sourceOrder: 2 },
    { grant: { kind: "cat", variant: "orange" }, id: "c", section: 0, sourceOrder: 3 },
    { grant: { kind: "key", color: "red" }, id: "k", section: 0, sourceOrder: 4 },
    { grant: { kind: "puzzle-piece", color: "blue", number: 1 }, id: "p", section: 0, sourceOrder: 5 },
    { grant: { kind: "shop", grant: { kind: "perk", perk: "magnifier-radius", percent: 10 } }, id: "s", section: 0, sourceOrder: 6 },
    { grant: { kind: "shop", grant: { kind: "collar", color: "red" } }, id: "h", section: 0, sourceOrder: 7 },
  ]

  assert.deepEqual(seedStartInventory(declarations, stores), [])
  assert.deepEqual(seedStartInventory(declarations, stores), [])
  assert.equal(calls.magnifier, 1)
  assert.equal(calls.flashlight, 1)
  assert.deepEqual([...calls.tools], ["axe"])
  assert.deepEqual([...calls.cats], ["orange"])
  assert.equal(calls.keys.size, 1)
  assert.equal(calls.pieces.size, 1)
  assert.equal(calls.purchases.size, 2)
  assert.deepEqual([...calls.collars], ["red"])
})

test("isoliert Startinventar über Kursversion und Quellrevision", () => {
  const previousWindow = globalThis.window
  const storage = memoryStorage()
  globalThis.window = {
    LIA: { defaultCourseURL: "https://example.test/course.md" },
    location: {
      href: "https://example.test/course.md",
      pathname: "/course.md",
      search: "",
    },
    sessionStorage: storage,
  }
  const declarations = [{
    grant: { kind: "shop", grant: { kind: "unlock", unlock: "highscore-info" } },
    id: "start-inventory:highscoreinfo:1:0",
    section: 0,
    sourceOrder: 1,
  }]

  try {
    setLiaCourseVersion("1.0.0")
    setLiaCourseRevision("source-a")
    const original = new ShopStore()
    seedStartInventory(declarations, storesWithShop(original))
    assert.equal(original.hasUnlock("highscore-info"), true)

    setLiaCourseVersion("2.0.0")
    setLiaCourseRevision("source-a")
    assert.equal(new ShopStore().hasUnlock("highscore-info"), false)

    setLiaCourseVersion("1.0.0")
    setLiaCourseRevision("source-b")
    assert.equal(new ShopStore().hasUnlock("highscore-info"), false)

    setLiaCourseVersion("1.0.0")
    setLiaCourseRevision("source-a")
    assert.equal(new ShopStore().hasUnlock("highscore-info"), true)
  } finally {
    globalThis.window = previousWindow
  }
})
