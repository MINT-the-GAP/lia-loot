import { isOnlyOnSlideOption } from "./collectible-visibility.ts"
import { requestedKeyColor, type KeyColor } from "./key-colors.ts"

export interface ParsedLockOptions {
  color: KeyColor | null
  errors: string[]
  onlyOnSlide: boolean
  valid: boolean
}

export interface ParsedLockSpecification extends ParsedLockOptions {
  target: string
}

function normalizeMacroPlaceholder(value: string): string {
  return /^@\d+$/u.test(value.trim()) ? "" : value
}

export function parseLockOptions(rawSpecification: string): ParsedLockOptions {
  const values: string[] = []
  const errors: string[] = []
  let onlyOnSlide = false

  for (const rawToken of rawSpecification.split(";")) {
    const token = rawToken.trim()
    if (!token) continue
    if (isOnlyOnSlideOption(token)) {
      onlyOnSlide = true
    } else {
      values.push(token)
    }
  }

  if (values.length !== 1) {
    errors.push("Ein Schloss benötigt genau eine Schlüsselfarbe.")
  }
  const color = values.length === 1 ? requestedKeyColor(values[0]) : null
  if (values.length === 1 && !color) {
    errors.push(`Unbekannte Schlüsselfarbe oder Schlossoption: ${values[0]}`)
  }

  return {
    color,
    errors,
    onlyOnSlide,
    valid: errors.length === 0 && color !== null,
  }
}

/**
 * Parses both supported lock spellings:
 *
 * - legacy: target and options arrive separately (`target, color; anker`)
 * - compact: the complete declaration arrives in the target slot
 *   (`target; color; anker`)
 *
 * LiaScript leaves a missing forwarded macro parameter as e.g. `@1`, so an
 * unresolved options placeholder is treated like an empty options slot.
 */
export function parseLockSpecification(
  rawTarget: string,
  rawOptions = "",
): ParsedLockSpecification {
  let target = normalizeMacroPlaceholder(rawTarget).trim()
  let optionSpecification = normalizeMacroPlaceholder(rawOptions).trim()

  if (!optionSpecification) {
    const [authoredTarget = "", ...authoredOptions] = target.split(";")
    target = authoredTarget.trim()
    optionSpecification = authoredOptions.join(";")
  }

  return {
    target,
    ...parseLockOptions(optionSpecification),
  }
}
