import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { runInNewContext } from "node:vm"

import { parseResourceOptions } from "../src/resource-options.ts"

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
  return source.replace(/@('?)(\d+)/gu, (placeholder, escaped, index) => {
    const value = parameters[Number(index)]
    if (value === undefined) return placeholder
    return escaped ? JSON.stringify(String(value)).slice(1, -1) : String(value)
  })
}

function executeResourceMacro(parameters) {
  let configured
  let calls = 0
  const window = {
    __LIA_LOOT_HIGHSCORE__: {
      resources(gold, diamonds, ...options) {
        calls += 1
        configured = { gold, diamonds, ...parseResourceOptions(options) }
      },
    },
  }
  runInNewContext(
    expandMacroParameters(resourceMacroBody(readme), parameters),
    { window },
  )
  assert.equal(calls, 1)
  return configured
}

test("Ressourcen-Makro uebergibt den optionalen Energiewert bei der Ausfuehrung", () => {
  assert.deepEqual(executeResourceMacro([10, 3, 5]), {
    gold: 10,
    diamonds: 3,
    energy: 5,
  })
  assert.deepEqual(executeResourceMacro([10, 3, 0]), {
    gold: 10,
    diamonds: 3,
    energy: 0,
  })
})

test("Ressourcen-Makro erlaubt fehlende und leere Energie ohne Limit", () => {
  for (const parameters of [[10, 3], [10, 3, ""]]) {
    assert.deepEqual(executeResourceMacro(parameters), { gold: 10, diamonds: 3 })
  }
  assert.deepEqual(parseResourceOptions([undefined, "@2", "@'3", "@4"]), {})
})

test("Ressourcen-Makro uebergibt benannte Punktwerte mit und ohne Energie", () => {
  assert.deepEqual(
    executeResourceMacro([10, 3, 5, "diamantwert=500", "goldwert=50"]),
    { gold: 10, diamonds: 3, energy: 5, diamondValue: 500, goldValue: 50 },
  )
  for (const options of [
    ["goldwert=0", "diamantwert=12.5"],
    ["diamantwert=12.5", "goldwert=0"],
    ["", "goldwert=0", "diamantwert=12.5"],
    ["diamantwert=12.5; goldwert=0"],
  ]) {
    assert.deepEqual(executeResourceMacro([10, 3, ...options]), {
      gold: 10,
      diamonds: 3,
      goldValue: 0,
      diamondValue: 12.5,
    })
  }
})

test("Ressourcenoptionen bewahren numerische API-Werte und einzelne Overrides", () => {
  assert.deepEqual(parseResourceOptions([7]), { energy: 7 })
  assert.deepEqual(parseResourceOptions([" Goldwert = +2.5e2 "]), {
    goldValue: 250,
  })
  assert.deepEqual(parseResourceOptions(["diamantwert=0"]), { diamondValue: 0 })
  assert.deepEqual(parseResourceOptions(["5; goldwert=100; diamantwert=250"]), {
    energy: 5,
    goldValue: 100,
    diamondValue: 250,
  })
})

test("Ressourcenoptionen lehnen ungueltige Werte, Optionen und Duplikate ab", () => {
  for (const options of [
    [-1],
    [Infinity],
    [NaN],
    ["-1"],
    ["1e309"],
    ["goldwert=-1"],
    ["diamantwert=Infinity"],
    ["goldwert=1e309"],
    ["diamantwert=NaN"],
    ["goldwert="],
    ["goldwert=1 + 1"],
    ["energie=5"],
    ["goldwert=0", "goldwert=100"],
    ["diamantwert=0", "diamantwert=250"],
    [5, 6],
    ["goldwert=100", 5],
  ]) {
    assert.throws(() => parseResourceOptions(options), Error, String(options))
  }
})

test("Ressourcen-Makro behandelt Anfuehrungszeichen in Optionen als Daten", () => {
  assert.throws(
    () => executeResourceMacro([10, 3, 'goldwert=100"); throw new Error("injected")']),
    /Ressourcenwerte/,
  )
})
