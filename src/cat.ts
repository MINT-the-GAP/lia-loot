import {
  CollectibleVisibilityGate,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  setHostConcealment,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  catVariantLabel,
  catVariantPickupLabel,
  DEFAULT_CAT_VARIANT,
  extractCatVariantOptions,
  isCatVariant,
  type CatVariant,
} from "./cat-catalog.ts"
import {
  catCollarLabel,
  isCatCollarColor,
  type CatCollarColor,
} from "./cat-collar.ts"
import { createCatGraphic } from "./cat-visual.ts"
import { createCatFoodGraphic } from "./cat-food-visual.ts"
import {
  createResourceGraphic,
  type ResourceVisualKind,
} from "./resource-visual.ts"
import {
  parseExplorationOptions,
  type RevealLayerOption,
} from "./exploration-options.ts"
import {
  clearHostRevealLayers,
  hostIsRevealBlocked,
  REVEAL_CHANGED_EVENT,
  setHostRevealLayers,
} from "./exploration.ts"
import {
  announceResource,
  installResourceBar,
  refreshResourceBarVisibility,
} from "./resource-bar.ts"
import {
  liaSlideIsAccessible,
  observeLiaSlideActivity,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"

const CAT_TAG = "lia-loot-cat"
const COMPANION_ID = "lia-loot-cat-companion"
const PET_CONTROL_ID = "lia-loot-pet-control"
const PET_SUBBAR_ID = "lia-loot-pet-subbar"
const COLLECT_DURATION = 620
const NOD_DURATION = 760
const JUMP_DURATION = 900
const YAWN_DURATION = 1_800
const LIE_DOWN_DURATION = 2_000
const STAND_UP_DURATION = 2_000
const MESSAGE_DURATION = 5_500
export const CAT_FEED_DURATION = 1_400
const FIRST_YAWN_AFTER = 30_000
const SECOND_YAWN_AFTER = 45_000
const SLEEP_AFTER = 60_000

type CatPose =
  | "idle"
  | "nodding"
  | "jumping"
  | "eating"
  | "yawning"
  | "lying-down"
  | "sleeping"
  | "standing-up"

const MOTIVATION_MESSAGES = [
  "Du schaffst das!",
  "Jeder Schritt zählt.",
  "Bleib neugierig!",
  "Fehler helfen dir beim Lernen.",
  "Probier es einfach aus!",
  "Du bist auf einem guten Weg.",
  "Eine kleine Pause kann helfen.",
  "Deine Idee ist einen Versuch wert.",
  "Weiter so!",
  "Ich glaube an dich!",
] as const

export interface CatCompanionController {
  collar(): CatCollarColor | null
  collars(): CatCollarColor[]
  collected(): boolean
  collectCollar(color: CatCollarColor): boolean
  collect(variant: CatVariant): boolean
  isCollarUnlocked(color: CatCollarColor): boolean
  isUnlocked(variant: CatVariant): boolean
  selectCollar(color: CatCollarColor | null): boolean
  select(variant: CatVariant): boolean
  selected(): CatVariant | null
  unlocked(): CatVariant[]
}

interface CatRequest {
  concealment: ConcealmentMode | null
  errors: string[]
  layers: RevealLayerOption[]
  sourceSection: number | null
  valid: boolean
  variant: CatVariant
  visibility: CollectibleVisibilityRule
}

let controller: CatCompanionController | null = null
let runtimeId = 0
let itemRuntimeActive = false
let companionRuntimeActive = false
let petSelectorRuntimeActive = false
let currentPose: CatPose = "idle"
let reactionTimer: number | null = null
let firstYawnTimer: number | null = null
let secondYawnTimer: number | null = null
let sleepTimer: number | null = null
let messageTimer: number | null = null
let lastMotivationIndex = -1
let catFeedingHandler: (() => boolean) | null = null
let syncQueued = false
const collectingIds = new Set<string>()
const eligibleIds = new Set<string>()
const boundButtons = new WeakSet<HTMLButtonElement>()
const warnedInvalidSpecs = new Set<string>()
const visibilityGate = new CollectibleVisibilityGate()

function normalizePlaceholder(value: string): string {
  return /^@\d+$/u.test(value) ? "" : value
}

function resolveCatId(host: HTMLElement): string {
  const authoredId = host.getAttribute("data-cat-id")?.trim()
  if (authoredId && !authoredId.startsWith("@")) {
    return `cat:${authoredId}:inline`
  }
  const existing = host.dataset.lootCatRuntimeId
  if (existing) return existing
  runtimeId += 1
  const generated = `cat:runtime-${runtimeId}:inline`
  host.dataset.lootCatRuntimeId = generated
  return generated
}

function readCatRequest(host: HTMLElement, catId: string): CatRequest {
  const authored = normalizePlaceholder(
    host.getAttribute("data-options")?.trim() ?? "",
  )
  const visibility = parseCollectibleOptions(authored)
  const exploration = parseExplorationOptions(visibility.values)
  const concealment = extractConcealmentOptions(exploration.values)
  const color = extractCatVariantOptions(concealment.values)
  const errors = [
    ...visibility.errors,
    ...concealment.errors,
    ...color.errors,
  ]
  if (color.values.length > 0) {
    errors.push(`Unbekannte Katzenoption: ${color.values.join("; ")}`)
  }
  return {
    concealment: concealment.mode,
    errors,
    layers: exploration.layers,
    sourceSection: sectionFromLootId(catId),
    valid: errors.length === 0,
    variant: color.variant,
    visibility: visibility.rule,
  }
}

function warnInvalidSpecification(
  catId: string,
  errors: readonly string[],
): void {
  if (warnedInvalidSpecs.has(catId)) return
  warnedInvalidSpecs.add(catId)
  console.warn(
    `Loot: Katze ${catId} bleibt wegen ungültiger Optionen verborgen. ${errors.join(" ")}`,
  )
}

function rewardBadge(): HTMLSpanElement {
  const reward = document.createElement("span")
  reward.className = "loot-cat-pickup__reward"
  reward.setAttribute("aria-hidden", "true")
  reward.textContent = "GEFUNDEN"
  return reward
}

function statusText(pose: CatPose): string {
  if (pose === "lying-down") return "Pixelkatze legt sich hin."
  if (pose === "sleeping") {
    return "Pixelkatze schläft. Zum Aufwecken klicken."
  }
  if (pose === "standing-up") return "Pixelkatze steht wieder auf."
  if (pose === "yawning") return "Pixelkatze gähnt müde."
  if (pose === "nodding") return "Pixelkatze nickt zufrieden."
  if (pose === "jumping") return "Pixelkatze springt vor Freude."
  if (pose === "eating") return "Pixelkatze frisst ihr Futter."
  return "Pixelkatze sitzt bereit."
}

function catButtonFromEvent(event: MouseEvent): HTMLButtonElement | null {
  for (const candidate of event.composedPath()) {
    if (
      candidate instanceof HTMLButtonElement &&
      candidate.hasAttribute("data-loot-cat-pickup")
    ) {
      return candidate
    }
  }
  return event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>("[data-loot-cat-pickup]")
    : null
}

function createPickupButton(
  catId: string,
  variant: CatVariant,
): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "loot-cat-pickup"
  button.dataset.lootCatPickup = catId
  button.dataset.lootCatVariant = variant
  button.setAttribute("aria-label", catVariantPickupLabel(variant))
  button.append(createCatGraphic(document, variant), rewardBadge())
  bindPickupButton(button)
  return button
}

