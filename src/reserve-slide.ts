import {
  onCourseMarkdownChange,
  parseCourseReserveSlideDeclarations,
  requireCourseReserveSlideDeclarations,
  type CourseReserveSlideDeclaration,
} from "./course-chests.ts"
import { liaCourseIdentity } from "./course-identity.ts"
import { announceResource } from "./resource-bar.ts"
import {
  permitPortalSlideNavigation,
  permitReserveSlideNavigation,
  registerRenderedReserveSlide,
} from "./secret-slides.ts"
import {
  activeLiaSection,
  observeLiaSlideActivity,
  sectionFromLootId,
} from "./slide-activity.ts"
import { navigateToLiaSection } from "./slide-navigation.ts"

const RESERVE_TAG = "lia-loot-reserve-slide"
const ROUTE_STORAGE_KEY = "lia-loot:reserve-slide-route:v1"
const CONFIGURATION_CHANGED_EVENT = "lia-loot:reserve-slides-changed"
const ROUTE_RETRY_DELAY = 40

interface StoredReserveRoute {
  course: string
  reserveSection: number
  returnSection: number
  version: 1
}

export interface ReserveSlideController {
  currentEnergy(): number | null
  rewardEnergy(amount: number): boolean
  subscribeEnergy(
    listener: (previous: number | null, current: number | null) => void,
  ): () => void
}

let controller: ReserveSlideController | null = null
let selectedDeclaration: CourseReserveSlideDeclaration | null = null
let declaredSections = new Set<number>()
let storedRoute: StoredReserveRoute | null = null
let deferredQuiz: Element | null = null
let routeTimer: number | null = null
let installed = false
let warnedSignature = ""
const rewardedQuizzes = new WeakSet<Element>()

export function selectReserveSlideDeclaration(
  declarations: readonly CourseReserveSlideDeclaration[],
): CourseReserveSlideDeclaration | null {
  if (declarations.length !== 1) return null
  const [declaration] = declarations
  return declaration.energy !== null ? declaration : null
}

export function energyReachedZero(
  previous: number | null,
  current: number | null,
): boolean {
  return previous !== null && previous > 0 && current === 0
}

function courseIdentity(): string {
  return liaCourseIdentity()
}

function removeStoredRoute(): void {
  try {
    window.sessionStorage.removeItem(ROUTE_STORAGE_KEY)
  } catch {
    // The in-memory route still works when storage is disabled.
  }
}

function readStoredRoute(): StoredReserveRoute | null {
  try {
    const raw = window.sessionStorage.getItem(ROUTE_STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<StoredReserveRoute>
    if (
      value.version !== 1 ||
      value.course !== courseIdentity() ||
      !Number.isInteger(value.reserveSection) ||
      (value.reserveSection as number) < 0 ||
      !Number.isInteger(value.returnSection) ||
      (value.returnSection as number) < 0 ||
      value.returnSection === value.reserveSection
    ) {
      removeStoredRoute()
      return null
    }
    return value as StoredReserveRoute
  } catch {
    removeStoredRoute()
    return null
  }
}

function saveStoredRoute(route: StoredReserveRoute): void {
  try {
    window.sessionStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(route))
  } catch {
    // The route remains available in memory for the current page lifecycle.
  }
}

function clearRoute(): void {
  storedRoute = null
  removeStoredRoute()
}

function scheduleRouteSync(): void {
  if (routeTimer !== null) return
  routeTimer = window.setTimeout(() => {
    routeTimer = null
    syncRoute()
  }, 0)
}

function retryRouteSync(): void {
  if (routeTimer !== null) return
  routeTimer = window.setTimeout(() => {
    routeTimer = null
    syncRoute()
  }, ROUTE_RETRY_DELAY)
}

function syncRoute(): void {
  if (!controller || !selectedDeclaration || !storedRoute) return
  if (storedRoute.reserveSection !== selectedDeclaration.section) {
    clearRoute()
    return
  }

  const energy = controller.currentEnergy()
  if (energy === null) {
    clearRoute()
    return
  }

  if (energy > 0) {
    const destination = storedRoute.returnSection
    if (!permitPortalSlideNavigation(destination)) {
      retryRouteSync()
      return
    }
    clearRoute()
    if (activeLiaSection() !== destination) {
      navigateToLiaSection(destination, "replace")
    }
    return
  }

  if (deferredQuiz) return
  const destination = storedRoute.reserveSection
  if (!permitReserveSlideNavigation(destination)) {
    retryRouteSync()
    return
  }
  if (activeLiaSection() !== destination) {
    navigateToLiaSection(destination, "replace")
  }
}

function configureDeclarations(
  declarations: readonly CourseReserveSlideDeclaration[],
): void {
  declaredSections = new Set(
    declarations
      .map((declaration) => declaration.section)
      .filter((section) => Number.isInteger(section) && section >= 0),
  )
  selectedDeclaration = selectReserveSlideDeclaration(declarations)

  const signature = declarations
    .map((declaration) => `${declaration.section}:${declaration.energy ?? "invalid"}`)
    .join(",")
  if (declarations.length > 0 && !selectedDeclaration && warnedSignature !== signature) {
    warnedSignature = signature
    console.warn(
      declarations.length === 1
        ? "Loot: @Reservefolie benötigt genau eine positive ganze Energiebelohnung."
        : "Loot: Pro Kurs ist genau eine @Reservefolie erlaubt.",
    )
  }

  if (
    storedRoute &&
    (!selectedDeclaration ||
      storedRoute.reserveSection !== selectedDeclaration.section)
  ) {
    clearRoute()
  }
  document.dispatchEvent(new CustomEvent(CONFIGURATION_CHANGED_EVENT))
  scheduleRouteSync()
}

