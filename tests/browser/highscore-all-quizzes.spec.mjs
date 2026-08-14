import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/highscore-all-quizzes.md"

function editorUrl() {
  const courseUrl = new URL(fixturePath, "http://127.0.0.1:4173").href
  return `${editorPath}?${courseUrl}`
}

async function finishWithAnswer(quiz, answer) {
  await quiz.getByRole("textbox", { name: "quiz answer" }).fill(answer)
  await quiz.locator(".lia-quiz__check").click()
  await expect(quiz).toHaveClass(/\bsolved\b/u)
}

async function settle(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
}

async function highscoreState(page) {
  return page.evaluate(() => {
    const state = window.__LIA_LOOT_HIGHSCORE__?.state()
    return {
      configured: Boolean(state),
      finalScore: state?.finalScore ?? null,
      showCount: window.__lootHighscoreShowCount ?? 0,
    }
  })
}

test("zeigt den Highscore erst nach allen gelösten oder aufgelösten Aufgaben", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Der native LiaScript-Quizabschluss wird einmal im echten Editor geprüft.",
  )
  test.setTimeout(150_000)

  await page.addInitScript(() => {
    window.__lootHighscoreShowCount = 0
    const original = HTMLDialogElement.prototype.showModal
    HTMLDialogElement.prototype.showModal = function showModal() {
      if (this.id === "lia-loot-highscore-dialog") {
        window.__lootHighscoreShowCount += 1
      }
      return original.call(this)
    }
  })

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      name: "Erste Highscore-Aufgabe",
      exact: true,
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect
    .poll(() => highscoreState(page), { timeout: 20_000 })
    .toEqual({ configured: true, finalScore: null, showCount: 0 })

  const quiz = page.locator(".lia-quiz")
  await expect(quiz).toHaveCount(1)

  await page.locator("#lia-btn-next").click()
  await expect(
    page.getByRole("heading", {
      name: "Zweite Highscore-Aufgabe",
      exact: true,
    }),
  ).toBeVisible()
  await expect(quiz).toHaveCount(1)
  await page.locator("#lia-btn-next").click()
  await expect(
    page.getByRole("heading", {
      name: "Letzte Highscore-Aufgabe",
      exact: true,
    }),
  ).toBeVisible()
  await finishWithAnswer(quiz, "33")
  await expect(page.locator("#lia-loot-highscore-dialog")).toHaveCount(0)
  expect(await highscoreState(page)).toEqual({
    configured: true,
    finalScore: null,
    showCount: 0,
  })

  await page.locator("#lia-btn-prev").click()
  await expect(
    page.getByRole("heading", {
      name: "Zweite Highscore-Aufgabe",
      exact: true,
    }),
  ).toBeVisible()
  await page.locator("#lia-btn-prev").click()
  await expect(
    page.getByRole("heading", {
      name: "Erste Highscore-Aufgabe",
      exact: true,
    }),
  ).toBeVisible()
  await finishWithAnswer(quiz, "11")
  await expect(page.locator("#lia-loot-highscore-dialog")).toHaveCount(0)
  expect(await highscoreState(page)).toEqual({
    configured: true,
    finalScore: null,
    showCount: 0,
  })

  await page.locator("#lia-btn-next").click()
  await expect(
    page.getByRole("heading", {
      name: "Zweite Highscore-Aufgabe",
      exact: true,
    }),
  ).toBeVisible()
  await quiz.locator(".lia-quiz__resolve").click()
  await expect(quiz).toHaveClass(/\bresolved\b/u)
  await expect(page.locator("#lia-loot-highscore-dialog")).toHaveCount(1)
  await expect(page.locator("#lia-loot-highscore-dialog[open]")).toHaveCount(1)
  await expect(page.locator("#lia-loot-highscore-points")).toContainText(
    "Punkte",
  )
  await expect
    .poll(() => highscoreState(page))
    .toMatchObject({ configured: true, showCount: 1 })
  expect((await highscoreState(page)).finalScore).toEqual(
    expect.any(Number),
  )

  await page.locator(".loot-highscore-close").click()
  await page.locator("#lia-btn-prev").click()
  await expect(quiz).toHaveClass(/\bsolved\b/u)
  await page.locator("#lia-btn-next").click()
  await expect(quiz).toHaveClass(/\bresolved\b/u)
  await page.locator("#lia-btn-next").click()
  await expect(quiz).toHaveClass(/\bsolved\b/u)
  await settle(page)
  expect((await highscoreState(page)).showCount).toBe(1)
})
