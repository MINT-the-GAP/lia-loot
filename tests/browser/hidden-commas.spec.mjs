import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/hidden-commas.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

test("bewahrt Kommas in Unsichtbar und Zauberstaub im echten Editor", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Die Makroexpansion wird einmal im echten LiaScript-Editor geprueft.",
  )
  test.setTimeout(150_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      name: "Verborgene Kommatexte",
      exact: true,
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")

  const hosts = page.locator("lia-loot-hidden")
  const expected = [
    "Hallo, das hier ist ein Test",
    "Eins, zwei, drei, vier",
    "Mit Backticks, bleibt auch, alles da.",
  ]
  await expect(hosts).toHaveCount(expected.length)

  for (const [index, text] of expected.entries()) {
    const host = hosts.nth(index)
    await expect(
      host.locator(":scope > .loot-magnifier-secret__content"),
    ).toHaveText(text)
    await expect(host).toHaveAttribute("aria-hidden", "true")
  }

  await page.getByRole("button", { name: "Lupe einsammeln" }).click()
  const magnifier = page.getByRole("button", {
    name: /Lupe (?:aktivieren|deaktivieren)/u,
  })
  await magnifier.click()
  await expect(magnifier).toHaveAttribute("aria-pressed", "true")

  for (const [index, text] of expected.entries()) {
    const host = hosts.nth(index)
    const point = await host
      .locator(":scope > .loot-magnifier-secret__content")
      .evaluate((element) => {
        const box = element.getBoundingClientRect()
        return {
          x: box.left + box.width / 2,
          y: box.top + box.height / 2,
        }
      })
    await page.mouse.move(point.x, point.y)
    await expect(host).toHaveClass(/loot-magnifier-secret--under-lens/u)
    await expect(host).toHaveAttribute("aria-hidden", "false")
    await expect(
      host.locator(":scope > .loot-magnifier-secret__content"),
    ).toHaveText(text)
  }
})
