import { expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export async function persistGardenAttachment(testInfo, name, attachment) {
  const path = testInfo.outputPath(name)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, attachment.body)
  await testInfo.attach(name, { path, contentType: attachment.contentType })
}
export const gardenFixture = '/tests/browser/fixtures/reveal-inline-garden.md'
export const gardenSelector = 'lia-loot-reveal[data-reveal-layout="inline"]'
export const gardenKinds = ['soil', 'plant', 'soil', 'plant', 'plant', 'soil']
export const gardenContents = ['@Energiekiste', '@Energiekiste', '@Puzzleteil(tuerkis; 1)', '@Puzzleteil(tuerkis; 2)', '@Puzzleteil(tuerkis; 3)', '@Puzzleteil(tuerkis; 4)']
export const gardenUrl = (slide = 1) => '/node_modules/@liascript/editor/dist/index.html?http://127.0.0.1:4173' + gardenFixture + '#' + slide
export const gardens = page => page.locator(gardenSelector)
export const gardenPayload = (page, index) => gardens(page).nth(index).locator(':scope > [data-loot-reveal-payload]')
export async function navigateGarden(page, slide, heading) {
  await page.evaluate(slide => { location.hash = String(slide) }, slide)
  await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible({ timeout: 55_000 })
}
export async function waitForGarden(page) {
  await expect(page.getByRole('heading', { name: 'Erholungsgarten', exact: true })).toBeVisible({ timeout: 55_000 })
  await expect.poll(() => page.evaluate(() => ({
    rendered: document.querySelectorAll('lia-loot-reveal[data-loot-inline-rendered="true"]').length,
    chests: document.querySelectorAll('lia-loot-reveal[data-reveal-layout=inline] lia-loot-chest[data-reward="energy"]').length,
    pieces: document.querySelectorAll('lia-loot-reveal[data-reveal-layout=inline] lia-loot-puzzle-piece').length,
    markers: document.querySelectorAll('[data-loot-inline-renderer], [data-loot-inline-tail]').length,
  })), { timeout: 55_000 }).toEqual({ rendered: 6, chests: 2, pieces: 4, markers: 0 })
  await expect(gardens(page)).toHaveCount(6)
  for (const host of await gardens(page).all()) {
    await expect(host).toBeVisible()
    await expect(host).not.toHaveAttribute('hidden')
    await expect(host).toHaveCSS('display', 'inline-grid')
  }
  expect(await gardens(page).evaluateAll(hosts => hosts.map(host => host.getAttribute('data-loot-reveal-kind')))).toEqual(gardenKinds)
  for (let index = 2; index < 6; index += 1) await expect(gardenPayload(page, index).locator('lia-loot-puzzle-piece')).toHaveAttribute('data-options', `tuerkis; ${index - 1}`)
  const prose = page.locator('p.lia-paragraph').filter({ hasText: 'Du betrittst einen Garten' })
  await expect(prose).toBeVisible()
  await expect(prose).toContainText('beseitigt werden. Anschlie\u00dfend solltest du')
  await expect(prose).toContainText('Pfl\u00fccke die Blume, sodass sie ihre Geheimnisse preisgibt.')
  const puzzleParagraph = gardens(page).nth(2).locator('xpath=..')
  await expect(puzzleParagraph).toBeVisible()
  expect(await puzzleParagraph.evaluate(element => {
    const copy = element.cloneNode(true)
    copy.querySelectorAll('lia-loot-reveal').forEach(host => host.remove())
    return copy.textContent.trim()
  })).toBe('')
}
export async function gardenIds(page) {
  return gardens(page).evaluateAll(hosts => hosts.map(host => ({
    reveal: host.getAttribute('data-reveal-id'),
    reward: host.querySelector('lia-loot-chest')?.getAttribute('data-chest-id') ?? host.querySelector('lia-loot-puzzle-piece')?.getAttribute('data-piece-id'),
  })))
}
export async function expectLockedGarden(page) {
  for (let index = 0; index < 6; index += 1) {
    const host = gardens(page).nth(index), payload = gardenPayload(page, index)
    await expect(host).toHaveAttribute('data-loot-reveal-state', 'locked')
    await expect(host.locator('[data-loot-reveal-cover]')).toBeVisible()
    await expect(payload).toHaveAttribute('hidden', '')
    await expect(payload).toHaveAttribute('aria-hidden', 'true')
    expect(await payload.evaluate(element => element.inert)).toBe(true)
    await expect(payload).not.toBeVisible()
  }
}
export async function openGarden(page) {
  await page.getByRole('button', { name: 'Schaufel einsammeln' }).click()
  await page.getByRole('button', { name: /Gie.*kanne einsammeln/u }).click()
  await page.locator('[data-loot-tool-control="shovel"]').click()
  for (const index of [0, 2, 5]) {
    await gardens(page).nth(index).getByRole('button', { name: 'Erdhaufen mit Schaufel wegbuddeln' }).click()
    await expect(gardens(page).nth(index)).toHaveAttribute('data-loot-reveal-state', 'revealed')
    await expect(gardenPayload(page, index)).toBeVisible()
  }
  await page.locator('[data-loot-tool-control="watering-can"]').click()
  for (const index of [1, 3, 4]) {
    const host = gardens(page).nth(index), payload = gardenPayload(page, index)
    await host.getByRole('button', { name: /Pflanze mit/u }).click()
    await expect(host).toHaveAttribute('data-loot-reveal-state', 'bloomed')
    await expect(payload).not.toBeVisible()
    expect(await payload.evaluate(element => element.inert)).toBe(true)
    await host.getByRole('button', { name: /Pflanze .*ffnen/u }).click()
    await expect(host).toHaveAttribute('data-loot-reveal-state', 'revealed')
    await expect(payload).toBeVisible()
    expect(await payload.evaluate(element => element.inert)).toBe(false)
  }
}
// Exercise the real runtime, compiler and dynamic output. Only the selected
// asynchronous boundary is interrupted; no replacement renderer is installed.
export function installGardenProbe({ fault = null } = {}) {
  const selector = 'lia-loot-reveal[data-reveal-layout="inline"]'
  const find = id => [...document.querySelectorAll(selector)].find(host => host.getAttribute('data-reveal-id') === id)
  const events = window.__gardenEvents = []
  let api, changed = false
  Object.defineProperty(window, '__LIA_LOOT_INLINE_REVEALS__', {
    configurable: true, get: () => api,
    set(original) {
      api = { ...original, render(id, kind, send) {
        const initial = find(id), selected = id.endsWith('_2')
        events.push({ event: 'render', id, connected: initial?.isConnected })
        const observedSend = {
          lia(message) {
            events.push({ event: 'lia', id, message, initialConnected: initial?.isConnected, sameHost: initial === find(id) })
            return send.lia(message)
          },
          liascript(content) {
            events.push({ event: 'liascript', id, content, initialConnected: initial?.isConnected, sameHost: initial === find(id) })
            if (fault === 'output' && selected) return
            return send.liascript(content)
          },
        }
        const result = original.render(id, kind, observedSend)
        if (fault === 'replacement' && selected && initial && !changed) {
          changed = true
          initial.replaceWith(initial.cloneNode(true))
          events.push({ event: 'replacement', id, connected: initial.isConnected })
        }
        if (fault === 'delayed-host' && selected && initial && !changed) {
          changed = true
          let placeholder = document.createComment('delayed garden host')
          initial.replaceWith(placeholder)
          const observer = new MutationObserver(() => {
            const recreated = find(id)
            if (recreated) {
              placeholder = document.createComment('delayed garden host')
              recreated.replaceWith(placeholder)
            }
          })
          observer.observe(document.body, { childList: true, subtree: true })
          window.__restoreGardenHost = () => {
            observer.disconnect()
            const recreated = find(id)
            if (recreated) recreated.replaceWith(initial)
            else if (placeholder.isConnected) placeholder.replaceWith(initial)
            else document.querySelector('[data-loot-inline-renderer=\"' + id + '\"]')?.before(initial)
          }
          events.push({ event: 'delayed-host', id, connected: initial.isConnected })
        }
        return result
      } }
    },
  })
  window.__gardenSnapshot = () => ({
    hosts: [...document.querySelectorAll(selector)].map(host => ({
      id: host.getAttribute('data-reveal-id'), connected: host.isConnected,
      kind: host.getAttribute('data-loot-inline-kind'), options: host.getAttribute('data-options'),
      rendered: host.getAttribute('data-loot-inline-rendered'), state: host.getAttribute('data-loot-reveal-state'),
      ancestors: [host, ...function* (element) {
        while (element.parentElement) { element = element.parentElement; yield element }
      }(host)].map(element => ({ tag: element.tagName, class: element.className,
        hidden: element.hidden, inert: element.inert, display: getComputedStyle(element).display,
        visibility: getComputedStyle(element).visibility, opacity: getComputedStyle(element).opacity })),
    })),
    markers: [...document.querySelectorAll('[data-loot-inline-renderer], [data-loot-inline-tail]')].map(marker => ({
      html: marker.outerHTML, next: marker.nextSibling?.textContent,
      siblings: [...marker.parentNode.childNodes].map(node => ({ tag: node.nodeName,
        text: node.nodeType === 3 ? node.textContent : null,
        id: node.getAttribute?.('data-reveal-id') ?? node.getAttribute?.('data-loot-inline-tail') })),
    })), events,
  })
}
