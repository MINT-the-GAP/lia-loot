import {
  AXE_TIER_DETAILS,
  type AxeTier,
} from "./axe.ts"
import {
  discoverCourseWoodCrateDeclarations,
  onCourseMarkdownChange,
  parseCourseWoodCrateDeclarations,
  type CourseWoodCrateDeclaration,
} from "./course-chests.ts"
import { scopeContainerContent } from "./container-content.ts"
import { createExplorationToolGraphic } from "./exploration-visual.ts"
import type { ToolKind } from "./exploration-options.ts"
import { announceResource } from "./resource-bar.ts"
import { sectionFromLootId } from "./slide-activity.ts"
import { createWoodCrateGraphic } from "./wood-crate-visual.ts"

const WOOD_CRATE_TAG = "lia-loot-wood-crate"
const WOOD_CRATE_RENDERER_ATTRIBUTE = "data-loot-wood-crate-renderer"
const STRIKE_DURATION = 440
const BREAK_DURATION = 920
const DURABILITY = 8

export interface LiaScriptWoodCrateSend {
  lia(message: string): void
  liascript(markdown: string): void
}

export interface WoodCrateRenderingApi {
  render(crateId: string, send: LiaScriptWoodCrateSend): void
}

export interface WoodCrateController {
  activeTool(): ToolKind | null
  axeTier(): AxeTier
  damage(crateId: string): number
  isAxeCollected(): boolean
  isBroken(crateId: string): boolean
  strike(crateId: string): {
    accepted: boolean
    broken: boolean
    damage: number
  }
}

interface RenderRequest {
  rendered: boolean
  send: LiaScriptWoodCrateSend
}

let controller: WoodCrateController | null = null
let runtimeId = 0
let declarations: CourseWoodCrateDeclaration[] | null = null
let declarationsPromise: Promise<CourseWoodCrateDeclaration[]> | null = null
let sourceListenerInstalled = false
const boundButtons = new WeakSet<HTMLButtonElement>()
const strikingIds = new Set<string>()
const declarationBindings = new Map<string, CourseWoodCrateDeclaration>()
const renderRequests = new Map<string, RenderRequest>()

function authoredCrateId(host: HTMLElement): string {
  const authored = host.getAttribute("data-crate-id")?.trim()
  if (authored && !authored.startsWith("@")) return authored
  const existing = host.dataset.lootWoodCrateRuntimeId
  if (existing) return existing
  runtimeId += 1
  const generated = `runtime-${runtimeId}`
  host.dataset.lootWoodCrateRuntimeId = generated
  return generated
}

function storageCrateId(authoredId: string): string {
  return `wood-crate:${authoredId}`
}

function crateHost(authoredId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `${WOOD_CRATE_TAG}[data-crate-id="${CSS.escape(authoredId)}"]`,
  )
}

