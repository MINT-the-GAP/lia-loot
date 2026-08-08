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

async function setFixtureEnvironment(
  page,
  theme,
  mode,
  annotationsVisible,
) {
  await page.evaluate(
    ([nextTheme, nextMode, nextAnnotationsVisible]) => {
      if (typeof window.setFixtureEnvironment !== "function") {
        throw new Error("Der Fixture-Umgebungsumschalter fehlt.")
      }
      window.setFixtureEnvironment(
        nextTheme,
        nextMode,
        nextAnnotationsVisible,
      )
    },
    [theme, mode, annotationsVisible],
  )
  await expect(page.locator("html")).toHaveClass(
    new RegExp(
      "(?=.*\\blia-theme-" +
        theme +
        "\\b)(?=.*\\blia-variant-" +
        mode +
        "\\b)",
      "u",
    ),
  )
  await expect(
    page.locator(".lia-annot-toolbar button[data-act='toggle']"),
  ).toHaveAttribute("aria-pressed", String(annotationsVisible))
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

async function expectGraphicInsideHitArea(button) {
  const geometry = await button.evaluate((element) => {
    const graphic = element.querySelector("svg")
    if (!graphic) throw new Error("Dem Aktionsbutton fehlt seine SVG-Grafik.")
    const hitArea = element.getBoundingClientRect()
    const graphicArea = graphic.getBoundingClientRect()
    return {
      graphicHeight: graphicArea.height,
      graphicWidth: graphicArea.width,
      hitHeight: hitArea.height,
      hitWidth: hitArea.width,
    }
  })

  expect(geometry.hitHeight).toBeGreaterThan(0)
  expect(geometry.hitWidth).toBeGreaterThan(0)
  expect(geometry.graphicHeight).toBeLessThanOrEqual(
    geometry.hitHeight + 0.5,
  )
  expect(geometry.graphicWidth).toBeLessThanOrEqual(
    geometry.hitWidth + 0.5,
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
    inventoryStorageKeys.some((key) =>
      /::version=1\.0\.0::revision=[^:]+$/u.test(key),
    ),
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

test("sichtbarer Translator-Schlüssel bleibt innerhalb seiner Trefferfläche sichtbar", async ({
  page,
}) => {
  await page.goto(`${fixtureUrl}?case=translator&version=1.0.0`)
  await waitForRuntime(page)

  const placement = page.locator("[data-loot-key-location=translator]")
  const blueKey = placement.getByRole("button", {
    name: "Blauen Schlüssel einsammeln",
  })
  const graphic = blueKey.locator(".loot-key-graphic")

  await expect(placement).toHaveCount(1)
  await expect(blueKey).toBeVisible()
  await expect(graphic).toBeVisible()

  const geometry = await blueKey.evaluate((button) => {
    const keyGraphic = button.querySelector(".loot-key-graphic")
    if (!keyGraphic) throw new Error("Dem Schlüssel fehlt seine Grafik.")
    const buttonBox = button.getBoundingClientRect()
    const graphicBox = keyGraphic.getBoundingClientRect()
    return {
      buttonHeight: buttonBox.height,
      buttonWidth: buttonBox.width,
      concealment: button.parentElement?.getAttribute("data-loot-concealment"),
      graphicHeight: graphicBox.height,
      graphicWidth: graphicBox.width,
      hidden: button.parentElement?.getAttribute("aria-hidden"),
    }
  })

  expect(geometry.concealment).toBeNull()
  expect(geometry.hidden).toBeNull()
  expect(geometry.graphicHeight).toBeLessThanOrEqual(
    geometry.buttonHeight + 0.5,
  )
  expect(geometry.graphicWidth).toBeLessThanOrEqual(
    geometry.buttonWidth + 0.5,
  )
  expect(Math.abs(geometry.graphicHeight - geometry.graphicWidth)).toBeLessThan(
    0.5,
  )
})

test("gemeinsame Item-Bedingungen reagieren live als AND und sperren Klicks", async ({
  page,
}) => {
  await page.goto(fixtureUrl + "?case=conditions&version=condition-and")
  await waitForRuntime(page)

  const compoundActions = [
    page.locator(
      '#condition-inline-key [data-loot-key-color="red"]',
    ),
    page.locator(
      '[data-loot-key-location="translator"] [data-loot-key-color="yellow"]',
    ),
    page.locator(
      "#condition-inline-chest [data-loot-chest-button]",
    ),
    page.locator(
      '[data-loot-chest-portal][data-loot-chest-location="menu"] [data-loot-chest-button]',
    ),
    page.locator(
      "#fixture-magnifier [data-loot-magnifier-button]",
    ),
    page.locator("#fixture-shovel [data-loot-tool-pickup]"),
    page.locator(
      "#fixture-watering-can [data-loot-tool-pickup]",
    ),
    page.locator(
      "#condition-soil [data-loot-reveal-cover-slot] button",
    ),
    page.locator(
      "#condition-plant [data-loot-reveal-cover-slot] button",
    ),
  ]

  const expectCompoundAvailable = async (available) => {
    for (const action of compoundActions) {
      if (available) await expect(action).toBeVisible()
      else await expect(action).toBeHidden()
    }
  }

  await expectCompoundAvailable(false)
  await setFixtureEnvironment(page, "red", "light", true)
  await expectCompoundAvailable(false)
  await setFixtureEnvironment(page, "red", "dark", true)
  await expectCompoundAvailable(false)

  await setFixtureEnvironment(page, "red", "dark", false)
  await expectCompoundAvailable(true)
  await expect(page.locator("#condition-soil")).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )
  await expect(page.locator("#condition-plant")).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )

  await setFixtureEnvironment(page, "red", "dark", true)
  await expectCompoundAvailable(false)
  for (const action of compoundActions) {
    await action.evaluateAll((elements) => {
      for (const element of elements) element.click()
    })
  }
  await expect(
    page.locator("#lia-loot-key-inventory [data-loot-key-color]"),
  ).toHaveCount(0)
  await expect(page.locator("[data-loot-magnifier-tool]")).toHaveCount(0)
  await expect(page.locator("[data-loot-tool-control]")).toHaveCount(0)
  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("0")
  await expect(page.locator("#condition-soil")).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )
  await expect(page.locator("#condition-plant")).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )

  await setFixtureEnvironment(page, "red", "dark", false)
  await expectCompoundAvailable(true)
  await setFixtureEnvironment(page, "blue", "dark", false)
  await expectCompoundAvailable(false)
  await setFixtureEnvironment(page, "red", "dark", false)
  await expectCompoundAvailable(true)
})

