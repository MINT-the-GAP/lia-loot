const HIDDEN_ARGUMENT_SEPARATOR =
  /LIALOOTHIDDEN7QARGSEP([1-9])X9END/gu

/**
 * Rejoins top-level commas that LiaScript split into positional arguments
 * before forwarding the payload to the internal hidden-content macro.
 */
export function normalizeHiddenMacroArgumentText(value: string): string {
  const separators = [...value.matchAll(HIDDEN_ARGUMENT_SEPARATOR)]
  if (separators.length === 0) return value

  const firstSeparator = separators[0]
  const head = value.slice(0, firstSeparator.index)
  let result = head === "@0" ? "" : head

  for (const [position, separator] of separators.entries()) {
    const argumentIndex = separator[1]
    const start = separator.index + separator[0].length
    const end = separators[position + 1]?.index ?? value.length
    const fragment = value.slice(start, end)
    if (fragment !== `@${argumentIndex}`) result += `,${fragment}`
  }

  return result
}
