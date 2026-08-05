import { KEY_COLOR_DETAILS, type KeyColor } from "./key-colors.ts"

export function puzzleColorLabel(color: KeyColor): string {
  return KEY_COLOR_DETAILS[color].label
}

export function createPuzzlePieceGraphic(
  color: KeyColor,
  number: number,
): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 64 64")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add(
    "loot-puzzle-piece-graphic",
    "loot-puzzle-color--" + color,
  )

  const shadow = document.createElementNS("http://www.w3.org/2000/svg", "path")
  shadow.setAttribute(
    "d",
    "M9 9h17c-1 2-2 4-2 7a8 8 0 0 0 16 0c0-3-1-5-2-7h17v17c-2-1-4-2-7-2a8 8 0 0 0 0 16c3 0 5-1 7-2v17H38c1-2 2-4 2-7a8 8 0 0 0-16 0c0 3 1 5 2 7H9V38c2 1 4 2 7 2a8 8 0 0 0 0-16c-3 0-5 1-7 2V9Z",
  )
  shadow.classList.add("loot-puzzle-piece__shadow")

  const piece = document.createElementNS("http://www.w3.org/2000/svg", "path")
  piece.setAttribute(
    "d",
    "M6 6h18c-1 2-2 4-2 7a10 10 0 0 0 20 0c0-3-1-5-2-7h18v18c-2-1-4-2-7-2a10 10 0 0 0 0 20c3 0 5-1 7-2v18H40c1-2 2-4 2-7a10 10 0 0 0-20 0c0 3 1 5 2 7H6V40c2 1 4 2 7 2a10 10 0 0 0 0-20c-3 0-5 1-7 2V6Z",
  )
  piece.classList.add("loot-puzzle-piece__body")

  const highlight = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  )
  highlight.setAttribute("d", "M10 10h14v4H14v10h-4V10Z")
  highlight.classList.add("loot-puzzle-piece__highlight")

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
  label.setAttribute("x", "50%")
  label.setAttribute("y", "50%")
  label.setAttribute("text-anchor", "middle")
  label.setAttribute("dominant-baseline", "central")
  label.classList.add("loot-puzzle-piece__number")
  label.textContent = String(number)

  svg.append(shadow, piece, highlight, label)
  return svg
}