function handlePickupClick(event: MouseEvent): void {
  const button = catButtonFromEvent(event)
  const catId = button?.dataset.lootCatPickup
  const variant = button?.dataset.lootCatVariant
  if (
    !button ||
    !catId ||
    !isCatVariant(variant) ||
    !controller ||
    collectingIds.has(catId) ||
    !eligibleIds.has(catId)
  ) {
    return
  }
  collectingIds.add(catId)
  if (!controller.collect(variant)) {
    collectingIds.delete(catId)
    syncAllCats()
    return
  }

  button.disabled = true
  button.classList.add("loot-cat-pickup--collected")
  button.setAttribute("aria-label", `${catVariantLabel(variant)} gefunden`)
  ensureCompanion()
  notifyCatItemFound()
  announceResource(
    `${catVariantLabel(variant)} gefunden und als Begleiter ausgewählt.`,
  )
  syncAllCats()
  window.setTimeout(() => {
    collectingIds.delete(catId)
    button.remove()
    syncAllCats()
  }, COLLECT_DURATION)
}

function bindPickupButton(button: HTMLButtonElement): void {
  if (boundButtons.has(button)) return
  boundButtons.add(button)
  button.addEventListener("click", handlePickupClick)
}

function syncCat(host: HTMLElement): void {
  if (!controller) return
  const catId = resolveCatId(host)
  const request = readCatRequest(host, catId)
  if (!request.valid) {
    eligibleIds.delete(catId)
    warnInvalidSpecification(catId, request.errors)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }
  if (controller.isUnlocked(request.variant) && !collectingIds.has(catId)) {
    eligibleIds.delete(catId)
    visibilityGate.forget(`cat:${catId}`)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    ensureCompanion()
    return
  }
  if (hostIsRevealBlocked(host, false)) {
    eligibleIds.delete(catId)
    host.hidden = true
    return
  }
  if (!liaSlideIsAccessible(request.sourceSection)) {
    eligibleIds.delete(catId)
    clearHostRevealLayers(host)
    host.hidden = true
    return
  }

  const visible = visibilityGate.visible(
    `cat:${catId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    scheduleSync,
  )
  if (!visible) {
    eligibleIds.delete(catId)
    clearHostRevealLayers(host)
    if (host.childElementCount > 0) host.replaceChildren()
    return
  }

  host.hidden = false
  const contentHost = setHostRevealLayers(host, catId, request.layers)
  let button = contentHost.querySelector<HTMLButtonElement>(
    `[data-loot-cat-pickup="${CSS.escape(catId)}"]`,
  )
  if (!button || button.dataset.lootCatVariant !== request.variant) {
    setHostConcealment(contentHost, null)
    button = createPickupButton(catId, request.variant)
    contentHost.replaceChildren(button)
  } else {
    bindPickupButton(button)
  }
  setHostConcealment(contentHost, request.concealment)
  if (!hostIsRevealBlocked(host)) eligibleIds.add(catId)
  else eligibleIds.delete(catId)
}

function syncAllCats(): void {
  eligibleIds.clear()
  document.querySelectorAll<HTMLElement>(CAT_TAG).forEach(syncCat)
}

function scheduleSync(): void {
  if (syncQueued) return
  syncQueued = true
  queueMicrotask(() => {
    syncQueued = false
    syncAllCats()
  })
}

function activateItemRuntime(): void {
  if (itemRuntimeActive) return
  itemRuntimeActive = true
  observeLiaSlideActivity(scheduleSync)
  document.addEventListener(REVEAL_CHANGED_EVENT, scheduleSync)
}

function clearReactionTimer(): void {
  if (reactionTimer === null) return
  window.clearTimeout(reactionTimer)
  reactionTimer = null
}

function clearInactivityTimers(): void {
  if (firstYawnTimer !== null) window.clearTimeout(firstYawnTimer)
  if (secondYawnTimer !== null) window.clearTimeout(secondYawnTimer)
  if (sleepTimer !== null) window.clearTimeout(sleepTimer)
  firstYawnTimer = null
  secondYawnTimer = null
  sleepTimer = null
}

function companionButton(): HTMLButtonElement | null {
  const existing = document.getElementById(COMPANION_ID)
  return existing instanceof HTMLButtonElement ? existing : null
}

function setPose(pose: CatPose): void {
  currentPose = pose
  const companion = companionButton()
  if (!companion) return
  if (
    pose === "nodding" ||
    pose === "jumping" ||
    pose === "eating" ||
    pose === "yawning" ||
    pose === "lying-down" ||
    pose === "standing-up"
  ) {
    companion.dataset.catState = "idle"
    void companion.offsetWidth
  }
  companion.dataset.catState = pose
  companion.setAttribute("aria-label", statusText(pose))
  companion.title = statusText(pose)
  const status = companion.querySelector<HTMLElement>(".loot-cat-companion__status")
  if (status) status.textContent = statusText(pose)
}

function finishInactivityYawn(): void {
  if (currentPose !== "yawning") return
  reactionTimer = null
  setPose("idle")
}

function yawnFromInactivity(): void {
  if (!controller?.collected() || currentPose !== "idle") return
  clearReactionTimer()
  setPose("yawning")
  reactionTimer = window.setTimeout(finishInactivityYawn, YAWN_DURATION)
}

function lieDownFromInactivity(): void {
  sleepTimer = null
  if (!controller?.collected() || currentPose === "sleeping") return
  clearReactionTimer()
  setPose("lying-down")
  reactionTimer = window.setTimeout(() => {
    reactionTimer = null
    if (currentPose === "lying-down") setPose("sleeping")
  }, LIE_DOWN_DURATION)
}

function scheduleInactivity(): void {
  clearInactivityTimers()
  if (!controller?.collected() || currentPose === "sleeping") return
  firstYawnTimer = window.setTimeout(() => {
    firstYawnTimer = null
    yawnFromInactivity()
  }, FIRST_YAWN_AFTER)
  secondYawnTimer = window.setTimeout(() => {
    secondYawnTimer = null
    yawnFromInactivity()
  }, SECOND_YAWN_AFTER)
  sleepTimer = window.setTimeout(lieDownFromInactivity, SLEEP_AFTER)
}

function noteActivity(): void {
  if (!controller?.collected() || currentPose === "sleeping") return
  if (currentPose === "yawning" || currentPose === "lying-down") {
    clearReactionTimer()
    setPose("idle")
  }
  scheduleInactivity()
}

function standUp(): void {
  clearReactionTimer()
  clearInactivityTimers()
  setPose("standing-up")
  reactionTimer = window.setTimeout(() => {
    reactionTimer = null
    if (currentPose !== "standing-up") return
    setPose("idle")
    scheduleInactivity()
  }, STAND_UP_DURATION)
}

function nextMotivation(): string {
  let nextIndex = Math.floor(Math.random() * MOTIVATION_MESSAGES.length)
  if (nextIndex === lastMotivationIndex) {
    nextIndex = (nextIndex + 1) % MOTIVATION_MESSAGES.length
  }
  lastMotivationIndex = nextIndex
  return MOTIVATION_MESSAGES[nextIndex]
}

function showCompanionMessage(
  text: string,
  resourceKind?: ResourceVisualKind,
  accessibleLabel = text,
): void {
  const companion = companionButton()
  const message = companion?.querySelector<HTMLElement>(
    ".loot-cat-companion__message",
  )
  if (!companion || !message) return
  if (messageTimer !== null) window.clearTimeout(messageTimer)
  companion.dataset.catMessageVisible = "false"
  message.removeAttribute("aria-label")
  if (resourceKind) {
    const value = document.createElement("span")
    value.textContent = text
    const icon = createResourceGraphic(resourceKind, message.ownerDocument)
    icon.classList.add("loot-cat-companion__reward-icon")
    message.replaceChildren(value, icon)
    message.setAttribute("aria-label", accessibleLabel)
  } else {
    message.textContent = text
  }
  void message.offsetWidth
  companion.dataset.catMessageVisible = "true"
  messageTimer = window.setTimeout(() => {
    messageTimer = null
    companion.dataset.catMessageVisible = "false"
  }, MESSAGE_DURATION)
}

function showMotivation(): void {
  showCompanionMessage(nextMotivation())
}

function motivateCompanion(event: MouseEvent): void {
  event.stopPropagation()
  if (catFeedingHandler?.()) return
  if (currentPose === "eating") return
  showMotivation()
  if (currentPose === "sleeping" || currentPose === "lying-down") {
    standUp()
    return
  }
  if (currentPose === "standing-up") return
  react("nodding", NOD_DURATION)
}

function trackPointer(event: PointerEvent): void {
  if (event.pointerType && event.pointerType !== "mouse") return
  const companion = companionButton()
  if (!companion) return
  const bounds = companion.getBoundingClientRect()
  const horizontalRange = Math.max(window.innerWidth / 2, 1)
  const verticalRange = Math.max(window.innerHeight / 2, 1)
  const lookX = Math.max(
    -1,
    Math.min(
      1,
      (event.clientX - (bounds.left + bounds.width / 2)) / horizontalRange,
    ),
  )
  const lookY = Math.max(
    -1,
    Math.min(
      1,
      (event.clientY - (bounds.top + bounds.height / 2)) / verticalRange,
    ),
  )
  companion.style.setProperty("--loot-cat-look-x", lookX.toFixed(3))
  companion.style.setProperty("--loot-cat-look-y", lookY.toFixed(3))
  companion.style.setProperty("--loot-cat-head-x", `${(lookX * 2.4).toFixed(2)}px`)
  companion.style.setProperty("--loot-cat-head-y", `${(lookY * 1.6).toFixed(2)}px`)
  companion.style.setProperty(
    "--loot-cat-head-angle",
    `${(lookX * 2.2).toFixed(2)}deg`,
  )
  companion.style.setProperty("--loot-cat-pupil-x", `${(lookX * 2.2).toFixed(2)}px`)
  companion.style.setProperty("--loot-cat-pupil-y", `${(lookY * 1.7).toFixed(2)}px`)
}

function petControlButton(): HTMLButtonElement | null {
  const existing = document.getElementById(PET_CONTROL_ID)
  return existing instanceof HTMLButtonElement ? existing : null
}

function petSubbar(): HTMLElement | null {
  return document.getElementById(PET_SUBBAR_ID)
}

function positionPetSubbar(): void {
  const subbar = petSubbar()
  const resourceBar = document.getElementById("lia-loot-resource-bar")
  if (!subbar || subbar.hidden || !resourceBar) return
  const bounds = resourceBar.getBoundingClientRect()
  subbar.style.top = `${Math.round(bounds.bottom + 6)}px`
}

function closePetSubbar(): void {
  const control = petControlButton()
  const subbar = petSubbar()
  if (!control || !subbar) return
  control.setAttribute("aria-expanded", "false")
  subbar.hidden = true
}

function togglePetSubbar(event: MouseEvent): void {
  event.stopPropagation()
  const control = petControlButton()
  const subbar = petSubbar()
  if (!control || !subbar) return
  const willOpen = subbar.hidden
  subbar.hidden = !willOpen
  control.setAttribute("aria-expanded", String(willOpen))
  if (willOpen) positionPetSubbar()
}

function setCatGraphicAppearance(
  graphic: SVGSVGElement,
  variant: CatVariant,
  collar: CatCollarColor | null,
): void {
  graphic.dataset.catVariant = variant
  if (collar) graphic.dataset.catCollar = collar
  else delete graphic.dataset.catCollar
}

function applyCompanionAppearance(
  variant: CatVariant,
  collar: CatCollarColor | null,
): void {
  const graphic = companionButton()?.querySelector<SVGSVGElement>(
    ".loot-cat-graphic",
  )
  if (graphic) setCatGraphicAppearance(graphic, variant, collar)
}

function choosePet(event: MouseEvent): void {
  const target = event.currentTarget
  if (!(target instanceof HTMLButtonElement) || !controller) return
  const variant = target.dataset.lootPetVariant
  if (!isCatVariant(variant)) return
  controller.select(variant)
  applyCompanionAppearance(variant, controller.collar())
  renderPetSelector()
  closePetSubbar()
  announceResource(`${catVariantLabel(variant)} ist jetzt dein Begleiter.`)
}

function chooseCollar(event: MouseEvent): void {
  const target = event.currentTarget
  if (!(target instanceof HTMLButtonElement) || !controller) return
  const requested = target.dataset.lootPetCollar
  const collar = requested === "none" ? null : requested
  if (collar !== null && !isCatCollarColor(collar)) return
  controller.selectCollar(collar)
  const variant = controller.selected() ?? DEFAULT_CAT_VARIANT
  applyCompanionAppearance(variant, collar)
  renderPetSelector()
  closePetSubbar()
  announceResource(
    collar
      ? `${catCollarLabel(collar)} ist jetzt angelegt.`
      : "Die Pixelkatze trägt jetzt kein Halsband.",
  )
}

function createPetControl(
  variant: CatVariant,
  collar: CatCollarColor | null,
): HTMLButtonElement {
  const button = document.createElement("button")
  button.id = PET_CONTROL_ID
  button.type = "button"
  button.className = "loot-pet-control"
  button.dataset.lootPetControl = "true"
  button.setAttribute("aria-controls", PET_SUBBAR_ID)
  button.setAttribute("aria-expanded", "false")
  button.addEventListener("click", togglePetSubbar)
  button.append(createCatGraphic(document, variant, collar))
  return button
}

function createPetSubbar(): HTMLElement {
  const bar = document.createElement("div")
  bar.id = PET_SUBBAR_ID
  bar.className = "loot-pet-subbar"
  bar.setAttribute("role", "toolbar")
  bar.setAttribute("aria-label", "Verfügbare Begleiter")
  bar.hidden = true
  document.body.appendChild(bar)
  return bar
}

function renderPetSelector(): void {
  if (!controller?.collected() || !document.body) return
  const selected = controller.selected() ?? DEFAULT_CAT_VARIANT
  const unlocked = controller.unlocked()
  const selectedCollar = controller.collar()
  const unlockedCollars = controller.collars()
  const resourceBar = installResourceBar()
  let control = petControlButton()
  if (!control) {
    control = createPetControl(selected, selectedCollar)
    resourceBar.appendChild(control)
  }
  const controlGraphic = control.querySelector<SVGSVGElement>(
    ".loot-cat-graphic",
  )
  if (controlGraphic) {
    setCatGraphicAppearance(controlGraphic, selected, selectedCollar)
  }
  const collarStatus = selectedCollar
    ? catCollarLabel(selectedCollar)
    : "ohne Halsband"
  control.title = `Begleiter auswählen: ${catVariantLabel(selected)}, ${collarStatus}`
  control.setAttribute(
    "aria-label",
    `Begleiter auswählen. Aktiv: ${catVariantLabel(selected)}, ${collarStatus}.`,
  )

  const subbar = petSubbar() ?? createPetSubbar()
  const signature = `${unlocked.join(",")}:${selected}:${unlockedCollars.join(",")}:${selectedCollar ?? "none"}`
  if (subbar.dataset.lootPetSignature !== signature) {
    const choices = unlocked.map((variant) => {
      const choice = document.createElement("button")
      choice.type = "button"
      choice.className = "loot-pet-choice"
      choice.dataset.lootPetVariant = variant
      choice.setAttribute(
        "aria-label",
        `${catVariantLabel(variant)} auswählen`,
      )
      choice.setAttribute("aria-pressed", String(variant === selected))
      choice.title = catVariantLabel(variant)
      const label = document.createElement("span")
      label.textContent = catVariantLabel(variant)
      choice.append(
        createCatGraphic(document, variant, selectedCollar),
        label,
      )
      choice.addEventListener("click", choosePet)
      return choice
    })
    const collarChoices: HTMLElement[] = []
    if (unlockedCollars.length > 0) {
      const divider = document.createElement("span")
      divider.className = "loot-pet-subbar__divider"
      divider.setAttribute("aria-hidden", "true")
      collarChoices.push(divider)
      for (const collar of [null, ...unlockedCollars] as const) {
        const choice = document.createElement("button")
        const active = collar === selectedCollar
        const labelText = collar ? catCollarLabel(collar) : "Ohne Halsband"
        choice.type = "button"
        choice.className = "loot-pet-choice loot-pet-choice--collar"
        choice.dataset.lootPetCollar = collar ?? "none"
        choice.setAttribute("aria-label", `${labelText} auswählen`)
        choice.setAttribute("aria-pressed", String(active))
        choice.title = labelText
        const label = document.createElement("span")
        label.textContent = labelText
        choice.append(createCatGraphic(document, selected, collar), label)
        choice.addEventListener("click", chooseCollar)
        collarChoices.push(choice)
      }
    }
    subbar.replaceChildren(...choices, ...collarChoices)
    subbar.dataset.lootPetSignature = signature
  }
  activatePetSelectorRuntime()
  refreshResourceBarVisibility()
  positionPetSubbar()
}

function handlePetSelectorOutsideClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Node)) return
  if (petControlButton()?.contains(target) || petSubbar()?.contains(target)) return
  closePetSubbar()
}

function handlePetSelectorKey(event: KeyboardEvent): void {
  if (event.key === "Escape") closePetSubbar()
}

function activatePetSelectorRuntime(): void {
  if (petSelectorRuntimeActive) return
  petSelectorRuntimeActive = true
  document.addEventListener("click", handlePetSelectorOutsideClick)
  document.addEventListener("keydown", handlePetSelectorKey)
  window.addEventListener("resize", positionPetSubbar, { passive: true })
  window.addEventListener("scroll", positionPetSubbar, { passive: true })
}

function createCompanion(
  variant: CatVariant,
  collar: CatCollarColor | null,
): HTMLButtonElement {
  const button = document.createElement("button")
  button.id = COMPANION_ID
  button.type = "button"
  button.className = "loot-cat-companion"
  button.dataset.catState = currentPose
  button.setAttribute("aria-label", statusText(currentPose))
  button.title = statusText(currentPose)
  const sleepMarks = document.createElement("span")
  sleepMarks.className = "loot-cat-companion__sleep"
  sleepMarks.setAttribute("aria-hidden", "true")
  sleepMarks.innerHTML = "<span>Z</span><span>z</span><span>z</span>"
  const status = document.createElement("span")
  status.className = "loot-cat-companion__status"
  status.setAttribute("aria-live", "polite")
  status.textContent = statusText(currentPose)
  const message = document.createElement("span")
  message.className = "loot-cat-companion__message"
  message.setAttribute("role", "status")
  message.setAttribute("aria-live", "polite")
  message.setAttribute("aria-atomic", "true")
  const food = createCatFoodGraphic(document)
  food.classList.add("loot-cat-companion__food")
  button.dataset.catMessageVisible = "false"
  button.append(
    createCatGraphic(document, variant, collar),
    food,
    sleepMarks,
    status,
    message,
  )
  button.addEventListener("click", motivateCompanion)
  return button
}

function activateCompanionRuntime(): void {
  if (companionRuntimeActive) return
  companionRuntimeActive = true
  window.addEventListener("pointerdown", noteActivity, {
    capture: true,
    passive: true,
  })
  window.addEventListener("keydown", noteActivity, true)
  window.addEventListener("wheel", noteActivity, { passive: true })
  window.addEventListener("touchstart", noteActivity, { passive: true })
  window.addEventListener("pointermove", trackPointer, { passive: true })
}

function ensureCompanion(): void {
  if (!controller?.collected() || !document.body) return
  const selected = controller.selected() ?? DEFAULT_CAT_VARIANT
  const collar = controller.collar()
  document.body.classList.add("loot-cat-owned")
  if (!companionButton()) {
    document.body.appendChild(createCompanion(selected, collar))
  }
  applyCompanionAppearance(selected, collar)
  renderPetSelector()
  activateCompanionRuntime()
  // LiaScript may synchronize a slide without user input. Those internal
  // refreshes must not restart the inactivity countdown.
  if (
    firstYawnTimer === null &&
    secondYawnTimer === null &&
    sleepTimer === null &&
    reactionTimer === null &&
    currentPose !== "sleeping" &&
    currentPose !== "standing-up"
  ) {
    scheduleInactivity()
  }
}

function react(pose: "nodding" | "jumping" | "eating", duration: number): void {
  if (!controller?.collected()) return
  ensureCompanion()
  clearReactionTimer()
  clearInactivityTimers()
  setPose(pose)
  reactionTimer = window.setTimeout(() => {
    reactionTimer = null
    setPose("idle")
    scheduleInactivity()
  }, duration)
}

export function notifyCatItemFound(): void {
  react("nodding", NOD_DURATION)
}

export function notifyCatTaskSolved(): void {
  react("jumping", JUMP_DURATION)
}

export function notifyCatFed(): void {
  react("eating", CAT_FEED_DURATION)
}

export function notifyCatReward(
  message: string,
  resourceKind?: ResourceVisualKind,
  accessibleLabel = message,
): void {
  if (!controller?.collected()) return
  ensureCompanion()
  showCompanionMessage(message, resourceKind, accessibleLabel)
}

export function setCatFeedingHandler(handler: (() => boolean) | null): void {
  catFeedingHandler = handler
}

export function refreshCatCompanion(): void {
  syncAllCats()
  if (controller?.collected()) ensureCompanion()
}

class LootCatElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-cat-id", "data-options", "hidden"]
  }

  connectedCallback(): void {
    activateItemRuntime()
    scheduleSync()
  }

  attributeChangedCallback(): void {
    if (this.isConnected) scheduleSync()
  }
}

export function installCatCompanion(
  nextController: CatCompanionController,
): void {
  controller = nextController
  if (!customElements.get(CAT_TAG)) {
    customElements.define(CAT_TAG, LootCatElement)
  }
  if (controller.collected()) ensureCompanion()
  syncAllCats()
}
