import {
  discoverCourseCatFoodDeclarations,
  onCourseMarkdownChange,
  parseCourseCatFoodDeclarations,
  type CourseCatFoodDeclaration,
} from "./course-chests.ts"
import {
  CAT_FEED_DURATION,
  notifyCatFed,
  notifyCatItemFound,
  notifyCatReward,
  setCatFeedingHandler,
} from "./cat.ts"
import { createCatFoodGraphic } from "./cat-food-visual.ts"
import { KEY_COLOR_DETAILS } from "./key-colors.ts"
import {
  scopeContainerContent,
  scopedContainerContentId,
} from "./container-content.ts"
import {
  announceResource,
  installResourceBar,
  refreshResourceBarVisibility,
} from "./resource-bar.ts"
import type { ResourceVisualKind } from "./resource-visual.ts"
import { sectionFromLootId } from "./slide-activity.ts"

const CAT_FOOD_TAG = "lia-loot-cat-food"
const INVENTORY_ID = "lia-loot-cat-food-inventory"
const CONTROL_ID = "lia-loot-cat-food-control"
const SUBBAR_ID = "lia-loot-cat-food-subbar"
const CURSOR_ID = "lia-loot-cat-food-cursor"
const COLLECT_DURATION = 620
const STORAGE_PREFIX = "cat-food:"
const AUTO_COLLECT_ATTEMPTS = 80
const AUTO_COLLECT_INTERVAL = 50
const ROOT_ITEM = /^@([\p{L}\p{N}_.-]+)(?:\([\s\S]*\))?$/u

export interface LiaScriptCatFoodSend {
  lia(message: string): void
  liascript(markdown: string): void
}

export interface CatFoodRenderingApi {
  render(foodId: string, send: LiaScriptCatFoodSend): void
}

export interface CatFoodController {
  availableIds(): string[]
  collect(foodId: string): boolean
  feed(foodId: string): boolean
  isCatCollected(): boolean
  isCollected(foodId: string): boolean
  isFed(foodId: string): boolean
}

interface RenderRequest {
  rendered: boolean
  send: LiaScriptCatFoodSend
}

let controller: CatFoodController | null = null
let runtimeId = 0
let activeFoodId: string | null = null
let declarations: CourseCatFoodDeclaration[] | null = null
let declarationsPromise: Promise<CourseCatFoodDeclaration[]> | null = null
let sourceListenerInstalled = false
let keyboardListenerInstalled = false
let selectorRuntimeInstalled = false
let foodCursorTracking = false
let foodCursorFrame: number | null = null
let foodCursorX = -100
let foodCursorY = -100
const boundPickupButtons = new WeakSet<HTMLButtonElement>()
const collectingIds = new Set<string>()
const feedingIds = new Set<string>()
const declarationBindings = new Map<string, CourseCatFoodDeclaration>()
const renderRequests = new Map<string, RenderRequest>()

interface AutoRewardDescriptor {
  buttonSelector: string
  fallbackLabel: string
  hostSelector: string
}

interface RewardNotice {
  announcement: string
  resourceKind?: ResourceVisualKind
  visualText: string
}

function authoredFoodId(host: HTMLElement): string {
  const authored = host.getAttribute("data-food-id")?.trim()
  if (authored && !authored.startsWith("@")) return authored
  const existing = host.dataset.lootCatFoodRuntimeId
  if (existing) return existing
  runtimeId += 1
  const generated = `runtime-${runtimeId}`
  host.dataset.lootCatFoodRuntimeId = generated
  return generated
}

function storageFoodId(authoredId: string): string {
  return STORAGE_PREFIX + authoredId
}

function authoredIdFromStorage(foodId: string): string {
  return foodId.startsWith(STORAGE_PREFIX)
    ? foodId.slice(STORAGE_PREFIX.length)
    : foodId
}

function foodHost(authoredId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `${CAT_FOOD_TAG}[data-food-id="${CSS.escape(authoredId)}"]`,
  )
}

