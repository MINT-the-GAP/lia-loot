import {
  annotationToggleIsHidden,
  templateDocumentCandidates,
} from "./template-targets.ts"

export const MAX_COLLECTIBLE_DELAY_MS = 2_147_483_647

export const COLLECTIBLE_THEMES = [
  "red",
  "yellow",
  "turquoise",
  "blue",
] as const
export const COLLECTIBLE_VARIANTS = ["dark", "light"] as const

export type CollectibleTheme = (typeof COLLECTIBLE_THEMES)[number]
export type CollectibleVariant = (typeof COLLECTIBLE_VARIANTS)[number]

export interface CollectibleEnvironment {
  annotationsVisible: boolean
  theme: CollectibleTheme | null
  variant: CollectibleVariant | null
}

export interface CollectibleVisibilityRule {
  delayMs: number
  onlyOnSlide: boolean
  onlyWithoutAnnotations?: boolean
  themes?: readonly CollectibleTheme[]
  variants?: readonly CollectibleVariant[]
}

export interface ParsedCollectibleOptions {
  errors: string[]
  hasOptions: boolean
  rule: CollectibleVisibilityRule
  valid: boolean
  values: string[]
}

export interface CollectibleRevealState {
  signature: string
  startedAt: number
}

export interface CollectibleRevealDecision {
  state: CollectibleRevealState | null
  visible: boolean
  wakeAt: number | null
}

const ONLY_ON_SLIDE_TOKENS = new Set([
  "anker",
  "nur auf folie",
  "nur-auf-folie",
  "folie",
  "only on slide",
  "only-on-slide",
  "slide only",
  "slide-only",
])

const DARK_MODE_TOKENS = new Set([
  "dark mode",
  "dark-mode",
  "darkmode",
  "dunkelmodus",
])
const LIGHT_MODE_TOKENS = new Set([
  "hellmodus",
  "light mode",
  "light-mode",
  "lightmode",
])
const WITHOUT_ANNOTATIONS_TOKENS = new Set([
  "annotation-aus",
  "annotation-hidden",
  "annotations-aus",
  "annotations-hidden",
  "ohne annotation",
  "ohne annotationen",
  "ohne-annotation",
  "ohne-annotationen",
  "without annotations",
  "without-annotations",
])
const THEME_OPTION = /^(?:farbtheme|theme)[\s:=_-]+(.+)$/u
const VARIANT_OPTION = /^(?:farbmodus|variant)[\s:=_-]+(.+)$/u
const ANNOTATION_OPTION = /^(?:annotation|annotationen)[\s:=_-]+(.+)$/u
const THEME_ALIASES: Readonly<Record<string, CollectibleTheme>> = {
  blau: "blue",
  blue: "blue",
  default: "turquoise",
  gelb: "yellow",
  red: "red",
  rot: "red",
  standard: "turquoise",
  tuerkis: "turquoise",
  turkis: "turquoise",
  turquoise: "turquoise",
  "türkis": "turquoise",
  yellow: "yellow",
}
const VARIANT_ALIASES: Readonly<Record<string, CollectibleVariant>> = {
  dark: "dark",
  dunkel: "dark",
  hell: "light",
  light: "light",
}
const ANNOTATIONS_OFF_VALUES = new Set([
  "aus",
  "false",
  "hidden",
  "off",
  "versteckt",
])

const DURATION_TOKEN =
  /^(?:(?:erst\s+)?nach\s+|nach\s*=\s*)?(\d+(?:[.,]\d+)?)\s*(s|sek|sekunde|sekunden|m|min|minute|minuten)$/u
const OPTION_LIKE_TOKEN =
  /^(?:ank\p{L}*|nur(?:\s+|-)|only(?:\s+|-)|slide(?:\s+|-)?only|(?:erst\s+)?nach(?:\s|=|$)|\d+(?:[.,]\d+)?\s*\p{L}|(?:farbtheme|theme|farbmodus|variant|annotationen?)(?:\s|:|=|_|-)|dark\p{L}*|light\p{L}*|dunkel\p{L}*|hell\p{L}*|ohne(?:\s+|-)annotation|annotations?(?:\s+|-)aus|without(?:\s+|-)annotations?)|(?:\bfoli\p{L}*\b|\bslides?\b|\bsek\p{L}*\b|\bmin(?:ute|uten)?\b)/u

