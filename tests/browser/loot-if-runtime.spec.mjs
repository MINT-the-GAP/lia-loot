import { expect, test } from "./playwright-fixtures.mjs"

const fixtureUrl = "/tests/browser/fixtures/loot-if-runtime.html"

async function waitForRuntime(page) {
  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__LIA_LOOT_RUNTIME__?.status ?? "missing",
        ),
      { message: "Die lokale Loot-Runtime wurde nicht bereit.", timeout: 15_000 },
    )
    .toBe("ready")
}

async function openCase(page, variant) {
  await page.goto(`${fixtureUrl}?case=${variant}`)
  await waitForRuntime(page)
}

async function solve(page, id) {
  await page.evaluate((quizId) => {
    window.__LOOT_IF_FIXTURE__.solve(quizId)
  }, id)
}

test("spawned Quizbedingungen bleiben verborgen, bis die passende Lösung vorliegt", async ({
  page,
}) => {
  await openCase(page, "quiz")

  const previous = page.locator("#previous-content")
  const slide = page.locator("#slide-content")
  const count = page.locator("#count-content")
  await expect(previous).not.toBeVisible()
  await expect(slide).not.toBeVisible()
  await expect(count).not.toBeVisible()
  expect(
    await previous.evaluate((element) =>
      Boolean(element.closest("[data-loot-if-range-blocked]")?.inert),
    ),
  ).toBe(true)

  await solve(page, "quiz-one")
  await expect(previous).toBeVisible()
  await expect(slide).not.toBeVisible()
  await expect(count).not.toBeVisible()

  await solve(page, "quiz-two")
  await expect(slide).toBeVisible()
  await expect(count).toBeVisible()
  await expect(page.locator("#self-hidden-quiz .lia-quiz__check")).toBeVisible()

  await page.reload()
  await waitForRuntime(page)
  await expect(previous).toBeVisible()
  await expect(slide).toBeVisible()
  await expect(count).toBeVisible()
})

test("vergleicht Gold, Diamanten und Energie und behält spawn anschließend bei", async ({
  page,
}) => {
  await openCase(page, "resources")

  const gold = page.locator("#gold-content")
  const diamonds = page.locator("#diamond-content")
  const energy = page.locator("#energy-content")
  await expect(gold).not.toBeVisible()
  await expect(diamonds).not.toBeVisible()
  await expect(energy).not.toBeVisible()

  await page.evaluate(() => {
    window.__LIA_LOOT_HIGHSCORE__.resources(2, 1, 1)
  })
  await expect(gold).toBeVisible()
  await expect(diamonds).toBeVisible()
  await expect(energy).toBeVisible()

  await page.evaluate(() => {
    window.__LIA_LOOT_HIGHSCORE__.resources(0, 0, 5)
  })
  await expect(gold).toBeVisible()
  await expect(diamonds).toBeVisible()
  await expect(energy).toBeVisible()

  await page.reload()
  await waitForRuntime(page)
  await expect(gold).toBeVisible()
  await expect(diamonds).toBeVisible()
  await expect(energy).toBeVisible()
})

test("zählt Schatz-, Diamanten- und Energiekisten getrennt über echte Klicks", async ({
  page,
}) => {
  await openCase(page, "chests")
  await page.evaluate(() => {
    window.__LIA_LOOT_HIGHSCORE__.resources(0, 0, 0)
  })

  const cases = [
    ["gold", "#gold-chest-content"],
    ["diamonds", "#diamond-chest-content"],
    ["energy", "#energy-chest-content"],
  ]
  for (const [reward, content] of cases) {
    await expect(page.locator(content)).not.toBeVisible()
    await page.locator(`[data-loot-chest-reward="${reward}"]`).click()
    await expect(page.locator(content)).toBeVisible()
  }

  await page.reload()
  await waitForRuntime(page)
  for (const [, content] of cases) {
    await expect(page.locator(content)).toBeVisible()
  }
  await expect(page.locator("[data-loot-chest-button]")).toHaveCount(0)
})

test("reagiert auf ein wirklich geöffnetes Schloss und eine eingesammelte Lupe", async ({
  page,
}) => {
  await openCase(page, "lock-magnifier")

  const lockContent = page.locator("#lock-content")
  const magnifierContent = page.locator("#magnifier-content")
  await expect(lockContent).not.toBeVisible()
  await expect(magnifierContent).not.toBeVisible()

  await page.locator("[data-loot-key-button]").click()
  await page.locator('[data-loot-lock-button][data-loot-lock-target="check"]').click()
  await expect(lockContent).toBeVisible()

  await page.getByRole("button", { name: "Lupe einsammeln" }).click()
  await expect(magnifierContent).toBeVisible()

  await page.reload()
  await waitForRuntime(page)
  await expect(lockContent).toBeVisible()
  await expect(magnifierContent).toBeVisible()
})

