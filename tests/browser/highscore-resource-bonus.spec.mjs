import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const scenarios = [
  {
    variant: "defaults",
    description: "Standardwerten",
    energy: true,
    scores: [900, 1250, 1145, 1135, 885],
  },
  {
    variant: "custom",
    description: "diamantwert und goldwert nach Energie",
    energy: true,
    scores: [1140, 1620, 1535, 1525, 1125],
  },
  {
    variant: "without-energy",
    description: "diamantwert und goldwert ohne Energie",
    energy: false,
    scores: [1140, 1620, 1535, 1525, 1125],
  },
]

async function score(page) {
  return page.evaluate(() => window.__LIA_LOOT_HIGHSCORE__?.score() ?? null)
}

async function expectReady(page) {
  await expect(
    page.getByRole("heading", {
      name: "Highscore mit Restressourcen",
      exact: true,
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

for (const scenario of scenarios) {
  test(`wertet Restressourcen mit ${scenario.description} genau einmal`, async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Makroexpansion und nativer Quizabschluss werden im echten Editor geprueft.",
    )
    test.setTimeout(150_000)

    const courseUrl = new URL(
      `/tests/browser/fixtures/highscore-resource-bonus-${scenario.variant}.md`,
      "http://127.0.0.1:4173",
    ).href
    await page.goto(`${editorPath}?${courseUrl}`, {
      timeout: 30_000,
      waitUntil: "domcontentloaded",
    })
    await expectReady(page)
    await expect.poll(() => score(page)).toBe(scenario.scores[0])

    const coins = page.locator('[data-loot-resource="coins"]')
    const gems = page.locator('[data-loot-resource="gems"]')
    const energy = page.locator('[data-loot-resource="energy"]')
    await expect(coins).toHaveText("3")
    await expect(gems).toHaveText("2")
    if (scenario.energy) {
      await expect(energy).toBeVisible()
      await expect(energy).toHaveText("5")
    } else {
      await expect(energy).toBeHidden()
    }

    // Collected treasure contributes to the remaining inventory, too.
    const chests = page.locator("[data-loot-chest-button]")
    await expect(chests).toHaveCount(2)
    for (const chest of await chests.all()) await chest.click()
    await expect(coins).toHaveText("4")
    await expect(gems).toHaveText("3")
    await expect.poll(() => score(page)).toBe(scenario.scores[1])

    const quiz = page.locator(".lia-quiz")
    await expect(quiz).toHaveCount(1)
    await quiz.locator(".lia-quiz__hint").click()
    await expect(quiz.locator(".lia-quiz__hints > li")).toHaveCount(1)
    await expect(coins).toHaveText("3")
    await expect.poll(() => score(page)).toBe(scenario.scores[2])

    await quiz.getByRole("textbox", { name: "quiz answer" }).fill("12")
    await quiz.locator(".lia-quiz__check").click()
    await expect.poll(() => score(page)).toBe(scenario.scores[3])
    if (scenario.energy) await expect(energy).toHaveText("4")
    await expect(page.locator("#lia-loot-highscore-dialog")).toHaveCount(0)

    // Resolving the last quiz spends its diamond before automatic scoring.
    await quiz.locator(".lia-quiz__resolve").click()
    await expect(quiz).toHaveClass(/\bresolved\b/u)
    await expect(gems).toHaveText("2")
    await expect(page.locator("#lia-loot-highscore-dialog[open]")).toHaveCount(1)
    const finalScore = scenario.scores[4]
    await expect(page.locator("#lia-loot-highscore-points")).toHaveText(
      `${finalScore.toLocaleString("de-DE")} Punkte`,
    )
    await expect.poll(() => score(page)).toBe(finalScore)
    expect(
      await page.evaluate(() => {
        const api = window.__LIA_LOOT_HIGHSCORE__
        return [api.finish(), api.finish(), api.state().finalScore]
      }),
    ).toEqual([finalScore, finalScore, finalScore])

    await page.reload({ timeout: 30_000, waitUntil: "domcontentloaded" })
    await expectReady(page)
    await expect.poll(() => score(page)).toBe(finalScore)
    expect(
      await page.evaluate(() => window.__LIA_LOOT_HIGHSCORE__.state().finalScore),
    ).toBe(finalScore)
    await expect(coins).toHaveText("3")
    await expect(gems).toHaveText("2")
  })
}
