import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/chest-alias-sequence.md"

function editorUrl() {
  return editorPath + "?" + new URL(
    fixturePath,
    "http://127.0.0.1:4173",
  ).href
}

test("rendert @Diamantentruhe in einer gleichzeiligen Truhenfolge", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Die LiaScript-Makroexpansion wird einmal in Chromium geprueft.",
  )
  test.setTimeout(120_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Truhenfolge im Erdhaufen",
    }),
  ).toBeVisible({ timeout: 55_000 })

  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          chests: [...document.querySelectorAll("lia-loot-chest")].map(
            (chest) => chest.getAttribute("data-reward"),
          ),
          rawMacros: document.body.textContent?.match(
            /@(Schatztruhe|Diamantentruhe|Energiekiste)/gu,
          ) ?? [],
          status: window.__LIA_LOOT_RUNTIME__?.status ?? null,
        })),
      {
        message: "Die gleichzeilige Truhenfolge wurde nicht vollstaendig expandiert.",
        timeout: 55_000,
      },
    )
    .toEqual({
      chests: [
        "energy",
        "energy",
        "gold",
        "diamonds",
        "gold",
        "energy",
        "energy",
      ],
      rawMacros: [],
      status: "ready",
    })

  const chests = page.locator("lia-loot-chest")
  const chestIds = await chests.evaluateAll((hosts) =>
    hosts.map((host) => host.getAttribute("data-chest-id")),
  )
  expect(chestIds.every(Boolean)).toBe(true)
  expect(new Set(chestIds).size).toBe(7)

  await page.getByRole("button", { name: "Schaufel einsammeln" }).click()
  await page
    .getByRole("button", { name: /Schaufel (?:aktivieren|deaktivieren)/u })
    .click()

  const soil = page.locator(
    "lia-loot-reveal[data-loot-reveal-kind=soil]",
  )
  await soil
    .getByRole("button", {
      name: "Erdhaufen mit Schaufel wegbuddeln",
    })
    .click()
  await expect(soil).toHaveAttribute("data-loot-reveal-state", "revealed")
  const chestButtons = page.locator("[data-loot-chest-button]")
  await expect(chestButtons).toHaveCount(7)
  for (const button of await chestButtons.all()) {
    await expect(button).toBeVisible()
  }
})
