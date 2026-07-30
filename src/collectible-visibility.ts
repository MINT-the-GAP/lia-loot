export const MAX_COLLECTIBLE_DELAY_MS = 2_147_483_647

export interface CollectibleVisibilityRule {
  delayMs: number
  onlyOnSlide: boolean
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

const DURATION_TOKEN =
  /^(?:(?:erst\s+)?nach\s+|nach\s*=\s*)?(\d+(?:[.,]\d+)?)\s*(s|sek|sekunde|sekunden|m|min|minute|minuten)$/u
const OPTION_LIKE_TOKEN =
  /^(?:ank\p{L}*|nur(?:\s+|-)|only(?:\s+|-)|slide(?:\s+|-)?only|(?:erst\s+)?nach(?:\s|=|$)|\d+(?:[.,]\d+)?\s*\p{L})|(?:\bfoli\p{L}*\b|\bslides?\b|\bsek\p{L}*\b|\bmin(?:ute|uten)?\b)/u

function normalizeToken(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("de-DE")
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

  for (const rawToken of rawSpecification.split(";")) {
    const token = rawToken.trim()
    if (!token) continue
    const normalized = normalizeToken(token)

    if (ONLY_ON_SLIDE_TOKENS.has(normalized)) {
      onlyOnSlide = true
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
    rule: { delayMs, onlyOnSlide },
    valid: errors.length === 0,
    values,
  }
}

export function collectibleVisibilitySignature(
  rule: CollectibleVisibilityRule,
): string {
  return `${rule.onlyOnSlide ? 1 : 0}:${rule.delayMs}`
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

  constructor(
    now: () => number = () => Date.now(),
    schedule: (callback: () => void, delay: number) => number = (
      callback,
      delay,
    ) => window.setTimeout(callback, delay),
    cancel: (handle: number) => void = (handle) =>
      window.clearTimeout(handle),
  ) {
    this.now = now
    this.schedule = schedule
    this.cancel = cancel
  }

  visible(
    id: string,
    rule: CollectibleVisibilityRule,
    sourceSlideActive: boolean,
    onReveal: () => void,
  ): boolean {
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
    return decision.visible
  }

  forget(id: string): void {
    this.states.delete(id)
    const wake = this.wakes.get(id)
    if (wake) this.cancel(wake.handle)
    this.wakes.delete(id)
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
