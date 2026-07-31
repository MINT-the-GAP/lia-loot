import type { ResourceKind } from "./types"
import type { KeyColor } from "./key-colors.ts"
import { parseLockOptions } from "./lock-options.ts"

export interface CourseChestDeclaration {
  baseId: string
  placement: string
  reward: ResourceKind
  section: number
}

export interface CourseLockDeclaration {
  baseId: string
  target: string
  color: KeyColor
  onlyOnSlide: boolean
  section: number
}

export interface CourseResourceDeclaration {
  gold: number
  diamonds: number
  energy?: number
  section: number
}

export interface CourseSecretSlideDeclaration {
  section: number
}

export interface CourseChestDiscovery {
  declarations: CourseChestDeclaration[]
  catalog: CourseChestDeclaration[]
}

export interface CourseLockDiscovery {
  declarations: CourseLockDeclaration[]
  catalog: CourseLockDeclaration[]
}

const CHEST_MACRO =
  /^\s*@(Schatztruhe|Diamanttruhe|Energiekiste)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/
const LOCK_MACRO =
  /^\s*@Schloss\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/
const INTERNAL_CHEST_MACRO =
  /^\s*@LootTruhe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*,\s*(gold|diamonds|energy)\s*\)\s*$/i
const INTERNAL_LOCK_MACRO =
  /^\s*@LootSchloss_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/
const RESOURCE_MACRO =
  /^\s*@Ressourcen\s*\(\s*([^,()\r\n]+?)\s*,\s*([^,()\r\n]+?)(?:\s*,\s*([^,()\r\n]+?))?\s*\)\s*$/
const SECRET_SLIDE_MACRO = /^\s*@Geheimfolie\s*$/
const ACHIEVEMENTS_MACRO =
  /^\s*@(achievements|erfolge)\s*$/i
const NONNEGATIVE_NUMBER_LITERAL =
  /^\+?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[+-]?\d+)?$/i
const MAX_SOURCE_LENGTH = 10 * 1024 * 1024
const SOURCE_TIMEOUT = 4000
const SOURCE_RETRY_DELAYS = [0, 300, 1000] as const

const MACRO_REWARD: Readonly<Record<string, ResourceKind>> = {
  Schatztruhe: "gold",
  Diamanttruhe: "diamonds",
  Energiekiste: "energy",
}

interface Fence {
  marker: "`" | "~"
  length: number
}

type RawCodeBlock =
  | "script"
  | "style"
  | "pre"
  | "code"
  | "textarea"
  | "template"

interface LiaRuntime {
  defaultCourseURL?: string
  fetch?: typeof window.fetch
}

interface VisibleCourseLine {
  content: string
  section: number
}

let cachedCourseMarkdown: string | null = null
let courseMarkdownPromise: Promise<string | null> | null = null

function maskHtmlComments(
  line: string,
  startsInComment: boolean,
): { visible: string; inComment: boolean } {
  let visible = ""
  let cursor = 0
  let inComment = startsInComment

  while (cursor < line.length) {
    if (inComment) {
      const end = line.indexOf("-->", cursor)
      if (end < 0) return { visible, inComment: true }
      cursor = end + 3
      inComment = false
      continue
    }

    const start = line.indexOf("<!--", cursor)
    if (start < 0) {
      visible += line.slice(cursor)
      break
    }
    visible += line.slice(cursor, start)
    cursor = start + 4
    inComment = true
  }

  return { visible, inComment }
}

function fenceAtStart(line: string): Fence | null {
  const match = /^ {0,3}(`{3,}|~{3,})/.exec(line)
  if (!match) return null
  return {
    marker: match[1][0] as Fence["marker"],
    length: match[1].length,
  }
}

function closesFence(line: string, fence: Fence): boolean {
  const match = /^ {0,3}(`{3,}|~{3,})\s*$/.exec(line)
  return (
    match !== null &&
    match[1][0] === fence.marker &&
    match[1].length >= fence.length
  )
}

