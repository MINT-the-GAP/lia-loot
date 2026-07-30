const BAR_ID = "lia-loot-resource-bar"
const HEADER_SELECTORS = ["header", ".lia-header", "[role='banner']"]
type ResourceBarKind = "coins" | "gems" | "energy"

function resourceIcon(kind: ResourceBarKind): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 32 32")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-resource-icon", `loot-resource-icon--${kind}`)
  svg.innerHTML =
    kind === "coins"
      ? `<ellipse cx="16" cy="8" rx="10" ry="5"/><path d="M6 8v6c0 2.8 4.5 5 10 5s10-2.2 10-5V8"/><path d="M6 14v6c0 2.8 4.5 5 10 5s10-2.2 10-5v-6"/>`
      : kind === "gems"
        ? `<path d="M8 5h16l5 7-13 15L3 12l5-7Z"/><path d="m3 12 8-2 5 17 5-17 8 2M8 5l3 5 5-5 5 5 3-5"/>`
        : `<path d="M19 2 7 18h8l-2 12 12-18h-8l2-10Z"/>`
  return svg
}

function resourceItem(kind: ResourceBarKind, label: string): HTMLDivElement {
  const item = document.createElement("div")
  item.className = "loot-resource loot-resource--hidden"
  item.setAttribute("aria-label", `${label}: 0`)
  const value = document.createElement("span")
  value.className = "loot-resource-value"
  value.dataset.lootResource = kind
  value.textContent = "0"
  item.append(resourceIcon(kind), value)
  return item
}

function statusMessage(): HTMLSpanElement {
  const status = document.createElement("span")
  status.className = "loot-resource-status"
  status.setAttribute("aria-live", "polite")
  status.setAttribute("aria-atomic", "true")
  return status
}

function findHeader(): HTMLElement | null {
  for (const selector of HEADER_SELECTORS) {
    const header = document.querySelector<HTMLElement>(selector)
    if (header && header.id !== BAR_ID && !header.closest(`#${BAR_ID}`)) return header
  }
  return null
}

function positionBar(bar: HTMLElement): void {
  const header = findHeader()
  const bottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0
  bar.style.setProperty("--loot-resource-top", `${Math.round(bottom)}px`)
}

export function installResourceBar(): HTMLElement {
  const existing = document.getElementById(BAR_ID)
  if (existing) return existing

  const bar = document.createElement("aside")
  bar.id = BAR_ID
  bar.className = "loot-resource-bar loot-resource-bar--empty"
  bar.setAttribute("aria-label", "Ressourcen und Schlüsselinventar")
  bar.append(
    resourceItem("coins", "Goldmünzen"),
    resourceItem("gems", "Diamanten"),
    resourceItem("energy", "Energie"),
    statusMessage(),
  )
  document.body.appendChild(bar)
  const updatePosition = () => positionBar(bar)
  updatePosition()
  window.addEventListener("resize", updatePosition, { passive: true })
  window.addEventListener("scroll", updatePosition, { passive: true })
  const header = findHeader()
  if (header && "ResizeObserver" in window) new ResizeObserver(updatePosition).observe(header)
  return bar
}

export function refreshResourceBarVisibility(): void {
  const bar = document.getElementById(BAR_ID)
  if (!bar) return
  const hasVisibleResource = [...bar.querySelectorAll(".loot-resource")].some(
    (item) => !item.classList.contains("loot-resource--hidden"),
  )
  const hasKeys = bar.querySelector("[data-loot-key-color]") !== null
  bar.classList.toggle("loot-resource-bar--empty", !hasVisibleResource && !hasKeys)
}

export function renderResources(
  gold: number,
  diamonds: number,
  energy: number | null = null,
): void {
  installResourceBar()
  const values = { coins: gold, gems: diamonds, energy }
  const labels: Record<ResourceBarKind, string> = {
    coins: "Goldmünzen",
    gems: "Diamanten",
    energy: "Energie",
  }

  for (const kind of ["coins", "gems", "energy"] as const) {
    const value = document.querySelector<HTMLElement>(
      `[data-loot-resource="${kind}"]`,
    )
    const item = value?.parentElement
    const hidden = kind === "energy" && energy === null
    item?.classList.toggle("loot-resource--hidden", hidden)
    if (!value || hidden) continue

    const rawValue = values[kind]
    const safeValue = Math.max(
      0,
      Math.floor(
        typeof rawValue === "number" && Number.isFinite(rawValue)
          ? rawValue
          : 0,
      ),
    )
    value.textContent = safeValue.toLocaleString("de-DE")
    item?.setAttribute("aria-label", `${labels[kind]}: ${safeValue}`)
  }
  refreshResourceBarVisibility()
}

export function showInsufficientResource(kind: ResourceBarKind): void {
  const value = document.querySelector<HTMLElement>(`[data-loot-resource="${kind}"]`)
  const item = value?.parentElement
  const status = document.querySelector<HTMLElement>(".loot-resource-status")
  if (!item || !status) return

  item.classList.remove("loot-resource--insufficient")
  void item.offsetWidth
  item.classList.add("loot-resource--insufficient")
  item.addEventListener(
    "animationend",
    () => item.classList.remove("loot-resource--insufficient"),
    { once: true },
  )

  status.textContent =
    kind === "coins"
      ? "Nicht genug Gold für einen Hinweis."
      : kind === "gems"
        ? "Nicht genug Diamanten zum Auflösen."
        : "Keine Energie mehr zum Prüfen."
}

export function announceResource(message: string): void {
  const status = document.querySelector<HTMLElement>(".loot-resource-status")
  if (!status) return
  status.textContent = ""
  window.setTimeout(() => {
    status.textContent = message
  }, 0)
}
