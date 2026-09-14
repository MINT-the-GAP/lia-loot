import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { gardens, gardenIds, expectLockedGarden, navigateGarden, openGarden, persistGardenAttachment, waitForGarden } from './garden-helpers.mjs'

const courseUrl = 'https://raw.githubusercontent.com/MINT-the-GAP/Wochenaufgabe/refs/heads/main/5/Mathematik/Lia5_03.md'
const published = 'https://liascript.github.io/course/?' + courseUrl

// The published renderer and every original course import are real. Only this
// repository's template and built bundle are replaced with the candidate fix.
test('veroeffentlichter Originalkurs mit allen Importen: Garten und Navigation', async ({ page }, testInfo) => {
  test.setTimeout(180_000)
  const served = []
  await page.route('https://raw.githubusercontent.com/MINT-the-GAP/lia-loot/**', async route => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('/README.md') || path.endsWith('/dist/index.js')) {
      const file = path.endsWith('/README.md') ? 'README.md' : 'dist/index.js'
      served.push(file)
      await route.fulfill({ contentType: file.endsWith('.js') ? 'text/javascript' : 'text/markdown', body: await readFile(new URL('../../' + file, import.meta.url), 'utf8') })
    } else await route.continue()
  })
  await page.goto(published + '#1', { timeout: 45_000, waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Wochenaufgabe 3 Klasse 5 \u2013 Mathematik', exact: true })).toBeVisible({ timeout: 70_000 })
  await page.evaluate(() => {
    window.__gardenHiddenMutations = []
    new MutationObserver(mutations => {
      for (const mutation of mutations) if (mutation.target.matches('lia-loot-reveal[data-reveal-layout=inline]')) {
        window.__gardenHiddenMutations.push({ id: mutation.target.getAttribute('data-reveal-id'), old: mutation.oldValue,
          hidden: mutation.target.hidden, initialized: mutation.target.hasAttribute('data-loot-reveal-state'), connected: mutation.target.isConnected })
      }
    }).observe(document.body, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden'] })
  })
  await navigateGarden(page, 8, 'Erholungsgarten')
  await waitForGarden(page)
  await expectLockedGarden(page)
  expect(served).toContain('README.md')
  expect(served).toContain('dist/index.js')
  const ids = await gardenIds(page)
  expect(new Set(ids.map(id => id.reveal)).size).toBe(6)
  expect(new Set(ids.map(id => id.reward)).size).toBe(6)
  await navigateGarden(page, 1, 'Wochenaufgabe 3 Klasse 5 \u2013 Mathematik')
  await navigateGarden(page, 8, 'Erholungsgarten')
  await waitForGarden(page)
  expect(await gardenIds(page)).toEqual(ids)
  await expectLockedGarden(page)
  await openGarden(page)
  const energy = page.locator('[data-loot-resource="energy"]')
  const before = Number(await energy.textContent())
  const chests = gardens(page).locator('[data-loot-chest-button][data-loot-chest-reward="energy"]')
  await expect(chests).toHaveCount(2)
  await chests.first().click()
  await chests.first().click()
  await expect(energy).toHaveText(String(before + 2))
  for (let number = 1; number <= 4; number += 1) {
    await gardens(page).locator(`[data-loot-puzzle-pickup][data-loot-puzzle-number="${number}"]`).click()
    await expect(page.locator(`[data-loot-puzzle-inventory-piece="turquoise:${number}"]`)).toBeVisible()
  }
  await persistGardenAttachment(testInfo, 'published-hidden-mutations-before-reload.json', { body: JSON.stringify(await page.evaluate(() => window.__gardenHiddenMutations), null, 2), contentType: 'application/json' })
  await page.reload({ timeout: 45_000, waitUntil: 'domcontentloaded' })
  await waitForGarden(page)
  expect(await gardenIds(page)).toEqual(ids)
  await expect(energy).toHaveText(String(before + 2))
  await expect(gardens(page).locator('[data-loot-chest-button], [data-loot-puzzle-pickup]')).toHaveCount(0)
  await persistGardenAttachment(testInfo, 'published-garden-visibility.json', { body: JSON.stringify(await page.evaluate(() => ({
    url: location.href,
    hosts: [...document.querySelectorAll('lia-loot-reveal[data-reveal-layout=inline]')].map(host => ({
      id: host.getAttribute('data-reveal-id'), connected: host.isConnected, rendered: host.getAttribute('data-loot-inline-rendered'),
      options: host.getAttribute('data-options'), content: host.querySelector('lia-loot-puzzle-piece')?.getAttribute('data-options') ?? 'energy',
      ancestors: [host, ...function* (element) { while (element.parentElement) { element = element.parentElement; yield element } }(host)]
        .map(element => ({ tag: element.tagName, hidden: element.hidden, inert: element.inert,
          display: getComputedStyle(element).display, visibility: getComputedStyle(element).visibility })),
    })), markers: document.querySelectorAll('[data-loot-inline-renderer], [data-loot-inline-tail]').length,
    hiddenMutations: window.__gardenHiddenMutations ?? [],
  })), null, 2), contentType: 'application/json' })
})
