import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/highscore-info.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function collect(page, name) {
  const pickup = page.getByRole("button", { exact: true, name })
  await expect(pickup).toBeVisible()
  await pickup.click()
  await expect(pickup).toHaveCount(0, { timeout: 5_000 })
}

async function solveQuiz(page, answer) {
  const quiz = page.locator(".lia-quiz")
  await quiz.getByRole("textbox", { name: "quiz answer" }).fill(answer)
  await quiz.locator(".lia-quiz__check").click()
  await expect(quiz).toHaveClass(/\bsolved\b/u)
}

test("zeigt Quizfortschritt, optionalen Highscore und die Katze auf dem Schild", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await page.setViewportSize({ width: 900, height: 650 })
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Erstes Quiz" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")

  const board = page.locator("#lia-loot-highscore-info")
  const bar = board.getByRole("progressbar")
  await expect(board).toHaveCount(0)

  const itemPickup = page.getByRole("button", {
    exact: true,
    name: "Highscore-Schild einsammeln",
  })
  await expect(itemPickup).toHaveAttribute(
    "data-loot-bonus-kind",
    "highscore-info",
  )
  await expect(itemPickup.locator(".loot-bonus-pickup__chip")).toHaveCount(0)
  const valuePerk = page.getByRole("button", {
    exact: true,
    name: "Perk „Highscorewert“ einsammeln",
  })
  await expect(valuePerk.locator(".loot-bonus-pickup__chip")).toHaveText("WERT")

  await collect(page, "Highscore-Schild einsammeln")
  await expect(board).toBeVisible()
  await expect(bar).toHaveAttribute("aria-valuenow", "0")
  await expect(board).toHaveAccessibleName(/0 von 3 Quizzen/u)
  await expect(board.locator(".loot-highscore-info__score")).toBeHidden()

  await collect(page, "Perk „Highscorewert“ einsammeln")
  const score = board.locator(".loot-highscore-info__score")
  await expect(score).toHaveText("0")

  await collect(page, "Pixelkatze einsammeln")
  const companion = page.locator("#lia-loot-cat-companion")
  await expect(companion).toBeVisible()
  const positions = await page.evaluate(() => {
    const boardElement = document.getElementById("lia-loot-highscore-info")
    const catElement = document.getElementById("lia-loot-cat-companion")
    const scoreElement = boardElement?.querySelector(
      ".loot-highscore-info__score",
    )
    const progressElement = boardElement?.querySelector(
      ".loot-highscore-info__progress-value",
    )
    const boardBox = boardElement?.getBoundingClientRect()
    const catBox = catElement?.getBoundingClientRect()
    return boardBox && catBox && scoreElement && progressElement
      ? {
          boardTop: boardBox.top,
          boardHeight: boardBox.height,
          boardWidth: boardBox.width,
          catBottom: catBox.bottom,
          catWidth: catBox.width,
          progressFontSize: Number.parseFloat(
            getComputedStyle(progressElement).fontSize,
          ),
          scoreFontSize: Number.parseFloat(
            getComputedStyle(scoreElement).fontSize,
          ),
        }
      : null
  })
  expect(positions).not.toBeNull()
  expect(positions.boardHeight).toBeGreaterThan(40)
  expect(positions.scoreFontSize).toBeGreaterThan(10)
  expect(positions.progressFontSize).toBeGreaterThan(7)
  expect(Math.abs(positions.boardWidth - positions.catWidth)).toBeLessThan(1)
  expect(positions.catBottom).toBeLessThanOrEqual(positions.boardTop + 20)

  await solveQuiz(page, "11")
  await expect(bar).toHaveAttribute("aria-valuenow", "33")

  await page.locator("#lia-btn-next").click()
  await expect(
    page.getByRole("heading", { exact: true, name: "Zweites Quiz" }),
  ).toBeVisible()
  await expect(score).toHaveText(/^\d+$/u)
  await expect(score).not.toHaveText("0")
  await page.locator(".lia-quiz__resolve").click()
  await expect(page.locator(".lia-quiz")).toHaveClass(/\bresolved\b/u)
  await expect(bar).toHaveAttribute("aria-valuenow", "67")

  await page.locator("#lia-btn-next").click()
  await expect(
    page.getByRole("heading", { exact: true, name: "Drittes Quiz" }),
  ).toBeVisible()
  await solveQuiz(page, "33")
  await expect(bar).toHaveAttribute("aria-valuenow", "100")
})