function crateRenderer(authoredId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[${WOOD_CRATE_RENDERER_ATTRIBUTE}="${CSS.escape(authoredId)}"]`,
  )
}

function crateButton(host: HTMLElement): HTMLButtonElement | null {
  return host.querySelector<HTMLButtonElement>(
    ":scope > [data-loot-wood-crate-break]",
  )
}

function createCrateButton(authoredId: string): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-wood-crate-button"
  button.dataset.lootWoodCrateBreak = authoredId
  button.setAttribute("aria-label", "Holzkiste aufbrechen")
  const strikeTool = createExplorationToolGraphic(
    "axe",
    document,
    controller?.axeTier() ?? "stone",
  )
  strikeTool.classList.add("loot-wood-crate-strike-tool")
  button.append(createWoodCrateGraphic(), strikeTool)
  bindCrateButton(button)
  return button
}

function syncStrikeTool(button: HTMLButtonElement): void {
  if (!controller) return
  const tier = controller.axeTier()
  const current = button.querySelector<SVGSVGElement>(".loot-axe-graphic")
  if (current?.dataset.lootAxeTier === tier) return
  const next = createExplorationToolGraphic("axe", button.ownerDocument, tier)
  next.classList.add("loot-wood-crate-strike-tool")
  current?.replaceWith(next)
}

function syncDamage(host: HTMLElement, storedId: string): void {
  const damage = Math.max(
    0,
    Math.min(DURABILITY - 1, controller?.damage(storedId) ?? 0),
  )
  host.dataset.lootWoodCrateDamage = String(damage)
}

async function crateDeclarations(): Promise<CourseWoodCrateDeclaration[]> {
  if (declarations) return declarations
  declarationsPromise ??= discoverCourseWoodCrateDeclarations()
  declarations = await declarationsPromise
  declarationsPromise = null
  return declarations
}

function declarationForCrate(
  authoredId: string,
  source: readonly CourseWoodCrateDeclaration[],
): CourseWoodCrateDeclaration | null {
  const bound = declarationBindings.get(authoredId)
  if (bound) return bound
  const host = crateHost(authoredId)
  if (!host) return null
  const section = sectionFromLootId(authoredId)
  const candidates = section === null
    ? [...source]
    : source.filter((entry) => entry.section === section)
  const hosts = [...document.querySelectorAll<HTMLElement>(WOOD_CRATE_TAG)].filter(
    (candidate) =>
      section === null ||
      sectionFromLootId(authoredCrateId(candidate)) === section,
  )
  const hostIndex = hosts.indexOf(host)
  const declaration = candidates[hostIndex] ?? null
  if (declaration) declarationBindings.set(authoredId, declaration)
  return declaration
}

async function renderCrateContent(authoredId: string): Promise<void> {
  const request = renderRequests.get(authoredId)
  if (
    !request ||
    request.rendered ||
    !controller?.isBroken(storageCrateId(authoredId))
  ) {
    return
  }
  const source = await crateDeclarations()
  if (renderRequests.get(authoredId) !== request || request.rendered) return
  const declaration = declarationForCrate(authoredId, source)
  if (!declaration) {
    console.warn(`Loot: Inhalt für Holzkiste ${authoredId} nicht gefunden.`)
    request.send.lia("LIA: stop")
    return
  }
  const renderer = crateRenderer(authoredId)
  if (renderer) renderer.hidden = false
  request.rendered = true
  request.send.liascript(scopeContainerContent(declaration.content, authoredId))
}

function syncCrate(host: HTMLElement): void {
  if (!controller) return
  const authoredId = authoredCrateId(host)
  const storedId = storageCrateId(authoredId)
  host.hidden = false

  if (controller.isBroken(storedId)) {
    strikingIds.delete(storedId)
    host.dataset.lootWoodCrateState = "broken"
    delete host.dataset.lootWoodCrateDamage
    crateButton(host)?.remove()
    void renderCrateContent(authoredId)
    return
  }

  if (strikingIds.has(storedId)) return
  host.dataset.lootWoodCrateState = "closed"
  syncDamage(host, storedId)
  let button = crateButton(host)
  if (!button) {
    button = createCrateButton(authoredId)
    host.appendChild(button)
  } else {
    bindCrateButton(button)
  }
  syncStrikeTool(button)
  button.disabled = false
  button.setAttribute("aria-label", "Holzkiste aufbrechen")
  button.title =
    `Holzkiste mit der ${AXE_TIER_DETAILS[controller.axeTier()].label} aufbrechen · ` +
    `${DURABILITY - controller.damage(storedId)} Haltbarkeit`
}

function strikeCrate(event: MouseEvent): void {
  const button = event.currentTarget
  if (!(button instanceof HTMLButtonElement) || !controller) return
  const host = button.closest<HTMLElement>(WOOD_CRATE_TAG)
  const authoredId = button.dataset.lootWoodCrateBreak
  if (!host || !authoredId) return
  const storedId = storageCrateId(authoredId)
  if (strikingIds.has(storedId)) return

  if (!controller.isAxeCollected()) {
    announceResource("Du brauchst zuerst eine Axt, um die Holzkiste aufzubrechen.")
    return
  }
  if (controller.activeTool() !== "axe") {
    announceResource("Aktiviere zuerst die Axt in der Ressourcenleiste.")
    return
  }

  syncStrikeTool(button)
  const result = controller.strike(storedId)
  if (!result.accepted) {
    syncCrate(host)
    return
  }

  strikingIds.add(storedId)
  host.dataset.lootWoodCrateDamage = String(
    Math.min(DURABILITY - 1, result.damage),
  )
  host.dataset.lootWoodCrateState = result.broken ? "breaking" : "striking"
  button.disabled = true
  const details = AXE_TIER_DETAILS[controller.axeTier()]
  if (result.broken) {
    button.setAttribute("aria-label", "Holzkiste wird aufgebrochen")
    button.title = "Holzkiste wird aufgebrochen"
    announceResource(`${details.label}: Die Frachtkiste zerbricht.`)
  } else {
    const remaining = DURABILITY - result.damage
    button.setAttribute("aria-label", "Holzkiste wird beschädigt")
    button.title = `${remaining} Haltbarkeit verbleibt`
    announceResource(
      `${details.label}: Axthieb trifft. Noch ${remaining} Haltbarkeit.`,
    )
  }

  window.setTimeout(() => {
    strikingIds.delete(storedId)
    if (host.isConnected) syncCrate(host)
  }, result.broken ? BREAK_DURATION : STRIKE_DURATION)
}

function bindCrateButton(button: HTMLButtonElement): void {
  if (boundButtons.has(button)) return
  boundButtons.add(button)
  button.addEventListener("click", strikeCrate)
}

function installCrateSourceListener(): void {
  if (sourceListenerInstalled) return
  sourceListenerInstalled = true
  onCourseMarkdownChange((markdown) => {
    declarations = parseCourseWoodCrateDeclarations(markdown)
    declarationsPromise = null
    declarationBindings.clear()
  })
}

class LootWoodCrateElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-crate-id"]
  }

  connectedCallback(): void {
    syncCrate(this)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncCrate(this)
  }
}

export function installWoodCrates(nextController: WoodCrateController): void {
  controller = nextController
  installCrateSourceListener()
  window.__LIA_LOOT_WOOD_CRATES__ = {
    render(authoredId, send) {
      renderRequests.set(authoredId, { rendered: false, send })
      const host = crateHost(authoredId)
      if (host) syncCrate(host)
    },
  }
  if (!customElements.get(WOOD_CRATE_TAG)) {
    customElements.define(WOOD_CRATE_TAG, LootWoodCrateElement)
  }
  document.querySelectorAll<HTMLElement>(WOOD_CRATE_TAG).forEach(syncCrate)
}

export function refreshWoodCrates(): void {
  document.querySelectorAll<HTMLElement>(WOOD_CRATE_TAG).forEach(syncCrate)
}
