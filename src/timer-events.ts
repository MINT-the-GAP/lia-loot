export const TIMER_START_SELECTOR =
  ".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], " +
  ".lia-sol-timer-startbtn[data-sol-timer-ui='hint']"

export interface TimerEventHandlers {
  useStart(): boolean
}

function eventElement(target: EventTarget | null): Element | null {
  if (!target || typeof target !== "object") return null
  const node = target as Node
  if (node.nodeType === 1) return node as Element
  if (node.parentElement) return node.parentElement
  return null
}

function timerStartFromEvent(event: MouseEvent): HTMLButtonElement | null {
  const path =
    typeof event.composedPath === "function"
      ? event.composedPath()
      : []
  for (const target of [...path, event.target]) {
    const element = eventElement(target)
    const start = element?.closest<HTMLButtonElement>(TIMER_START_SELECTOR)
    if (start) return start
  }
  return null
}

function blockClick(event: MouseEvent): void {
  event.preventDefault()
  event.stopImmediatePropagation()
}

function hiddenByStyle(element: Element): boolean {
  const view = element.ownerDocument?.defaultView
  if (!view) return false

  try {
    for (
      let current: Element | null = element;
      current;
      current = current.parentElement
    ) {
      const style = view.getComputedStyle(current)
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.visibility === "collapse" ||
        style.pointerEvents === "none" ||
        Number(style.opacity) === 0
      ) {
        return true
      }
    }
  } catch {
    return true
  }

  return false
}

function timerStartUnavailable(button: HTMLButtonElement): boolean {
  if (
    button.isConnected === false ||
    button.disabled ||
    button.getAttribute("aria-disabled") === "true" ||
    button.closest('[inert], [hidden], [aria-hidden="true"]') ||
    hiddenByStyle(button)
  ) {
    return true
  }

  return false
}

export function installTimerEventTracking(handlers: TimerEventHandlers): void {
  const startedButtons = new WeakSet<HTMLButtonElement>()

  document.addEventListener(
    "click",
    (event) => {
      if (event.defaultPrevented) return

      const start = timerStartFromEvent(event)
      if (!start || timerStartUnavailable(start)) return

      if (startedButtons.has(start)) {
        blockClick(event)
        return
      }

      if (!handlers.useStart()) {
        blockClick(event)
        return
      }

      startedButtons.add(start)
    },
    true,
  )
}
