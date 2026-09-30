import { expect, test } from "./playwright-fixtures.mjs"

const fixtureUrl = "/tests/browser/fixtures/coordinate-plant.html"

async function waitForRuntime(page) {
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 15_000 },
    )
    .toBe("ready")
}

test("laesst die Pflanze einer coordinate-Schatztruhe mit der Maus bedienen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 760 })
  await page.goto(fixtureUrl)
  await waitForRuntime(page)

  const portal = page.locator(
    '[data-loot-chest-template-target="coordinate"]',
  )
  const plant = portal.locator('[data-loot-reveal-kind="plant"]')
  const plantButton = plant.locator('[data-loot-reveal-cover-slot] button')

  await expect(portal).toHaveCount(1)
  await expect(portal).toHaveClass(/loot-chest-placement--template/u)
  await expect(plant).toHaveAttribute("data-loot-reveal-state", "locked")
  await expect(plantButton).toBeVisible()

  await page.locator('[data-loot-tool-pickup]').click()
  await page.locator('[data-loot-tool-control="watering-can"]').click()
  await plantButton.click()
  await expect(plant).toHaveAttribute("data-loot-reveal-state", "bloomed")

  await plantButton.click()
  await expect(plant).toHaveAttribute("data-loot-reveal-state", "revealed")

  const chest = portal.locator('[data-loot-chest-button]')
  await expect(chest).toBeVisible()
  await chest.click()
  await expect(chest).toHaveCount(0)
})
