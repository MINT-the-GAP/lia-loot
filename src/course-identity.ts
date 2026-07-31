interface LiaCourseRuntime {
  defaultCourseURL?: string
}

export function liaCourseIdentity(): string {
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
