import { parseCollectibleOptions } from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  parseExplorationOptions,
  type RevealLayerOption,
} from "./exploration-options.ts"
import { isKeyColorRequest, type KeyColor } from "./key-colors.ts"
import {
  parseLockOptions,
  parseLockSpecification,
} from "./lock-options.ts"
import { parseLootIfOptions } from "./loot-if-options.ts"
import { buildPuzzleCatalog } from "./puzzle-catalog.ts"
import type {
  CoursePuzzleDiscovery,
  CoursePuzzleGateDeclaration,
  CoursePuzzlePieceDeclaration,
} from "./puzzle-declarations.ts"
import { parsePuzzlePieceOptions } from "./puzzle-options.ts"
import { resolveSurfaceTarget } from "./surface-targets.ts"
import { resolveTemplateTarget } from "./template-targets.ts"
import type { ResourceKind } from "./types"

export type {
  CoursePuzzleDiscovery,
  CoursePuzzleGateDeclaration,
  CoursePuzzlePieceDeclaration,
} from "./puzzle-declarations.ts"

export interface CourseChestDeclaration {
  baseId: string
  placement: string
  reward: ResourceKind
  section: number
}

export interface CourseKeyDeclaration {
  baseId: string
  options: string
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

export interface CourseAchievementCatalog {
  dust: number
  plant: number
  soil: number
  solid: number
}

const CHEST_MACRO =
  /^\s*@(Schatztruhe|Diamanttruhe|Energiekiste)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/
const KEY_MACRO =
  /^\s*@Schluessel(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/
const LOCK_MACRO = /^\s*@Schloss\s*\(\s*([^()\r\n]+)\s*\)\s*$/
const INTERNAL_CHEST_MACRO =
  /^\s*@LootTruhe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*,\s*(gold|diamonds|energy)\s*\)\s*$/i
const INTERNAL_LOCK_MACRO =
  /^\s*@LootSchloss_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]+)\s*\)\s*$/
const ACHIEVEMENT_ITEM_MACRO =
  /^\s*@(Schatztruhe|Diamanttruhe|Energiekiste|Schluessel|Lupe|Schaufel|Giesskanne|Puzzleteil)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu
const INTERNAL_KEY_MACRO =
  /^\s*@LootSchluessel_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu
