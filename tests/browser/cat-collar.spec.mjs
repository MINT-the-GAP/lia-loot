import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/cat-collar.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Katzenhalsbänder" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

test("findet, wechselt und speichert farbige Katzenhalsbänder", async ({
  page,
}) => {
  test.setTimeout(100_000)
  await page.setViewportSize({ width: 900, height: 650 })
  await ready(page)

  await page
    .getByRole("button", { exact: true, name: "Pixelkatze einsammeln" })
    .click()
  const companion = page.locator("#lia-loot-cat-companion")
  const graphic = companion.locator(".loot-cat-graphic")
  const collar = companion.locator(".loot-cat-collar").first()
  await expect(graphic).not.toHaveAttribute("data-cat-collar")
  await expect(collar).toHaveCSS("visibility", "hidden")

  await page
    .getByRole("button", { exact: true, name: "Rotes Halsband einsammeln" })
    .click()
  await expect(graphic).toHaveAttribute("data-cat-collar", "red")
  await expect(collar).toHaveCSS("visibility", "visible")
  await expect(collar).toHaveCSS("fill", "rgb(228, 71, 71)")

  await page
    .getByRole("button", { exact: true, name: "Blaues Halsband einsammeln" })
    .click()
  await expect(graphic).toHaveAttribute("data-cat-collar", "blue")

  const petControl = page.locator("#lia-loot-pet-control")
  const petSubbar = page.locator("#lia-loot-pet-subbar")
  await petControl.click()
  await expect(petSubbar).toBeVisible()
  const redChoice = page.getByRole("button", {
    exact: true,
    name: "Rotes Halsband auswählen",
  })
  const blueChoice = page.getByRole("button", {
    exact: true,
    name: "Blaues Halsband auswählen",
  })
  await expect(blueChoice).toHaveAttribute("aria-pressed", "true")
  await redChoice.click()
  await expect(graphic).toHaveAttribute("data-cat-collar", "red")
  await expect(petSubbar).toBeHidden()

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(graphic).toHaveAttribute("data-cat-collar", "red")

  await petControl.click()
  await page
    .getByRole("button", { exact: true, name: "Ohne Halsband auswählen" })
    .click()
  await expect(graphic).not.toHaveAttribute("data-cat-collar")
  await expect(collar).toHaveCSS("visibility", "hidden")
})
