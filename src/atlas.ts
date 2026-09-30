import { ACHIEVEMENTS, type AchievementProgressSnapshot } from "./achievements.ts"
import { createAtlasGraphic } from "./atlas-visual.ts"
import { concealmentIdOf, concealmentModeOf } from "./concealment.ts"
import {
  discoverCourseAchievementCatalog,
  discoverCourseChests,
  discoverCourseLocks,
  discoverCourseSecretSlideDeclarations,
  requireCoursePuzzleDeclarations,
  type CourseChestDeclaration,
  type CourseLockDeclaration,
} from "./course-chests.ts"
import type { ExplorationState } from "./exploration-store.ts"
import {
  isGlobalLockTarget,
  isTemplateLockTarget,
  resolveLockTarget,
} from "./lock-targets.ts"
import { buildPuzzleCatalog, type PuzzleCatalog } from "./puzzle-catalog.ts"
import { installResourceBar, refreshResourceBarVisibility } from "./resource-bar.ts"
import { activeLiaSection } from "./slide-activity.ts"
import { templateTargetDefinition } from "./template-targets.ts"
import { courseChestUnitCounts, parseTreasureChestOptions } from "./treasure-chest.ts"
import { courseLockUnitCount } from "./object-lock.ts"
import {
  ACHIEVEMENT_IDS,
  type AchievementId,
  type PuzzleState,
  type ResourceCounts,
  type ResourceKind,
} from "./types.ts"

const ATLAS_TOOL_ID = "lia-loot-atlas-tool"
const ATLAS_TITLE_ID = "lia-loot-atlas-title"

export interface AtlasRuntimeSnapshot {
  collectedChestIds: readonly string[]
  exploration: ExplorationState
  puzzle: PuzzleState
  unlockedLockIds: readonly string[]
}

export interface AtlasController {
  achievements(): AchievementProgressSnapshot
  courseCountsUnlocked(): boolean
  owned(): boolean
  runtime(): AtlasRuntimeSnapshot
  slideInfoUnlocked(): boolean
}

interface AtlasChestInstance {
  id: string
  reward: ResourceKind
  section: number
}

interface AtlasLockInstance {
  id: string
  section: number
}

interface AtlasCourseCatalog {
  achievementTotals: {
    dust: number
    plant: number
    soil: number
    solid: number
  }
  chestInstances: AtlasChestInstance[]
  chestTotals: ResourceCounts
  lockInstances: AtlasLockInstance[]
  lockTotal: number
  puzzle: PuzzleCatalog
  secretSlides: number
}

interface AtlasRemainingItem {
  count: number
  label: string
}

interface ActiveAtlasDialog {
  opener: HTMLButtonElement
  overlay: HTMLDivElement
}

let controller: AtlasController | null = null
let catalog: AtlasCourseCatalog | null = null
let catalogFailed = false
let catalogPromise: Promise<void> | null = null
let activeDialog: ActiveAtlasDialog | null = null
let keyListenerInstalled = false

function sourceChestInstances(
  declarations: readonly CourseChestDeclaration[],
): AtlasChestInstance[] {
  const instances: AtlasChestInstance[] = []
  for (const declaration of declarations) {
    const parsed = parseTreasureChestOptions(declaration.placement)
    if (!parsed.valid || parsed.inline) continue
    for (const placement of new Set(parsed.placements)) {
      instances.push({
        id: `${declaration.baseId}:${placement}`,
        reward: declaration.reward,
        section: declaration.section,
      })
    }
  }
  return instances
}

function sourceLockInstance(
  declaration: CourseLockDeclaration,
): AtlasLockInstance | null {
  const target = resolveLockTarget(declaration.target)
  if (!target) return null
  if (isGlobalLockTarget(target)) {
    if (!declaration.onlyOnSlide) return null
    return {
      id: `lock:${target}:section-${declaration.section}:${declaration.color}`,
      section: declaration.section,
    }
  }
  if (!isTemplateLockTarget(target)) return null
  const scope = templateTargetDefinition(target).scope
  if (scope === "global" && !declaration.onlyOnSlide) return null
  return {
    id: `lock:${target}:section-${declaration.section}:${declaration.color}`,
    section: declaration.section,
  }
}

