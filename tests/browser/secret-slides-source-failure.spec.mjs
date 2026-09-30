import { expect, test } from "@playwright/test"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath =
  "/tests/browser/fixtures/secret-slides-source-failure.md"

function editorUrl() {
  return `${editorPath}?${new URL(fixturePath, testOrigin).href}`
}

test("hält den Kurs bei ausfallender Geheimfolien-Zweitladung nutzbar", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Der echte LiaScript-Ladepfad wird im Chromium-Browser geprüft.",
  )
  test.setTimeout(90_000)

  await page.addInitScript((path) => {
    const original = window.fetch.bind(window)
    window.__secretSourceFailures = 0
    window.fetch = (input, options) => {
      if (String(input).includes(path) && options?.cache === "force-cache") {
        window.__secretSourceFailures += 1
        return Promise.reject(new Error("Injected secret source failure"))
      }
      return original(input, options)
    }
  }, fixturePath)

  await page.goto(editorUrl(), { waitUntil: "domcontentloaded" })

  await expect(
    page.getByRole("heading", { name: "Verfügbarer Kursstart", exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(() => page.evaluate(() => window.__secretSourceFailures), {
      timeout: 55_000,
    })
    .toBeGreaterThan(0)
  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__LIA_LOOT_RUNTIME__?.status ?? null,
        ),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(
    page.locator("html.loot-secret-slide-discovering"),
  ).toHaveCount(0)
  await expect(page.locator("#lia-loot-secret-slide-status")).not.toContainText(
    "Geheimfolien konnten nicht sicher geladen werden",
  )

  await page.evaluate(() => {
    window.location.hash = "#2"
  })
  await expect
    .poll(() => page.evaluate(() => window.location.hash), {
      message: "Der gerenderte Geheimfolienmarker muss den Direktaufruf abfangen.",
    })
    .not.toBe("#2")
  await expect(
    page.getByRole("heading", { name: "Verborgene Ausfallfolie", exact: true }),
  ).not.toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Verfügbares Kursende", exact: true }),
  ).toBeVisible()
})
