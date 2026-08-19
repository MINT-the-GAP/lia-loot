import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/magnifier-chest-click.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function mouseClick(page, locator) {
  await locator.scrollIntoViewIfNeeded()
  const box = await locator.boundingBox()
  expect(box).not.toBeNull()
  if (!box) throw new Error("Das Klickziel hat keine Geometrie.")

  const point = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
  await page.mouse.move(point.x, point.y)
  await page.mouse.down()
  await page.mouse.up()
  return point
}

test("oeffnet eine zauberstaubverdeckte Truhe mit echten Mausereignissen", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Der gemeldete Opera-Fall wird mit der gemeinsamen Chromium-Engine geprueft.",
  )
  test.setTimeout(150_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Truhe unter der Lupe",
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")

  const gold = page.locator('[data-loot-resource="coins"]')
  const chestHost = page.locator(
    'lia-loot-chest[data-loot-concealment="dust"]',
  )
  const chestButton = chestHost.locator("[data-loot-chest-button]")

  await expect(gold).toHaveText("0")
  await expect(chestHost).toHaveCount(1)
  await expect(chestHost).toHaveAttribute("aria-hidden", "true")
  expect(await chestHost.evaluate((element) => element.inert)).toBe(true)

  await mouseClick(page, page.getByRole("button", { name: "Lupe einsammeln" }))
  const magnifier = page.getByRole("button", {
    name: /Lupe (?:aktivieren|deaktivieren)/u,
  })
  await expect(magnifier).toBeVisible()
  await mouseClick(page, magnifier)
  await expect(magnifier).toHaveAttribute("aria-pressed", "true")

  const concealedContent = chestHost.locator(
    ":scope > .loot-magnifier-secret__content",
  )
  await chestButton.evaluate((button) => {
    button.replaceWith(button.cloneNode(true))
  })
  await concealedContent.scrollIntoViewIfNeeded()
  const box = await concealedContent.boundingBox()
  expect(box).not.toBeNull()
  if (!box) throw new Error("Die verdeckte Truhe hat keine Geometrie.")

  const chestCenter = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
  await page.mouse.move(chestCenter.x, chestCenter.y)
  await expect(chestHost).toHaveClass(/loot-magnifier-secret--under-lens/u)
  await expect(chestHost).toHaveAttribute("aria-hidden", "false")
  expect(await chestHost.evaluate((element) => element.inert)).toBe(false)
  await expect(chestButton).toBeVisible()
  await expect(chestButton).toHaveAccessibleName(
    /Schatztruhe .*ffnen und eine Goldm.*nze erhalten/u,
  )

  await page.mouse.down()
  await page.mouse.up()

  await expect(gold).toHaveText("1")
  await expect(chestButton).toHaveCount(0)
})
