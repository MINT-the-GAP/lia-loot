import {
  discoverCourseLocks,
  type CourseLockDeclaration,
} from "./course-chests.ts"
import type { KeyColor } from "./key-colors.ts"
import { parseLockOptions } from "./lock-options.ts"
import {
  isGlobalLockTarget,
  isItemLockTarget,
  isLocalLockTarget,
  isTemplateLockTarget,
  resolveLockTarget,
  type GlobalLockTarget,
  type LocalLockTarget,
  type LockTarget,
} from "./lock-targets.ts"
import {
  findTemplateTarget,
  templateDocumentCandidates,
  templateTargetDefinition,
  TEMPLATE_TARGET_LABELS,
  type TemplateTarget,
} from "./template-targets.ts"
import {
  observeLiaSlideActivity,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"
import type { UnlockResult } from "./inventory-store.ts"

const LOCK_TAG = "lia-loot-lock"
const PORTAL_TAG = "lia-loot-slide-portal"
const PORTAL_BUTTON_SELECTOR = "[data-loot-slide-portal-button]"
const QUIZ_SELECTOR = ".lia-quiz"
const STATUS_ID = "lia-loot-lock-status"
const UNLOCK_DURATION = 620
const FEEDBACK_DURATION = 2200

interface ObjectLockController {
  catalogReady(total: number): void
  unlocked(lockId: string): boolean
  unlock(lockId: string, color: KeyColor): UnlockResult
}

interface LockRequest {
  baseId: string
  target: LockTarget
  color: KeyColor
  onlyOnSlide: boolean
  scope: "global" | "local"
  sourceSection: number | null
  sourceHost?: HTMLElement
  quiz?: HTMLElement
}

interface ElementState {
  ariaHidden?: string | null
  concealed?: boolean
  inert: boolean
  kind: "content" | "control"
  tabIndex?: string | null
}

interface TargetBinding {
  slotKey: string
  root: HTMLElement
  anchor: HTMLElement
  controls: HTMLElement[]
  contents: HTMLElement[]
  mode: "fill" | "floating"
  focusCandidates: HTMLElement[]
}

interface Decoration {
  binding: TargetBinding
  button: HTMLButtonElement
  feedbackTimer: number | null
  lockId: string
  request: LockRequest
  rootWasTarget: boolean
  states: Map<HTMLElement, ElementState>
}

interface SupportTargetConfig {
  contentGroup: string
  focusSelector: string
  rootSelector: string
  triggerGroup: string
}

const SUPPORT_TARGETS: Readonly<
  Partial<Record<GlobalLockTarget, SupportTargetConfig>>
> = {
  mode: {
    rootSelector: "#lia-support-menu .lia-support-menu__item--mode",
    triggerGroup: "mode",
    contentGroup: "mode",
    focusSelector: "#lia-mode-textbook",
  },
  menu: {
    rootSelector: "#lia-support-menu .lia-support-menu__item--settings",
    triggerGroup: "setting",
    contentGroup: "setting",
    focusSelector: "#lia-btn-light-mode",
  },
  translator: {
    rootSelector: "#lia-support-menu .lia-support-menu__item--lang",
    triggerGroup: "translation",
    contentGroup: "translation",
    focusSelector: "#lia-checkbox-google_translate",
  },
  classroom: {
    rootSelector: "#lia-support-menu .lia-support-menu__item--share",
    triggerGroup: "share",
    contentGroup: "share",
    focusSelector: "#lia-button-qr-code",
  },
  info: {
    rootSelector: "#lia-support-menu .lia-support-menu__item--info",
    triggerGroup: "information",
    contentGroup: "information",
    focusSelector: "",
  },
}

const QUIZ_ACTION_SELECTORS: Record<LocalLockTarget, string> = {
  check: ".lia-quiz__control .lia-quiz__check",
  resolve: ".lia-quiz__control .lia-quiz__resolve",
  hint: ".lia-quiz__control .lia-quiz__hint",
}

const TARGET_NAMES: Record<LockTarget, string> = {
  toc: "Inhaltsverzeichnis",
  mode: "Darstellung",
  menu: "Menü",
  translator: "Übersetzer",
  classroom: "Classroom",
  info: "Info-Menü",
  seitenwechsel: "Seitenwechsel",
  check: "Prüfen",
  resolve: "Auflösen",
  hint: "Hinweis",
  portal: "Portal",
  ...TEMPLATE_TARGET_LABELS,
}

const LOCK_COLOR_NAMES: Record<KeyColor, string> = {
  red: "Rotes Schloss",
  blue: "Blaues Schloss",
  green: "Grünes Schloss",
  yellow: "Gelbes Schloss",
  purple: "Lilafarbenes Schloss",
  orange: "Orangefarbenes Schloss",
}

const KEY_ACCUSATIVE_NAMES: Record<KeyColor, string> = {
  red: "roten Schlüssel",
  blue: "blauen Schlüssel",
  green: "grünen Schlüssel",
  yellow: "gelben Schlüssel",
  purple: "lilafarbenen Schlüssel",
  orange: "orangefarbenen Schlüssel",
}

const KEY_NOMINATIVE_NAMES: Record<KeyColor, string> = {
  red: "roter Schlüssel",
  blue: "blauer Schlüssel",
  green: "grüner Schlüssel",
  yellow: "gelber Schlüssel",
  purple: "lilafarbener Schlüssel",
  orange: "orangefarbener Schlüssel",
}

const decorations = new Map<string, Decoration>()
const sourceRequests: LockRequest[] = []
const persistentHostRequests = new Map<string, LockRequest>()
const unlockingIds = new Set<string>()
const quizIds = new WeakMap<HTMLElement, string>()
const portalIds = new WeakMap<HTMLElement, string>()
const pendingControlTabIndices = new WeakMap<
  HTMLElement,
  { value: string | null }
>()

let controller: ObjectLockController | null = null
const observers: MutationObserver[] = []
let anchorResizeObserver: ResizeObserver | null = null
let syncTimer: number | null = null
let runtimeId = 0
let quizRuntimeId = 0
let portalRuntimeId = 0
let sourceDiscovery: "idle" | "pending" | "complete" = "idle"
let captureInstalled = false
let slideActivityInstalled = false
let viewportListenersInstalled = false

function resolveBaseId(host: HTMLElement): string {
  const authoredId = host.getAttribute("data-lock-id")?.trim()
  if (authoredId && !authoredId.startsWith("@")) return authoredId

  const existingId = host.dataset.lootLockRuntimeId
  if (existingId) return existingId

  runtimeId += 1
  const generatedId = `runtime-lock-${runtimeId}`
  host.dataset.lootLockRuntimeId = generatedId
  return generatedId
}

function requestLockId(request: LockRequest): string {
  if (request.scope === "global") {
    if (request.onlyOnSlide) {
      return request.sourceSection !== null
        ? `lock:${request.target}:section-${request.sourceSection}:${request.color}`
        : `lock:${request.baseId}:${request.target}:${request.color}`
    }
    return `lock:${request.target}:${request.color}`
  }
  if (isTemplateLockTarget(request.target) && request.sourceSection !== null) {
    return `lock:${request.target}:section-${request.sourceSection}:${request.color}`
  }
  return `lock:${request.baseId}:${request.target}:${request.color}`
}

function quizRuntimeKey(quiz: HTMLElement): string {
  const existing = quizIds.get(quiz)
  if (existing) return existing
  quizRuntimeId += 1
  const id = `quiz-${quizRuntimeId}`
  quizIds.set(quiz, id)
  return id
}

function portalRuntimeKey(portal: HTMLElement): string {
  const existing = portalIds.get(portal)
  if (existing) return existing
  portalRuntimeId += 1
  const id = `portal-${portalRuntimeId}`
  portalIds.set(portal, id)
  return id
}

function portalForHost(host: HTMLElement): HTMLElement | null {
  const slide = host.closest<HTMLElement>("main.lia-slide__content")
  if (!slide) return null

  let nearest: HTMLElement | null = null
  for (const portal of slide.querySelectorAll<HTMLElement>(PORTAL_TAG)) {
    // DOCUMENT_POSITION_FOLLOWING (4): the lock host follows this portal.
    if ((portal.compareDocumentPosition(host) & 4) !== 0) nearest = portal
  }
  return nearest
}

function topLevelSlideChild(
  host: HTMLElement,
  slide: HTMLElement,
): HTMLElement | null {
  let top = host
  while (top.parentElement && top.parentElement !== slide) {
    top = top.parentElement
  }
  return top.parentElement === slide ? top : null
}

function containsOnlyLockHost(element: HTMLElement): boolean {
  const children = [...element.children]
  return (
    children.length === 1 &&
    children[0] instanceof HTMLElement &&
    children[0].matches(LOCK_TAG)
  )
}

function quizForHost(host: HTMLElement): HTMLElement | null {
  const containingQuiz = host.closest<HTMLElement>(QUIZ_SELECTOR)
  if (containingQuiz) return containingQuiz

  const slide = host.closest<HTMLElement>("main.lia-slide__content")
  if (!slide) return null
  const top = topLevelSlideChild(host, slide)
  if (!top) return null

  let previous = top.previousElementSibling
  while (previous instanceof HTMLElement && containsOnlyLockHost(previous)) {
    previous = previous.previousElementSibling
  }

  return previous instanceof HTMLElement && previous.matches(QUIZ_SELECTOR)
    ? previous
    : null
}

function retainHostRequest(request: LockRequest): LockRequest {
  if (request.scope !== "global") {
    persistentHostRequests.delete(request.baseId)
    return request
  }

  const retained = { ...request }
  if (!request.onlyOnSlide) delete retained.sourceHost
  persistentHostRequests.set(request.baseId, retained)
  return request
}

function registerHost(host: HTMLElement): LockRequest | null {
  const baseId = resolveBaseId(host)
  const target = resolveLockTarget(host.getAttribute("data-target"))
  const options = parseLockOptions(host.getAttribute("data-color") ?? "")

  host.classList.add("loot-object-lock-host")
  if (host.getAttribute("aria-hidden") !== "true") {
    host.setAttribute("aria-hidden", "true")
  }
  if (host.childElementCount > 0) host.replaceChildren()
  delete host.dataset.lootLockError

  if (!target || !options.valid || !options.color) {
    persistentHostRequests.delete(baseId)
    return null
  }
  const sourceSection = sectionFromLootId(baseId)
  const requestBase = {
    baseId,
    target,
    color: options.color,
    onlyOnSlide: options.onlyOnSlide,
    sourceSection,
    sourceHost: host,
  }
  if (isTemplateLockTarget(target)) {
    const scope =
      templateTargetDefinition(target).scope === "global" ? "global" : "local"
    return retainHostRequest({ ...requestBase, scope })
  }
  if (isGlobalLockTarget(target)) {
    return retainHostRequest({ ...requestBase, scope: "global" })
  }
  if (isItemLockTarget(target)) {
    return retainHostRequest({ ...requestBase, scope: "local" })
  }

  const quiz = quizForHost(host)
  if (!quiz) {
    persistentHostRequests.delete(baseId)
    host.dataset.lootLockError = "quiz-not-adjacent"
    return null
  }
  return retainHostRequest({
    ...requestBase,
    scope: "local",
    quiz,
  })
}

function normalizedDeclaration(
  declaration: CourseLockDeclaration,
): LockRequest | null {
  const target = resolveLockTarget(declaration.target)
  if (target && isTemplateLockTarget(target)) {
    return {
      baseId: declaration.baseId,
      target,
      color: declaration.color,
      onlyOnSlide: declaration.onlyOnSlide,
      scope:
        templateTargetDefinition(target).scope === "global"
          ? "global"
          : "local",
      sourceSection: declaration.section,
    }
  }
  if (!target || !isGlobalLockTarget(target)) return null
  return {
    baseId: declaration.baseId,
    target,
    color: declaration.color,
    onlyOnSlide: declaration.onlyOnSlide,
    scope: "global",
    sourceSection: declaration.section,
  }
}

export function courseLockUnitCount(
  declarations: readonly CourseLockDeclaration[],
  templateAvailable: (target: TemplateTarget) => boolean = () => true,
): number {
  const catalogIds = new Set<string>()
  for (const declaration of declarations) {
    const target = resolveLockTarget(declaration.target)
    if (!target) continue
    if (isTemplateLockTarget(target) && !templateAvailable(target)) continue
    const scope = isTemplateLockTarget(target)
      ? templateTargetDefinition(target).scope === "global"
        ? "global"
        : "local"
      : isGlobalLockTarget(target)
        ? "global"
        : isLocalLockTarget(target) || isItemLockTarget(target)
          ? "local"
          : null
    if (!scope) continue
    catalogIds.add(
      requestLockId({
        baseId: declaration.baseId,
        target,
        color: declaration.color,
        onlyOnSlide: declaration.onlyOnSlide,
        scope,
        sourceSection: declaration.section,
      }),
    )
  }
  return catalogIds.size
}

function registerSourceDeclarations(
  declarations: readonly CourseLockDeclaration[],
  catalog: readonly CourseLockDeclaration[],
): void {
  sourceRequests.length = 0
  for (const declaration of declarations) {
    const request = normalizedDeclaration(declaration)
    if (request) sourceRequests.push(request)
  }
  sourceDiscovery = "complete"
  controller?.catalogReady(courseLockUnitCount(catalog))
  scheduleSync()
}

function discoverSourceLocks(): void {
  if (sourceDiscovery !== "idle") return
  sourceDiscovery = "pending"
  void discoverCourseLocks()
    .then(({ declarations, catalog }) =>
      registerSourceDeclarations(declarations, catalog),
    )
    .catch(() => registerSourceDeclarations([], []))
}

function statusRegion(): HTMLElement {
  const existing = document.getElementById(STATUS_ID)
  if (existing) return existing

  const status = document.createElement("div")
  status.id = STATUS_ID
  status.className = "loot-object-lock-status"
  status.setAttribute("role", "status")
  status.setAttribute("aria-live", "polite")
  status.setAttribute("aria-atomic", "true")
  document.body.appendChild(status)
  return status
}

function announce(message: string): void {
  const status = statusRegion()
  status.textContent = ""
  window.setTimeout(() => {
    status.textContent = message
  }, 0)
}

function directChildrenMatching(
  root: HTMLElement,
  selector: string,
): HTMLElement[] {
  return [...root.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.matches(selector),
  )
}

function supportBinding(
  target: GlobalLockTarget,
  config: SupportTargetConfig,
): TargetBinding | null {
  const root = document.querySelector<HTMLElement>(config.rootSelector)
  if (!root) return null

  const controls = directChildrenMatching(
    root,
    `button[data-group-id='${config.triggerGroup}'], i.hide-md-up`,
  )
  const contents = directChildrenMatching(
    root,
    `.lia-support-menu__submenu[data-group-id='${config.contentGroup}']`,
  )
  const innerFocus = config.focusSelector
    ? root.querySelector<HTMLElement>(config.focusSelector)
    : null

  return {
    slotKey: `global:${target}`,
    root,
    anchor: root,
    controls,
    contents,
    mode: "fill",
    focusCandidates: [
      ...controls,
      ...(innerFocus ? [innerFocus] : []),
      root,
    ],
  }
}

function globalBinding(target: GlobalLockTarget): TargetBinding | null {
  const support = SUPPORT_TARGETS[target]
  if (support) return supportBinding(target, support)

  if (target === "toc") {
    const root = document.querySelector<HTMLElement>("#lia-toc")
    const trigger = document.querySelector<HTMLElement>("#lia-btn-toc")
    if (!root || !trigger) return null
    return {
      slotKey: "global:toc",
      root,
      anchor: trigger,
      controls: [trigger],
      contents: directChildrenMatching(root, ".lia-toc__content"),
      mode: "floating",
      focusCandidates: [trigger],
    }
  }

  if (target === "seitenwechsel") {
    const root = document.querySelector<HTMLElement>(".lia-pagination")
    const anchor = root?.querySelector<HTMLElement>(
      ":scope > .lia-pagination__content",
    )
    if (!root || !anchor) return null
    const previous = document.querySelector<HTMLElement>("#lia-btn-prev")
    const next = document.querySelector<HTMLElement>("#lia-btn-next")
    const controls = [previous, next].filter(
      (element): element is HTMLElement => element !== null,
    )
    return {
      slotKey: "global:seitenwechsel",
      root,
      anchor,
      controls,
      contents: [],
      mode: "floating",
      focusCandidates: [next, previous].filter(
        (element): element is HTMLElement => element !== null,
      ),
    }
  }

  return null
}

function isVisibleAction(quiz: HTMLElement, action: HTMLElement): boolean {
  const visible =
    quiz.classList.contains("open") &&
    !action.hasAttribute("hidden") &&
    !(action instanceof HTMLButtonElement && action.disabled) &&
    action.getAttribute("aria-hidden") !== "true" &&
    action.getClientRects().length > 0
  if (visible) {
    const pendingTabIndex = pendingControlTabIndices.get(action)
    if (pendingTabIndex) {
      if (action.getAttribute("tabindex") === "-1") {
        restoreAttribute(action, "tabindex", pendingTabIndex.value)
      }
      pendingControlTabIndices.delete(action)
    }
  }
  return visible
}

function localBinding(request: LockRequest): TargetBinding | null {
  if (!request.quiz || !request.quiz.isConnected) return null
  if (!isLocalLockTarget(request.target)) return null
  const action = request.quiz.querySelector<HTMLElement>(
    QUIZ_ACTION_SELECTORS[request.target],
  )
  if (!action || !isVisibleAction(request.quiz, action)) return null

  return {
    slotKey: `local:${quizRuntimeKey(request.quiz)}:${request.target}`,
    root: request.quiz,
    anchor: action,
    controls: [action],
    contents: [],
    mode: "floating",
    focusCandidates: [action],
  }
}

function portalBinding(request: LockRequest): TargetBinding | null {
  if (!isItemLockTarget(request.target) || !request.sourceHost?.isConnected) {
    return null
  }
  if (!sourceSlideIsActive(request.sourceSection, request.sourceHost)) return null

  const portal = portalForHost(request.sourceHost)
  const button = portal?.querySelector<HTMLElement>(PORTAL_BUTTON_SELECTOR)
  if (!portal || !button) return null

  return {
    slotKey: `item:portal:${portalRuntimeKey(portal)}`,
    root: portal,
    anchor: button,
    controls: [button],
    contents: [],
    mode: "floating",
    focusCandidates: [button],
  }
}

function templateBinding(request: LockRequest): TargetBinding | null {
  if (!isTemplateLockTarget(request.target)) return null

  const definition = templateTargetDefinition(request.target)
  const match = findTemplateTarget(request.target, "lock", document)
  if (!match) return null
  if (
    definition.scope === "slide" &&
    !sourceSlideIsActive(request.sourceSection, match.root)
  ) {
    return null
  }

  return {
    slotKey:
      definition.scope === "global"
        ? `template:global:${request.target}`
        : `template:${request.target}:section-${request.sourceSection ?? request.baseId}`,
    root: match.root,
    anchor: match.lockAnchor!,
    controls: match.lockControls,
    contents: [],
    mode: "floating",
    focusCandidates: match.focusCandidates,
  }
}

function bindingFor(request: LockRequest): TargetBinding | null {
  if (
    request.onlyOnSlide &&
    !sourceSlideIsActive(request.sourceSection, request.sourceHost)
  ) {
    return null
  }
  if (isItemLockTarget(request.target)) return portalBinding(request)
  if (isTemplateLockTarget(request.target)) return templateBinding(request)
  return request.scope === "global"
    ? globalBinding(request.target as GlobalLockTarget)
    : localBinding(request)
}

function collectRequests(): LockRequest[] {
  const combined = [
    ...sourceRequests,
    ...persistentHostRequests.values(),
  ]
  document.querySelectorAll<HTMLElement>(LOCK_TAG).forEach((host) => {
    const request = registerHost(host)
    if (request) combined.push(request)
  })

  const unique: LockRequest[] = []
  const seen = new Set<string>()
  for (const request of combined) {
    const id = requestLockId(request)
    if (seen.has(id)) continue
    seen.add(id)
    unique.push(request)
  }
  return unique
}

function createLockButton(
  request: LockRequest,
  id: string,
  slotKey: string,
  ownerDocument: Document = document,
): HTMLButtonElement {
  const button = ownerDocument.createElement("button")
  button.type = "button"
  button.className = `loot-object-lock-button loot-object-lock-button--${request.scope} loot-key-color--${request.color}`
  button.dataset.lootLockButton = id
  button.dataset.lootLockId = id
  button.dataset.lootLockTarget = request.target
  button.dataset.lootLockColor = request.color
  button.dataset.lootLockScope = request.scope
  button.setAttribute(
    "aria-label",
    `${TARGET_NAMES[request.target]} gesperrt. Einen ${KEY_ACCUSATIVE_NAMES[request.color]} verwenden.`,
  )
  button.innerHTML = `
    <svg class="loot-object-lock-graphic" viewBox="0 0 36 40" shape-rendering="crispEdges" aria-hidden="true" focusable="false">
      <rect class="loot-object-lock-shadow" x="5" y="35" width="28" height="3"/>
      <path class="loot-object-lock-shackle-outline" d="M9 18V11C9 4 14 1 18 1s9 3 9 10v7h-6v-7c0-3-1-4-3-4s-3 1-3 4v7Z"/>
      <path class="loot-object-lock-shackle" d="M12 17v-6c0-5 3-7 6-7s6 2 6 7v6h-3v-6c0-3-1-4-3-4s-3 1-3 4v6Z"/>
      <rect class="loot-object-lock-outline" x="4" y="15" width="28" height="22"/>
      <rect class="loot-object-lock-body" x="7" y="18" width="22" height="16"/>
      <rect class="loot-object-lock-light" x="7" y="18" width="14" height="4"/>
      <rect class="loot-object-lock-keyhole" x="16" y="23" width="4" height="7"/>
      <rect class="loot-object-lock-keyhole" x="14" y="23" width="8" height="4"/>
    </svg>
    <span class="loot-object-lock-label" aria-hidden="true">${LOCK_COLOR_NAMES[request.color]}</span>
    <span class="loot-object-lock-message" aria-hidden="true"></span>
  `
  button.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
    event.stopPropagation()
    attemptUnlock(slotKey)
  })
  return button
}

