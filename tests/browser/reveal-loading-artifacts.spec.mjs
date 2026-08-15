import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const inlineFixture =
  "/tests/browser/fixtures/reveal-inline-nested-macros.md"
const rangeFixture = "/tests/browser/fixtures/reveal-chain.md"
const runtimeScript =
  /^http:\/\/127\.0\.0\.1:4173\/dist\/index\.js(?:\?.*)?$/u

function editorUrl(fixture) {
  const courseUrl = new URL(
    fixture,
    "http://127.0.0.1:4173",
  ).href
  return editorPath + "?" + courseUrl
}

async function waitForInlineRendering(page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          markers: document.querySelectorAll(
            "[data-loot-inline-renderer], [data-loot-inline-tail]",
          ).length,
          pieces: document.querySelectorAll(
            "lia-loot-reveal[data-reveal-layout=inline] lia-loot-puzzle-piece",
          ).length,
          rendered: document.querySelectorAll(
            "lia-loot-reveal[data-loot-inline-rendered=true]",
          ).length,
          status: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          tails: [
            ...document.querySelectorAll("[data-loot-inline-tail]"),
          ].map((marker) => ({
            id: marker.getAttribute("data-loot-inline-tail"),
            text: marker.nextElementSibling?.textContent ?? null,
          })),
        })),
      { timeout: 55_000 },
    )
    .toEqual({
      markers: 0,
      pieces: 4,
      rendered: 6,
      status: "ready",
      tails: [],
    })
}

test("verbirgt Lade-Artefakte beim verzögerten Runtime-Start", async ({
  page,
}) => {
  test.setTimeout(90_000)

  await page.addInitScript(() => {
    const probe = {
      preflightActive: false,
      seenPending: false,
      visibleArtifacts: [],
    }
    window.__lootLoadingProbe = probe

    const visible = (element) => {
      const style = window.getComputedStyle(element)
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0 &&
        element.getClientRects().length > 0
      )
    }
    const sample = () => {
      const preflightActive = [...document.styleSheets].some((sheet) => {
        try {
          return [...sheet.cssRules].some((rule) =>
            rule.cssText.includes("[data-loot-inline-tail]"),
          )
        } catch {
          return false
        }
      })
      if (!preflightActive) {
        window.requestAnimationFrame(sample)
        return
      }
      probe.preflightActive = true
      const markers = [
        ...document.querySelectorAll("[data-loot-inline-tail]"),
      ]
      if (
        markers.length > 0 &&
        window.__LIA_LOOT_RUNTIME__ === undefined
      ) {
        probe.seenPending = true
      }
      const paragraphs = new Set(
        markers
          .map((marker) => marker.closest("p, .lia-paragraph"))
          .filter(Boolean),
      )
      for (const paragraph of paragraphs) {
        const text = paragraph.innerText
        if (
          visible(paragraph) &&
          (/[)]/u.test(text) || /@(Erdhaufen|Pflanze)/u.test(text))
        ) {
          probe.visibleArtifacts.push(text)
        }
      }
      for (const marker of document.querySelectorAll(
        'a[href^="#lia-loot-reveal-end-"]',
      )) {
        if (visible(marker)) probe.visibleArtifacts.push(marker.innerText)
      }
      window.requestAnimationFrame(sample)
    }
    window.requestAnimationFrame(sample)
  })
  await page.route(runtimeScript, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_200))
    await route.continue()
  })

  await page.goto(editorUrl(inlineFixture), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await waitForInlineRendering(page)

  const probe = await page.evaluate(() => window.__lootLoadingProbe)
  expect(probe.preflightActive).toBe(true)
  expect(probe.seenPending).toBe(true)
  expect(probe.visibleArtifacts).toEqual([])
})

