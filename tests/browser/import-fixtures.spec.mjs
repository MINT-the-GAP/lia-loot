import { readFile } from "node:fs/promises"

import { expect, test } from "./playwright-fixtures.mjs"

const testOrigin = "http://127.0.0.1:4173"
const editorPath = "/node_modules/@liascript/editor/dist/index.html"
const lootImport = "../../../README.md"
const freezeImport =
  "https://raw.githubusercontent.com/MINT-the-GAP/lia-freeze-v2/34d908c845347cf7e9ed65d90fbd4928dbfa45b9/README.md"

const fixtures = [
  {
    expected: [lootImport, freezeImport],
    file: new URL("./fixtures/import-loot-freeze.md", import.meta.url),
    heading: "Importlauf Loot vor Freeze",
    name: "lia-loot vor lia-freeze-v2",
    path: "/tests/browser/fixtures/import-loot-freeze.md",
    surfaceColor: "yellow",
    surfaceLocation: "menu",
    surfaceMacro: "@Schluessel(gelb; menu)",
  },
  {
    expected: [freezeImport, lootImport],
    file: new URL("./fixtures/import-freeze-loot.md", import.meta.url),
    heading: "Importlauf Freeze vor Loot",
    name: "lia-freeze-v2 vor lia-loot",
    path: "/tests/browser/fixtures/import-freeze-loot.md",
    surfaceColor: "orange",
    surfaceLocation: "classroom",
    surfaceMacro: "@Schluessel(orange; classroom)",
  },
]

function headerImports(markdown) {
  const header = /^<!--([\s\S]*?)-->/u.exec(markdown)?.[1] ?? ""
  return [...header.matchAll(/^\s*import:\s*(\S+)\s*$/gmu)].map(
    (match) => match[1],
  )
}

for (const fixture of fixtures) {
  test(`prüft den direkten Import ${fixture.name}`, async () => {
    const markdown = await readFile(fixture.file, "utf8")

    expect(headerImports(markdown)).toEqual(fixture.expected)
    expect(markdown).toContain(fixture.surfaceMacro)
    expect(markdown).toMatch(/^@Abgabe$/mu)
    expect(markdown).not.toMatch(
      /\b(?:MutationObserver|querySelector(?:All)?)\b/u,
    )
    expect(markdown).not.toMatch(/<script\b/iu)
  })
}

function editorUrl(coursePath) {
  const courseUrl = new URL(coursePath, testOrigin).href
  return `${editorPath}?${courseUrl}`
}

async function expectImportedRuntimes(page, fixture) {
  await expect(
    page.getByRole("heading", { name: fixture.heading, exact: true }),
  ).toBeVisible({ timeout: 55_000 })

  await expect
    .poll(
      () =>
        page.evaluate(() => ({
          freezeStyles: document.querySelectorAll(
            "#lia-submission-runtime-style",
          ).length,
          lootStatus: window.__LIA_LOOT_RUNTIME__?.status ?? null,
          lootStyles: document.querySelectorAll(
            "#lia-loot-highscore-style",
          ).length,
          submissionBoxes: document.querySelectorAll(
            ".lia-submit-box",
          ).length,
        })),
      {
        message:
          "LiaScript hat Loot und Freeze nicht vollständig initialisiert.",
        timeout: 55_000,
      },
    )
    .toEqual({
      freezeStyles: 1,
      lootStatus: "ready",
      lootStyles: 1,
      submissionBoxes: 1,
    })

  await expect(
    page.locator('.lia-submit-box [data-lia-freeze-i18n="submission-heading"]'),
  ).toHaveText("Abgabelink erstellen")
  await expect(page.locator("#lia-create-link")).toHaveText("Link erstellen")
  await expect(page.locator("#lia-create-link")).toBeEnabled()
  await expect(
    page.locator(
      `[data-loot-key-location="${fixture.surfaceLocation}"] [data-loot-key-color="${fixture.surfaceColor}"]`,
    ),
  ).toHaveCount(1)
  await expect(
    page.locator("lia-loot-key.loot-key-host--surface-source"),
  ).toHaveCount(1)
}

for (const fixture of fixtures) {
  test(`lädt beide Runtimes wirklich: ${fixture.name}`, async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Der reproduzierte Chromium-Importblocker wird in beiden Chromium-Jobs geprüft.",
    )
    test.setTimeout(150_000)

    await page.goto(editorUrl(fixture.path), {
      timeout: 30_000,
      waitUntil: "domcontentloaded",
    })
    await expectImportedRuntimes(page, fixture)

    await page.reload({ timeout: 30_000, waitUntil: "domcontentloaded" })
    await expectImportedRuntimes(page, fixture)
  })
}

test("die lokale Runtime-Fixture baut Schlüssel ohne Kurshacks ein", async () => {
  const html = await readFile(
    new URL("./fixtures/surface-keys.html", import.meta.url),
    "utf8",
  )

  expect(html).toContain('<script src="/dist/index.js"></script>')
  expect(html).not.toMatch(
    /\b(?:MutationObserver|querySelector(?:All)?)\b/u,
  )
})
