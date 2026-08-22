import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/magnifier-chest-click.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function mouseClick(page, locator) {
  await locator.scrollIntoViewIfNeeded()
  const box = await locator.boundingBox()
  expect(box).not.toBeNull()
  if (!box) throw new Error("Das Klickziel hat keine Geometrie.")

  const point = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
  await page.mouse.move(point.x, point.y)
  await page.mouse.down()
  await page.mouse.up()
  return point
}

async function touchDrag(page, start, end, endType = "touchCancel") {
  const session = await page.context().newCDPSession(page)
  const touchPoint = (x, y) => ({ x, y })
  try {
    await session.send("Input.dispatchTouchEvent", {
      touchPoints: [touchPoint(start.x, start.y)],
      type: "touchStart",
    })
    for (let step = 1; step <= 6; step += 1) {
      const progress = step / 6
      await session.send("Input.dispatchTouchEvent", {
        touchPoints: [
          touchPoint(
            start.x + (end.x - start.x) * progress,
            start.y + (end.y - start.y) * progress,
          ),
        ],
        type: "touchMove",
      })
    }
    // The cancel variant covers the browser path that used to hide the lens.
    // It also leaves Chromium ready to synthesize the following raw test tap.
    await session.send("Input.dispatchTouchEvent", {
      touchPoints: [],
      type: endType,
    })
    await page.waitForTimeout(100)
  } finally {
    await session.detach()
  }
}

