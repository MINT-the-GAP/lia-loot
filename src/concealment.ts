export type ConcealmentMode = "solid" | "dust"

export const CONCEALMENT_ATTRIBUTE = "data-loot-concealment"
export const CONCEALMENT_SELECTOR = `[${CONCEALMENT_ATTRIBUTE}]`
export const CONCEALMENT_CHANGED_EVENT = "lia-loot:concealment-changed"

const CONCEALMENT_ID_ATTRIBUTE = "data-loot-concealment-id"

const CONCEALED_ITEM_ID_SELECTORS = [
  ["data-loot-chest-button", "chest"],
  ["data-loot-key-button", "key"],
  ["data-loot-magnifier-button", "magnifier"],
  ["data-loot-tool-pickup", "tool"],
] as const

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

function usableId(value: string | null): string | null {
  const id = value?.trim() ?? ""
  return id && !id.startsWith("@") ? id : null
}

/** Returns the stable logical object represented by a concealed DOM host. */
export function concealmentIdOf(host: HTMLElement): string | null {
  const explicit = usableId(host.getAttribute(CONCEALMENT_ID_ATTRIBUTE))
  if (explicit) return explicit

  const authoredSecret = usableId(host.getAttribute("data-secret-id"))
  if (authoredSecret) return `secret:${authoredSecret}`

  const revealLayer = usableId(
    host.getAttribute("data-loot-reveal-cover-slot"),
  )
  if (revealLayer) return `reveal:${revealLayer}`

  for (const [attribute, prefix] of CONCEALED_ITEM_ID_SELECTORS) {
    const item = host.querySelector<HTMLElement>(`[${attribute}]`)
    const itemId = usableId(item?.getAttribute(attribute) ?? null)
    if (itemId) return `${prefix}:${itemId}`
  }

  return null
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

export function notifyConcealmentLayoutChanged(host: HTMLElement): void {
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
    if (previousMode) notifyConcealmentLayoutChanged(host)
    return
  }

  host.setAttribute(CONCEALMENT_ATTRIBUTE, mode)
  prepareConcealedHost(host)
  if (previousMode !== mode) {
    host.classList.remove("loot-magnifier-secret--under-lens")
    host.setAttribute("aria-hidden", "true")
    host.inert = true
    notifyConcealmentLayoutChanged(host)
  }
}