function saveControlState(
  decoration: Decoration,
  element: HTMLElement,
): ElementState {
  const existing = decoration.states.get(element)
  if (existing) return existing
  const state = {
    inert: element.inert,
    kind: "control" as const,
    tabIndex: element.getAttribute("tabindex"),
  }
  decoration.states.set(element, state)
  return state
}

function saveContentState(
  decoration: Decoration,
  element: HTMLElement,
): ElementState {
  const existing = decoration.states.get(element)
  if (existing) return existing
  const state = {
    ariaHidden: element.getAttribute("aria-hidden"),
    concealed: element.classList.contains("loot-object-lock-concealed"),
    inert: element.inert,
    kind: "content" as const,
  }
  decoration.states.set(element, state)
  return state
}

function setAttributeIfNeeded(
  element: HTMLElement,
  name: string,
  value: string,
): void {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value)
}

function lockControl(decoration: Decoration, element: HTMLElement): void {
  saveControlState(decoration, element)
  if (!element.inert) element.inert = true
  setAttributeIfNeeded(element, "tabindex", "-1")
}

function lockContent(decoration: Decoration, element: HTMLElement): void {
  saveContentState(decoration, element)
  if (!element.inert) element.inert = true
  setAttributeIfNeeded(element, "aria-hidden", "true")
  element.classList.add("loot-object-lock-concealed")
}

