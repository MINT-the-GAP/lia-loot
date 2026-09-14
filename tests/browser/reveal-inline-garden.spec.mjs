import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { expect, test } from './playwright-fixtures.mjs'
import { gardenContents, gardenIds, gardenPayload, gardens, gardenUrl, expectLockedGarden, installGardenProbe, navigateGarden, openGarden, persistGardenAttachment, waitForGarden } from './garden-helpers.mjs'

test('erhaelt die Originalabsaetze einschliesslich Quellzeilen und Leerraum', async () => {
  const source = (await readFile(new URL('./fixtures/reveal-inline-garden.md', import.meta.url), 'utf8')).replace(/\r\n/gu, '\n')
  const lines = source.split('\n')
  const start = lines.indexOf('## Erholungsgarten')
  expect(lines[start + 2].startsWith('Du betrittst einen Garten')).toBe(true)
  expect(lines[start + 2].endsWith('preisgibt. ')).toBe(true)
  expect(lines[start + 7]).toBe(' @Erdhaufen.inline( @Puzzleteil(tuerkis; 1) ) @Pflanze.inline( @Puzzleteil(tuerkis; 2) ) @Pflanze.inline( @Puzzleteil(tuerkis; 3) ) @Erdhaufen.inline( @Puzzleteil(tuerkis; 4) )')
  expect(createHash('sha256').update(lines.slice(start, start + 10).join('\n')).digest('hex')).toBe('8b340a44579b3f2518ea623ca4dd48c5db5f4fc2971f049f895de9da6929f998')
})