function maskInlineCode(line: string): string {
  let result = ""
  let delimiterLength = 0

  for (let index = 0; index < line.length; ) {
    if (line[index] === "`" && line[index - 1] !== "\\") {
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

function normalizedInvocation(macro: string, placement: string): string {
  const normalizedPlacement = placement
    .split(";")
    .map((part) => part.trim().toLowerCase())
    .join(";")
  return `${macro}(${normalizedPlacement})`
}

function hash(value: string): string {
  let result = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 0x01000193)
  }
  return (result >>> 0).toString(36)
}

function visibleCourseLines(markdown: string): VisibleCourseLine[] {
  const lines: VisibleCourseLine[] = []
  let fence: Fence | null = null
  let inHtmlComment = false
  let rawCodeBlock: RawCodeBlock | null = null
  let section = -1

  for (const rawLine of markdown.split(/\r?\n/)) {
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
      if (new RegExp(`</${rawCodeBlock}\\s*>`, "i").test(masked.visible)) {
        rawCodeBlock = null
      }
      continue
    }

    const rawCodeOpening =
      /<(script|style|pre|code|textarea|template)(?:\s|>)/i.exec(
        masked.visible,
      )
    if (rawCodeOpening) {
      const tag = rawCodeOpening[1].toLowerCase() as RawCodeBlock
      if (!new RegExp(`</${tag}\\s*>`, "i").test(masked.visible)) {
        rawCodeBlock = tag
      }
      continue
    }

    if (/^(?: {4}|\t)/.test(masked.visible)) continue
    const visibleLine = maskInlineCode(masked.visible)
    if (/^ {0,3}#{1,6}(?:\s+|$)/.test(visibleLine)) section += 1
    lines.push({ content: visibleLine, section })
  }

  return lines
}

export function parseCourseChestDeclarations(
  markdown: string,
): CourseChestDeclaration[] {
  const declarations: CourseChestDeclaration[] = []
  const occurrences = new Map<string, number>()
  for (const line of visibleCourseLines(markdown)) {
    const match = CHEST_MACRO.exec(line.content)
    if (!match) continue

    const placement = (match[2] ?? "").trim()

    const reward = MACRO_REWARD[match[1]]
    const invocation = normalizedInvocation(match[1], placement)
    const occurrence = (occurrences.get(invocation) ?? 0) + 1
    occurrences.set(invocation, occurrence)
    declarations.push({
      baseId: `source-${reward}-${hash(invocation)}-${occurrence}`,
      placement,
      reward,
      section: line.section,
    })
  }

  return declarations
}

export function parseCourseLockDeclarations(
  markdown: string,
): CourseLockDeclaration[] {
  const declarations: CourseLockDeclaration[] = []
  const occurrences = new Map<string, number>()

  for (const line of visibleCourseLines(markdown)) {
    const match = LOCK_MACRO.exec(line.content)
    if (!match) continue

    const target = match[1].trim()
    const options = parseLockOptions(match[2])
    if (!options.valid || !options.color) continue
    const invocation =
      `Schloss(${target.toLowerCase()},${options.color}` +
      `${options.onlyOnSlide ? ",anker" : ""})`
    const occurrence = (occurrences.get(invocation) ?? 0) + 1
    occurrences.set(invocation, occurrence)
    declarations.push({
      baseId: `source-lock-${hash(invocation)}-${occurrence}`,
      target,
      color: options.color,
      onlyOnSlide: options.onlyOnSlide,
      section: line.section,
    })
  }

  return declarations
}

function parseInternalCourseChestDeclarations(
  markdown: string,
): CourseChestDeclaration[] {
  const declarations: CourseChestDeclaration[] = []
  const occurrences = new Map<string, number>()

  for (const line of visibleCourseLines(markdown)) {
    const match = INTERNAL_CHEST_MACRO.exec(line.content)
    if (!match) continue

    const placement = match[2].trim()
    const reward = match[3].toLowerCase() as ResourceKind
    const invocation = normalizedInvocation(
      `LootTruhe(${reward})`,
      `${match[1].trim()};${placement}`,
    )
    const occurrence = (occurrences.get(invocation) ?? 0) + 1
    occurrences.set(invocation, occurrence)
    declarations.push({
      baseId: `source-internal-${reward}-${hash(invocation)}-${occurrence}`,
      placement,
      reward,
      section: line.section,
    })
  }

  return declarations
}

function parseInternalCourseLockDeclarations(
  markdown: string,
): CourseLockDeclaration[] {
  const declarations: CourseLockDeclaration[] = []
  const occurrences = new Map<string, number>()

  for (const line of visibleCourseLines(markdown)) {
    const match = INTERNAL_LOCK_MACRO.exec(line.content)
    if (!match) continue

    const target = match[2].trim()
    const options = parseLockOptions(match[3])
    if (!options.valid || !options.color) continue
    const invocation =
      `LootSchloss(${match[1].trim()},${target.toLowerCase()},` +
      `${options.color}${options.onlyOnSlide ? ",anker" : ""})`
    const occurrence = (occurrences.get(invocation) ?? 0) + 1
    occurrences.set(invocation, occurrence)
    declarations.push({
      baseId: `source-internal-lock-${hash(invocation)}-${occurrence}`,
      target,
      color: options.color,
      onlyOnSlide: options.onlyOnSlide,
      section: line.section,
    })
  }

  return declarations
}

export function parseCourseChestCatalogDeclarations(
  markdown: string,
): CourseChestDeclaration[] {
  return [
    ...parseCourseChestDeclarations(markdown),
    ...parseInternalCourseChestDeclarations(markdown),
  ]
}

export function parseCourseLockCatalogDeclarations(
  markdown: string,
): CourseLockDeclaration[] {
  return [
    ...parseCourseLockDeclarations(markdown),
    ...parseInternalCourseLockDeclarations(markdown),
  ]
}

function nonnegativeNumberLiteral(raw: string): number | null {
  const literal = raw.trim()
  if (!NONNEGATIVE_NUMBER_LITERAL.test(literal)) return null

  const value = Number(literal)
  return Number.isFinite(value) && value >= 0 ? value : null
}

export function parseCourseResourceDeclaration(
  markdown: string,
): CourseResourceDeclaration | null {
  for (const line of visibleCourseLines(markdown)) {
    const match = RESOURCE_MACRO.exec(line.content)
    if (!match) continue

    const gold = nonnegativeNumberLiteral(match[1])
    const diamonds = nonnegativeNumberLiteral(match[2])
    const energy =
      match[3] === undefined ? undefined : nonnegativeNumberLiteral(match[3])
    if (gold === null || diamonds === null || energy === null) continue

    return {
      gold,
      diamonds,
      ...(energy === undefined ? {} : { energy }),
      section: line.section,
    }
  }

  return null
}

export function parseCourseSecretSlideDeclarations(
  markdown: string,
): CourseSecretSlideDeclaration[] {
  const declarations: CourseSecretSlideDeclaration[] = []
  const declaredSections = new Set<number>()

  for (const line of visibleCourseLines(markdown)) {
    if (
      line.section < 0 ||
      declaredSections.has(line.section) ||
      !SECRET_SLIDE_MACRO.test(line.content)
    ) {
      continue
    }

    declaredSections.add(line.section)
    declarations.push({ section: line.section })
  }

  return declarations
}

export function parseCourseAchievementsDeclaration(markdown: string): boolean {
  return visibleCourseLines(markdown).some((line) =>
    ACHIEVEMENTS_MACRO.test(line.content),
  )
}

function explicitSourceUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const candidates = [trimmed]
  try {
    const decoded = decodeURIComponent(trimmed)
    if (decoded !== trimmed) candidates.push(decoded)
  } catch {
    // Keep the original URL when the query is not URI-encoded.
  }

  return (
    candidates.find((candidate) => /^(?:https?:|blob:|data:)/i.test(candidate)) ??
    null
  )
}

