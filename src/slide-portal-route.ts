export type SlidePortalRoutePhase = "pending" | "arrived"

export interface SlidePortalRoute {
  expiresAt: number
  phase: SlidePortalRoutePhase
  portalId: string
  sourceSection: number
  targetSection: number
  version: 1
}

export interface SlidePortalRouteTransition {
  route: SlidePortalRoute | null
  showReturn: boolean
}

const ROUTE_STORAGE_PREFIX = "lia-loot:slide-portal-route:v1:"

function routeStorageKey(): string {
  return `${ROUTE_STORAGE_PREFIX}${encodeURIComponent(liaCourseIdentity())}`
}

export function normalizeSlidePortalRoute(
  value: unknown,
  now = Date.now(),
): SlidePortalRoute | null {
  if (!value || typeof value !== "object") return null
  const route = value as Record<string, unknown>
  if (
    route.version !== 1 ||
    typeof route.portalId !== "string" ||
    route.portalId.trim().length === 0 ||
    !Number.isInteger(route.sourceSection) ||
    Number(route.sourceSection) < 0 ||
    !Number.isInteger(route.targetSection) ||
    Number(route.targetSection) < 0 ||
    route.sourceSection === route.targetSection ||
    (route.phase !== "pending" && route.phase !== "arrived") ||
    typeof route.expiresAt !== "number" ||
    !Number.isFinite(route.expiresAt) ||
    route.expiresAt <= now
  ) {
    return null
  }

  return {
    expiresAt: route.expiresAt,
    phase: route.phase,
    portalId: route.portalId.trim(),
    sourceSection: Number(route.sourceSection),
    targetSection: Number(route.targetSection),
    version: 1,
  }
}

export function transitionSlidePortalRoute(
  route: SlidePortalRoute,
  activeSection: number | null,
): SlidePortalRouteTransition {
  if (activeSection === null) return { route, showReturn: false }

  if (route.phase === "pending") {
    if (activeSection === route.sourceSection) {
      return { route, showReturn: false }
    }
    if (activeSection === route.targetSection) {
      return {
        route: { ...route, phase: "arrived" },
        showReturn: true,
      }
    }
    return { route: null, showReturn: false }
  }

  if (activeSection === route.targetSection) {
    return { route, showReturn: true }
  }
  return { route: null, showReturn: false }
}

export function loadSlidePortalRoute(): SlidePortalRoute | null {
  try {
    const raw = window.sessionStorage.getItem(routeStorageKey())
    if (!raw) return null
    const route = normalizeSlidePortalRoute(JSON.parse(raw))
    if (!route) window.sessionStorage.removeItem(routeStorageKey())
    return route
  } catch {
    return null
  }
}

export function saveSlidePortalRoute(route: SlidePortalRoute): void {
  try {
    window.sessionStorage.setItem(routeStorageKey(), JSON.stringify(route))
  } catch {
    // The in-memory route remains available when storage is disabled.
  }
}

export function clearSlidePortalRoute(): void {
  try {
    window.sessionStorage.removeItem(routeStorageKey())
  } catch {
    // Nothing else to clear when storage is disabled.
  }
}
import { liaCourseIdentity } from "./course-identity.ts"
