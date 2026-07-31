import { isOnlyOnSlideOption } from "./collectible-visibility.ts"
import { requestedKeyColor, type KeyColor } from "./key-colors.ts"

export interface ParsedLockOptions {
  color: KeyColor | null
  errors: string[]
  onlyOnSlide: boolean
  valid: boolean
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