const DEFAULT_ENVIRONMENT: CollectibleEnvironment = {
  annotationsVisible: false,
  theme: "turquoise",
  variant: "light",
}

const environmentListeners = new Set<() => void>()
const environmentObservers = new Map<Document, MutationObserver[]>()
let observedEnvironmentDocument: Document | null = null
let observedEnvironmentSignature: string | null = null
let environmentCheckQueued = false

function normalizeToken(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("de-DE")
}

function parsedTheme(
  normalizedToken: string,
): { matched: boolean; theme: CollectibleTheme | null } {
  const match = THEME_OPTION.exec(normalizedToken)
  if (!match) return { matched: false, theme: null }
  return {
    matched: true,
    theme: THEME_ALIASES[match[1].trim()] ?? null,
  }
}

function parsedVariant(
  normalizedToken: string,
): { matched: boolean; variant: CollectibleVariant | null } {
  const match = VARIANT_OPTION.exec(normalizedToken)
  if (!match) return { matched: false, variant: null }
  return {
    matched: true,
    variant: VARIANT_ALIASES[match[1].trim()] ?? null,
  }
}

function parsedAnnotationCondition(
  normalizedToken: string,
): { matched: boolean; annotationsOff: boolean } {
  const match = ANNOTATION_OPTION.exec(normalizedToken)
  if (!match) return { matched: false, annotationsOff: false }
  return {
    matched: true,
    annotationsOff: ANNOTATIONS_OFF_VALUES.has(match[1].trim()),
  }
}

export function isOnlyOnSlideOption(value: string): boolean {
  return ONLY_ON_SLIDE_TOKENS.has(normalizeToken(value))
}

function durationMilliseconds(
  normalizedToken: string,
): { matched: boolean; value: number | null } {
  const match = DURATION_TOKEN.exec(normalizedToken)
  if (!match) return { matched: false, value: null }

  const amount = Number(match[1].replace(",", "."))
  const seconds = ["s", "sek", "sekunde", "sekunden"].includes(match[2])
  const value = amount * (seconds ? 1000 : 60_000)
  return {
    matched: true,
    value:
      Number.isFinite(value) &&
      value >= 0 &&
      value <= MAX_COLLECTIBLE_DELAY_MS
        ? value
        : null,
  }
}

export function parseCollectibleOptions(
  rawSpecification: string,
): ParsedCollectibleOptions {
  const values: string[] = []
  const errors: string[] = []
  let delayMs = 0
  let delaySeen = false
  let hasOptions = false
  let onlyOnSlide = false
  let onlyWithoutAnnotations = false
  const themes = new Set<CollectibleTheme>()
  const variants = new Set<CollectibleVariant>()

  for (const rawToken of rawSpecification.split(";")) {
    const token = rawToken.trim()
    if (!token) continue
    const normalized = normalizeToken(token)

    if (ONLY_ON_SLIDE_TOKENS.has(normalized)) {
      onlyOnSlide = true
      hasOptions = true
      continue
    }

    const theme = parsedTheme(normalized)
    if (theme.matched) {
      hasOptions = true
      if (theme.theme) themes.add(theme.theme)
      else errors.push(`Unbekanntes Theme: ${token}`)
      continue
    }

    const variant = parsedVariant(normalized)
    if (variant.matched) {
      hasOptions = true
      if (variant.variant) variants.add(variant.variant)
      else errors.push(`Unbekannter Farbmodus: ${token}`)
      continue
    }

    const annotationCondition = parsedAnnotationCondition(normalized)
    if (annotationCondition.matched) {
      hasOptions = true
      if (annotationCondition.annotationsOff) onlyWithoutAnnotations = true
      else errors.push(`Unbekannte Annotationsbedingung: ${token}`)
      continue
    }

    if (DARK_MODE_TOKENS.has(normalized)) {
      variants.add("dark")
      hasOptions = true
      continue
    }

    if (LIGHT_MODE_TOKENS.has(normalized)) {
      variants.add("light")
      hasOptions = true
      continue
    }

    if (WITHOUT_ANNOTATIONS_TOKENS.has(normalized)) {
      onlyWithoutAnnotations = true
      hasOptions = true
      continue
    }

    const duration = durationMilliseconds(normalized)
    if (duration.matched) {
      hasOptions = true
      if (duration.value === null) {
        errors.push(`Ungültige Verzögerung: ${token}`)
      } else if (delaySeen) {
        errors.push("Die Verzögerung darf nur einmal angegeben werden.")
      } else {
        delayMs = duration.value
        delaySeen = true
      }
      continue
    }

    if (OPTION_LIKE_TOKEN.test(normalized)) {
      hasOptions = true
      errors.push(`Unbekannte Sichtbarkeitsoption: ${token}`)
      continue
    }

    values.push(token)
  }

  return {
    errors,
    hasOptions,
    rule: {
      delayMs,
      onlyOnSlide,
      onlyWithoutAnnotations,
      themes: COLLECTIBLE_THEMES.filter((theme) => themes.has(theme)),
      variants: COLLECTIBLE_VARIANTS.filter((variant) =>
        variants.has(variant),
      ),
    },
    valid: errors.length === 0,
    values,
  }
}

