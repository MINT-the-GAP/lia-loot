import type { AchievementDefinition } from "./achievements.ts"

const OVERLAY_ID = "lia-loot-achievement-overlay"

const queue: AchievementDefinition[] = []
let current: AchievementDefinition | null = null

function achievementGraphic(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 48 48")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-achievement__graphic")
  svg.innerHTML = `
    <path class="loot-achievement__burst" d="M20 2h8v5h6v5h5v6h5v12h-5v6h-5v5h-6v5h-8v-5h-6v-5H9v-6H4V18h5v-6h5V7h6z"/>
    <path class="loot-achievement__burst-light" d="M20 7h8v4h6v5h5v16h-5v5h-6v4h-8v-4h-6v-5H9V16h5v-5h6z"/>
    <path class="loot-achievement__star" d="M22 12h4v7h7v4h-4v4h-3v8h-4v-8h-3v-4h-4v-4h7z"/>
  `
  return svg
}

function ensureOverlay(): HTMLElement {
  const existing = document.getElementById(OVERLAY_ID)
  if (existing) return existing

  const overlay = document.createElement("aside")
  overlay.id = OVERLAY_ID
  overlay.className = "loot-achievement"
  overlay.hidden = true
  overlay.setAttribute("aria-label", "Erfolgsmeldung")

  const card = document.createElement("div")
  card.className = "loot-achievement__card"

  const content = document.createElement("div")
  content.className = "loot-achievement__content"
  content.setAttribute("role", "status")
  content.setAttribute("aria-live", "polite")
  content.setAttribute("aria-atomic", "true")

  const text = document.createElement("div")
  text.className = "loot-achievement__text"
  const eyebrow = document.createElement("p")
  eyebrow.className = "loot-achievement__eyebrow"
  eyebrow.textContent = "Erfolg freigeschaltet"
  const title = document.createElement("p")
  title.className = "loot-achievement__title"
  const message = document.createElement("p")
  message.className = "loot-achievement__message"
  text.append(eyebrow, title, message)
  content.append(achievementGraphic(), text)

  const close = document.createElement("button")
  close.type = "button"
  close.className = "loot-achievement__close"
  close.setAttribute("aria-label", "Erfolgsmeldung schließen")
  close.textContent = "×"
  close.addEventListener("click", closeAchievement)

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return
    event.preventDefault()
    closeAchievement()
  })
  card.append(content, close)
  overlay.append(card)
  ;(document.body ?? document.documentElement).append(overlay)
  return overlay
}

function showNext(): void {
  if (current || queue.length === 0) return
  const overlay = ensureOverlay()
  current = queue.shift() ?? null
  if (!current) return

  const title = overlay.querySelector<HTMLElement>(".loot-achievement__title")
  const message = overlay.querySelector<HTMLElement>(
    ".loot-achievement__message",
  )
  if (title) title.textContent = current.title
  if (message) message.textContent = current.message
  overlay.dataset.achievementId = current.id
  overlay.hidden = false
  overlay.classList.remove("loot-achievement--visible")
  void overlay.offsetWidth
  overlay.classList.add("loot-achievement--visible")
}

function closeAchievement(): void {
  if (!current) return
  const overlay = ensureOverlay()
  overlay.classList.remove("loot-achievement--visible")
  overlay.hidden = true
  delete overlay.dataset.achievementId
  current = null
  showNext()
}

export function showAchievement(
  achievement: AchievementDefinition,
): void {
  if (
    current?.id === achievement.id ||
    queue.some((queued) => queued.id === achievement.id)
  ) {
    return
  }
  queue.push(achievement)
  showNext()
}
