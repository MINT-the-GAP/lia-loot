import {
  buildPuzzleCatalog,
  validPuzzleGateConfigurations,
  type PuzzleCatalog,
  type PuzzleGateDefinition,
  type PuzzlePieceDefinition,
} from "./puzzle-catalog.ts"
import {
  earliestUnsolvedPuzzleGate,
  puzzleSectionAllowed,
  type PuzzleAccessGate,
} from "./puzzle-access.ts"
import { requireCoursePuzzleDeclarations } from "./course-chests.ts"
import { CollectibleVisibilityGate } from "./collectible-visibility.ts"
import { setHostConcealment } from "./concealment.ts"
import {
  clearHostRevealLayers,
  hostIsRevealBlocked,
  REVEAL_CHANGED_EVENT,
  setHostRevealLayers,
} from "./exploration.ts"
import type { KeyColor } from "./key-colors.ts"
import {
  focusPuzzleInventoryPiece,
  renderPuzzleInventory,
  type PuzzleInventorySelection,
} from "./puzzle-inventory-bar.ts"
import {
  parsePuzzleGateOptions,
  parsePuzzlePieceOptions,
} from "./puzzle-options.ts"
import { PuzzleStore } from "./puzzle-store.ts"
import {
  createPuzzlePieceGraphic,
  puzzleColorLabel,
} from "./puzzle-visual.ts"
import { setRangeGate } from "./range-gate.ts"
import { announceResource } from "./resource-bar.ts"
import {
  refreshPuzzleSlideAccess,
  setPuzzleSlideAccessGuard,
} from "./secret-slides.ts"
import {
  observeLiaSlideActivity,
  liaSlideIsAccessible,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"

const PIECE_TAG = "lia-loot-puzzle-piece"
const GATE_TAG = "lia-loot-puzzle-gate"
const RANGE_BLOCKED_ATTRIBUTE = "data-loot-puzzle-range-blocked"
const PICKUP_DURATION = 400

export interface PuzzleRuntimeController {
  catalogReady(total: number, solved: number): void
  changed(): void
  gateSolved(solved: number, color: KeyColor): void
}

interface RenderedFallbackGate {
  access: PuzzleAccessGate
  host: HTMLElement
  parsed: ReturnType<typeof parsePuzzleGateOptions>
}

let store: PuzzleStore | null = null
let controller: PuzzleRuntimeController | null = null
let catalog: PuzzleCatalog | null = null
let selected: PuzzleInventorySelection | null = null
let draggedSelection: PuzzleInventorySelection | null = null
let pendingGateFocus: { color: KeyColor; slot: number } | null = null
let observer: MutationObserver | null = null
let syncTimer: number | null = null
let installed = false
let slideObserverInstalled = false
let revealListenerInstalled = false
let discoveryState: "pending" | "complete" | "failed" = "pending"
let failedAccessSignature = ""
const eligiblePieces = new Set<string>()
const collectingPieces = new Set<string>()
const warned = new Set<string>()
const visibility = new CollectibleVisibilityGate()
const anchorGatedElements = new Map<string, Set<HTMLElement>>()

function hostSection(host: HTMLElement, idAttribute: string): number | null {
  const fromId = sectionFromLootId(host.getAttribute(idAttribute) ?? "")
  if (fromId !== null) return fromId
  const slide = host.closest<HTMLElement>("main")
  const container = slide?.parentElement
  if (!slide || !container) return null
  const slides = [...container.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.tagName === "MAIN",
  )
  const index = slides.indexOf(slide)
  return index >= 0 ? index : null
}

function renderedFallbackGates(): RenderedFallbackGate[] {
  return [...document.querySelectorAll<HTMLElement>(GATE_TAG)].flatMap(
    (host, sourceOrder) => {
      const section = hostSection(host, "data-gate-id")
      if (section === null) return []
      const parsed = parsePuzzleGateOptions(
        host.getAttribute("data-options") ?? "",
      )
      const authoredId = host.getAttribute("data-gate-id")?.trim()
      return [
        {
          access: {
            color: parsed.color,
            gateId:
              "puzzle-gate:fallback:" +
              (authoredId || section + ":" + sourceOrder),
            mode: parsed.onlyOnSlide ? "anchor" : "navigation",
            section,
            sourceOrder,
          },
          host,
          parsed,
        },
      ]
    },
  )
}

function accessGates(): PuzzleAccessGate[] {
  if (!catalog) {
    return discoveryState === "failed"
      ? renderedFallbackGates().map((gate) => gate.access)
      : []
  }
  return catalog.gates.map((gate) => ({
      color: gate.color,
      gateId: gate.id,
      mode: gate.onlyOnSlide ? "anchor" : "navigation",
      section: gate.section,
      sourceOrder: gate.sourceOrder,
    }))
}

function solvedGateIds(): Set<string> {
  return new Set(
    (store?.solvedColors() ?? []).map((color) => "puzzle-gate:" + color),
  )
}

function currentFrontier(): PuzzleAccessGate | null {
  return earliestUnsolvedPuzzleGate(accessGates(), solvedGateIds())
}

function syncNavigationGuard(): void {
  setPuzzleSlideAccessGuard({
    allowed: (section) => puzzleSectionAllowed(section, currentFrontier()),
    message: () => {
      const frontier = currentFrontier()
      return frontier
        ? frontier.color
          ? "Löse zuerst das Puzzletor in " +
            puzzleColorLabel(frontier.color) +
            "."
          : "Das nächste Puzzletor ist fehlerhaft konfiguriert und bleibt geschlossen."
        : "Diese Folie ist noch nicht freigeschaltet."
    },
  })
}

function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return
  warned.add(key)
  console.warn("Loot: " + message)
}

