import { readFile } from "node:fs/promises"

import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const lootImport = "../../../README.md"
const freezeImport =
  "https://raw.githubusercontent.com/MINT-the-GAP/lia-freeze-v2/34d908c845347cf7e9ed65d90fbd4928dbfa45b9/README.md"

const revealFixture = {
  file: new URL('./fixtures/reveal-chain.md', import.meta.url),
  heading: 'Vergrabener Blumentest',
  path: '/tests/browser/fixtures/reveal-chain.md',
}

const malformedRevealFixture = {
  heading: 'Fehlerhafter Reveal-Container',
  path: '/tests/browser/fixtures/reveal-malformed.md',
}

const visibilityFixture = {
  heading: 'Bedingte Funditems',
  path: '/tests/browser/fixtures/visibility-conditions.md',
}

const lootIfFixture = {
  heading: 'Bedingter Lootif-Echtlauf',
  path: '/tests/browser/fixtures/loot-if.md',
}

const fixtures = [
  {
    expected: [lootImport, freezeImport],
    file: new URL("./fixtures/import-loot-freeze.md", import.meta.url),
    heading: "Importlauf Loot vor Freeze",
    name: "lia-loot vor lia-freeze-v2",
    path: "/tests/browser/fixtures/import-loot-freeze.md",
    surfaceColor: "yellow",
    surfaceLocation: "menu",
    surfaceMacro: "@Schluessel(gelb; menu)",
  },
  {
    expected: [freezeImport, lootImport],
    file: new URL("./fixtures/import-freeze-loot.md", import.meta.url),
    heading: "Importlauf Freeze vor Loot",
    name: "lia-freeze-v2 vor lia-loot",
    path: "/tests/browser/fixtures/import-freeze-loot.md",
    surfaceColor: "orange",
    surfaceLocation: "classroom",
    surfaceMacro: "@Schluessel(orange; classroom)",
  },
]

function headerImports(markdown) {
  const header = /^<!--([\s\S]*?)-->/u.exec(markdown)?.[1] ?? ""
  return [...header.matchAll(/^\s*import:\s*(\S+)\s*$/gmu)].map(
    (match) => match[1],
  )
}

for (const fixture of fixtures) {
  test(`prüft den direkten Import ${fixture.name}`, async () => {
    const markdown = await readFile(fixture.file, "utf8")

    expect(headerImports(markdown)).toEqual(fixture.expected)
    expect(markdown).toContain(fixture.surfaceMacro)
    expect(markdown).toMatch(/^@Abgabe$/mu)
    expect(markdown).not.toMatch(
      /\b(?:MutationObserver|querySelector(?:All)?)\b/u,
    )
    expect(markdown).not.toMatch(/<script\b/iu)
  })
}

