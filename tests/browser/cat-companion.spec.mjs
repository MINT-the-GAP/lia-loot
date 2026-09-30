import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/cat-companion.md"

function editorUrl() {
  return editorPath + "?" + new URL(fixturePath, testOrigin).href
}

async function ready(page) {
  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", { exact: true, name: "Katzenhelfer" }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
}

async function expectPose(companion, pose) {
  await expect(companion).toHaveAttribute("data-cat-state", pose, {
    timeout: 4_000,
  })
}

test("findet die Pixelkatze und reagiert auf Fund, Aufgabe und Inaktivität", async ({
  page,
}) => {
  test.setTimeout(150_000)
  await page.setViewportSize({ width: 900, height: 650 })
  await ready(page)

  const pickup = page.getByRole("button", {
    exact: true,
    name: "Pixelkatze einsammeln",
  })
  const companion = page.locator("#lia-loot-cat-companion")
  await expect(pickup).toBeVisible()
  await expect(companion).toHaveCount(0)

  await pickup.click()
  await expect(companion).toBeVisible()
  await expectPose(companion, "nodding")
  await expectPose(companion, "idle")
  await expect(pickup).toHaveCount(0)

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(companion).toBeVisible()
  await expect(
    page.getByRole("button", {
      exact: true,
      name: "Pixelkatze einsammeln",
    }),
  ).toHaveCount(0)
  const catBox = await companion.boundingBox()
  const nextBox = await page.locator("#lia-btn-next").boundingBox()
  expect(catBox).not.toBeNull()
  expect(nextBox).not.toBeNull()
  expect(catBox.y + catBox.height).toBeLessThanOrEqual(nextBox.y)

  await page.locator("[data-loot-chest-button]").click()
  await expectPose(companion, "nodding")
  await expectPose(companion, "idle")

  const quiz = page.locator(".lia-quiz")
  await quiz.getByRole("textbox", { name: "quiz answer" }).fill("2")
  await quiz.locator(".lia-quiz__check").click()
  await expect(quiz).toHaveClass(/\bsolved\b/u)
  await expectPose(companion, "jumping")
  await expectPose(companion, "idle")

  await page.clock.install()
  await page.evaluate(() => {
    window.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerType: "mouse" }),
    )
    const activeSlide = document.querySelector(
      ".lia-slide__container > main.lia-slide__content:not([hidden])",
    )
    let refresh = 0
    window.setInterval(() => {
      activeSlide?.classList.toggle("cat-sync-probe", ++refresh % 2 === 0)
    }, 5_000)
  })
  await page.clock.fastForward(30_100)
  await expectPose(companion, "yawning")
  await expect(companion).toHaveAccessibleName("Pixelkatze gähnt müde.")

  await page.clock.fastForward(1_800)
  await expectPose(companion, "idle")

  await page.evaluate(() => {
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 0,
        clientY: 0,
        pointerType: "mouse",
      }),
    )
  })
  await expect
    .poll(() =>
      companion.evaluate((element) =>
        element.style.getPropertyValue("--loot-cat-look-x"),
      ),
    )
    .toMatch(/^-/u)
  await expect
    .poll(() =>
      companion
        .locator(".loot-cat-pose--sitting .loot-cat-head")
        .evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe("none")

  await page.clock.fastForward(13_200)
  await expectPose(companion, "yawning")
  await page.clock.fastForward(1_800)
  await expectPose(companion, "idle")

  await page.clock.fastForward(13_200)
  await expectPose(companion, "lying-down")
  await expect
    .poll(() =>
      companion
        .locator(".loot-cat-pose--sitting .loot-cat-eyes")
        .evaluate((element) => getComputedStyle(element).transform),
    )
    .toBe("none")
  await expect
    .poll(() =>
      companion
        .locator(".loot-cat-doze-eyes")
        .evaluate((element) => getComputedStyle(element).transform),
    )
    .toBe("none")
  await page.clock.fastForward(2_000)
  await expectPose(companion, "sleeping")
  await expect(companion).toHaveAccessibleName(
    "Pixelkatze schläft. Zum Aufwecken klicken.",
  )

  await companion.click()
  await expectPose(companion, "standing-up")
  const message = companion.locator(".loot-cat-companion__message")
  await expect(message).toBeVisible()
  await expect(message).toHaveText(/\S/u)
  await page.clock.fastForward(2_000)
  await expectPose(companion, "idle")
  await expect(companion).toHaveAccessibleName("Pixelkatze sitzt bereit.")
})

test("schaltet gefundene Katzenfarben über die Ressourcenleiste um", async ({
  page,
}) => {
  test.setTimeout(90_000)
  await page.setViewportSize({ width: 900, height: 650 })
  await ready(page)

  const companion = page.locator("#lia-loot-cat-companion")
  await page
    .getByRole("button", { exact: true, name: "Pixelkatze einsammeln" })
    .click()
  await expect(companion.locator(".loot-cat-graphic")).toHaveAttribute(
    "data-cat-variant",
    "orange",
  )

  await page
    .getByRole("button", {
      exact: true,
      name: "Graue Pixelkatze einsammeln",
    })
    .click()
  await expect(companion.locator(".loot-cat-graphic")).toHaveAttribute(
    "data-cat-variant",
    "grey",
  )

  const petControl = page.locator("#lia-loot-pet-control")
  const petSubbar = page.locator("#lia-loot-pet-subbar")
  await expect(petControl).toBeVisible()
  await expect(petControl.locator(".loot-cat-graphic")).toHaveAttribute(
    "data-cat-variant",
    "grey",
  )
  await petControl.click()
  await expect(petControl).toHaveAttribute("aria-expanded", "true")
  await expect(petSubbar).toBeVisible()

  const orangeChoice = page.getByRole("button", {
    exact: true,
    name: "Orange Katze auswählen",
  })
  const greyChoice = page.getByRole("button", {
    exact: true,
    name: "Graue Katze auswählen",
  })
  await expect(orangeChoice).toBeVisible()
  await expect(greyChoice).toHaveAttribute("aria-pressed", "true")
  await orangeChoice.click()
  await expect(companion.locator(".loot-cat-graphic")).toHaveAttribute(
    "data-cat-variant",
    "orange",
  )
  await expect(petSubbar).toBeHidden()

  await page.reload({ waitUntil: "domcontentloaded" })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")
  await expect(companion.locator(".loot-cat-graphic")).toHaveAttribute(
    "data-cat-variant",
    "orange",
  )
  await expect(
    page.getByRole("button", { name: /Pixelkatze einsammeln/u }),
  ).toHaveCount(0)
})