function clearPieceHost(host: HTMLElement): void {
  clearHostRevealLayers(host)
  setHostConcealment(host, null)
  host.replaceChildren()
  delete host.dataset.lootPuzzleRender
}

function pieceForHost(host: HTMLElement): PuzzlePieceDefinition | null {
  if (!catalog) return null
  const options = host.getAttribute("data-options") ?? ""
  const parsed = parsePuzzlePieceOptions(options)
  if (!parsed.color || parsed.number === null) return null
  const section = hostSection(host, "data-piece-id")
  return (
    catalog.pieces.find(
      (piece) =>
        piece.color === parsed.color &&
        piece.number === parsed.number &&
        (section === null || piece.section === section),
    ) ??
    catalog.pieces.find(
      (piece) =>
        piece.color === parsed.color && piece.number === parsed.number,
    ) ??
    null
  )
}

function gateForHost(host: HTMLElement): PuzzleGateDefinition | null {
  if (!catalog) return null
  const options = host.getAttribute("data-options") ?? ""
  const parsed = parsePuzzleGateOptions(options)
  const section = hostSection(host, "data-gate-id")
  const exact = catalog.gates.find(
    (gate) =>
      gate.options === options.trim() &&
      (section === null || gate.section === section),
  )
  if (exact) return exact
  if (!parsed.color) return null
  return (
    catalog.gates.find(
      (gate) =>
        gate.color === parsed.color &&
        (section === null || gate.section === section),
    ) ??
    null
  )
}

function createPickupButton(piece: PuzzlePieceDefinition): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className =
    "loot-puzzle-pickup loot-puzzle-color--" + piece.color
  button.dataset.lootPuzzlePickup = piece.id
  button.dataset.lootPuzzleColor = piece.color!
  button.dataset.lootPuzzleNumber = String(piece.number)
  button.setAttribute(
    "aria-label",
    "Puzzleteil " +
      piece.number +
      ", " +
      puzzleColorLabel(piece.color!) +
      ", einsammeln",
  )
  button.appendChild(createPuzzlePieceGraphic(piece.color!, piece.number!))
  return button
}

