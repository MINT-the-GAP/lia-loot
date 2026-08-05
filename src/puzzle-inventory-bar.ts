import type { KeyColor } from "./key-colors.ts"
import {
  installResourceBar,
  refreshResourceBarVisibility,
} from "./resource-bar.ts"
import {
  createPuzzlePieceGraphic,
  puzzleColorLabel,
} from "./puzzle-visual.ts"

const INVENTORY_ID = "lia-loot-puzzle-inventory"

export interface PuzzleInventoryPiece {
  color: KeyColor
  number: number
}

export interface PuzzleInventorySelection {
  color: KeyColor
  number: number
}

function pieceKey(piece: PuzzleInventoryPiece): string {
  return piece.color + ":" + piece.number
}

function installPuzzleInventory(): HTMLElement {
  const existing = document.getElementById(INVENTORY_ID)
  if (existing) return existing

  const inventory = document.createElement("div")
  inventory.id = INVENTORY_ID
  inventory.className = "loot-puzzle-inventory"
  inventory.setAttribute("role", "group")
  inventory.setAttribute("aria-label", "Puzzleteile")

  const list = document.createElement("div")
  list.className = "loot-puzzle-inventory__list"
  list.setAttribute("role", "list")
  inventory.appendChild(list)
  installResourceBar().appendChild(inventory)
  return inventory
}

export function renderPuzzleInventory(
  pieces: readonly PuzzleInventoryPiece[],
  selection: PuzzleInventorySelection | null,
): void {
  if (pieces.length === 0) {
    document.getElementById(INVENTORY_ID)?.remove()
    refreshResourceBarVisibility()
    return
  }

  const focused =
    document.activeElement instanceof HTMLElement
      ? document.activeElement.dataset.lootPuzzleInventoryPiece ?? null
      : null
  const inventory = installPuzzleInventory()
  const signature =
    pieces.map(pieceKey).join(",") +
    "|" +
    (selection ? pieceKey(selection) : "-")
  if (inventory.dataset.lootPuzzleInventorySignature === signature) {
    refreshResourceBarVisibility()
    return
  }
  const list = inventory.querySelector<HTMLElement>(
    ".loot-puzzle-inventory__list",
  )
  if (!list) return
  const fragment = document.createDocumentFragment()

  for (const piece of pieces) {
    const key = pieceKey(piece)
    const selected =
      selection?.color === piece.color && selection.number === piece.number
    const item = document.createElement("span")
    item.setAttribute("role", "listitem")

    const button = document.createElement("button")
    button.type = "button"
    button.className = "loot-puzzle-inventory__piece"
    button.classList.toggle("loot-puzzle-piece--selected", selected)
    button.dataset.lootPuzzleInventoryPiece = key
    button.dataset.lootPuzzleColor = piece.color
    button.dataset.lootPuzzleNumber = String(piece.number)
    button.setAttribute("aria-pressed", String(selected))
    button.setAttribute(
      "aria-label",
      "Puzzleteil " +
        piece.number +
        ", " +
        puzzleColorLabel(piece.color) +
        ", auswählen",
    )
    button.draggable = true
    button.appendChild(createPuzzlePieceGraphic(piece.color, piece.number))
    item.appendChild(button)
    fragment.appendChild(item)
  }
  list.replaceChildren(fragment)
  inventory.dataset.lootPuzzleInventorySignature = signature
  refreshResourceBarVisibility()
  if (focused) {
    list
      .querySelector<HTMLElement>(
        '[data-loot-puzzle-inventory-piece="' + CSS.escape(focused) + '"]',
      )
      ?.focus({ preventScroll: true })
  }
}

export function focusPuzzleInventoryPiece(
  color: KeyColor,
  number: number,
): void {
  const active = document.activeElement
  if (
    active instanceof HTMLElement &&
    active !== document.body &&
    active !== document.documentElement &&
    active.isConnected
  ) {
    return
  }
  const key = color + ":" + number
  document
    .querySelector<HTMLElement>(
      '[data-loot-puzzle-inventory-piece="' + CSS.escape(key) + '"]',
    )
    ?.focus({ preventScroll: true })
}
