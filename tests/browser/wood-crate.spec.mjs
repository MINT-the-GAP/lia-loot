import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/wood-crate.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Axt und Holzkisten",
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

async function strike(crate, expectedDamage, broken = false) {
  await crate.getByRole("button", {
    exact: true,
    name: "Holzkiste aufbrechen",
  }).click()
  await expect(crate).toHaveAttribute(
    "data-loot-wood-crate-state",
    broken ? "breaking" : "striking",
  )
  await expect(crate).toHaveAttribute(
    "data-loot-wood-crate-damage",
    String(broken ? 7 : expectedDamage),
  )
  await expect(crate).toHaveAttribute(
    "data-loot-wood-crate-state",
    broken ? "broken" : "closed",
  )
}

async function collectPerk(page, label) {
  await page.getByRole("button", {
    name: new RegExp(label + ".*einsammeln", "u"),
  }).click()
}

test("beschädigt Frachtkisten sichtbar und nutzt Axt-Perks mit 8, 4, 2 und 1 Hieb", async ({
  page,
}) => {
  test.setTimeout(120_000)
  await ready(page)

  const crates = page.locator("lia-loot-wood-crate")
  const keys = page.locator("[data-loot-key-button]")
  const axePickup = page.getByRole("button", {
    exact: true,
    name: "Steinaxt einsammeln",
  })
  const axeTool = page.locator("[data-loot-tool-control='axe']")

  await expect(crates).toHaveCount(4)
  await expect(keys).toHaveCount(0)

  const projectedFaces = crates
    .first()
    .locator(".loot-wood-crate-graphic use")
  await expect(projectedFaces).toHaveCount(3)
  const faceProjection = await projectedFaces.evaluateAll((elements) => ({
    references: elements.map((element) => element.getAttribute("href")),
    transforms: elements.map((element) =>
      element.parentElement?.getAttribute("transform"),
    ),
  }))
  expect(new Set(faceProjection.references).size).toBe(1)
  expect(faceProjection.transforms).toEqual([
    "matrix(1 0 0.452381 -0.333333 6 36)",
    "matrix(0.404255 -0.297872 0 1 100 36)",
    "translate(6 36)",
  ])

  await crates.first().getByRole("button", {
    exact: true,
    name: "Holzkiste aufbrechen",
  }).click()
  await expect(crates.first()).toHaveAttribute(
    "data-loot-wood-crate-damage",
    "0",
  )

  await axePickup.click()
  await expect(axeTool).toBeVisible()
  await expect(axeTool).toHaveAttribute("aria-pressed", "false")
  await expect(
    axeTool.locator("[data-loot-axe-tier='stone']"),
  ).toHaveCount(1)

  await crates.first().getByRole("button", {
    exact: true,
    name: "Holzkiste aufbrechen",
  }).click()
  await expect(crates.first()).toHaveAttribute(
    "data-loot-wood-crate-damage",
    "0",
  )

  await axeTool.click()
  await strike(crates.nth(0), 1)
  await strike(crates.nth(0), 2)
  await strike(crates.nth(0), 3)

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(crates.nth(0)).toHaveAttribute(
    "data-loot-wood-crate-damage",
    "3",
  )
  await expect(axeTool).toHaveAttribute("aria-pressed", "false")
  await axeTool.click()

  for (const damage of [4, 5, 6, 7]) {
    await strike(crates.nth(0), damage)
  }
  await strike(crates.nth(0), 8, true)
  await expect(page.locator("[data-loot-key-color='blue']")).toBeVisible()
  await expect(page.locator("lia-loot-key").first()).toHaveAttribute(
    "data-key-id",
    "0_2_content",
  )
  await expect(page.locator("body")).not.toContainText(/content,?\)/u)

  await collectPerk(page, "Eisenaxt")
  await expect(axeTool.locator("[data-loot-axe-tier='iron']")).toHaveCount(1)
  for (const damage of [2, 4, 6]) {
    await strike(crates.nth(1), damage)
  }
  await strike(crates.nth(1), 8, true)
  await expect(page.locator("[data-loot-key-color='green']")).toBeVisible()

  await collectPerk(page, "Goldaxt")
  await expect(axeTool.locator("[data-loot-axe-tier='gold']")).toHaveCount(1)
  await strike(crates.nth(2), 4)
  await strike(crates.nth(2), 8, true)
  await expect(page.locator("[data-loot-key-color='yellow']")).toBeVisible()

  await collectPerk(page, "Diamantaxt")
  await expect(
    axeTool.locator("[data-loot-axe-tier='diamond']"),
  ).toHaveCount(1)
  await strike(crates.nth(3), 8, true)
  await expect(page.locator("[data-loot-key-color='red']")).toBeVisible()
  await expect(keys).toHaveCount(4)
  await expect(page.locator("body")).not.toContainText(/content,?\)/u)
})