function syncPieceHost(
  host: HTMLElement,
  piece: PuzzlePieceDefinition,
): void {
  if (!store || !piece.valid || !piece.color || piece.number === null) {
    eligiblePieces.delete(piece.id)
    clearPieceHost(host)
    return
  }
  if (store.isPieceCollected(piece.color, piece.number)) {
    eligiblePieces.delete(piece.id)
    visibility.forget("puzzle:" + piece.id)
    if (!collectingPieces.has(piece.id)) clearPieceHost(host)
    return
  }
  if (collectingPieces.has(piece.id)) return
  if (!liaSlideIsAccessible(piece.section)) {
    eligiblePieces.delete(piece.id)
    clearPieceHost(host)
    return
  }

  const visible = visibility.visible(
    "puzzle:" + piece.id,
    piece.visibility,
    sourceSlideIsActive(piece.section, host),
    scheduleSync,
  )
  if (!visible) {
    eligiblePieces.delete(piece.id)
    clearPieceHost(host)
    return
  }

  const content = setHostRevealLayers(host, piece.id, piece.layers)
  let button = content.querySelector<HTMLButtonElement>(
    '[data-loot-puzzle-pickup="' + piece.id + '"]',
  )
  if (!button) {
    setHostConcealment(content, null)
    content.replaceChildren(createPickupButton(piece))
    button = content.querySelector<HTMLButtonElement>(
      '[data-loot-puzzle-pickup="' + piece.id + '"]',
    )
  }
  setHostConcealment(content, piece.concealment)
  if (button && !hostIsRevealBlocked(host)) eligiblePieces.add(piece.id)
  else eligiblePieces.delete(piece.id)
}

function renderInvalidGate(
  host: HTMLElement,
  color: KeyColor | null,
  errors: readonly string[],
): void {
  const signature = "invalid:" + color + ":" + errors.join("|")
  if (host.dataset.lootPuzzleRender === signature) return
  host.dataset.lootPuzzleRender = signature

  const panel = document.createElement("section")
  panel.className = "loot-puzzle-gate loot-puzzle-gate--invalid"
  panel.setAttribute("role", "alert")
  const heading = document.createElement("h3")
  heading.className = "loot-puzzle-gate__title"
  heading.textContent =
    "Puzzletor" +
    (color ? " in " + puzzleColorLabel(color) : "") +
    " ist nicht konfiguriert"
  const list = document.createElement("ul")
  for (const error of errors) {
    const item = document.createElement("li")
    item.textContent = error
    list.appendChild(item)
  }
  panel.append(heading, list)
  host.replaceChildren(panel)
}

