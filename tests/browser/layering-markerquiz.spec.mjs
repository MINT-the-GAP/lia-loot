import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/layering-markerquiz.md"
const dynFlexLockSelector =
  "[data-loot-lock-button][data-loot-lock-target=dynflex]"

function editorUrl() {
  const courseUrl = new URL(fixturePath, "http://127.0.0.1:4173").href
  return `${editorPath}?${courseUrl}`
}

async function openFixture(page) {
  await page.setViewportSize({ height: 720, width: 1280 })
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      name: "Schloss-Layer und Markerquiz",
      exact: true,
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

async function settle(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
}

async function scrollDynFlexToViewportTop(page) {
  await page.locator(".dynFlex").evaluate((element) => {
    element.scrollIntoView({ block: "start", inline: "nearest" })

    const header = document.querySelector(".lia-header")
    const headerBottom = header?.getBoundingClientRect().bottom ?? 0
    const delta = element.getBoundingClientRect().top - (headerBottom - 24)
    let ancestor = element.parentElement
    while (ancestor) {
      const style = getComputedStyle(ancestor)
      if (
        /(auto|overlay|scroll)/u.test(style.overflowY) &&
        ancestor.scrollHeight > ancestor.clientHeight
      ) {
        ancestor.scrollTop += delta
        return
      }
      ancestor = ancestor.parentElement
    }
    window.scrollBy(0, delta)
  })
  await settle(page)
}

async function overlapStack(
  page,
  upperSelector,
  lowerSelector,
  expectedOwnerSelector,
) {
  return page.evaluate(
    ({ expectedOwnerSelector, lowerSelector, upperSelector }) => {
      const upper = document.querySelector(upperSelector)
      const lower = document.querySelector(lowerSelector)
      if (!upper || !lower) {
        return {
          overlap: null,
          topBelongsToExpectedOwner: false,
          topIsLock: false,
        }
      }

      const upperRect = upper.getBoundingClientRect()
      const lowerRect = lower.getBoundingClientRect()
      const left = Math.max(upperRect.left, lowerRect.left)
      const right = Math.min(upperRect.right, lowerRect.right)
      const top = Math.max(upperRect.top, lowerRect.top)
      const bottom = Math.min(upperRect.bottom, lowerRect.bottom)
      if (right - left <= 4 || bottom - top <= 4) {
        return {
          overlap: {
            height: Math.max(0, bottom - top),
            width: Math.max(0, right - left),
          },
          topBelongsToExpectedOwner: false,
          topIsLock: false,
        }
      }

      const x = left + (right - left) / 2
      const y = top + (bottom - top) / 2
      const stack = document.elementsFromPoint(x, y)
      const topmost = stack[0] ?? null
      return {
        overlap: { height: bottom - top, width: right - left, x, y },
        stack: stack.slice(0, 5).map((element) => ({
          className:
            typeof element.className === "string" ? element.className : "",
          id: element.id,
          tagName: element.tagName,
        })),
        topBelongsToExpectedOwner: Boolean(
          topmost?.closest(expectedOwnerSelector),
        ),
        topIsLock: Boolean(topmost?.closest(lowerSelector)),
      }
    },
    { expectedOwnerSelector, lowerSelector, upperSelector },
  )
}

async function solutionHighlightColors(page) {
  return page.evaluate(() => {
    const registry = window.__LIA_TEXTMARKER_REG_V4__
    if (!registry?.instances) return []
    return Object.values(registry.instances)
      .filter((instance) => instance?.__alive)
      .flatMap((instance) =>
        Array.isArray(instance.HL)
          ? instance.HL
              .filter((item) => item?.kind === "solution")
              .map((item) => item.color)
          : [],
      )
      .sort()
  })
}

test("hält das gescrollte DynFlex-Schloss unter dem fixierten Header", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await openFixture(page)

  const lock = page.locator(dynFlexLockSelector)
  await expect(lock).toBeVisible()
  await scrollDynFlexToViewportTop(page)
  await expect(lock).toBeVisible()

  const stack = await overlapStack(
    page,
    ".lia-header",
    dynFlexLockSelector,
    ".lia-header",
  )
  expect(stack.overlap?.width).toBeGreaterThan(4)
  expect(stack.overlap?.height).toBeGreaterThan(4)
  expect(stack.topBelongsToExpectedOwner, stack).toBe(true)
  expect(stack.topIsLock, stack).toBe(false)
})

