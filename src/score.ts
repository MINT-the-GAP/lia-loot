import type { HighscoreConfig, HighscoreState, TrophyTier } from "./types"

const CONFIG_KEYS: Array<keyof HighscoreConfig> = [
  "maxPoints",
  "failedCheckPenalty",
  "hintPenalty",
  "graceMinutes",
  "perMinutePenalty",
]

export function createConfig(
  maxPoints: number,
  failedCheckPenalty: number,
  hintPenalty: number,
  graceMinutes: number,
  perMinutePenalty: number,
): HighscoreConfig {
  const config: HighscoreConfig = {
    maxPoints: Number(maxPoints),
    failedCheckPenalty: Number(failedCheckPenalty),
    hintPenalty: Number(hintPenalty),
    graceMinutes: Number(graceMinutes),
    perMinutePenalty: Number(perMinutePenalty),
  }

  if (!Number.isFinite(config.maxPoints) || config.maxPoints <= 0) {
    throw new TypeError("@Highscore: Die maximale Punktzahl muss größer als 0 sein.")
  }

  for (const key of CONFIG_KEYS.slice(1)) {
    if (!Number.isFinite(config[key]) || config[key] < 0) {
      throw new TypeError(`@Highscore: ${key} muss eine nichtnegative Zahl sein.`)
    }
  }

  return config
}

export function sameConfig(a: HighscoreConfig, b: HighscoreConfig): boolean {
  return CONFIG_KEYS.every((key) => a[key] === b[key])
}

export function elapsedSeconds(startedAt: number, at: number): number {
  return Math.max(0, Math.floor((at - startedAt) / 1000))
}

export function calculateScore(
  config: HighscoreConfig,
  state: Pick<HighscoreState, "startedAt" | "failedChecks" | "hintsUsed">,
  at: number,
): number {
  const elapsedAfterGraceMs = at - state.startedAt - config.graceMinutes * 60_000
  const chargedSeconds = Math.max(0, Math.floor(elapsedAfterGraceMs / 1000))
  const timePenalty = (chargedSeconds * config.perMinutePenalty) / 60

  return Math.max(
    0,
    config.maxPoints -
      state.failedChecks * config.failedCheckPenalty -
      state.hintsUsed * config.hintPenalty -
      timePenalty,
  )
}

export function trophyTier(score: number, maxPoints: number): TrophyTier {
  const ratio = maxPoints > 0 ? score / maxPoints : 0

  if (ratio >= 0.9) return "gold"
  if (ratio >= 0.75) return "silver"
  if (ratio >= 0.5) return "copper"
  return null
}

export function formatScore(score: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(score)
}