test('prüft den lokalen Containerkurs und den öffentlichen Makrovertrag', async () => {
  const [markdown, template] = await Promise.all([
    readFile(revealFixture.file, 'utf8'),
    readFile(new URL('../../README.md', import.meta.url), 'utf8'),
  ])
  const templateHeader = /^<!--([\s\S]*?)-->/u.exec(template)?.[1] ?? ''
  const revealStart = /^@LootRevealStart_\s*\r?\n([\s\S]*?)^@end$/mu.exec(
    templateHeader,
  )?.[1] ?? ''
  const revealInline = /^@LootRevealInline_\s*\r?\n([\s\S]*?)^@end$/mu.exec(
    templateHeader,
  )?.[1] ?? ''

  expect(headerImports(markdown)).toEqual([lootImport])
  expect(markdown).toMatch(
    /@Erdhaufen\(unsichtbar\)[\s\S]*@Blume\(unsichtbar\)[\s\S]*\[\[SONNENBLUME\]\][\s\S]*@EndeBlume[\s\S]*@EndeErdhaufen/u,
  )
  expect(markdown).not.toMatch(
    /\b(?:MutationObserver|querySelector(?:All)?)\b/u,
  )
  expect(markdown).not.toMatch(/<script\b/iu)

  expect(templateHeader).toMatch(
    /^@Schaufel: @LootWerkzeug_\(@uid,shovel,@0\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@Giesskanne: @LootWerkzeug_\(@uid,watering-can,@0\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@Erdhaufen: @LootRevealStart_\(@uid,erde,@0\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@Erdhaufen\.inline: @LootRevealInline_\(@uid,erde,@1,@0\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@Pflanze: @LootRevealStart_\(@uid,pflanze,@0\)$/mu,
  )
  expect(templateHeader).toMatch(/^@Blume: @Pflanze\(@0\)$/mu)
  expect(templateHeader).toMatch(
    /^@Pflanze\.inline: @LootRevealInline_\(@uid,pflanze,@1,@0\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@Blume\.inline: @Pflanze\.inline\(@0,@1\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@EndeErdhaufen: @LootRevealEnd_\(erde\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@EndePflanze: @LootRevealEnd_\(pflanze\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@EndeBlume: @LootRevealEnd_\(pflanze\)$/mu,
  )
  expect(template).toMatch(
    /Container `anker` und höchstens eine Dauer in derselben Schreibweise/u,
  )
  expect(template).toMatch(
    /von links nach rechts als außen nach innen\s+gelesen/u,
  )
  expect(template).toMatch(
    /Itemoption `unsichtbar` bleibt davon unabhängig und verbirgt nur das Fundobjekt/u,
  )
  expect(template).toMatch(
    /^@Schluessel\(blau; translator; erde-unsichtbar; pflanze; unsichtbar\)$/mu,
  )
  expect(revealStart).toMatch(
    /<lia-keep>\s*<lia-loot-reveal-start[^>]*><\/lia-loot-reveal-start>\s*<\/lia-keep>/u,
  )
  expect(revealInline).toMatch(
    /<lia-loot-reveal[^>]*data-reveal-layout='inline'[^>]*hidden[^>]*>@3<\/lia-loot-reveal>/u,
  )
  expect(templateHeader).toMatch(
    /@LootRevealEnd_\s*\[LOOT-REVEAL-END\]\(#lia-loot-reveal-end-@0\)\s*@end/u,
  )
  expect(templateHeader).toMatch(
    /^@lootif: @LootIfStart_\(@uid,@0\)$/mu,
  )
  expect(templateHeader).toMatch(
    /^@Endelootif: @LootIfEnd_$/mu,
  )
  expect(templateHeader).toMatch(
    /@LootIfEnd_\s*\[LOOT-IF-END\]\(#lia-loot-if-end\)\s*@end/u,
  )
})

test('rendert verschachteltes lootif im echten LiaScript-Editor und persistiert spawn', async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== 'chromium',
    'Die Makroexpansion wird einmal im echten LiaScript-Editor geprüft; die Runtime-Fixture läuft in allen Engines.',
  )
  test.setTimeout(150_000)

  await page.goto(editorUrl(lootIfFixture.path), {
    timeout: 30_000,
    waitUntil: 'domcontentloaded',
  })
  await expect(
    page.getByRole('heading', { name: lootIfFixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe('ready')

  const starts = page.locator('lia-loot-if-start')
  const outer = page.locator('#real-lootif-outer')
  const inner = page.getByText(
    'Der innere Lootif-Inhalt ist erschienen.',
    { exact: true },
  )
  const quiz = page.locator('.lia-quiz')
  await expect(starts).toHaveCount(2)
  await expect(page.locator('a[href="#lia-loot-if-end"]')).toHaveCount(2)
  await expect(outer).not.toBeVisible()
  await expect(inner).not.toBeVisible()
  await expect(quiz.locator('.lia-quiz__check')).not.toBeVisible()
  expect(
    await outer.evaluate((element) =>
      Boolean(element.closest('[data-loot-if-range-blocked]')?.inert),
    ),
  ).toBe(true)

  await page.getByRole('button', { name: /Schatztruhe öffnen/u }).click()
  await expect(outer).toBeVisible()
  await expect(inner).not.toBeVisible()
  await expect(starts.nth(0)).toHaveAttribute('data-loot-if-spawned', 'true')
  await expect(starts.nth(1)).not.toHaveAttribute('data-loot-if-spawned')

  await page.getByRole('button', { name: 'Lupe einsammeln' }).click()
  await expect(inner).toBeVisible()
  await expect(quiz.locator('.lia-quiz__check')).toBeVisible()
  await expect(starts.nth(1)).toHaveAttribute('data-loot-if-spawned', 'true')

  await page.reload({ timeout: 30_000, waitUntil: 'domcontentloaded' })
  await expect(
    page.getByRole('heading', { name: lootIfFixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe('ready')
  await expect(outer).toBeVisible()
  await expect(inner).toBeVisible()
  await expect(quiz.locator('.lia-quiz__check')).toBeVisible()
  await expect(page.getByRole('button', { name: /Schatztruhe öffnen/u })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Lupe einsammeln' })).toHaveCount(0)
})

test('rendert die unsichtbare Erde-Pflanze-Quizkette im echten Editor', async ({
  page,
}) => {
  test.setTimeout(150_000)

  await page.goto(editorUrl(revealFixture.path), {
    timeout: 30_000,
    waitUntil: 'domcontentloaded',
  })
  await expect(
    page.getByRole('heading', { name: revealFixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          lootStatus: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          quizzes: document.querySelectorAll('.lia-quiz').length,
          reveals: document.querySelectorAll('lia-loot-reveal').length,
          tools: document.querySelectorAll('lia-loot-tool').length,
        })),
      {
        message:
          'LiaScript hat Werkzeuge, Reveal-Container und Quiz nicht vollständig gerendert.',
        timeout: 55_000,
      },
    )
    .toEqual({
      lootStatus: 'ready',
      quizzes: 1,
      reveals: 2,
      tools: 2,
    })

  const soil = page.locator(
    'lia-loot-reveal[data-loot-reveal-kind=soil]',
  )
  const plant = page.locator(
    'lia-loot-reveal[data-loot-reveal-kind=plant]',
  )
  const dustSecret = page.locator(
    'lia-loot-hidden[data-loot-concealment=dust]',
  )
  const soilPayload = soil.locator(
    ':scope > [data-loot-reveal-payload]',
  )
  const plantPayload = plant.locator(
    ':scope > [data-loot-reveal-payload]',
  )
  const soilStart = page.locator(
    'lia-loot-reveal-start[data-reveal-kind=erde]',
  )
  const plantStart = page.locator(
    'lia-loot-reveal-start[data-reveal-kind=pflanze]',
  )
  const quiz = page.locator('.lia-quiz')
  const quizInput = page.getByRole('textbox', { name: 'quiz answer' })
  const buriedKeyPlacement = page.locator(
    '[data-loot-key-location=translator]',
  )
  const buriedKey = buriedKeyPlacement.locator('[data-loot-key-button]')
  const redKey = page.getByRole('button', {
    name: 'Roten Schlüssel einsammeln',
  })
  const quizLock = page.locator(
    '[data-loot-lock-button][data-loot-lock-target=check]',
  )
  const buriedChest = page.getByRole('button', {
    name: 'Schatztruhe öffnen und 2 Goldmünzen erhalten',
  })
  const rangeIsBlocked = (locator) =>
    locator.evaluate(
      (element) =>
        element.closest('[data-loot-reveal-range-blocked]') !== null,
    )
  const achievementIds = () =>
    page.evaluate(() => {
      const key = Object.keys(window.sessionStorage).find((candidate) =>
        candidate.startsWith('lia-loot:achievements:v1:'),
      )
      if (!key) return []
      try {
        const state = JSON.parse(window.sessionStorage.getItem(key) ?? 'null')
        return Array.isArray(state?.unlocked) ? state.unlocked : []
      } catch {
        return []
      }
    })

  await expect(soil).toHaveCount(1)
  await expect(plant).toHaveCount(1)
  await expect(soilStart).toHaveCount(1)
  await expect(plantStart).toHaveCount(1)
  await expect(soil).toHaveAttribute('data-loot-reveal-state', 'locked')
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'locked')
  await expect(soilPayload).toHaveCount(1)
  await expect(plantPayload).toHaveCount(1)
  await expect(quiz).toHaveCount(1)
  await expect(quiz.locator('.lia-quiz__check')).toHaveCount(1)
  expect(await rangeIsBlocked(plantStart)).toBe(true)
  expect(await rangeIsBlocked(quiz)).toBe(true)
  await expect(buriedKeyPlacement).toHaveCount(0)
  await expect(quizLock).toHaveCount(0)
  await expect(buriedChest).toHaveCount(0)
  await expect(redKey).toBeVisible()
  await expect(page.locator('[data-loot-resource=coins]')).toHaveText('0')
  expect(await achievementIds()).not.toContain('all-invisible-objects-found')
  expect(await achievementIds()).not.toContain('all-magic-dust-objects-found')
  expect(await achievementIds()).not.toContain('all-soil-dug')
  expect(await achievementIds()).not.toContain('all-plants-bloomed')

  for (const payload of [soilPayload, plantPayload]) {
    await expect(payload).toHaveAttribute('hidden', '')
    await expect(payload).toHaveAttribute('aria-hidden', 'true')
    expect(await payload.evaluate((element) => element.inert)).toBe(true)
  }
  await expect(
    page.getByRole('button', { name: 'Schaufel einsammeln' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Gießkanne einsammeln' }),
  ).toBeVisible()
  await expect(quiz.locator('.lia-quiz__check')).not.toBeVisible()

  await redKey.click()
  await expect(redKey).toHaveCount(0)
  await expect(
    page.locator('#lia-loot-key-inventory [data-loot-key-color=red]'),
  ).toHaveCount(1)

  const pickupTools = [
    ['Lupe einsammeln', /Lupe (?:aktivieren|deaktivieren)/u],
    ['Schaufel einsammeln', /Schaufel (?:aktivieren|deaktivieren)/u],
    ['Gießkanne einsammeln', /Gießkanne (?:aktivieren|deaktivieren)/u],
  ]
  for (const [pickupName, toolName] of pickupTools) {
    await page.getByRole('button', { name: pickupName }).click()
    await expect(page.getByRole('button', { name: toolName })).toBeVisible()
  }

  const magnifierTool = page.getByRole('button', {
    name: /Lupe (?:aktivieren|deaktivieren)/u,
  })
  const shovelTool = page.getByRole('button', {
    name: /Schaufel (?:aktivieren|deaktivieren)/u,
  })
  const wateringCanTool = page.getByRole('button', {
    name: /Gießkanne (?:aktivieren|deaktivieren)/u,
  })
  const moveLensOver = async (host) => {
    const point = await host.evaluate((element) => {
      const ownSecret = element.matches('[data-loot-concealment]')
        ? element.querySelector(':scope > .loot-magnifier-secret__content')
        : [...element.querySelectorAll(
            '.loot-magnifier-secret__content',
          )].find(
            (candidate) => candidate.closest('lia-loot-reveal') === element,
          )
      if (!ownSecret) {
        throw new Error('Dem Reveal-Cover fehlt seine Lupengeometrie.')
      }
      const box = ownSecret.getBoundingClientRect()
      return {
        height: box.height,
        width: box.width,
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
      }
    })
    expect(point.width).toBeGreaterThan(0)
    expect(point.height).toBeGreaterThan(0)
    await page.mouse.move(point.x, point.y)
  }

  await magnifierTool.click()
  await shovelTool.click()
  await expect(magnifierTool).toHaveAttribute('aria-pressed', 'true')
  await expect(shovelTool).toHaveAttribute('aria-pressed', 'true')
  await expect(wateringCanTool).toHaveAttribute('aria-pressed', 'false')

  await moveLensOver(dustSecret)
  await expect.poll(achievementIds).toContain('all-magic-dust-objects-found')
  await moveLensOver(soil)
  expect(await achievementIds()).not.toContain('all-invisible-objects-found')
  const digButton = page.getByRole('button', {
    name: 'Erdhaufen mit Schaufel wegbuddeln',
  })
  await expect(digButton).toBeVisible()
  await digButton.click()
  await expect(soil).toHaveAttribute('data-loot-reveal-state', 'revealed')
  await expect(soilPayload).not.toHaveAttribute('hidden', '')
  await expect(soilPayload).not.toHaveAttribute('aria-hidden', 'true')
  expect(await soilPayload.evaluate((element) => element.inert)).toBe(false)
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'locked')
  await expect(plantPayload).toHaveAttribute('hidden', '')
  expect(await rangeIsBlocked(plantStart)).toBe(false)
  expect(await rangeIsBlocked(quiz)).toBe(true)
  await expect(buriedKeyPlacement).toHaveCount(0)
  await expect.poll(achievementIds).toContain('all-soil-dug')
  await expect.poll(achievementIds).toContain('all-invisible-objects-found')

  await wateringCanTool.click()
  await expect(magnifierTool).toHaveAttribute('aria-pressed', 'true')
  await expect(shovelTool).toHaveAttribute('aria-pressed', 'false')
  await expect(wateringCanTool).toHaveAttribute('aria-pressed', 'true')
  await moveLensOver(plant)
  await expect.poll(achievementIds).toContain('all-invisible-objects-found')
  expect(await achievementIds()).toContain('all-magic-dust-objects-found')

  const waterButton = page.getByRole('button', {
    name: 'Pflanze mit Gießkanne gießen',
  })
  await expect(waterButton).toBeVisible()
  await waterButton.click()
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'bloomed')
  await expect(plantPayload).toHaveAttribute('hidden', '')
  await expect(plantPayload).toHaveAttribute('aria-hidden', 'true')
  expect(await plantPayload.evaluate((element) => element.inert)).toBe(true)
  expect(await rangeIsBlocked(quiz)).toBe(true)
  await expect(quiz.locator('.lia-quiz__check')).not.toBeVisible()
  await expect(buriedKeyPlacement).toHaveCount(0)
  await expect(quizLock).toHaveCount(0)
  await expect(buriedChest).toHaveCount(0)
  await expect.poll(achievementIds).toContain('all-plants-bloomed')

  const bloomButton = page.getByRole('button', {
    name: 'Blühende Pflanze öffnen',
  })
  await expect(bloomButton).toBeVisible()
  await bloomButton.focus()
  await page.keyboard.press('Enter')
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'revealed')
  await expect(plantPayload).not.toHaveAttribute('hidden', '')
  await expect(plantPayload).not.toHaveAttribute('aria-hidden', 'true')
  expect(await plantPayload.evaluate((element) => element.inert)).toBe(false)
  expect(await rangeIsBlocked(quiz)).toBe(false)
  const quizCheck = quiz.locator('.lia-quiz__check')
  await expect(quizInput).toBeVisible()
  await expect(quizInput).toBeEditable()
  await expect(quizInput).toBeFocused()
  await quizInput.fill('SONNENBLUME')
  await expect(quizCheck).toBeVisible()
  await expect(quizLock).toBeVisible()
  await expect(quizLock).toHaveAccessibleName(
    'Prüfen gesperrt. Einen roten Schlüssel verwenden.',
  )
  await quizLock.click()
  await expect(quizLock).toHaveCount(0)
  await expect(quizCheck).toBeEnabled()

  await expect(buriedChest).toBeVisible()
  await buriedChest.click()
  await expect(buriedChest).toHaveCount(0)
  await expect(page.locator('[data-loot-resource=coins]')).toHaveText('2')
  await expect.poll(achievementIds).toContain('all-treasure-chests-opened')

  await expect(buriedKeyPlacement).toHaveCount(1)
  await page.getByRole('button', { name: 'Übersetzungen' }).click()
  await expect(buriedKey).toBeVisible()
  await expect(buriedKey).toHaveAccessibleName(
    'Blauen Schlüssel einsammeln',
  )
  await expect(buriedKey.locator('.loot-key-graphic')).toBeVisible()
  await expect(buriedKey).toHaveAttribute('data-loot-key-eligible', 'true')
  await buriedKey.focus()
  await expect(buriedKey).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(buriedKeyPlacement).toHaveCount(0)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color=blue]',
    ),
  ).toHaveCount(1)
  await expect(
    page.locator('#lia-loot-key-inventory [data-loot-key-color=red]'),
  ).toHaveCount(0)
  await expect(quizLock).toHaveCount(0)
  await expect(buriedChest).toHaveCount(0)
  await expect(page.locator('[data-loot-resource=coins]')).toHaveText('2')
  await expect.poll(achievementIds).toEqual(
    expect.arrayContaining([
      'all-treasure-chests-opened',
      'all-invisible-objects-found',
      'all-soil-dug',
      'all-plants-bloomed',
    ]),
  )
  expect(await achievementIds()).toContain('all-magic-dust-objects-found')

  await page.reload({ timeout: 30_000, waitUntil: 'domcontentloaded' })
  await expect(
    page.getByRole('heading', { name: revealFixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      {
        message: 'Loot wurde nach dem Reload nicht wieder bereit.',
        timeout: 55_000,
      },
    )
    .toBe('ready')

  await expect(soil).toHaveAttribute('data-loot-reveal-state', 'revealed')
  await expect(plant).toHaveAttribute('data-loot-reveal-state', 'revealed')
  for (const payload of [soilPayload, plantPayload]) {
    await expect(payload).not.toHaveAttribute('hidden', '')
    await expect(payload).not.toHaveAttribute('aria-hidden', 'true')
    expect(await payload.evaluate((element) => element.inert)).toBe(false)
  }
  expect(await rangeIsBlocked(plantStart)).toBe(false)
  expect(await rangeIsBlocked(quiz)).toBe(false)
  await expect(buriedKeyPlacement).toHaveCount(0)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color=blue]',
    ),
  ).toHaveCount(1)
  await expect(
    page.locator('#lia-loot-key-inventory [data-loot-key-color=red]'),
  ).toHaveCount(0)
  await expect(quizLock).toHaveCount(0)
  await expect(buriedChest).toHaveCount(0)
  await expect(page.locator('[data-loot-resource=coins]')).toHaveText('2')
  for (const [pickupName] of pickupTools) {
    await expect(page.getByRole('button', { name: pickupName })).toHaveCount(0)
  }
  for (const tool of [magnifierTool, shovelTool, wateringCanTool]) {
    await expect(tool).toBeVisible()
    await expect(tool).toHaveAttribute('aria-pressed', 'false')
  }
  await expect.poll(achievementIds).toEqual(
    expect.arrayContaining([
      'all-treasure-chests-opened',
      'all-invisible-objects-found',
      'all-soil-dug',
      'all-plants-bloomed',
    ]),
  )
  expect(await achievementIds()).toContain('all-magic-dust-objects-found')
  await expect(page.getByRole('textbox', { name: 'quiz answer' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'quiz answer' })).toBeEditable()
})

test('hält eine falsch geschlossene Reveal-Kette im echten Editor gesperrt', async ({
  page,
}) => {
  await page.goto(editorUrl(malformedRevealFixture.path), {
    timeout: 30_000,
    waitUntil: 'domcontentloaded',
  })
  await expect(
    page.getByRole('heading', {
      name: malformedRevealFixture.heading,
      exact: true,
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          lootStatus: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          starts: document.querySelectorAll('lia-loot-reveal-start').length,
        })),
      { timeout: 55_000 },
    )
    .toEqual({ lootStatus: 'ready', starts: 2 })

  const protectedText = page.getByText(
    'Dieser Inhalt darf bei falscher Schließreihenfolge nicht offenliegen.',
    { exact: true },
  )
  await expect(protectedText).toHaveCount(1)
  await expect(protectedText).not.toBeVisible()
  expect(
    await protectedText.evaluate(
      (element) =>
        element.closest('[data-loot-reveal-range-blocked]') !== null,
    ),
  ).toBe(true)
})

test('reagiert im echten Editor auf Theme und Farbmodus, ohne den Lupenstatus zu verlieren', async ({
  page,
}) => {
  test.setTimeout(150_000)

  await page.goto(editorUrl(visibilityFixture.path), {
    timeout: 30_000,
    waitUntil: 'domcontentloaded',
  })
  await expect(
    page.getByRole('heading', {
      name: visibilityFixture.heading,
      exact: true,
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          lootStatus: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          settingsReady: Boolean(window.LIA?.settings),
        })),
      { timeout: 55_000 },
    )
    .toEqual({ lootStatus: 'ready', settingsReady: true })

  const setAppearance = (theme, light) =>
    page.evaluate(
      ({ nextLight, nextTheme }) => {
        window.LIA.settings.theme = nextTheme
        window.LIA.settings.light = nextLight
      },
      { nextLight: light, nextTheme: theme },
    )
  const sourceKey = page.locator(
    'lia-loot-key [data-loot-key-button][data-loot-key-color=blue]',
  )
  const magnifierPickup = page.getByRole('button', {
    name: 'Lupe einsammeln',
  })

  await setAppearance('default', true)
  await expect(sourceKey).toHaveCount(0)
  await expect(magnifierPickup).toHaveCount(0)

  await setAppearance('red', false)
  await expect(page.locator('html')).toHaveClass(/lia-theme-red/u)
  await expect(page.locator('html')).toHaveClass(/lia-variant-dark/u)
  await expect(sourceKey).toBeVisible()
  await expect(magnifierPickup).toBeVisible()

  await magnifierPickup.click()
  const magnifierTool = page.locator('#lia-loot-magnifier-tool')
  await expect(magnifierTool).toBeVisible()
  await magnifierTool.click()
  await expect(page.locator('body')).toHaveClass(/loot-magnifier-active/u)
  await expect(page.locator('html')).not.toHaveClass(/loot-magnifier-active/u)

  await setAppearance('blue', false)
  await expect(sourceKey).toHaveCount(0)
  await expect(page.locator('body')).toHaveClass(/loot-magnifier-active/u)

  await setAppearance('red', false)
  await expect(sourceKey).toBeVisible()
  await setAppearance('red', true)
  await expect(sourceKey).toHaveCount(0)
  await expect(page.locator('body')).toHaveClass(/loot-magnifier-active/u)

  await setAppearance('red', false)
  await expect(sourceKey).toBeVisible()
  await sourceKey.click()
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color=blue]',
    ),
  ).toHaveCount(1)
  await setAppearance('blue', false)
  await expect(sourceKey).toHaveCount(0)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color=blue]',
    ),
  ).toHaveCount(1)
})