function restoreAttribute(
  element: HTMLElement,
  name: string,
  value: string | null,
): void {
  if (value === null) element.removeAttribute(name)
  else element.setAttribute(name, value)
}

function restoreState(element: HTMLElement, state: ElementState): void {
  if (element.inert) element.inert = state.inert

  if (state.kind === "content") {
    if (element.getAttribute("aria-hidden") === "true") {
      restoreAttribute(element, "aria-hidden", state.ariaHidden ?? null)
    }
    if (element.classList.contains("loot-object-lock-concealed")) {
      element.classList.toggle(
        "loot-object-lock-concealed",
        state.concealed ?? false,
      )
    }
    return
  }

  const nativelyUnavailable =
    element.hasAttribute("hidden") ||
    element.getAttribute("aria-hidden") === "true" ||
    (element instanceof HTMLButtonElement && element.disabled) ||
    element.getClientRects().length === 0
  if (
    element.getAttribute("tabindex") === "-1"
  ) {
    if (nativelyUnavailable) {
      pendingControlTabIndices.set(element, { value: state.tabIndex ?? null })
    } else {
      restoreAttribute(element, "tabindex", state.tabIndex ?? null)
      pendingControlTabIndices.delete(element)
    }
  }
}

function closeExpandedControls(binding: TargetBinding): void {
  for (const control of binding.controls) {
    if (control.getAttribute("aria-expanded") === "true") {
      control.click()
    }
  }
}

