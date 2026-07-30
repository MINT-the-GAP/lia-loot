export const GLOBAL_LOCK_TARGETS = [
  "toc",
  "mode",
  "menu",
  "translator",
  "classroom",
  "info",
  "seitenwechsel",
] as const

export const LOCAL_LOCK_TARGETS = ["check", "resolve", "hint"] as const

export type GlobalLockTarget = (typeof GLOBAL_LOCK_TARGETS)[number]
export type LocalLockTarget = (typeof LOCAL_LOCK_TARGETS)[number]
export type LockTarget = GlobalLockTarget | LocalLockTarget

const TARGET_ALIASES: Readonly<Record<string, LockTarget>> = {
  toc: "toc",
  inhaltsverzeichnis: "toc",
  mode: "mode",
  darstellung: "mode",
  ansicht: "mode",
  menu: "menu",
  menue: "menu",
  einstellungen: "menu",
  settings: "menu",
  translator: "translator",
  translate: "translator",
  ubersetzer: "translator",
  uebersetzer: "translator",
  sprache: "translator",
  classroom: "classroom",
  klasse: "classroom",
  teilen: "classroom",
  share: "classroom",
  info: "info",
  information: "info",
  informationen: "info",
  seitenwechsel: "seitenwechsel",
  seitennavigation: "seitenwechsel",
  navigation: "seitenwechsel",
  pages: "seitenwechsel",
  page: "seitenwechsel",
  check: "check",
  prufen: "check",
  pruefen: "check",
  resolve: "resolve",
  auflosen: "resolve",
  aufloesen: "resolve",
  losung: "resolve",
  loesung: "resolve",
  solution: "resolve",
  hint: "hint",
  hinweis: "hint",
}

const GLOBAL_TARGET_SET = new Set<LockTarget>(GLOBAL_LOCK_TARGETS)
const LOCAL_TARGET_SET = new Set<LockTarget>(LOCAL_LOCK_TARGETS)

function normalizedTarget(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[\s_-]+/g, "")
}

export function resolveLockTarget(
  value: string | null | undefined,
): LockTarget | null {
  if (!value) return null
  return TARGET_ALIASES[normalizedTarget(value)] ?? null
}

export function isGlobalLockTarget(
  target: LockTarget,
): target is GlobalLockTarget {
  return GLOBAL_TARGET_SET.has(target)
}

export function isLocalLockTarget(
  target: LockTarget,
): target is LocalLockTarget {
  return LOCAL_TARGET_SET.has(target)
}
