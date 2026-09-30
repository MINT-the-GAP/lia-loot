import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/shop.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Loot-Shop" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

test("kauft Items und Perks persistent über das Pixelgebäude", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await ready(page)

  const shop = page.getByRole("button", {
    name: "Loot-Laden mit 8 Angeboten öffnen",
  })
  await expect(shop).toBeVisible()
  await shop.click()

  const dialog = page.getByRole("dialog", { name: "Loot-Laden" })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(".loot-shop-balance")).toContainText("10 Gold")
  await expect(dialog.locator(".loot-shop-balance")).toContainText("3 Diamanten")
  await expect(dialog.locator(".loot-shop-balance")).toContainText("5 Energie")
  const matchingResourceSymbols = await page.evaluate(() => {
    const barGold = document
      .querySelector('[data-loot-resource="coins"]')
      ?.parentElement?.querySelector(".loot-resource-icon")
    const shopGold = document.querySelector(
      ".loot-shop-balance__item.loot-shop-price--gold .loot-resource-icon",
    )
    const barDiamond = document
      .querySelector('[data-loot-resource="gems"]')
      ?.parentElement?.querySelector(".loot-resource-icon")
    const shopDiamond = document.querySelector(
      ".loot-shop-balance__item.loot-shop-price--diamonds .loot-resource-icon",
    )
    return {
      diamond: barDiamond?.innerHTML === shopDiamond?.innerHTML,
      gold: barGold?.innerHTML === shopGold?.innerHTML,
    }
  })
  expect(matchingResourceSymbols).toEqual({ diamond: true, gold: true })

  const shovel = dialog.locator(".loot-shop-offer").filter({ hasText: "Schaufel" })
  await shovel.getByRole("button", { name: "Kaufen" }).click()
  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("7")
  await expect(
    page.getByRole("button", { name: "Schaufel aktivieren" }),
  ).toBeVisible()
  await expect(shovel.getByRole("button", { name: "Gekauft" })).toBeDisabled()

  const perk = dialog
    .locator(".loot-shop-offer")
    .filter({ hasText: "+15 % Lupenradius" })
  await perk.getByRole("button", { name: "Kaufen" }).click()
  await expect(page.locator('[data-loot-resource="gems"]')).toHaveText("1")
  await expect(perk.getByRole("button", { name: "Gekauft" })).toBeDisabled()

  const magnifierOffer = dialog
    .locator(".loot-shop-offer")
    .filter({ hasText: "Lupe" })
    .filter({ hasNotText: "Lupenradius" })
  await magnifierOffer.getByRole("button", { name: "Kaufen" }).click()
  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("6")
  const magnifier = page.getByRole("button", {
    name: /Lupe (?:aktivieren|deaktivieren)/u,
  })
  await expect(magnifier).toBeVisible()

  const energyPerk = dialog
    .locator(".loot-shop-offer")
    .filter({ hasText: "+100 % Energie aus Energiekisten" })
  await energyPerk.getByRole("button", { name: "Kaufen" }).click()
  await expect(page.locator('[data-loot-resource="energy"]')).toHaveText("4")

  const atlasOffer = dialog
    .locator(".loot-shop-offer")
    .filter({ hasText: "Atlaskarte" })
  await atlasOffer.getByRole("button", { name: "Kaufen" }).click()
  await expect(page.getByRole("button", { name: "Atlaskarte öffnen" })).toBeVisible()

  const courseNumbers = dialog
    .locator(".loot-shop-offer")
    .filter({ hasText: "genaue Kurszahlen" })
  await courseNumbers.getByRole("button", { name: "Kaufen" }).click()
  const slideInfo = dialog
    .locator(".loot-shop-offer")
    .filter({ hasText: "Folieninfo" })
  await slideInfo.getByRole("button", { name: "Kaufen" }).click()
  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("3")

  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await expect(shop).toBeFocused()

  const atlas = page.getByRole("button", { name: "Atlaskarte öffnen" })
  await atlas.click()
  const atlasDialog = page.getByRole("dialog", { name: "Atlaskarte" })
  await expect(atlasDialog).toBeVisible()
  await expect(atlasDialog.locator(".loot-atlas-achievement")).toHaveCount(12)
  await expect(atlasDialog.getByText("Energiekisten", { exact: true })).toBeVisible()
  await expect(atlasDialog.locator(".loot-atlas-remaining")).toContainText("Kisten")
  await page.keyboard.press("Escape")
  await expect(atlasDialog).toHaveCount(0)

  await magnifier.click()
  const lens = page.locator("#lia-loot-magnifier-lens")
  await page.mouse.move(500, 300)
  await expect(lens).toBeVisible()
  await expect(lens).toHaveCSS("width", "166px")
  await magnifier.click()

  await page
    .getByRole("button", {
      name: "Energiekiste öffnen und 2 Energiepunkte erhalten",
    })
    .click()
  await expect(page.locator('[data-loot-resource="energy"]')).toHaveText("8")
  await expect(page.getByRole("button", { name: "Atlaskarte öffnen" })).toBeVisible()

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("3")
  await expect(page.locator('[data-loot-resource="gems"]')).toHaveText("1")
  await expect(page.locator('[data-loot-resource="energy"]')).toHaveText("8")

  await page
    .getByRole("button", { name: "Loot-Laden mit 8 Angeboten öffnen" })
    .click()
  const restoredDialog = page.getByRole("dialog", { name: "Loot-Laden" })
  await expect(
    restoredDialog
      .locator(".loot-shop-offer")
      .filter({ hasText: "Schaufel" })
      .getByRole("button", { name: "Gekauft" }),
  ).toBeDisabled()
})