function sameElements(
  left: readonly HTMLElement[],
  right: readonly HTMLElement[],
): boolean {
  return (
    left.length === right.length &&
    left.every((element, index) => element === right[index])
  )
}

function sameBinding(left: TargetBinding, right: TargetBinding): boolean {
  return (
    left.root === right.root &&
    left.anchor === right.anchor &&
    left.mode === right.mode &&
    sameElements(left.controls, right.controls) &&
    sameElements(left.contents, right.contents)
  )
}

function setStyleIfNeeded(
  element: HTMLElement,
  property: "height" | "left" | "top" | "width",
  value: string,
): void {
  if (element.style[property] !== value) element.style[property] = value
}

function positionFloating(decoration: Decoration): void {
  if (decoration.binding.mode !== "floating") return
  const rect = decoration.binding.anchor.getBoundingClientRect()
  const view = decoration.binding.anchor.ownerDocument.defaultView ?? window
  const visible =
    decoration.binding.anchor.isConnected &&
    rect.width > 0 &&
    rect.height > 0 &&
    rect.right > 0 &&
    rect.bottom > 0 &&
    rect.left < view.innerWidth &&
    rect.top < view.innerHeight
  if (decoration.button.hidden === visible) {
    decoration.button.hidden = !visible
  }
  if (!visible) return

  setStyleIfNeeded(decoration.button, "left", `${rect.left}px`)
  setStyleIfNeeded(decoration.button, "top", `${rect.top}px`)
  setStyleIfNeeded(decoration.button, "width", `${rect.width}px`)
  setStyleIfNeeded(decoration.button, "height", `${rect.height}px`)
  decoration.button.classList.toggle(
    "loot-object-lock-button--near-top",
    rect.top < 96,
  )
}

