import { readFile } from "node:fs/promises"

import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/puzzle-gates.md"
const fixtureFile = new URL("./fixtures/puzzle-gates.md", import.meta.url)

function editorUrl() {
  const courseUrl = new URL(fixturePath, "http://127.0.0.1:4173").href
  return `${editorPath}?${courseUrl}`
}

function heading(page, name) {
  return page.getByRole("heading", { exact: true, name })
}

function gate(page, color) {
  return page.locator(
    `[data-loot-puzzle-gate-panel="puzzle-gate:${color}"]`,
  )
}

function gateSlot(page, color, slot) {
  return page.locator(
    `[data-loot-puzzle-slot="${slot}"][data-loot-puzzle-color="${color}"]`,
  )
}

async function openFixture(page) {
  await page.setViewportSize({ height: 800, width: 1280 })
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(heading(page, "Rotes Puzzletor")).toBeVisible({
    timeout: 55_000,
  })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      {
        message: "Die lokale Loot-Runtime wurde nicht bereit.",
        timeout: 55_000,
      },
    )
    .toBe("ready")
  await expect(gate(page, "red")).toBeVisible({ timeout: 55_000 })
  await expect(
    page.locator('[data-loot-puzzle-pickup][data-loot-puzzle-color="red"]'),
  ).toHaveCount(6, { timeout: 55_000 })
}

async function openToc(page) {
  const toc = page.locator("#lia-toc .lia-toc__content")
  if (!(await toc.isVisible())) {
    await page.locator("#lia-btn-toc").click()
  }
  await expect(toc).toBeVisible()
}

async function closeToc(page) {
  const toc = page.locator("#lia-toc .lia-toc__content")
  if (await toc.isVisible()) {
    await page.locator("#lia-btn-toc").click()
  }
}

async function expectTocFrontier(page, firstBlockedSlide) {
  await openToc(page)
  for (let slide = 1; slide <= 4; slide += 1) {
    const link = page.locator(`#lia-toc a[href="#${slide}"]`)
    await expect(link).toHaveCount(1)
    if (slide >= firstBlockedSlide) {
      await expect(link).toHaveClass(/loot-puzzle-slide-link--blocked/u)
      await expect(link).not.toBeVisible()
    } else {
      await expect(link).not.toHaveClass(/loot-puzzle-slide-link--blocked/u)
      await expect(link).toBeVisible()
    }
  }
  await closeToc(page)
}

async function collectPieces(page, color, numbers) {
  for (const number of numbers) {
    const pickup = page.locator(
      `[data-loot-puzzle-pickup][data-loot-puzzle-color="${color}"][data-loot-puzzle-number="${number}"]`,
    )
    await expect(pickup).toBeVisible()
    await pickup.click()
    await expect(page.locator("#lia-loot-resource-status")).toContainText(
      "Puzzleteil " + number,
    )
    await expect(
      page.locator(
        `[data-loot-puzzle-inventory-piece="${color}:${number}"]`,
      ),
    ).toBeVisible()
    await expect(pickup).toHaveCount(0)
  }

  const inventory = page.locator(
    `#lia-loot-puzzle-inventory [data-loot-puzzle-inventory-piece][data-loot-puzzle-color="${color}"]`,
  )
  await expect(inventory).toHaveCount(numbers.length)
  await expect(page.locator("#lia-loot-puzzle-inventory")).toBeVisible()
}

async function placeInventoryPiece(page, color, number, slot) {
  const piece = page.locator(
    `[data-loot-puzzle-inventory-piece="${color}:${number}"]`,
  )
  await expect(piece).toBeVisible()
  await piece.click()
  await expect(piece).toHaveAttribute("aria-pressed", "true")

  const target = gateSlot(page, color, slot)
  await target.click()
  await expect(target).toHaveAttribute("data-loot-puzzle-number", String(number))
}

async function movePlacedPiece(page, color, number, targetSlot) {
  const piece = page.locator(
    `[data-loot-puzzle-slot][data-loot-puzzle-color="${color}"][data-loot-puzzle-number="${number}"]`,
  )
  await expect(piece).toHaveCount(1)
  await piece.click()
  await expect(piece).toHaveAttribute("aria-pressed", "true")
  await expect(piece).toBeFocused()

  const target = gateSlot(page, color, targetSlot)
  await target.click()
  await expect(target).toHaveAttribute("data-loot-puzzle-number", String(number))
  await expect(target).toBeFocused()
}

