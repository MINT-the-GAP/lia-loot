import { readFile } from "node:fs/promises"

import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath =
  "/tests/browser/fixtures/reveal-inline-nested-macros.md"
const fixtureFile = new URL(
  "./fixtures/reveal-inline-nested-macros.md",
  import.meta.url,
)

const expectedLines = [
  "@Erdhaufen.inline( @Energiekiste )",
  "@Pflanze.inline( @Energietruhe )",
  "@Erdhaufen.inline( @Puzzleteil(tuerkis; 1) )",
  "@Pflanze.inline( @Puzzleteil(tuerkis; 2) )",
  "@Erdhaufen.inline( @Puzzleteil(tuerkis; 3) )",
  "@Pflanze.inline( @Puzzleteil(tuerkis; 4) )",
]

function editorUrl() {
  const courseUrl = new URL(
    fixturePath,
    "http://127.0.0.1:4173",
  ).href
  return editorPath + "?" + courseUrl
}

function reveals(page) {
  return page.locator(
    'lia-loot-reveal[data-reveal-layout="inline"]',
  )
}

function payload(page, index) {
  return reveals(page)
    .nth(index)
    .locator(":scope > [data-loot-reveal-payload]")
}

function gate(page) {
  return page.locator(
    '[data-loot-puzzle-gate-panel="puzzle-gate:turquoise"]',
  )
}

function gateSlot(page, slot) {
  return page.locator(
    `[data-loot-puzzle-slot="${slot}"][data-loot-puzzle-color="turquoise"]`,
  )
}

async function waitForNestedRendering(page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          chests: document.querySelectorAll(
            'lia-loot-reveal[data-reveal-layout="inline"] lia-loot-chest[data-reward="energy"]',
          ).length,
          markers: document.querySelectorAll(
            "[data-loot-inline-renderer], [data-loot-inline-tail]",
          ).length,
          pieces: document.querySelectorAll(
            "lia-loot-reveal[data-reveal-layout=inline] lia-loot-puzzle-piece",
          ).length,
          rendered: document.querySelectorAll(
            "lia-loot-reveal[data-loot-inline-rendered=true]",
          ).length,
          reveals: document.querySelectorAll(
            "lia-loot-reveal[data-reveal-layout=inline]",
          ).length,
          starts: document.querySelectorAll(
            "lia-loot-reveal-start",
          ).length,
          status: window.__LIA_LOOT_RUNTIME__?.status ?? null,
        })),
      {
        message:
          "Die verschachtelten Inline-Makros wurden nicht vollstaendig uebernommen.",
        timeout: 55_000,
      },
    )
    .toEqual({
      chests: 2,
      markers: 0,
      pieces: 4,
      rendered: 6,
      reveals: 6,
      starts: 0,
      status: "ready",
    })
}

async function innerIds(page) {
  return reveals(page).evaluateAll((hosts) =>
    hosts.map((host) => {
      const inner = host.querySelector(
        "lia-loot-chest, lia-loot-puzzle-piece",
      )
      return (
        inner?.getAttribute("data-chest-id") ??
        inner?.getAttribute("data-piece-id") ??
        null
      )
    }),
  )
}

async function collectPiece(page, number) {
  const pickup = page.locator(
    `[data-loot-puzzle-pickup][data-loot-puzzle-color="turquoise"][data-loot-puzzle-number="${number}"]`,
  )
  await expect(pickup).toBeVisible()
  await pickup.click()
  await expect(
    page.locator(
      `[data-loot-puzzle-inventory-piece="turquoise:${number}"]`,
    ),
  ).toBeVisible()
  await expect(pickup).toHaveCount(0)
}

async function placePiece(page, number, slot) {
  const piece = page.locator(
    `[data-loot-puzzle-inventory-piece="turquoise:${number}"]`,
  )
  await piece.click()
  await expect(piece).toHaveAttribute("aria-pressed", "true")
  await gateSlot(page, slot).click()
  await expect(gateSlot(page, slot)).toHaveAttribute(
    "data-loot-puzzle-number",
    String(number),
  )
}

