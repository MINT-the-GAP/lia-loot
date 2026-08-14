import { onCourseMarkdownChange } from "./course-chests.ts"
import { observeLiaSlideActivity } from "./slide-activity.ts"

const CHECK_SELECTOR = ".lia-quiz__check"
const HINT_SELECTOR = ".lia-quiz__hint"
const QUIZ_SELECTOR = ".lia-quiz"
const RESOLVE_SELECTOR = ".lia-quiz__resolve"

export interface QuizEventHandlers {
  active(): boolean
  failed(): void
  hint(count: number): void
  solved(quiz: Element): void
  allSolved?(): void
  courseCompleted(): boolean
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

function isAvailableAction(action: HTMLButtonElement): boolean {
  return !action.disabled && action.closest("[inert]") === null
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

function quizCompleted(quiz: Element): boolean {
  return (
    quiz.classList.contains("solved") ||
    quiz.classList.contains("resolved")
  )
}

export type CourseQuizState = "open" | "resolved" | "solved"

export interface CourseQuizRecord {
  id: string
  state: CourseQuizState
}

export class CourseQuizProgress {
  private expectedSections = new Set<number>()
  private visitedSections = new Set<number>()
  private quizIds = new Map<number, Set<string>>()
  private completedQuizzes = new Set<string>()
  private solvedQuizzes = new Set<string>()

  reset(): void {
    this.expectedSections.clear()
    this.visitedSections.clear()
    this.quizIds.clear()
    this.completedQuizzes.clear()
    this.solvedQuizzes.clear()
  }

  expectSections(sections: Iterable<number>): void {
    this.expectedSections = new Set(
      [...sections].filter(
        (section) => Number.isInteger(section) && section >= 0,
      ),
    )
  }

  catalogSection(
    section: number,
    quizzes: readonly CourseQuizRecord[],
  ): void {
    if (!Number.isInteger(section) || section < 0) return
    this.visitedSections.add(section)
    const knownIds = this.quizIds.get(section) ?? new Set<string>()
    this.quizIds.set(section, knownIds)

    quizzes.forEach(({ id: localId, state }) => {
      const id = `${section}:${localId}`
      knownIds.add(id)
      if (state === "solved") {
        this.solvedQuizzes.add(id)
        this.completedQuizzes.add(id)
      } else if (state === "resolved") {
        this.completedQuizzes.add(id)
      }
    })
  }

  allCompleted(): boolean {
    return this.allKnownQuizzesAre(this.completedQuizzes)
  }

  allSolved(): boolean {
    return this.allKnownQuizzesAre(this.solvedQuizzes)
  }

  private allKnownQuizzesAre(completed: ReadonlySet<string>): boolean {
    if (this.expectedSections.size === 0) return false

    let quizCount = 0
    for (const section of this.expectedSections) {
      if (!this.visitedSections.has(section)) return false
      const ids = this.quizIds.get(section) ?? new Set<string>()
      quizCount += ids.size
      for (const id of ids) {
        if (!completed.has(id)) return false
      }
    }
    return quizCount > 0
  }
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

function sectionFromHref(href: string): number | null {
  let hash = href
  try {
    hash = new URL(href, window.location.href).hash
  } catch {
    // The exact hash parser below remains the fail-closed fallback.
  }
  const match = /^#(\d+)$/.exec(hash)
  if (!match) return null
  const section = Number.parseInt(match[1], 10) - 1
  return Number.isInteger(section) && section >= 0 ? section : null
}

function expectedCourseSections(): Set<number> {
  const sections = new Set<number>()
  document.querySelectorAll<HTMLAnchorElement>("#lia-toc a[href]").forEach(
    (link) => {
      const section = sectionFromHref(link.getAttribute("href") ?? "")
      if (section !== null) sections.add(section)
    },
  )
  return sections
}

function activeCourseSection(
  activeSlide: HTMLElement,
  expectedSections: ReadonlySet<number>,
): number | null {
  const hashSection = sectionFromHref(window.location.hash)
  if (hashSection !== null && expectedSections.has(hashSection)) {
    return hashSection
  }

  const focused = document.querySelector<HTMLAnchorElement>(
    "#lia-toc #focusedToc[href], #lia-toc a[aria-current='page'][href]",
  )
  const focusedSection = focused
    ? sectionFromHref(focused.getAttribute("href") ?? "")
    : null
  if (focusedSection !== null && expectedSections.has(focusedSection)) {
    return focusedSection
  }

  const container = activeSlide.parentElement
  if (container) {
    const slides = [...container.children].filter(
      (element) => element instanceof HTMLElement && element.tagName === "MAIN",
    )
    const index = slides.indexOf(activeSlide)
    if (slides.length > 1 && expectedSections.has(index)) return index
  }

  return expectedSections.size === 1 ? [...expectedSections][0] : null
}

function renderedQuizState(quiz: Element): CourseQuizState {
  if (quiz.classList.contains("solved")) return "solved"
  if (quiz.classList.contains("resolved")) return "resolved"
  return "open"
}

function normalizedQuizAnchor(quiz: Element): string | null {
  const anchors = new Set(
    [...quiz.querySelectorAll(".lia-quiz__answers[aria-labelledby]")]
      .map((answers) =>
        (answers.getAttribute("aria-labelledby") ?? "")
          .trim()
          .replace(/\s+/gu, " "),
      )
      .filter((anchor) => anchor.length > 0 && !anchor.startsWith("@")),
  )
  return anchors.size === 1 ? [...anchors][0] : null
}

function renderedQuizRecords(activeSlide: HTMLElement): CourseQuizRecord[] {
  const quizzes = [...activeSlide.querySelectorAll(QUIZ_SELECTOR)].filter(
    isScoreableQuiz,
  )
  const anchors = quizzes.map(normalizedQuizAnchor)
  const anchorCounts = new Map<string, number>()
  anchors.forEach((anchor) => {
    if (anchor) anchorCounts.set(anchor, (anchorCounts.get(anchor) ?? 0) + 1)
  })

  return quizzes.map((quiz, index) => {
    const anchor = anchors[index]
    const id =
      anchor && anchorCounts.get(anchor) === 1
        ? `anchor:${encodeURIComponent(anchor)}`
        : `ordinal:${index}`
    return { id, state: renderedQuizState(quiz) }
  })
}

function nodeAffectsQuizCatalog(node: Node): boolean {
  return (
    node instanceof Element &&
    (node.matches(`${QUIZ_SELECTOR}, #lia-toc, #lia-toc a[href]`) ||
      node.querySelector(`${QUIZ_SELECTOR}, #lia-toc, #lia-toc a[href]`) !==
        null)
  )
}

export function installQuizEventTracking(handlers: QuizEventHandlers): void {
  const pendingChecks = new WeakSet<Element>()
  const pendingHints = new WeakSet<Element>()
  const pendingResolves = new WeakSet<Element>()
  const courseProgress = new CourseQuizProgress()
  let courseCompletionReported = false
  let allSolvedReported = false
  let captureScheduled = false
  let reportAfterCapture = false

  const captureCourseProgress = (): void => {
    const sections = expectedCourseSections()
    if (sections.size === 0) return
    courseProgress.expectSections(sections)

    const activeSlide = document.querySelector<HTMLElement>(
      ".lia-slide__container > main.lia-slide__content:not([hidden])",
    )
    if (!activeSlide) return
    const section = activeCourseSection(activeSlide, sections)
    if (section === null) return
    courseProgress.catalogSection(section, renderedQuizRecords(activeSlide))
  }

  const reportCourseCompletion = (): void => {
    captureCourseProgress()
    if (!allSolvedReported && courseProgress.allSolved()) {
      allSolvedReported = true
      handlers.allSolved?.()
    }
    if (!courseCompletionReported && courseProgress.allCompleted()) {
      courseCompletionReported = handlers.courseCompleted()
    }
  }

  const scheduleCapture = (report: boolean): void => {
    reportAfterCapture ||= report
    if (captureScheduled) return
    captureScheduled = true

    window.setTimeout(() => {
      const nextFrame = (callback: () => void): void => {
        if (typeof window.requestAnimationFrame === "function") {
          window.requestAnimationFrame(() => callback())
        } else {
          window.setTimeout(callback, 0)
        }
      }
      nextFrame(() => {
        nextFrame(() => {
          const shouldReport = reportAfterCapture
          captureScheduled = false
          reportAfterCapture = false
          if (shouldReport) reportCourseCompletion()
          else captureCourseProgress()
        })
      })
    }, 0)
  }

  if (
    typeof document !== "undefined" &&
    document.documentElement &&
    typeof MutationObserver !== "undefined"
  ) {
    observeLiaSlideActivity(() => scheduleCapture(true))
    const catalogObserver = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) =>
            mutation.type === "attributes" &&
            mutation.target instanceof Element &&
            mutation.target.matches(QUIZ_SELECTOR),
        )
      ) {
        scheduleCapture(true)
        return
      }
      if (
        mutations.some((mutation) =>
          [...mutation.addedNodes, ...mutation.removedNodes].some(
            nodeAffectsQuizCatalog,
          ),
        )
      ) {
        scheduleCapture(false)
      }
    })
    catalogObserver.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
      childList: true,
      subtree: true,
    })
    onCourseMarkdownChange(() => {
      courseProgress.reset()
      courseCompletionReported = false
      allSolvedReported = false
      scheduleCapture(false)
    })
    captureCourseProgress()
  }

  window.addEventListener(
    "click",
    (event) => {
      const target = eventElement(event.target)
      if (!target) return

      const check = target.closest<HTMLButtonElement>(CHECK_SELECTOR)
      if (check && isAvailableAction(check)) {
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
            if (quiz.classList.contains("resolved")) {
              return "resolved" as const
            }
            if (afterTrial > beforeTrial) return "failed" as const
            return null
          },
          (result) => {
            clearPending()
            if (result === "failed") {
              handlers.failed()
            } else if (result === "resolved") {
              handlers.failed()
              reportCourseCompletion()
            } else {
              handlers.solved(quiz)
              reportCourseCompletion()
            }
          },
          clearPending,
        )
        return
      }

      const hint = target.closest<HTMLButtonElement>(HINT_SELECTOR)
      if (hint && isAvailableAction(hint)) {
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
      if (resolve && isAvailableAction(resolve)) {
        const quiz = resolve.closest(QUIZ_SELECTOR)
        if (!quiz || !quiz.classList.contains("open")) return
        if (pendingResolves.has(quiz)) {
          blockClick(event)
          return
        }
        if (!handlers.useResolve()) {
          blockClick(event)
          return
        }
        if (!handlers.active()) return

        pendingResolves.add(quiz)
        const clearPending = (): void => {
          pendingResolves.delete(quiz)
        }

        watchUntil(
          quiz,
          () => (quizCompleted(quiz) ? true : null),
          () => {
            clearPending()
            reportCourseCompletion()
          },
          clearPending,
        )
      }
    },
    true,
  )
}