function enforceDecoration(decoration: Decoration): void {
  for (const control of decoration.binding.controls) {
    lockControl(decoration, control)
  }
  for (const content of decoration.binding.contents) {
    lockContent(decoration, content)
  }
  positionFloating(decoration)
}

function createDecoration(
  request: LockRequest,
  binding: TargetBinding,
): Decoration {
  closeExpandedControls(binding)
  const id = requestLockId(request)
  const button = createLockButton(
    request,
    id,
    binding.slotKey,
    binding.anchor.ownerDocument,
  )
  button.classList.add(`loot-object-lock-button--${binding.mode}`)
  const decoration: Decoration = {
    binding,
    button,
    feedbackTimer: null,
    lockId: id,
    request,
    rootWasTarget: binding.root.classList.contains("loot-object-lock-target"),
    states: new Map(),
  }

  if (binding.mode === "fill") {
    binding.root.classList.add("loot-object-lock-target")
    binding.root.appendChild(button)
  } else {
    binding.anchor.ownerDocument.body.appendChild(button)
  }
  anchorResizeObserver?.observe(binding.anchor)
  enforceDecoration(decoration)
  return decoration
}

function removeDecoration(decoration: Decoration): void {
  if (decoration.feedbackTimer !== null) {
    window.clearTimeout(decoration.feedbackTimer)
  }
  for (const [element, state] of decoration.states) restoreState(element, state)
  decoration.states.clear()
  anchorResizeObserver?.unobserve(decoration.binding.anchor)
  decoration.button.remove()
  if (!decoration.rootWasTarget) {
    decoration.binding.root.classList.remove("loot-object-lock-target")
  }
}

