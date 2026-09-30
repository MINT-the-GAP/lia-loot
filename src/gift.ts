import {
  discoverCourseGiftDeclarations,
  onCourseMarkdownChange,
  parseCourseGiftDeclarations,
  type CourseGiftDeclaration,
} from "./course-chests.ts"
import { scopeContainerContent } from "./container-content.ts"
import { createGiftGraphic } from "./gift-visual.ts"
import { announceResource } from "./resource-bar.ts"
import { sectionFromLootId } from "./slide-activity.ts"

const GIFT_TAG = "lia-loot-gift"
const GIFT_RENDERER_ATTRIBUTE = "data-loot-gift-renderer"
const OPEN_DURATION = 720

export interface LiaScriptGiftSend {
  lia(message: string): void
  liascript(markdown: string): void
}

export interface GiftRenderingApi {
  render(giftId: string, send: LiaScriptGiftSend): void
}

export interface GiftController {
  isOpened(giftId: string): boolean
  open(giftId: string): boolean
}

interface RenderRequest {
  rendered: boolean
  send: LiaScriptGiftSend
}

let controller: GiftController | null = null
let runtimeId = 0
let declarations: CourseGiftDeclaration[] | null = null
let declarationsPromise: Promise<CourseGiftDeclaration[]> | null = null
let sourceListenerInstalled = false
const boundButtons = new WeakSet<HTMLButtonElement>()
const openingIds = new Set<string>()
const declarationBindings = new Map<string, CourseGiftDeclaration>()
const renderRequests = new Map<string, RenderRequest>()

function authoredGiftId(host: HTMLElement): string {
  const authored = host.getAttribute("data-gift-id")?.trim()
  if (authored && !authored.startsWith("@")) return authored
  const existing = host.dataset.lootGiftRuntimeId
  if (existing) return existing
  runtimeId += 1
  const generated = `runtime-${runtimeId}`
  host.dataset.lootGiftRuntimeId = generated
  return generated
}

function storageGiftId(authoredId: string): string {
  return `gift:${authoredId}`
}

function giftHost(authoredId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `${GIFT_TAG}[data-gift-id="${CSS.escape(authoredId)}"]`,
  )
}

function giftRenderer(authoredId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[${GIFT_RENDERER_ATTRIBUTE}="${CSS.escape(authoredId)}"]`,
  )
}

function giftButton(host: HTMLElement): HTMLButtonElement | null {
  return host.querySelector<HTMLButtonElement>(
    ":scope > [data-loot-gift-open]",
  )
}

function createGiftButton(authoredId: string): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-gift-button"
  button.dataset.lootGiftOpen = authoredId
  button.setAttribute("aria-label", "Geschenk öffnen")
  button.title = "Geschenk öffnen"
  button.append(createGiftGraphic())
  bindGiftButton(button)
  return button
}

async function giftDeclarations(): Promise<CourseGiftDeclaration[]> {
  if (declarations) return declarations
  declarationsPromise ??= discoverCourseGiftDeclarations()
  declarations = await declarationsPromise
  declarationsPromise = null
  return declarations
}

function declarationForGift(
  authoredId: string,
  source: readonly CourseGiftDeclaration[],
): CourseGiftDeclaration | null {
  const bound = declarationBindings.get(authoredId)
  if (bound) return bound
  const host = giftHost(authoredId)
  if (!host) return null
  const section = sectionFromLootId(authoredId)
  const candidates = section === null
    ? [...source]
    : source.filter((entry) => entry.section === section)
  const hosts = [...document.querySelectorAll<HTMLElement>(GIFT_TAG)].filter(
    (candidate) =>
      section === null ||
      sectionFromLootId(authoredGiftId(candidate)) === section,
  )
  const hostIndex = hosts.indexOf(host)
  const declaration = candidates[hostIndex] ?? null
  if (declaration) declarationBindings.set(authoredId, declaration)
  return declaration
}

async function renderGiftContent(authoredId: string): Promise<void> {
  const request = renderRequests.get(authoredId)
  if (
    !request ||
    request.rendered ||
    !controller?.isOpened(storageGiftId(authoredId))
  ) {
    return
  }
  const source = await giftDeclarations()
  if (renderRequests.get(authoredId) !== request || request.rendered) return
  const declaration = declarationForGift(authoredId, source)
  if (!declaration) {
    console.warn(`Loot: Inhalt für Geschenk ${authoredId} nicht gefunden.`)
    request.send.lia("LIA: stop")
    return
  }
  const renderer = giftRenderer(authoredId)
  if (renderer) renderer.hidden = false
  request.rendered = true
  request.send.liascript(scopeContainerContent(declaration.content, authoredId))
}

function syncGift(host: HTMLElement): void {
  if (!controller) return
  const authoredId = authoredGiftId(host)
  const storedId = storageGiftId(authoredId)
  host.hidden = false

  if (controller.isOpened(storedId)) {
    openingIds.delete(storedId)
    host.dataset.lootGiftState = "opened"
    giftButton(host)?.remove()
    void renderGiftContent(authoredId)
    return
  }

  if (openingIds.has(storedId)) return
  host.dataset.lootGiftState = "closed"
  let button = giftButton(host)
  if (!button) {
    button = createGiftButton(authoredId)
    host.appendChild(button)
  } else {
    bindGiftButton(button)
  }
}

function giftHostFromEvent(event: MouseEvent): HTMLElement | null {
  const target = event.currentTarget
  if (!(target instanceof HTMLButtonElement)) return null
  return target.closest<HTMLElement>(GIFT_TAG)
}

function openGift(event: MouseEvent): void {
  const button = event.currentTarget
  if (!(button instanceof HTMLButtonElement)) return
  const host = giftHostFromEvent(event)
  const authoredId = button.dataset.lootGiftOpen
  if (!host || !authoredId || !controller) return
  const storedId = storageGiftId(authoredId)
  if (openingIds.has(storedId)) return

  controller.open(storedId)
  openingIds.add(storedId)
  host.dataset.lootGiftState = "opening"
  button.disabled = true
  button.setAttribute("aria-label", "Geschenk wird geöffnet")
  button.title = "Geschenk wird geöffnet"
  announceResource("Geschenk geöffnet. Der Inhalt ist jetzt verfügbar.")

  window.setTimeout(() => {
    openingIds.delete(storedId)
    if (host.isConnected) syncGift(host)
  }, OPEN_DURATION)
}

function bindGiftButton(button: HTMLButtonElement): void {
  if (boundButtons.has(button)) return
  boundButtons.add(button)
  button.addEventListener("click", openGift)
}

function installGiftSourceListener(): void {
  if (sourceListenerInstalled) return
  sourceListenerInstalled = true
  onCourseMarkdownChange((markdown) => {
    declarations = parseCourseGiftDeclarations(markdown)
    declarationsPromise = null
    declarationBindings.clear()
  })
}

class LootGiftElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-gift-id"]
  }

  connectedCallback(): void {
    syncGift(this)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncGift(this)
  }
}

export function installGifts(nextController: GiftController): void {
  controller = nextController
  installGiftSourceListener()
  window.__LIA_LOOT_GIFTS__ = {
    render(authoredId, send) {
      renderRequests.set(authoredId, { rendered: false, send })
      const host = giftHost(authoredId)
      if (host) syncGift(host)
    },
  }
  if (!customElements.get(GIFT_TAG)) {
    customElements.define(GIFT_TAG, LootGiftElement)
  }
  document.querySelectorAll<HTMLElement>(GIFT_TAG).forEach(syncGift)
}
