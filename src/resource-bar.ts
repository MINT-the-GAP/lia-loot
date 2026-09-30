import { createResourceGraphic } from "./resource-visual.ts"

const BAR_ID = "lia-loot-resource-bar"
const STATUS_ID = "lia-loot-resource-status"
const HEADER_SELECTORS = ["header", ".lia-header", "[role='banner']"]
type ResourceBarKind = "coins" | "gems" | "energy"

function resourceItem(kind: ResourceBarKind, label: string): HTMLDivElement {
  const item = document.createElement("div")
  item.className = "loot-resource loot-resource--hidden"
  item.setAttribute("aria-label", `${label}: 0`)
  const value = document.createElement("span")
  value.className = "loot-resource-value"
  value.dataset.lootResource = kind
  value.textContent = "0"
  item.append(createResourceGraphic(kind), value)
  return item
}

function statusMessage(): HTMLSpanElement {
  const status = document.createElement("span")
  status.id = STATUS_ID
  status.className = "loot-resource-status"
  status.setAttribute("aria-live", "polite")
  status.setAttribute("aria-atomic", "true")
  return status
}

function ensureResourceStatus(): HTMLElement {
  const existing = document.getElementById(STATUS_ID)
  if (existing) {
    if (existing.parentElement !== document.body) {
      document.body.appendChild(existing)
    }
    return existing
  }
  const status = statusMessage()
  document.body.appendChild(status)
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
  if (existing) {
    ensureResourceStatus()
    return existing
  }

  const bar = document.createElement("aside")
  bar.id = BAR_ID
  bar.className = "loot-resource-bar loot-resource-bar--empty"
  bar.setAttribute("aria-label", "Ressourcen und Inventar")
  bar.append(
    resourceItem("coins", "Goldmünzen"),
    resourceItem("gems", "Diamanten"),
    resourceItem("energy", "Energie"),
  )
  document.body.appendChild(bar)
  ensureResourceStatus()
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
  const hasMagnifier =
    bar.querySelector("[data-loot-magnifier-tool]") !== null
  const hasFlashlight =
    bar.querySelector("[data-loot-flashlight-tool]") !== null
  const hasExplorationTool =
    bar.querySelector("[data-loot-tool-control]") !== null
  const hasPuzzlePiece =
    bar.querySelector("[data-loot-puzzle-inventory-piece]") !== null
  const hasAtlas = bar.querySelector("[data-loot-atlas-tool]") !== null
  const hasPet = bar.querySelector("[data-loot-pet-control]") !== null
  const hasCatFood =
    bar.querySelector(
      "[data-loot-cat-food-control], [data-loot-cat-food-menu-control]",
    ) !== null
  bar.classList.toggle(
    "loot-resource-bar--empty",
    !hasVisibleResource &&
      !hasKeys &&
      !hasMagnifier &&
      !hasFlashlight &&
      !hasExplorationTool &&
      !hasPuzzlePiece &&
      !hasAtlas &&
      !hasPet &&
      !hasCatFood,
  )
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
  installResourceBar()
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
        : "Keine Energie mehr zum Prüfen oder Starten."
}

export function announceResource(message: string): void {
  const status = ensureResourceStatus()
  status.textContent = ""
  window.setTimeout(() => {
    status.textContent = message
  }, 0)
}