function configuredThemes(
  rule: CollectibleVisibilityRule,
): CollectibleTheme[] {
  return COLLECTIBLE_THEMES.filter((theme) => rule.themes?.includes(theme))
}

function configuredVariants(
  rule: CollectibleVisibilityRule,
): CollectibleVariant[] {
  return COLLECTIBLE_VARIANTS.filter((variant) =>
    rule.variants?.includes(variant),
  )
}

export function collectibleRuleUsesEnvironment(
  rule: CollectibleVisibilityRule,
): boolean {
  return (
    configuredThemes(rule).length > 0 ||
    configuredVariants(rule).length > 0 ||
    rule.onlyWithoutAnnotations === true
  )
}

export function collectibleEnvironmentMatches(
  rule: CollectibleVisibilityRule,
  environment: CollectibleEnvironment,
): boolean {
  const themes = configuredThemes(rule)
  const variants = configuredVariants(rule)
  return (
    (themes.length === 0 ||
      (environment.theme !== null && themes.includes(environment.theme))) &&
    (variants.length === 0 ||
      (environment.variant !== null &&
        variants.includes(environment.variant))) &&
    (!rule.onlyWithoutAnnotations || !environment.annotationsVisible)
  )
}

function environmentDocuments(documentRoot: Document): Document[] {
  try {
    return templateDocumentCandidates(documentRoot)
  } catch {
    return [documentRoot]
  }
}

interface LiaSettingsLike {
  data?: {
    light?: unknown
    theme?: unknown
  }
  light?: unknown
  theme?: unknown
}

interface LiaRuntimeWindow extends Window {
  LIA?: {
    settings?: LiaSettingsLike
  }
  __LIA_ANNOTATION__?: {
    getStore?: () => {
      ui?: {
        visible?: unknown
      }
    } | null
  }
}

interface PartialEnvironmentSnapshot {
  theme: CollectibleTheme | null | undefined
  variant: CollectibleVariant | null | undefined
}

function runtimeTheme(value: unknown): CollectibleTheme | null | undefined {
  if (typeof value !== "string") return undefined
  const normalized = normalizeToken(value)
  if (["default", "standard", "tuerkis", "turkis", "turquoise", "türkis"].includes(normalized)) {
    return "turquoise"
  }
  if (COLLECTIBLE_THEMES.includes(normalized as CollectibleTheme)) {
    return normalized as CollectibleTheme
  }
  return null
}

function themeFromRoot(root: HTMLElement): CollectibleTheme | null | undefined {
  const themeClasses = [...root.classList].filter((name) =>
    name.startsWith("lia-theme-"),
  )
  if (themeClasses.length === 0) return undefined
  if (themeClasses.length > 1) return null
  return runtimeTheme(themeClasses[0].slice("lia-theme-".length))
}

function variantFromRoot(
  root: HTMLElement,
): CollectibleVariant | null | undefined {
  const dark = root.classList.contains("lia-variant-dark")
  const light = root.classList.contains("lia-variant-light")
  if (dark && light) return null
  if (dark) return "dark"
  if (light) return "light"
  return undefined
}