async function loadCourseCatalog(): Promise<void> {
  if (catalogPromise) return catalogPromise
  catalogPromise = (async () => {
    try {
      const [chests, locks, secretSlides, puzzleDiscovery, achievementTotals] =
        await Promise.all([
          discoverCourseChests(),
          discoverCourseLocks(),
          discoverCourseSecretSlideDeclarations(),
          requireCoursePuzzleDeclarations(),
          discoverCourseAchievementCatalog(),
        ])
      catalog = {
        achievementTotals,
        chestInstances: sourceChestInstances(chests.catalog),
        chestTotals: courseChestUnitCounts(chests.catalog),
        lockInstances: locks.catalog
          .map(sourceLockInstance)
          .filter((item): item is AtlasLockInstance => item !== null),
        lockTotal: courseLockUnitCount(locks.catalog),
        puzzle: buildPuzzleCatalog(puzzleDiscovery),
        secretSlides: secretSlides.length,
      }
    } catch {
      catalogFailed = true
    }
    if (activeDialog) renderDialog(false)
  })()
  return catalogPromise
}

function closeDialog(): void {
  const active = activeDialog
  if (!active) return
  activeDialog = null
  active.overlay.remove()
  document.body.classList.remove("loot-atlas-open")
  if (active.opener.isConnected) active.opener.focus({ preventScroll: true })
}

function focusableElements(): HTMLElement[] {
  if (!activeDialog) return []
  return [...activeDialog.overlay.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hidden)
}