function showFeedback(
  decoration: Decoration,
  message: string,
  kind: "missing" | "unlocking",
): void {
  if (decoration.feedbackTimer !== null) {
    window.clearTimeout(decoration.feedbackTimer)
    decoration.feedbackTimer = null
  }
  decoration.button.classList.toggle(
    "loot-object-lock-button--missing",
    kind === "missing",
  )
  decoration.button.classList.toggle(
    "loot-object-lock-button--unlocking",
    kind === "unlocking",
  )
  const messageNode = decoration.button.querySelector<HTMLElement>(
    ".loot-object-lock-message",
  )
  if (messageNode) messageNode.textContent = message
  announce(message)

  if (kind === "missing") {
    decoration.feedbackTimer = window.setTimeout(() => {
      decoration.feedbackTimer = null
      decoration.button.classList.remove("loot-object-lock-button--missing")
      if (messageNode) messageNode.textContent = ""
    }, FEEDBACK_DURATION)
  }
}

function isFocusable(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    element.isConnected &&
    !element.hasAttribute("hidden") &&
    !element.inert &&
    !(element instanceof HTMLButtonElement && element.disabled) &&
    rect.width > 0 &&
    rect.height > 0 &&
    element.getAttribute("aria-hidden") !== "true" &&
    element.tabIndex >= 0
  )
}

