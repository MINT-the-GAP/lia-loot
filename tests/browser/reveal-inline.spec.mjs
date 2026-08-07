import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixture = {
  heading: "Inline-Freigaben",
  path: "/tests/browser/fixtures/reveal-inline.md",
}

function editorUrl(coursePath) {
  return editorPath + "?" + new URL(coursePath, testOrigin).href
}

async function achievementIds(page) {
  return page.evaluate(() => {
    const key = Object.keys(window.sessionStorage).find((candidate) =>
      candidate.startsWith("lia-loot:achievements:v1:"),
    )
    if (!key) return []
    try {
      const state = JSON.parse(window.sessionStorage.getItem(key) ?? "null")
      return Array.isArray(state?.unlocked) ? state.unlocked : []
    } catch {
      return []
    }
  })
}

async function sharesParagraph(host, beforeId, afterId) {
  return host.evaluate(
    (element, ids) => {
      const paragraph = element.closest("p")
      const before = document.getElementById(ids.beforeId)
      const after = document.getElementById(ids.afterId)
      return Boolean(
        paragraph &&
          before &&
          after &&
          paragraph.contains(before) &&
          paragraph.contains(element) &&
          paragraph.contains(after),
      )
    },
    { afterId, beforeId },
  )
}

test("rendert Erde und Pflanze inline im echten LiaScript-Editor", async ({
  page,
}) => {
  test.setTimeout(150_000)

  await page.goto(editorUrl(fixture.path), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { name: fixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          reveals: document.querySelectorAll(
            "lia-loot-reveal[data-reveal-layout=inline]",
          ).length,
          starts: document.querySelectorAll("lia-loot-reveal-start").length,
          status: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          tools: document.querySelectorAll("lia-loot-tool").length,
        })),
      {
        message:
          "LiaScript hat die beiden Inline-Reveals nicht vollstaendig gerendert.",
        timeout: 55_000,
      },
    )
    .toEqual({
      reveals: 2,
      starts: 0,
      status: "ready",
      tools: 2,
    })

  const soil = page.locator(
    "lia-loot-reveal[data-reveal-layout=inline]" +
      "[data-loot-reveal-kind=soil]",
  )
  const plant = page.locator(
    "lia-loot-reveal[data-reveal-layout=inline]" +
      "[data-loot-reveal-kind=plant]",
  )
  const soilPayload = soil.locator(
    ":scope > [data-loot-reveal-payload]",
  )
  const plantPayload = plant.locator(
    ":scope > [data-loot-reveal-payload]",
  )
  const surroundingText = page.locator(
    "#inline-soil-before, #inline-soil-after, " +
      "#inline-plant-before, #inline-plant-after",
  )

  await expect(soil).toHaveCount(1)
  await expect(plant).toHaveCount(1)
  await expect(soil).toHaveCSS("display", "inline-grid")
  await expect(plant).toHaveCSS("display", "inline-grid")
  await expect(soil).toHaveCSS("vertical-align", "middle")
  await expect(plant).toHaveCSS("vertical-align", "middle")
  expect(
    await sharesParagraph(
      soil,
      "inline-soil-before",
      "inline-soil-after",
    ),
  ).toBe(true)
  expect(
    await sharesParagraph(
      plant,
      "inline-plant-before",
      "inline-plant-after",
    ),
  ).toBe(true)
  await expect(surroundingText).toHaveCount(4)
  for (const text of await surroundingText.all()) {
    await expect(text).toBeVisible()
  }

  await expect(soil).toHaveAttribute("data-loot-reveal-state", "locked")
  await expect(plant).toHaveAttribute("data-loot-reveal-state", "locked")
  for (const payload of [soilPayload, plantPayload]) {
    await expect(payload).toHaveAttribute("hidden", "")
    await expect(payload).toHaveAttribute("aria-hidden", "true")
    expect(await payload.evaluate((element) => element.inert)).toBe(true)
  }
  await expect(soilPayload).not.toBeVisible()
  await expect(plantPayload).not.toBeVisible()

  await page.getByRole("button", { name: "Schaufel einsammeln" }).click()
  await page.getByRole("button", { name: /Gie.*kanne einsammeln/u }).click()

  const shovelTool = page.getByRole("button", {
    name: /Schaufel (?:aktivieren|deaktivieren)/u,
  })
  const wateringCanTool = page.getByRole("button", {
    name: /Gie.*kanne (?:aktivieren|deaktivieren)/u,
  })
  await shovelTool.click()
  await expect(shovelTool).toHaveAttribute("aria-pressed", "true")
  await soil
    .getByRole("button", {
      name: "Erdhaufen mit Schaufel wegbuddeln",
    })
    .click()

  await expect(soil).toHaveAttribute("data-loot-reveal-state", "revealed")
  await expect(soilPayload).not.toHaveAttribute("hidden", "")
  await expect(soilPayload).not.toHaveAttribute("aria-hidden", "true")
  expect(await soilPayload.evaluate((element) => element.inert)).toBe(false)
  await expect(soilPayload).toBeVisible()
  await expect(soilPayload).toHaveText("Erdnotiz")
  await expect(plant).toHaveAttribute("data-loot-reveal-state", "locked")
  await expect.poll(() => achievementIds(page)).toContain("all-soil-dug")

  await wateringCanTool.click()
  await expect(shovelTool).toHaveAttribute("aria-pressed", "false")
  await expect(wateringCanTool).toHaveAttribute("aria-pressed", "true")
  await plant.getByRole("button", { name: /Pflanze mit/u }).click()

  await expect(plant).toHaveAttribute("data-loot-reveal-state", "bloomed")
  await expect(plantPayload).toHaveAttribute("hidden", "")
  await expect(plantPayload).toHaveAttribute("aria-hidden", "true")
  expect(await plantPayload.evaluate((element) => element.inert)).toBe(true)
  await expect(plantPayload).not.toBeVisible()
  await expect
    .poll(() => achievementIds(page))
    .toContain("all-plants-bloomed")

  await plant
    .getByRole("button", { name: /Pflanze .*ffnen/u })
    .click()
  await expect(plant).toHaveAttribute("data-loot-reveal-state", "revealed")
  await expect(plantPayload).not.toHaveAttribute("hidden", "")
  await expect(plantPayload).not.toHaveAttribute("aria-hidden", "true")
  expect(await plantPayload.evaluate((element) => element.inert)).toBe(false)
  await expect(plantPayload).toBeVisible()
  await expect(plantPayload).toHaveText("Bluetennotiz")
  for (const text of await surroundingText.all()) {
    await expect(text).toBeVisible()
  }

  await page.reload({ timeout: 30_000, waitUntil: "domcontentloaded" })
  await expect(
    page.getByRole("heading", { name: fixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(soil).toHaveAttribute("data-loot-reveal-state", "revealed")
  await expect(plant).toHaveAttribute("data-loot-reveal-state", "revealed")
  await expect(soilPayload).not.toHaveAttribute("hidden", "")
  await expect(plantPayload).not.toHaveAttribute("hidden", "")
  await expect(soilPayload).toBeVisible()
  await expect(plantPayload).toBeVisible()
  await expect(soilPayload).toHaveText("Erdnotiz")
  await expect(plantPayload).toHaveText("Bluetennotiz")
  await expect(soil).toHaveCSS("display", "inline-grid")
  await expect(plant).toHaveCSS("display", "inline-grid")
})