function installKeyListener(): void {
  if (keyListenerInstalled) return
  keyListenerInstalled = true
  document.addEventListener("keydown", (event) => {
    if (!activeDialog) return
    if (event.key === "Escape") {
      event.preventDefault()
      closeDialog()
      return
    }
    if (event.key !== "Tab") return
    const focusable = focusableElements()
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
}

function statusText(
  id: AchievementId,
  progress: AchievementProgressSnapshot[AchievementId],
  exact: boolean,
): string {
  if (progress.unlocked) {
    return exact && progress.total !== null
      ? `Erreicht · ${Math.min(progress.current, progress.total)} / ${progress.total}`
      : "Erreicht"
  }
  if (progress.total === null) return "Fortschritt wird geladen"
  if (!progress.available) return "Nicht in diesem Kurs"
  if (exact) return `${Math.min(progress.current, progress.total)} / ${progress.total}`
  return id === "perfect-highscore" ? "Noch nicht erreicht" : "Noch offen"
}

function achievementCard(
  id: AchievementId,
  progress: AchievementProgressSnapshot[AchievementId],
  exact: boolean,
  ownerDocument: Document,
): HTMLElement {
  const card = ownerDocument.createElement("article")
  card.className = "loot-atlas-achievement"
  if (progress.unlocked) card.classList.add("loot-atlas-achievement--complete")
  if (!progress.available) card.classList.add("loot-atlas-achievement--absent")
  const badge = ownerDocument.createElement("span")
  badge.className = "loot-atlas-achievement__badge"
  badge.textContent = progress.unlocked ? "✓" : "·"
  badge.setAttribute("aria-hidden", "true")
  const copy = ownerDocument.createElement("div")
  const heading = ownerDocument.createElement("h3")
  heading.textContent = ACHIEVEMENTS[id].title
  const status = ownerDocument.createElement("p")
  status.textContent = statusText(id, progress, exact)
  copy.append(heading, status)
  card.append(badge, copy)
  if (exact && progress.total !== null && progress.total > 0) {
    const meter = ownerDocument.createElement("div")
    meter.className = "loot-atlas-achievement__meter"
    meter.setAttribute("role", "progressbar")
    meter.setAttribute("aria-label", `${ACHIEVEMENTS[id].title}: ${progress.current} von ${progress.total}`)
    meter.setAttribute("aria-valuemin", "0")
    meter.setAttribute("aria-valuemax", String(progress.total))
    meter.setAttribute("aria-valuenow", String(Math.min(progress.current, progress.total)))
    const fill = ownerDocument.createElement("span")
    fill.style.width = `${Math.min(100, (progress.current / progress.total) * 100)}%`
    meter.appendChild(fill)
    card.appendChild(meter)
  }
  return card
}

function lockedPanel(
  title: string,
  text: string,
  ownerDocument: Document,
): HTMLElement {
  const panel = ownerDocument.createElement("section")
  panel.className = "loot-atlas-locked"
  const heading = ownerDocument.createElement("h3")
  heading.textContent = title
  const copy = ownerDocument.createElement("p")
  copy.textContent = text
  panel.append(heading, copy)
  return panel
}

function numberCard(
  label: string,
  value: number,
  ownerDocument: Document,
): HTMLElement {
  const item = ownerDocument.createElement("div")
  item.className = "loot-atlas-number"
  const amount = ownerDocument.createElement("strong")
  amount.textContent = value.toLocaleString("de-DE")
  const caption = ownerDocument.createElement("span")
  caption.textContent = label
  item.append(amount, caption)
  return item
}

function courseNumbersSection(ownerDocument: Document): HTMLElement {
  if (!controller?.courseCountsUnlocked()) {
    return lockedPanel(
      "Genaue Kurszahlen",
      "Dieser Bereich wird mit dem Perk „Atlas-Kurszahlen“ freigeschaltet.",
      ownerDocument,
    )
  }
  const section = ownerDocument.createElement("section")
  section.className = "loot-atlas-section loot-atlas-course-numbers"
  const title = ownerDocument.createElement("h2")
  title.textContent = "Kursbestand"
  section.appendChild(title)
  if (!catalog) {
    const loading = ownerDocument.createElement("p")
    loading.className = "loot-atlas-loading"
    loading.textContent = catalogFailed
      ? "Die Kurszahlen konnten nicht geladen werden."
      : "Die Kurszahlen werden geladen …"
    section.appendChild(loading)
    return section
  }
  const numbers = ownerDocument.createElement("div")
  numbers.className = "loot-atlas-numbers"
  const chestTotal = Object.values(catalog.chestTotals).reduce(
    (sum, count) => sum + count,
    0,
  )
  const validGates = catalog.puzzle.gates.filter((gate) => gate.valid && gate.color)
  const validColors = new Set(validGates.map((gate) => gate.color))
  const puzzlePieces = catalog.puzzle.pieces.filter(
    (piece) => piece.valid && piece.color && validColors.has(piece.color),
  ).length
  ;[
    ["Kisten gesamt", chestTotal],
    ["Schatztruhen", catalog.chestTotals.gold],
    ["Diamanttruhen", catalog.chestTotals.diamonds],
    ["Energiekisten", catalog.chestTotals.energy],
    ["Geheimfolien", catalog.secretSlides],
    ["Puzzletore", validGates.length],
    ["Puzzleteile", puzzlePieces],
    ["Schlösser", catalog.lockTotal],
    ["Unsichtbare Objekte", catalog.achievementTotals.solid],
    ["Zauberstaub-Objekte", catalog.achievementTotals.dust],
    ["Erdschichten", catalog.achievementTotals.soil],
    ["Pflanzen", catalog.achievementTotals.plant],
  ].forEach(([label, value]) =>
    numbers.appendChild(numberCard(String(label), Number(value), ownerDocument)),
  )
  section.appendChild(numbers)
  return section
}

function activeSlide(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    ".lia-slide__container > main.lia-slide__content:not([hidden]), main.lia-slide__content:not([hidden])",
  )
}

function inlineChestRemaining(
  slide: HTMLElement,
  collected: ReadonlySet<string>,
): number {
  let count = 0
  for (const host of slide.querySelectorAll<HTMLElement>("lia-loot-chest")) {
    const parsed = parseTreasureChestOptions(host.getAttribute("data-placement") ?? "")
    const baseId = host.getAttribute("data-chest-id")?.trim() ?? ""
    if (parsed.valid && parsed.inline && baseId && !baseId.startsWith("@")) {
      if (!collected.has(`${baseId}:inline`)) count += 1
    }
  }
  return count
}

function localLockRemaining(
  slide: HTMLElement,
  unlocked: ReadonlySet<string>,
): { count: number; ids: Set<string> } {
  const ids = new Set<string>()
  for (const button of slide.querySelectorAll<HTMLElement>("[data-loot-lock-id]")) {
    const id = button.dataset.lootLockId?.trim()
    if (id && !unlocked.has(id)) ids.add(id)
  }
  return { count: ids.size, ids }
}

function explorationRemaining(
  slide: HTMLElement,
  state: ExplorationState,
): AtlasRemainingItem[] {
  const soil = new Set<string>()
  const plant = new Set<string>()
  for (const cover of slide.querySelectorAll<HTMLElement>("[data-loot-reveal-cover]")) {
    const id = cover.dataset.lootRevealCover?.trim()
    if (!id) continue
    if (cover.classList.contains("loot-reveal-cover--soil")) {
      if (!state.dugLayers.includes(id)) soil.add(id)
    } else if (!state.wateredPlants.includes(id)) {
      plant.add(id)
    }
  }

  const solid = new Set<string>()
  const dust = new Set<string>()
  for (const host of slide.querySelectorAll<HTMLElement>("[data-loot-concealment]")) {
    const mode = concealmentModeOf(host)
    const id = concealmentIdOf(host)
    if (!mode || !id) continue
    if (mode === "solid" && !state.foundInvisibleObjects.includes(id)) solid.add(id)
    if (mode === "dust" && !state.foundDustObjects.includes(id)) dust.add(id)
  }
  return [
    { count: solid.size, label: "unsichtbare Objekte" },
    { count: dust.size, label: "Zauberstaub-Objekte" },
    { count: soil.size, label: "Erdschichten" },
    { count: plant.size, label: "Pflanzen" },
  ]
}

function currentSlideRemaining(): AtlasRemainingItem[] | null {
  if (!catalog || !controller) return null
  const section = activeLiaSection()
  const slide = activeSlide()
  if (section === null || !slide) return null
  const runtime = controller.runtime()
  const collected = new Set(runtime.collectedChestIds)
  const unlocked = new Set(runtime.unlockedLockIds)
  const sourceChests = catalog.chestInstances.filter(
    (item) => item.section === section && !collected.has(item.id),
  ).length
  const inlineChests = inlineChestRemaining(slide, collected)
  const localLocks = localLockRemaining(slide, unlocked)
  const sourceLocks = new Set(
    catalog.lockInstances
      .filter(
        (item) =>
          item.section === section &&
          !unlocked.has(item.id) &&
          !localLocks.ids.has(item.id),
      )
      .map((item) => item.id),
  )
  const validGates = catalog.puzzle.gates.filter(
    (gate) => gate.valid && gate.color !== null,
  )
  const validColors = new Set(validGates.map((gate) => gate.color!))
  const pieces = catalog.puzzle.pieces.filter(
    (piece) =>
      piece.section === section &&
      piece.valid &&
      piece.color !== null &&
      piece.number !== null &&
      validColors.has(piece.color) &&
      !runtime.puzzle.collected[piece.color].includes(piece.number),
  ).length
  const gates = validGates.filter(
    (gate) =>
      gate.section === section &&
      gate.color !== null &&
      !runtime.puzzle.solvedGates.includes(gate.color),
  ).length
  return [
    { count: sourceChests + inlineChests, label: "Kisten" },
    { count: pieces, label: "Puzzleteile" },
    { count: gates, label: "Puzzletore" },
    { count: localLocks.count + sourceLocks.size, label: "Schlösser" },
    ...explorationRemaining(slide, runtime.exploration),
  ]
}

function slideInfoSection(ownerDocument: Document): HTMLElement {
  if (!controller?.slideInfoUnlocked()) {
    return lockedPanel(
      "Auf dieser Folie sind noch …",
      "Dieser Bereich wird mit dem Perk „Atlas-Folieninfo“ freigeschaltet.",
      ownerDocument,
    )
  }
  const section = ownerDocument.createElement("section")
  section.className = "loot-atlas-section loot-atlas-slide-info"
  const title = ownerDocument.createElement("h2")
  const activeSection = activeLiaSection()
  title.textContent = activeSection === null
    ? "Auf dieser Folie sind noch …"
    : `Auf Folie ${activeSection + 1} sind noch …`
  section.appendChild(title)
  const remaining = currentSlideRemaining()
  if (!remaining) {
    const loading = ownerDocument.createElement("p")
    loading.className = "loot-atlas-loading"
    loading.textContent = catalogFailed
      ? "Die Folieninformationen sind nicht verfügbar."
      : "Die Folieninformationen werden geladen …"
    section.appendChild(loading)
    return section
  }
  const openItems = remaining.filter((item) => item.count > 0)
  if (openItems.length === 0) {
    const complete = ownerDocument.createElement("p")
    complete.className = "loot-atlas-slide-complete"
    complete.textContent = "Keine offenen Atlas-Funde mehr auf dieser Folie."
    section.appendChild(complete)
    return section
  }
  const list = ownerDocument.createElement("ul")
  list.className = "loot-atlas-remaining"
  openItems.forEach((item) => {
    const row = ownerDocument.createElement("li")
    const count = ownerDocument.createElement("strong")
    count.textContent = String(item.count)
    row.append(count, ownerDocument.createTextNode(item.label))
    list.appendChild(row)
  })
  section.appendChild(list)
  return section
}

function renderDialog(initial: boolean): void {
  if (!activeDialog || !controller) return
  const ownerDocument = activeDialog.overlay.ownerDocument
  const panel = ownerDocument.createElement("section")
  panel.className = "loot-atlas-dialog"
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-modal", "true")
  panel.setAttribute("aria-labelledby", ATLAS_TITLE_ID)

  const header = ownerDocument.createElement("header")
  header.className = "loot-atlas-dialog__header"
  const emblem = createAtlasGraphic(ownerDocument)
  emblem.classList.add("loot-atlas-dialog__emblem")
  const heading = ownerDocument.createElement("h2")
  heading.id = ATLAS_TITLE_ID
  heading.textContent = "Atlaskarte"
  const intro = ownerDocument.createElement("p")
  intro.textContent = "Dein aktueller Weg durch den Kurs."
  const headerCopy = ownerDocument.createElement("div")
  headerCopy.append(heading, intro)
  const close = ownerDocument.createElement("button")
  close.type = "button"
  close.className = "loot-atlas-dialog__close"
  close.setAttribute("aria-label", "Atlaskarte schließen")
  close.textContent = "×"
  close.addEventListener("click", closeDialog)
  header.append(emblem, headerCopy, close)

  const achievements = ownerDocument.createElement("section")
  achievements.className = "loot-atlas-section loot-atlas-achievement-map"
  const achievementTitle = ownerDocument.createElement("h2")
  achievementTitle.textContent = "Erfolge"
  const grid = ownerDocument.createElement("div")
  grid.className = "loot-atlas-achievements"
  const progress = controller.achievements()
  const exact = controller.courseCountsUnlocked()
  ACHIEVEMENT_IDS.forEach((id) =>
    grid.appendChild(achievementCard(id, progress[id], exact, ownerDocument)),
  )
  achievements.append(achievementTitle, grid)

  const body = ownerDocument.createElement("div")
  body.className = "loot-atlas-dialog__body"
  body.append(
    achievements,
    courseNumbersSection(ownerDocument),
    slideInfoSection(ownerDocument),
  )
  panel.append(header, body)
  activeDialog.overlay.replaceChildren(panel)
  if (initial) close.focus({ preventScroll: true })
}

function openDialog(opener: HTMLButtonElement): void {
  closeDialog()
  const overlay = opener.ownerDocument.createElement("div")
  overlay.className = "loot-atlas-overlay"
  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) closeDialog()
  })
  opener.ownerDocument.body.appendChild(overlay)
  opener.ownerDocument.body.classList.add("loot-atlas-open")
  activeDialog = { opener, overlay }
  installKeyListener()
  renderDialog(true)
  void loadCourseCatalog()
}

function renderAtlasTool(): void {
  if (!controller?.owned()) {
    document.getElementById(ATLAS_TOOL_ID)?.remove()
    if (activeDialog) closeDialog()
    refreshResourceBarVisibility()
    return
  }
  let button = document.getElementById(ATLAS_TOOL_ID) as HTMLButtonElement | null
  if (!button) {
    button = document.createElement("button")
    button.id = ATLAS_TOOL_ID
    button.type = "button"
    button.className = "loot-atlas-tool"
    button.dataset.lootAtlasTool = "true"
    button.setAttribute("aria-label", "Atlaskarte öffnen")
    button.appendChild(createAtlasGraphic())
    button.addEventListener("click", () => openDialog(button!))
    installResourceBar().appendChild(button)
  }
  refreshResourceBarVisibility()
}

export function refreshAtlas(): void {
  renderAtlasTool()
  if (activeDialog) renderDialog(false)
}

export function installAtlas(nextController: AtlasController): void {
  controller = nextController
  renderAtlasTool()
  if (controller.owned()) void loadCourseCatalog()
}
