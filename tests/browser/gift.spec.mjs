import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/gift.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Geschenke" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

test("aktiviert verpackte Items erst beim Öffnen und merkt sich das Geschenk", async ({
  page,
}) => {
  test.setTimeout(90_000)
  await ready(page)

  const gifts = page.locator("lia-loot-gift")
  const giftButtons = page.getByRole("button", {
    exact: true,
    name: "Geschenk öffnen",
  })
  const cat = page.getByRole("button", {
    exact: true,
    name: "Pixelkatze einsammeln",
  })
  const key = page.locator("[data-loot-key-button]")

  await expect(gifts).toHaveCount(2)
  await expect(giftButtons).toHaveCount(2)
  await expect(cat).toHaveCount(0)
  await expect(key).toHaveCount(0)

  await giftButtons.first().click()
  await expect(gifts.first()).toHaveAttribute(
    "data-loot-gift-state",
    "opening",
  )
  await expect(gifts.first()).toHaveAttribute(
    "data-loot-gift-state",
    "opened",
  )
  await expect(cat).toBeVisible()
  await expect(page.locator("lia-loot-cat")).toHaveAttribute(
    "data-cat-id",
    "0_1_content",
  )
  await expect(page.locator("body")).not.toContainText(/content,?\)/u)
  await expect(key).toHaveCount(0)

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(gifts.first()).toHaveAttribute(
    "data-loot-gift-state",
    "opened",
  )
  await expect(cat).toBeVisible()
  await expect(giftButtons).toHaveCount(1)

  await giftButtons.click()
  await expect(key).toBeVisible()
  await expect(page.locator("[data-loot-key-color='blue']")).toBeVisible()
  await expect(page.locator("lia-loot-key")).toHaveAttribute(
    "data-key-id",
    "0_3_content",
  )
  await expect(page.locator("body")).not.toContainText(/content,?\)/u)
})
