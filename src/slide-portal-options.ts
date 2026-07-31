export type SlidePortalMode = "two-way" | "one-way"

export interface SlidePortalOptions {
  errors: string[]
  mode: SlidePortalMode
  targetSection: number | null
  targetSlide: number | null
  valid: boolean
}

export type SlidePortalTargetStatus =
  | "valid"
  | "pending"
  | "same-slide"
  | "missing"

const ONE_WAY_ALIASES = new Set([
  "einweg",
  "einbahn",
  "einbahnstrasse",
  "oneway",
  "one-way",
])
const TWO_WAY_ALIASES = new Set([
  "hinundher",
  "hin-und-her",
  "zweiweg",
  "bidirektional",
  "twoway",
  "two-way",
])

function normalizeModeToken(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/ß/gu, "ss")
    .replace(/\s+/gu, "")
}

function requestedMode(value: string): SlidePortalMode | null {
  const normalized = normalizeModeToken(value)
  if (ONE_WAY_ALIASES.has(normalized)) return "one-way"
  if (TWO_WAY_ALIASES.has(normalized)) return "two-way"
  return null
}

export function parseSlidePortalOptions(
  raw: string,
  defaultMode: SlidePortalMode = "two-way",
): SlidePortalOptions {
  const authored = raw.trim() === "@0" ? "" : raw
  const tokens = authored
    .split(";")
    .map((token) => token.trim())
    .filter(Boolean)
  const errors: string[] = []
  const targets: number[] = []
  const modes = new Set<SlidePortalMode>()

  for (const token of tokens) {
    if (/^\d+$/u.test(token)) {
      targets.push(Number(token))
      continue
    }
    const mode = requestedMode(token)
    if (mode) {
      modes.add(mode)
      continue
    }
    errors.push(`Unbekannte Portaloption: ${token}`)
  }

  if (targets.length !== 1) {
    errors.push("Ein Portal benötigt genau eine positive Foliennummer.")
  }
  const targetSlide = targets.length === 1 ? targets[0] : null
  if (
    targetSlide !== null &&
    (!Number.isSafeInteger(targetSlide) || targetSlide < 1)
  ) {
    errors.push("Die Zielfolie muss eine positive, sichere Ganzzahl sein.")
  }
  if (modes.size > 1) {
    errors.push("Ein Portal kann nicht zugleich Einweg- und Zweiwegportal sein.")
  }

  const explicitMode = modes.values().next().value as
    | SlidePortalMode
    | undefined
  const parsedTargetSection =
    targetSlide !== null &&
    Number.isSafeInteger(targetSlide) &&
    targetSlide >= 1
      ? targetSlide - 1
      : null
  const targetSection = errors.length === 0 ? parsedTargetSection : null
  return {
    errors,
    mode: explicitMode ?? defaultMode,
    targetSection,
    targetSlide,
    valid: targetSection !== null,
  }
}

export function validateSlidePortalTarget(
  targetSection: number | null,
  sourceSection: number | null,
  totalSections: number | null,
): SlidePortalTargetStatus {
  if (
    targetSection === null ||
    !Number.isInteger(targetSection) ||
    targetSection < 0
  ) {
    return "missing"
  }
  if (sourceSection !== null && targetSection === sourceSection) {
    return "same-slide"
  }
  if (totalSections === null || totalSections < 1) return "pending"
  return targetSection < totalSections ? "valid" : "missing"
}