test("Theme- und Moduswerte sind je Achse OR und default entspricht tuerkis", async ({
  page,
}) => {
  await page.goto(fixtureUrl + "?case=conditions&version=condition-or")
  await waitForRuntime(page)

  const themeOrKey = page.locator(
    '#condition-theme-or-key [data-loot-key-color="orange"]',
  )
  const turquoiseChest = page.locator(
    "#condition-turquoise-chest [data-loot-chest-button]",
  )

  await expect(themeOrKey).toBeHidden()
  await expect(turquoiseChest).toBeVisible()

  await setFixtureEnvironment(page, "turquoise", "light", true)
  await expect(themeOrKey).toBeHidden()
  await expect(turquoiseChest).toBeVisible()

  await setFixtureEnvironment(page, "yellow", "light", true)
  await expect(themeOrKey).toBeVisible()
  await expect(turquoiseChest).toBeHidden()

  await setFixtureEnvironment(page, "red", "light", true)
  await expect(themeOrKey).toBeHidden()
  await expect(turquoiseChest).toBeHidden()

  await setFixtureEnvironment(page, "blue", "dark", true)
  await expect(themeOrKey).toBeVisible()
  await expect(turquoiseChest).toBeHidden()

  await setFixtureEnvironment(page, "yellow", "dark", false)
  await expect(themeOrKey).toBeVisible()
  await expect(turquoiseChest).toBeHidden()
})

