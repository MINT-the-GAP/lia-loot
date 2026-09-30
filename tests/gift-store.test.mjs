import assert from "node:assert/strict"
import test from "node:test"

import { GiftStore } from "../src/gift-store.ts"
import { parseCourseGiftDeclarations } from "../src/course-chests.ts"

function browserSession(search = "?gifts=1", data = new Map()) {
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/gift-course",
      search,
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, String(value)),
      removeItem: (key) => data.delete(key),
    },
  }
  return data
}

test("merkt sich jedes geöffnete Geschenk genau einmal", () => {
  browserSession()
  const store = new GiftStore()

  assert.deepEqual(store.state(), { version: 1, opened: [] })
  assert.equal(store.open("gift:one"), true)
  assert.equal(store.open("gift:one"), false)
  assert.equal(store.open("gift:two"), true)
  assert.deepEqual(store.state(), {
    version: 1,
    opened: ["gift:one", "gift:two"],
  })
  assert.equal(new GiftStore().isOpened("gift:one"), true)
})

test("trennt geöffnete Geschenke zwischen Kursen", () => {
  const data = browserSession("?course=one")
  new GiftStore().open("gift:one")

  browserSession("?course=two", data)
  assert.deepEqual(new GiftStore().state(), { version: 1, opened: [] })
})

test("verwirft beschädigte Geschenkzustände", () => {
  const data = browserSession("?corrupt")
  new GiftStore().open("gift:one")
  const [storageKey] = data.keys()
  data.set(
    storageKey,
    JSON.stringify({ version: 1, opened: ["gift:one", "gift:one"] }),
  )

  assert.deepEqual(new GiftStore().state(), { version: 1, opened: [] })
})

test("liest direkte und geschützte verschachtelte Geschenk-Inhalte", () => {
  const markdown = `
# Geschenke

@Geschenk(@Katze)
@Geschenk(\`@Schluessel(blau)\`)

\`@Geschenk(@Schatztruhe)\`

\`\`\`markdown
@Geschenk(@Lupe)
\`\`\`
`

  assert.deepEqual(parseCourseGiftDeclarations(markdown), [
    { content: "@Katze", section: 0, sourceOrder: 0 },
    { content: "@Schluessel(blau)", section: 0, sourceOrder: 1 },
  ])
})
