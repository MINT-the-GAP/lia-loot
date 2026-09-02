import { expect, test } from "./playwright-fixtures.mjs"

const fixtureUrl = "/tests/browser/fixtures/dynflex-clipping.html"
const cases = [
  {
    item: "chest",
    selector: '[data-loot-chest-template-target="dynflex"]',
  },
  {
    item: "lock",
    selector: '[data-loot-lock-button][data-loot-lock-target="dynflex"]',
  },
]

async function settle(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
      ),
  )
}

async function waitForRuntime(page) {
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 15_000 },
    )
    .toBe("ready")
}

async function geometry(page, selector) {
  return page.evaluate((itemSelector) => {
    const scrollport = document.getElementById("fixture-scrollport")
    const target = document.getElementById("fixture-dynflex")
    const item = document.querySelector(itemSelector)
    if (!scrollport || !target || !(item instanceof HTMLElement)) {
      throw new Error("DynFlex-Scroll-Fixture ist unvollständig.")
    }

    const scrollRect = scrollport.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    const clipTop = scrollRect.top + scrollport.clientTop
    return {
      clipBottom: clipTop + scrollport.clientHeight,
      clipTop,
      item: {
        bottom: itemRect.bottom,
        hidden: item.hidden,
        left: itemRect.left,
        right: itemRect.right,
        styleTop: Number.parseFloat(item.style.top),
        top: itemRect.top,
      },
      scrollTop: scrollport.scrollTop,
      target: {
        bottom: targetRect.bottom,
        left: targetRect.left,
        right: targetRect.right,
        top: targetRect.top,
      },
    }
  }, selector)
}

async function scrollBy(page, amount) {
  await page.locator("#fixture-scrollport").evaluate(
    (element, delta) => {
      element.scrollTop += delta
    },
    amount,
  )
  await settle(page)
}

async function placeTargetBottom(page, offsetFromClipTop) {
  await page.locator("#fixture-scrollport").evaluate(
    (scrollport, offset) => {
      const target = document.getElementById("fixture-dynflex")
      if (!target) throw new Error("DynFlex-Ziel fehlt.")
      const scrollRect = scrollport.getBoundingClientRect()
      const clipTop = scrollRect.top + scrollport.clientTop
      scrollport.scrollTop +=
        target.getBoundingClientRect().bottom - (clipTop + offset)
    },
    offsetFromClipTop,
  )
  await settle(page)
}

async function itemReceivesPoint(page, selector, x, y) {
  return page.evaluate(
    ({ itemSelector, pointX, pointY }) =>
      document.elementsFromPoint(pointX, pointY).some((element) =>
        element.matches(itemSelector) || Boolean(element.closest(itemSelector)),
      ),
    { itemSelector: selector, pointX: x, pointY: y },
  )
}

for (const testCase of cases) {
  test(`scrollt DynFlex-${testCase.item} mit und clippt seine Hit-Area`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 720, width: 1280 })
    await page.goto(`${fixtureUrl}?item=${testCase.item}`)
    await waitForRuntime(page)

    const item = page.locator(testCase.selector)
    await expect(item).toHaveCount(1)
    await expect
      .poll(async () => Number.isFinite((await geometry(page, testCase.selector)).item.styleTop))
      .toBe(true)

    const before = await geometry(page, testCase.selector)
    await scrollBy(page, 100)
    const after = await geometry(page, testCase.selector)
    expect(after.target.top - before.target.top).toBeCloseTo(-100, 0)
    expect(after.item.styleTop - before.item.styleTop).toBeCloseTo(-100, 0)

    if (testCase.item === "chest") {
      expect(before.item.hidden).toBe(true)
      expect(after.item.hidden).toBe(true)
    }

    await placeTargetBottom(page, 32)
    const partial = await geometry(page, testCase.selector)
    expect(partial.item.hidden).toBe(false)
    expect(partial.target.bottom).toBeCloseTo(partial.clipTop + 32, 0)

    const pointX = testCase.item === "chest"
      ? (partial.item.left + partial.item.right) / 2
      : (partial.target.left + partial.target.right) / 2
    expect(
      await itemReceivesPoint(
        page,
        testCase.selector,
        pointX,
        partial.clipTop - 4,
      ),
    ).toBe(false)
    expect(
      await itemReceivesPoint(
        page,
        testCase.selector,
        pointX,
        partial.clipTop + 12,
      ),
    ).toBe(true)

    await scrollBy(page, 48)
    const outside = await geometry(page, testCase.selector)
    expect(outside.target.bottom).toBeGreaterThan(0)
    expect(outside.target.bottom).toBeLessThan(outside.clipTop)
    expect(outside.item.hidden).toBe(true)

    await placeTargetBottom(page, 32)
    const restored = await geometry(page, testCase.selector)
    expect(restored.item.hidden).toBe(false)
  })
}