function focusAfterUnlock(binding: TargetBinding): void {
  for (const focusTarget of binding.focusCandidates) {
    if (!isFocusable(focusTarget)) continue
    focusTarget.focus({ preventScroll: true })
    if (focusTarget.ownerDocument.activeElement === focusTarget) return
  }

  const previousTabIndex = binding.root.getAttribute("tabindex")
  const restoreTabIndex = (): void => {
    binding.root.removeEventListener("blur", restoreTabIndex)
    restoreAttribute(binding.root, "tabindex", previousTabIndex)
  }
  binding.root.setAttribute("tabindex", "-1")
  binding.root.addEventListener("blur", restoreTabIndex, { once: true })
  binding.root.focus({ preventScroll: true })
}

function attemptUnlock(slotKey: string): void {
  const decoration = decorations.get(slotKey)
  if (!controller || !decoration || unlockingIds.has(decoration.lockId)) return

  const result = controller.unlock(
    decoration.lockId,
    decoration.request.color,
  )
  if (result === "missing-key") {
    showFeedback(
      decoration,
      `${TARGET_NAMES[decoration.request.target]} ist gesperrt. Du brauchst einen ${KEY_ACCUSATIVE_NAMES[decoration.request.color]}.`,
      "missing",
    )
    return
  }
  if (result === "invalid-lock-id") return

  unlockingIds.add(decoration.lockId)
  showFeedback(
    decoration,
    result === "unlocked"
      ? `${TARGET_NAMES[decoration.request.target]} entsperrt. Ein ${KEY_NOMINATIVE_NAMES[decoration.request.color]} wurde verwendet.`
      : `${TARGET_NAMES[decoration.request.target]} ist bereits entsperrt.`,
    "unlocking",
  )

  const unlockedId = decoration.lockId
  const binding = decoration.binding
  window.setTimeout(() => {
    unlockingIds.delete(unlockedId)
    syncAll()
    const next = decorations.get(slotKey)
    if (next) next.button.focus({ preventScroll: true })
    else focusAfterUnlock(binding)
  }, UNLOCK_DURATION)
}

function desiredDecorations(): Map<
  string,
  { binding: TargetBinding; request: LockRequest }
