export interface ClientRectEdges {
  bottom: number
  left: number
  right: number
  top: number
}

export interface ClientRectAxes {
  x: boolean
  y: boolean
}

const CLIPPING_OVERFLOW_VALUES = new Set([
  "auto",
  "clip",
  "hidden",
  "overlay",
  "scroll",
])

function validClientRect(rect: ClientRectEdges): boolean {
  return (
    [rect.bottom, rect.left, rect.right, rect.top].every(Number.isFinite) &&
    rect.right >= rect.left &&
    rect.bottom >= rect.top
  )
}

export function intersectClientRects(
  rect: ClientRectEdges,
  clip: ClientRectEdges,
  axes: ClientRectAxes = { x: true, y: true },
): ClientRectEdges | null {
  if (!validClientRect(rect) || !validClientRect(clip)) return null

  const intersection = {
    bottom: axes.y ? Math.min(rect.bottom, clip.bottom) : rect.bottom,
    left: axes.x ? Math.max(rect.left, clip.left) : rect.left,
    right: axes.x ? Math.min(rect.right, clip.right) : rect.right,
    top: axes.y ? Math.max(rect.top, clip.top) : rect.top,
  }
  return intersection.right > intersection.left &&
      intersection.bottom > intersection.top
    ? intersection
    : null
}

function clippingClientBox(element: HTMLElement): ClientRectEdges {
  const rect = element.getBoundingClientRect()
  const scaleX = element.offsetWidth > 0 ? rect.width / element.offsetWidth : 1
  const scaleY = element.offsetHeight > 0 ? rect.height / element.offsetHeight : 1
  const hasClientBox = element.clientWidth > 0 && element.clientHeight > 0
  if (!hasClientBox) return rect

  const left = rect.left + element.clientLeft * scaleX
  const top = rect.top + element.clientTop * scaleY
  return {
    bottom: top + element.clientHeight * scaleY,
    left,
    right: left + element.clientWidth * scaleX,
    top,
  }
}

function clipsOverflow(value: string): boolean {
  return CLIPPING_OVERFLOW_VALUES.has(value.trim().toLowerCase())
}

export function visibleClientRect(element: HTMLElement): ClientRectEdges | null {
  const view = element.ownerDocument.defaultView
  if (!view || view.innerWidth <= 0 || view.innerHeight <= 0) return null

  let visible: ClientRectEdges | null = {
    bottom: view.innerHeight,
    left: 0,
    right: view.innerWidth,
    top: 0,
  }
  let ancestor = element.parentElement
  while (ancestor && visible) {
    let style: CSSStyleDeclaration
    try {
      style = view.getComputedStyle(ancestor)
    } catch {
      ancestor = ancestor.parentElement
      continue
    }

    const axes = {
      x: clipsOverflow(style.overflowX),
      y: clipsOverflow(style.overflowY),
    }
    if (axes.x || axes.y) {
      visible = intersectClientRects(
        visible,
        clippingClientBox(ancestor),
        axes,
      )
    }
    ancestor = ancestor.parentElement
  }
  return visible
}

function cssPixels(value: number): string {
  return `${Math.round(Math.max(0, value) * 1000) / 1000}px`
}

export function clientRectClipPath(
  rect: ClientRectEdges,
  clip: ClientRectEdges,
): string | null {
  const visible = intersectClientRects(rect, clip)
  if (!visible) return null

  const insets = [
    visible.top - rect.top,
    rect.right - visible.right,
    rect.bottom - visible.bottom,
    visible.left - rect.left,
  ]
  if (insets.every((value) => value <= 0.001)) return ""
  return `inset(${insets.map(cssPixels).join(" ")})`
}