function sectionForMarker(marker: HTMLElement): number | null {
  const authoredId = marker.getAttribute("data-reserve-id") ?? ""
  const sourceSection = sectionFromLootId(authoredId)
  if (sourceSection !== null) return sourceSection
  const slide = marker.closest<HTMLElement>("main")
  const container = slide?.parentElement
  if (!slide || !container) return null
  const slides = [...container.children].filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.tagName === "MAIN",
  )
  const section = slides.indexOf(slide)
  return section >= 0 ? section : null
}

function declarationForMarker(
  marker: HTMLElement,
): CourseReserveSlideDeclaration | null {
  const section = sectionForMarker(marker)
  if (section === null) return null
  const literal = marker.getAttribute("data-energy")?.trim() ?? ""
  const amount = /^\+?\d+$/u.test(literal) ? Number(literal) : Number.NaN
  return {
    energy: Number.isSafeInteger(amount) && amount > 0 ? amount : null,
    section,
  }
}

function registerMarker(marker: HTMLElement): void {
  marker.hidden = true
  marker.setAttribute("aria-hidden", "true")
  registerRenderedReserveSlide(marker)
  if (selectedDeclaration) return
  const declaration = declarationForMarker(marker)
  if (declaration) configureDeclarations([declaration])
}

function handleEnergyChange(
  previous: number | null,
  current: number | null,
): void {
  if (energyReachedZero(previous, current)) {
    const reserveSection = selectedDeclaration?.section
    const returnSection = activeLiaSection()
    if (
      reserveSection !== undefined &&
      returnSection !== null &&
      returnSection !== reserveSection &&
      !storedRoute
    ) {
      storedRoute = {
        course: courseIdentity(),
        reserveSection,
        returnSection,
        version: 1,
      }
      saveStoredRoute(storedRoute)
      announceResource("Keine Energie mehr. Reservefolie geöffnet.")
    }
  }
  if (storedRoute && current !== null) scheduleRouteSync()
}

function refreshLiveEditorDeclarations(markdown: string): void {
  configureDeclarations(parseCourseReserveSlideDeclarations(markdown))
}

export function reserveQuizCheckIsFree(quiz: Element): boolean {
  const section = selectedDeclaration?.section
  return Boolean(
    storedRoute &&
      section !== undefined &&
      storedRoute.reserveSection === section &&
      activeLiaSection() === section &&
      quiz.closest("main.lia-slide__content:not([hidden])"),
  )
}

export function deferReserveEntryForQuiz(quiz: Element): void {
  if (!reserveQuizCheckIsFree(quiz)) deferredQuiz = quiz
}

export function settleReserveQuizCheck(quiz: Element): void {
  if (deferredQuiz !== quiz) return
  deferredQuiz = null
  scheduleRouteSync()
}

export function rewardReserveQuiz(quiz: Element): boolean {
  if (
    !controller ||
    !selectedDeclaration ||
    !reserveQuizCheckIsFree(quiz) ||
    rewardedQuizzes.has(quiz)
  ) {
    return false
  }
  if (!controller.rewardEnergy(selectedDeclaration.energy!)) return false
  rewardedQuizzes.add(quiz)
  const amount = selectedDeclaration.energy!
  announceResource(
    amount === 1
      ? "Reservequiz gelöst: einen Energiepunkt erhalten."
      : `Reservequiz gelöst: ${amount} Energiepunkte erhalten.`,
  )
  return true
}

export function reserveSlideCountsForCourseProgress(section: number): boolean {
  return !declaredSections.has(section)
}

export function installReserveSlides(
  nextController: ReserveSlideController,
): void {
  controller = nextController
  if (installed) return
  installed = true
  storedRoute = readStoredRoute()
  controller.subscribeEnergy(handleEnergyChange)
  observeLiaSlideActivity(scheduleRouteSync)
  onCourseMarkdownChange(refreshLiveEditorDeclarations)

  if (!customElements.get(RESERVE_TAG)) {
    class LootReserveSlideElement extends HTMLElement {
      static get observedAttributes(): string[] {
        return ["data-energy", "data-reserve-id"]
      }

      connectedCallback(): void {
        registerMarker(this)
      }

      attributeChangedCallback(): void {
        if (this.isConnected) registerMarker(this)
      }
    }
    customElements.define(RESERVE_TAG, LootReserveSlideElement)
  }

  void requireCourseReserveSlideDeclarations()
    .then(configureDeclarations)
    .catch((error) => {
      console.warn(
        "Loot: Kursquelle für die Reservefolie nicht erneut verfügbar; " +
          "gerenderte Marker bleiben als Fallback aktiv.",
        error,
      )
      scheduleRouteSync()
    })
}