> {
  const grouped = new Map<
    string,
    { binding: TargetBinding; requests: LockRequest[] }
  >()

  for (const request of collectRequests()) {
    const binding = bindingFor(request)
    if (!binding) continue
    const existing = grouped.get(binding.slotKey)
    if (existing) existing.requests.push(request)
    else grouped.set(binding.slotKey, { binding, requests: [request] })
  }

  const desired = new Map<
    string,
    { binding: TargetBinding; request: LockRequest }
  >()
  if (!controller) return desired
  for (const [slotKey, group] of grouped) {
    const request = group.requests.find((candidate) => {
      const id = requestLockId(candidate)
      return !controller?.unlocked(id) || unlockingIds.has(id)
    })
    if (request) desired.set(slotKey, { binding: group.binding, request })
  }
  return desired
}

function syncAll(): void {
  if (!controller) return
  const desired = desiredDecorations()

  for (const [slotKey, decoration] of [...decorations]) {
    const next = desired.get(slotKey)
    if (
      !next ||
      requestLockId(next.request) !== decoration.lockId ||
      !sameBinding(next.binding, decoration.binding)
    ) {
      removeDecoration(decoration)
      decorations.delete(slotKey)
    }
  }

  for (const [slotKey, next] of desired) {
    const existing = decorations.get(slotKey)
    if (existing) enforceDecoration(existing)
    else decorations.set(slotKey, createDecoration(next.request, next.binding))
  }
}

function scheduleSync(): void {
  if (syncTimer !== null) return
  syncTimer = window.setTimeout(() => {
    syncTimer = null
    syncAll()
  }, 0)
}

function eventElement(target: EventTarget | null): Element | null {
  const node = target as (Node & { nodeType?: number }) | null
  if (node?.nodeType === 1) return node as unknown as Element
  if (node && typeof node.nodeType === "number") return node.parentElement
  return null
}

function blockNativeLockedClick(event: MouseEvent): void {
  const target = eventElement(event.target)
  if (!target) return
  for (const decoration of decorations.values()) {
    const protectedElements = [
      ...decoration.binding.controls,
      ...decoration.binding.contents,
    ]
    if (
      protectedElements.some(
        (element) => element === target || element.contains(target),
      )
    ) {
      event.preventDefault()
      event.stopImmediatePropagation()
      event.stopPropagation()
      return
    }
  }
}

class LootObjectLockElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-lock-id", "data-target", "data-color"]
  }

  connectedCallback(): void {
    registerHost(this)
    scheduleSync()
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return
    registerHost(this)
    scheduleSync()
  }
}

export function refreshObjectLocks(): void {
  syncAll()
}

export function installObjectLocks(nextController: ObjectLockController): void {
  controller = nextController
  discoverSourceLocks()
  statusRegion()

  if (!customElements.get(LOCK_TAG)) {
    customElements.define(LOCK_TAG, LootObjectLockElement)
  }

  if (!captureInstalled) {
    captureInstalled = true
    for (const candidate of templateDocumentCandidates(document)) {
      candidate.addEventListener("click", blockNativeLockedClick, true)
    }
  }

  if (observers.length === 0) {
    for (const candidate of templateDocumentCandidates(document)) {
      const Observer = candidate.defaultView?.MutationObserver ?? MutationObserver
      const candidateObserver = new Observer(scheduleSync)
      candidateObserver.observe(candidate.documentElement, {
        attributeFilter: [
          "aria-hidden",
          "class",
          "data-open",
          "disabled",
          "hidden",
          "style",
          "tabindex",
        ],
        attributes: true,
        childList: true,
        subtree: true,
      })
      observers.push(candidateObserver)
    }
  }

  if (!slideActivityInstalled) {
    slideActivityInstalled = true
    observeLiaSlideActivity(scheduleSync)
  }

  if (!viewportListenersInstalled) {
    viewportListenersInstalled = true
    if ("ResizeObserver" in window) {
      anchorResizeObserver = new ResizeObserver(scheduleSync)
      for (const decoration of decorations.values()) {
        anchorResizeObserver.observe(decoration.binding.anchor)
      }
    }
    const views = new Set<Window>()
    for (const candidate of templateDocumentCandidates(document)) {
      const view = candidate.defaultView
      if (view && !views.has(view)) {
        views.add(view)
        view.addEventListener("resize", scheduleSync, { passive: true })
        view.addEventListener("scroll", scheduleSync, {
          capture: true,
          passive: true,
        })
        view.visualViewport?.addEventListener("resize", scheduleSync, {
          passive: true,
        })
        view.visualViewport?.addEventListener("scroll", scheduleSync, {
          passive: true,
        })
      }
      candidate.addEventListener("load", scheduleSync, true)
      void candidate.fonts?.ready.then(scheduleSync)
    }
  }

  refreshObjectLocks()
}