test("erkennt Nutzer-Markierfarbe, exaktes Wort und den echten Geheimfolienbesuch", async ({
  page,
}) => {
  await openCase(page, "facts")

  const markerColor = page.locator("#marker-color-content")
  const markerWord = page.locator("#marker-word-content")
  const secret = page.locator("#secret-content")
  await expect(markerColor).not.toBeVisible()
  await expect(markerWord).not.toBeVisible()
  await expect(secret).not.toBeVisible()

  await page.evaluate(() => {
    window.__LOOT_IF_FIXTURE__.markRedWord()
  })
  await expect(markerColor).toBeVisible()
  await expect(markerWord).toBeVisible()

  await expect(page.locator('a[href="#2"]')).toHaveClass(
    /loot-secret-slide-link/u,
  )
  await page.locator("#lia-input-search").fill("Verborgener Garten")
  await page.locator('a[href="#2"]').click()
  await expect(page.getByRole("heading", { name: "Verborgener Garten" })).toBeVisible()
  await page.locator('a[href="#1"]').click()
  await expect(page.getByRole("heading", { name: "Geheim- und Marker-Trigger" })).toBeVisible()
  await expect(secret).toBeVisible()

  await page.reload()
  await waitForRuntime(page)
  await expect(markerColor).toBeVisible()
  await expect(markerWord).toBeVisible()
  await expect(secret).toBeVisible()
})

test("wertet einen inneren Trigger erst nach dem äußeren spawn aus", async ({
  page,
}) => {
  await openCase(page, "nested")
  await page.evaluate(() => {
    window.__LIA_LOOT_HIGHSCORE__.resources(1, 0, 0)
  })

  const starts = page.locator("lia-loot-if-start")
  const outer = page.locator("#outer-content")
  const inner = page.locator("#inner-content")
  await expect(outer).not.toBeVisible()
  await expect(inner).not.toBeVisible()
  await expect(starts.nth(0)).not.toHaveAttribute("data-loot-if-spawned")
  await expect(starts.nth(1)).not.toHaveAttribute("data-loot-if-spawned")

  await page.getByRole("button", { name: "Lupe einsammeln" }).click()
  await expect(outer).toBeVisible()
  await expect(inner).toBeVisible()
  await expect(starts.nth(0)).toHaveAttribute("data-loot-if-spawned", "true")
  await expect(starts.nth(1)).toHaveAttribute("data-loot-if-spawned", "true")

  await page.reload()
  await waitForRuntime(page)
  await expect(outer).toBeVisible()
  await expect(inner).toBeVisible()
})

test("hält ungültige und unpaarige Bereiche selbst mit altem Spawn-Zustand geschlossen", async ({
  page,
}) => {
  await openCase(page, "malformed")
  await page.evaluate(() => {
    window.__LIA_LOOT_HIGHSCORE__.resources(1, 0, 0)
  })

  const invalid = page.locator("#invalid-content")
  const unpaired = page.locator("#unpaired-content")
  const emptySlide = page.locator("#empty-slide-content")
  const placeholderId = page.locator("#placeholder-id-content")
  await expect(emptySlide).not.toBeVisible()
  await expect(placeholderId).not.toBeVisible()
  await expect(invalid).not.toBeVisible()
  await expect(unpaired).not.toBeVisible()

  await page.evaluate(() => {
    const identity =
      new URL(
        "/tests/browser/fixtures/course-loot-if-runtime.md",
        window.location.origin,
      ).href + "::version=1.0.0"
    const key = "lia-loot:loot-if:v1:" + encodeURIComponent(identity)
    window.sessionStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        highlightedColors: [],
        highlightedWords: [],
        openedLockTargets: [],
        secretSlideVisited: false,
        solvedQuizzes: [],
        spawned: ["invalid-result", "unpaired-result"],
      }),
    )
  })
  await page.reload()
  await waitForRuntime(page)
  await expect(emptySlide).not.toBeVisible()
  await expect(placeholderId).not.toBeVisible()
  await expect(invalid).not.toBeVisible()
  await expect(unpaired).not.toBeVisible()
  expect(
    await invalid.evaluate((element) =>
      Boolean(element.closest("[data-loot-if-range-blocked]")?.inert),
    ),
  ).toBe(true)
})
