import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const fixturePath = "/tests/browser/fixtures/object-lock-actions.md"

function editorUrl() {
  const courseUrl = new URL(fixturePath, "http://127.0.0.1:4173").href
  return `${editorPath}?${courseUrl}`
}

async function settle(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
}

async function quizState(quiz) {
  return quiz.evaluate((element) => ({
    className: element.className,
    feedback: element.querySelector(".lia-quiz__feedback")?.textContent ?? "",
    hints: [...element.querySelectorAll(".lia-quiz__hints > li")].map(
      (hint) => hint.textContent?.trim() ?? "",
    ),
    inputs: [...element.querySelectorAll("input, textarea")].map((input) => ({
      disabled: input.disabled,
      value: input.value,
    })),
  }))
}

async function expectSameBox(action, lock) {
  const [actionBox, lockBox] = await Promise.all([
    action.boundingBox(),
    lock.boundingBox(),
  ])
  expect(actionBox).not.toBeNull()
  expect(lockBox).not.toBeNull()
  for (const property of ["x", "y", "width", "height"]) {
    expect(Math.abs(actionBox[property] - lockBox[property])).toBeLessThanOrEqual(
      1,
    )
  }
}

test("sperrt und entsperrt drei native Quiz-Aktionen per HTTP-Import", async ({
  page,
}) => {
  test.setTimeout(150_000)

  await page.goto(editorUrl(), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      name: "Importierte Quiz-Aktionsschlösser",
      exact: true,
    }),
  ).toBeVisible({ timeout: 55_000 })
  await expect
    .poll(
      () => page.evaluate(() => window.__LIA_LOOT_RUNTIME__?.status ?? null),
      { timeout: 55_000 },
    )
    .toBe("ready")

  const quizzes = page.locator(".lia-quiz")
  await expect(quizzes).toHaveCount(3)
  const cases = [
    { color: "Roten", index: 0, target: "check" },
    { color: "Blauen", index: 1, target: "resolve" },
    { color: "Grünen", index: 2, target: "hint" },
  ]

  const checkInput = quizzes
    .nth(0)
    .getByRole("textbox", { name: "quiz answer" })
  const resolveInput = quizzes
    .nth(1)
    .getByRole("textbox", { name: "quiz answer" })
  await checkInput.fill("42")
  await expect(resolveInput).toHaveValue("")

  for (const entry of cases) {
    const quiz = quizzes.nth(entry.index)
    const host = page.locator(`lia-loot-lock[data-target=${entry.target}]`)
    const action = quiz.locator(`.lia-quiz__${entry.target}`)
    const lock = page.locator(
      `[data-loot-lock-button][data-loot-lock-target=${entry.target}]`,
    )

    await expect(host).toHaveCount(1)
    expect(await host.getAttribute("data-loot-lock-error")).toBeNull()
    await expect(action).toBeVisible()
    expect(await action.evaluate((element) => element.inert)).toBe(true)
    await expect(action).toHaveAttribute("tabindex", "-1")
    await expect(lock).toBeVisible()
    await expectSameBox(action, lock)

    const before = await quizState(quiz)
    await action.evaluate((element) => element.click())
    await settle(page)
    expect(await quizState(quiz)).toEqual(before)
    expect(await action.evaluate((element) => element.inert)).toBe(true)
    await expect(action).toHaveAttribute("tabindex", "-1")
  }

  const unlock = async ({ color, index, target }) => {
    const quiz = quizzes.nth(index)
    const action = quiz.locator(`.lia-quiz__${target}`)
    const lock = page.locator(
      `[data-loot-lock-button][data-loot-lock-target=${target}]`,
    )
    await page
      .getByRole("button", { name: `${color} Schlüssel einsammeln` })
      .click()
    await expect(lock).toBeVisible()
    await lock.click()
    await expect(lock).toHaveCount(0)
    expect(await action.evaluate((element) => element.inert)).toBe(false)
    await expect(action).not.toHaveAttribute("tabindex", "-1")
    return { action, quiz }
  }

  const check = await unlock(cases[0])
  await check.action.click()
  await expect(check.quiz).toHaveClass(/\bsolved\b/u)
  await expect(checkInput).toHaveValue("42")
  await expect(checkInput).toBeDisabled()
  await expect(check.quiz.locator(".lia-quiz__feedback")).toContainText(
    "richtige Antwort",
  )

  const resolve = await unlock(cases[1])
  await resolve.action.click()
  await expect(resolve.quiz).toHaveClass(/\bresolved\b/u)
  await expect(resolveInput).toHaveValue("17")
  await expect(resolveInput).toBeDisabled()
  await expect(resolve.quiz.locator(".lia-quiz__feedback")).toHaveText(
    "Aufgelöste Antwort",
  )

  const hint = await unlock(cases[2])
  const hintItems = hint.quiz.locator(".lia-quiz__hints > li")
  await expect(hintItems).toHaveCount(0)
  await hint.action.click()
  await expect(hintItems).toHaveCount(1)
  await expect(hintItems).toContainText("dreiundzwanzig")
})
