import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/object-lock-navigation.md"

function editorUrl() {
  const courseUrl = new URL(fixturePath, "http://127.0.0.1:4173").href
  return `${editorPath}?${courseUrl}`
}

async function expectSecondSlide(secondHeading, firstHeading, thirdHeading) {
  await expect(secondHeading).toBeVisible()
  await expect(firstHeading).not.toBeVisible()
  await expect(thirdHeading).not.toBeVisible()
}

async function dispatchTouchSwipe(page, startX, endX) {
  return page.evaluate(
    ({ startX: from, endX: to }) => {
      const target = document.querySelector(
        "main.lia-slide__content:not([hidden])",
      )
      if (!target) throw new Error("Aktive LiaScript-Folie fehlt")

      const point = (clientX) => ({
        clientX,
        clientY: 320,
        identifier: 7,
        pageX: clientX,
        pageY: 320,
        screenX: clientX,
        screenY: 320,
      })
      const touchList = (...points) => {
        points.item = (index) => points[index] ?? null
        return points
      }
      const emit = (type, touches, changedTouches) => {
        const event = new Event(type, {
          bubbles: true,
          cancelable: true,
          composed: true,
        })
        Object.defineProperties(event, {
          changedTouches: { value: changedTouches },
          targetTouches: { value: touches },
          touches: { value: touches },
        })
        target.dispatchEvent(event)
        return event.defaultPrevented
      }

      const start = point(from)
      const end = point(to)
      emit("touchstart", touchList(start), touchList(start))
      return emit("touchend", touchList(), touchList(end))
    },
    { startX, endX },
  )
}

test("sperrt echte sequenzielle Tastatur- und Wischgestennavigation bis zum Aufschließen", async ({ page }) => {
  test.setTimeout(150_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  const firstHeading = page.getByRole("heading", {
    name: "Erste Folie vor dem Schloss",
    exact: true,
  })
  const secondHeading = page.getByRole("heading", {
    name: "Gesperrte Foliennavigation",
    exact: true,
  })
  const thirdHeading = page.getByRole("heading", {
    name: "Dritte Folie hinter dem Schloss",
    exact: true,
  })
  await expect(firstHeading).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")

  await page.keyboard.press("ArrowRight")
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  const navigationLock = page.locator(
    "[data-loot-lock-button][data-loot-lock-target=seitenwechsel]",
  )
  const tocLock = page.locator(
    "[data-loot-lock-button][data-loot-lock-target=toc]",
  )
  await expect(navigationLock).toBeVisible()
  await expect(tocLock).toBeVisible()

  await page.evaluate(() => {
    const anchor = document.querySelector(
      ".lia-pagination > .lia-pagination__content",
    )
    if (!anchor?.parentNode) throw new Error("Pagination-Anchor fehlt")
    window.__lootNavigationAnchorTest = {
      anchor,
      nextSibling: anchor.nextSibling,
      parent: anchor.parentNode,
    }
    anchor.remove()
  })
  await expect(navigationLock).not.toBeVisible()
  await page.keyboard.press("ArrowRight")
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)
  await page.evaluate(() => {
    const saved = window.__lootNavigationAnchorTest
    if (!saved) throw new Error("Pagination-Anchor wurde nicht gespeichert")
    saved.parent.insertBefore(saved.anchor, saved.nextSibling)
    delete window.__lootNavigationAnchorTest
  })
  await expect(navigationLock).toBeVisible()

  await page.keyboard.press("ArrowLeft")
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  await page.keyboard.press("ArrowRight")
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  await page.keyboard.press("Alt+Shift+N")
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  await page.keyboard.press("Alt+Shift+P")
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  const input = page.getByRole("textbox", { name: "Testeingabe" })
  await input.evaluate((element) => {
    element.focus()
    element.setSelectionRange(2, 2)
  })
  await input.press("ArrowLeft")
  await expect(input).toHaveJSProperty("selectionStart", 1)
  await expect(input).toHaveJSProperty("selectionEnd", 1)
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  expect(await dispatchTouchSwipe(page, 350, 560)).toBe(true)
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  await page.mouse.move(650, 320)
  await page.mouse.down()
  await page.mouse.move(430, 320)
  await page.mouse.up()
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)

  await page.locator("[data-loot-slide-portal-button]").click()
  await expect(thirdHeading).toBeVisible()
  await expect(navigationLock).not.toBeVisible()
  await expect(tocLock).not.toBeVisible()
  await page.locator("[data-loot-slide-portal-return-button]").click()
  await expectSecondSlide(secondHeading, firstHeading, thirdHeading)
  await expect(navigationLock).toBeVisible()
  await expect(tocLock).toBeVisible()

  await page
    .locator("[data-loot-key-button][data-loot-key-color=blue]")
    .first()
    .click()
  await tocLock.click()
  await expect(tocLock).not.toBeVisible({ timeout: 10_000 })

  const tocButton = page.locator("#lia-btn-toc")
  await tocButton.click()
  await expect(page.locator("#lia-toc .lia-toc__content")).toBeVisible()
  await tocButton.click()

  await page
    .locator("[data-loot-key-button][data-loot-key-color=blue]")
    .click()
  await navigationLock.click()
  await expect(navigationLock).not.toBeVisible({ timeout: 10_000 })

  await page.keyboard.press("ArrowRight")
  await expect(thirdHeading).toBeVisible({ timeout: 10_000 })
})