test("direkte Surface-Layer werden außen nach innen freigelegt und bleiben über Remount eindeutig", async ({
  page,
}) => {
  await page.goto(fixtureUrl + "?case=layers&version=1.0.0")
  await waitForRuntime(page)

  const translatorGroup = page.getByRole("group", { name: "Translator" })
  const settingsGroup = page.getByRole("group", { name: "Einstellungen" })
  const keySoil = translatorGroup.locator(
    '[data-loot-reveal-kind="soil"]',
  )
  const keyPlant = translatorGroup.locator(
    '[data-loot-reveal-kind="plant"]',
  )
  const keySoilContent = keySoil.locator(
    ":scope > [data-loot-reveal-layer-content]",
  )
  const keyPlantContent = keyPlant.locator(
    ":scope > [data-loot-reveal-layer-content]",
  )
  const keyPlacement = translatorGroup.locator(
    '[data-loot-key-placement][data-loot-key-location="translator"]',
  )
  const chestSoil = settingsGroup.locator(
    '[data-loot-reveal-kind="soil"]',
  )
  const chestPlant = settingsGroup.locator(
    '[data-loot-reveal-kind="plant"]',
  )
  const chestPlacement = settingsGroup.locator(
    '[data-loot-chest-portal][data-loot-chest-location="menu"]',
  )

  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("0")
  await expect(keySoil).toHaveCount(1)
  await expect(keyPlant).toHaveCount(1)
  await expect(keyPlacement).toHaveCount(1)
  await expect(chestSoil).toHaveCount(1)
  await expect(chestPlant).toHaveCount(1)
  await expect(chestPlacement).toHaveCount(1)
  await expect(
    keySoil.locator(
      '[data-loot-reveal-kind="plant"]',
    ),
  ).toHaveCount(1)
  await expect(
    chestSoil.locator(
      '[data-loot-reveal-kind="plant"]',
    ),
  ).toHaveCount(1)

  for (const layer of [keySoil, keyPlant, chestSoil, chestPlant]) {
    await expect(layer).toHaveAttribute("data-loot-reveal-state", "locked")
  }
  for (const content of [keySoilContent, keyPlantContent]) {
    await expect(content).toHaveAttribute("hidden", "")
    await expect(content).toHaveAttribute("aria-hidden", "true")
    expect(await content.evaluate((element) => element.inert)).toBe(true)
  }
  await expect(
    translatorGroup.getByRole("button", {
      name: "Blauen Schlüssel einsammeln",
    }),
  ).toHaveCount(0)

  await expect(page.locator("[data-loot-tool-pickup]")).toHaveCount(2)
  await page.getByRole("button", { name: "Lupe einsammeln" }).click()
  await page.getByRole("button", { name: "Schaufel einsammeln" }).click()
  await page.getByRole("button", { name: "Gießkanne einsammeln" }).click()

  const magnifierTool = page.locator("[data-loot-magnifier-tool]")
  const shovelTool = page.locator('[data-loot-tool-control="shovel"]')
  const wateringCanTool = page.locator(
    '[data-loot-tool-control="watering-can"]',
  )
  await expect(magnifierTool).toHaveAccessibleName("Lupe aktivieren")
  await expect(shovelTool).toHaveAccessibleName("Schaufel aktivieren")
  await expect(wateringCanTool).toHaveAccessibleName("Gießkanne aktivieren")
  for (const tool of [magnifierTool, shovelTool, wateringCanTool]) {
    await expect(tool).toHaveAttribute("aria-pressed", "false")
  }
  const documentRoot = page.locator("html")
  const body = page.locator("body")
  const computedCursor = (locator) =>
    locator.evaluate((element) => getComputedStyle(element).cursor)
  expect(await documentRoot.getAttribute("data-loot-active-tool")).toBeNull()

  await shovelTool.click()
  await expect(shovelTool).toHaveAccessibleName("Schaufel deaktivieren")
  await expect(shovelTool).toHaveAttribute("aria-pressed", "true")
  await expect(wateringCanTool).toHaveAttribute("aria-pressed", "false")
  await expect(documentRoot).toHaveAttribute("data-loot-active-tool", "shovel")
  const shovelCursor = await computedCursor(body)
  expect(shovelCursor).toMatch(/^url\(/u)
  expect(shovelCursor).toContain("crosshair")

  await magnifierTool.click()
  await expect(magnifierTool).toHaveAccessibleName("Lupe deaktivieren")
  await expect(magnifierTool).toHaveAttribute("aria-pressed", "true")
  await expect(shovelTool).toHaveAttribute("aria-pressed", "true")
  expect(await computedCursor(body)).toBe(shovelCursor)
  await magnifierTool.click()
  await expect(magnifierTool).toHaveAccessibleName("Lupe aktivieren")
  await expect(magnifierTool).toHaveAttribute("aria-pressed", "false")
  await expect(shovelTool).toHaveAttribute("aria-pressed", "true")

  const digKeySoil = keySoil.getByRole("button", {
    name: "Erdhaufen mit Schaufel wegbuddeln",
  })
  await expect(digKeySoil).toBeVisible()
  await expectGraphicInsideHitArea(digKeySoil)
  expect(await computedCursor(digKeySoil)).toBe(shovelCursor)
  await digKeySoil.click()
  await expect(keySoil).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )
  await expect(keySoilContent).not.toHaveAttribute("hidden", "")
  await expect(keySoilContent).not.toHaveAttribute("aria-hidden", "true")
  expect(await keySoilContent.evaluate((element) => element.inert)).toBe(false)
  await expect(keyPlant).toHaveAttribute("data-loot-reveal-state", "locked")

  const waterKeyPlant = keyPlant.getByRole("button", {
    name: "Pflanze mit Gießkanne gießen",
  })
  await expect(waterKeyPlant).toBeVisible()
  await expectGraphicInsideHitArea(waterKeyPlant)
  await wateringCanTool.click()
  await expect(magnifierTool).toHaveAttribute("aria-pressed", "false")
  await expect(shovelTool).toHaveAttribute("aria-pressed", "false")
  await expect(wateringCanTool).toHaveAccessibleName(
    "Gießkanne deaktivieren",
  )
  await expect(wateringCanTool).toHaveAttribute("aria-pressed", "true")
  await expect(documentRoot).toHaveAttribute(
    "data-loot-active-tool",
    "watering-can",
  )
  const wateringCanCursor = await computedCursor(body)
  expect(wateringCanCursor).toMatch(/^url\(/u)
  expect(wateringCanCursor).toContain("crosshair")
  expect(wateringCanCursor).not.toBe(shovelCursor)
  expect(await computedCursor(waterKeyPlant)).toBe(wateringCanCursor)

  await wateringCanTool.click()
  expect(await documentRoot.getAttribute("data-loot-active-tool")).toBeNull()
  expect(await computedCursor(body)).not.toContain("data:image/svg+xml")
  await wateringCanTool.click()
  await expect(documentRoot).toHaveAttribute(
    "data-loot-active-tool",
    "watering-can",
  )

  await waterKeyPlant.click()
  await expect(keyPlant).toHaveAttribute(
    "data-loot-reveal-state",
    "bloomed",
  )
  await expect(keyPlantContent).toHaveAttribute("hidden", "")
  await expect(keyPlantContent).toHaveAttribute("aria-hidden", "true")
  expect(await keyPlantContent.evaluate((element) => element.inert)).toBe(true)
  await expect(
    translatorGroup.getByRole("button", {
      name: "Blauen Schlüssel einsammeln",
    }),
  ).toHaveCount(0)

  const openKeyPlant = keyPlant.getByRole("button", {
    name: "Blühende Pflanze öffnen",
  })
  await expect(openKeyPlant).toBeVisible()
  await expectGraphicInsideHitArea(openKeyPlant)
  await openKeyPlant.click()
  await expect(keyPlant).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )
  await expect(keyPlantContent).not.toHaveAttribute("hidden", "")
  await expect(keyPlantContent).not.toHaveAttribute("aria-hidden", "true")
  expect(await keyPlantContent.evaluate((element) => element.inert)).toBe(false)

  let keySecret = translatorGroup.locator(
    '[data-loot-concealment="solid"]:has([data-loot-key-color="blue"])',
  )
  await expect(keySecret).toHaveCount(1)
  await expect(keySecret).toHaveAttribute("aria-hidden", "true")
  expect(await keySecret.evaluate((element) => element.inert)).toBe(true)
  await expect(
    translatorGroup.getByRole("button", {
      name: "Blauen Schlüssel einsammeln",
    }),
  ).toHaveCount(0)

  await page.evaluate(() => window.remountSupportMenu())
  await expect(keySoil).toHaveCount(1)
  await expect(keyPlant).toHaveCount(1)
  await expect(keyPlacement).toHaveCount(1)
  await expect(chestSoil).toHaveCount(1)
  await expect(chestPlant).toHaveCount(1)
  await expect(chestPlacement).toHaveCount(1)
  await expect(keySoil).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )
  await expect(keyPlant).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )
  await expect(chestSoil).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )
  await expect(chestPlant).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )

  keySecret = translatorGroup.locator(
    '[data-loot-concealment="solid"]:has([data-loot-key-color="blue"])',
  )
  await expect(keySecret).toHaveCount(1)
  await expect(keySecret).toHaveAttribute("aria-hidden", "true")
  await magnifierTool.click()
  await expect(magnifierTool).toHaveAttribute("aria-pressed", "true")
  await expect(wateringCanTool).toHaveAttribute("aria-pressed", "true")

  const secretContent = keySecret.locator(
    ".loot-magnifier-secret__content",
  )
  const secretBox = await secretContent.boundingBox()
  expect(secretBox).not.toBeNull()
  if (!secretBox) throw new Error("Der geschichtete Schlüssel hat keine Geometrie.")
  await page.mouse.move(
    secretBox.x + secretBox.width / 2,
    secretBox.y + secretBox.height / 2,
  )

  await expect(keySecret).toHaveAttribute("aria-hidden", "false")
  expect(await keySecret.evaluate((element) => element.inert)).toBe(false)
  const blueKey = translatorGroup.getByRole("button", {
    name: "Blauen Schlüssel einsammeln",
  })
  await expect(blueKey).toBeVisible()
  await expectGraphicInsideHitArea(blueKey)
  await blueKey.click()
  await expect(keyPlacement).toHaveCount(0)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color="blue"]',
    ),
  ).toHaveCount(1)

  await page.evaluate(() => window.remountSupportMenu())
  await expect(keyPlacement).toHaveCount(0)
  await expect(keySoil).toHaveCount(0)
  await expect(keyPlant).toHaveCount(0)
  await expect(
    page.getByRole("button", { name: "Blauen Schlüssel einsammeln" }),
  ).toHaveCount(0)
  await expect(
    page.locator(
      '#lia-loot-key-inventory [data-loot-key-color="blue"]',
    ),
  ).toHaveCount(1)
  await expect(chestSoil).toHaveCount(1)
  await expect(chestPlant).toHaveCount(1)
  await expect(chestPlacement).toHaveCount(1)

  await shovelTool.click()
  await expect(magnifierTool).toHaveAttribute("aria-pressed", "true")
  await expect(shovelTool).toHaveAttribute("aria-pressed", "true")
  await expect(wateringCanTool).toHaveAttribute("aria-pressed", "false")
  const digChestSoil = chestSoil.getByRole("button", {
    name: "Erdhaufen mit Schaufel wegbuddeln",
  })
  await expectGraphicInsideHitArea(digChestSoil)
  await digChestSoil.click()
  await expect(chestSoil).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )

  await wateringCanTool.click()
  await expect(magnifierTool).toHaveAttribute("aria-pressed", "true")
  await expect(shovelTool).toHaveAttribute("aria-pressed", "false")
  await expect(wateringCanTool).toHaveAttribute("aria-pressed", "true")
  const waterChestPlant = chestPlant.getByRole("button", {
    name: "Pflanze mit Gießkanne gießen",
  })
  await expectGraphicInsideHitArea(waterChestPlant)
  await waterChestPlant.click()
  await expect(chestPlant).toHaveAttribute(
    "data-loot-reveal-state",
    "bloomed",
  )

  const openChestPlant = chestPlant.getByRole("button", {
    name: "Blühende Pflanze öffnen",
  })
  await expectGraphicInsideHitArea(openChestPlant)
  await openChestPlant.click()
  await expect(chestPlant).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )

  const chestButton = settingsGroup.getByRole("button", {
    name: "Schatztruhe öffnen und 2 Goldmünzen erhalten",
  })
  await expect(chestButton).toHaveAttribute("data-loot-chest-reward", "gold")
  await expect(chestButton).toHaveAttribute("data-loot-chest-amount", "2")
  await expectGraphicInsideHitArea(chestButton)
  await chestButton.click()
  await expect(chestPlacement).toHaveCount(0)
  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("2")

  await page.evaluate(() => window.remountSupportMenu())
  await expect(chestPlacement).toHaveCount(0)
  await expect(chestSoil).toHaveCount(0)
  await expect(chestPlant).toHaveCount(0)
  await expect(page.locator('[data-loot-resource="coins"]')).toHaveText("2")

  await expect(documentRoot).toHaveAttribute(
    "data-loot-active-tool",
    "watering-can",
  )
  await page.reload({ waitUntil: "domcontentloaded" })
  await waitForRuntime(page)
  expect(await documentRoot.getAttribute("data-loot-active-tool")).toBeNull()
})

