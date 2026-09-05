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
  test(`bewegt DynFlex-${testCase.item} beim ersten Scroll-Paint ohne Nachlauf`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 720, width: 1280 })
    await page.goto(`${fixtureUrl}?item=${testCase.item}`)
    await waitForRuntime(page)
    await expect(page.locator(testCase.selector)).toHaveCount(1)
    await placeTargetBottom(page, 260)
    await expect(page.locator(testCase.selector)).toBeVisible()

    const samples = await page.evaluate(async (itemSelector) => {
      const scrollport = document.getElementById("fixture-scrollport")
      const target = document.getElementById("fixture-dynflex")
      const item = document.querySelector(itemSelector)
      const samples = []
      for (const delta of [16, 24, -12, 20, -16, -32]) {
        const targetTop = target.getBoundingClientRect().top
        const itemTop = item.getBoundingClientRect().top
        samples.push(await new Promise((resolve) => {
          scrollport.addEventListener("scroll", () => {
            // Measure before the very next paint, without waiting for a timer
            // or an additional frame to let a delayed portal catch up.
            requestAnimationFrame(() => {
              const targetDelta = target.getBoundingClientRect().top - targetTop
              const itemDelta = item.getBoundingClientRect().top - itemTop
              resolve({ delta, targetDelta, error: itemDelta - targetDelta })
            })
          }, { once: true })
          scrollport.scrollTop += delta
        }))
      }
      return samples
    }, testCase.selector)

    for (const sample of samples) {
      expect(sample.targetDelta).toBeCloseTo(-sample.delta, 0)
      expect(Math.abs(sample.error), JSON.stringify(sample)).toBeLessThan(1)
    }
  })

  for (const motion of [
    {
      name: "CSS-Transition",
      startEvent: "transitionrun",
      styles: `
        #fixture-dynflex { transition: transform 240ms linear; }
        #fixture-dynflex.fixture-moving { transform: translate(40px, 80px); }
      `,
    },
    {
      name: "CSS-Keyframeanimation",
      startEvent: "animationstart",
      styles: `
        @keyframes fixture-move {
          from { transform: translate(0, 0); }
          to { transform: translate(40px, 80px); }
        }
        #fixture-dynflex.fixture-moving {
          animation: fixture-move 240ms linear forwards;
        }
      `,
    },
    {
      name: "CSS-Größenänderung",
      startEvent: "transitionrun",
      styles: `
        #fixture-dynflex { transition: width 240ms linear, height 240ms linear; }
        #fixture-dynflex.fixture-moving {
          width: calc(34rem + 40px);
          height: calc(56rem + 80px);
        }
      `,
    },
  ]) {
    test(`bewegt DynFlex-${testCase.item} während einer ${motion.name} ohne Nachlauf`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 720, width: 1280 })
      await page.goto(`${fixtureUrl}?item=${testCase.item}`)
      await waitForRuntime(page)
      await expect(page.locator(testCase.selector)).toHaveCount(1)
      await placeTargetBottom(page, 220)
      await expect(page.locator(testCase.selector)).toBeVisible()
      await page.addStyleTag({ content: motion.styles })

      const samples = await page.evaluate(async ({ itemKind, itemSelector, startEvent }) => {
        const target = document.getElementById("fixture-dynflex")
        const item = document.querySelector(itemSelector)
        const targetBefore = target.getBoundingClientRect()
        const itemBefore = item.getBoundingClientRect()
        const samples = []
        await new Promise((resolve) => {
          const onStart = (event) => {
            if (event.target !== target) return
            window.removeEventListener(startEvent, onStart)
            const sample = () => {
              const targetRect = target.getBoundingClientRect()
              const itemRect = item.getBoundingClientRect()
              const targetX = targetRect.right - targetBefore.right
              const targetY = targetRect.bottom - targetBefore.bottom
              samples.push({
                targetX,
                targetY,
                errorX: itemRect.left - itemBefore.left -
                  (itemKind === "chest" ? targetX : targetRect.left - targetBefore.left),
                errorY: itemRect.top - itemBefore.top -
                  (itemKind === "chest" ? targetY : targetRect.top - targetBefore.top),
                errorWidth: itemRect.width - itemBefore.width -
                  (itemKind === "lock" ? targetRect.width - targetBefore.width : 0),
                errorHeight: itemRect.height - itemBefore.height -
                  (itemKind === "lock" ? targetRect.height - targetBefore.height : 0),
              })
              if (targetY < 79) requestAnimationFrame(sample)
              else resolve()
            }
            requestAnimationFrame(sample)
          }
          // Observe the event after the runtime's document/window handlers,
          // then inspect that same frame immediately before the browser paints.
          window.addEventListener(startEvent, onStart)
          target.classList.add("fixture-moving")
        })
        return samples
      }, {
        itemKind: testCase.item,
        itemSelector: testCase.selector,
        startEvent: motion.startEvent,
      })

      expect(samples.some((sample) => sample.targetY > 0 && sample.targetY < 79)).toBe(true)
      expect(samples.at(-1).targetY).toBeCloseTo(80, 0)
      for (const sample of samples) {
        expect(Math.abs(sample.errorX), JSON.stringify(sample)).toBeLessThan(1)
        expect(Math.abs(sample.errorY), JSON.stringify(sample)).toBeLessThan(1)
        expect(Math.abs(sample.errorWidth), JSON.stringify(sample)).toBeLessThan(1)
        expect(Math.abs(sample.errorHeight), JSON.stringify(sample)).toBeLessThan(1)
      }
    })
  }

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
