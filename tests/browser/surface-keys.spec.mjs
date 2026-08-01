import { expect, test } from "./playwright-fixtures.mjs"

const fixtureUrl = "/tests/browser/fixtures/surface-keys.html"

async function waitForRuntime(page) {
  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__LIA_LOOT_RUNTIME__?.status ?? "missing",
        ),
      { message: "Die lokale Loot-Runtime wurde nicht bereit.", timeout: 15_000 },
    )
    .toBe("ready")
}

async function placementIds(page) {
  return page
    .locator("[data-loot-key-placement]")
    .evaluateAll((placements) =>
      placements
        .map((placement) => placement.dataset.lootKeyPlacement)
        .sort(),
    )
}

test("menu und classroom bleiben über Remount, Schloss, Reload und Kursversion stabil", async ({
  page,
}) => {
  await page.goto(`${fixtureUrl}?case=access&version=1.0.0`)
  await waitForRuntime(page)

  const allPlacements = page.locator("[data-loot-key-placement]")
  const menuPlacement = page.locator(
    '[data-loot-key-location="menu"]',
  )
  const classroomPlacement = page.locator(
    '[data-loot-key-location="classroom"]',
  )
  const classroomContent = page.locator(
    '.lia-support-menu__item--share .lia-support-menu__submenu',
  )
  const classroomLock = page.locator(
    '[data-loot-lock-button][data-loot-lock-target="classroom"]',
  )

  await expect(allPlacements).toHaveCount(2)
  await expect(menuPlacement).toHaveCount(1)
  await expect(classroomPlacement).toHaveCount(1)
  await expect(classroomLock).toHaveCount(1)
  await expect(classroomContent).toHaveAttribute("aria-hidden", "true")
  expect(await classroomContent.evaluate((element) => element.inert)).toBe(true)
  await expect(
    page.getByRole("button", {
      name: "Orangefarbenen Schlüssel einsammeln",
    }),
  ).toHaveCount(0)

  const firstIds = await placementIds(page)
  expect(new Set(firstIds).size).toBe(2)
  expect(firstIds.every((id) => /^key:source-key-.+:(?:menu|classroom)$/u.test(id))).toBe(true)
  const firstLockId = await classroomLock.getAttribute("data-loot-lock-id")

  await page.evaluate(() => {
    window.location.hash = "#2"
    window.remountSupportMenu()
  })

  await expect(allPlacements).toHaveCount(2)
  await expect(classroomLock).toHaveCount(1)
  expect(await placementIds(page)).toEqual(firstIds)
  expect(await classroomLock.getAttribute("data-loot-lock-id")).toBe(firstLockId)

  const yellowKey = page.locator(
    '[data-loot-key-location="menu"] [data-loot-key-color="yellow"]',
  )
  await expect(yellowKey).toHaveAccessibleName(
    "Gelben Schlüssel einsammeln",
  )
  await yellowKey.focus()
  await expect(yellowKey).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(menuPlacement).toHaveCount(0)
  await expect(page.locator("#lia-loot-key-inventory")).toBeFocused()
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color="yellow"]',
    ),
  ).toHaveCount(1)

  await expect(classroomLock).toHaveAccessibleName(
    /Classroom gesperrt\. Einen gelben Schlüssel verwenden\./u,
  )
  await classroomLock.focus()
  await page.keyboard.press("Enter")
  await expect(classroomLock).toHaveCount(0)
  await expect(classroomContent).not.toHaveAttribute("aria-hidden", "true")
  expect(await classroomContent.evaluate((element) => element.inert)).toBe(false)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color="yellow"]',
    ),
  ).toHaveCount(0)

  const orangeKey = page.getByRole("button", {
    name: "Orangefarbenen Schlüssel einsammeln",
  })
  await expect(orangeKey).toHaveCount(1)
  await orangeKey.focus()
  await expect(orangeKey).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(allPlacements).toHaveCount(0)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color="orange"]',
    ),
  ).toHaveCount(1)

  const inventoryStorageKeys = await page.evaluate(() =>
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith("lia-loot:key-inventory:v1:"))
      .map((key) => decodeURIComponent(key)),
  )
  expect(
    inventoryStorageKeys.some((key) => key.endsWith("::version=1.0.0")),
  ).toBe(true)

  await page.reload({ waitUntil: "domcontentloaded" })
  await waitForRuntime(page)
  await expect(allPlacements).toHaveCount(0)
  await expect(classroomLock).toHaveCount(0)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color="orange"]',
    ),
  ).toHaveCount(1)

  await page.goto(`${fixtureUrl}?case=access&version=2.0.0`)
  await waitForRuntime(page)
  await expect(allPlacements).toHaveCount(2)
  await expect(classroomLock).toHaveCount(1)
})

test("unsichtbarer Surface-Key wird erst mit der Lupe erreichbar", async ({
  page,
}) => {
  await page.goto(`${fixtureUrl}?case=concealed&version=1.0.0`)
  await waitForRuntime(page)

  const placement = page.locator('[data-loot-key-location="menu"]')
  await expect(placement).toHaveCount(1)
  await expect(placement).toHaveAttribute("data-loot-concealment", "solid")
  await expect(placement).toHaveAttribute("aria-hidden", "true")
  expect(await placement.evaluate((element) => element.inert)).toBe(true)
  await expect(
    page.getByRole("button", { name: "Blauen Schlüssel einsammeln" }),
  ).toHaveCount(0)

  await page.getByRole("button", { name: "Lupe einsammeln" }).click()
  const magnifierTool = page.locator("#lia-loot-magnifier-tool")
  await expect(magnifierTool).toHaveCount(1)
  await expect(magnifierTool).toHaveAccessibleName("Lupe aktivieren")
  await magnifierTool.click()
  await expect(magnifierTool).toHaveAccessibleName("Lupe deaktivieren")

  const concealedContent = placement.locator(
    ".loot-magnifier-secret__content",
  )
  const box = await concealedContent.boundingBox()
  expect(box).not.toBeNull()
  if (!box) throw new Error("Der unsichtbare Schlüssel hat keine Geometrie.")
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)

  await expect(placement).toHaveAttribute("aria-hidden", "false")
  expect(await placement.evaluate((element) => element.inert)).toBe(false)
  const blueKey = page.getByRole("button", {
    name: "Blauen Schlüssel einsammeln",
  })
  await expect(blueKey).toHaveCount(1)
  await blueKey.click()
  await expect(placement).toHaveCount(0)
})
