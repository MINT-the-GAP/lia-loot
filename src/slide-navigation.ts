export type SlideHistoryMode = "push" | "replace"

export function liaSlideHash(section: number): string {
  if (!Number.isInteger(section) || section < 0) {
    throw new RangeError(
      "Eine LiaScript-Folie muss eine nichtnegative Section besitzen.",
    )
  }
  return `#${section + 1}`
}

export function navigateToLiaSection(
  section: number,
  historyMode: SlideHistoryMode = "push",
): void {
  const hash = liaSlideHash(section)
  if (historyMode === "push") {
    window.location.hash = hash
    return
  }

  try {
    window.location.replace(hash)
  } catch {
    window.location.hash = hash
  }
}
