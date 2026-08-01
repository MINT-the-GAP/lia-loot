export const DEFAULT_LIA_COURSE_VERSION = "0.0.1"

interface LiaCourseRuntime {
  defaultCourseURL?: string
  onReady?: (metadata: unknown) => unknown
}

let preparedVersion: string | null = null

function normalizedVersion(value: unknown): string | null {
  if (typeof value !== "string") return null
  const version = value.trim()
  if (
    version.length === 0 ||
    version.length > 128 ||
    /[\u0000-\u001f\u007f]/u.test(version)
  ) {
    return null
  }
  return version
}

export function courseVersionFromMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") return null
  const record = metadata as Record<string, unknown>
  const direct = normalizedVersion(record.version)
  if (direct) return direct

  for (const key of ["course", "definition", "meta", "metadata"] as const) {
    const nested = record[key]
    if (!nested || typeof nested !== "object") continue
    const version = normalizedVersion(
      (nested as Record<string, unknown>).version,
    )
    if (version) return version
  }
  return null
}

export function setLiaCourseVersion(version: unknown): void {
  preparedVersion = normalizedVersion(version) ?? DEFAULT_LIA_COURSE_VERSION
}

export function liaCourseVersion(): string {
  return preparedVersion ?? DEFAULT_LIA_COURSE_VERSION
}

function liaCourseUrl(): string {
  const lia = (window as Window & { LIA?: LiaCourseRuntime }).LIA
  const configured = lia?.defaultCourseURL?.trim()
  try {
    const url = new URL(configured || window.location.href, window.location.href)
    url.hash = ""
    return url.href
  } catch {
    return configured || `${window.location.pathname}${window.location.search}`
  }
}

export function liaCourseIdentity(): string {
  return `${liaCourseUrl()}::version=${encodeURIComponent(liaCourseVersion())}`
}

export async function prepareLiaCourseIdentity(
  loadSourceVersion: () => Promise<string | null>,
  fallbackAfterMs = 15_000,
): Promise<string> {
  if (preparedVersion) return preparedVersion

  const lia = (window as Window & { LIA?: LiaCourseRuntime }).LIA
  const previousReady = lia?.onReady
  let readyWrapper: ((metadata: unknown) => unknown) | null = null
  let fallbackTimer: ReturnType<typeof globalThis.setTimeout> | null = null

  const readyVersion = new Promise<string>((resolve) => {
    if (!lia) return
    readyWrapper = (metadata: unknown): unknown => {
      const version = courseVersionFromMetadata(metadata)
      if (version) resolve(version)
      return previousReady?.call(lia, metadata)
    }
    lia.onReady = readyWrapper
  })

  const sourceVersion = new Promise<string>((resolve) => {
    void Promise.resolve()
      .then(loadSourceVersion)
      .then((version) => {
        const normalized = normalizedVersion(version)
        if (normalized) resolve(normalized)
      })
      .catch(() => {
        // Ready metadata or the bounded fallback still determine the version.
      })
  })
  const fallbackVersion = new Promise<string>((resolve) => {
    fallbackTimer = globalThis.setTimeout(
      () => resolve(DEFAULT_LIA_COURSE_VERSION),
      Math.max(0, fallbackAfterMs),
    )
  })

  const version = await Promise.race([
    readyVersion,
    sourceVersion,
    fallbackVersion,
  ])
  setLiaCourseVersion(version)

  if (fallbackTimer !== null) globalThis.clearTimeout(fallbackTimer)
  if (lia && readyWrapper && lia.onReady === readyWrapper) {
    lia.onReady = previousReady
  }
  return liaCourseVersion()
}
