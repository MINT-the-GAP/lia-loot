import assert from "node:assert/strict"
import test from "node:test"

import {
  allRenderedCourseQuizzesSolved,
  CourseQuizProgress,
  installQuizEventTracking,
  isLastCourseQuiz,
  lastScoreableQuiz,
} from "../src/quiz-events.ts"

function quiz({
  check = true,
  resolve = true,
  resolved = false,
  solved = false,
} = {}) {
  const node = {
    section: null,
    classList: {
      contains(name) {
        return (
          (name === "solved" && solved) ||
          (name === "resolved" && resolved)
        )
      },
    },
    querySelector(selector) {
      if (selector === ".lia-quiz__check") return check ? {} : null
      if (selector === ".lia-quiz__resolve") return resolve ? {} : null
      return null
    },
    closest(selector) {
      return selector === "main.lia-slide__content" ? node.section : null
    },
  }

  return node
}

function section(...quizzes) {
  const node = {
    tagName: "MAIN",
    parentElement: null,
    querySelectorAll(selector) {
      return selector === ".lia-quiz" ? quizzes : []
    },
  }

  quizzes.forEach((item) => {
    item.section = node
  })
  return node
}

function course(...sections) {
  const node = { children: sections }
  sections.forEach((item) => {
    item.parentElement = node
  })
  return node
}

test("verwendet das letzte bewertbare Quiz in Dokumentreihenfolge", () => {
  const first = quiz()
  const last = quiz()

  assert.equal(lastScoreableQuiz([first, last]), last)
})

test("ignoriert Umfragen und Aufgaben ohne native Quizprüfung", () => {
  const finalQuiz = quiz()
  const survey = quiz({ resolve: false })
  const task = quiz({ check: false, resolve: false })

  assert.equal(lastScoreableQuiz([finalQuiz, survey, task]), finalQuiz)
})

test("liefert ohne bewertbares Quiz null", () => {
  assert.equal(lastScoreableQuiz([quiz({ resolve: false })]), null)
  assert.equal(lastScoreableQuiz([]), null)
})

test("beendet den Kurs nicht auf einer früheren Kursseite", () => {
  const earlyQuiz = quiz()
  const finalQuiz = quiz()
  course(section(earlyQuiz), section(finalQuiz))

  assert.equal(isLastCourseQuiz(earlyQuiz), false)
  assert.equal(isLastCourseQuiz(finalQuiz), true)
})

test("verwendet auf der letzten Seite nur das letzte bewertbare Quiz", () => {
  const first = quiz()
  const finalQuiz = quiz()
  const trailingSurvey = quiz({ resolve: false })
  course(section(first, finalQuiz, trailingSurvey))

  assert.equal(isLastCourseQuiz(first), false)
  assert.equal(isLastCourseQuiz(finalQuiz), true)
  assert.equal(isLastCourseQuiz(trailingSurvey), false)
})

test("meldet alle gerenderten Kursquizze nur beim gelösten Abschluss", () => {
  const early = quiz({ solved: true })
  const final = quiz({ solved: true })
  const root = {
    querySelectorAll(selector) {
      return selector === ".lia-quiz" ? [early, final] : []
    },
  }
  course(section(early), section(final))

  assert.equal(allRenderedCourseQuizzesSolved(root), true)
  final.classList.contains = () => false
  assert.equal(allRenderedCourseQuizzesSolved(root), false)
})

test("schließt den Kurs erst nach allen katalogisierten Folien und Quizzen ab", () => {
  const progress = new CourseQuizProgress()
  progress.expectSections([0, 1, 2])

  progress.catalogSection(2, [{ id: "final", state: "solved" }])
  assert.equal(progress.allCompleted(), false)

  progress.catalogSection(0, [{ id: "early", state: "solved" }])
  assert.equal(progress.allCompleted(), false)

  progress.catalogSection(1, [{ id: "middle", state: "open" }])
  assert.equal(progress.allCompleted(), false)

  progress.catalogSection(1, [{ id: "middle", state: "resolved" }])
  assert.equal(progress.allCompleted(), true)
  assert.equal(progress.allSolved(), false)
})

test("unterscheidet vollständig gelöst von gelöst oder aufgelöst", () => {
  const progress = new CourseQuizProgress()
  progress.expectSections([0, 1])
  progress.catalogSection(0, [
    { id: "first", state: "solved" },
    { id: "second", state: "solved" },
  ])
  progress.catalogSection(1, [{ id: "final", state: "solved" }])

  assert.equal(progress.allCompleted(), true)
  assert.equal(progress.allSolved(), true)
})