function autoRewardDescriptor(
  content: string,
  authoredId: string,
): AutoRewardDescriptor | null {
  const match = ROOT_ITEM.exec(content.trim())
  if (!match) return null
  const name = match[1].toLocaleLowerCase("de-DE")
  const scopedId = CSS.escape(scopedContainerContentId(authoredId))

  if (
    name === "schatztruhe" ||
    name === "diamanttruhe" ||
    name === "diamantentruhe" ||
    name === "energiekiste" ||
    name === "energietruhe"
  ) {
    return {
      buttonSelector: "[data-loot-chest-button]",
      fallbackLabel: "Belohnung",
      hostSelector: `lia-loot-chest[data-chest-id="${scopedId}"]`,
    }
  }
  if (name === "schluessel") {
    return {
      buttonSelector: "[data-loot-key-button]",
      fallbackLabel: "Schlüssel",
      hostSelector: `lia-loot-key[data-key-id="${scopedId}"]`,
    }
  }
  if (name === "puzzleteil") {
    return {
      buttonSelector: "[data-loot-puzzle-pickup]",
      fallbackLabel: "Puzzleteil",
      hostSelector: `lia-loot-puzzle-piece[data-piece-id="${scopedId}"]`,
    }
  }
  if (name === "lupe") {
    return {
      buttonSelector: "[data-loot-magnifier-button]",
      fallbackLabel: "Lupe",
      hostSelector: `lia-loot-magnifier[data-magnifier-id="${scopedId}"]`,
    }
  }
  if (name === "taschenlampe") {
    return {
      buttonSelector: "[data-loot-flashlight-button]",
      fallbackLabel: "Taschenlampe",
      hostSelector: `lia-loot-flashlight[data-flashlight-id="${scopedId}"]`,
    }
  }
  if (name === "schaufel" || name === "giesskanne" || name === "axt") {
    return {
      buttonSelector: "[data-loot-tool-pickup]",
      fallbackLabel:
        name === "schaufel"
          ? "Schaufel"
          : name === "giesskanne"
            ? "Gießkanne"
            : "Axt",
      hostSelector: `lia-loot-tool[data-tool-id="${scopedId}"]`,
    }
  }
  if (name === "atlaskarte" || name === "perk") {
    return {
      buttonSelector: "[data-loot-bonus-pickup]",
      fallbackLabel: name === "atlaskarte" ? "Atlaskarte" : "Verbesserung",
      hostSelector: `lia-loot-bonus[data-bonus-id="${scopedId}"]`,
    }
  }
  if (name === "katze") {
    return {
      buttonSelector: "[data-loot-cat-pickup]",
      fallbackLabel: "Pixelkatze",
      hostSelector: `lia-loot-cat[data-cat-id="${scopedId}"]`,
    }
  }
  if (name === "futter") {
    return {
      buttonSelector: "[data-loot-cat-food-pickup]",
      fallbackLabel: "Katzenfutter",
      hostSelector: `lia-loot-cat-food[data-food-id="${scopedId}"]`,
    }
  }
  return null
}

function pickupRewardNotice(
  button: HTMLButtonElement,
  fallbackLabel: string,
): RewardNotice {
  const amount = Number(button.dataset.lootChestAmount)
  const reward = button.dataset.lootChestReward
  if (Number.isSafeInteger(amount) && amount > 0) {
    if (reward === "energy") {
      return {
        announcement: `+${amount} Energie`,
        resourceKind: "energy",
        visualText: `+${amount}`,
      }
    }
    if (reward === "diamonds") {
      return {
        announcement: `+${amount} ${amount === 1 ? "Diamant" : "Diamanten"}`,
        resourceKind: "gems",
        visualText: `+${amount}`,
      }
    }
    if (reward === "gold") {
      return {
        announcement: `+${amount} ${amount === 1 ? "Goldmünze" : "Goldmünzen"}`,
        resourceKind: "coins",
        visualText: `+${amount}`,
      }
    }
  }

  const keyColor = button.dataset.lootKeyColor
  if (keyColor && keyColor in KEY_COLOR_DETAILS) {
    const detail = KEY_COLOR_DETAILS[keyColor as keyof typeof KEY_COLOR_DETAILS]
    const message = `+1 ${detail.foundMessage.replace(/\s+gefunden\.$/u, "")}`
    return { announcement: message, visualText: message }
  }

  const authoredLabel = button.getAttribute("aria-label")
    ?.replace(/,?\s+einsammeln$/iu, "")
    .trim()
  const message = `+1 ${authoredLabel || fallbackLabel}`
  return { announcement: message, visualText: message }
}

function rewardWasCollected(button: HTMLButtonElement): boolean {
  return (
    !button.isConnected ||
    button.disabled ||
    button.classList.contains("loot-puzzle-pickup--collected") ||
    button.classList.contains("loot-bonus-pickup--collected") ||
    button.classList.contains("loot-cat-food-pickup--collected")
  )
}

