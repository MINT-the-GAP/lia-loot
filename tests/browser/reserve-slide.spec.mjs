import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/reserve-slide.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function solve(quiz, answer) {
  await quiz.getByRole("textbox", { name: "quiz answer" }).fill(answer)
  await quiz.locator(".lia-quiz__check").click()
  await expect(quiz).toHaveClass(/\bsolved\b/u)
}

async function solveAndLeaveSlide(quiz, answer) {
  await quiz.getByRole("textbox", { name: "quiz answer" }).fill(answer)
  await quiz.locator(".lia-quiz__check").click()
}

test("führt bei leerer Energie zur Reserve und danach zur Ausgangsfolie zurück", async ({
  page,
}) => {
  test.setTimeout(140_000)
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Arbeitsfolie" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")

  const energy = page.locator('[data-loot-resource="energy"]')
  await expect(energy).toHaveText("2")

  const reserveLink = page.locator(
    '#lia-toc .lia-toc__content > a[href$="#2"]',
  )
  await expect(reserveLink).toHaveClass(/loot-secret-slide-link/u)
  await expect(reserveLink).toBeHidden()

  const normalQuizzes = page.locator(".lia-quiz")
  await expect(normalQuizzes).toHaveCount(4)
  await solve(normalQuizzes.nth(0), "1")
  await expect(energy).toHaveText("1")
  await solveAndLeaveSlide(normalQuizzes.nth(1), "2")

  await expect(
    page.getByRole("heading", { exact: true, name: "Energiereserve" }),
  ).toBeVisible()
  await expect(energy).toHaveText("0")

  const reserveQuizzes = page.locator(".lia-quiz")
  await expect(reserveQuizzes).toHaveCount(2)
  const firstReserveQuiz = reserveQuizzes.nth(0)
  await firstReserveQuiz
    .getByRole("textbox", { name: "quiz answer" })
    .fill("5")
  await firstReserveQuiz.locator(".lia-quiz__check").click()
  await expect(energy).toHaveText("0")
  await expect(
    page.getByRole("heading", { exact: true, name: "Energiereserve" }),
  ).toBeVisible()

  await solveAndLeaveSlide(firstReserveQuiz, "6")
  await expect(
    page.getByRole("heading", { exact: true, name: "Arbeitsfolie" }),
  ).toBeVisible()
  await expect(energy).toHaveText("2")

  await page.evaluate(() => {
    window.location.hash = "#2"
  })
  await expect
    .poll(() => page.evaluate(() => window.location.hash))
    .not.toBe("#2")
  await expect(
    page.getByRole("heading", { exact: true, name: "Energiereserve" }),
  ).toBeHidden()
  const tocToggle = page.getByRole("button", {
    exact: true,
    name: "Inhaltsverzeichnis",
  })
  if ((await tocToggle.getAttribute("aria-expanded")) !== "true") {
    await tocToggle.click()
  }
  const workSlideLink = page.locator(
    '#lia-toc .lia-toc__content > a[href$="#1"]',
  )
  await expect(workSlideLink).toBeInViewport()
  await workSlideLink.click()
  await expect(
    page.getByRole("heading", { exact: true, name: "Arbeitsfolie" }),
  ).toBeVisible()

  await solve(normalQuizzes.nth(2), "3")
  await expect(energy).toHaveText("1")
  await solveAndLeaveSlide(normalQuizzes.nth(3), "4")
  await expect(
    page.getByRole("heading", { exact: true, name: "Energiereserve" }),
  ).toBeVisible()
  await expect(energy).toHaveText("0")

  await expect(reserveQuizzes.nth(0)).toHaveClass(/\bsolved\b/u)
  await solveAndLeaveSlide(reserveQuizzes.nth(1), "10")
  await expect(
    page.getByRole("heading", { exact: true, name: "Arbeitsfolie" }),
  ).toBeVisible()
  await expect(energy).toHaveText("2")
})