function environmentFromSettings(
  documentRoot: Document,
): PartialEnvironmentSnapshot {
  try {
    const runtime = documentRoot.defaultView as LiaRuntimeWindow | null
    const settings = runtime?.LIA?.settings
    if (!settings) return { theme: undefined, variant: undefined }
    const theme = runtimeTheme(settings.theme ?? settings.data?.theme)
    const light = settings.light ?? settings.data?.light
    return {
      theme,
      variant:
        typeof light === "boolean" ? (light ? "light" : "dark") : undefined,
    }
  } catch {
    return { theme: undefined, variant: undefined }
  }
}

function documentEnvironment(
  documentRoot: Document,
): { theme: CollectibleTheme | null; variant: CollectibleVariant | null } | null {
  const root = documentRoot.documentElement
  if (!root) return null
  const settings = environmentFromSettings(documentRoot)
  const rootTheme = themeFromRoot(root)
  const rootVariant = variantFromRoot(root)
  const theme = rootTheme === undefined ? settings.theme : rootTheme
  const variant = rootVariant === undefined ? settings.variant : rootVariant
  if (theme === undefined || variant === undefined) return null
  return { theme, variant }
}

function annotationApiState(
  documentRoot: Document,
): boolean | undefined {
  try {
    const runtime = documentRoot.defaultView as LiaRuntimeWindow | null
    const visible = runtime?.__LIA_ANNOTATION__?.getStore?.()?.ui?.visible
    return typeof visible === "boolean" ? visible : undefined
  } catch {
    return undefined
  }
}

function hasAnnotationIntegration(documentRoot: Document): boolean {
  try {
    const runtime = documentRoot.defaultView as LiaRuntimeWindow | null
    return runtime?.__LIA_ANNOTATION__ != null
  } catch {
    return false
  }
}

function annotationDomState(documentRoot: Document): boolean | undefined {
  try {
    const toolbars = [
      ...documentRoot.querySelectorAll<HTMLElement>(".lia-annot-toolbar"),
    ]
    if (toolbars.length === 0) return undefined
    let hiddenToolbarSeen = false
    for (const toolbar of toolbars) {
      const toggle = toolbar.querySelector<HTMLElement>(
        "button[data-act='toggle']",
      )
      if (!toggle) return true
      const hidden = annotationToggleIsHidden(toggle)
      const explicitlyVisible =
        toggle.getAttribute("aria-pressed") === "true" ||
        toggle.getAttribute("data-active") === "1"
      if (hidden && explicitlyVisible) return true
      if (explicitlyVisible) return true
      if (!hidden) return true
      hiddenToolbarSeen = true
    }
    return hiddenToolbarSeen ? false : undefined
  } catch {
    return undefined
  }
}

function documentAnnotationsVisible(documentRoot: Document): boolean {
  const apiState = annotationApiState(documentRoot)
  const domState = annotationDomState(documentRoot)
  if (apiState !== undefined && domState !== undefined) {
    return apiState === domState ? apiState : true
  }
  if (apiState !== undefined) return apiState
  if (domState !== undefined) return domState
  return hasAnnotationIntegration(documentRoot)
}

export function currentCollectibleEnvironment(
  documentRoot?: Document,
): CollectibleEnvironment {
  const root =
    documentRoot ??
    (typeof document === "undefined" ? undefined : document)
  if (!root) return { ...DEFAULT_ENVIRONMENT }

  const candidates = environmentDocuments(root)
  let snapshot: {
    theme: CollectibleTheme | null
    variant: CollectibleVariant | null
  } | null = null
  for (const candidate of candidates) {
    snapshot = documentEnvironment(candidate)
    if (snapshot) break
  }

  return {
    annotationsVisible: candidates.some(documentAnnotationsVisible),
    theme: snapshot ? snapshot.theme : DEFAULT_ENVIRONMENT.theme,
    variant: snapshot ? snapshot.variant : DEFAULT_ENVIRONMENT.variant,
  }
}

function collectibleEnvironmentSignature(
  environment: CollectibleEnvironment,
): string {
  return `${environment.theme ?? "other"}:${environment.variant ?? "other"}:${
    environment.annotationsVisible ? 1 : 0
  }`
}