function editorUrl(coursePath) {
  const courseUrl = new URL(coursePath, testOrigin).href
  return `${editorPath}?${courseUrl}`
}

async function expectImportedRuntimes(page, fixture) {
  await expect(
    page.getByRole("heading", { name: fixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })

  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          freezeStyles: document.querySelectorAll(
            "#lia-submission-runtime-style",
          ).length,
          lootStatus: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          lootStyles: document.querySelectorAll(
            "#lia-loot-highscore-style",
          ).length,
          submissionBoxes: document.querySelectorAll(
            ".lia-submit-box",
          ).length,
        })),
      {
        message:
          "LiaScript hat Loot und Freeze nicht vollständig initialisiert.",
        timeout: 55_000,
      },
    )
    .toEqual({
      freezeStyles: 1,
      lootStatus: "ready",
      lootStyles: 1,
      submissionBoxes: 1,
    })

  await expect(
    page.locator('.lia-submit-box [data-lia-freeze-i18n="submission-heading"]'),
  ).toHaveText("Abgabelink erstellen")
  await expect(page.locator("#lia-create-link")).toHaveText("Link erstellen")
  await expect(page.locator("#lia-create-link")).toBeEnabled()
  await expect(
    page.locator(
      `[data-loot-key-location="${fixture.surfaceLocation}"] [data-loot-key-color="${fixture.surfaceColor}"]`,
    ),
  ).toHaveCount(1)
  await expect(
    page.locator("lia-loot-key.loot-key-host--surface-source"),
  ).toHaveCount(1)
}

for (const fixture of fixtures) {
  test(`lädt beide Runtimes wirklich: ${fixture.name}`, async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Der reproduzierte Chromium-Importblocker wird in beiden Chromium-Jobs geprüft.",
    )
    test.setTimeout(150_000)

    await page.goto(editorUrl(fixture.path), {
      timeout: 30_000,
      waitUntil: "domcontentloaded",
    })
    await expectImportedRuntimes(page, fixture)

    await page.reload({ timeout: 30_000, waitUntil: "domcontentloaded" })
    await expectImportedRuntimes(page, fixture)
  })
}

test("die lokale Runtime-Fixture baut Schlüssel ohne Kurshacks ein", async () => {
  const html = await readFile(
    new URL("./fixtures/surface-keys.html", import.meta.url),
    "utf8",
  )

  expect(html).toContain('<script src="/dist/index.js"></script>')
  expect(html).not.toMatch(
    /\b(?:MutationObserver|querySelector(?:All)?)\b/u,
  )
})