test("Aktionscursor wird in ein gleichursprüngliches Elterndokument gespiegelt", async ({
  page,
}) => {
  await page.goto("/tests/browser/fixtures/cursor-frame-host.html")
  const course = page.frameLocator('iframe[title="Loot-Kurs"]')
  const shovelPickup = course.getByRole("button", {
    name: "Schaufel einsammeln",
  })
  await expect(shovelPickup).toBeVisible({ timeout: 15_000 })
  await shovelPickup.evaluate((button) => button.click())

  const shovelTool = course.locator('[data-loot-tool-control="shovel"]')
  await shovelTool.evaluate((button) => button.click())
  await expect(page.locator("html")).toHaveAttribute(
    "data-loot-active-tool",
    "shovel",
  )
  const parentCursor = await page
    .locator("#parent-reveal-cover")
    .evaluate((element) => getComputedStyle(element).cursor)
  expect(parentCursor).toMatch(/^url\(/u)
  expect(parentCursor).toContain("crosshair")

  await shovelTool.evaluate((button) => button.click())
  expect(
    await page.locator("html").getAttribute("data-loot-active-tool"),
  ).toBeNull()
  expect(
    await page
      .locator("#parent-reveal-cover")
      .evaluate((element) => getComputedStyle(element).cursor),
  ).not.toContain("data:image/svg+xml")
})

test("dynamische Reveal-Marker bleiben fail-closed und reaktivieren ihren Inhalt", async ({
  page,
}) => {
  const invalidWarnings = []
  page.on("console", (message) => {
    if (
      message.type() === "warning" &&
      message.text().includes("ungültiger Optionen")
    ) {
      invalidWarnings.push(message.text())
    }
  })

  await page.goto(fixtureUrl + "?case=layers&version=marker-lifecycle")
  await waitForRuntime(page)
  await page.evaluate(() => {
    const wrapper = document.createElement("blockquote")
    wrapper.id = "dynamic-reveal-wrapper"
    const start = document.createElement("lia-loot-reveal-start")
    start.id = "dynamic-reveal-start"
    start.dataset.revealId = "dynamic-reveal"
    start.dataset.revealKind = "erde"
    start.dataset.options = "erde; 2s"
    const payload = document.createElement("button")
    payload.id = "dynamic-reveal-payload"
    payload.type = "button"
    payload.textContent = "Dynamischer Fund"
    const end = document.createElement("a")
    end.id = "dynamic-reveal-end"
    end.href = "#lia-loot-reveal-end-erde"
    end.textContent = "Ende"
    wrapper.append(start, payload, end)
    document.querySelector("#fixture-slide")?.appendChild(wrapper)
  })

  const controller = page.locator(
    "#dynamic-reveal-start > lia-loot-reveal",
  )
  const payload = page.getByRole("button", { name: "Dynamischer Fund" })
  const shovelPickup = page.getByRole("button", {
    name: "Schaufel einsammeln",
  })
  const wateringCanPickup = page.getByRole("button", {
    name: "Gießkanne einsammeln",
  })
  const shovelTool = page.locator('[data-loot-tool-control="shovel"]')
  const wateringCanTool = page.locator(
    '[data-loot-tool-control="watering-can"]',
  )

  await expect(controller).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )
  await expect(payload).not.toBeVisible()
  await expect(controller).toBeVisible({ timeout: 3_500 })
  await page.evaluate(() => {
    const added = document.createElement("button")
    added.id = "dynamic-late-payload"
    added.type = "button"
    added.textContent = "Später Fund"
    document
      .querySelector("#dynamic-reveal-wrapper")
      ?.insertBefore(added, document.querySelector("#dynamic-reveal-end"))
  })
  const latePayload = page.getByRole("button", { name: "Später Fund" })
  await expect(latePayload).not.toBeVisible()
  await controller.evaluate((element) => element.remove())
  await expect(controller).toHaveCount(1)
  await expect(controller).toBeVisible({ timeout: 700 })
  await expect(controller).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )
  await expect(latePayload).not.toBeVisible()
  await shovelPickup.click()
  await shovelTool.click()
  const digButton = controller.getByRole("button", {
    name: "Erdhaufen mit Schaufel wegbuddeln",
  })
  await digButton.focus()
  await page.keyboard.press("Enter")
  await expect(controller).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )
  await expect(payload).toBeVisible()
  await expect(latePayload).toBeVisible()
  await expect(payload).toBeFocused()

  await page.locator("#dynamic-reveal-end").evaluate((end) => end.remove())
  await expect(controller).toHaveCount(0)
  await expect(payload).not.toBeVisible()

  await page.evaluate(() => {
    const end = document.createElement("a")
    end.id = "dynamic-reveal-end"
    end.href = "#lia-loot-reveal-end-erde"
    end.textContent = "Ende"
    document.querySelector("#dynamic-reveal-wrapper")?.appendChild(end)
  })
  await expect(controller).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )
  await expect(payload).toBeVisible()

  await page.evaluate(() => {
    const start = document.querySelector("#dynamic-reveal-start")
    const end = document.querySelector("#dynamic-reveal-end")
    if (!(start instanceof HTMLElement) || !(end instanceof HTMLAnchorElement)) {
      throw new Error("Dynamische Reveal-Marker fehlen.")
    }
    start.dataset.revealKind = "pflanze"
    start.dataset.options = "pflanze"
    end.href = "#lia-loot-reveal-end-pflanze"
  })
  await expect(controller).toHaveAttribute(
    "data-loot-reveal-state",
    "locked",
  )
  await expect(payload).not.toBeVisible()

  await wateringCanPickup.click()
  await wateringCanTool.click()
  await controller
    .getByRole("button", { name: "Pflanze mit Gießkanne gießen" })
    .click()
  await expect(controller).toHaveAttribute(
    "data-loot-reveal-state",
    "bloomed",
  )
  await expect(payload).not.toBeVisible()
  await controller
    .getByRole("button", { name: "Blühende Pflanze öffnen" })
    .click()
  await expect(controller).toHaveAttribute(
    "data-loot-reveal-state",
    "revealed",
  )
  await expect(payload).toBeVisible()

  await page.evaluate(() => {
    document
      .querySelector("#fixture-slide")
      ?.classList.add("lia-slide__content")
    const wrapper = document.createElement("section")
    wrapper.id = "dynamic-lock-wrapper"
    const quiz = document.createElement("div")
    quiz.className = "lia-quiz open"
    const controls = document.createElement("div")
    controls.className = "lia-quiz__control"
    const check = document.createElement("button")
    check.type = "button"
    check.className = "lia-quiz__check"
    check.textContent = "Prüfen"
    controls.appendChild(check)
    quiz.appendChild(controls)
    const lock = document.createElement("lia-loot-lock")
    lock.dataset.lockId = "dynamic-wrapper-lock"
    lock.dataset.target = "check"
    lock.dataset.color = "rot"
    wrapper.append(quiz, lock)
    document.querySelector("#fixture-slide")?.appendChild(wrapper)
  })
  const wrapperLock = page.locator(
    '[data-loot-lock-button][data-loot-lock-target="check"]',
  )
  await expect(wrapperLock).toHaveCount(1)
  await expect(wrapperLock).toHaveAttribute(
    "aria-label",
    "Prüfen gesperrt. Einen roten Schlüssel verwenden.",
  )
  expect(invalidWarnings).toEqual([])
})

