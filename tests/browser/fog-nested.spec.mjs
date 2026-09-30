import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/fog-nested.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, "http://127.0.0.1:4173").href
}

test("rendert eine Energiekiste als echten Inhalt von @Nebel", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Die verschachtelte Makroexpansion wird einmal im echten LiaScript-Editor geprueft.",
  )
  test.setTimeout(150_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Verschachtelter Nebel",
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          activeRenderers: document.querySelectorAll(
            "[data-loot-fog-renderer]",
          ).length,
          chests: document.querySelectorAll(
            'lia-loot-fog lia-loot-chest[data-reward="energy"]',
          ).length,
          fogs: document.querySelectorAll(
            'lia-loot-fog[data-loot-fog-rendered="true"]',
          ).length,
          retiredRenderers: document.querySelectorAll(
            "[data-loot-fog-renderer-origin]",
          ).length,
          status: window.__LIA_LOOT_RUNTIME__?.status ?? null,
        })),
      {
        message: "Der verschachtelte Nebelinhalt wurde nicht uebernommen.",
        timeout: 55_000,
      },
    )
    .toEqual({
      activeRenderers: 0,
      chests: 1,
      fogs: 2,
      retiredRenderers: 2,
      status: "ready",
    })

  const fogs = page.locator("lia-loot-fog")
  const chestFog = fogs.first()
  const textFog = fogs.nth(1)
  const chest = chestFog.locator('lia-loot-chest[data-reward="energy"]')
  const chestButton = chest.locator(
    '[data-loot-chest-button][data-loot-chest-reward="energy"]',
  )
  await expect(chest).toHaveCount(1)
  await expect(chestButton).toHaveCount(1)
  await expect(textFog).toHaveText(
    "Eins, zwei, drei – diese lange Einzelzeile prüft die größeren und unterschiedlichen Wolkenformen im Kurs.",
  )
  await expect(chestFog).toHaveAttribute("data-loot-fog-blocked", "true")
  expect(await chestFog.evaluate((element) => element.inert)).toBe(true)

  const chestFogId = await chestFog.getAttribute("data-fog-id")
  const textFogId = await textFog.getAttribute("data-fog-id")
  expect(chestFogId).toBeTruthy()
  expect(textFogId).toBeTruthy()
  const chestOverlay = page.locator(
    `[data-loot-fog-overlay="${chestFogId}"]`,
  )
  const textOverlay = page.locator(
    `[data-loot-fog-overlay="${textFogId}"]`,
  )
  await expect(chestOverlay).toBeVisible()
  await expect(textOverlay).toBeVisible()
  const directHostGeometry = await page.evaluate(() => {
    const fogs = [...document.querySelectorAll("lia-loot-fog")]
    return fogs.map((fog) => {
      const box = fog.getBoundingClientRect()
      return { height: box.height, width: box.width }
    })
  })
  expect(directHostGeometry[0]?.width).toBeLessThan(140)
  expect(directHostGeometry[0]?.height).toBeLessThan(96)
  expect(directHostGeometry[1]?.height).toBeLessThan(88)
  const directFogGeometry = await page.evaluate(
    ({ chestId, textId }) => {
      const measure = (id) => {
        const overlay = document.querySelector(`[data-loot-fog-overlay="${id}"]`)
        const cloud = overlay?.querySelector(":scope > .loot-fog-cloud")
        const puff = cloud?.querySelector(".loot-fog-cloud__puff")
        const box = cloud?.getBoundingClientRect()
        return box
          ? {
              height: box.height,
              puffHeight: Number.parseFloat(puff?.style.height ?? "0"),
              puffTransform: puff?.style.transform ?? "",
              puffWidth: Number.parseFloat(puff?.style.width ?? "0"),
              sprite: puff?.getAttribute("data-loot-fog-sprite"),
              width: box.width,
            }
          : null
      }
      return {
        chest: measure(chestId),
        text: measure(textId),
      }
    },
    { chestId: chestFogId, textId: textFogId },
  )
  expect(directFogGeometry.chest?.width).toBeGreaterThanOrEqual(140)
  expect(directFogGeometry.chest?.height).toBeGreaterThanOrEqual(96)
  expect(directFogGeometry.chest?.puffTransform).toContain("scale(0.9)")
  expect(directFogGeometry.chest?.sprite).toBe("2")
  expect(directFogGeometry.text?.height).toBeGreaterThanOrEqual(64)

  const visibleCourseText = await page
    .locator(".lia-slide__content:not([hidden])")
    .innerText()
  expect(visibleCourseText).not.toContain("@Energiekiste")
  expect(visibleCourseText).not.toMatch(/<\/?lia-keep\s*>/iu)
  expect(visibleCourseText).not.toMatch(/(?:^|\n)\s*`\s*(?:\n|$)/u)
  expect(visibleCourseText).not.toContain("LIALOOTHIDDEN7QARGSEP")

  const rangeStart = page.locator("lia-loot-fog-start")
  const rangeId = await rangeStart.getAttribute("data-fog-id")
  expect(rangeId).toBeTruthy()
  const rangeOverlay = page.locator(
    `[data-loot-fog-overlay="${rangeId}"]`,
  )
  await expect(rangeOverlay).toBeVisible()
  await expect(rangeOverlay.locator(":scope > .loot-fog-cloud")).toHaveCount(1)
  expect(
    await rangeOverlay.evaluate((overlay) => {
      const cloud = overlay.querySelector(":scope > .loot-fog-cloud")
      const footer = document.querySelector("#outside-fog-footer")
      if (!cloud || !footer) return false
      return (
        cloud.getBoundingClientRect().bottom <=
        footer.getBoundingClientRect().top
      )
    }),
  ).toBe(true)

  const energy = page.locator('[data-loot-resource="energy"]')
  await expect(energy).toHaveText("0")
  await page.getByRole("button", { name: "Taschenlampe einsammeln" }).click()
  const flashlight = page.locator("#lia-loot-flashlight-tool")
  await flashlight.click()

  const box = await chestFog.boundingBox()
  expect(box).not.toBeNull()
  if (!box) throw new Error("Der Nebel um die Energiekiste hat keine Geometrie.")
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await expect(chestFog).toHaveClass(/loot-fog-target--under-beam/u)
  expect(await chestFog.evaluate((element) => element.inert)).toBe(false)
  await expect(chestButton).toBeVisible()
  await chestButton.click()
  await expect(energy).toHaveText("1")
  await expect(chestButton).toHaveCount(0)
})