function dispatchAutomaticClick(button: HTMLButtonElement): void {
  button.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: 1,
      view: window,
    }),
  )
}

function collectRenderedReward(
  authoredId: string,
  content: string,
  remaining = AUTO_COLLECT_ATTEMPTS,
): void {
  const descriptor = autoRewardDescriptor(content, authoredId)
  if (!descriptor) {
    console.warn(
      `Loot: Der Futterinhalt ${content} ist kein automatisch sammelbares Item.`,
    )
    return
  }
  const host = document.querySelector<HTMLElement>(descriptor.hostSelector)
  const button = host?.querySelector<HTMLButtonElement>(
    descriptor.buttonSelector,
  )
  if (!button) {
    if (remaining > 0) {
      window.setTimeout(
        () => collectRenderedReward(authoredId, content, remaining - 1),
        AUTO_COLLECT_INTERVAL,
      )
    }
    return
  }

  const notice = pickupRewardNotice(button, descriptor.fallbackLabel)
  dispatchAutomaticClick(button)
  window.setTimeout(() => {
    if (rewardWasCollected(button)) {
      notifyCatReward(
        notice.visualText,
        notice.resourceKind,
        notice.announcement,
      )
      announceResource(notice.announcement)
      return
    }
    if (remaining > 0) {
      window.setTimeout(
        () => collectRenderedReward(authoredId, content, remaining - 1),
        AUTO_COLLECT_INTERVAL,
      )
    }
  }, 0)
}

function foodPickupButton(host: HTMLElement): HTMLButtonElement | null {
  return host.querySelector<HTMLButtonElement>(
    ":scope > [data-loot-cat-food-pickup]",
  )
}

function rewardBadge(): HTMLSpanElement {
  const reward = document.createElement("span")
  reward.className = "loot-cat-food-pickup__reward"
  reward.setAttribute("aria-hidden", "true")
  reward.textContent = "GEFUNDEN"
  return reward
}

function createFoodPickupButton(authoredId: string): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-cat-food-pickup"
  button.dataset.lootCatFoodPickup = authoredId
  button.setAttribute("aria-label", "Katzenfutter einsammeln")
  button.title = "Katzenfutter einsammeln"
  button.append(createCatFoodGraphic(), rewardBadge())
  bindFoodPickupButton(button)
  return button
}

async function catFoodDeclarations(): Promise<CourseCatFoodDeclaration[]> {
  if (declarations) return declarations
  declarationsPromise ??= discoverCourseCatFoodDeclarations()
  declarations = await declarationsPromise
  declarationsPromise = null
  return declarations
}

function declarationForFood(
  authoredId: string,
  source: readonly CourseCatFoodDeclaration[],
): CourseCatFoodDeclaration | null {
  const bound = declarationBindings.get(authoredId)
  if (bound) return bound
  const host = foodHost(authoredId)
  if (!host) return null
  const section = sectionFromLootId(authoredId)
  const candidates = section === null
    ? [...source]
    : source.filter((entry) => entry.section === section)
  const hosts = [...document.querySelectorAll<HTMLElement>(CAT_FOOD_TAG)].filter(
    (candidate) =>
      section === null ||
      sectionFromLootId(authoredFoodId(candidate)) === section,
  )
  const hostIndex = hosts.indexOf(host)
  const declaration = candidates[hostIndex] ?? null
  if (declaration) declarationBindings.set(authoredId, declaration)
  return declaration
}

async function renderFoodContent(authoredId: string): Promise<void> {
  const request = renderRequests.get(authoredId)
  if (
    !request ||
    request.rendered ||
    !controller?.isFed(storageFoodId(authoredId))
  ) {
    return
  }
  const source = await catFoodDeclarations()
  if (renderRequests.get(authoredId) !== request || request.rendered) return
  const declaration = declarationForFood(authoredId, source)
  if (!declaration) {
    console.warn(`Loot: Inhalt für Katzenfutter ${authoredId} nicht gefunden.`)
    request.send.lia("LIA: stop")
    return
  }
  request.rendered = true
  request.send.liascript(scopeContainerContent(declaration.content, authoredId))
  collectRenderedReward(authoredId, declaration.content)
}

