const SLIDE_CONTAINER_SELECTOR = ".lia-slide__container"
const ACTIVE_SLIDE_SELECTOR =
  ".lia-slide__container > main.lia-slide__content:not([hidden])"

type SlideActivityListener = () => void
type LiaSlideAccessGuard = (section: number | null) => boolean

const listeners = new Set<SlideActivityListener>()
let slideAccessGuard: LiaSlideAccessGuard = () => true
let observedContainer: HTMLElement | null = null
let slideAttributeObserver: MutationObserver | null = null
let slideListObserver: MutationObserver | null = null
let rootObserver: MutationObserver | null = null
let eventsInstalled = false

function sectionFromHash(hash: string): number | null {
  const match = /^#(\d+)$/.exec(hash)
  if (!match) return null
  const section = Number(match[1]) - 1
  return Number.isInteger(section) && section >= 0 ? section : null
}

function sectionFromLink(link: HTMLAnchorElement): number | null {
  try {
    return sectionFromHash(new URL(link.href, window.location.href).hash)
  } catch {
    return sectionFromHash(link.getAttribute("href") ?? "")
  }
}

export function activeLiaSection(): number | null {
  const active = document.querySelector<HTMLElement>(ACTIVE_SLIDE_SELECTOR)
  const container = active?.parentElement
  if (active && container) {
    const slides = [...container.children].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element.tagName === "MAIN",
    )
    const section = slides.indexOf(active)
    if (section >= 0) return section
  }

  const focused = document.querySelector<HTMLAnchorElement>(
    "#lia-toc #focusedToc.lia-toc__link",
  )
  if (focused) {
    const section = sectionFromLink(focused)
    if (section !== null) return section
  }

  return sectionFromHash(window.location.hash)
}

export function sectionFromLootId(value: string): number | null {
  const match = /(?:^|:)(\d+)_\d+(?::|$)/.exec(value)
  if (!match) return null
  const section = Number(match[1])
  return Number.isInteger(section) && section >= 0 ? section : null
}

export function sourceSlideIsActive(
  sourceSection: number | null,
  sourceHost?: HTMLElement,
): boolean {
  const activeSection = activeLiaSection()
  if (!slideAccessGuard(activeSection ?? sourceSection)) return false
  if (sourceSection !== null && activeSection !== null) {
    return sourceSection === activeSection
  }

  const slide = sourceHost?.closest<HTMLElement>("main")
  return Boolean(
    slide &&
      !slide.hidden &&
      slide.classList.contains("lia-slide__content"),
  )
}

export function liaSlideIsAccessible(section: number | null): boolean {
  return slideAccessGuard(section)
}

function notifyListeners(): void {
  for (const listener of listeners) listener()
}

export function setLiaSlideAccessGuard(guard: LiaSlideAccessGuard): void {
  slideAccessGuard = guard
  notifyListeners()
}

export function refreshLiaSlideActivity(): void {
  notifyListeners()
}

function findSlideContainer(): HTMLElement | null {
  const active = document.querySelector<HTMLElement>(ACTIVE_SLIDE_SELECTOR)
  if (
    active?.parentElement?.classList.contains(
      SLIDE_CONTAINER_SELECTOR.slice(1),
    )
  ) {
    return active.parentElement
  }

  return (
    [...document.querySelectorAll<HTMLElement>(SLIDE_CONTAINER_SELECTOR)].find(
      (container) =>
        [...container.children].some(
          (child) =>
            child instanceof HTMLElement && child.tagName === "MAIN",
        ),
    ) ?? null
  )
}

function observeSlides(container: HTMLElement): void {
  slideAttributeObserver?.disconnect()
  slideAttributeObserver = new MutationObserver((mutations) => {
    if (
      mutations.some(
        (mutation) =>
          mutation.target instanceof HTMLElement &&
          mutation.target.tagName === "MAIN" &&
          mutation.target.parentElement === container,
      )
    ) {
      notifyListeners()
    }
  })
  for (const child of container.children) {
    if (child instanceof HTMLElement && child.tagName === "MAIN") {
      slideAttributeObserver.observe(child, {
        attributeFilter: ["class", "hidden"],
        attributes: true,
      })
    }
  }
}

function attachSlideContainer(): void {
  const container = findSlideContainer()
  if (container === observedContainer) return

  slideAttributeObserver?.disconnect()
  slideListObserver?.disconnect()
  observedContainer = container
  if (!container) return

  observeSlides(container)
  slideListObserver = new MutationObserver(() => {
    observeSlides(container)
    notifyListeners()
  })
  slideListObserver.observe(container, { childList: true })
  notifyListeners()
}

function nodeContainsSlideContainer(node: Node): boolean {
  return (
    node instanceof Element &&
    (node.matches(SLIDE_CONTAINER_SELECTOR) ||
      node.querySelector(SLIDE_CONTAINER_SELECTOR) !== null ||
      (observedContainer !== null && node.contains(observedContainer)))
  )
}

function installObservers(): void {
  if (!rootObserver) {
    rootObserver = new MutationObserver((mutations) => {
      if (
        observedContainer === null ||
        observedContainer.isConnected === false ||
        mutations.some(
          (mutation) =>
            [...mutation.addedNodes, ...mutation.removedNodes].some(
              nodeContainsSlideContainer,
            ),
        )
      ) {
        attachSlideContainer()
      }
    })
    rootObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  }

  if (!eventsInstalled) {
    eventsInstalled = true
    window.addEventListener("hashchange", notifyListeners)
    window.addEventListener("pageshow", notifyListeners)
    window.addEventListener("popstate", notifyListeners)
  }

  attachSlideContainer()
}

export function observeLiaSlideActivity(
  listener: SlideActivityListener,
): () => void {
  listeners.add(listener)
  installObservers()
  listener()
  return () => {
    listeners.delete(listener)
  }
}