test('Garten: Erstbesuch, spaetere Folie, sechs Freigaben, Reload und Rueckkehr ohne doppelte Belohnung', async ({ page }, testInfo) => {
  test.setTimeout(180_000)
  await page.addInitScript(installGardenProbe)
  await page.goto(gardenUrl(), { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Gartenregression', exact: true })).toBeVisible({ timeout: 55_000 })
  await navigateGarden(page, 2, 'Erholungsgarten')
  await waitForGarden(page)
  await expectLockedGarden(page)
  const ids = await gardenIds(page)
  for (const property of ['reveal', 'reward']) {
    expect(new Set(ids.map(id => id[property])).size).toBe(6)
    expect(ids.every(id => id[property] && !id[property].startsWith('-1_'))).toBe(true)
  }
  await gardens(page).first().getByRole('button', { name: 'Erdhaufen mit Schaufel wegbuddeln' }).click()
  await expect(gardens(page).first()).toHaveAttribute('data-loot-reveal-state', 'locked')
  await openGarden(page)
  const energy = page.locator('[data-loot-resource="energy"]')
  const chestButtons = page.locator('[data-loot-chest-button][data-loot-chest-reward="energy"]')
  await expect(chestButtons).toHaveCount(2)
  await chestButtons.first().click()
  await expect(energy).toHaveText('1')
  await chestButtons.first().click()
  await expect(energy).toHaveText('2')
  await expect(chestButtons).toHaveCount(0)
  for (let number = 1; number <= 4; number += 1) {
    await page.locator(`[data-loot-puzzle-pickup][data-loot-puzzle-number="${number}"]`).click()
    await expect(page.locator(`[data-loot-puzzle-inventory-piece="turquoise:${number}"]`)).toBeVisible()
  }
  for (const action of ['reload', 'return']) {
    if (action === 'reload') await page.reload({ waitUntil: 'domcontentloaded' })
    else {
      await navigateGarden(page, 3, 'Nach dem Garten')
      await navigateGarden(page, 1, 'Gartenregression')
      await navigateGarden(page, 2, 'Erholungsgarten')
    }
    await waitForGarden(page)
    expect(await gardenIds(page)).toEqual(ids)
    for (let index = 0; index < 6; index += 1) {
      await expect(gardens(page).nth(index)).toHaveAttribute('data-loot-reveal-state', 'revealed')
      // Collected rewards leave an empty payload with no visible box.
      await expect(gardenPayload(page, index)).not.toHaveAttribute('hidden')
      await expect(gardenPayload(page, index)).toHaveAttribute('aria-hidden', 'false')
      expect(await gardenPayload(page, index).evaluate(element => element.inert)).toBe(false)
    }
    await expect(energy).toHaveText('2')
    await expect(chestButtons).toHaveCount(0)
    await expect(page.locator('[data-loot-puzzle-pickup]')).toHaveCount(0)
    await expect(page.locator('[data-loot-puzzle-inventory-piece]')).toHaveCount(4)
  }
  await persistGardenAttachment(testInfo, 'garden-lifecycle.json', { body: JSON.stringify(await page.evaluate(() => window.__gardenSnapshot()), null, 2), contentType: 'application/json' })
})

test('ordnet einen waehrend der asynchronen Quellaufloesung ersetzten Host erneut zu', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  await page.addInitScript(installGardenProbe, { fault: 'replacement' })
  await page.goto(gardenUrl(2), { waitUntil: 'domcontentloaded' })
  await waitForGarden(page)
  await expectLockedGarden(page)
  const events = await page.evaluate(() => window.__gardenEvents)
  expect(events.filter(event => event.event === 'replacement')).toEqual([{ event: 'replacement', id: '1_2', connected: false }])
  const rendered = events.filter(event => event.event === 'liascript')
  expect(rendered.map(event => event.content)).toEqual(gardenContents)
  expect(new Set(rendered.map(event => event.id)).size).toBe(6)
  expect(rendered.find(event => event.id === '1_2').initialConnected).toBe(false)
  await openGarden(page)
  await persistGardenAttachment(testInfo, 'garden-replacement.json', { body: JSON.stringify(await page.evaluate(() => window.__gardenSnapshot()), null, 2), contentType: 'application/json' })
})

test('fehlende dynamische Ausgabe bleibt auf eine Instanz begrenzt', async ({ page }) => {
  test.setTimeout(90_000)
  await page.addInitScript(installGardenProbe, { fault: 'output' })
  await page.goto(gardenUrl(2), { waitUntil: 'domcontentloaded' })
  const paragraph = page.locator('p.lia-paragraph').filter({ hasText: 'Du betrittst einen Garten' })
  await expect(paragraph).toBeVisible({ timeout: 55_000 })
  await expect(gardens(page).first()).toHaveAttribute('data-loot-inline-error', 'output', { timeout: 20_000 })
  await expect(paragraph).toBeVisible()
  await expect(page.getByText('Bei der Gartenarbeit findest du au\u00dferdem vier Puzzleteile:', { exact: true })).toBeVisible()
  for (let index = 1; index < 6; index += 1) {
    await expect(gardens(page).nth(index)).toBeVisible()
    await expect(gardens(page).nth(index)).toHaveAttribute('data-loot-inline-rendered', 'true')
    await expect(gardenPayload(page, index)).not.toBeVisible()
  }
  await expect(page.locator('[data-loot-inline-renderer], [data-loot-inline-tail]')).toHaveCount(0)
})

test('scheiternde Quellaufloesung blendet die Gartenabsaetze nicht aus', async ({ page }) => {
  test.setTimeout(90_000)
  await page.addInitScript(() => {
    const original = window.fetch.bind(window)
    window.__gardenSourceFailures = 0
    window.fetch = (input, options) => {
      if (String(input).includes('reveal-inline-garden.md') && options?.cache === 'no-cache') {
        window.__gardenSourceFailures += 1
        return Promise.reject(new Error('Injected course source failure'))
      }
      return original(input, options)
    }
  })
  await page.goto(gardenUrl(2), { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Erholungsgarten', exact: true })).toBeVisible({ timeout: 55_000 })
  await expect.poll(() => page.evaluate(() => window.__gardenSourceFailures)).toBeGreaterThan(0)
  await expect(page.locator('p.lia-paragraph').filter({ hasText: 'Du betrittst einen Garten' })).toBeVisible()
  await expect(gardens(page).first()).toHaveAttribute('data-loot-inline-error', 'source', { timeout: 25_000 })
  await expect(page.locator('p.lia-paragraph').filter({ hasText: 'Du betrittst einen Garten' })).toBeVisible()
  await expect(page.locator('[data-loot-inline-renderer]')).toHaveCount(0)
  for (const tail of await page.locator('[data-loot-inline-tail]').all()) await expect(tail).not.toBeVisible()
  await expect(page.locator('[data-loot-chest-button], [data-loot-puzzle-pickup]')).toHaveCount(0)
})

test('spaet fehlender Host blockiert weder Nachbarn noch deren Zuordnung', async ({ page }) => {
  test.setTimeout(90_000)
  await page.addInitScript(installGardenProbe, { fault: 'delayed-host' })
  await page.goto(gardenUrl(2), { waitUntil: 'domcontentloaded' })
  await expect.poll(() => page.locator('lia-loot-reveal[data-loot-inline-rendered="true"]').count(), { timeout: 8_000 }).toBe(5)
  await expect(gardens(page)).toHaveCount(5)
  for (const host of await gardens(page).all()) await expect(host).toBeVisible()
  await expect(gardens(page).first()).toHaveAttribute('data-loot-reveal-kind', 'plant')
  await expect(gardens(page).first().locator('lia-loot-chest[data-reward="energy"]')).toHaveCount(1)
  for (let index = 1; index < 5; index += 1) await expect(gardens(page).nth(index).locator('lia-loot-puzzle-piece')).toHaveAttribute('data-options', `tuerkis; ${index}`)
  await page.evaluate(() => window.__restoreGardenHost())
  await waitForGarden(page)
  await expectLockedGarden(page)
})
