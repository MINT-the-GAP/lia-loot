import { createRequire } from "node:module"

import { expect, test } from "./playwright-fixtures.mjs"

const require = createRequire(import.meta.url)
const playwrightVersion = require("@playwright/test/package.json").version

test("startet die verlangte Browser- und Playwright-Version", async ({
  browser,
  browserName,
  page,
}) => {
  const response = await page.goto("/__health")
  expect(response?.ok()).toBe(true)

  const expectedPlaywright = process.env.EXPECTED_PLAYWRIGHT_VERSION
  if (expectedPlaywright) {
    expect(playwrightVersion).toBe(expectedPlaywright)
  }

  const major = Number.parseInt(browser.version().split(".")[0], 10)
  expect(Number.isInteger(major)).toBe(true)

  const expectedChromium = process.env.EXPECTED_CHROMIUM_MAJOR
  if (expectedChromium) {
    expect(browserName).toBe("chromium")
    expect(major).toBe(Number.parseInt(expectedChromium, 10))
  } else if (browserName === "chromium") {
    expect(major).toBeGreaterThanOrEqual(131)
  }
})