test("direkte Layer funktionieren an Lupe, Schaufel und Gießkanne", async ({
  page,
}) => {
  const replaceWithRendererClone = async (button) => {
    await button.evaluate((element) => {
      element.replaceWith(element.cloneNode(true))
    })
  }
  const plantSequence = async (host, wateringCanTool) => {
    await wateringCanTool.click()
    await host
      .getByRole("button", { name: "Pflanze mit Gießkanne gießen" })
      .click()
    await expect(
      host.locator('[data-loot-reveal-kind="plant"]'),
    ).toHaveAttribute("data-loot-reveal-state", "bloomed")
    await host
      .getByRole("button", { name: "Blühende Pflanze öffnen" })
      .click()
    await expect(
      host.locator('[data-loot-reveal-kind="plant"]'),
    ).toHaveAttribute("data-loot-reveal-state", "revealed")
  }
  const soilSequence = async (host, shovelTool) => {
    await shovelTool.click()
    await host
      .getByRole("button", {
        name: "Erdhaufen mit Schaufel wegbuddeln",
      })
      .click()
    await expect(
      host.locator('[data-loot-reveal-kind="soil"]'),
    ).toHaveAttribute("data-loot-reveal-state", "revealed")
  }

  await page.goto(fixtureUrl + "?case=layers&version=tool-layers-a")
  await waitForRuntime(page)
  await page.evaluate(() => {
    document
      .querySelector("#fixture-shovel")
      ?.setAttribute("data-options", "pflanze")
    document
      .querySelector("#fixture-magnifier")
      ?.setAttribute("data-options", "erde")
  })

  let magnifierHost = page.locator("#fixture-magnifier")
  let shovelHost = page.locator("#fixture-shovel")
  let shovelTool = page.locator('[data-loot-tool-control="shovel"]')
  let wateringCanTool = page.locator(
    '[data-loot-tool-control="watering-can"]',
  )
  await expect(
    shovelHost.locator('[data-loot-reveal-kind="plant"]'),
  ).toHaveCount(1)
  await expect(
    magnifierHost.locator('[data-loot-reveal-kind="soil"]'),
  ).toHaveCount(1)
  await expect(
    page.getByRole("button", { name: "Schaufel einsammeln" }),
  ).toHaveCount(0)
  const wateringCanPickup = page.getByRole("button", {
    name: "Gießkanne einsammeln",
  })
  await replaceWithRendererClone(wateringCanPickup)
  await wateringCanPickup.click()
  await plantSequence(shovelHost, wateringCanTool)
  const shovelPickup = page.getByRole("button", {
    name: "Schaufel einsammeln",
  })
  await replaceWithRendererClone(shovelPickup)
  await shovelPickup.click()
  await soilSequence(magnifierHost, shovelTool)
  const magnifierPickup = page.getByRole("button", {
    name: "Lupe einsammeln",
  })
  await replaceWithRendererClone(magnifierPickup)
  await magnifierPickup.click()
  await expect(page.locator("[data-loot-magnifier-tool]")).toBeVisible()

  await page.goto(fixtureUrl + "?case=layers&version=tool-layers-b")
  await waitForRuntime(page)
  await page.evaluate(() => {
    document
      .querySelector("#fixture-watering-can")
      ?.setAttribute("data-options", "erde")
    document
      .querySelector("#fixture-magnifier")
      ?.setAttribute("data-options", "pflanze")
  })

  magnifierHost = page.locator("#fixture-magnifier")
  const wateringCanHost = page.locator("#fixture-watering-can")
  shovelTool = page.locator('[data-loot-tool-control="shovel"]')
  wateringCanTool = page.locator(
    '[data-loot-tool-control="watering-can"]',
  )
  await expect(
    wateringCanHost.locator('[data-loot-reveal-kind="soil"]'),
  ).toHaveCount(1)
  await expect(
    magnifierHost.locator('[data-loot-reveal-kind="plant"]'),
  ).toHaveCount(1)
  await expect(
    page.getByRole("button", { name: "Gießkanne einsammeln" }),
  ).toHaveCount(0)
  await page.getByRole("button", { name: "Schaufel einsammeln" }).click()
  await soilSequence(wateringCanHost, shovelTool)
  await page
    .getByRole("button", { name: "Gießkanne einsammeln" })
    .click()
  await plantSequence(magnifierHost, wateringCanTool)
  await page.getByRole("button", { name: "Lupe einsammeln" }).click()
  await expect(page.locator("[data-loot-magnifier-tool]")).toBeVisible()
})
