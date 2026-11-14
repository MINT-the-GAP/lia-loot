import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/start-inventory.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Startfolie" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

async function expectInitialInventory(page, scoreExpectation = /^\d+$/u) {
  const board = page.locator("#lia-loot-highscore-info")
  await expect(board).toBeVisible()
  await expect(board.locator(".loot-highscore-info__score")).toHaveText(
    scoreExpectation,
  )
  await expect(page.locator("#lia-loot-cat-companion")).toBeVisible()
  await expect(page.locator("#lia-loot-atlas-tool")).toBeVisible()
  await expect(page.locator("#lia-loot-magnifier-tool")).toHaveAccessibleName(
    "Lupe aktivieren",
  )
  await expect(page.locator("#lia-loot-flashlight-tool")).toHaveAccessibleName(
    "Taschenlampe aktivieren",
  )
  await expect(page.locator("#lia-loot-shovel-tool")).toHaveAccessibleName(
    "Schaufel aktivieren",
  )
  await expect(page.locator("#lia-loot-watering-can-tool")).toHaveAccessibleName(
    "Gießkanne aktivieren",
  )
  await expect(page.locator("#lia-loot-axe-tool")).toHaveAccessibleName(
    "Steinaxt aktivieren",
  )
  await expect(
    page.locator('#lia-loot-key-inventory [data-loot-key-color="red"]'),
  ).toHaveCount(1)
  await expect(
    page.locator(
      '[data-loot-puzzle-inventory-piece="blue:1"]',
    ),
  ).toBeVisible()
  await expect(page.locator("#lia-loot-resource-status")).not.toContainText(
    /gefunden|eingesammelt/iu,
  )
}

test("stellt spätere Startinventar-Makros sofort, still und reload-sicher bereit", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await page.setViewportSize({ width: 900, height: 650 })
  await ready(page)
  await expectInitialInventory(page, "0")

  const quiz = page.locator(".lia-quiz")
  await quiz.getByRole("textbox", { name: "quiz answer" }).fill("12")
  await quiz.locator(".lia-quiz__check").click()
  await expect(quiz).toHaveClass(/\bsolved\b/u)
  await expect(
    page.locator("#lia-loot-highscore-info [role='progressbar']"),
  ).toHaveAttribute("aria-valuenow", "50")

  await page.locator("#lia-btn-next").click()
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Startausstattung und Highscore",
    }),
  ).toBeVisible()
  await expect(
    page.locator(
      "lia-loot-bonus button, lia-loot-magnifier button, lia-loot-flashlight button, lia-loot-tool button, lia-loot-cat button, lia-loot-key button, [data-loot-puzzle-pickup]",
    ),
  ).toHaveCount(0)
  const score = page.locator(
    "#lia-loot-highscore-info .loot-highscore-info__score",
  )
  await expect(score).toHaveText(/^\d+$/u)
  await expect(score).not.toHaveText("0")

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expectInitialInventory(page)
})
