interface Fence {
  length: number
  marker: "`" | "~"
}

type RawCodeBlock =
  | "script"
  | "style"
  | "pre"
  | "code"
  | "textarea"
  | "template"

const CHOICE_OPTION =
  /^\s*(?:[-*+]\s+)?(?:\[\[\s*[xX]?\s*\]\]|\[\(\s*[xX]?\s*\)\])(?:\s|$)/u

function maskHtmlComments(
  line: string,
  startsInComment: boolean,
): { inComment: boolean; visible: string } {
  let visible = ""
  let cursor = 0
  let inComment = startsInComment

  while (cursor < line.length) {
    if (inComment) {
      const end = line.indexOf("-->", cursor)
      if (end < 0) {
        return {
          inComment: true,
          visible: visible + " ".repeat(line.length - cursor),
        }
      }
      visible += " ".repeat(end + 3 - cursor)
      cursor = end + 3
      inComment = false
      continue
    }

    const start = line.indexOf("<!--", cursor)
    if (start < 0) {
      visible += line.slice(cursor)
      break
    }
    visible += line.slice(cursor, start) + " ".repeat(4)
    cursor = start + 4
    inComment = true
  }

  return { inComment, visible }
}

function fenceAtStart(line: string): Fence | null {
  const match = /^ {0,3}(`{3,}|~{3,})/u.exec(line)
  if (!match) return null
  return {
    length: match[1].length,
    marker: match[1][0] as Fence["marker"],
  }
}

function closesFence(line: string, fence: Fence): boolean {
  const match = /^ {0,3}(`{3,}|~{3,})\s*$/u.exec(line)
  return Boolean(
    match &&
      match[1][0] === fence.marker &&
      match[1].length >= fence.length,
  )
}

function maskInlineCode(line: string): string {
  let result = ""
  let delimiterLength = 0

  for (let index = 0; index < line.length; ) {
    if (line[index] === "`" && line.charCodeAt(index - 1) !== 92) {
      let end = index + 1
      while (line[end] === "`") end += 1
      const runLength = end - index
      if (delimiterLength === 0) delimiterLength = runLength
      else if (delimiterLength === runLength) delimiterLength = 0
      result += " ".repeat(runLength)
      index = end
      continue
    }

    result += delimiterLength === 0 ? line[index] : " "
    index += 1
  }
  return result
}

function addQuiz(counts: Map<number, number>, section: number): void {
  if (section < 0) return
  counts.set(section, (counts.get(section) ?? 0) + 1)
}

export function parseCourseQuizCounts(markdown: string): Map<number, number> {
  const counts = new Map<number, number>()
  let choiceGroupOpen = false
  let fence: Fence | null = null
  let inHtmlComment = false
  let inlineQuizOpen = false
  let rawCodeBlock: RawCodeBlock | null = null
  let section = -1

  for (const rawLine of markdown.split(/\r?\n/u)) {
    const masked = maskHtmlComments(rawLine, inHtmlComment)
    inHtmlComment = masked.inComment

    if (fence) {
      if (closesFence(masked.visible, fence)) fence = null
      continue
    }
    const openingFence = fenceAtStart(masked.visible)
    if (openingFence) {
      fence = openingFence
      continue
    }

    if (rawCodeBlock) {
      if (new RegExp("</" + rawCodeBlock + "\\s*>", "i").test(masked.visible)) {
        rawCodeBlock = null
      }
      continue
    }
    const rawCodeOpening =
      /<(script|style|pre|code|textarea|template)(?:\s|>)/iu.exec(
        masked.visible,
      )
    if (rawCodeOpening) {
      const tag = rawCodeOpening[1].toLowerCase() as RawCodeBlock
      if (!new RegExp("</" + tag + "\\s*>", "i").test(masked.visible)) {
        rawCodeBlock = tag
      }
      continue
    }

    const line = maskInlineCode(masked.visible)
    if (/^ {0,3}#{1,6}(?:\s+|$)/u.test(line)) {
      section += 1
      choiceGroupOpen = false
      inlineQuizOpen = false
      continue
    }
    if (section < 0) continue

    if (inlineQuizOpen) {
      if (line.includes("]]")) inlineQuizOpen = false
      continue
    }

    if (CHOICE_OPTION.test(line)) {
      if (!choiceGroupOpen) addQuiz(counts, section)
      choiceGroupOpen = true
      continue
    }

    const trimmed = line.trim()
    if (trimmed.length === 0) continue
    const hasQuizMarker = line.includes("[[") || line.includes("[->[")
    if (choiceGroupOpen && /^(?: {4}|\t)/u.test(line) && !hasQuizMarker) {
      continue
    }
    choiceGroupOpen = false

    const withoutHints = line.replace(/\[\[\?\]\]/gu, "")
    const dragStart = withoutHints.indexOf("[->[")
    const quizStart = withoutHints.indexOf("[[")
    const start =
      dragStart < 0
        ? quizStart
        : quizStart < 0
          ? dragStart
          : Math.min(dragStart, quizStart)
    if (start < 0) continue

    addQuiz(counts, section)
    const remainder = withoutHints.slice(start)
    if (!remainder.includes("]]")) inlineQuizOpen = true
  }

  return counts
}