async function placement(page, color) {
  return page
    .locator(`[data-loot-puzzle-slot][data-loot-puzzle-color="${color}"]`)
    .evaluateAll((slots) =>
      slots.map((slot) => Number(slot.getAttribute("data-loot-puzzle-number"))),
    )
}

async function expectOpenGate(page, color, expectedPlacement) {
  await expect(gate(page, color)).toHaveClass(/loot-puzzle-gate--open/u)
  await expect(gate(page, color)).toHaveAttribute(
    "aria-label",
    /geöffnet/u,
  )
  await expect
    .poll(() => placement(page, color), {
      message: `Das ${color}-Puzzletor hat nicht die Sollreihenfolge.`,
    })
    .toEqual(expectedPlacement)
  const slots = page.locator(
    `[data-loot-puzzle-slot][data-loot-puzzle-color="${color}"]`,
  )
  await expect(slots).toHaveCount(expectedPlacement.length)
  expect(
    await slots.evaluateAll((elements) =>
      elements.every((element) => element instanceof HTMLButtonElement && element.disabled),
    ),
  ).toBe(true)
}

test("sammelt, ordnet und persistiert Puzzleteile und sperrt Folien bis zum passenden Tor", async ({
  page,
}) => {
  test.setTimeout(180_000)

  const markdown = await readFile(fixtureFile, "utf8")
  expect(markdown).toContain(
    "Drei rote Teile liegen im Satz: @Puzzleteil(rot; 1), dann @Puzzleteil(rot; 2) und schließlich @Puzzleteil(rot; 3).",
  )
  expect(markdown).toContain("@Puzzleteil(rot; 4)")
  expect(markdown).toContain("@Puzzletor(rot; [[2;3];[1;6];[5;4]])")
  expect(markdown).not.toContain("@EndePuzzletor")

  await openFixture(page)

  const inlineSentence = page
    .locator(".lia-paragraph")
    .filter({ hasText: "Drei rote Teile liegen im Satz" })
  await expect(inlineSentence).toHaveCount(1)
  const inlineHosts = inlineSentence.locator(
    [
      'lia-loot-puzzle-piece[data-options="rot; 1"]',
      'lia-loot-puzzle-piece[data-options="rot; 2"]',
      'lia-loot-puzzle-piece[data-options="rot; 3"]',
    ].join(", "),
  )
  await expect(inlineHosts).toHaveCount(3)
  const inlineHostState = await inlineHosts.evaluateAll((hosts) =>
    hosts.map((host) => ({
      id: host.getAttribute("data-piece-id"),
      options: host.getAttribute("data-options"),
    })),
  )
  expect(inlineHostState.map(({ options }) => options)).toEqual([
    "rot; 1",
    "rot; 2",
    "rot; 3",
  ])
  expect(inlineHostState.every(({ id }) => Boolean(id))).toBe(true)
  expect(new Set(inlineHostState.map(({ id }) => id)).size).toBe(3)
  const inlinePickups = inlineHosts.locator("[data-loot-puzzle-pickup]")
  await expect(inlinePickups).toHaveCount(3)
  expect(
    await inlinePickups.evaluateAll((pickups) =>
      pickups.map((pickup) =>
        Number(pickup.getAttribute("data-loot-puzzle-number")),
      ),
    ),
  ).toEqual([1, 2, 3])
  await expect(gate(page, "red")).not.toHaveClass(
    /loot-puzzle-gate--invalid/u,
  )

  await page.evaluate(() => {
    window.__lootPuzzleBlockedSlideActivated = false
    const blockedHeading = [...document.querySelectorAll("h1, h2, h3")].find(
      (element) => element.textContent?.trim() === "Blaues Puzzletor",
    )
    const blockedSlide = blockedHeading?.closest("main")
    if (!blockedSlide) throw new Error("Zweite Puzzlefolie fehlt")
    new MutationObserver((records) => {
      if (
        records.some(
          (record) =>
            record.attributeName === "hidden" &&
            record.oldValue !== null,
        )
      ) {
        window.__lootPuzzleBlockedSlideActivated = true
      }
    }).observe(blockedSlide, {
      attributeFilter: ["hidden"],
      attributeOldValue: true,
      attributes: true,
    })
  })

  const redHeading = heading(page, "Rotes Puzzletor")
  const blueHeading = heading(page, "Blaues Puzzletor")
  const anchorHeading = heading(page, "Geankertes grünes Puzzletor")
  const finalHeading = heading(page, "Freigeschaltetes Kursende")
  const anchorSecret = page.locator("#puzzle-anchor-secret")
  const portal = page.locator("[data-loot-slide-portal-button]")

  await expectTocFrontier(page, 2)

  await page.evaluate(() => {
    window.__lootExternalNumericLinkReached = false
    const link = document.createElement("a")
    link.id = "loot-external-numeric-fragment"
    link.href = "https://example.org/#3"
    link.textContent = "Externer Fragmentlink"
    link.addEventListener("click", (event) => {
      window.__lootExternalNumericLinkReached = true
      event.preventDefault()
    })
    document.body.append(link)
  })
  await page.locator("#loot-external-numeric-fragment").click()
  expect(
    await page.evaluate(() => window.__lootExternalNumericLinkReached),
  ).toBe(true)
  await expect(redHeading).toBeVisible()

  await page.evaluate(() => {
    window.__lootPuzzleEditorArrowReached = false
    window.__lootPuzzleEditorAsyncKey = null
    const editor = document.createElement("div")
    editor.id = "loot-puzzle-editor-probe"
    editor.className = "CodeMirror"
    const input = document.createElement("textarea")
    input.setAttribute("aria-label", "Editorprobe")
    editor.append(input)
    editor.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        window.__lootPuzzleEditorArrowReached = true
      }
      queueMicrotask(() => {
        window.__lootPuzzleEditorAsyncKey = event.key
      })
    })
    document.body.append(editor)
    input.focus()
  })
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.__lootPuzzleBlockedSlideActivated = false
            resolve()
          })
        })
      }),
  )
  await page.keyboard.down("ArrowRight")
  expect(
    await page.evaluate(() => window.__lootPuzzleEditorArrowReached),
  ).toBe(true)
  expect(
    await page.evaluate(() => window.__lootPuzzleEditorAsyncKey),
  ).toBe("ArrowRight")
  const activatedAfterKeydown = await page.evaluate(
    () => window.__lootPuzzleBlockedSlideActivated,
  )
  await page.keyboard.up("ArrowRight")
  const activatedAfterKeyup = await page.evaluate(
    () => window.__lootPuzzleBlockedSlideActivated,
  )
  await expect(redHeading).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#1")
  expect({ activatedAfterKeydown, activatedAfterKeyup }).toEqual({
    activatedAfterKeydown: false,
    activatedAfterKeyup: false,
  })
  await page.locator("#loot-puzzle-editor-probe").evaluate((editor) => {
    editor.remove()
  })

  await page.locator("#lia-btn-next").click()
  await expect(redHeading).toBeVisible()
  await expect(blueHeading).not.toBeVisible()
  expect(
    await page.evaluate(() => window.__lootPuzzleBlockedSlideActivated),
  ).toBe(false)

  await page.keyboard.press("ArrowRight")
  await expect(redHeading).toBeVisible()
  await expect(blueHeading).not.toBeVisible()
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#1")
  expect(
    await page.evaluate(() => window.__lootPuzzleBlockedSlideActivated),
  ).toBe(false)

  await page.evaluate(() => {
    window.location.hash = "#3"
  })
  await expect(redHeading).toBeVisible()
  await expect(anchorHeading).not.toBeVisible()
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#1")

  await expect(portal).toBeVisible()
  await portal.click()
  await expect(redHeading).toBeVisible()
  await expect(anchorHeading).not.toBeVisible()
  await expect(page.locator("#lia-loot-slide-portal-status")).toContainText(
    "Puzzletor",
  )
  await expect(
    page.locator("[data-loot-slide-portal-return-button]"),
  ).toHaveCount(0)

  await collectPieces(page, "red", [1, 2, 3, 4, 5, 6])
  await expect(gate(page, "red").locator(".loot-puzzle-gate__progress")).toContainText(
    "Gesammelt: 6 von 6",
  )
  await page.evaluate(() => {
    const piece = document.querySelector(
      '[data-loot-puzzle-inventory-piece="red:6"]',
    )
    if (!piece) throw new Error("Drag-Testteil fehlt")
    const transfer = new DataTransfer()
    piece.dispatchEvent(
      new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: transfer,
      }),
    )
    piece.dispatchEvent(
      new DragEvent("dragend", {
        bubbles: true,
        dataTransfer: transfer,
      }),
    )
  })
  await gateSlot(page, "red", 0).click()
  await expect(gateSlot(page, "red", 0)).not.toHaveAttribute(
    "data-loot-puzzle-number",
  )
  for (let number = 1; number <= 6; number += 1) {
    await placeInventoryPiece(page, "red", number, number - 1)
    if (number === 1) {
      const firstSlot = gateSlot(page, "red", 0)
      await expect(firstSlot).toBeFocused()
      await firstSlot.click()
      await expect(firstSlot).toHaveAttribute("aria-pressed", "true")
      await page.keyboard.press("Escape")
      await expect(firstSlot).toBeFocused()
      await expect(firstSlot).toHaveAttribute("aria-pressed", "false")
    }
  }
  await expect
    .poll(() => placement(page, "red"))
    .toEqual([1, 2, 3, 4, 5, 6])
  await expect(gate(page, "red")).not.toHaveClass(/loot-puzzle-gate--open/u)
  await expect(gate(page, "red")).toHaveAttribute("aria-label", /geschlossen/u)
  await expect(page.locator("#lia-loot-puzzle-inventory")).toHaveCount(0)
  await expectTocFrontier(page, 2)

  await movePlacedPiece(page, "red", 2, 0)
  await movePlacedPiece(page, "red", 3, 1)
  await placeInventoryPiece(page, "red", 1, 2)
  await movePlacedPiece(page, "red", 6, 3)
  await placeInventoryPiece(page, "red", 4, 5)
  await expectOpenGate(page, "red", [2, 3, 1, 6, 5, 4])
  await expect(page.locator("#lia-loot-resource-status")).toContainText(
    "geöffnet",
  )
  expect(
    await page.locator("#lia-loot-resource-status").evaluate(
      (status) => status.parentElement === document.body,
    ),
  ).toBe(true)
  await expectTocFrontier(page, 3)

  await page.keyboard.press("ArrowRight")
  await expect(blueHeading).toBeVisible()
  await expect(redHeading).not.toBeVisible()

  await collectPieces(page, "blue", [1, 2])
  await placeInventoryPiece(page, "blue", 2, 0)
  await placeInventoryPiece(page, "blue", 1, 1)
  await expectOpenGate(page, "blue", [2, 1])
  await expectTocFrontier(page, 5)

  await page.keyboard.press("ArrowLeft")
  await expect(redHeading).toBeVisible()
  await portal.click()
  await expect(anchorHeading).toBeVisible()
  await expect(redHeading).not.toBeVisible()
  await expect(
    page.locator("[data-loot-slide-portal-return-button]"),
  ).toHaveCount(1)

  await expect(anchorSecret).toHaveCount(1)
  await expect(anchorSecret).not.toBeVisible()
  expect(
    await anchorSecret.evaluate((element) =>
      Boolean(element.closest("[data-loot-puzzle-range-blocked]")),
    ),
  ).toBe(true)

  await page.keyboard.press("ArrowRight")
  await expect(finalHeading).toBeVisible()
  await expect(anchorHeading).not.toBeVisible()
  await page.keyboard.press("ArrowLeft")
  await expect(anchorHeading).toBeVisible()
  await expect(anchorSecret).not.toBeVisible()

  await collectPieces(page, "green", [1, 2])
  await placeInventoryPiece(page, "green", 2, 0)
  await placeInventoryPiece(page, "green", 1, 1)
  await expectOpenGate(page, "green", [2, 1])
  await expect(anchorSecret).toBeVisible()
  expect(
    await anchorSecret.evaluate((element) =>
      Boolean(element.closest("[data-loot-puzzle-range-blocked]")),
    ),
  ).toBe(false)

  await page.reload({ timeout: 30_000, waitUntil: "domcontentloaded" })
  await expect(anchorHeading).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expectOpenGate(page, "green", [2, 1])
  await expect(anchorSecret).toBeVisible()
  await expect(page.locator("[data-loot-puzzle-pickup]")).toHaveCount(0)
  await expect(page.locator("#lia-loot-puzzle-inventory")).toHaveCount(0)
  await expectTocFrontier(page, 5)

  await page.keyboard.press("ArrowRight")
  await expect(finalHeading).toBeVisible()
})
