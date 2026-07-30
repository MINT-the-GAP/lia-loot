const CHECK_SELECTOR = ".lia-quiz__check"
const HINT_SELECTOR = ".lia-quiz__hint"
const QUIZ_SELECTOR = ".lia-quiz"
const RESOLVE_SELECTOR = ".lia-quiz__resolve"

export interface QuizEventHandlers {
  active(): boolean
  failed(): void
  hint(count: number): void
  solved(quiz: Element): void
  courseCompleted(): void
  useCheck(): boolean
  useHint(): boolean
  useResolve(): boolean
}

export function isScoreableQuiz(quiz: Element): boolean {
  return Boolean(
    quiz.querySelector(CHECK_SELECTOR) && quiz.querySelector(RESOLVE_SELECTOR),
  )
}

function eventElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) return target
  if (target instanceof Node) return target.parentElement
  return null
}

function blockClick(event: MouseEvent): void {
  event.preventDefault()
  event.stopImmediatePropagation()
}

function trialCount(quiz: Element): number {
  const text = quiz.querySelector(CHECK_SELECTOR)?.textContent?.trim() ?? ""
  const match = text.match(/(?:^|\s)(\d+)\s*$/)
  return match ? Number.parseInt(match[1], 10) : 0
}

function hintCount(quiz: Element): number {
  return quiz.querySelectorAll(".lia-quiz__hints > li").length
}

export function lastScoreableQuiz(quizzes: readonly Element[]): Element | null {
  for (let index = quizzes.length - 1; index >= 0; index -= 1) {
    const quiz = quizzes[index]
    if (isScoreableQuiz(quiz)) return quiz
  }

  return null
}

export function allRenderedCourseQuizzesSolved(root: ParentNode): boolean {
  const quizzes = Array.from(root.querySelectorAll(QUIZ_SELECTOR)).filter(
    isScoreableQuiz,
  )
  return (
    quizzes.length > 0 &&
    quizzes.every((quiz) => quiz.classList.contains("solved")) &&
    quizzes.some(isLastCourseQuiz)
  )
}

export function isLastCourseQuiz(quiz: Element): boolean {
  const section = quiz.closest("main.lia-slide__content")
  const sectionContainer = section?.parentElement
  if (!section || !sectionContainer) return false

  const sections = Array.from(sectionContainer.children).filter(
    (element) => element.tagName === "MAIN",
  )
  if (sections[sections.length - 1] !== section) return false

  const quizzes = Array.from(section.querySelectorAll(QUIZ_SELECTOR))
  return lastScoreableQuiz(quizzes) === quiz
}

function watchUntil<T>(
  quiz: Element,
  read: () => T | null,
  done: (value: T) => void,
  cancelled: () => void,
  timeoutMs = 30_000,
): void {
  let settled = false
  let observer: MutationObserver
  let timeout = 0

  const cleanup = (): void => {
    observer.disconnect()
    window.clearTimeout(timeout)
  }

  const finish = (value: T): void => {
    if (settled) return
    settled = true
    cleanup()
    done(value)
  }

  const cancel = (): void => {
    if (settled) return
    settled = true
    cleanup()
    cancelled()
  }

  const inspect = (): void => {
    if (settled) return
    if (!quiz.isConnected) {
      cancel()
      return
    }

    const value = read()
    if (value !== null) finish(value)
  }

  observer = new MutationObserver(inspect)
  observer.observe(quiz, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  })

  timeout = window.setTimeout(cancel, timeoutMs)

  window.setTimeout(inspect, 0)
}

export function installQuizEventTracking(handlers: QuizEventHandlers): void {
  const pendingChecks = new WeakSet<Element>()
  const pendingHints = new WeakSet<Element>()

  document.addEventListener(
    "click",
    (event) => {
      const target = eventElement(event.target)
      if (!target) return

      const check = target.closest<HTMLButtonElement>(CHECK_SELECTOR)
      if (check && !check.disabled) {
        const quiz = check.closest(QUIZ_SELECTOR)
        if (
          !quiz ||
          !quiz.classList.contains("open") ||
          !quiz.querySelector(RESOLVE_SELECTOR)
        ) {
          return
        }
        if (pendingChecks.has(quiz)) {
          blockClick(event)
          return
        }
        if (!handlers.useCheck()) {
          blockClick(event)
          return
        }
        if (!handlers.active()) return

        pendingChecks.add(quiz)
        const beforeTrial = trialCount(quiz)
        const clearPending = (): void => {
          pendingChecks.delete(quiz)
        }

        watchUntil(
          quiz,
          () => {
            const afterTrial = trialCount(quiz)
            if (quiz.classList.contains("solved")) return "solved" as const
            if (afterTrial > beforeTrial) return "failed" as const
            return null
          },
          (result) => {
            clearPending()
            if (result === "failed") {
              handlers.failed()
            } else {
              handlers.solved(quiz)
              if (isLastCourseQuiz(quiz)) handlers.courseCompleted()
            }
          },
          clearPending,
        )
        return
      }

      const hint = target.closest<HTMLButtonElement>(HINT_SELECTOR)
      if (hint && !hint.disabled) {
        const quiz = hint.closest(QUIZ_SELECTOR)
        if (!quiz || !quiz.classList.contains("open")) return
        if (pendingHints.has(quiz)) {
          blockClick(event)
          return
        }
        if (!handlers.useHint()) {
          blockClick(event)
          return
        }
        if (!handlers.active()) return

        pendingHints.add(quiz)
        const beforeHints = hintCount(quiz)
        const clearPending = (): void => {
          pendingHints.delete(quiz)
        }

        watchUntil(
          quiz,
          () => {
            const difference = hintCount(quiz) - beforeHints
            return difference > 0 ? difference : null
          },
          (difference) => {
            clearPending()
            handlers.hint(difference)
          },
          clearPending,
        )
        return
      }

      const resolve = target.closest<HTMLButtonElement>(RESOLVE_SELECTOR)
      if (resolve && !resolve.disabled) {
        const quiz = resolve.closest(QUIZ_SELECTOR)
        if (!quiz || !quiz.classList.contains("open")) return
        if (!handlers.useResolve()) blockClick(event)
      }
    },
    true,
  )
}
