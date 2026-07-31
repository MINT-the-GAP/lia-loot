import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const readme = await readFile(new URL("../README.md", import.meta.url), "utf8")

function resourceMacroBody(markdown) {
  const match =
    /^@Ressourcen\s*\r?\n<script run-once modify="false">\s*\r?\n([\s\S]*?)\r?\n<\/script>\s*\r?\n@end$/mu.exec(
      markdown,
    )
  assert.ok(match, "@Ressourcen-Makro im Dokumentkopf gefunden")
  return match[1]
}

function expandMacroParameters(source, parameters) {
  return source.replace(/@(\d+)/gu, (placeholder, index) =>
    parameters[Number(index)] === undefined
      ? placeholder
      : String(parameters[Number(index)]),
  )
}

test("Ressourcen-Makro verwirft den dritten Wert bei der LiaScript-Expansion nicht", () => {
  const macro = resourceMacroBody(readme)

  assert.equal(
    macro.match(/@2/gu)?.length,
    1,
    "@2 darf nur an der eigentlichen Eingabestelle stehen",
  )

  const expanded = expandMacroParameters(macro, [10, 10, 10])
  assert.match(expanded, /var rawEnergy = String\("10"\)\.trim\(\);/u)
  assert.doesNotMatch(expanded, /rawEnergy === "10"/u)
  assert.match(expanded, /rawEnergy\.startsWith\("@"\)/u)
  assert.match(expanded, /api\.resources\(Number\("10"\), Number\("10"\), energy\);/u)
})

test("Ressourcen-Makro erkennt weiterhin den fehlenden optionalen Energiewert", () => {
  const expanded = expandMacroParameters(resourceMacroBody(readme), [10, 10])

  assert.match(expanded, /var rawEnergy = String\("@2"\)\.trim\(\);/u)
  assert.match(expanded, /rawEnergy\.startsWith\("@"\)/u)
})