function renderGate(host: HTMLElement, gate: PuzzleGateDefinition): void {
  if (!store) return
  if (!gate.valid || !gate.color) {
    renderInvalidGate(host, gate.color, gate.errors)
    return
  }

  const placement = store.placement(gate.color)
  const solved = store.isGateSolved(gate.color)
  const collected = store.state().collected[gate.color].length
  const selectedKey = selected ? selected.color + ":" + selected.number : "-"
  const signature =
    placement.map((number) => number ?? "-").join(",") +
    ":" +
    solved +
    ":" +
    collected +
    ":" +
    selectedKey
  if (host.dataset.lootPuzzleRender === signature) return
  host.dataset.lootPuzzleRender = signature

  const panel = document.createElement("section")
  panel.className =
    "loot-puzzle-gate loot-puzzle-color--" + gate.color
  panel.classList.toggle("loot-puzzle-gate--open", solved)
  panel.dataset.lootPuzzleGatePanel = gate.id
  panel.tabIndex = -1
  panel.setAttribute(
    "aria-label",
    "Puzzletor in " +
      puzzleColorLabel(gate.color) +
      ", " +
      (solved ? "geöffnet" : "geschlossen"),
  )

  const heading = document.createElement("h3")
  heading.className = "loot-puzzle-gate__title"
  heading.tabIndex = -1
  heading.textContent =
    "Puzzletor – " +
    puzzleColorLabel(gate.color) +
    " – " +
    (solved ? "geöffnet" : "geschlossen")

  const progress = document.createElement("p")
  progress.className = "loot-puzzle-gate__progress"
  progress.textContent = solved
    ? "Das Tor ist offen. Die folgenden Inhalte sind freigeschaltet."
    : "Gesammelt: " +
      collected +
      " von " +
      gate.slotCount +
      " Puzzleteilen. Wähle ein Teil und anschließend einen Steckplatz."

  const frame = document.createElement("div")
  frame.className = "loot-puzzle-gate__frame"
  const grid = document.createElement("div")
  grid.className = "loot-puzzle-gate__grid"
  grid.style.setProperty("--loot-puzzle-columns", String(gate.columns))
  grid.setAttribute("role", "group")
  grid.setAttribute("aria-label", "Steckplätze des Puzzletors")

  placement.forEach((number, slot) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "loot-puzzle-gate__slot"
    button.dataset.lootPuzzleGate = gate.id
    button.dataset.lootPuzzleColor = gate.color!
    button.dataset.lootPuzzleSlot = String(slot)
    button.disabled = solved
    if (number !== null) {
      const isSelected =
        selected?.color === gate.color && selected.number === number
      button.dataset.lootPuzzleNumber = String(number)
      button.classList.toggle("loot-puzzle-piece--selected", isSelected)
      button.setAttribute("aria-pressed", String(isSelected))
      button.setAttribute(
        "aria-label",
        "Steckplatz " +
          (slot + 1) +
          " von " +
          gate.slotCount +
          ", belegt mit Puzzleteil " +
          number +
          (solved ? "" : ", auswählen oder verschieben"),
      )
      button.draggable = !solved
      button.appendChild(createPuzzlePieceGraphic(gate.color!, number))
    } else {
      button.setAttribute("aria-pressed", "false")
      button.setAttribute(
        "aria-label",
        "Steckplatz " +
          (slot + 1) +
          " von " +
          gate.slotCount +
          ", leer",
      )
    }
    grid.appendChild(button)
  })

  const doors = document.createElement("div")
  doors.className = "loot-puzzle-gate__doors"
  doors.setAttribute("aria-hidden", "true")
  doors.append(document.createElement("span"), document.createElement("span"))
  frame.append(grid, doors)
  panel.append(heading, progress, frame)
  host.replaceChildren(panel)
}

function markerBoundary(marker: HTMLElement): ChildNode {
  let boundary: ChildNode = marker
  while (boundary.parentElement) {
    const parent = boundary.parentElement
    const emptyWrapper =
      parent.tagName === "DIV" && parent.attributes.length === 0
    if (
      parent.tagName !== "P" &&
      parent.tagName !== "SPAN" &&
      parent.tagName !== "LIA-KEEP" &&
      !emptyWrapper
    ) {
      break
    }
    const otherContent = [...parent.childNodes].some(
      (node) =>
        node !== boundary &&
        node.nodeType !== Node.COMMENT_NODE &&
        (node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())),
    )
    if (otherContent) break
    boundary = parent
  }
  return boundary
}

function rangeUnitsAfter(host: HTMLElement): HTMLElement[] {
  const scope =
    host.closest<HTMLElement>(
      "[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main",
    ) ?? document.body
  const boundary = markerBoundary(host)
  if (!scope.isConnected || !boundary.isConnected) return []
  const range = scope.ownerDocument.createRange()
  try {
    range.setStartAfter(boundary)
    range.setEnd(scope, scope.childNodes.length)
  } catch {
    return []
  }

  const units: HTMLElement[] = []
  const collect = (parent: HTMLElement): void => {
    for (const child of [...parent.children] as HTMLElement[]) {
      if (!range.intersectsNode(child)) continue
      let contained = false
      try {
        contained =
          range.comparePoint(child, 0) === 0 &&
          range.comparePoint(child, child.childNodes.length) === 0
      } catch {
        contained = false
      }
      if (contained) units.push(child)
      else collect(child)
    }
  }
  collect(scope)
  return units
}

