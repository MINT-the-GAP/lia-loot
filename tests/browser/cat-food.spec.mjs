import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/cat-food.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Katzenfutter" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

test("sammelt Futterbelohnungen automatisch und gruppiert mehrere Portionen", async ({
  page,
}) => {
  test.setTimeout(100_000)
  await page.setViewportSize({ width: 900, height: 650 })
  await ready(page)

  const foodHosts = page.locator("lia-loot-cat-food")
  const foodPickup = page.getByRole("button", {
    exact: true,
    name: "Katzenfutter einsammeln",
  })
  const catPickup = page.getByRole("button", {
    exact: true,
    name: "Pixelkatze einsammeln",
  })
  const companion = page.locator("#lia-loot-cat-companion")
  const energy = page.locator('[data-loot-resource="energy"]')
  const keyInventory = page.locator(
    '#lia-loot-key-inventory [data-loot-key-color="blue"]',
  )

  await expect(foodPickup).toHaveCount(2)
  await expect(catPickup).toBeVisible()
  await expect(energy).toHaveText("0")
  await expect(keyInventory).toHaveCount(0)

  await foodPickup.nth(1).click()
  await foodPickup.nth(0).click()
  const menuControl = page.locator("#lia-loot-cat-food-control")
  const subbar = page.locator("#lia-loot-cat-food-subbar")
  await expect(menuControl).toHaveAttribute(
    "data-loot-cat-food-menu-control",
    "true",
  )
  await expect(subbar).toBeHidden()
  await menuControl.click()
  await expect(menuControl).toHaveAttribute("aria-expanded", "true")
  await expect(subbar).toBeVisible()
  const foodChoices = subbar.locator("[data-loot-cat-food-control]")
  await expect(foodChoices).toHaveCount(2)
  const energyFoodId =
    "cat-food:" + (await foodHosts.nth(0).getAttribute("data-food-id"))
  const energyChoice = subbar.locator(
    `[data-loot-cat-food-control="${energyFoodId}"]`,
  )

  await energyChoice.click()
  await expect(energyChoice).toHaveAttribute("aria-pressed", "false")
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-loot-active-cat-food",
    "",
  )
  await expect(energy).toHaveText("0")

  await catPickup.click()
  await expect(companion).toBeVisible()
  await menuControl.click()
  await expect(subbar).toBeVisible()
  await energyChoice.click()
  await expect(page.locator("html")).toHaveAttribute(
    "data-loot-active-cat-food",
    "",
  )
  const foodCursor = page.locator("#lia-loot-cat-food-cursor")
  await expect(foodCursor).toBeVisible()
  await page.mouse.move(420, 310)
  await expect
    .poll(() => foodCursor.evaluate((element) => element.style.transform))
    .toBe("translate3d(402px, 295px, 0px)")
  await expect
    .poll(() => companion.evaluate((element) => getComputedStyle(element).cursor))
    .toBe("none")
  await expect
    .poll(() =>
      companion.evaluate((element) => getComputedStyle(element).outlineStyle),
    )
    .toBe("none")

  await companion.click()
  await expect(companion).toHaveAttribute("data-cat-state", "eating")
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-loot-active-cat-food",
    "",
  )
  await expect(foodCursor).toBeHidden()
  await expect(foodHosts.nth(0)).toHaveAttribute(
    "data-loot-cat-food-state",
    "feeding",
  )
  await expect(companion.locator(".loot-cat-companion__food")).toHaveCSS(
    "animation-name",
    "loot-cat-food-offer",
  )
  await expect(subbar).toHaveCount(0)
  const directControl = page.locator(
    "#lia-loot-cat-food-control[data-loot-cat-food-control]",
  )
  await expect(directControl).toBeVisible()
  await expect(keyInventory).toHaveCount(0)

  await expect(foodHosts.nth(0)).toHaveAttribute(
    "data-loot-cat-food-state",
    "fed",
    { timeout: 5_000 },
  )
  await expect(energy).toHaveText("1", { timeout: 5_000 })
  await expect(page.locator("[data-loot-chest-button]")).toBeHidden()
  const rewardMessage = companion.locator(".loot-cat-companion__message")
  await expect(rewardMessage).toHaveText("+1")
  await expect(rewardMessage).toHaveAttribute("aria-label", "+1 Energie")
  await expect(
    rewardMessage.locator(".loot-resource-icon--energy"),
  ).toBeVisible()

  await directControl.click()
  await expect(page.locator("html")).toHaveAttribute(
    "data-loot-active-cat-food",
    "",
  )
  await companion.click()
  await expect(foodHosts.nth(1)).toHaveAttribute(
    "data-loot-cat-food-state",
    "fed",
    { timeout: 5_000 },
  )
  await expect(keyInventory).toBeVisible({ timeout: 5_000 })
  await expect(page.locator("[data-loot-key-button]")).toBeHidden()
  await expect(companion.locator(".loot-cat-companion__message")).toHaveText(
    "+1 Blauer Schlüssel",
  )
  await expect(menuControl).toHaveCount(0)
  await expect(page.locator("body")).not.toContainText(/content,?\)/u)

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(foodHosts).toHaveCount(2)
  await expect(foodHosts.nth(0)).toHaveAttribute(
    "data-loot-cat-food-state",
    "fed",
  )
  await expect(foodHosts.nth(1)).toHaveAttribute(
    "data-loot-cat-food-state",
    "fed",
  )
  await expect(foodPickup).toHaveCount(0)
  await expect(menuControl).toHaveCount(0)
  await expect(subbar).toHaveCount(0)
  await expect(companion).toBeVisible()
  await expect(energy).toHaveText("1")
  await expect(keyInventory).toBeVisible()
  await expect(page.locator("body")).not.toContainText(/content,?\)/u)
})