function elementLike(value: unknown): Element | null {
  if (!value || typeof value !== "object") return null
  const element = value as Element
  return typeof element.matches === "function" ? element : null
}

function annotationNode(value: Node): boolean {
  const element = elementLike(value)
  if (!element) return false
  if (element.matches(".lia-annot-toolbar, button[data-act='toggle']")) {
    return true
  }
  return Boolean(
    element.querySelector?.(
      ".lia-annot-toolbar, .lia-annot-toolbar button[data-act='toggle']",
    ),
  )
}

function environmentMutationIsRelevant(
  documentRoot: Document,
  mutation: MutationRecord,
): boolean {
  if (mutation.type === "attributes") {
    if (
      mutation.attributeName === "class" &&
      mutation.target === documentRoot.documentElement
    ) {
      return true
    }
    if (
      ["aria-pressed", "data-active"].includes(
        mutation.attributeName ?? "",
      )
    ) {
      return Boolean(
        elementLike(mutation.target)?.matches(
          ".lia-annot-toolbar button[data-act='toggle']",
        ),
      )
    }
    return false
  }
  if (mutation.type !== "childList") return false
  return [...mutation.addedNodes, ...mutation.removedNodes].some(annotationNode)
}

function ensureEnvironmentObservers(documentRoot: Document): void {
  for (const candidate of environmentDocuments(documentRoot)) {
    if (environmentObservers.has(candidate) || !candidate.documentElement) {
      continue
    }
    const Observer = candidate.defaultView?.MutationObserver
    if (!Observer) continue
    const observers: MutationObserver[] = []
    const notifyWhenRelevant = (mutations: MutationRecord[]): void => {
      if (
        mutations.some((mutation) =>
          environmentMutationIsRelevant(candidate, mutation),
        )
      ) {
        queueEnvironmentCheck()
      }
    }
    try {
      const rootObserver = new Observer(notifyWhenRelevant)
      rootObserver.observe(candidate.documentElement, {
        attributeFilter: ["class"],
        attributes: true,
      })
      observers.push(rootObserver)

      const annotationObserver = new Observer(notifyWhenRelevant)
      annotationObserver.observe(candidate.documentElement, {
        attributeFilter: ["aria-pressed", "data-active"],
        attributes: true,
        childList: true,
        subtree: true,
      })
      observers.push(annotationObserver)
      environmentObservers.set(candidate, observers)
    } catch {
      for (const observer of observers) observer.disconnect()
      // A detached or newly cross-origin candidate is ignored fail-closed.
    }
  }
}

function queueEnvironmentCheck(): void {
  if (environmentCheckQueued) return
  environmentCheckQueued = true
  queueMicrotask(() => {
    environmentCheckQueued = false
    const documentRoot = observedEnvironmentDocument
    if (!documentRoot) return
    ensureEnvironmentObservers(documentRoot)
    const signature = collectibleEnvironmentSignature(
      currentCollectibleEnvironment(documentRoot),
    )
    if (signature === observedEnvironmentSignature) return
    observedEnvironmentSignature = signature
    for (const listener of [...environmentListeners]) listener()
  })
}

function observeCollectibleEnvironment(
  listener: () => void,
): () => void {
  if (typeof document === "undefined") return () => undefined
  environmentListeners.add(listener)
  observedEnvironmentDocument ??= document
  ensureEnvironmentObservers(observedEnvironmentDocument)
  observedEnvironmentSignature ??= collectibleEnvironmentSignature(
    currentCollectibleEnvironment(observedEnvironmentDocument),
  )
  return () => {
    environmentListeners.delete(listener)
    if (environmentListeners.size > 0) return
    for (const observers of environmentObservers.values()) {
      for (const observer of observers) observer.disconnect()
    }
    environmentObservers.clear()
    observedEnvironmentDocument = null
    observedEnvironmentSignature = null
  }
}

export function collectibleVisibilitySignature(
  rule: CollectibleVisibilityRule,
): string {
  return `${rule.onlyOnSlide ? 1 : 0}:${rule.delayMs}:${
    configuredThemes(rule).join(",") || "-"
  }:${configuredVariants(rule).join(",") || "-"}:${
    rule.onlyWithoutAnnotations ? 1 : 0
  }`
}

