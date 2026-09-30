import { expect, test } from "./playwright-fixtures.mjs"

const fixtureUrl = "/tests/browser/fixtures/flashlight.html"

async function waitForRuntime(page) {
  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__LIA_LOOT_RUNTIME__?.status ?? "missing",
        ),
      { message: "Die Loot-Runtime wurde nicht bereit.", timeout: 15_000 },
    )
    .toBe("ready")
}

test("Taschenlampe macht Inline- und Bereichsnebel gezielt bedienbar", async ({
  page,
}) => {
  await page.goto(`${fixtureUrl}?version=flashlight-e2e`)
  await waitForRuntime(page)

  const inlineFog = page.locator("#inline-fog")
  const blockCopy = page.locator("#block-copy")
  const blockAction = page.locator("#block-action")
  const blockFogOverlay = page.locator(
    '[data-loot-fog-overlay="block-fog"]',
  )
  const inlineFogOverlay = page.locator(
    '[data-loot-fog-overlay="inline-fog"]',
  )
  for (const target of [inlineFog, blockCopy, blockAction]) {
    await expect(target).toHaveClass(/\bloot-fog-target\b/u)
    await expect(target).toHaveAttribute("data-loot-fog-blocked", "true")
    expect(await target.evaluate((element) => element.inert)).toBe(true)
    expect(
      await target.evaluate((element) => getComputedStyle(element).clipPath),
    ).toContain("circle(0px")
  }
  await expect(blockCopy).toHaveClass(/\bloot-fog-target--range\b/u)
  await expect(blockAction).toHaveClass(/\bloot-fog-target--range\b/u)
  await expect(inlineFog).toHaveClass(/\bloot-fog-target--range\b/u)
  await expect(inlineFogOverlay).toBeVisible()
  await expect(blockFogOverlay).toBeVisible()
  expect(
    await blockFogOverlay.evaluate((overlay) =>
      Number.parseInt(getComputedStyle(overlay).zIndex, 10),
    ),
  ).toBeGreaterThan(200)
  const cloudGeometry = await blockFogOverlay.evaluate((overlay) => {
      const overlayRect = overlay.getBoundingClientRect()
      const copy = document.querySelector("#block-copy")
      const actionRect = document
        .querySelector("#block-action")
        ?.getBoundingClientRect()
      const outsideFooterRect = document
        .querySelector("#outside-footer")
        ?.getBoundingClientRect()
      if (!copy || !actionRect || !outsideFooterRect) return null
      const copyRect = copy.getBoundingClientRect()
      const copyRange = document.createRange()
      copyRange.selectNodeContents(copy)
      const copyTextRects = [...copyRange.getClientRects()]
      const cloudRects = [
        ...overlay.querySelectorAll(":scope > .loot-fog-cloud"),
      ].map((cloud) => cloud.getBoundingClientRect())
      const intersects = (left, right) =>
        left.left < right.right &&
        left.right > right.left &&
        left.top < right.bottom &&
        left.bottom > right.top
      const emptyPoint = {
        x: copyRect.right - 12,
        y: copyTextRects[0]?.top + copyTextRects[0]?.height / 2,
      }
      return {
        cloudCount: cloudRects.length,
        cloudsCoverContent: [...copyTextRects, actionRect].every((targetRect) =>
          cloudRects.some((cloudRect) =>
            intersects(cloudRect, targetRect),
          ),
        ),
        emptyAreaIsFree:
          Number.isFinite(emptyPoint.y) &&
          document
            .elementFromPoint(emptyPoint.x, emptyPoint.y)
            ?.closest(".loot-fog-cloud") === null,
        outsideFooterIsFree: cloudRects.every(
          (cloudRect) => cloudRect.bottom <= outsideFooterRect.top,
        ),
        overlayIsNarrowerThanBlock: overlayRect.width < copyRect.width,
      }
    })
  expect(cloudGeometry).not.toBeNull()
  expect(cloudGeometry?.cloudCount).toBe(1)
  expect(cloudGeometry?.cloudsCoverContent).toBe(true)
  expect(cloudGeometry?.emptyAreaIsFree).toBe(true)
  expect(cloudGeometry?.outsideFooterIsFree).toBe(true)
  expect(cloudGeometry?.overlayIsNarrowerThanBlock).toBe(true)
  for (const overlay of [inlineFogOverlay, blockFogOverlay]) {
    const puffs = overlay.locator(".loot-fog-cloud__puff")
    await expect(puffs.first()).toBeVisible()
    const backgroundImage = await puffs
      .first()
      .evaluate((puff) => getComputedStyle(puff).backgroundImage)
    expect(backgroundImage).toContain("data:image/png;base64,")
    expect(backgroundImage).not.toContain("gradient")
    const pixelFinish = await puffs.first().evaluate((puff) => {
      const style = getComputedStyle(puff)
      return {
        backgroundRepeat: style.backgroundRepeat,
        backgroundSize: style.backgroundSize,
        filter: style.filter,
        imageRendering: style.imageRendering,
        opacity: Number(style.opacity),
      }
    })
    expect(pixelFinish.imageRendering).toBe("pixelated")
    expect(pixelFinish.backgroundRepeat).toContain("no-repeat")
    expect(pixelFinish.backgroundSize).toContain("contain")
    expect(pixelFinish.filter).toContain("blur(")
    expect(pixelFinish.filter).toContain("brightness(0.52)")
    expect(pixelFinish.opacity).toBeLessThan(1)
  }
  const cloudLayerCounts = await blockFogOverlay
    .locator(":scope > .loot-fog-cloud")
    .evaluateAll((clouds) =>
      clouds.map(
        (cloud) =>
          cloud.querySelectorAll(":scope > .loot-fog-cloud__puff").length,
      ),
    )
  expect(cloudLayerCounts.every((count) => count > 3)).toBe(true)
  const blockSpriteVariants = await blockFogOverlay
    .locator(".loot-fog-cloud__puff")
    .evaluateAll((puffs) =>
      new Set(puffs.map((puff) => puff.getAttribute("data-loot-fog-sprite"))).size,
    )
  expect(blockSpriteVariants).toBeGreaterThanOrEqual(3)
  expect(
    await blockFogOverlay
      .locator('[data-loot-fog-connector="true"]')
      .count(),
  ).toBeGreaterThan(0)
  await expect(blockFogOverlay.locator(".loot-fog-cloud--bridge")).toHaveCount(0)

  await page.getByRole("button", { name: "Taschenlampe einsammeln" }).click()
  const tool = page.locator("#lia-loot-flashlight-tool")
  await expect(tool).toHaveAccessibleName("Taschenlampe aktivieren")
  await tool.click()
  await expect(tool).toHaveAccessibleName("Taschenlampe deaktivieren")

  const inlineBox = await inlineFog.boundingBox()
  expect(inlineBox).not.toBeNull()
  if (!inlineBox) throw new Error("Der Inline-Nebel hat keine Geometrie.")
  await page.mouse.move(
    inlineBox.x + inlineBox.width / 2,
    inlineBox.y + inlineBox.height / 2,
  )
  await expect(inlineFog).toHaveClass(/\bloot-fog-target--under-beam\b/u)
  expect(await inlineFog.evaluate((element) => element.inert)).toBe(false)
  expect(
    await inlineFog.evaluate((element) => getComputedStyle(element).clipPath),
  ).not.toContain("circle(0px")
  await expect(page.getByRole("button", { name: "Inline-Aktion" })).toBeVisible()

  const blockBox = await blockAction.boundingBox()
  expect(blockBox).not.toBeNull()
  if (!blockBox) throw new Error("Der Blocknebel hat keine Geometrie.")
  await page.mouse.move(
    blockBox.x + blockBox.width / 2,
    blockBox.y + blockBox.height / 2,
  )
  await expect(blockAction).toHaveClass(/\bloot-fog-target--under-beam\b/u)
  await expect(blockFogOverlay).toHaveClass(
    /\bloot-fog-overlay--under-beam\b/u,
  )
  expect(await blockAction.evaluate((element) => element.inert)).toBe(false)
  expect(
    await blockAction.evaluate((element) => getComputedStyle(element).clipPath),
  ).not.toContain("circle(0px")
  await expect(page.getByRole("button", { name: "Block-Aktion" })).toBeVisible()

  await tool.click()
  await expect(tool).toHaveAccessibleName("Taschenlampe aktivieren")
  expect(await blockAction.evaluate((element) => element.inert)).toBe(true)

  await page.reload({ waitUntil: "domcontentloaded" })
  await waitForRuntime(page)
  await expect(
    page.getByRole("button", { name: "Taschenlampe einsammeln" }),
  ).toHaveCount(0)
  await expect(page.locator("#lia-loot-flashlight-tool")).toHaveCount(1)
})
