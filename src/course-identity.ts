export const DEFAULT_LIA_COURSE_VERSION = "0.0.1"

interface LiaCourseRuntime {
  defaultCourseURL?: string
  onReady?: (metadata: unknown) => unknown
}

export interface LiaCourseSourceIdentity {
  version: string
  revision?: string
}

let preparedVersion: string | null = null
let preparedRevision: string | null = null

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
  preparedRevision = null
}

export function setLiaCourseRevision(revision: unknown): void {
  preparedRevision = normalizedVersion(revision)
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
  const versioned =
    `${liaCourseUrl()}::version=${encodeURIComponent(liaCourseVersion())}`
  return preparedRevision
    ? `${versioned}::revision=${encodeURIComponent(preparedRevision)}`
    : versioned
}

function normalizedSourceIdentity(
  value: string | LiaCourseSourceIdentity | null,
): LiaCourseSourceIdentity | null {
  if (typeof value === "string") {
    const version = normalizedVersion(value)
    return version ? { version } : null
  }
  if (!value || typeof value !== "object") return null

  const version = normalizedVersion(value.version)
  const revision = normalizedVersion(value.revision)
  if (!version) return null
  return revision ? { version, revision } : { version }
}

export async function prepareLiaCourseIdentity(
  loadSourceIdentity: () => Promise<
    string | LiaCourseSourceIdentity | null
  >,
  fallbackAfterMs = 15_000,
  sourceGraceAfterReadyMs = 750,
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

  const sourceAttempt = Promise.resolve()
    .then(loadSourceIdentity)
    .then(normalizedSourceIdentity)
    .catch(() => null)
  const sourceIdentity = new Promise<LiaCourseSourceIdentity>((resolve) => {
    void sourceAttempt.then((identity) => {
      if (identity) resolve(identity)
    })
  })
  const fallbackVersion = new Promise<string>((resolve) => {
    fallbackTimer = globalThis.setTimeout(
      () => resolve(DEFAULT_LIA_COURSE_VERSION),
      Math.max(0, fallbackAfterMs),
    )
  })

  const selected = await Promise.race([
    sourceIdentity.then((identity) => ({
      kind: "source" as const,
      identity,
    })),
    readyVersion.then((version) => ({ kind: "ready" as const, version })),
    fallbackVersion.then((version) => ({
      kind: "fallback" as const,
      version,
    })),
  ])

  let identity: LiaCourseSourceIdentity
  if (selected.kind === "source") {
    identity = selected.identity
  } else if (selected.kind === "ready") {
    let graceTimer: ReturnType<typeof globalThis.setTimeout> | null = null
    const duringGrace = await Promise.race([
      sourceAttempt,
      new Promise<null>((resolve) => {
        graceTimer = globalThis.setTimeout(
          () => resolve(null),
          Math.max(0, sourceGraceAfterReadyMs),
        )
      }),
    ])
    if (graceTimer !== null) globalThis.clearTimeout(graceTimer)
    identity = {
      version: selected.version,
      ...(duringGrace?.revision
        ? { revision: duringGrace.revision }
        : {}),
    }
  } else {
    identity = { version: selected.version }
  }

  setLiaCourseVersion(identity.version)
  if (identity.revision) setLiaCourseRevision(identity.revision)

  if (fallbackTimer !== null) globalThis.clearTimeout(fallbackTimer)
  if (lia && readyWrapper && lia.onReady === readyWrapper) {
    lia.onReady = previousReady
  }
  return liaCourseVersion()
}
