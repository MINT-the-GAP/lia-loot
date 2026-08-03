import {
  hostIsRevealBlocked,
  REVEAL_CHANGED_EVENT,
} from "./exploration.ts"
import type { LockTarget } from "./lock-targets.ts"
import {
  compareLootIfNumbers,
  MARKER_COLORS,
  parseLootIfOptions,
  type LootIfCondition,
  type MarkerColor,
} from "./loot-if-options.ts"
import { LootIfStore } from "./loot-if-store.ts"
import { isScoreableQuiz } from "./quiz-events.ts"
import { setRangeGate } from "./range-gate.ts"
import {
  activeLiaSection,
  observeLiaSlideActivity,
} from "./slide-activity.ts"
import type { ResourceCounts, ResourceState } from "./types.ts"

const START_TAG = "lia-loot-if-start"
const END_LINK_SELECTOR = 'a[href="#lia-loot-if-end"]'
const RANGE_BLOCKED_ATTRIBUTE = "data-loot-if-range-blocked"
const SPAWNED_ATTRIBUTE = "data-loot-if-spawned"
const MARKER_REGISTRY_KEY = "__LIA_TEXTMARKER_REG_V4__"

export const LOOT_IF_CHANGED_EVENT = "lia-loot:loot-if-changed"

export interface LootIfController {
  chestCounts(): ResourceCounts
  magnifierFound(): boolean
  resourceState(): ResourceState | null
  unlockedLockIds(): readonly string[]
}

interface LootIfBinding {
  condition: LootIfCondition | null
  end: HTMLElement | null
  errors: string[]
  id: string
  scope: HTMLElement
  start: HTMLElement
  valid: boolean
}

interface LootIfRuntimeIdentity {
  errors: string[]
  id: string
  valid: boolean
}

interface MarkerAnchor {
  ep: string
  eo: number
  sp: string
  so: number
}

interface MarkerItem {
  anchor?: MarkerAnchor
  color?: unknown
  id?: unknown
  kind?: unknown
}

interface MarkerInstance {
  HL?: MarkerItem[]
}

interface MarkerRegistry {
  instances?: Record<string, MarkerInstance>
}

let controller: LootIfController | null = null
let store: LootIfStore | null = null
let bindings: LootIfBinding[] = []
let observer: MutationObserver | null = null
let syncQueued = false
let runtimeId = 0
let slideObserverInstalled = false
let revealListenerInstalled = false
const gatedElements = new Set<HTMLElement>()
const invalidRuntimeIds = new WeakMap<HTMLElement, string>()
const warnedSpecifications = new Set<string>()

export function lootIfAuthoredRuntimeId(
  value: string | null | undefined,
): string | null {
  const authored = value?.trim() ?? ""
  return authored && !authored.startsWith("@") ? authored : null
}

function resolveRuntimeIdentity(start: HTMLElement): LootIfRuntimeIdentity {
  const authored = lootIfAuthoredRuntimeId(
    start.getAttribute("data-loot-if-id"),
  )
  if (authored) return { errors: [], id: authored, valid: true }

  const error =
    "Die data-loot-if-id fehlt oder enthaelt einen nicht expandierten Makro-Platzhalter."
  const existing = invalidRuntimeIds.get(start)
  if (existing) return { errors: [error], id: existing, valid: false }

  runtimeId += 1
  const id = `loot-if:invalid-runtime-${runtimeId}`
  invalidRuntimeIds.set(start, id)
  return { errors: [error], id, valid: false }
}