export function advanceCollectibleReveal(
  rule: CollectibleVisibilityRule,
  previousState: CollectibleRevealState | null,
  now: number,
  sourceSlideActive: boolean,
): CollectibleRevealDecision {
  const signature = collectibleVisibilitySignature(rule)
  let state =
    previousState?.signature === signature ? previousState : null
  const canStart = !rule.onlyOnSlide || sourceSlideActive

  if (!state && canStart) {
    state = {
      signature,
      startedAt: Number.isFinite(now) ? now : 0,
    }
  }

  if (!state) return { state: null, visible: false, wakeAt: null }

  const readyAt = state.startedAt + rule.delayMs
  const ready = now >= readyAt
  return {
    state,
    visible: ready && (!rule.onlyOnSlide || sourceSlideActive),
    wakeAt: ready ? null : readyAt,
  }
}

interface ScheduledWake {
  at: number
  handle: number
}

export class CollectibleVisibilityGate {
  private readonly states = new Map<string, CollectibleRevealState>()
  private readonly wakes = new Map<string, ScheduledWake>()
  private readonly now: () => number
  private readonly schedule: (callback: () => void, delay: number) => number
  private readonly cancel: (handle: number) => void
  private readonly environment: () => CollectibleEnvironment
  private readonly environmentCallbacks = new Map<string, () => void>()
  private stopObservingEnvironment: (() => void) | null = null

  constructor(
    now: () => number = () => Date.now(),
    schedule: (callback: () => void, delay: number) => number = (
      callback,
      delay,
    ) => window.setTimeout(callback, delay),
    cancel: (handle: number) => void = (handle) =>
      window.clearTimeout(handle),
    environment: () => CollectibleEnvironment = currentCollectibleEnvironment,
  ) {
    this.now = now
    this.schedule = schedule
    this.cancel = cancel
    this.environment = environment
  }

  visible(
    id: string,
    rule: CollectibleVisibilityRule,
    sourceSlideActive: boolean,
    onReveal: () => void,
  ): boolean {
    this.trackEnvironment(id, rule, onReveal)
    const now = this.now()
    const decision = advanceCollectibleReveal(
      rule,
      this.states.get(id) ?? null,
      now,
      sourceSlideActive,
    )

    if (decision.state) this.states.set(id, decision.state)
    else this.states.delete(id)
    this.syncWake(id, decision.wakeAt, now, onReveal)
    return (
      decision.visible &&
      (!collectibleRuleUsesEnvironment(rule) ||
        collectibleEnvironmentMatches(rule, this.environment()))
    )
  }

  forget(id: string): void {
    this.states.delete(id)
    const wake = this.wakes.get(id)
    if (wake) this.cancel(wake.handle)
    this.wakes.delete(id)
    this.environmentCallbacks.delete(id)
    this.stopEnvironmentObserverWhenUnused()
  }

  private trackEnvironment(
    id: string,
    rule: CollectibleVisibilityRule,
    onReveal: () => void,
  ): void {
    if (!collectibleRuleUsesEnvironment(rule)) {
      this.environmentCallbacks.delete(id)
      this.stopEnvironmentObserverWhenUnused()
      return
    }
    this.environmentCallbacks.set(id, onReveal)
    this.stopObservingEnvironment ??= observeCollectibleEnvironment(() => {
      for (const callback of new Set(this.environmentCallbacks.values())) {
        callback()
      }
    })
  }

  private stopEnvironmentObserverWhenUnused(): void {
    if (this.environmentCallbacks.size > 0 || !this.stopObservingEnvironment) {
      return
    }
    this.stopObservingEnvironment()
    this.stopObservingEnvironment = null
  }

  private syncWake(
    id: string,
    wakeAt: number | null,
    now: number,
    onReveal: () => void,
  ): void {
    const existing = this.wakes.get(id)
    if (existing && existing.at === wakeAt) return
    if (existing) this.cancel(existing.handle)
    this.wakes.delete(id)
    if (wakeAt === null) return

    const handle = this.schedule(
      () => {
        const current = this.wakes.get(id)
        if (!current || current.handle !== handle) return
        this.wakes.delete(id)
        onReveal()
      },
      Math.max(0, wakeAt - now),
    )
    this.wakes.set(id, { at: wakeAt, handle })
  }
}
