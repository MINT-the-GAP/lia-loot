export interface ResourceOptions {
  energy?: number
  goldValue?: number
  diamondValue?: number
}

const NONNEGATIVE_NUMBER_LITERAL =
  /^\+?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[+-]?\d+)?$/i

function resourceOptionValue(raw: string): number {
  const value = Number(raw)
  if (
    !NONNEGATIVE_NUMBER_LITERAL.test(raw) ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error("Ressourcenwerte müssen endliche, nichtnegative Zahlen sein.")
  }
  return value
}

export function parseResourceOptions(
  args: readonly (string | number | undefined)[],
): ResourceOptions {
  const options: ResourceOptions = {}
  let hasNamedOption = false

  for (const raw of args) {
    if (raw === undefined) continue
    for (const part of String(raw).split(";")) {
      const token = part.trim()
      if (token === "" || /^@'?\d+$/u.test(token)) continue

      const named = /^(goldwert|diamantwert)\s*=\s*(.*?)$/iu.exec(token)
      if (named) {
        hasNamedOption = true
        const key =
          named[1].toLowerCase() === "goldwert" ? "goldValue" : "diamondValue"
        if (options[key] !== undefined) {
          throw new Error(`Ressourcenoption ${named[1]} wurde mehrfach angegeben.`)
        }
        options[key] = resourceOptionValue(named[2])
        continue
      }

      if (hasNamedOption || options.energy !== undefined) {
        throw new Error(`Unbekannte Ressourcenoption: ${token}`)
      }
      options.energy = resourceOptionValue(token)
    }
  }

  return options
}
