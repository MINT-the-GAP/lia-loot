import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readme = readFileSync(
  new URL("../README.md", import.meta.url),
  "utf8",
)

test("verwendet ausschließlich das tatsächliche öffentliche Repository", () => {
  assert.doesNotMatch(readme, /MINT-the-GAP\/Loot/u)
  assert.match(
    readme,
    /https:\/\/github\.com\/MINT-the-GAP\/lia-loot/u,
  )
  assert.match(
    readme,
    /raw\.githubusercontent\.com\/MINT-the-GAP\/lia-loot\/main\/README\.md/u,
  )
})

test("verweist nicht auf einen unveröffentlichten 0.0.1-Tag", () => {
  assert.doesNotMatch(readme, /lia-loot(?:\/|@)0\.0\.1/u)
  assert.match(
    readme,
    /cdn\.jsdelivr\.net\/gh\/MINT-the-GAP\/lia-loot@main\/dist\/index\.js/u,
  )
})