function syncFood(host: HTMLElement): void {
  if (!controller) return
  const authoredId = authoredFoodId(host)
  const storedId = storageFoodId(authoredId)

  if (feedingIds.has(storedId)) {
    host.hidden = true
    host.dataset.lootCatFoodState = "feeding"
    return
  }
  if (collectingIds.has(storedId)) return

  if (controller.isFed(storedId)) {
    host.hidden = true
    host.dataset.lootCatFoodState = "fed"
    foodPickupButton(host)?.remove()
    void renderFoodContent(authoredId)
    return
  }

  if (controller.isCollected(storedId)) {
    host.hidden = true
    host.dataset.lootCatFoodState = "collected"
    foodPickupButton(host)?.remove()
    return
  }

  host.hidden = false
  host.dataset.lootCatFoodState = "available"
  let button = foodPickupButton(host)
  if (!button) {
    button = createFoodPickupButton(authoredId)
    host.appendChild(button)
  } else {
    bindFoodPickupButton(button)
  }
}

function syncAllFood(): void {
  document.querySelectorAll<HTMLElement>(CAT_FOOD_TAG).forEach(syncFood)
  renderFoodInventory()
}

function collectFood(event: MouseEvent): void {
  const button = event.currentTarget
  if (!(button instanceof HTMLButtonElement) || !controller) return
  const host = button.closest<HTMLElement>(CAT_FOOD_TAG)
  const authoredId = button.dataset.lootCatFoodPickup
  if (!host || !authoredId) return
  const storedId = storageFoodId(authoredId)
  if (collectingIds.has(storedId) || !controller.collect(storedId)) return

  collectingIds.add(storedId)
  host.dataset.lootCatFoodState = "collecting"
  button.disabled = true
  button.classList.add("loot-cat-food-pickup--collected")
  button.setAttribute("aria-label", "Katzenfutter gefunden")
  button.title = "Katzenfutter gefunden"
  notifyCatItemFound()
  announceResource("Katzenfutter gefunden. Aktiviere es in der Ressourcenleiste.")
  renderFoodInventory()

  window.setTimeout(() => {
    collectingIds.delete(storedId)
    if (host.isConnected) syncFood(host)
  }, COLLECT_DURATION)
}

function bindFoodPickupButton(button: HTMLButtonElement): void {
  if (boundPickupButtons.has(button)) return
  boundPickupButtons.add(button)
  button.addEventListener("click", collectFood)
}

function foodInventory(): HTMLElement | null {
  return document.getElementById(INVENTORY_ID)
}

function foodControlButton(): HTMLButtonElement | null {
  const existing = document.getElementById(CONTROL_ID)
  return existing instanceof HTMLButtonElement ? existing : null
}

function foodSubbar(): HTMLElement | null {
  return document.getElementById(SUBBAR_ID)
}

function foodCursor(): HTMLElement | null {
  return document.getElementById(CURSOR_ID)
}

function createFoodCursor(): HTMLElement {
  const cursor = document.createElement("div")
  cursor.id = CURSOR_ID
  cursor.className = "loot-cat-food-cursor"
  cursor.hidden = true
  cursor.setAttribute("aria-hidden", "true")
  cursor.appendChild(createCatFoodGraphic())
  document.body.appendChild(cursor)
  return cursor
}

function paintFoodCursor(): void {
  foodCursorFrame = null
  const cursor = foodCursor()
  if (!cursor || cursor.hidden) return
  cursor.style.transform = `translate3d(${Math.round(foodCursorX - 18)}px, ${Math.round(foodCursorY - 15)}px, 0)`
}

function scheduleFoodCursorPaint(): void {
  if (foodCursorFrame !== null) return
  foodCursorFrame = window.requestAnimationFrame(paintFoodCursor)
}

function trackFoodCursor(event: PointerEvent): void {
  if (event.pointerType && event.pointerType !== "mouse") return
  foodCursorX = event.clientX
  foodCursorY = event.clientY
  scheduleFoodCursorPaint()
}

function setFoodCursorActive(active: boolean): void {
  const cursor = foodCursor() ?? (active ? createFoodCursor() : null)
  if (cursor) cursor.hidden = !active
  if (active && !foodCursorTracking) {
    foodCursorTracking = true
    document.addEventListener("pointermove", trackFoodCursor, { passive: true })
    scheduleFoodCursorPaint()
    return
  }
  if (!active && foodCursorTracking) {
    foodCursorTracking = false
    document.removeEventListener("pointermove", trackFoodCursor)
    if (foodCursorFrame !== null) {
      window.cancelAnimationFrame(foodCursorFrame)
      foodCursorFrame = null
    }
  }
}

