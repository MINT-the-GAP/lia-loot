import { formatScore, trophyTier } from "./score"
import { injectStyles } from "./style"
import type { TrophyTier } from "./types"

const DIALOG_ID = "lia-loot-highscore-dialog"
const SVG_NS = "http://www.w3.org/2000/svg"

const TROPHIES: Record<Exclude<TrophyTier, null>, { fill: string; stroke: string; label: string }> = {
  gold: { fill: "#D4AF37", stroke: "#725A00", label: "Goldene Trophäe" },
  silver: { fill: "#A7A9AC", stroke: "#55585C", label: "Silberne Trophäe" },
  copper: { fill: "#B87333", stroke: "#6A3517", label: "Kupferfarbene Trophäe" },
}

function createTrophy(tier: Exclude<TrophyTier, null>): SVGSVGElement {
  const colors = TROPHIES[tier]
  const svg = document.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 64 64")
  svg.setAttribute("class", "loot-highscore-trophy")
  svg.setAttribute("role", "img")
  svg.setAttribute("aria-label", colors.label)

  const cup = document.createElementNS(SVG_NS, "path")
  cup.setAttribute(
    "d",
    "M18 8h28v10c0 11.5-5.8 20.6-14 23.4V48h10v7H22v-7h10v-6.6C23.8 38.6 18 29.5 18 18V8Z",
  )
  cup.setAttribute("fill", colors.fill)
  cup.setAttribute("stroke", colors.stroke)
  cup.setAttribute("stroke-width", "2.5")
  cup.setAttribute("stroke-linejoin", "round")

  const handles = document.createElementNS(SVG_NS, "path")
  handles.setAttribute("d", "M18 13H9v5c0 8.8 4.8 14.4 13 16M46 13h9v5c0 8.8-4.8 14.4-13 16")
  handles.setAttribute("fill", "none")
  handles.setAttribute("stroke", colors.stroke)
  handles.setAttribute("stroke-width", "4")
  handles.setAttribute("stroke-linecap", "round")
  handles.setAttribute("stroke-linejoin", "round")

  svg.append(handles, cup)
  return svg
}

function closeDialog(dialog: HTMLDialogElement): void {
  if (typeof dialog.close === "function" && dialog.open) {
    dialog.close()
  } else {
    dialog.removeAttribute("open")
  }
}

function asDialog(element: HTMLElement | null): HTMLDialogElement | null {
  return element?.tagName === "DIALOG" ? (element as HTMLDialogElement) : null
}

function getDialog(): HTMLDialogElement {
  const existing = asDialog(document.getElementById(DIALOG_ID))
  if (existing) return existing

  const dialog = document.createElement("dialog")
  dialog.id = DIALOG_ID
  dialog.className = "loot-highscore-dialog"

  const card = document.createElement("div")
  card.className = "loot-highscore-card"
  card.setAttribute("data-loot-highscore-content", "")

  const close = document.createElement("button")
  close.type = "button"
  close.className = "loot-highscore-close"
  close.setAttribute("aria-label", "Highscore schließen")
  close.textContent = "×"
  close.addEventListener("click", () => closeDialog(dialog))

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog)
  })

  card.appendChild(close)
  dialog.appendChild(card)
  document.body.appendChild(dialog)
  return dialog
}

export function showHighscore(score: number, maxPoints: number): void {
  injectStyles()
  const dialog = getDialog()
  const card = dialog.querySelector<HTMLElement>("[data-loot-highscore-content]")
  if (!card) return

  card.querySelectorAll(".loot-highscore-trophy, .loot-highscore-points").forEach((node) => node.remove())

  const tier = trophyTier(score, maxPoints)
  if (tier) card.appendChild(createTrophy(tier))

  const points = document.createElement("p")
  points.id = "lia-loot-highscore-points"
  points.className = "loot-highscore-points"
  points.textContent = `${formatScore(score)} Punkte`
  card.appendChild(points)
  dialog.setAttribute("aria-labelledby", points.id)

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal()
  } else {
    dialog.setAttribute("open", "")
    dialog.setAttribute("role", "dialog")
    dialog.setAttribute("aria-modal", "true")
  }

  card.querySelector<HTMLButtonElement>(".loot-highscore-close")?.focus()
}

export function hideHighscore(): void {
  const dialog = asDialog(document.getElementById(DIALOG_ID))
  if (dialog) closeDialog(dialog)
}