test("bereinigt einen Tail auch nach dem Output-Timeout", async ({
  page,
}) => {
  test.setTimeout(110_000)

  await page.addInitScript(() => {
    window.__lootTailSabotage = {
      restored: 0,
      sabotaged: 0,
    }
    const seen = new WeakSet()

    const sabotage = () => {
      for (const marker of document.querySelectorAll(
        "[data-loot-inline-tail]",
      )) {
        if (seen.has(marker)) continue
        const tail = marker.nextElementSibling
        if (
          !(tail instanceof HTMLElement) ||
          !tail.matches("span[ondblclick]") ||
          !tail.textContent.includes(")")
        ) {
          continue
        }

        seen.add(marker)
        const original = tail.textContent
        tail.textContent = original.replace(")", "]")
        window.__lootTailSabotage.sabotaged += 1
        window.setTimeout(() => {
          if (!tail.isConnected) return
          tail.textContent = original
          window.__lootTailSabotage.restored += 1
        }, 11_000)
      }
    }

    new MutationObserver(sabotage).observe(document, {
      childList: true,
      subtree: true,
    })
    window.setInterval(sabotage, 5)
  })

  await page.goto(editorUrl(inlineFixture), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect
    .poll(
      () =>
        page.evaluate(
          () => window.__lootTailSabotage.sabotaged,
        ),
      {
        timeout: 55_000,
      },
    )
    .toBeGreaterThan(0)
  await expect
    .poll(
      () =>
        page.evaluate(() => window.__lootTailSabotage.restored),
      {
        timeout: 55_000,
      },
    )
    .toBeGreaterThan(0)
  await waitForInlineRendering(page)

  const compilerCloses = page
    .locator(
      ".lia-slide__content:not([hidden]) .lia-paragraph span[ondblclick]",
    )
    .filter({ hasText: ")" })
  await expect(compilerCloses).toHaveCount(0)
})

test("bereinigt einen spät erscheinenden Tail nach Reentry", async ({
  page,
}) => {
  test.setTimeout(90_000)

  await page.goto(editorUrl(inlineFixture), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await waitForInlineRendering(page)
  await page.waitForTimeout(2_000)
  await waitForInlineRendering(page)

  const result = await page.evaluate(async () => {
    const hosts = [
      ...document.querySelectorAll(
        "lia-loot-reveal[data-loot-inline-rendered=true]",
      ),
    ]
    const host = hosts.find((candidate, index) => {
      const revealId = candidate.getAttribute("data-reveal-id")
      return (
        candidate.querySelector("lia-loot-puzzle-piece") !== null &&
        hosts.findIndex(
          (other) => other.getAttribute("data-reveal-id") === revealId,
        ) === index
      )
    })
    const api = window.__LIA_LOOT_INLINE_REVEALS__
    if (!(host instanceof HTMLElement) || !api) {
      throw new Error("Gerenderter Inline-Host oder API fehlt.")
    }
    const revealId = host.getAttribute("data-reveal-id")
    const kind = host.getAttribute("data-loot-inline-kind")
    const container =
      host.closest("p, .lia-paragraph") ?? host.parentElement
    if (!revealId || !kind || !(container instanceof HTMLElement)) {
      throw new Error("Inline-Reentry konnte nicht vorbereitet werden.")
    }

    let sentDynamicOutput = false
    host.setAttribute("data-options", "reentry-sentinel")
    await new Promise((resolve) => {
      api.render(revealId, kind, {
        lia(message) {
          if (message === "LIA: stop") resolve()
        },
        liascript() {
          sentDynamicOutput = true
        },
      })
    })
    const declarationWasResolved =
      host.getAttribute("data-options") !== "reentry-sentinel"

    await new Promise((resolve) => setTimeout(resolve, 1_000))
    const marker = document.createElement("span")
    marker.hidden = true
    marker.setAttribute("data-loot-inline-tail", revealId)
    const tail = document.createElement("span")
    tail.setAttribute("data-loot-test-reentry-tail", revealId)
    tail.setAttribute("ondblclick", "")
    tail.textContent = "]"
    container.append(marker, tail)

    await new Promise((resolve) => setTimeout(resolve, 300))
    const mismatchedTailWasPreserved =
      marker.isConnected && tail.textContent === "]"
    tail.textContent = ")"
    return {
      declarationWasResolved,
      mismatchedTailWasPreserved,
      revealId,
      sentDynamicOutput,
    }
  })

  expect(result.declarationWasResolved).toBe(true)
  expect(result.sentDynamicOutput).toBe(false)
  expect(result.mismatchedTailWasPreserved).toBe(true)
  await expect
    .poll(
      () =>
        page.evaluate(
          (revealId) => ({
            marker: document.querySelector(
              `[data-loot-inline-tail="${revealId}"]`,
            ) !== null,
            tail: document.querySelector(
              `[data-loot-test-reentry-tail="${revealId}"]`,
            )?.textContent,
          }),
          result.revealId,
        ),
      { timeout: 5_000 },
    )
    .toEqual({ marker: false, tail: "" })
})

test("ordnet getrennt materialisierte Tails nur ihrem Ursprung zu", async ({
  page,
}) => {
  test.setTimeout(90_000)

  await page.goto(editorUrl(inlineFixture), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await waitForInlineRendering(page)
  await page.waitForTimeout(2_000)
  await waitForInlineRendering(page)

  const revealId = await page.evaluate(async () => {
    const host = [
      ...document.querySelectorAll(
        "lia-loot-reveal[data-loot-inline-rendered=true]",
      ),
    ].find((candidate) =>
      candidate.querySelector("lia-loot-puzzle-piece"),
    )
    const api = window.__LIA_LOOT_INLINE_REVEALS__
    const container = host?.closest("p, .lia-paragraph") ?? host?.parentElement
    const id = host?.getAttribute("data-reveal-id")
    const kind = host?.getAttribute("data-loot-inline-kind")
    if (!(container instanceof HTMLElement) || !id || !kind || !api) {
      throw new Error("Getrennter Tail konnte nicht vorbereitet werden.")
    }
    await new Promise((resolve) => {
      api.render(id, kind, {
        lia(message) {
          if (message === "LIA: stop") resolve()
        },
        liascript() {},
      })
    })

    const marker = document.createElement("span")
    marker.hidden = true
    marker.setAttribute("data-loot-inline-tail", id)
    container.append(marker)
    await new Promise((resolve) => setTimeout(resolve, 100))
    marker.remove()
    await new Promise((resolve) => setTimeout(resolve, 100))

    const wrapper = document.createElement("span")
    wrapper.setAttribute("data-loot-test-separated-tail", id)
    wrapper.setAttribute("ondblclick", "")
    wrapper.textContent = " "
    container.append(wrapper)
    await new Promise((resolve) => setTimeout(resolve, 100))
    wrapper.append(document.createTextNode(")"))
    return id
  })

  await expect
    .poll(
      () =>
        page.evaluate(
          (id) =>
            document.querySelector(
              `[data-loot-test-separated-tail="${id}"]`,
            )?.textContent,
          revealId,
        ),
      { timeout: 5_000 },
    )
    .toBe(" ")

  const movedText = await page.evaluate(async (id) => {
    const host = [
      ...document.querySelectorAll(
        "lia-loot-reveal[data-loot-inline-rendered=true]",
      ),
    ].find((candidate) => candidate.getAttribute("data-reveal-id") === id)
    const container = host?.closest("p, .lia-paragraph") ?? host?.parentElement
    if (!(container instanceof HTMLElement)) {
      throw new Error("Safety-Scope fehlt.")
    }
    const marker = document.createElement("span")
    marker.hidden = true
    marker.setAttribute("data-loot-inline-tail", id)
    const wrapper = document.createElement("span")
    wrapper.setAttribute("ondblclick", "")
    wrapper.textContent = "]"
    container.append(marker, wrapper)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const movedScope = document.createElement("div")
    movedScope.setAttribute("data-loot-test-moved-tail", id)
    document.body.append(movedScope)
    marker.remove()
    movedScope.append(wrapper)
    wrapper.textContent = ")"
    await new Promise((resolve) => setTimeout(resolve, 500))
    return wrapper.textContent
  }, revealId)

  expect(movedText).toBe(")")
})

test("Endmarker bleiben auch ohne Runtime intrinsisch unsichtbar", async ({
  page,
}) => {
  test.setTimeout(60_000)

  await page.route(runtimeScript, (route) =>
    route.fulfill({
      body: "",
      contentType: "text/javascript",
      status: 200,
    }),
  )
  await page.goto(editorUrl(rangeFixture), {
    timeout: 30_000,
    waitUntil: "domcontentloaded",
  })
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Vergrabener Blumentest",
    }),
  ).toBeVisible({ timeout: 30_000 })

  const markers = page.locator("lia-loot-reveal-end")
  await expect(markers).toHaveCount(2)
  for (let index = 0; index < 2; index += 1) {
    await expect(markers.nth(index)).toHaveAttribute("hidden", "")
    await expect(markers.nth(index)).not.toBeVisible()
  }
  await expect(
    page.locator('a[href^="#lia-loot-reveal-end-"]'),
  ).toHaveCount(0)
  expect(await page.locator("main").innerText()).not.toContain(
    "LOOT-REVEAL-END",
  )
})
