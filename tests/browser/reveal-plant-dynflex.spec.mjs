import { expect, test } from './playwright-fixtures.mjs'

const url = '/node_modules/@liascript/editor/dist/index.html?http://127.0.0.1:4173/tests/browser/fixtures/reveal-plant-dynflex.md#1'

test('Pflanze verbirgt beide Aufgaben im DynFlex bis zum Oeffnen', async ({ page }) => {
  test.setTimeout(90_000)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /Gie.*kanne einsammeln/u }).click()
  await page.evaluate(() => { location.hash = '2' })
  await expect(page.getByRole('heading', { name: 'Aufgabe 6: Kreis, Zylinder und Kegel' })).toBeVisible({ timeout: 55_000 })
  await expect.poll(() => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status)).toBe('ready')

  const plant = page.locator('lia-loot-reveal[data-loot-reveal-kind="plant"]')
  const flex = page.locator('section.dynFlex')
  const tasks = flex.locator(':scope > .flex-child')
  await expect(tasks).toHaveCount(2)
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'locked')
  await expect(flex).toHaveAttribute('data-loot-reveal-range-blocked', 'true')
  await expect(flex).not.toBeVisible()
  await expect(tasks.nth(0)).not.toBeVisible()
  await expect(tasks.nth(1)).not.toBeVisible()

  await page.getByRole('button', { name: /Gie.*kanne aktivieren/u }).click()
  await plant.getByRole('button', { name: 'Pflanze mit Gießkanne gießen' }).click()
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'bloomed')
  await expect(flex).not.toBeVisible()
  await plant.getByRole('button', { name: 'Blühende Pflanze öffnen' }).click()
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'revealed')
  await expect(flex).not.toHaveAttribute('data-loot-reveal-range-blocked')
  await expect(tasks.nth(0)).toBeVisible()
  await expect(tasks.nth(1)).toBeVisible()
  await expect(flex.locator('.lia-quiz')).toHaveCount(2)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'revealed')
  await expect(tasks.nth(0)).toBeVisible()
  await expect(tasks.nth(1)).toBeVisible()
})