test("oeffnet eine zauberstaubverdeckte Truhe mit echten Mausereignissen", async ({
  browserName,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Der gemeldete Opera-Fall wird mit der gemeinsamen Chromium-Engine geprueft.",
  )
  test.setTimeout(150_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Truhe unter der Lupe",
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")

  const gold = page.locator('[data-loot-resource="coins"]')
  const chestHost = page.locator(
    'lia-loot-chest[data-loot-concealment="dust"]',
  )
  const chestButton = chestHost.locator("[data-loot-chest-button]")

  await expect(gold).toHaveText("0")
  await expect(chestHost).toHaveCount(1)
  await expect(chestHost).toHaveAttribute("aria-hidden", "true")
  expect(await chestHost.evaluate((element) => element.inert)).toBe(true)

  await mouseClick(page, page.getByRole("button", { name: "Lupe einsammeln" }))
  const magnifier = page.getByRole("button", {
    name: /Lupe (?:aktivieren|deaktivieren)/u,
  })
  await expect(magnifier).toBeVisible()
  await mouseClick(page, magnifier)
  await expect(magnifier).toHaveAttribute("aria-pressed", "true")

  const concealedContent = chestHost.locator(
    ":scope > .loot-magnifier-secret__content",
  )
  await chestButton.evaluate((button) => {
    button.replaceWith(button.cloneNode(true))
  })
  await concealedContent.scrollIntoViewIfNeeded()
  const box = await concealedContent.boundingBox()
  expect(box).not.toBeNull()
  if (!box) throw new Error("Die verdeckte Truhe hat keine Geometrie.")

  const chestCenter = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
  await page.mouse.move(chestCenter.x, chestCenter.y)
  await expect(chestHost).toHaveClass(/loot-magnifier-secret--under-lens/u)
  await expect(chestHost).toHaveAttribute("aria-hidden", "false")
  expect(await chestHost.evaluate((element) => element.inert)).toBe(false)
  await expect(chestButton).toBeVisible()
  await expect(chestButton).toHaveAccessibleName(
    /Schatztruhe .*ffnen und eine Goldm.*nze erhalten/u,
  )

  await page.mouse.down()
  await page.mouse.up()

  await expect(gold).toHaveText("1")
  await expect(chestButton).toHaveCount(0)
})

test.describe("Touch-Lupe", () => {
  test.use({
    hasTouch: true,
    viewport: { height: 915, width: 412 },
  })

  test("bleibt sichtbar, laesst sich am Griff verschieben und im Glas bedienen", async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Der echte Touch-Drag wird ueber das Chromium DevTools Protocol erzeugt.",
    )
    test.setTimeout(150_000)

    await page.goto(editorUrl(), {
      timeout: 30_000,
      waitUntil: "domcontentloaded",
    })
    await expect(
      page.getByRole("heading", {
        exact: true,
        name: "Truhe unter der Lupe",
      }),
    ).toBeVisible({ timeout: 55_000 })
    await expect
      .poll(
        () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
        { timeout: 55_000 },
      )
      .toBe("ready")

    const gold = page.locator('[data-loot-resource="coins"]')
    const chestHost = page.locator(
      'lia-loot-chest[data-loot-concealment="dust"]',
    )
    const chestButton = chestHost.locator("[data-loot-chest-button]")
    const concealedContent = chestHost.locator(
      ":scope > .loot-magnifier-secret__content",
    )

    await expect(gold).toHaveText("0")
    await expect(chestHost).toHaveCount(1)
    await expect(concealedContent).toHaveCount(1)
    await expect
      .poll(async () => {
        const box = await concealedContent.boundingBox()
        return box ? box.width * box.height : 0
      })
      .toBeGreaterThan(0)
    await page.getByRole("button", { name: "Lupe einsammeln" }).tap()
    const magnifier = page.getByRole("button", {
      name: /Lupe (?:aktivieren|deaktivieren)/u,
    })
    await expect(magnifier).toBeVisible()
    await magnifier.tap()
    await expect(magnifier).toHaveAttribute("aria-pressed", "true")

    const lens = page.locator("#lia-loot-magnifier-lens")
    const panHandle = page.getByRole("button", { name: "Lupe verschieben" })
    await expect(lens).toBeVisible()
    await expect(panHandle).toBeVisible()
    await expect(page.locator("body")).toHaveClass(
      /loot-magnifier-pointing/u,
    )
    const initialLensBox = await lens.boundingBox()
    expect(initialLensBox).not.toBeNull()
    if (!initialLensBox) throw new Error("Die Touch-Lupe hat keine Geometrie.")

    await concealedContent.evaluate((element) => {
      element.scrollIntoView({ block: "center", inline: "center" })
    })
    const chestBox = await concealedContent.boundingBox()
    const handleBox = await panHandle.boundingBox()
    expect(chestBox).not.toBeNull()
    expect(handleBox).not.toBeNull()
    if (!chestBox || !handleBox) {
      throw new Error("Touch-Ziel oder Lupengriff hat keine Geometrie.")
    }

    const lensCenter = {
      x: initialLensBox.x + initialLensBox.width / 2,
      y: initialLensBox.y + initialLensBox.height / 2,
    }
    const chestCenter = {
      x: chestBox.x + chestBox.width / 2,
      y: chestBox.y + chestBox.height / 2,
    }
    const handleCenter = {
      x: handleBox.x + handleBox.width / 2,
      y: handleBox.y + handleBox.height / 2,
    }
    const scrollBeforePan = await page.evaluate(() => ({
      x: window.scrollX,
      y: window.scrollY,
    }))

    await touchDrag(page, handleCenter, {
      x: handleCenter.x + chestCenter.x - lensCenter.x,
      y: handleCenter.y + chestCenter.y - lensCenter.y,
    })

    await expect(lens).toBeVisible()
    await expect
      .poll(async () => {
        const box = await lens.boundingBox()
        if (!box) return Number.POSITIVE_INFINITY
        return Math.hypot(
          box.x + box.width / 2 - chestCenter.x,
          box.y + box.height / 2 - chestCenter.y,
        )
      })
      .toBeLessThan(initialLensBox.width / 2)
    const movedLensBox = await lens.boundingBox()
    expect(movedLensBox).not.toBeNull()
    if (!movedLensBox) {
      throw new Error("Die verschobene Touch-Lupe hat keine Geometrie.")
    }
    expect(
      Math.hypot(
        movedLensBox.x + movedLensBox.width / 2 - lensCenter.x,
        movedLensBox.y + movedLensBox.height / 2 - lensCenter.y,
      ),
    ).toBeGreaterThan(60)
    expect(
      await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY })),
    ).toEqual(scrollBeforePan)
    await expect(chestHost).toHaveClass(
      /loot-magnifier-secret--under-lens/u,
    )
    await expect(chestHost).toHaveAttribute("aria-hidden", "false")
    expect(await chestHost.evaluate((element) => element.inert)).toBe(false)

    const positionBeforeTap = await lens.evaluate((element) => ({
      left: element.style.left,
      top: element.style.top,
    }))
    const currentChestBox = await concealedContent.boundingBox()
    expect(currentChestBox).not.toBeNull()
    if (!currentChestBox) {
      throw new Error("Das aktuelle Touch-Ziel hat keine Geometrie.")
    }
    const tapPoint = {
      x: currentChestBox.x + currentChestBox.width / 2,
      y: currentChestBox.y + currentChestBox.height / 2,
    }
    const touchHitTest = await page.evaluate(({ x, y }) => {
      const target = document.elementFromPoint(x, y)
      return {
        chest: target?.closest("[data-loot-chest-button]") !== null,
        className:
          target instanceof Element ? target.getAttribute("class") ?? "" : "",
        tagName: target?.nodeName ?? "",
      }
    }, tapPoint)
    expect(
      touchHitTest.chest,
      `Touch-Hit-Test: ${JSON.stringify(touchHitTest)}`,
    ).toBe(true)
    await page.touchscreen.tap(tapPoint.x, tapPoint.y)

    await expect(gold).toHaveText("1")
    await expect(chestButton).toHaveCount(0)
    await expect(lens).toBeVisible()
    expect(
      await lens.evaluate((element) => ({
        left: element.style.left,
        top: element.style.top,
      })),
    ).toEqual(positionBeforeTap)

    const releasePanStartBox = await panHandle.boundingBox()
    expect(releasePanStartBox).not.toBeNull()
    if (!releasePanStartBox) {
      throw new Error("Der Lupengriff hat nach dem Tap keine Geometrie.")
    }
    const releasePanStart = {
      x: releasePanStartBox.x + releasePanStartBox.width / 2,
      y: releasePanStartBox.y + releasePanStartBox.height / 2,
    }
    await touchDrag(
      page,
      releasePanStart,
      { x: releasePanStart.x + 40, y: releasePanStart.y + 40 },
      "touchEnd",
    )
    await expect(lens).toBeVisible()
    expect(
      await lens.evaluate((element) => ({
        left: element.style.left,
        top: element.style.top,
      })),
    ).not.toEqual(positionBeforeTap)

    await page.keyboard.press("Escape")
    await expect(magnifier).toHaveAttribute("aria-pressed", "false")
    await expect(lens).toBeHidden()
  })
})
