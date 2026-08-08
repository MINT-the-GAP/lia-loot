import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/pentomino-locks.md"

function editorUrl() {
  const courseUrl = new URL(fixturePath, "http://127.0.0.1:4173").href
  return `${editorPath}?${courseUrl}`
}

async function expectSameBox(target, lock) {
  const [targetBox, lockBox] = await Promise.all([
    target.boundingBox(),
    lock.boundingBox(),
  ])
  expect(targetBox).not.toBeNull()
  expect(lockBox).not.toBeNull()
  for (const property of ["x", "y", "width", "height"]) {
    expect(Math.abs(targetBox[property] - lockBox[property])).toBeLessThanOrEqual(
      1,
    )
  }
}

test("sperrt zwei Pentomino-Quizze derselben Folie unabhängig", async ({
  page,
}) => {
  test.setTimeout(180_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      name: "Zwei unabhängig gesperrte Pentomino-Quizze",
      exact: true,
    }),
  ).toBeVisible({ timeout: 75_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 75_000 },
    )
    .toBe("ready")
  await expect
    .poll(
      () => page.evaluate(() => typeof window.LiaPentomino?.checkQuiz),
      { timeout: 75_000 },
    )
    .toBe("function")

  const quizzes = page.locator(".lia-quiz")
  await expect(quizzes).toHaveCount(2)
  const firstMarker = page.locator(".lia-pentomino-quiz[data-board-id]")
  const secondMarker = page.locator(
    ".lia-pentomino-dock-quiz[data-board-id]",
  )
  const boardHosts = page.locator("jsx-graph")
  const firstBoardHost = boardHosts.nth(0)
  const dockWorkspace = page.locator(".lia-pentomino-workspace")
  await expect(firstMarker).toHaveCount(1)
  await expect(secondMarker).toHaveCount(1)
  await expect(boardHosts).toHaveCount(2)
  await expect(dockWorkspace).toHaveCount(1)

  const locks = page.locator(
    '[data-loot-lock-button][data-loot-lock-target="pentominoquiz"]',
  )
  await expect(locks).toHaveCount(2)
  expect(await quizzes.nth(0).evaluate((element) => element.inert)).toBe(true)
  expect(await quizzes.nth(1).evaluate((element) => element.inert)).toBe(true)
  expect(await firstBoardHost.evaluate((element) => element.inert)).toBe(true)
  expect(await dockWorkspace.evaluate((element) => element.inert)).toBe(true)
  await expectSameBox(firstBoardHost, locks.nth(0))
  await dockWorkspace.scrollIntoViewIfNeeded()
  await expect(locks.nth(1)).toBeVisible()
  await expectSameBox(dockWorkspace, locks.nth(1))
  await firstBoardHost.scrollIntoViewIfNeeded()
  await expect(locks.nth(0)).toBeVisible()

  const firstBoardId = await firstMarker.getAttribute("data-board-id")
  const rotationBefore = await page.evaluate(
    ({ boardId }) => window.LiaPentomino.getPiece(boardId, "Lock-I2").rotation,
    { boardId: firstBoardId },
  )

  await page.getByRole("button", { name: "Roten Schlüssel einsammeln" }).click()
  await locks.nth(0).click()
  await expect(locks).toHaveCount(1)
  expect(await quizzes.nth(0).evaluate((element) => element.inert)).toBe(false)
  expect(await quizzes.nth(1).evaluate((element) => element.inert)).toBe(true)
  expect(await firstBoardHost.evaluate((element) => element.inert)).toBe(false)
  expect(await dockWorkspace.evaluate((element) => element.inert)).toBe(true)

  await firstBoardHost
    .locator(".lia-pentomino-rotate-button > button")
    .click()
  const rotationAfter = await page.evaluate(
    ({ boardId }) => window.LiaPentomino.getPiece(boardId, "Lock-I2").rotation,
    { boardId: firstBoardId },
  )
  expect(rotationAfter).not.toBe(rotationBefore)

  await page.getByRole("button", { name: "Blauen Schlüssel einsammeln" }).click()
  await dockWorkspace.scrollIntoViewIfNeeded()
  await expect(locks).toBeVisible()
  await locks.click()
  await expect(locks).toHaveCount(0)
  expect(await quizzes.nth(1).evaluate((element) => element.inert)).toBe(false)
  expect(await dockWorkspace.evaluate((element) => element.inert)).toBe(false)

  const dockToggle = dockWorkspace.locator(".lia-pentomino-dock-toggle")
  await expect(dockToggle).toHaveAttribute("aria-expanded", "false")
  await dockToggle.click()
  await expect(dockToggle).toHaveAttribute("aria-expanded", "true")
})