test("hält ein überlappendes Einstellungsmenü über dem DynFlex-Schloss bedienbar", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await openFixture(page)

  const settingsTrigger = page
    .locator(
      '#lia-support-menu button[data-group-id="setting"][aria-expanded]',
    )
    .first()
  const settingsMenu = page.locator(
    "#lia-support-menu .lia-support-menu__item--settings " +
      ".lia-support-menu__submenu",
  )
  const largerFont = settingsMenu.locator("button.lia-fontscale__lvl-2")
  const defaultFont = settingsMenu.locator("button.lia-fontscale__lvl-1")

  await expect(settingsTrigger).toBeVisible()
  await settingsTrigger.click()
  await expect(settingsTrigger).toHaveAttribute("aria-expanded", "true")
  await expect(settingsMenu).toBeVisible()
  await expect(defaultFont).toHaveClass(/\bactive\b/u)
  await expect(largerFont).not.toHaveClass(/\bactive\b/u)

  await scrollDynFlexToViewportTop(page)
  await expect(settingsMenu).toBeVisible()
  const stack = await overlapStack(
    page,
    "#lia-support-menu .lia-fontscale__lvl-2",
    dynFlexLockSelector,
    "#lia-support-menu",
  )
  expect(stack.overlap?.width).toBeGreaterThan(4)
  expect(stack.overlap?.height).toBeGreaterThan(4)
  expect(stack.topBelongsToExpectedOwner, stack).toBe(true)
  expect(stack.topIsLock, stack).toBe(false)

  await largerFont.click()
  await expect(largerFont).toHaveClass(/\bactive\b/u)
  await expect(defaultFont).not.toHaveClass(/\bactive\b/u)
})

test("blockiert die Markerquiz-Musterlösung ohne Diamanten vollständig", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await openFixture(page)

  await page
    .getByRole("link", { name: "Markerquiz ohne Diamanten", exact: true })
    .click()
  await expect(
    page.getByRole("heading", {
      name: "Markerquiz ohne Diamanten",
      exact: true,
    }),
  ).toBeVisible()

  const scope = page.locator(".markerquiz")
  const quiz = scope.locator(".lia-quiz")
  const resolve = scope.locator(".lia-quiz__resolve")
  const check = scope.locator(".lia-quiz__check")
  const hiddenAnswer = scope.locator(".hlq-proxy input")
  const resolution = page.locator(".hlq-resolution")
  const solutionText = page.getByText(
    "Diese Musterlösung darf ohne Diamanten nicht sichtbar werden.",
    { exact: true },
  )
  const diamonds = page.locator('[data-loot-resource="gems"]')

  await scope.scrollIntoViewIfNeeded()
  await expect(scope).toBeVisible()
  await expect(quiz).toHaveClass(/\bopen\b/u)
  await expect(resolve).toBeVisible()
  await expect(check).toBeVisible()
  await expect(hiddenAnswer).toHaveCount(1)
  await expect(diamonds).toHaveText("0")
  await expect(resolution).toHaveAttribute("data-hlq-state", "hidden")
  await expect(solutionText).toBeHidden()
  await expect.poll(() => solutionHighlightColors(page)).toEqual([])
  const answerBeforeResolve = await hiddenAnswer.inputValue()

  await resolve.click()

  await expect(page.locator(".loot-resource-status")).toHaveText(
    "Nicht genug Diamanten zum Auflösen.",
  )
  await expect(diamonds).toHaveText("0")
  await expect(quiz).toHaveClass(/\bopen\b/u)
  await expect(quiz).not.toHaveClass(/\b(?:resolved|solved)\b/u)
  await expect(hiddenAnswer).toHaveValue(answerBeforeResolve)
  await expect(resolution).toHaveAttribute("data-hlq-state", "hidden")
  await expect(solutionText).toBeHidden()
  await expect.poll(() => solutionHighlightColors(page)).toEqual([])

  await check.click()

  await expect(quiz).toHaveClass(/\bopen\b/u)
  await expect(quiz).not.toHaveClass(/\b(?:resolved|solved)\b/u)
  await expect(hiddenAnswer).not.toHaveValue("1")
  await expect(resolution).toHaveAttribute("data-hlq-state", "hidden")
  await expect(solutionText).toBeHidden()
  await expect.poll(() => solutionHighlightColors(page)).toEqual([])
})
