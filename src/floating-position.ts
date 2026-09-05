interface FloatingPosition {
  anchor: HTMLElement
  element: HTMLElement
  update: () => void
}

interface DocumentPositions {
  anchors: Map<HTMLElement, number>
  document: Document
  frame: number | null
  onMotionChange: (event: Event) => void
  onViewportChange: () => void
  positions: Map<HTMLElement, FloatingPosition>
  resizeObserver: ResizeObserver | null
  updating: boolean
  view: Window
}

const documents = new Map<Document, DocumentPositions>()
const elementDocuments = new WeakMap<HTMLElement, DocumentPositions>()
const MOTION_EVENTS = [
  "transitionrun",
  "transitionend",
  "transitioncancel",
  "animationstart",
  "animationend",
  "animationcancel",
] as const

function isActive(positions: DocumentPositions): boolean {
  return documents.get(positions.document) === positions
}

function ownsTarget(
  positions: DocumentPositions,
  target: EventTarget | null,
): boolean {
  const node = target as Node | null
  if (!node || typeof node.nodeType !== "number") return false
  return [...positions.positions.keys()].some((element) =>
    element.contains(node),
  )
}

function hasExternalMotion(positions: DocumentPositions): boolean {
  if (typeof positions.document.getAnimations !== "function") return false
  return positions.document.getAnimations().some((animation) => {
    if (animation.playState !== "running" && !animation.pending) return false
    const target = (animation.effect as KeyframeEffect | null)?.target
    if (!target) return false
    // Chest pulses and unlock feedback must not keep layout polling alive.
    return !ownsTarget(positions, target)
  })
}

function updatePosition(
  positions: DocumentPositions,
  position: FloatingPosition,
): void {
  if (positions.positions.get(position.element) !== position) return
  if (!position.element.isConnected) {
    untrackFloatingPosition(position.element)
    return
  }
  position.update()
  if (!position.element.isConnected) {
    untrackFloatingPosition(position.element)
  }
}

function updatePositions(positions: DocumentPositions): void {
  if (!isActive(positions) || positions.updating) return
  positions.updating = true
  try {
    for (const position of [...positions.positions.values()]) {
      updatePosition(positions, position)
    }
  } finally {
    positions.updating = false
  }
}

function scheduleFrame(positions: DocumentPositions): void {
  if (!isActive(positions) || positions.frame !== null) return
  positions.frame = positions.view.requestAnimationFrame(() => {
    positions.frame = null
    updatePositions(positions)
    // CSS transforms can move an anchor without mutations or resize events.
    // Check all external animations because an animated sibling can also
    // change the anchor's layout position.
    if (isActive(positions) && hasExternalMotion(positions)) {
      scheduleFrame(positions)
    }
  })
}

function observeAnchor(
  positions: DocumentPositions,
  anchor: HTMLElement,
): void {
  const references = positions.anchors.get(anchor) ?? 0
  positions.anchors.set(anchor, references + 1)
  if (references === 0) positions.resizeObserver?.observe(anchor)
}

function unobserveAnchor(
  positions: DocumentPositions,
  anchor: HTMLElement,
): void {
  const references = positions.anchors.get(anchor) ?? 0
  if (references > 1) {
    positions.anchors.set(anchor, references - 1)
  } else {
    positions.anchors.delete(anchor)
    positions.resizeObserver?.unobserve(anchor)
  }
}

function removeDocument(positions: DocumentPositions): void {
  if (positions.frame !== null) {
    positions.view.cancelAnimationFrame(positions.frame)
    positions.frame = null
  }
  positions.resizeObserver?.disconnect()
  positions.anchors.clear()
  positions.view.removeEventListener("resize", positions.onViewportChange)
  positions.view.removeEventListener("scroll", positions.onViewportChange, true)
  positions.view.visualViewport?.removeEventListener(
    "resize",
    positions.onViewportChange,
  )
  positions.view.visualViewport?.removeEventListener(
    "scroll",
    positions.onViewportChange,
  )
  for (const event of MOTION_EVENTS) {
    positions.document.removeEventListener(event, positions.onMotionChange, true)
  }
  documents.delete(positions.document)
}

function positionsFor(document: Document): DocumentPositions | null {
  const existing = documents.get(document)
  if (existing) return existing
  const view = document.defaultView
  if (!view) return null

  const positions: DocumentPositions = {
    anchors: new Map(),
    document,
    frame: null,
    onMotionChange: (event) => {
      if (!ownsTarget(positions, event.target)) scheduleFrame(positions)
    },
    // Scroll is delivered before rendering. Update cached geometry here,
    // rather than deferring it to the next full content reconciliation.
    onViewportChange: () => updatePositions(positions),
    positions: new Map(),
    resizeObserver: null,
    updating: false,
    view,
  }
  documents.set(document, positions)

  const Observer = (view as Window & typeof globalThis).ResizeObserver
  if (typeof Observer === "function") {
    positions.resizeObserver = new Observer(() => updatePositions(positions))
  }
  view.addEventListener("resize", positions.onViewportChange, { passive: true })
  view.addEventListener("scroll", positions.onViewportChange, {
    capture: true,
    passive: true,
  })
  view.visualViewport?.addEventListener("resize", positions.onViewportChange, {
    passive: true,
  })
  view.visualViewport?.addEventListener("scroll", positions.onViewportChange, {
    passive: true,
  })
  for (const event of MOTION_EVENTS) {
    document.addEventListener(event, positions.onMotionChange, true)
  }
  return positions
}

export function trackFloatingPosition(
  element: HTMLElement,
  anchor: HTMLElement,
  update: () => void,
): void {
  const previous = elementDocuments.get(element)
  if (previous && previous.document !== element.ownerDocument) {
    untrackFloatingPosition(element)
  }
  const positions = positionsFor(element.ownerDocument)
  if (!positions) return
  const existing = positions.positions.get(element)
  if (existing?.anchor !== anchor) {
    if (existing) unobserveAnchor(positions, existing.anchor)
    observeAnchor(positions, anchor)
  }
  const position = { anchor, element, update }
  positions.positions.set(element, position)
  elementDocuments.set(element, positions)
  updatePosition(positions, position)
  // Also covers animations already in progress when an overlay appears.
  scheduleFrame(positions)
}

export function untrackFloatingPosition(element: HTMLElement): void {
  const positions = elementDocuments.get(element)
  if (!positions) return
  const position = positions.positions.get(element)
  elementDocuments.delete(element)
  positions.positions.delete(element)
  if (position) unobserveAnchor(positions, position.anchor)
  if (positions.positions.size === 0) removeDocument(positions)
}

export function scheduleFloatingPositions(): void {
  for (const positions of documents.values()) scheduleFrame(positions)
}

export function isFloatingPositionMutation(mutation: MutationRecord): boolean {
  return (
    mutation.type === "attributes" &&
    (mutation.attributeName === "style" || mutation.attributeName === "hidden") &&
    elementDocuments.has(mutation.target as HTMLElement)
  )
}