function commitAnchorRanges(
  nextByGate: ReadonlyMap<string, Set<HTMLElement>>,
): void {
  for (const [gateId, previous] of anchorGatedElements) {
    const next = nextByGate.get(gateId) ?? new Set<HTMLElement>()
    for (const element of previous) {
      if (!next.has(element)) {
        setRangeGate(
          element,
          "puzzle:" + gateId,
          RANGE_BLOCKED_ATTRIBUTE,
          false,
        )
      }
    }
  }
  for (const [gateId, next] of nextByGate) {
    for (const element of next) {
      setRangeGate(
        element,
        "puzzle:" + gateId,
        RANGE_BLOCKED_ATTRIBUTE,
        true,
      )
    }
  }
  anchorGatedElements.clear()
  nextByGate.forEach((elements, gateId) =>
    anchorGatedElements.set(gateId, elements),
  )
}

function syncAnchorRanges(gateHosts: readonly HTMLElement[]): void {
  const nextByGate = new Map<string, Set<HTMLElement>>()
  for (const host of gateHosts) {
    const gate = gateForHost(host)
    if (!gate?.onlyOnSlide) continue
    const next = nextByGate.get(gate.id) ?? new Set<HTMLElement>()
    if (!gate.color || !store?.isGateSolved(gate.color)) {
      rangeUnitsAfter(host).forEach((element) => next.add(element))
    }
    nextByGate.set(gate.id, next)
  }
  commitAnchorRanges(nextByGate)
}

function inventoryPieces(): Array<{ color: KeyColor; number: number }> {
  if (!catalog || !store) return []
  return catalog.pieces
    .filter(
      (piece) =>
        piece.valid &&
        piece.color !== null &&
        piece.number !== null &&
        catalog?.gates.some(
          (gate) => gate.valid && gate.color === piece.color,
        ) &&
        store?.isPieceCollected(piece.color, piece.number) &&
        store.availablePieces(piece.color).includes(piece.number),
    )
    .map((piece) => ({ color: piece.color!, number: piece.number! }))
}

function syncFailedDiscovery(): void {
  eligiblePieces.clear()
  document
    .querySelectorAll<HTMLElement>(PIECE_TAG)
    .forEach(clearPieceHost)

  const fallbackGates = renderedFallbackGates()
  const nextByGate = new Map<string, Set<HTMLElement>>()
  for (const fallback of fallbackGates) {
    const errors = [
      ...fallback.parsed.errors,
      "Die Kursquelle konnte nicht geladen werden. Dieses Tor bleibt aus Sicherheitsgründen geschlossen.",
    ]
    renderInvalidGate(
      fallback.host,
      fallback.parsed.color,
      [...new Set(errors)],
    )
    if (fallback.access.mode === "anchor") {
      nextByGate.set(
        fallback.access.gateId,
        new Set(rangeUnitsAfter(fallback.host)),
      )
    }
  }
  commitAnchorRanges(nextByGate)
  renderPuzzleInventory([], null)

  const nextSignature = JSON.stringify(
    fallbackGates.map(({ access }) => access),
  )
  if (nextSignature !== failedAccessSignature) {
    failedAccessSignature = nextSignature
    refreshPuzzleSlideAccess()
  }
  observer?.takeRecords()
}

function restorePendingGateFocus(): void {
  const pending = pendingGateFocus
  pendingGateFocus = null
  if (!pending) return
  const findTarget = (): HTMLElement | null =>
    document.querySelector<HTMLElement>(
      '[data-loot-puzzle-slot="' +
        pending.slot +
        '"][data-loot-puzzle-color="' +
        pending.color +
        '"]',
    )
  const firstTarget = findTarget()
  firstTarget?.focus({ preventScroll: true })

  window.requestAnimationFrame(() => {
    const active = document.activeElement
    if (
      active instanceof HTMLElement &&
      active !== document.body &&
      active !== document.documentElement &&
      active !== firstTarget &&
      active.isConnected
    ) {
      return
    }
    findTarget()?.focus({ preventScroll: true })
  })
}

