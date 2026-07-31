import assert from "node:assert/strict"
import test from "node:test"

class FakeClassList {
  constructor(element) {
    this.element = element
  }

  tokens() {
    return new Set(this.element.className.split(/\s+/u).filter(Boolean))
  }

  add(...values) {
    const tokens = this.tokens()
    values.forEach((value) => tokens.add(value))
    this.element.className = [...tokens].join(" ")
  }

  remove(...values) {
    const tokens = this.tokens()
    values.forEach((value) => tokens.delete(value))
    this.element.className = [...tokens].join(" ")
  }

  contains(value) {
    return this.tokens().has(value)
  }
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase()
    this.attributes = new Map()
    this.children = []
    this.className = ""
    this.classList = new FakeClassList(this)
    this.dataset = {}
    this.hidden = false
    this.listeners = new Map()
    this.parentElement = null
    this.scrollTop = 0
    this.textContent = ""
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? []
    listeners.push(listener)
    this.listeners.set(type, listeners)
  }

  append(...elements) {
    elements.forEach((element) => {
      element.parentElement = this
      this.children.push(element)
    })
  }

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener(event)
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null
  }

  querySelectorAll(selector) {
    const className = selector.startsWith(".") ? selector.slice(1) : null
    const matches = []
    const visit = (element) => {
      for (const child of element.children) {
        if (className && child.classList.contains(className)) matches.push(child)
        visit(child)
      }
    }
    visit(this)
    return matches
  }

  remove() {
    if (!this.parentElement) return
    const index = this.parentElement.children.indexOf(this)
    if (index >= 0) this.parentElement.children.splice(index, 1)
    this.parentElement = null
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value))
  }

  get childElementCount() {
    return this.children.length
  }

  get offsetWidth() {
    return 1
  }

  get scrollHeight() {
    return this.children.length * 120
  }
}

function fakeDocument() {
  const documentElement = new FakeElement("html")
  const body = new FakeElement("body")
  documentElement.append(body)

  return {
    body,
    documentElement,
    createElement: (tagName) => new FakeElement(tagName),
    createElementNS: (_namespace, tagName) => new FakeElement(tagName),
    getElementById(id) {
      let found = null
      const visit = (element) => {
        if (element.id === id) found = element
        if (found) return
        element.children.forEach(visit)
      }
      visit(documentElement)
      return found
    },
  }
}

test("stapelt neue Erfolge nach oben und hält den neuesten direkt sichtbar", async () => {
  const previousDocument = globalThis.document
  const document = fakeDocument()
  globalThis.document = document

  try {
    const { showAchievement } = await import(
      `../src/achievement-overlay.ts?stack=${Date.now()}`
    )
    const first = {
      id: "first-achievement",
      title: "Erster Erfolg",
      message: "Die erste Meldung bleibt sichtbar.",
    }
    const second = {
      id: "second-achievement",
      title: "Zweiter Erfolg",
      message: "Die neue Meldung erscheint direkt darunter.",
    }

    showAchievement(first)
    showAchievement(second)
    showAchievement(second)

    const overlay = document.getElementById("lia-loot-achievement-overlay")
    assert.ok(overlay)
    assert.equal(overlay.hidden, false)
    assert.deepEqual(
      overlay.children.map((card) => card.dataset.achievementId),
      ["first-achievement", "second-achievement"],
    )
    assert.equal(overlay.scrollTop, overlay.scrollHeight)
    assert.equal(
      overlay.children[1].querySelector(".loot-achievement__title").textContent,
      "Zweiter Erfolg",
    )

    overlay.children[1]
      .querySelector(".loot-achievement__close")
      .dispatch("click")
    assert.equal(overlay.childElementCount, 1)
    assert.equal(overlay.hidden, false)

    overlay.children[0]
      .querySelector(".loot-achievement__close")
      .dispatch("click")
    assert.equal(overlay.childElementCount, 0)
    assert.equal(overlay.hidden, true)
  } finally {
    if (previousDocument === undefined) delete globalThis.document
    else globalThis.document = previousDocument
  }
})

test("blendet jede Erfolgsmeldung nach eigenen zwölf Sekunden automatisch aus", async () => {
  const previousDocument = globalThis.document
  const previousSetTimeout = globalThis.setTimeout
  const previousClearTimeout = globalThis.clearTimeout
  const document = fakeDocument()
  const scheduled = new Map()
  let nextTimer = 0
  globalThis.document = document
  globalThis.setTimeout = (callback, delay) => {
    nextTimer += 1
    scheduled.set(nextTimer, { callback, delay })
    return nextTimer
  }
  globalThis.clearTimeout = (timer) => {
    scheduled.delete(timer)
  }

  try {
    const { ACHIEVEMENT_AUTO_HIDE_MS, showAchievement } = await import(
      `../src/achievement-overlay.ts?auto-hide=${Date.now()}`
    )
    showAchievement({
      id: "first-auto-hide",
      title: "Erster Erfolg",
      message: "Verschwindet zuerst.",
    })
    showAchievement({
      id: "second-auto-hide",
      title: "Zweiter Erfolg",
      message: "Hat einen eigenen Timer.",
    })

    assert.equal(ACHIEVEMENT_AUTO_HIDE_MS, 12_000)
    assert.deepEqual(
      [...scheduled.values()].map(({ delay }) => delay),
      [12_000, 12_000],
    )

    const overlay = document.getElementById("lia-loot-achievement-overlay")
    assert.ok(overlay)
    scheduled.get(1).callback()
    assert.deepEqual(
      overlay.children.map((card) => card.dataset.achievementId),
      ["second-auto-hide"],
    )
    assert.equal(overlay.hidden, false)

    scheduled.get(2).callback()
    assert.equal(overlay.childElementCount, 0)
    assert.equal(overlay.hidden, true)
  } finally {
    if (previousDocument === undefined) delete globalThis.document
    else globalThis.document = previousDocument
    globalThis.setTimeout = previousSetTimeout
    globalThis.clearTimeout = previousClearTimeout
  }
})
