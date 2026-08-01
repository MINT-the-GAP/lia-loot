import { expect, test } from "./playwright-fixtures.mjs"

test("führt den bestehenden Browser-Stresstest unverändert aus", async ({
  page,
}) => {
  test.setTimeout(120_000)

  await page.goto("/tests/browser-stress.html", {
    waitUntil: "domcontentloaded",
  })

  const resultNode = page.locator("#loot-stress-result")
  await expect
    .poll(
      async () => resultNode.getAttribute("data-status"),
      {
        message: "Der bestehende Browser-Stresstest wurde nicht abgeschlossen.",
        timeout: 90_000,
      },
    )
    .toMatch(/^(?:pass|fail)$/u)

  const report = JSON.parse((await resultNode.textContent()) ?? "null")
  expect(report, report?.message ?? "Browser-Stresstest fehlgeschlagen").toMatchObject({
    pass: true,
    runtimeErrors: [],
  })
  expect(report.assertions).toBeGreaterThanOrEqual(90)
  expect(report.chests).toBe(16)
  expect(report.locks).toBeGreaterThanOrEqual(6)
})