function syncAll(): void {
  syncTimer = null
  if (discoveryState === "failed") {
    syncFailedDiscovery()
    return
  }
  if (discoveryState !== "complete" || !catalog || !store) return
  eligiblePieces.clear()

  const pieceHosts = [
    ...document.querySelectorAll<HTMLElement>(PIECE_TAG),
  ]
  for (const host of pieceHosts) {
    const piece = pieceForHost(host)
    if (!piece) {
      const parsed = parsePuzzlePieceOptions(
        host.getAttribute("data-options") ?? "",
      )
      warnOnce(
        "piece:" + (host.getAttribute("data-piece-id") ?? parsed.errors.join("|")),
        "Puzzleteil bleibt verborgen. " + parsed.errors.join(" "),
      )
      clearPieceHost(host)
      continue
    }
    const gate = catalog.gates.find(
      (candidate) => candidate.color === piece.color,
    )
    if (!gate?.valid || !piece.valid || hostIsRevealBlocked(host, false)) {
      clearPieceHost(host)
      continue
    }
    syncPieceHost(host, piece)
  }

  const gateHosts = [...document.querySelectorAll<HTMLElement>(GATE_TAG)]
  for (const host of gateHosts) {
    const gate = gateForHost(host)
    if (gate) {
      renderGate(host, gate)
      if (!gate.valid) {
        warnOnce(gate.id, "Puzzletor bleibt geschlossen. " + gate.errors.join(" "))
      }
      continue
    }
    const parsed = parsePuzzleGateOptions(host.getAttribute("data-options") ?? "")
    renderInvalidGate(host, parsed.color, parsed.errors)
  }
  syncAnchorRanges(gateHosts)
  renderPuzzleInventory(inventoryPieces(), selected)
  restorePendingGateFocus()
  observer?.takeRecords()
}

function scheduleSync(): void {
  if (syncTimer !== null) return
  syncTimer = window.setTimeout(syncAll, 0)
}

function selectedFromElement(element: HTMLElement): PuzzleInventorySelection | null {
  const color = element.dataset.lootPuzzleColor as KeyColor | undefined
  const number = Number(element.dataset.lootPuzzleNumber)
  return color && Number.isInteger(number) ? { color, number } : null
}

function selectPiece(next: PuzzleInventorySelection): void {
  if (
    selected?.color === next.color &&
    selected.number === next.number
  ) {
    selected = null
    announceResource("Puzzleteilauswahl aufgehoben.")
  } else {
    selected = next
    announceResource(
      "Puzzleteil " +
        next.number +
        ", " +
        puzzleColorLabel(next.color) +
        ", ausgewählt.",
    )
  }
  scheduleSync()
}

function placeSelected(color: KeyColor, slot: number): void {
  if (!selected || !store) {
    announceResource("Wähle zuerst ein Puzzleteil aus.")
    return
  }
  if (selected.color !== color) {
    announceResource(
      "Dieses Teil gehört zum Puzzletor in " +
        puzzleColorLabel(selected.color) +
        ".",
    )
    return
  }
  const number = selected.number
  const result = store.placePiece(color, number, slot)
  if (result === "invalid") {
    announceResource("Dieses Puzzleteil kann hier nicht eingesetzt werden.")
    return
  }
  pendingGateFocus = { color, slot }
  selected = null
  if (result === "solved") {
    pendingGateFocus = null
    const solved = store.solvedColors().length
    announceResource(
      "Puzzletor in " + puzzleColorLabel(color) + " geöffnet.",
    )
    controller?.gateSolved(solved, color)
    controller?.changed()
    syncNavigationGuard()
    refreshPuzzleSlideAccess()
    scheduleSync()
    window.setTimeout(() => {
      document
        .querySelector<HTMLElement>(
          '[data-loot-puzzle-gate-panel="puzzle-gate:' + color + '"]',
        )
        ?.focus({ preventScroll: true })
    }, 0)
    return
  }
  const placement = store.placement(color)
  announceResource(
    placement.every((piece) => piece !== null)
      ? "Alle Plätze sind belegt, die Reihenfolge stimmt noch nicht."
      : "Puzzleteil " + number + " eingesetzt.",
  )
  controller?.changed()
  scheduleSync()
}