function positionFoodSubbar(): void {
  const subbar = foodSubbar()
  const resourceBar = document.getElementById("lia-loot-resource-bar")
  if (!subbar || subbar.hidden || !resourceBar) return
  const bounds = resourceBar.getBoundingClientRect()
  subbar.style.top = `${Math.round(bounds.bottom + 6)}px`
}

function closeFoodSubbar(): void {
  foodControlButton()?.setAttribute("aria-expanded", "false")
  const subbar = foodSubbar()
  if (subbar) subbar.hidden = true
}

function toggleFoodSubbar(event: MouseEvent): void {
  event.stopPropagation()
  const control = foodControlButton()
  const subbar = foodSubbar()
  if (!control || !subbar) return
  const willOpen = subbar.hidden
  subbar.hidden = !willOpen
  control.setAttribute("aria-expanded", String(willOpen))
  if (willOpen) positionFoodSubbar()
}

function createFoodInventory(): HTMLElement {
  const inventory = document.createElement("div")
  inventory.id = INVENTORY_ID
  inventory.className = "loot-cat-food-inventory"
  inventory.setAttribute("role", "group")
  inventory.setAttribute("aria-label", "Katzenfutter")
  installResourceBar().appendChild(inventory)
  return inventory
}

function createFoodSubbar(): HTMLElement {
  const subbar = document.createElement("div")
  subbar.id = SUBBAR_ID
  subbar.className = "loot-cat-food-subbar"
  subbar.setAttribute("role", "toolbar")
  subbar.setAttribute("aria-label", "Katzenfutter auswählen")
  subbar.hidden = true
  document.body.appendChild(subbar)
  return subbar
}

function selectFood(event: MouseEvent): void {
  event.stopPropagation()
  const button = event.currentTarget
  if (!(button instanceof HTMLButtonElement) || !controller) return
  const foodId = button.dataset.lootCatFoodControl
  if (!foodId || !controller.availableIds().includes(foodId)) return
  if (!controller.isCatCollected()) {
    announceResource("Finde zuerst eine Katze, bevor du das Futter aktivierst.")
    return
  }
  foodCursorX = event.clientX
  foodCursorY = event.clientY
  activeFoodId = activeFoodId === foodId ? null : foodId
  closeFoodSubbar()
  renderFoodInventory()
  announceResource(
    activeFoodId === foodId
      ? "Katzenfutter aktiviert. Klicke jetzt auf die Katze."
      : "Katzenfutter deaktiviert.",
  )
}

function createFoodControl(available: readonly string[]): HTMLButtonElement {
  const button = document.createElement("button")
  const singleFoodId = available.length === 1 ? available[0] : null
  const active = activeFoodId !== null
  button.id = CONTROL_ID
  button.type = "button"
  button.className = "loot-cat-food-control"
  button.classList.toggle("loot-cat-food-control--active", active)
  button.setAttribute("aria-pressed", String(active))
  button.appendChild(createCatFoodGraphic())

  if (singleFoodId) {
    button.dataset.lootCatFoodControl = singleFoodId
    button.setAttribute(
      "aria-label",
      active ? "Katzenfutter deaktivieren" : "Katzenfutter aktivieren",
    )
    button.title = active
      ? "Katzenfutter deaktivieren"
      : "Katzenfutter aktivieren"
    button.addEventListener("click", selectFood)
    return button
  }

  button.dataset.lootCatFoodMenuControl = "true"
  button.setAttribute("aria-controls", SUBBAR_ID)
  button.setAttribute("aria-expanded", "false")
  button.setAttribute(
    "aria-label",
    `Katzenfutter auswählen. ${available.length} Portionen verfügbar.`,
  )
  button.title = "Katzenfutter auswählen"
  const count = document.createElement("span")
  count.className = "loot-cat-food-control__count"
  count.setAttribute("aria-hidden", "true")
  count.textContent = String(available.length)
  button.appendChild(count)
  button.addEventListener("click", toggleFoodSubbar)
  return button
}

