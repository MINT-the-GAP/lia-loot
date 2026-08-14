import { readFile } from "node:fs/promises"

import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const lootImport = "../../../README.md"
const navigationImport =
  "https://raw.githubusercontent.com/MINT-the-GAP/lia-navigation/7881ba6facbf8f84f5f7de9937c4a1aceb19559b/README.md"
const secretTitle = "Verborgener Navigationsgarten"

const fixtures = [
  {
    expectedImports: [lootImport, navigationImport],
    file: new URL("./fixtures/import-loot-navigation.md", import.meta.url),
    heading: "Importlauf Loot vor Navigation",
    name: "lia-loot vor lia-navigation",
    path: "/tests/browser/fixtures/import-loot-navigation.md",
  },
  {
    expectedImports: [navigationImport, lootImport],
    file: new URL("./fixtures/import-navigation-loot.md", import.meta.url),
    heading: "Importlauf Navigation vor Loot",
    name: "lia-navigation vor lia-loot",
    path: "/tests/browser/fixtures/import-navigation-loot.md",
  },
]

function headerImports(markdown) {
  const header = /^<!--([\s\S]*?)-->/u.exec(markdown)?.[1] ?? ""
  return [...header.matchAll(/^\s*import:\s*(\S+)\s*$/gmu)].map(
    (match) => match[1],
  )
}

function editorUrl(coursePath) {
  const courseUrl = new URL(coursePath, testOrigin).href
  return editorPath + "?" + courseUrl
}

async function expectImportedNavigation(page, fixture) {
  await expect(
    page.getByRole("heading", { name: fixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })

  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          discovering: document.documentElement.classList.contains(
            "loot-secret-slide-discovering",
          ),
          lootStatus: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          navigation: Boolean(document.querySelector("#lia-bm-toc5")),
          search: Boolean(document.querySelector("#lia-bm-toc5 .bm-search")),
        })),
      {
        message:
          "LiaScript hat Loot, Geheimfolien und lia-navigation nicht vollständig initialisiert.",
        timeout: 55_000,
      },
    )
    .toEqual({
      discovering: false,
      lootStatus: "ready",
      navigation: true,
      search: true,
    })

  const nativeSecretLink = page.locator(
    '#lia-toc .lia-toc__content a[href$="#2"]',
  )
  const navigationSecretLink = page
    .locator('#lia-bm-toc5 a[href$="#2"]')
    .filter({ hasText: secretTitle })
  const navigationSecretRow = navigationSecretLink.locator("xpath=..")
  const navigationSearch = page.locator("#lia-bm-toc5 .bm-search")
  const clearNavigationSearch = page.locator(
    "#lia-bm-toc5 .bm-search-clear",
  )
  const navigationList = page.locator("#lia-bm-toc5 > .bm-list")
  const navigationFooter = page.locator("#lia-bm-toc5 > .bm-footer")
  const tocFinds = navigationList.locator(
    "[data-loot-chest-portal][data-loot-chest-location=toc], [data-loot-key-placement][data-loot-key-location=toc]",
  )

  await expect(nativeSecretLink).toHaveCount(1)
  await expect(navigationSecretLink).toHaveCount(1)
  await expect(tocFinds).toHaveCount(2)
  await expect(tocFinds.nth(0)).toBeVisible()
  await expect(tocFinds.nth(1)).toBeVisible()
  await expect(navigationFooter).toBeVisible()

  const tocLayout = await page.evaluate(() => {
    const list = document.querySelector("#lia-bm-toc5 > .bm-list")
    const footer = document.querySelector("#lia-bm-toc5 > .bm-footer")
    const finds = list?.querySelectorAll(
      "[data-loot-chest-portal][data-loot-chest-location=toc], [data-loot-key-placement][data-loot-key-location=toc]",
    )
    const lastFind = finds?.item((finds?.length ?? 1) - 1)
    lastFind?.scrollIntoView({ block: "nearest" })
    const findRect = lastFind?.getBoundingClientRect()
    const footerRect = footer?.getBoundingClientRect()
    const listRect = list?.getBoundingClientRect()
    return {
      findBottom: findRect?.bottom ?? Number.NaN,
      findTop: findRect?.top ?? Number.NaN,
      footerTop: footerRect?.top ?? Number.NaN,
      listTop: listRect?.top ?? Number.NaN,
    }
  })

  expect(Number.isFinite(tocLayout.findTop)).toBe(true)
  expect(tocLayout.findTop).toBeGreaterThanOrEqual(tocLayout.listTop - 0.5)
  expect(tocLayout.findBottom).toBeLessThanOrEqual(tocLayout.footerTop + 0.5)
  await expect(nativeSecretLink).toHaveClass(/loot-secret-slide-link/u)
  await expect(navigationSecretLink).toHaveClass(/loot-secret-slide-link/u)
  await expect(navigationSecretRow).toHaveClass(/loot-secret-slide-row/u)
  await expect(navigationSecretLink).not.toBeVisible()

  await navigationSearch.fill("Verborgener Navigation")
  await expect(navigationSecretLink).not.toHaveClass(
    /loot-secret-slide-link--found/u,
  )
  await expect(navigationSecretLink).not.toBeVisible()

  await navigationSearch.fill(secretTitle)
  await expect(nativeSecretLink).toHaveClass(
    /loot-secret-slide-link--found/u,
  )
  await expect(navigationSecretLink).toHaveClass(
    /loot-secret-slide-link--found/u,
  )
  await expect(navigationSecretRow).toHaveClass(
    /loot-secret-slide-row--found/u,
  )
  await expect(navigationSecretLink).toBeVisible()

  await clearNavigationSearch.click()
  await expect(navigationSearch).toHaveValue("")
  await expect(navigationSecretLink).not.toHaveClass(
    /loot-secret-slide-link--found/u,
  )
  await expect(navigationSecretLink).not.toBeVisible()

  await navigationSearch.fill(secretTitle)
  await navigationSecretLink.click()
  await expect(
    page.getByRole("heading", { name: secretTitle, exact: true }),
  ).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#2")

  await page.reload({ timeout: 30_000, waitUntil: "domcontentloaded" })
  await expect
    .poll(() => page.evaluate(() => window.location.hash), {
      message: "Der Reload durfte die Geheimfolie nicht direkt offen halten.",
      timeout: 55_000,
    })
    .not.toBe("#2")
  await expect(
    page.getByRole("heading", { name: secretTitle, exact: true }),
  ).not.toBeVisible()
}

test("hält beide gepinnten Importreihenfolgen und den Geheimfolienvertrag fest", async () => {
  for (const fixture of fixtures) {
    const markdown = await readFile(fixture.file, "utf8")

    expect(headerImports(markdown)).toEqual(fixture.expectedImports)
    expect(markdown).toMatch(/^@Geheimfolie$/mu)
    expect(markdown).toMatch(
      new RegExp("^## " + secretTitle + "$", "mu"),
    )
    expect(markdown).not.toMatch(
      /\b(?:MutationObserver|querySelector(?:All)?)\b/u,
    )
    expect(markdown).not.toMatch(/<script\b/iu)
  }
})

for (const fixture of fixtures) {
  test("integriert Geheimfolien mit " + fixture.name, async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Der echte Remote-Import wird in beiden Chromium-CI-Jobs geprüft.",
    )
    test.setTimeout(180_000)

    await page.goto(editorUrl(fixture.path), {
      timeout: 30_000,
      waitUntil: "domcontentloaded",
    })
    await expectImportedNavigation(page, fixture)
  })
}