function handleClick(event: MouseEvent): void {
  const target =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>(
          "[data-loot-puzzle-pickup], [data-loot-puzzle-inventory-piece], [data-loot-puzzle-slot]",
        )
      : null
  if (!target || !store || !catalog) return

  const pickupId = target.dataset.lootPuzzlePickup
  if (pickupId) {
    const piece = catalog.pieces.find((candidate) => candidate.id === pickupId)
    if (
      !piece?.color ||
      piece.number === null ||
      !eligiblePieces.has(pickupId) ||
      collectingPieces.has(pickupId)
    ) {
      return
    }
    collectingPieces.add(pickupId)
    if (!store.collectPiece(piece.color, piece.number)) {
      collectingPieces.delete(pickupId)
      scheduleSync()
      return
    }
    target.classList.add("loot-puzzle-pickup--collected")
    target.setAttribute("aria-label", "Puzzleteil eingesammelt")
    announceResource(
      "Puzzleteil " +
        piece.number +
        ", " +
        puzzleColorLabel(piece.color) +
        ", gefunden.",
    )
    controller?.changed()
    window.setTimeout(() => {
      collectingPieces.delete(pickupId)
      scheduleSync()
      window.setTimeout(
        () => focusPuzzleInventoryPiece(piece.color!, piece.number!),
        0,
      )
    }, PICKUP_DURATION)
    return
  }

  if (target.hasAttribute("data-loot-puzzle-inventory-piece")) {
    const next = selectedFromElement(target)
    if (next) selectPiece(next)
    return
  }

  const color = target.dataset.lootPuzzleColor as KeyColor | undefined
  const slot = Number(target.dataset.lootPuzzleSlot)
  if (!color || !Number.isInteger(slot)) return
  const occupant = selectedFromElement(target)
  if (!selected && occupant) {
    pendingGateFocus = { color, slot }
    selectPiece(occupant)
    return
  }
  if (
    selected &&
    occupant &&
    selected.color === occupant.color &&
    selected.number === occupant.number
  ) {
    selected = null
    pendingGateFocus = { color, slot }
    announceResource("Puzzleteilauswahl aufgehoben.")
    scheduleSync()
    return
  }
  placeSelected(color, slot)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== "Escape" || !selected) return
  const slotTarget =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>("[data-loot-puzzle-slot]")
      : null
  const color = slotTarget?.dataset.lootPuzzleColor as KeyColor | undefined
  const slot = Number(slotTarget?.dataset.lootPuzzleSlot)
  if (color && Number.isInteger(slot)) {
    pendingGateFocus = { color, slot }
  }
  selected = null
  announceResource("Puzzleteilauswahl aufgehoben.")
  scheduleSync()
}

function handleDragStart(event: DragEvent): void {
  const target =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>(
          "[data-loot-puzzle-inventory-piece], [data-loot-puzzle-slot][data-loot-puzzle-number]",
        )
      : null
  const next = target ? selectedFromElement(target) : null
  if (!next || !event.dataTransfer) return
  draggedSelection = next
  event.dataTransfer.effectAllowed = "move"
  event.dataTransfer.setData(
    "text/x-lia-loot-puzzle",
    next.color + ":" + next.number,
  )
}

function handleDragEnd(): void {
  const dragged = draggedSelection
  draggedSelection = null
  if (
    !dragged ||
    selected?.color !== dragged.color ||
    selected.number !== dragged.number
  ) {
    return
  }
  selected = null
  scheduleSync()
}