const INTERNAL_MAGNIFIER_MACRO =
  /^\s*@LootLupe_\s*\(\s*([^,()\r\n]+)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu
const INTERNAL_TOOL_MACRO =
  /^\s*@LootWerkzeug_\s*\(\s*([^,()\r\n]+)\s*,\s*(shovel|watering-can)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu
const INTERNAL_REVEAL_START_MACRO =
  /^\s*@LootRevealStart_\s*\(\s*([^,()\r\n]+)\s*,\s*(erde|pflanze)\s*,\s*([^,()\r\n]*)\s*\)\s*$/iu
const INTERNAL_REVEAL_END_MACRO =
  /^\s*@LootRevealEnd_\s*\(\s*(erde|pflanze)\s*\)\s*$/iu
const INTERNAL_HIDDEN_MACRO =
  /^\s*@LootVersteckt_\s*\(\s*([^,()\r\n]+)\s*,\s*(solid|dust)\s*,[\s\S]*\)\s*$/iu
const RESOURCE_MACRO =
  /^\s*@Ressourcen\s*\(\s*([^,()\r\n]+?)\s*,\s*([^,()\r\n]+?)(?:\s*,\s*([^,()\r\n]+?))?\s*\)\s*$/
const SECRET_SLIDE_MACRO = /^\s*@Geheimfolie\s*$/
const PUZZLE_PIECE_MACRO =
  /^\s*@Puzzleteil(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu
const PUZZLE_GATE_MACRO =
  /^\s*@Puzzletor(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu
const ACHIEVEMENTS_MACRO =
  /^\s*@(achievements|erfolge)\s*$/i
const NONNEGATIVE_NUMBER_LITERAL =
  /^\+?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[+-]?\d+)?$/i
const MAX_SOURCE_LENGTH = 10 * 1024 * 1024
const SOURCE_TIMEOUT = 4000
const SOURCE_RETRY_DELAYS = [0, 300, 1000] as const
export const DEFAULT_COURSE_VERSION = "0.0.1"

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
  lootIfCatalogEligible: boolean
  lootIfDepth: number
  revealDepth: number
  section: number
}

interface LootIfFrame {
  closed: boolean
  valid: boolean
}

interface PendingVisibleCourseLine extends VisibleCourseLine {
  lootIfFrames: LootIfFrame[]
}

type RevealContainerKind = "soil" | "plant"

const REVEAL_START_MACRO =
  /^\s*@(Erdhaufen|Pflanze|Blume)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu
const REVEAL_END_MACRO = /^\s*@Ende(Erdhaufen|Pflanze|Blume)\s*$/iu
const LOOT_IF_START_PREFIX = /^\s*@lootif\b/iu
const LOOT_IF_START_MACRO =
  /^\s*@lootif\s*\(\s*([^()\r\n]*)\s*\)\s*$/iu
const INTERNAL_LOOT_IF_START_PREFIX = /^\s*@LootIfStart_\b/u
const INTERNAL_LOOT_IF_START_MACRO =
  /^\s*@LootIfStart_\s*\(\s*([^,()\r\n]+)\s*,\s*([^()\r\n]*)\s*\)\s*$/u
const LOOT_IF_END_MACRO =
  /^\s*@(Endelootif|EndeLootif|endlootif|EndLootIf)\s*$/u
const INTERNAL_LOOT_IF_END_MACRO = /^\s*@LootIfEnd_\s*$/u

function revealContainerKind(name: string): RevealContainerKind {
  return name.toLocaleLowerCase("de-DE") === "erdhaufen" ? "soil" : "plant"
}

function lootIfStartValidity(line: string): boolean | null {
  const publicStart = LOOT_IF_START_MACRO.exec(line)
  if (publicStart) return parseLootIfOptions(publicStart[1]).valid
  if (LOOT_IF_START_PREFIX.test(line)) return false

  const internalStart = INTERNAL_LOOT_IF_START_MACRO.exec(line)
  if (internalStart) return parseLootIfOptions(internalStart[2]).valid
  return INTERNAL_LOOT_IF_START_PREFIX.test(line) ? false : null
}

function isLootIfEnd(line: string): boolean {
  return LOOT_IF_END_MACRO.test(line) || INTERNAL_LOOT_IF_END_MACRO.test(line)
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

export function parseCourseVersion(markdown: string): string {
  const header = /^\s*<!--([\s\S]*?)-->/u.exec(
    markdown.replace(/^\uFEFF/u, ""),
  )
  if (!header) return DEFAULT_COURSE_VERSION

  const version = /^\s*version\s*:\s*(.*?)\s*$/imu.exec(header[1])?.[1]?.trim()
  return version || DEFAULT_COURSE_VERSION
}

function visibleCourseLines(markdown: string): VisibleCourseLine[] {
  const lines: PendingVisibleCourseLine[] = []
  let fence: Fence | null = null
  let inHtmlComment = false
  let rawCodeBlock: RawCodeBlock | null = null
  let section = -1
  const revealContainers: RevealContainerKind[] = []
  let lootIfFrames: LootIfFrame[] = []

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
    if (/^ {0,3}#{1,6}(?:\s+|$)/.test(visibleLine)) {
      section += 1
      // Runtime ranges are scoped to one rendered LiaScript slide. An open
      // source range must therefore never capture declarations on a later one.
      lootIfFrames = []
    }
    if (isLootIfEnd(visibleLine)) {
      const frame = lootIfFrames.pop()
      if (frame) frame.closed = true
    }
    const closingReveal = REVEAL_END_MACRO.exec(visibleLine)
    if (
      closingReveal &&
      revealContainers[revealContainers.length - 1] ===
        revealContainerKind(closingReveal[1])
    ) {
      revealContainers.pop()
    }
    lines.push({
      content: visibleLine,
      lootIfCatalogEligible: true,
      lootIfDepth: lootIfFrames.length,
      lootIfFrames: [...lootIfFrames],
      revealDepth: revealContainers.length,
      section,
    })
    const openingReveal = REVEAL_START_MACRO.exec(visibleLine)
    if (openingReveal) {
      revealContainers.push(revealContainerKind(openingReveal[1]))
    }
    const lootIfValid = lootIfStartValidity(visibleLine)
    if (lootIfValid !== null) {
      lootIfFrames.push({ closed: false, valid: lootIfValid })
    }
  }

  return lines.map(({ lootIfFrames: frames, ...line }) => ({
    ...line,
    lootIfCatalogEligible: frames.every(
      (frame) => frame.closed && frame.valid,
    ),
  }))
}

function emptyCourseAchievementCatalog(): CourseAchievementCatalog {
  return {
    dust: 0,
    plant: 0,
    soil: 0,
    solid: 0,
  }
}

function addAchievementCatalog(
  target: CourseAchievementCatalog,
  source: CourseAchievementCatalog,
  multiplier = 1,
): void {
  target.dust += source.dust * multiplier
  target.plant += source.plant * multiplier
  target.soil += source.soil * multiplier
  target.solid += source.solid * multiplier
}

function validPuzzleAchievementSourceOrders(markdown: string): Set<number> {
  const puzzleCatalog = buildPuzzleCatalog(
    parseCoursePuzzleDeclarations(markdown),
  )
  const validColors = new Set(
    puzzleCatalog.gates
      .filter((gate) => gate.valid && gate.color !== null)
      .map((gate) => gate.color!),
  )
  return new Set(
    puzzleCatalog.pieces
      .filter(
        (piece) =>
          piece.valid &&
          piece.color !== null &&
          validColors.has(piece.color),
      )
      .map((piece) => piece.sourceOrder),
  )
}

function achievementCatalogForOptions(
  concealment: ConcealmentMode | null,
  layers: readonly RevealLayerOption[],
): CourseAchievementCatalog {
  const catalog = emptyCourseAchievementCatalog()
  if (concealment) catalog[concealment] += 1
  for (const layer of layers) {
    catalog[layer.kind] += 1
    if (layer.concealment) catalog[layer.concealment] += 1
  }
  return catalog
}

interface ParsedAchievementOptions {
  catalog: CourseAchievementCatalog
  valid: boolean
  values: string[]
}

function parseAchievementOptions(rawOptions: string): ParsedAchievementOptions {
  const visibility = parseCollectibleOptions(rawOptions)
  const exploration = parseExplorationOptions(visibility.values)
  const concealment = extractConcealmentOptions(exploration.values)
  return {
    catalog: achievementCatalogForOptions(
      concealment.mode,
      exploration.layers,
    ),
    valid:
      visibility.errors.length === 0 &&
      concealment.errors.length === 0,
    values: concealment.values,
  }
}

const CATALOG_NUMBER_LIKE_TOKEN =
  /^[+-]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:e[+-]?\d+)?$/iu

function chestOptionsWithoutAmount(
  rawSpecification: string,
): { options: string; valid: boolean } {
  const tokens = rawSpecification
    .split(";")
    .map((token) => token.trim())
    .filter(Boolean)
  let valid = true

  if (tokens[0] && CATALOG_NUMBER_LIKE_TOKEN.test(tokens[0])) {
    const token = tokens.shift()!
    const amount = Number(token)
    if (
      !/^\d+$/u.test(token) ||
      !Number.isSafeInteger(amount) ||
      amount <= 0
    ) {
      valid = false
    }
  }

  if (tokens.some((token) => CATALOG_NUMBER_LIKE_TOKEN.test(token))) {
    valid = false
  }

  return {
    options: tokens
      .filter((token) => !CATALOG_NUMBER_LIKE_TOKEN.test(token))
      .join("; "),
    valid,
  }
}

function chestAchievementCatalog(
  rawSpecification: string,
): CourseAchievementCatalog | null {
  const amount = chestOptionsWithoutAmount(rawSpecification)
  const parsed = parseAchievementOptions(amount.options)
  if (!amount.valid || !parsed.valid) return null

  const placements = new Set<string>()
  for (const value of parsed.values) {
    const placement =
      resolveSurfaceTarget(value) ?? resolveTemplateTarget(value)
    if (!placement) return null
    placements.add(placement)
  }

  const multiplier = placements.size > 0 ? placements.size : 1
  const catalog = emptyCourseAchievementCatalog()
  addAchievementCatalog(catalog, parsed.catalog, multiplier)
  return catalog
}

function keyAchievementCatalog(
  rawSpecification: string,
): CourseAchievementCatalog | null {
  const parsed = parseAchievementOptions(rawSpecification)
  if (!parsed.valid) return null

  let colorSeen = false
  let placementSeen = false
  for (const value of parsed.values) {
    if (resolveSurfaceTarget(value)) {
      if (placementSeen) return null
      placementSeen = true
      continue
    }
    if (isKeyColorRequest(value)) {
      if (colorSeen) return null
      colorSeen = true
      continue
    }
    return null
  }
  return parsed.catalog
}

function simpleItemAchievementCatalog(
  rawSpecification: string,
): CourseAchievementCatalog | null {
  const parsed = parseAchievementOptions(rawSpecification)
  return parsed.valid && parsed.values.length === 0
    ? parsed.catalog
    : null
}

function revealAchievementCatalog(
  kind: RevealContainerKind,
  rawSpecification: string,
): CourseAchievementCatalog | null {
  const baseOption = kind === "soil" ? "erde" : "pflanze"
  const parsed = parseAchievementOptions(
    rawSpecification.trim()
      ? baseOption + "; " + rawSpecification
      : baseOption,
  )
  const layerTotal = parsed.catalog.soil + parsed.catalog.plant
  if (
    !parsed.valid ||
    parsed.values.length > 0 ||
    layerTotal !== 1 ||
    parsed.catalog[kind] !== 1
  ) {
    return null
  }
  return parsed.catalog
}

function publicItemAchievementCatalog(
  line: string,
): CourseAchievementCatalog | null | undefined {
  const match = ACHIEVEMENT_ITEM_MACRO.exec(line)
  if (!match) return undefined
  const name = match[1].toLocaleLowerCase("de-DE")
  const options = (match[2] ?? "").trim()
  if (
    name === "schatztruhe" ||
    name === "diamanttruhe" ||
    name === "energiekiste"
  ) {
    return chestAchievementCatalog(options)
  }
  if (name === "schluessel") return keyAchievementCatalog(options)
  if (name === "puzzleteil") {
    const parsed = parsePuzzlePieceOptions(options)
    return parsed.valid
      ? achievementCatalogForOptions(parsed.concealment, parsed.layers)
      : null
  }
  return simpleItemAchievementCatalog(options)
}

function internalItemAchievementCatalog(
  line: string,
): CourseAchievementCatalog | null | undefined {
  const chest = INTERNAL_CHEST_MACRO.exec(line)
  if (chest) return chestAchievementCatalog(chest[2])

  const key = INTERNAL_KEY_MACRO.exec(line)
  if (key) return keyAchievementCatalog(key[2])

  const magnifier = INTERNAL_MAGNIFIER_MACRO.exec(line)
  if (magnifier) return simpleItemAchievementCatalog(magnifier[2])

  const tool = INTERNAL_TOOL_MACRO.exec(line)
  if (tool) return simpleItemAchievementCatalog(tool[3])

  return undefined
}

interface AchievementRevealMarker {
  catalog: CourseAchievementCatalog | null
  kind: RevealContainerKind
}

function achievementRevealStart(line: string): AchievementRevealMarker | null {
  const authored = REVEAL_START_MACRO.exec(line)
  if (authored) {
    const kind = revealContainerKind(authored[1])
    return {
      catalog: revealAchievementCatalog(kind, authored[2] ?? ""),
      kind,
    }
  }

  const internal = INTERNAL_REVEAL_START_MACRO.exec(line)
  if (!internal) return null
  const kind = revealContainerKind(internal[2])
  return {
    catalog: revealAchievementCatalog(kind, internal[3]),
    kind,
  }
}

function achievementRevealEnd(line: string): RevealContainerKind | null {
  const authored = REVEAL_END_MACRO.exec(line)
  if (authored) return revealContainerKind(authored[1])
  const internal = INTERNAL_REVEAL_END_MACRO.exec(line)
  return internal ? revealContainerKind(internal[1]) : null
}

function matchingParenthesis(
  line: string,
  openingIndex: number,
): number | null {
  let depth = 0
  for (let index = openingIndex; index < line.length; index += 1) {
    const character = line[index]
    if (character.charCodeAt(0) === 92 && index + 1 < line.length) {
      index += 1
      continue
    }
    if (character === "(") depth += 1
    else if (character === ")") {
      depth -= 1
      if (depth === 0) return index
    }
  }
  return null
}

const DIRECT_HIDDEN_MACROS: Readonly<
  Record<string, ConcealmentMode>
> = {
  unsichtbar: "solid",
  zauberstaub: "dust",
}

const DIRECT_INLINE_REVEAL_MACROS: Readonly<
  Record<string, RevealContainerKind>
> = {
  "erdhaufen.inline": "soil",
  "pflanze.inline": "plant",
  "blume.inline": "plant",
}

function macroArguments(
  line: string,
  openingIndex: number,
  closingIndex: number,
): string[] {
  const arguments_: string[] = []
  let argumentStart = openingIndex + 1
  let depth = 0

  for (let index = argumentStart; index < closingIndex; index += 1) {
    const character = line[index]
    if (character.charCodeAt(0) === 92 && index + 1 < closingIndex) {
      index += 1
      continue
    }
    if (character === "(") {
      depth += 1
      continue
    }
    if (character === ")") {
      depth = Math.max(0, depth - 1)
      continue
    }
    if (character === "," && depth === 0) {
      arguments_.push(line.slice(argumentStart, index).trim())
      argumentStart = index + 1
    }
  }

  arguments_.push(line.slice(argumentStart, closingIndex).trim())
  return arguments_
}

function directHiddenAchievementCatalog(
  line: string,
): CourseAchievementCatalog {
  const catalog = emptyCourseAchievementCatalog()
  const normalized = line.toLocaleLowerCase("de-DE")

  for (let index = 0; index < line.length; index += 1) {
    if (
      line[index] !== "@" ||
      line[index - 1] === "@" ||
      line[index - 1]?.charCodeAt(0) === 92
    ) {
      continue
    }

    for (const [name, mode] of Object.entries(DIRECT_HIDDEN_MACROS)) {
      if (normalized.slice(index + 1, index + 1 + name.length) !== name) {
        continue
      }
      let openingIndex = index + 1 + name.length
      while (/\s/u.test(line[openingIndex] ?? "")) openingIndex += 1
      if (
        line[openingIndex] === "(" &&
        matchingParenthesis(line, openingIndex) !== null
      ) {
        catalog[mode] += 1
      }
      break
    }
  }
  return catalog
}

function directInlineRevealAchievementCatalog(
  line: string,
): CourseAchievementCatalog {
  const catalog = emptyCourseAchievementCatalog()
  const normalized = line.toLocaleLowerCase("de-DE")

  for (let index = 0; index < line.length; index += 1) {
    if (
      line[index] !== "@" ||
      line[index - 1] === "@" ||
      line[index - 1]?.charCodeAt(0) === 92
    ) {
      continue
    }

    for (const [name, kind] of Object.entries(
      DIRECT_INLINE_REVEAL_MACROS,
    )) {
      if (normalized.slice(index + 1, index + 1 + name.length) !== name) {
        continue
      }
      let openingIndex = index + 1 + name.length
      while (/\s/u.test(line[openingIndex] ?? "")) openingIndex += 1
      if (line[openingIndex] !== "(") break
      const closingIndex = matchingParenthesis(line, openingIndex)
      if (closingIndex === null) break

      const options =
        macroArguments(line, openingIndex, closingIndex)[1] ?? ""
      const item = revealAchievementCatalog(kind, options)
      if (item) addAchievementCatalog(catalog, item)
      break
    }
  }

  return catalog
}

interface AchievementCatalogFrame {
  catalog: CourseAchievementCatalog
  marker: AchievementRevealMarker
}

export function parseCourseAchievementCatalog(
  markdown: string,
): CourseAchievementCatalog {
  const catalog = emptyCourseAchievementCatalog()
  const frames: AchievementCatalogFrame[] = []
  const validPuzzleSources = validPuzzleAchievementSourceOrders(markdown)
  const currentCatalog = (): CourseAchievementCatalog =>
    frames[frames.length - 1]?.catalog ?? catalog

  for (const [sourceOrder, line] of visibleCourseLines(markdown).entries()) {
    if (!line.lootIfCatalogEligible) continue
    const start = achievementRevealStart(line.content)
    if (start) {
      frames.push({
        catalog: emptyCourseAchievementCatalog(),
        marker: start,
      })
      continue
    }

    const end = achievementRevealEnd(line.content)
    if (end) {
      const frame = frames[frames.length - 1]
      if (frame?.marker.kind !== end) continue
      frames.pop()
      if (frame.marker.catalog) {
        addAchievementCatalog(frame.catalog, frame.marker.catalog)
        addAchievementCatalog(currentCatalog(), frame.catalog)
      }
      continue
    }

    const invalidPuzzlePiece =
      PUZZLE_PIECE_MACRO.test(line.content) &&
      !validPuzzleSources.has(sourceOrder)
    const publicItem = invalidPuzzlePiece
      ? null
      : publicItemAchievementCatalog(line.content)
    const item =
      publicItem === undefined
        ? internalItemAchievementCatalog(line.content)
        : publicItem
    if (item) addAchievementCatalog(currentCatalog(), item)
    addAchievementCatalog(
      currentCatalog(),
      directInlineRevealAchievementCatalog(line.content),
    )

    const internalHidden = INTERNAL_HIDDEN_MACRO.exec(line.content)
    if (internalHidden) currentCatalog()[internalHidden[2] as ConcealmentMode] += 1
    addAchievementCatalog(
      currentCatalog(),
      directHiddenAchievementCatalog(line.content),
    )
  }

  return catalog
}

export function parseCourseChestDeclarations(
  markdown: string,
  includeGated = true,
): CourseChestDeclaration[] {
  const declarations: CourseChestDeclaration[] = []
  const occurrences = new Map<string, number>()
  for (const line of visibleCourseLines(markdown)) {
    if (!line.lootIfCatalogEligible) continue
    if (!includeGated && (line.revealDepth > 0 || line.lootIfDepth > 0)) {
      continue
    }
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

export function parseCourseKeyDeclarations(
  markdown: string,
  includeGated = true,
): CourseKeyDeclaration[] {
  const declarations: CourseKeyDeclaration[] = []
  const occurrences = new Map<string, number>()
  const occupiedBaseIds = new Set<string>()

  for (const line of visibleCourseLines(markdown)) {
    if (!line.lootIfCatalogEligible) continue
    if (!includeGated && (line.revealDepth > 0 || line.lootIfDepth > 0)) {
      continue
    }
    const match = KEY_MACRO.exec(line.content)
    if (!match) continue

    const options = (match[1] ?? "").trim()
    const invocation = normalizedInvocation("Schluessel", options)
    const occurrence = (occurrences.get(invocation) ?? 0) + 1
    occurrences.set(invocation, occurrence)
    const baseIdStem = `source-key-${hash(invocation)}-${occurrence}`
    let baseId = baseIdStem
    let collision = 1
    while (occupiedBaseIds.has(baseId)) {
      collision += 1
      baseId = `${baseIdStem}-collision-${collision}`
    }
    occupiedBaseIds.add(baseId)
    declarations.push({
      baseId,
      options,
      section: line.section,
    })
  }

  return declarations
}

export function parseCourseLockDeclarations(
  markdown: string,
  includeGated = true,
): CourseLockDeclaration[] {
  const declarations: CourseLockDeclaration[] = []
  const occurrences = new Map<string, number>()

  for (const line of visibleCourseLines(markdown)) {
    if (!line.lootIfCatalogEligible) continue
    if (!includeGated && (line.revealDepth > 0 || line.lootIfDepth > 0)) {
      continue
    }
    const match = LOCK_MACRO.exec(line.content)
    if (!match) continue

    const authored = match[1]
    const separator = authored.indexOf(",")
    const specification =
      separator >= 0
        ? parseLockSpecification(
            authored.slice(0, separator),
            authored.slice(separator + 1),
          )
        : parseLockSpecification(authored)
    const { target } = specification
    const options = specification
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
    if (!line.lootIfCatalogEligible) continue
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
    if (!line.lootIfCatalogEligible) continue
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
    if (!line.lootIfCatalogEligible || line.lootIfDepth > 0) continue
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
      !line.lootIfCatalogEligible ||
      line.lootIfDepth > 0 ||
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

export function parseCoursePuzzleDeclarations(
  markdown: string,
): CoursePuzzleDiscovery {
  const gates: CoursePuzzleGateDeclaration[] = []
  const pieces: CoursePuzzlePieceDeclaration[] = []

  for (const [sourceOrder, line] of visibleCourseLines(markdown).entries()) {
    if (!line.lootIfCatalogEligible || line.section < 0) continue
    const gated = line.revealDepth > 0 || line.lootIfDepth > 0
    const piece = PUZZLE_PIECE_MACRO.exec(line.content)
    if (piece) {
      pieces.push({
        gated,
        options: (piece[1] ?? "").trim(),
        section: line.section,
        sourceOrder,
      })
      continue
    }
    const gate = PUZZLE_GATE_MACRO.exec(line.content)
    if (gate) {
      gates.push({
        gated,
        options: (gate[1] ?? "").trim(),
        section: line.section,
        sourceOrder,
      })
    }
  }

  return { gates, pieces }
}

export function parseCourseAchievementsDeclaration(markdown: string): boolean {
  return visibleCourseLines(markdown).some((line) =>
    line.lootIfCatalogEligible &&
    line.lootIfDepth === 0 &&
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
  return markdown ? parseCourseChestDeclarations(markdown, false) : []
}

export async function discoverCourseKeyDeclarations(): Promise<
  CourseKeyDeclaration[]
> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseKeyDeclarations(markdown, false) : []
}

export async function discoverCourseVersion(): Promise<string | null> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseVersion(markdown) : null
}

export async function discoverCourseLockDeclarations(): Promise<
  CourseLockDeclaration[]
> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseLockDeclarations(markdown, false) : []
}

export async function discoverCourseChests(): Promise<CourseChestDiscovery> {
  const markdown = await loadCourseMarkdown()
  return markdown
    ? {
        declarations: parseCourseChestDeclarations(markdown, false),
        catalog: parseCourseChestCatalogDeclarations(markdown),
      }
    : { declarations: [], catalog: [] }
}

export async function discoverCourseLocks(): Promise<CourseLockDiscovery> {
  const markdown = await loadCourseMarkdown()
  return markdown
    ? {
        declarations: parseCourseLockDeclarations(markdown, false),
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

export async function requireCoursePuzzleDeclarations(): Promise<
  CoursePuzzleDiscovery
> {
  const markdown = await loadCourseMarkdown()
  if (markdown === null) {
    throw new Error("Die LiaScript-Kursquelle konnte nicht geladen werden.")
  }
  return parseCoursePuzzleDeclarations(markdown)
}

export async function discoverCourseAchievementsDeclaration(): Promise<boolean> {
  const markdown = await loadCourseMarkdown()
  return markdown ? parseCourseAchievementsDeclaration(markdown) : false
}

export async function discoverCourseAchievementCatalog(): Promise<
  CourseAchievementCatalog
> {
  const markdown = await loadCourseMarkdown()
  return markdown
    ? parseCourseAchievementCatalog(markdown)
    : emptyCourseAchievementCatalog()
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