function courseSourceUrl(): string | null {
  const lia = (window as Window & { LIA?: LiaRuntime }).LIA
  const configured = lia?.defaultCourseURL?.trim()
  if (configured) {
    try {
      const url = new URL(configured, window.location.href)
      if (/^(?:https?:|blob:|data:)$/i.test(url.protocol)) return url.href
    } catch {
      // Fall back to LiaScript's standard query URL.
    }
  }
  return explicitSourceUrl(window.location.search.slice(1))
}

async function fetchCourseMarkdown(): Promise<string | null> {
  const sourceUrl = courseSourceUrl()
  if (!sourceUrl) return null

  const lia = (window as Window & { LIA?: LiaRuntime }).LIA
  const load = lia?.fetch ?? window.fetch.bind(window)
  const abort = new AbortController()
  const timeout = window.setTimeout(() => abort.abort(), SOURCE_TIMEOUT)

  try {
    const response = await load(sourceUrl, {
      cache: "default",
      credentials: "same-origin",
      signal: abort.signal,
    })
    if (!response.ok) return null
    const markdown = await response.text()
    return markdown.length <= MAX_SOURCE_LENGTH ? markdown : null
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}

async function loadCourseMarkdown(): Promise<string | null> {
  if (cachedCourseMarkdown !== null) return cachedCourseMarkdown
  if (courseMarkdownPromise) return courseMarkdownPromise

  courseMarkdownPromise = (async () => {
    for (const delay of SOURCE_RETRY_DELAYS) {
      if (delay > 0) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, delay))
      }
      const markdown = await fetchCourseMarkdown()
      if (markdown !== null) {
        cachedCourseMarkdown = markdown
        return markdown
      }
    }
    return null
  })()

  try {
    return await courseMarkdownPromise
  } finally {
    courseMarkdownPromise = null
  }
}

