import assert from "node:assert/strict"
import test from "node:test"

class FakeHTMLElement {
  constructor(tagName = "DIV") {
    this.attributes = new Map()
    this.children = []
    this.dataset = {}
    this.disabled = false
    this.hidden = false
    this.inert = false
    this.parentElement = null
    this.tagName = tagName
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  hasAttribute(name) {
    return this.attributes.has(name)
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value))
  }
}

globalThis.HTMLElement = FakeHTMLElement

const {
  lootIfAuthoredRuntimeId,
  lootIfQuizCheckIsReachable,
  lootIfQuizId,
  lootIfQuizInputTrack,
  lootIfQuizRendererAnchor,
} = await import("../src/loot-if.ts")

function checkControl() {
  return new FakeHTMLElement("BUTTON")
}

function quiz({ anchor = null, authoredId = null, track = null } = {}) {
  const node = new FakeHTMLElement("SECTION")
  const check = checkControl()
  const resolve = checkControl()
  const answer = anchor ? new FakeHTMLElement("DIV") : null
  if (authoredId) node.setAttribute("id", authoredId)
  if (answer) answer.setAttribute("aria-labelledby", anchor)

  node.querySelector = (selector) => {
    if (selector === ".lia-quiz__check") return check
    if (selector === ".lia-quiz__resolve") return resolve
    return null
  }
  node.querySelectorAll = (selector) =>
    selector === ".lia-quiz__answers[aria-labelledby]" && answer
      ? [answer]
      : []

  if (track) {
    const wrapper = new FakeHTMLElement("DIV")
    const input = new FakeHTMLElement("INPUT")
    input.setAttribute(
      "oninput",
      `send.lia("track: [[\"quiz\",${track.section}],[\"input\",${track.input}]]")`,
    )
    wrapper.querySelectorAll = (selector) => {
      if (selector === ".lia-quiz") return [node]
      if (selector === "[oninput], [onchange], [onclick]") return [input]
      return []
    }
    node.parentElement = wrapper
    node.trackWrapper = wrapper
  }
  return node
}

function courseWithSlides(...slideQuizzes) {
  const container = new FakeHTMLElement("DIV")
  const slides = slideQuizzes.map((quizzes) => {
    const slide = new FakeHTMLElement("MAIN")
    slide.className = "lia-slide__content"
    slide.quizzes = quizzes
    slide.querySelectorAll = (selector) =>
      selector === ".lia-quiz" ? slide.quizzes : []
    slide.parentElement = container
    for (const item of quizzes) {
      const wrapper = item.trackWrapper
      if (wrapper) wrapper.parentElement = slide
      else item.parentElement = slide
      item.closest = (selector) =>
        selector === "main.lia-slide__content, main" ? slide : null
    }
    return slide
  })
  container.children = slides

  globalThis.document = {
    querySelector(selector) {
      return selector.includes("main.lia-slide__content") ? slides[0] : null
    },
    querySelectorAll(selector) {
      return selector === ".lia-quiz"
        ? slides.flatMap((slide) => slide.quizzes)
        : []
    },
  }
  return slides
}

test("akzeptiert nur expandierte, nichtleere lootif-IDs", () => {
  assert.equal(lootIfAuthoredRuntimeId("  section-1_7  "), "section-1_7")
  assert.equal(lootIfAuthoredRuntimeId("@uid"), null)
  assert.equal(lootIfAuthoredRuntimeId(" @0 "), null)
  assert.equal(lootIfAuthoredRuntimeId(""), null)
  assert.equal(lootIfAuthoredRuntimeId(null), null)
})

test("liest stabile Lia-Tracks und Renderer-Anker", () => {
  const tracked = quiz({ track: { section: 3, input: 7 } })
  assert.deepEqual(lootIfQuizInputTrack(tracked), { section: 3, input: 7 })

  const anchored = quiz({ anchor: "prompt-a answer-a" })
  assert.equal(
    lootIfQuizRendererAnchor(anchored),
    "prompt-a answer-a",
  )
})

test("behält Lia-Quiz-IDs über Remount und vorherige DOM-Einfügung stabil", () => {
  const tracked = quiz({ track: { section: 0, input: 4 } })
  const anchored = quiz({ anchor: "7a9bc123" })
  const slides = courseWithSlides([tracked, anchored], [])

  const trackedId = lootIfQuizId(tracked)
  const anchoredId = lootIfQuizId(anchored)
  assert.equal(trackedId, "section-0:lia-input-4")
  assert.equal(anchoredId, "section-0:lia-label-7a9bc123")

  const inserted = quiz()
  const remountedTrack = quiz({ track: { section: 0, input: 4 } })
  const remountedAnchor = quiz({ anchor: "7a9bc123" })
  slides[0].quizzes = [inserted, remountedTrack, remountedAnchor]
  courseWithSlides(slides[0].quizzes, [])

  assert.equal(lootIfQuizId(inserted), null)
  assert.equal(lootIfQuizId(remountedTrack), trackedId)
  assert.equal(lootIfQuizId(remountedAnchor), anchoredId)
})

test("behandelt auch nachträglich doppelte stabile Quiz-IDs für beide Seiten fail-closed", () => {
  const first = quiz({ authoredId: "duplicate" })
  const slides = courseWithSlides([first], [])
  assert.equal(lootIfQuizId(first), "section-0:authored-duplicate")

  const duplicate = quiz({ authoredId: "duplicate" })
  slides[0].quizzes.push(duplicate)
  duplicate.parentElement = slides[0]
  duplicate.closest = (selector) =>
    selector === "main.lia-slide__content, main" ? slides[0] : null

  assert.equal(lootIfQuizId(first), null)
  assert.equal(lootIfQuizId(duplicate), null)
  assert.equal(first.dataset.lootIfQuizId, undefined)
})

test("schließt unerreichbare Quizchecks aus und erkennt Lia-Solved-Controls", () => {
  const check = checkControl()
  const wrapper = new FakeHTMLElement("DIV")
  check.parentElement = wrapper
  assert.equal(lootIfQuizCheckIsReachable(check), true)

  check.disabled = true
  check.setAttribute("disabled", "")
  check.setAttribute("aria-hidden", "true")
  assert.equal(lootIfQuizCheckIsReachable(check, false), false)
  assert.equal(lootIfQuizCheckIsReachable(check, true), true)

  check.disabled = false
  check.attributes.clear()
  wrapper.inert = true
  assert.equal(lootIfQuizCheckIsReachable(check, true), false)
  wrapper.inert = false
  wrapper.hidden = true
  assert.equal(lootIfQuizCheckIsReachable(check, true), false)
  wrapper.hidden = false
  wrapper.setAttribute("aria-hidden", "true")
  assert.equal(lootIfQuizCheckIsReachable(check, true), false)
})