test("rendert und bedient verschachtelte Makros in Inline-Reveals", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const markdown = (await readFile(fixtureFile, "utf8")).replace(
    /\r\n/gu,
    "\n",
  )
  expect(
    markdown
      .split("\n")
      .filter((line) =>
        /^@(Erdhaufen|Pflanze)\.inline/u.test(line),
      ),
  ).toEqual(expectedLines)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Verschachtelte Inline-Makros",
    }),
  ).toBeVisible({ timeout: 55_000 })
  await waitForNestedRendering(page)

  expect(
    await reveals(page).evaluateAll((hosts) =>
      hosts.map((host) => host.getAttribute("data-loot-reveal-kind")),
    ),
  ).toEqual(["soil", "plant", "soil", "plant", "soil", "plant"])

  const idsBeforeReload = await innerIds(page)
  expect(idsBeforeReload.every(Boolean)).toBe(true)
  expect(idsBeforeReload.every((id) => !id.startsWith("-1_"))).toBe(true)
  expect(new Set(idsBeforeReload).size).toBe(6)

  for (let index = 0; index < 6; index += 1) {
    const host = reveals(page).nth(index)
    const innerPayload = payload(page, index)
    await expect(host).toHaveCSS("display", "inline-grid")
    await expect(host).toHaveCSS("vertical-align", "middle")
    await expect(innerPayload).toHaveAttribute("hidden", "")
    await expect(innerPayload).toHaveAttribute("aria-hidden", "true")
    expect(await innerPayload.evaluate((element) => element.inert)).toBe(true)
    await expect(innerPayload).not.toBeVisible()
  }

  for (let index = 0; index < 2; index += 1) {
    await expect(
      payload(page, index).locator(
        'lia-loot-chest[data-reward="energy"]',
      ),
    ).toHaveCount(1)
  }
  for (let number = 1; number <= 4; number += 1) {
    await expect(
      payload(page, number + 1).locator(
        `lia-loot-puzzle-piece[data-options="tuerkis; ${number}"]`,
      ),
    ).toHaveCount(1)
  }

  const paragraphText = await page
    .locator(".lia-slide__content:not([hidden]) .lia-paragraph")
    .allTextContents()
  const renderedText = paragraphText.join("\n")
  expect(renderedText).not.toContain("@Energietruhe")
  expect(renderedText).not.toContain("@Energiekiste")
  expect(renderedText).not.toContain("@Puzzleteil")
  expect(renderedText).not.toContain("<lia-keep>")
  expect(renderedText).not.toContain("<lia-loot")
  expect(renderedText).not.toContain(")")
  await expect(gate(page)).not.toHaveClass(/loot-puzzle-gate--invalid/u)

  await page.getByRole("button", { name: "Schaufel einsammeln" }).click()
  await page.getByRole("button", { name: /Gie.*kanne einsammeln/u }).click()

  const shovel = page.locator('[data-loot-tool-control="shovel"]')
  const wateringCan = page.locator(
    '[data-loot-tool-control="watering-can"]',
  )
  await shovel.click()
  for (const index of [0, 2, 4]) {
    const host = reveals(page).nth(index)
    await host
      .getByRole("button", {
        name: "Erdhaufen mit Schaufel wegbuddeln",
      })
      .click()
    await expect(host).toHaveAttribute(
      "data-loot-reveal-state",
      "revealed",
    )
    await expect(payload(page, index)).toBeVisible()
    expect(await payload(page, index).evaluate((element) => element.inert)).toBe(
      false,
    )
  }

  await wateringCan.click()
  for (const index of [1, 3, 5]) {
    const host = reveals(page).nth(index)
    await host.getByRole("button", { name: /Pflanze mit/u }).click()
    await expect(host).toHaveAttribute(
      "data-loot-reveal-state",
      "bloomed",
    )
    await host.getByRole("button", { name: /Pflanze .*ffnen/u }).click()
    await expect(host).toHaveAttribute(
      "data-loot-reveal-state",
      "revealed",
    )
    await expect(payload(page, index)).toBeVisible()
    expect(await payload(page, index).evaluate((element) => element.inert)).toBe(
      false,
    )
  }

  const energy = page.locator('[data-loot-resource="energy"]')
  const chestButtons = page.locator(
    '[data-loot-chest-button][data-loot-chest-reward="energy"]',
  )
  await expect(chestButtons).toHaveCount(2)
  const chestButtonIds = await chestButtons.evaluateAll((buttons) =>
    buttons.map((button) => button.getAttribute("data-loot-chest-button")),
  )
  expect(chestButtonIds.every(Boolean)).toBe(true)
  expect(chestButtonIds.every((id) => !id.startsWith("-1_"))).toBe(true)
  expect(new Set(chestButtonIds).size).toBe(2)

  await chestButtons.first().click()
  await expect(energy).toHaveText("1")
  await expect(chestButtons).toHaveCount(1)
  await chestButtons.first().click()
  await expect(energy).toHaveText("2")
  await expect(chestButtons).toHaveCount(0)

  for (let number = 1; number <= 4; number += 1) {
    await collectPiece(page, number)
  }
  await expect(
    page.locator(
      '#lia-loot-puzzle-inventory [data-loot-puzzle-inventory-piece][data-loot-puzzle-color="turquoise"]',
    ),
  ).toHaveCount(4)

  for (let number = 1; number <= 4; number += 1) {
    await placePiece(page, number, number - 1)
  }
  await expect(gate(page)).toHaveClass(/loot-puzzle-gate--open/u)
  expect(
    await page
      .locator(
        '[data-loot-puzzle-slot][data-loot-puzzle-color="turquoise"]',
      )
      .evaluateAll((slots) =>
        slots.map((slot) =>
          Number(slot.getAttribute("data-loot-puzzle-number")),
        ),
      ),
  ).toEqual([1, 2, 3, 4])

  await page.reload({ timeout: 30_000, waitUntil: "domcontentloaded" })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Verschachtelte Inline-Makros",
    }),
  ).toBeVisible({ timeout: 55_000 })
  await waitForNestedRendering(page)
  expect(await innerIds(page)).toEqual(idsBeforeReload)
  await expect(reveals(page)).toHaveCount(6)
  for (let index = 0; index < 6; index += 1) {
    await expect(reveals(page).nth(index)).toHaveAttribute(
      "data-loot-reveal-state",
      "revealed",
    )
  }
  await expect(energy).toHaveText("2")
  await expect(chestButtons).toHaveCount(0)
  await expect(page.locator("[data-loot-puzzle-pickup]")).toHaveCount(0)
  await expect(gate(page)).toHaveClass(/loot-puzzle-gate--open/u)
})
