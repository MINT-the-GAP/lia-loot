import { expect, test } from "./playwright-fixtures.mjs"

const hostPath = "/tests/browser/fixtures/live-editor-host.html"

test("lädt Geheimfolien sicher aus der In-Memory-Quelle des LiveEditors", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Der echte LiaScript-JIT-Pfad wird im Chromium-Browser geprüft.",
  )
  test.setTimeout(120_000)

  await page.goto(hostPath, { waitUntil: "domcontentloaded" })
  const preview = page.frameLocator("#liascript-preview")

  await expect(
    preview.getByRole("heading", { name: "LiveEditor Start", exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () =>
        page
          .locator("#liascript-preview")
          .evaluate(
            (iframe) =>
              iframe.contentWindow?.__LIA_LOOT_RUNTIME__?.status ?? null,
          ),
      { timeout: 55_000 },
    )
    .toBe("ready")

  await expect
    .poll(() => page.evaluate(() => window.__liveEditorCompileCount))
    .toBeGreaterThanOrEqual(2)
  await expect(
    preview.locator("html.loot-secret-slide-discovery-failed"),
  ).toHaveCount(0)
  await expect(
    preview.locator("html.loot-secret-slide-discovering"),
  ).toHaveCount(0)

  const secretLink = preview.locator(
    '#lia-toc .lia-toc__content a[href$="#2"]',
  )
  await expect(secretLink).toHaveClass(/loot-secret-slide-link/u)
  await expect(secretLink).toBeHidden()

  const runtimeLocation = await page
    .locator("#liascript-preview")
    .evaluate((iframe) => ({
      defaultCourseURL:
        iframe.contentWindow?.LIA?.defaultCourseURL ?? null,
      search: iframe.contentWindow?.location.search ?? null,
    }))
  expect(runtimeLocation).toEqual({ defaultCourseURL: null, search: "" })

  await page.evaluate(() => {
    const publicMarkdown = window.__liveEditorMarkdown
      .replace("# LiveEditor Start", "# LiveEditor ohne Geheimfolie")
      .replace("@Geheimfolie", "Diese Folie ist jetzt öffentlich.")
    window.__compileLiveEditorMarkdown(publicMarkdown)
  })
  await expect(
    preview.getByRole("heading", {
      name: "LiveEditor ohne Geheimfolie",
      exact: true,
    }),
  ).toBeVisible()
  await expect(secretLink).not.toHaveClass(/loot-secret-slide-link/u)
  await expect(secretLink).toBeVisible()

  await page.evaluate(() => {
    const secretMarkdown = window.__liveEditorMarkdown
      .replace("# LiveEditor ohne Geheimfolie", "# LiveEditor wieder geheim")
      .replace("Diese Folie ist jetzt öffentlich.", "@Geheimfolie")
    window.__compileLiveEditorMarkdown(secretMarkdown)
  })
  await expect(
    preview.getByRole("heading", {
      name: "LiveEditor wieder geheim",
      exact: true,
    }),
  ).toBeVisible()
  await expect(secretLink).toHaveClass(/loot-secret-slide-link/u)
  await expect(secretLink).toBeHidden()
})
