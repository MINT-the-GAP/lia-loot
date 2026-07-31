export type ConcealmentMode = "solid" | "dust"

export const CONCEALMENT_ATTRIBUTE = "data-loot-concealment"
export const CONCEALMENT_SELECTOR = `[${CONCEALMENT_ATTRIBUTE}]`
export const CONCEALMENT_CHANGED_EVENT = "lia-loot:concealment-changed"

const MODE_BY_OPTION: Readonly<Record<string, ConcealmentMode>> = {
  dust: "dust",
  solid: "solid",
  unsichtbar: "solid",
  verdeckt: "solid",
  zauberstaub: "dust",
}

export interface ConcealmentOptions {
  errors: string[]
  mode: ConcealmentMode | null
  values: string[]
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("de-DE")
}

export function extractConcealmentOptions(
  values: readonly string[],
): ConcealmentOptions {
  const errors: string[] = []
  const remaining: string[] = []
  let mode: ConcealmentMode | null = null

  for (const value of values) {
    const nextMode = MODE_BY_OPTION[normalize(value)]
    if (!nextMode) {
      remaining.push(value)
      continue
    }
    if (mode) {
      errors.push(
        mode === nextMode
          ? `Die Verbergungsoption „${value}“ wurde doppelt angegeben.`
          : "„unsichtbar“ und „zauberstaub“ können nicht gleichzeitig verwendet werden.",
      )
      continue
    }
    mode = nextMode
  }

  return { errors, mode, values: remaining }
}

export function concealmentModeOf(
  host: HTMLElement,
): ConcealmentMode | null {
  const value = normalize(host.getAttribute(CONCEALMENT_ATTRIBUTE) ?? "")
  return value === "solid" || value === "dust" ? value : null
}

export function concealedContentOf(host: HTMLElement): HTMLElement | null {
  return (
    [...host.children].find((child) =>
      child.classList.contains("loot-magnifier-secret__content"),
    ) as HTMLElement | undefined
  ) ?? null
}

export function prepareConcealedHost(host: HTMLElement): ConcealmentMode | null {
  const mode = concealmentModeOf(host)
  if (!mode) return null

  let content = concealedContentOf(host)
  if (!content) {
    content = document.createElement("span")
    content.className = "loot-magnifier-secret__content"
    host.appendChild(content)
  }
  const authoredNodes = [...host.childNodes].filter((node) => node !== content)
  authoredNodes.forEach((node) => content.appendChild(node))

  host.classList.add("loot-magnifier-secret")
  host.classList.toggle("loot-magnifier-secret--solid", mode === "solid")
  host.classList.toggle("loot-magnifier-secret--dust", mode === "dust")
  host.dataset.lootConcealmentReady = "true"
  return mode
}

function announceConcealmentChange(host: HTMLElement): void {
  host.dispatchEvent(
    new CustomEvent(CONCEALMENT_CHANGED_EVENT, {
      bubbles: true,
    }),
  )
}

export function setHostConcealment(
  host: HTMLElement,
  mode: ConcealmentMode | null,
): void {
  const previousMode = concealmentModeOf(host)
  if (!mode) {
    const content = concealedContentOf(host)
    if (content) content.replaceWith(...content.childNodes)
    host.removeAttribute(CONCEALMENT_ATTRIBUTE)
    delete host.dataset.lootConcealmentReady
    host.classList.remove(
      "loot-magnifier-secret",
      "loot-magnifier-secret--solid",
      "loot-magnifier-secret--dust",
      "loot-magnifier-secret--under-lens",
    )
    host.style.removeProperty("--loot-magnifier-x")
    host.style.removeProperty("--loot-magnifier-y")
    host.removeAttribute("aria-hidden")
    host.inert = false
    if (previousMode) announceConcealmentChange(host)
    return
  }

  host.setAttribute(CONCEALMENT_ATTRIBUTE, mode)
  prepareConcealedHost(host)
  if (previousMode !== mode) {
    host.classList.remove("loot-magnifier-secret--under-lens")
    host.setAttribute("aria-hidden", "true")
    host.inert = true
    announceConcealmentChange(host)
  }
}