function handleDragOver(event: DragEvent): void {
  const slot =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>("[data-loot-puzzle-slot]")
      : null
  const activeSelection = draggedSelection ?? selected
  if (
    !slot ||
    !activeSelection ||
    slot.dataset.lootPuzzleColor !== activeSelection.color
  ) {
    return
  }
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
}

function handleDrop(event: DragEvent): void {
  const slot =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>("[data-loot-puzzle-slot]")
      : null
  if (
    !slot ||
    !Array.from(event.dataTransfer?.types ?? []).includes(
      "text/x-lia-loot-puzzle",
    )
  ) {
    return
  }
  const color = slot.dataset.lootPuzzleColor as KeyColor | undefined
  const index = Number(slot.dataset.lootPuzzleSlot)
  if (!color || !Number.isInteger(index)) return
  event.preventDefault()
  if (draggedSelection) selected = draggedSelection
  placeSelected(color, index)
}

function completeDiscovery(nextCatalog: PuzzleCatalog): void {
  catalog = nextCatalog
  discoveryState = "complete"
  if (!store) return
  store.configure(
    nextCatalog.signature,
    validPuzzleGateConfigurations(nextCatalog),
  )
  for (const error of nextCatalog.errors) {
    warnOnce("catalog:" + error, error)
  }
  const validGates = nextCatalog.gates.filter((gate) => gate.valid)
  controller?.catalogReady(
    validGates.length,
    validGates.filter(
      (gate) => gate.color && store?.isGateSolved(gate.color),
    ).length,
  )
  syncNavigationGuard()
  syncAll()
}

function failDiscovery(error: unknown): void {
  catalog = null
  selected = null
  discoveryState = "failed"
  syncNavigationGuard()
  scheduleSync()
  console.error("Loot: Puzzle-Kurskatalog konnte nicht geladen werden.", error)
}

class LootPuzzlePieceElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-options", "data-piece-id"]
  }

  connectedCallback(): void {
    scheduleSync()
  }

  attributeChangedCallback(): void {
    if (this.isConnected) scheduleSync()
  }
}

class LootPuzzleGateElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-options", "data-gate-id"]
  }

  connectedCallback(): void {
    scheduleSync()
  }

  attributeChangedCallback(): void {
    if (this.isConnected) scheduleSync()
  }
}

export function installPuzzles(
  nextStore: PuzzleStore,
  nextController: PuzzleRuntimeController,
): void {
  store = nextStore
  controller = nextController
  if (installed) return
  installed = true

  if (!customElements.get(PIECE_TAG)) {
    customElements.define(PIECE_TAG, LootPuzzlePieceElement)
  }
  if (!customElements.get(GATE_TAG)) {
    customElements.define(GATE_TAG, LootPuzzleGateElement)
  }
  document.addEventListener("click", handleClick, true)
  document.addEventListener("keydown", handleKeydown, true)
  document.addEventListener("dragstart", handleDragStart, true)
  document.addEventListener("dragend", handleDragEnd, true)
  document.addEventListener("dragover", handleDragOver, true)
  document.addEventListener("drop", handleDrop, true)

  if (!slideObserverInstalled) {
    slideObserverInstalled = true
    observeLiaSlideActivity(scheduleSync)
  }
  if (!revealListenerInstalled) {
    revealListenerInstalled = true
    document.addEventListener(REVEAL_CHANGED_EVENT, scheduleSync)
  }
  observer = new MutationObserver(scheduleSync)
  observer.observe(document.documentElement, {
    attributeFilter: ["class", "data-options", "hidden", "inert"],
    attributes: true,
    childList: true,
    subtree: true,
  })

  void requireCoursePuzzleDeclarations()
    .then((discovery) => completeDiscovery(buildPuzzleCatalog(discovery)))
    .catch(failDiscovery)
  scheduleSync()
}
