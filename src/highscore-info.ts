const BOARD_ID = "lia-loot-highscore-info"
const SCORE_REFRESH_INTERVAL = 1_000

export interface HighscoreInfoController {
  owned(): boolean
  score(): number | null
  scoreVisible(): boolean
}

export interface QuizProgressSnapshot {
  completed: number
  percent: number
  total: number
}

let controller: HighscoreInfoController | null = null
let progress: QuizProgressSnapshot = { completed: 0, percent: 0, total: 0 }
let scoreTimer: number | null = null

function naturalScore(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.round(value))
}

function boardElement(): HTMLElement | null {
  return document.getElementById(BOARD_ID)
}

function createBoard(): HTMLElement {
  const board = document.createElement("aside")
  board.id = BOARD_ID
  board.className = "loot-highscore-info"
  board.tabIndex = -1

  const score = document.createElement("p")
  score.className = "loot-highscore-info__score"

  const track = document.createElement("div")
  track.className = "loot-highscore-info__progress"
  track.setAttribute("role", "progressbar")
  track.setAttribute("aria-label", "Gelöste oder aufgelöste Quizze")
  track.setAttribute("aria-valuemin", "0")
  track.setAttribute("aria-valuemax", "100")

  const fill = document.createElement("span")
  fill.className = "loot-highscore-info__progress-fill"
  fill.setAttribute("aria-hidden", "true")

  const value = document.createElement("span")
  value.className = "loot-highscore-info__progress-value"
  value.setAttribute("aria-hidden", "true")

  track.append(fill, value)
  board.append(score, track)
  return board
}

function accessibleLabel(
  snapshot: QuizProgressSnapshot,
  currentScore: number | null,
): string {
  let result = "Quizfortschritt: noch keine bewertbaren Quizze katalogisiert."
  if (snapshot.total > 0) {
    result =
      "Quizfortschritt: " +
      snapshot.percent +
      " Prozent, " +
      snapshot.completed +
      " von " +
      snapshot.total +
      " Quizzen abgeschlossen."
  }
  if (currentScore !== null) {
    result +=
      " Aktueller Highscore: " + naturalScore(currentScore) + " Punkte."
  }
  return result
}

function stopScoreTimer(): void {
  if (scoreTimer === null) return
  window.clearInterval(scoreTimer)
  scoreTimer = null
}

function syncScoreTimer(enabled: boolean): void {
  if (!enabled) {
    stopScoreTimer()
    return
  }
  if (scoreTimer !== null) return
  scoreTimer = window.setInterval(refreshHighscoreInfo, SCORE_REFRESH_INTERVAL)
}

function renderBoard(board: HTMLElement): void {
  if (!controller) return
  const showScore = controller.scoreVisible()
  const currentScore = showScore ? controller.score() : null
  const displayedScore = showScore ? naturalScore(currentScore ?? 0) : null
  const score = board.querySelector<HTMLElement>(
    ".loot-highscore-info__score",
  )
  const track = board.querySelector<HTMLElement>(
    ".loot-highscore-info__progress",
  )
  const fill = board.querySelector<HTMLElement>(
    ".loot-highscore-info__progress-fill",
  )
  const value = board.querySelector<HTMLElement>(
    ".loot-highscore-info__progress-value",
  )

  board.dataset.lootHighscoreValue = String(showScore)
  if (score) {
    score.hidden = !showScore
    score.textContent = displayedScore === null ? "" : String(displayedScore)
  }
  if (track) {
    track.setAttribute("aria-valuenow", String(progress.percent))
    track.setAttribute("aria-valuetext", progress.percent + " Prozent")
  }
  if (fill) fill.style.width = progress.percent + "%"
  if (value) value.textContent = progress.percent + " %"
  board.setAttribute("aria-label", accessibleLabel(progress, displayedScore))
  syncScoreTimer(showScore)
}

export function installHighscoreInfo(
  nextController: HighscoreInfoController,
): void {
  controller = nextController
  refreshHighscoreInfo()
}

export function refreshHighscoreInfo(): void {
  if (!controller || !document.body) return
  const owned = controller.owned()
  document.body.classList.toggle("loot-highscore-info-owned", owned)
  if (!owned) {
    boardElement()?.remove()
    stopScoreTimer()
    return
  }

  const board = boardElement() ?? createBoard()
  if (!board.isConnected) document.body.appendChild(board)
  renderBoard(board)
}

export function updateHighscoreInfoProgress(
  snapshot: QuizProgressSnapshot,
): void {
  const total = Math.max(0, Math.floor(snapshot.total))
  const completed = Math.min(total, Math.max(0, Math.floor(snapshot.completed)))
  progress = {
    completed,
    percent:
      total > 0
        ? Math.max(0, Math.min(100, Math.round((completed / total) * 100)))
        : 0,
    total,
  }
  refreshHighscoreInfo()
}

export function createHighscoreInfoGraphic(
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 96 58")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-highscore-info-graphic")
  svg.innerHTML =
    '<path fill="#3c2415" d="M5 5h86v48H5z"/>' +
    '<path fill="#9a5f2d" d="M9 9h78v18H9z"/>' +
    '<path fill="#805027" d="M9 29h78v20H9z"/>' +
    '<path fill="#c48747" d="M13 12h70v3H13z"/>' +
    '<path fill="#5a341b" d="M14 20h38v3H14zM58 20h24v3H58z"/>' +
    '<path fill="#25180f" d="M15 35h66v9H15z"/>' +
    '<path fill="#3f9d55" d="M18 38h39v3H18z"/>' +
    '<path fill="#e8c56a" d="M10 10h4v4h-4zM82 10h4v4h-4z' +
    'M10 44h4v4h-4zM82 44h4v4h-4z"/>'
  return svg
}