function checkClick({
  open = true,
  disabled = false,
  inert = false,
  resolve = true,
  useCheck = true,
} = {}) {
  class FakeElement {}
  class FakeNode {}
  globalThis.Element = FakeElement
  globalThis.Node = FakeNode

  const quiz = new FakeElement()
  quiz.classList = { contains: (name) => name === "open" && open }
  quiz.querySelector = (selector) =>
    selector === ".lia-quiz__resolve" && resolve ? {} : null

  const check = new FakeElement()
  check.disabled = disabled
  check.closest = (selector) => {
    if (selector === ".lia-quiz__check") return check
    if (selector === ".lia-quiz") return quiz
    if (selector === "[inert]") return inert ? check : null
    return null
  }

  let listener = null
  globalThis.window = {
    addEventListener(type, callback, options) {
      if (type === "click" && options === true) listener = callback
    },
  }

  let energyCalls = 0
  let prevented = false
  let stopped = false
  installQuizEventTracking({
    active: () => false,
    failed() {},
    hint() {},
    solved() {},
    courseCompleted() {},
    useCheck: () => {
      energyCalls += 1
      return useCheck
    },
    useHint: () => true,
    useResolve: () => true,
  })

  listener({
    target: check,
    preventDefault() {
      prevented = true
    },
    stopImmediatePropagation() {
      stopped = true
    },
  })

  return { energyCalls, prevented, stopped }
}

function resolveClick({
  open = true,
  disabled = false,
  inert = false,
  useResolve = true,
} = {}) {
  class FakeElement {}
  class FakeNode {}
  globalThis.Element = FakeElement
  globalThis.Node = FakeNode

  const quiz = new FakeElement()
  quiz.classList = { contains: (name) => name === "open" && open }

  const resolve = new FakeElement()
  resolve.disabled = disabled
  resolve.closest = (selector) => {
    if (selector === ".lia-quiz__resolve") return resolve
    if (selector === ".lia-quiz") return quiz
    if (selector === "[inert]") return inert ? resolve : null
    return null
  }

  let listener = null
  globalThis.window = {
    addEventListener(type, callback, options) {
      if (type === "click" && options === true) listener = callback
    },
  }

  let diamondCalls = 0
  let prevented = false
  let stopped = false
  installQuizEventTracking({
    active: () => false,
    failed() {},
    hint() {},
    solved() {},
    courseCompleted() {},
    useCheck: () => true,
    useHint: () => true,
    useResolve: () => {
      diamondCalls += 1
      return useResolve
    },
  })

  assert.equal(typeof listener, "function")
  listener({
    target: resolve,
    preventDefault() {
      prevented = true
    },
    stopImmediatePropagation() {
      stopped = true
    },
  })

  return { diamondCalls, prevented, stopped }
}

test("blockiert Prüfen vollständig, wenn keine Energie vorhanden ist", () => {
  assert.deepEqual(checkClick({ useCheck: false }), {
    energyCalls: 1,
    prevented: true,
    stopped: true,
  })
})

test("verbraucht Energie auch ohne laufenden Highscore und lässt den Klick durch", () => {
  assert.deepEqual(checkClick(), {
    energyCalls: 1,
    prevented: false,
    stopped: false,
  })
})

test("verbraucht keine Energie für geschlossene, deaktivierte oder gesperrte Quizze", () => {
  assert.equal(checkClick({ open: false }).energyCalls, 0)
  assert.equal(checkClick({ disabled: true }).energyCalls, 0)
  assert.equal(checkClick({ inert: true }).energyCalls, 0)
})

test("verbraucht keine Energie für Umfragen mit Submit-Button", () => {
  assert.equal(checkClick({ resolve: false }).energyCalls, 0)
})

test("blockiert Auflösen vollständig, wenn kein Diamant vorhanden ist", () => {
  assert.deepEqual(resolveClick({ useResolve: false }), {
    diamondCalls: 1,
    prevented: true,
    stopped: true,
  })
})

test("verbraucht einen Diamanten und lässt Auflösen danach durch", () => {
  assert.deepEqual(resolveClick(), {
    diamondCalls: 1,
    prevented: false,
    stopped: false,
  })
})

test("verbraucht keine Diamanten für geschlossene, deaktivierte oder gesperrte Quizze", () => {
  assert.equal(resolveClick({ open: false }).diamondCalls, 0)
  assert.equal(resolveClick({ disabled: true }).diamondCalls, 0)
  assert.equal(resolveClick({ inert: true }).diamondCalls, 0)
})
