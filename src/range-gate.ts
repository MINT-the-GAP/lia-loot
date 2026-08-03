interface RangeGateState {
  ariaHidden: string | null
  blockers: Set<string>
  inert: boolean
}

const states = new WeakMap<HTMLElement, RangeGateState>()

function setAttributeIfChanged(
  element: HTMLElement,
  name: string,
  value: string,
): void {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value)
}

function removeAttributeIfPresent(element: HTMLElement, name: string): void {
  if (element.hasAttribute(name)) element.removeAttribute(name)
}

export function setRangeGate(
  element: HTMLElement,
  gate: string,
  attribute: string,
  blocked: boolean,
): boolean {
  let state = states.get(element)
  if (blocked) {
    if (!state) {
      state = {
        ariaHidden: element.getAttribute("aria-hidden"),
        blockers: new Set<string>(),
        inert: element.inert,
      }
      states.set(element, state)
    }
    const changed = !state.blockers.has(gate)
    state.blockers.add(gate)
    setAttributeIfChanged(element, attribute, "true")
    setAttributeIfChanged(element, "aria-hidden", "true")
    if (!element.inert) element.inert = true
    return changed
  }

  if (!state) {
    const hadAttribute = element.hasAttribute(attribute)
    removeAttributeIfPresent(element, attribute)
    return hadAttribute
  }
  const changed = state.blockers.delete(gate)
  removeAttributeIfPresent(element, attribute)
  if (state.blockers.size > 0) {
    setAttributeIfChanged(element, "aria-hidden", "true")
    if (!element.inert) element.inert = true
    return changed
  }

  if (element.inert !== state.inert) element.inert = state.inert
  if (state.ariaHidden === null) removeAttributeIfPresent(element, "aria-hidden")
  else setAttributeIfChanged(element, "aria-hidden", state.ariaHidden)
  states.delete(element)
  return changed
}
