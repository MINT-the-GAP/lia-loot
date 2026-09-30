import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/bonus-pickups.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Bonusfunde" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

async function collect(page, name) {
  const pickup = page.getByRole("button", { exact: true, name })
  await expect(pickup).toBeVisible()
  await pickup.click()
  await expect(pickup).toHaveCount(0, { timeout: 5_000 })
}

test("findet Atlas und Perks, wendet sie an und behaelt sie", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await ready(page)

  await collect(page, "Perk +100 % Energie aus Energiekisten einsammeln")
  await collect(page, "Perk +20 % Lupenradius einsammeln")
  await collect(page, "Perk +10 % Taschenlampenradius einsammeln")
  await collect(page, "Atlas-Perk „Kurszahlen“ einsammeln")
  await collect(page, "Atlas-Perk „Folieninfo“ einsammeln")

  await expect(
    page.getByRole("button", { name: "Atlaskarte öffnen" }),
  ).toHaveCount(0)
  await collect(page, "Atlaskarte einsammeln")

  const atlas = page.getByRole("button", { name: "Atlaskarte öffnen" })
  await expect(atlas).toBeVisible()
  await atlas.click()
  const atlasDialog = page.getByRole("dialog", { name: "Atlaskarte" })
  await expect(atlasDialog.getByText("Kursbestand", { exact: true })).toBeVisible()
  await expect(atlasDialog.getByText(/Auf Folie 1 sind noch/u)).toBeVisible()
  await page.keyboard.press("Escape")

  await page.getByRole("button", { name: "Lupe einsammeln" }).click()
  const magnifier = page.getByRole("button", {
    name: /Lupe (?:aktivieren|deaktivieren)/u,
  })
  await expect(magnifier).toBeVisible()
  await magnifier.click()
  const lens = page.locator("#lia-loot-magnifier-lens")
  await page.mouse.move(500, 300)
  await expect(lens).toBeVisible()
  await expect(lens).toHaveCSS("width", "172px")
  await magnifier.click()

  await page.getByRole("button", { name: "Taschenlampe einsammeln" }).click()
  const flashlight = page.getByRole("button", {
    name: /Taschenlampe (?:aktivieren|deaktivieren)/u,
  })
  await flashlight.click()
  await expect(page.locator("#lia-loot-flashlight-beam")).toHaveCSS(
    "--loot-flashlight-radius",
    "101px",
  )
  await flashlight.click()

  await page
    .getByRole("button", {
      name: "Energiekiste öffnen und 2 Energiepunkte erhalten",
    })
    .click()
  await expect(page.locator('[data-loot-resource="energy"]')).toHaveText("4")

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(page.locator(".loot-bonus-pickup")).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Atlaskarte öffnen" })).toBeVisible()
  await expect(page.locator('[data-loot-resource="energy"]')).toHaveText("4")
})