function renderFoodSubbar(available: readonly string[]): void {
  if (available.length <= 1) {
    foodSubbar()?.remove()
    return
  }
  const subbar = foodSubbar() ?? createFoodSubbar()
  const signature = `${available.join(",")}|${activeFoodId ?? "-"}`
  if (subbar.dataset.lootCatFoodSignature === signature) {
    positionFoodSubbar()
    return
  }
  const choices = available.map((foodId, index) => {
    const button = document.createElement("button")
    const active = foodId === activeFoodId
    button.type = "button"
    button.className = "loot-cat-food-choice"
    button.dataset.lootCatFoodControl = foodId
    button.setAttribute("aria-pressed", String(active))
    button.setAttribute(
      "aria-label",
      `Katzenfutter ${index + 1} ${active ? "deaktivieren" : "aktivieren"}`,
    )
    button.title = active
      ? "Katzenfutter deaktivieren"
      : "Katzenfutter aktivieren"
    button.appendChild(createCatFoodGraphic())
    const label = document.createElement("span")
    label.textContent = `Futter ${index + 1}`
    button.appendChild(label)
    button.addEventListener("click", selectFood)
    return button
  })
  subbar.replaceChildren(...choices)
  subbar.dataset.lootCatFoodSignature = signature
  positionFoodSubbar()
}

function renderFoodInventory(): void {
  if (!controller) return
  const available = controller.availableIds()
  if (activeFoodId && !available.includes(activeFoodId)) activeFoodId = null
  document.documentElement.toggleAttribute(
    "data-loot-active-cat-food",
    activeFoodId !== null,
  )
  setFoodCursorActive(activeFoodId !== null)
  if (available.length === 0) {
    closeFoodSubbar()
    foodSubbar()?.remove()
    foodInventory()?.remove()
    refreshResourceBarVisibility()
    return
  }

  const inventory = foodInventory() ?? createFoodInventory()
  const signature = `${available.join(",")}|${activeFoodId ?? "-"}`
  if (inventory.dataset.lootCatFoodSignature !== signature) {
    inventory.replaceChildren(createFoodControl(available))
    inventory.dataset.lootCatFoodSignature = signature
  }
  renderFoodSubbar(available)
  activateFoodSelectorRuntime()
  refreshResourceBarVisibility()
}

function handleFoodSelectorOutsideClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Node)) return
  if (
    foodControlButton()?.contains(target) ||
    foodSubbar()?.contains(target)
  ) {
    return
  }
  closeFoodSubbar()
}

function activateFoodSelectorRuntime(): void {
  if (selectorRuntimeInstalled) return
  selectorRuntimeInstalled = true
  document.addEventListener("click", handleFoodSelectorOutsideClick)
  window.addEventListener("resize", positionFoodSubbar, { passive: true })
  window.addEventListener("scroll", positionFoodSubbar, { passive: true })
}

function feedActiveFood(): boolean {
  if (!controller || !activeFoodId) return false
  const foodId = activeFoodId
  if (!controller.isCatCollected() || !controller.feed(foodId)) {
    activeFoodId = null
    renderFoodInventory()
    return false
  }

  activeFoodId = null
  closeFoodSubbar()
  feedingIds.add(foodId)
  const authoredId = authoredIdFromStorage(foodId)
  const host = foodHost(authoredId)
  if (host) syncFood(host)
  renderFoodInventory()
  notifyCatFed()
  announceResource("Die Pixelkatze frisst das Futter.")

  window.setTimeout(() => {
    feedingIds.delete(foodId)
    const currentHost = foodHost(authoredId)
    if (currentHost) syncFood(currentHost)
  }, CAT_FEED_DURATION)
  return true
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== "Escape") return
  closeFoodSubbar()
  if (!activeFoodId) return
  activeFoodId = null
  renderFoodInventory()
  announceResource("Katzenfutter deaktiviert.")
}

function installFoodSourceListener(): void {
  if (sourceListenerInstalled) return
  sourceListenerInstalled = true
  onCourseMarkdownChange((markdown) => {
    declarations = parseCourseCatFoodDeclarations(markdown)
    declarationsPromise = null
    declarationBindings.clear()
  })
}

class LootCatFoodElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-food-id"]
  }

  connectedCallback(): void {
    syncFood(this)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) syncFood(this)
  }
}

export function installCatFood(nextController: CatFoodController): void {
  controller = nextController
  installFoodSourceListener()
  setCatFeedingHandler(feedActiveFood)
  window.__LIA_LOOT_CAT_FOOD__ = {
    render(authoredId, send) {
      renderRequests.set(authoredId, { rendered: false, send })
      const host = foodHost(authoredId)
      if (host) syncFood(host)
    },
  }
  if (!keyboardListenerInstalled) {
    keyboardListenerInstalled = true
    document.addEventListener("keydown", handleKeydown)
  }
  if (!customElements.get(CAT_FOOD_TAG)) {
    customElements.define(CAT_FOOD_TAG, LootCatFoodElement)
  }
  syncAllFood()
}
