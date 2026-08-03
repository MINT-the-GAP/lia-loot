interface SlideNavigationKeyEvent {
  altKey: boolean
  ctrlKey: boolean
  key: string
  metaKey: boolean
  shiftKey: boolean
}

export interface SlideNavigationSwipe {
  elapsedMs: number
  endX: number
  endY: number
  startX: number
  startY: number
}

interface GestureStart {
  identifier?: number
  startedAt: number
  x: number
  y: number
}

const MIN_HORIZONTAL_SWIPE = 150
const MAX_VERTICAL_SWIPE = 100
const MAX_SWIPE_DURATION = 300

const EDITABLE_NAVIGATION_SELECTOR = [
  "input",
  "textarea",
  "select",
  "option",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='textbox']",
  "[role='combobox']",
  "[role='listbox']",
  "[role='slider']",
  "[role='spinbutton']",
  "[role='radiogroup']",
  "[role='tree']",
  "[role='grid']",
  "[role='menu']",
  ".ace_editor",
  ".CodeMirror",
].join(",")

const installedDocuments = new WeakSet<Document>()
const installedWindows = new WeakSet<Window>()
const mouseStarts = new WeakMap<Window, GestureStart>()
const touchStarts = new WeakMap<Window, GestureStart>()
const suppressedClicks = new WeakSet<Window>()
let navigationLocked = false

export function isSequentialSlideNavigationKey(
  event: SlideNavigationKeyEvent,
): boolean {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") return true

  const key = event.key.toLocaleLowerCase("en-US")
  return (
    event.altKey &&
    event.shiftKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    (key === "n" || key === "p")
  )
}

export function isSequentialSlideNavigationSwipe(
  swipe: SlideNavigationSwipe,
): boolean {
  const values = [
    swipe.elapsedMs,
    swipe.endX,
    swipe.endY,
    swipe.startX,
    swipe.startY,
  ]
  if (!values.every(Number.isFinite)) return false
  if (swipe.elapsedMs < 0 || swipe.elapsedMs > MAX_SWIPE_DURATION) {
    return false
  }
  return (
    Math.abs(swipe.endX - swipe.startX) >= MIN_HORIZONTAL_SWIPE &&
    Math.abs(swipe.endY - swipe.startY) <= MAX_VERTICAL_SWIPE
  )
}

function eventElement(target: EventTarget | null): Element | null {
  const node = target as
    | (EventTarget & {
        closest?: (selector: string) => Element | null
        nodeType?: number
        parentElement?: Element | null
      })
    | null
  if (!node) return null
  if (node.nodeType === 1 && typeof node.closest === "function") {
    return node as unknown as Element
  }
  return node.parentElement ?? null
}

export function isEditableSlideNavigationTarget(
  target: EventTarget | null,
): boolean {
  const element = eventElement(target)
  if (!element) return false
  if ((element as HTMLElement).isContentEditable) return true
  return Boolean(element.closest(EDITABLE_NAVIGATION_SELECTOR))
}

function blockLockedSlideNavigation(event: KeyboardEvent): void {
  if (!navigationLocked || !isSequentialSlideNavigationKey(event)) return

  // Preserve native cursor/widget behavior, but never let LiaScript's global
  // swipe handler turn the same key into a slide transition.
  if (!isEditableSlideNavigationTarget(event.target)) event.preventDefault()
  event.stopImmediatePropagation()
  event.stopPropagation()
}

function stopSequentialGesture(view: Window, event: Event): void {
  event.preventDefault()
  event.stopImmediatePropagation()
  event.stopPropagation()

  suppressedClicks.add(view)
  view.setTimeout(() => suppressedClicks.delete(view), 0)
}

function swipeFrom(
  start: GestureStart,
  endX: number,
  endY: number,
  view: Window,
): SlideNavigationSwipe {
  return {
    elapsedMs: view.performance.now() - start.startedAt,
    endX,
    endY,
    startX: start.x,
    startY: start.y,
  }
}

function touchByIdentifier(
  touches: TouchList,
  identifier: number,
): Touch | null {
  for (let index = 0; index < touches.length; index += 1) {
    const touch = touches.item(index)
    if (touch?.identifier === identifier) return touch
  }
  return null
}

function captureTouchStart(view: Window, event: TouchEvent): void {
  if (!navigationLocked || event.touches.length !== 1) {
    touchStarts.delete(view)
    return
  }
  const touch = event.touches.item(0)
  if (!touch) return
  touchStarts.set(view, {
    identifier: touch.identifier,
    startedAt: view.performance.now(),
    x: touch.clientX,
    y: touch.clientY,
  })
}

function captureTouchEnd(view: Window, event: TouchEvent): void {
  const start = touchStarts.get(view)
  touchStarts.delete(view)
  if (!navigationLocked || !start || start.identifier === undefined) return
  const touch = touchByIdentifier(event.changedTouches, start.identifier)
  if (
    touch &&
    isSequentialSlideNavigationSwipe(
      swipeFrom(start, touch.clientX, touch.clientY, view),
    )
  ) {
    stopSequentialGesture(view, event)
  }
}

function captureMouseDown(view: Window, event: MouseEvent): void {
  if (!navigationLocked || event.button !== 0) {
    mouseStarts.delete(view)
    return
  }
  mouseStarts.set(view, {
    startedAt: view.performance.now(),
    x: event.clientX,
    y: event.clientY,
  })
}

function captureMouseUp(view: Window, event: MouseEvent): void {
  const start = mouseStarts.get(view)
  mouseStarts.delete(view)
  if (!navigationLocked || !start || event.button !== 0) return
  if (
    isSequentialSlideNavigationSwipe(
      swipeFrom(start, event.clientX, event.clientY, view),
    )
  ) {
    stopSequentialGesture(view, event)
  }
}

function captureClick(view: Window, event: MouseEvent): void {
  if (!suppressedClicks.has(view)) return
  suppressedClicks.delete(view)
  event.preventDefault()
  event.stopImmediatePropagation()
  event.stopPropagation()
}

export function setSlideNavigationLocked(locked: boolean): void {
  navigationLocked = locked
}

export function installSlideNavigationLock(
  documents: readonly Document[],
): void {
  for (const candidate of documents) {
    const view = candidate.defaultView
    if (view && !installedWindows.has(view)) {
      installedWindows.add(view)
      view.addEventListener("keydown", blockLockedSlideNavigation, true)
      view.addEventListener(
        "touchstart",
        (event) => captureTouchStart(view, event),
        { capture: true, passive: true },
      )
      view.addEventListener(
        "touchend",
        (event) => captureTouchEnd(view, event),
        { capture: true, passive: false },
      )
      view.addEventListener(
        "touchcancel",
        () => touchStarts.delete(view),
        true,
      )
      view.addEventListener(
        "mousedown",
        (event) => captureMouseDown(view, event),
        true,
      )
      view.addEventListener(
        "mouseup",
        (event) => captureMouseUp(view, event),
        true,
      )
      view.addEventListener(
        "click",
        (event) => captureClick(view, event),
        true,
      )
    }

    if (!installedDocuments.has(candidate)) {
      installedDocuments.add(candidate)
      candidate.addEventListener("keydown", blockLockedSlideNavigation, true)
    }
  }
}