export async function discoverCourseChestDeclarations(): Promise<
  CourseChestDeclaration[]
> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseChestDeclarations(markdown) : []
}

export async function discoverCourseLockDeclarations(): Promise<
  CourseLockDeclaration[]
> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseLockDeclarations(markdown) : []
}

export async function discoverCourseChests(): Promise<CourseChestDiscovery> {
  const markdown = await loadCourseMarkdown()
  return markdown
    ? {
        declarations: parseCourseChestDeclarations(markdown),
        catalog: parseCourseChestCatalogDeclarations(markdown),
      }
    : { declarations: [], catalog: [] }
}

export async function discoverCourseLocks(): Promise<CourseLockDiscovery> {
  const markdown = await loadCourseMarkdown()
  return markdown
    ? {
        declarations: parseCourseLockDeclarations(markdown),
        catalog: parseCourseLockCatalogDeclarations(markdown),
      }
    : { declarations: [], catalog: [] }
}

export async function discoverCourseResourceDeclaration(): Promise<
  CourseResourceDeclaration | null
> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseResourceDeclaration(markdown) : null
}

export async function discoverCourseSecretSlideDeclarations(): Promise<
  CourseSecretSlideDeclaration[]
> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseSecretSlideDeclarations(markdown) : []
}

export async function discoverCourseAchievementsDeclaration(): Promise<boolean> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseAchievementsDeclaration(markdown) : false
}

export async function requireCourseSecretSlideDeclarations(): Promise<
  CourseSecretSlideDeclaration[]
> {
  const markdown = await loadCourseMarkdown()
  if (markdown === null) {
    throw new Error("Die LiaScript-Kursquelle konnte nicht geladen werden.")
  }
  return parseCourseSecretSlideDeclarations(markdown)
}
