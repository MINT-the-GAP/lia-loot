import { expect, test } from "./playwright-fixtures.mjs"

const PALETTE = {
  magenta: ["#d946a8", "#741b56", "#ffb4e4"],
  white: ["#f1f5f9", "#64748b", "#ffffff"],
  black: ["#2d333d", "#080b12", "#cbd5e1"],
  turquoise: ["#20b8b5", "#0b6264", "#a6f3ee"],
  gray: ["#8490a0", "#46515f", "#d9e1ea"],
  brown: ["#9a6240", "#4e2e1f", "#d9ad8d"],
}

test("bindet alle neuen Schlüssel- und Puzzlefarben kontrastreich ein", async ({
  page,
}) => {
  await page.goto(
    "/tests/browser/fixtures/surface-keys.html?variant=access&palette=1",
    { waitUntil: "domcontentloaded" },
  )
  await expect(page.locator("#lia-loot-highscore-style")).toHaveCount(1)

  const colors = Object.keys(PALETTE)
  const rendered = await page.evaluate((paletteColors) => {
    const svgNamespace = "http://www.w3.org/2000/svg"
    const host = document.createElement("div")
    host.hidden = true
    document.body.append(host)

    const variables = (element, prefix) => {
      const style = getComputedStyle(element)
      return ["main", "dark", "light"].map((shade) =>
        style.getPropertyValue(`--loot-${prefix}-${shade}`).trim(),
      )
    }

    const result = {}
    for (const color of paletteColors) {
      const key = document.createElementNS(svgNamespace, "svg")
      key.classList.add(`loot-key-color--${color}`)
      const keyOutline = document.createElementNS(svgNamespace, "path")
      keyOutline.classList.add("loot-key-outline")
      key.append(keyOutline)

      const puzzle = document.createElementNS(svgNamespace, "svg")
      puzzle.classList.add(`loot-puzzle-color--${color}`)
      const puzzleBody = document.createElementNS(svgNamespace, "path")
      puzzleBody.classList.add("loot-puzzle-piece__body")
      puzzle.append(puzzleBody)

      host.append(key, puzzle)
      result[color] = {
        key: variables(key, "key"),
        keyOutline: getComputedStyle(keyOutline).fill,
        puzzle: variables(puzzle, "puzzle"),
        puzzleOutline: getComputedStyle(puzzleBody).stroke,
      }
    }

    const blackGate = document.createElement("section")
    blackGate.className = "loot-puzzle-gate loot-puzzle-color--black"
    const blackGateFrame = document.createElement("div")
    blackGateFrame.className = "loot-puzzle-gate__frame"
    blackGate.append(blackGateFrame)
    host.append(blackGate)
    result.blackGateBorder = getComputedStyle(blackGate).borderTopColor
    result.blackGateFrameBorder =
      getComputedStyle(blackGateFrame).borderTopColor

    host.remove()
    return result
  }, colors)

  for (const [color, expected] of Object.entries(PALETTE)) {
    expect(rendered[color].key, `${color}: Schlüsselpalette`).toEqual(expected)
    expect(rendered[color].puzzle, `${color}: Puzzlepalette`).toEqual(expected)
  }

  expect(rendered.white.keyOutline).toBe("rgb(100, 116, 139)")
  expect(rendered.white.puzzleOutline).toBe("rgb(100, 116, 139)")
  expect(rendered.black.keyOutline).toBe("rgb(203, 213, 225)")
  expect(rendered.black.puzzleOutline).toBe("rgb(203, 213, 225)")
  expect(rendered.blackGateBorder).toBe("rgb(203, 213, 225)")
  expect(rendered.blackGateFrameBorder).toBe("rgb(203, 213, 225)")
})