function markerBoundary(marker: HTMLElement): ChildNode {
  let boundary: ChildNode = marker
  while (boundary.parentElement) {
    const parent = boundary.parentElement
    const emptyWrapper = parent.tagName === "DIV" && parent.attributes.length === 0
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

function markerScope(marker: HTMLElement): HTMLElement {
  return (
    marker.closest<HTMLElement>(
      "[data-loot-reveal-payload], [data-loot-reveal-layer-content], main.lia-slide__content, main",
    ) ?? document.body
  )
}

function warnInvalid(binding: LootIfBinding): void {
  if (warnedSpecifications.has(binding.id)) return
  warnedSpecifications.add(binding.id)
  console.warn(
    `Loot: @lootif ${binding.id} bleibt wegen ungültiger Optionen verborgen. ${binding.errors.join(" ")}`,
  )
}

function materializeBindings(): void {
  const markersByScope = new Map<HTMLElement, HTMLElement[]>()
  document
    .querySelectorAll<HTMLElement>(`${START_TAG}, ${END_LINK_SELECTOR}`)
    .forEach((marker) => {
      const scope = markerScope(marker)
      const markers = markersByScope.get(scope) ?? []
      markers.push(marker)
      markersByScope.set(scope, markers)
    })

  const next: LootIfBinding[] = []
  for (const [scope, markers] of markersByScope) {
    const starts: HTMLElement[] = []
    for (const marker of markers) {
      if (marker.matches(START_TAG)) {
        starts.push(marker)
        continue
      }
      const start = starts.pop()
      if (!start) continue
      const parsed = parseLootIfOptions(start.getAttribute("data-options"))
      const runtime = resolveRuntimeIdentity(start)
      const binding: LootIfBinding = {
        condition: parsed.condition,
        end: marker,
        errors: [...parsed.errors, ...runtime.errors],
        id: runtime.id,
        scope,
        start,
        valid: parsed.valid && runtime.valid,
      }
      if (!binding.valid) warnInvalid(binding)
      next.push(binding)
    }
    for (const start of starts) {
      const parsed = parseLootIfOptions(start.getAttribute("data-options"))
      const runtime = resolveRuntimeIdentity(start)
      const binding: LootIfBinding = {
        condition: parsed.condition,
        end: null,
        errors: [
          ...parsed.errors,
          ...runtime.errors,
          "Das zugehörige @Endelootif fehlt.",
        ],
        id: runtime.id,
        scope,
        start,
        valid: false,
      }
      warnInvalid(binding)
      next.push(binding)
    }
  }
  bindings = next
}

function rangeUnits(binding: LootIfBinding): HTMLElement[] {
  const startBoundary = markerBoundary(binding.start)
  const endBoundary = binding.end ? markerBoundary(binding.end) : null
  if (
    !startBoundary.isConnected ||
    (endBoundary !== null && !endBoundary.isConnected) ||
    !binding.scope.isConnected
  ) {
    return []
  }

  const range = binding.scope.ownerDocument.createRange()
  try {
    range.setStartAfter(startBoundary)
    if (endBoundary) range.setEndBefore(endBoundary)
    else range.setEnd(binding.scope, binding.scope.childNodes.length)
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
  collect(binding.scope)
  return units
}

function syncRangeGates(): boolean {
  const next = new Set<HTMLElement>()
  for (const binding of bindings) {
    const safelySpawned =
      binding.valid && binding.end !== null && store?.isSpawned(binding.id)
    if (!safelySpawned) {
      rangeUnits(binding).forEach((unit) => next.add(unit))
    }
  }

  let changed = false
  for (const element of gatedElements) {
    if (next.has(element)) continue
    if (setRangeGate(element, "loot-if", RANGE_BLOCKED_ATTRIBUTE, false)) {
      changed = true
    }
  }
  for (const element of next) {
    if (setRangeGate(element, "loot-if", RANGE_BLOCKED_ATTRIBUTE, true)) {
      changed = true
    }
  }
  gatedElements.clear()
  next.forEach((element) => gatedElements.add(element))

  for (const binding of bindings) {
    const spawned = Boolean(
      binding.valid && binding.end !== null && store?.isSpawned(binding.id),
    )
    if (spawned) binding.start.setAttribute(SPAWNED_ATTRIBUTE, "true")
    else binding.start.removeAttribute(SPAWNED_ATTRIBUTE)
  }
  return changed
}

function slideFor(element: Element): HTMLElement | null {
  return element.closest<HTMLElement>("main.lia-slide__content, main")
}

function slideSection(slide: HTMLElement | null): number | null {
  if (!slide) return null
  const parent = slide.parentElement
  if (parent) {
    const slides = [...parent.children].filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.tagName === "MAIN",
    )
    const index = slides.indexOf(slide)
    if (index >= 0) {
      const active = activeLiaSection()
      return slides.length === 1 && active !== null ? active : index
    }
  }
  return !slide.hidden ? activeLiaSection() : null
}

function scoreableQuizzes(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(".lia-quiz")].filter(
    isScoreableQuiz,
  )
}

function normalizedQuizIdentityPart(value: string | null | undefined): string | null {
  const normalized = value?.trim().replace(/\s+/gu, " ") ?? ""
  return normalized && !normalized.startsWith("@") ? normalized : null
}

function authoredQuizIdentity(quiz: Element): string | null {
  return (
    ["data-quiz-id", "data-uid", "data-id", "id"]
      .map((attribute) => normalizedQuizIdentityPart(quiz.getAttribute(attribute)))
      .find((value): value is string => value !== null) ?? null
  )
}

export interface LootIfQuizInputTrack {
  input: number
  section: number
}

const LIA_QUIZ_INPUT_TRACK =
  /\[\s*["']quiz["']\s*,\s*(\d+)\s*\]\s*,\s*\[\s*["']input["']\s*,\s*(\d+)\s*\]/u

export function lootIfQuizInputTrack(
  quiz: Element,
): LootIfQuizInputTrack | null {
  const host = quiz.parentElement
  if (
    !host ||
    host.tagName === "MAIN" ||
    host.querySelectorAll(".lia-quiz").length !== 1
  ) {
    return null
  }

  const tracks = new Map<string, LootIfQuizInputTrack>()
  host
    .querySelectorAll<HTMLElement>("[oninput], [onchange], [onclick]")
    .forEach((element) => {
      for (const attribute of ["oninput", "onchange", "onclick"]) {
        const match = LIA_QUIZ_INPUT_TRACK.exec(
          element.getAttribute(attribute) ?? "",
        )
        if (!match) continue
        const track = {
          section: Number.parseInt(match[1], 10),
          input: Number.parseInt(match[2], 10),
        }
        tracks.set(`${track.section}:${track.input}`, track)
      }
    })
  return tracks.size === 1 ? [...tracks.values()][0] : null
}

/**
 * LiaScript connects a rendered quiz to its source prompt through the
 * `aria-labelledby` value on `.lia-quiz__answers`. That source-derived value
 * survives renderer remounts, unlike a DOM ordinal.
 */
export function lootIfQuizRendererAnchor(quiz: Element): string | null {
  const anchors = new Set<string>()
  quiz
    .querySelectorAll<HTMLElement>(".lia-quiz__answers[aria-labelledby]")
    .forEach((answers) => {
      const value = normalizedQuizIdentityPart(
        answers.getAttribute("aria-labelledby"),
      )
      if (
        value &&
        value.split(" ").every((token) => !token.startsWith("@"))
      ) {
        anchors.add(value)
      }
    })
  return anchors.size === 1 ? [...anchors][0] : null
}

function stableQuizBaseId(
  quiz: Element,
  section: number | null,
): string | null {
  const authored = authoredQuizIdentity(quiz)
  const prefix = section !== null ? `section-${section}` : "document"
  if (authored) {
    return `${prefix}:authored-${encodeURIComponent(authored)}`
  }

  const inputTrack = lootIfQuizInputTrack(quiz)
  if (inputTrack) {
    return `section-${inputTrack.section}:lia-input-${inputTrack.input}`
  }

  const rendererAnchor = lootIfQuizRendererAnchor(quiz)
  return rendererAnchor
    ? `${prefix}:lia-label-${encodeURIComponent(rendererAnchor)}`
    : null
}

export function lootIfQuizId(quiz: Element): string | null {
  if (!(quiz instanceof HTMLElement) || !isScoreableQuiz(quiz)) return null
  const slide = slideFor(quiz)
  const section = slideSection(slide)
  const root: ParentNode = slide ?? document
  if (!scoreableQuizzes(root).includes(quiz)) return null
  const id = stableQuizBaseId(quiz, section)
  if (!id) {
    delete quiz.dataset.lootIfQuizId
    return null
  }

  const ambiguous = scoreableQuizzes(document).some((candidate) => {
    if (candidate === quiz) return false
    return (
      stableQuizBaseId(candidate, slideSection(slideFor(candidate))) === id
    )
  })
  if (ambiguous) {
    delete quiz.dataset.lootIfQuizId
    return null
  }

  quiz.dataset.lootIfQuizId = id
  return id
}

function quizSolved(quiz: HTMLElement): boolean {
  const id = lootIfQuizId(quiz)
  return (
    quiz.classList.contains("solved") ||
    (id !== null && Boolean(store?.isQuizSolved(id)))
  )
}

function recordRenderedSolvedQuizzes(): boolean {
  if (!store) return false
  let changed = false
  for (const quiz of scoreableQuizzes(document)) {
    if (!quiz.classList.contains("solved")) continue
    const id = lootIfQuizId(quiz)
    if (id && store.recordSolvedQuiz(id)) changed = true
  }
  return changed
}

function previousQuiz(binding: LootIfBinding): HTMLElement | null {
  const previous = scoreableQuizzes(document).filter((quiz) =>
    Boolean(
      quiz.compareDocumentPosition(binding.start) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ),
  )
  return previous[previous.length - 1] ?? null
}

function elementBlocksQuizCheck(element: HTMLElement): boolean {
  const disableable = element as HTMLElement & { disabled?: boolean }
  return (
    disableable.disabled === true ||
    element.hasAttribute("disabled") ||
    element.inert ||
    element.hidden ||
    element.getAttribute("aria-hidden")?.trim().toLowerCase() === "true"
  )
}

export function lootIfQuizCheckIsReachable(
  check: HTMLElement,
  solved = false,
): boolean {
  let ancestor = check.parentElement
  while (ancestor) {
    if (elementBlocksQuizCheck(ancestor)) return false
    ancestor = ancestor.parentElement
  }

  if (check.hidden || check.inert) return false
  const checkUnavailable =
    (check as HTMLElement & { disabled?: boolean }).disabled === true ||
    check.hasAttribute("disabled") ||
    check.getAttribute("aria-hidden")?.trim().toLowerCase() === "true"
  return !checkUnavailable || solved
}

function quizIsReachable(quiz: HTMLElement): boolean {
  const check = quiz.querySelector<HTMLElement>(".lia-quiz__check")
  return (
    Boolean(check) &&
    lootIfQuizCheckIsReachable(check!, quizSolved(quiz)) &&
    quiz.closest(
      `[${RANGE_BLOCKED_ATTRIBUTE}], [data-loot-reveal-range-blocked]`,
    ) === null && !hostIsRevealBlocked(quiz, false)
  )
}

function currentSlideQuizzesSolved(binding: LootIfBinding): boolean {
  const active = activeLiaSection()
  const slide = slideFor(binding.start)
  const section = slideSection(slide)
  if (active !== null && section !== null && active !== section) return false
  const activeSlide =
    document.querySelector<HTMLElement>(
      ".lia-slide__container > main.lia-slide__content:not([hidden])",
    ) ?? slide
  if (!activeSlide || (slide && activeSlide !== slide)) return false
  const quizzes = scoreableQuizzes(activeSlide).filter(quizIsReachable)
  return quizzes.length > 0 && quizzes.every(quizSolved)
}

function lockTargetOpened(target: LockTarget): boolean {
  return Boolean(
    store?.hasOpenedLockTarget(target) ||
      controller?.unlockedLockIds().some((id) =>
      id
        .split(":")
        .map((part) => part.trim())
        .includes(target),
      ),
  )
}

function conditionMet(
  binding: LootIfBinding,
  condition: LootIfCondition,
): boolean {
  if (!controller || !store) return false
  if (condition.kind === "previous-quiz") {
    const quiz = previousQuiz(binding)
    return quiz !== null && quizSolved(quiz)
  }
  if (condition.kind === "current-slide-quizzes") {
    return currentSlideQuizzesSolved(binding)
  }
  if (condition.kind === "solved-quizzes") {
    return compareLootIfNumbers(
      store.state().solvedQuizzes.length,
      condition.comparator,
      condition.value,
    )
  }
  if (condition.kind === "resource") {
    const resources = controller.resourceState()
    const amount = resources?.[condition.resource]
    return (
      amount !== null &&
      amount !== undefined &&
      compareLootIfNumbers(amount, condition.comparator, condition.value)
    )
  }
  if (condition.kind === "opened-chests") {
    return compareLootIfNumbers(
      controller.chestCounts()[condition.reward],
      condition.comparator,
      condition.value,
    )
  }
  if (condition.kind === "lock-opened") {
    return lockTargetOpened(condition.target)
  }
  if (condition.kind === "secret-slide-visited") {
    return store.state().secretSlideVisited
  }
  if (condition.kind === "magnifier-found") {
    return controller.magnifierFound()
  }
  return store.hasHighlight(condition.color, condition.word)
}

function startIsReachable(binding: LootIfBinding): boolean {
  return (
    binding.start.closest(
      `[${RANGE_BLOCKED_ATTRIBUTE}], [data-loot-reveal-range-blocked]`,
    ) === null && !hostIsRevealBlocked(binding.start, false)
  )
}

function markerWindowCandidates(): Window[] {
  const candidates: Window[] = [window]
  for (const read of [() => window.parent, () => window.top]) {
    try {
      const candidate = read()
      if (candidate && !candidates.includes(candidate)) candidates.push(candidate)
    } catch {
      // Cross-origin parent windows are intentionally ignored.
    }
  }
  return candidates
}

function nodeAtPath(path: string, ownerDocument: Document): Node | null {
  if (!path) return null
  const indices = path
    .split("/")
    .filter(Boolean)
    .map((part) => Number.parseInt(part, 10))
  if (indices.some((index) => !Number.isInteger(index) || index < 0)) {
    return null
  }
  let node: Node | null = ownerDocument.body
  for (const index of indices) {
    if (!node || index >= node.childNodes.length) return null
    node = node.childNodes[index]
  }
  return node
}

function clampedOffset(node: Node, value: number): number {
  const maximum =
    node.nodeType === Node.TEXT_NODE
      ? (node.nodeValue ?? "").length
      : node.childNodes.length
  return Math.max(0, Math.min(Number.isFinite(value) ? value : 0, maximum))
}

function textFromMarkerAnchor(anchor: MarkerAnchor): string | null {
  const start = nodeAtPath(anchor.sp, document)
  const end = nodeAtPath(anchor.ep, document)
  if (!start || !end) return null
  const range = document.createRange()
  try {
    range.setStart(start, clampedOffset(start, anchor.so))
    range.setEnd(end, clampedOffset(end, anchor.eo))
  } catch {
    return null
  }
  const value = range.toString().trim()
  return value || null
}

function markerRegistries(): MarkerRegistry[] {
  const registries: MarkerRegistry[] = []
  for (const candidate of markerWindowCandidates()) {
    try {
      const registry = (candidate as unknown as Record<string, unknown>)[
        MARKER_REGISTRY_KEY
      ] as MarkerRegistry | undefined
      if (registry && !registries.includes(registry)) registries.push(registry)
    } catch {
      // Cross-origin window properties are intentionally ignored.
    }
  }
  return registries
}

function recordMarkerHighlights(): boolean {
  if (!store) return false
  let changed = false
  for (const rectangle of document.querySelectorAll<HTMLElement>(
    ".lia-hl-rect[data-kind='user'][data-hl]",
  )) {
    const color = rectangle.getAttribute("data-hl") as MarkerColor | null
    if (color && MARKER_COLORS.includes(color) && store.recordHighlightColor(color)) {
      changed = true
    }
  }

  for (const registry of markerRegistries()) {
    for (const instance of Object.values(registry.instances ?? {})) {
      for (const item of instance.HL ?? []) {
        if (item.kind !== "user" || !item.anchor) continue
        const color = item.color as MarkerColor
        if (!MARKER_COLORS.includes(color)) continue
        const text = textFromMarkerAnchor(item.anchor)
        if (text && store.recordHighlight(color, text)) changed = true
      }
    }
  }
  return changed
}

function announceChange(): void {
  document.dispatchEvent(new CustomEvent(LOOT_IF_CHANGED_EVENT))
  document.dispatchEvent(new CustomEvent(REVEAL_CHANGED_EVENT))
}

function syncAll(): void {
  if (!controller || !store) return
  materializeBindings()
  let changed = syncRangeGates()
  if (recordRenderedSolvedQuizzes()) changed = true
  if (recordMarkerHighlights()) changed = true

  let spawned = false
  for (const binding of bindings) {
    if (
      store.isSpawned(binding.id) ||
      !binding.valid ||
      !binding.end ||
      !binding.condition ||
      !startIsReachable(binding)
    ) {
      continue
    }
    if (conditionMet(binding, binding.condition) && store.spawn(binding.id)) {
      spawned = true
    }
  }
  if (spawned && syncRangeGates()) changed = true
  if (changed || spawned) announceChange()
  if (spawned) scheduleSync()
}

export function refreshLootIf(): void {
  scheduleSync()
}

export function recordLootIfQuizSolved(quiz: Element): void {
  if (!store) return
  const id = lootIfQuizId(quiz)
  if (id) store.recordSolvedQuiz(id)
  scheduleSync()
}

export function recordLootIfSecretSlideVisited(): void {
  store?.recordSecretSlideVisit()
  scheduleSync()
}

function scheduleSync(): void {
  if (syncQueued) return
  syncQueued = true
  queueMicrotask(() => {
    syncQueued = false
    syncAll()
  })
}

function nodeContainsMarker(node: Node): boolean {
  if (!(node instanceof Element)) return false
  return (
    node.matches(`${START_TAG}, ${END_LINK_SELECTOR}, #lia-hl-overlay`) ||
    node.querySelector(`${START_TAG}, ${END_LINK_SELECTOR}, #lia-hl-overlay`) !==
      null
  )
}

function installObserver(): void {
  if (observer || !document.documentElement) return
  observer = new MutationObserver((records) => {
    if (
      records.some(
        (record) =>
          record.type === "attributes" ||
          record.type === "childList" ||
          [...record.addedNodes, ...record.removedNodes].some(
            nodeContainsMarker,
          ) ||
          (record.target instanceof Element &&
            Boolean(
              record.target.closest(
                `${START_TAG}, .lia-quiz, #lia-hl-overlay, [data-loot-reveal-layer-content]`,
              ),
            )),
      )
    ) {
      scheduleSync()
    }
  })
  observer.observe(document.documentElement, {
    attributeFilter: [
      "aria-hidden",
      "class",
      "data-loot-if-id",
      "data-options",
      "disabled",
      "hidden",
      "href",
      "inert",
    ],
    attributes: true,
    childList: true,
    subtree: true,
  })
}

class LootIfStartElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-loot-if-id", "data-options"]
  }

  connectedCallback(): void {
    scheduleSync()
  }

  attributeChangedCallback(): void {
    if (this.isConnected) scheduleSync()
  }
}

export function installLootIf(
  nextController: LootIfController,
  nextStore: LootIfStore,
): void {
  controller = nextController
  store = nextStore
  if (!customElements.get(START_TAG)) {
    customElements.define(START_TAG, LootIfStartElement)
  }
  installObserver()
  if (!slideObserverInstalled) {
    slideObserverInstalled = true
    observeLiaSlideActivity(scheduleSync)
  }
  if (!revealListenerInstalled) {
    revealListenerInstalled = true
    document.addEventListener(REVEAL_CHANGED_EVENT, scheduleSync)
  }
  // Gate authored ranges before chest/key/tool custom elements are installed;
  // otherwise an externally placed item could escape for one microtask.
  syncAll()
}
