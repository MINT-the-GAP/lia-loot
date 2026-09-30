import { expect, test } from "./playwright-fixtures.mjs"

const editorPath = "/node_modules/@liascript/editor/dist/index.html"

test("rendert README-Nebel nach internem Folien-Scroll", async ({
  browserName,
  page,
}) => {
  test.skip(browserName !== "chromium", "Der vollständige README-Test läuft gezielt in Chromium.")
  test.setTimeout(120_000)
  await page.setViewportSize({ width: 2000, height: 760 })
  await page.goto(
    editorPath + "?" + new URL("/README.md", "http://127.0.0.1:4173").href,
    { waitUntil: "domcontentloaded" },
  )

  await expect(page.locator("#lia-toc")).toBeAttached({ timeout: 55_000 })
  const tocLink = page
    .locator("#lia-toc a")
    .filter({ hasText: "@Taschenlampe" })
    .last()
  await expect(tocLink).toBeAttached({ timeout: 55_000 })
  await tocLink.click()

  const demoHeading = page.getByText(
    "Sammle die Taschenlampe ein und probiere beide Varianten aus:",
    { exact: true },
  )
  await expect(demoHeading).toBeVisible({ timeout: 55_000 })
  await expect(page.locator(".loot-fog-overlay").first()).toBeAttached({
    timeout: 55_000,
  })
  await page.evaluate(() => {
    document.documentElement.classList.remove("lia-variant-light")
    document.documentElement.classList.add("lia-variant-dark")
  })

  await expect
    .poll(() => page.locator(".loot-fog-overlay .loot-fog-cloud__puff").count(), {
      timeout: 10_000,
    })
    .toBeGreaterThanOrEqual(3)

  await demoHeading.scrollIntoViewIfNeeded()
  await expect
    .poll(
      () =>
        page.locator(".loot-fog-overlay:not([hidden]) .loot-fog-cloud").count(),
      { timeout: 10_000 },
    )
    .toBeGreaterThanOrEqual(3)

  const visibleCourseText = await page
    .locator(".lia-slide__content:not([hidden])")
    .innerText()
  expect(visibleCourseText).not.toMatch(/<\/?lia-keep\s*>/iu)
  expect(visibleCourseText).not.toMatch(/(?:^|\n)\s*`\s*(?:\n|$)/u)

  const layout = await page.evaluate(() => {
    const host = document.querySelector("lia-loot-fog[data-fog-id]")
    const scrollFrame = host?.closest(".lia-slide__container")
    return {
      scrollTop: scrollFrame?.scrollTop ?? 0,
      visibleOverlays: document.querySelectorAll(
        ".loot-fog-overlay:not([hidden])",
      ).length,
    }
  })
  expect(layout.scrollTop).toBeGreaterThan(0)
  expect(layout.visibleOverlays).toBeGreaterThanOrEqual(3)

  const scrollMetrics = async () =>
    page.evaluate(() => {
      const host = [...document.querySelectorAll("lia-loot-fog[data-fog-id]")].find(
        (candidate) => candidate.textContent?.includes("Diese Zeile wird"),
      )
      const id = host?.getAttribute("data-fog-id")
      const overlay = id
        ? document.querySelector(`[data-loot-fog-overlay="${CSS.escape(id)}"]`)
        : null
      const scrollFrame = host?.closest(".lia-slide__container")
      if (!(host instanceof HTMLElement) || !(overlay instanceof HTMLElement)) {
        return null
      }
      return {
        hostTop: host.getBoundingClientRect().top,
        overlayTop: overlay.getBoundingClientRect().top,
        parentClass: overlay.parentElement?.className ?? "",
        position: getComputedStyle(overlay).position,
        scrollTop: scrollFrame?.scrollTop ?? 0,
        styleTop: overlay.style.top,
      }
    })
  const beforeScroll = await scrollMetrics()
  expect(beforeScroll).not.toBeNull()
  await page.evaluate(() => {
    const host = [...document.querySelectorAll("lia-loot-fog[data-fog-id]")].find(
      (candidate) => candidate.textContent?.includes("Diese Zeile wird"),
    )
    host?.closest(".lia-slide__container")?.scrollBy({ top: -40 })
  })
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
  const afterScroll = await scrollMetrics()
  expect(afterScroll).not.toBeNull()
  expect(beforeScroll?.position).toBe("absolute")
  expect(beforeScroll?.parentClass).toContain("lia-slide__content")
  expect(afterScroll?.styleTop).toBe(beforeScroll?.styleTop)
  expect((afterScroll?.scrollTop ?? 0) - (beforeScroll?.scrollTop ?? 0)).toBe(-40)
  expect((afterScroll?.hostTop ?? 0) - (beforeScroll?.hostTop ?? 0)).toBeCloseTo(
    40,
    0,
  )
  expect(
    (afterScroll?.overlayTop ?? 0) - (beforeScroll?.overlayTop ?? 0),
  ).toBeCloseTo(40, 0)

  const rangeDensity = await page.evaluate(() => {
    const start = document.querySelector("lia-loot-fog-start[data-fog-id]")
    const id = start?.getAttribute("data-fog-id")
    const overlay = id
      ? document.querySelector(`[data-loot-fog-overlay="${CSS.escape(id)}"]`)
      : null
    const bodyPuffs = [...(overlay?.querySelectorAll(
      '.loot-fog-cloud__puff[data-loot-fog-connector="false"]',
    ) ?? [])].map((puff) => ({
      height: Number.parseFloat(puff.style.height),
    }))
    const connectors = [...(overlay?.querySelectorAll(
      '.loot-fog-cloud__puff[data-loot-fog-connector="true"]',
    ) ?? [])]
    if (bodyPuffs.length < 2 || connectors.length < 1) return null
    const maximumHeight = Math.max(...bodyPuffs.map((puff) => puff.height))
    return {
      bodyHeightRatio:
        Math.min(...bodyPuffs.map((puff) => puff.height)) / maximumHeight,
      distinctBodyHeights: new Set(
        bodyPuffs.map((puff) => Math.round(puff.height * 10) / 10),
      ).size,
      connectorHeightRatio:
        Math.min(
          ...connectors.map((puff) => Number.parseFloat(puff.style.height)),
        ) / maximumHeight,
      connectorSprites: [
        ...new Set(connectors.map((puff) => puff.dataset.lootFogSprite)),
      ],
    }
  })
  expect(rangeDensity).not.toBeNull()
  expect(rangeDensity?.bodyHeightRatio).toBeGreaterThanOrEqual(0.87)
  expect(rangeDensity?.distinctBodyHeights).toBeGreaterThanOrEqual(3)
  expect(rangeDensity?.connectorHeightRatio).toBeGreaterThanOrEqual(0.7)
  expect(rangeDensity?.connectorSprites.length).toBeGreaterThanOrEqual(3)
})
