import { expect, test as base } from "@playwright/test"

export const test = base.extend({
  page: async ({ page }, use) => {
    const browserErrors = []

    page.on("console", (message) => {
      if (message.type() === "error") {
        browserErrors.push(`console.error: ${message.text()}`)
      }
    })
    page.on("pageerror", (error) => {
      browserErrors.push(`pageerror: ${error.stack ?? error.message}`)
    })
    page.on("crash", () => {
      browserErrors.push("page crash")
    })

    await use(page)

    expect(
      browserErrors,
      `Unerwartete Browser-/Seitenfehler:\n${browserErrors.join("\n")}`,
    ).toEqual([])
  },
})

export { expect }
