import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  installTimerEventTracking,
  TIMER_START_SELECTOR,
} from "../src/timer-events.ts"
import { ResourceStore } from "../src/resource-store.ts"

function resourceSession() {
  const data = new Map()
  globalThis.window = {
    location: {
      origin: "https://example.test",
      pathname: "/timer-course",
      search: "",
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, value),
    },
  }
}

function timerClick({
  allowed = true,
  ariaDisabled = false,
  defaultPrevented = false,
  disabled = false,
  hidden = false,
  inert = false,
  isConnected = true,
  matches = true,
  shadowRetargeted = false,
  times = 1,
} = {}) {
  class FakeElement {
    nodeType = 1
  }

  const button = new FakeElement()
  button.disabled = disabled
  button.isConnected = isConnected
  button.ownerDocument = { defaultView: null }
  button.parentElement = null
  button.getAttribute = (name) =>
    name === "aria-disabled" && ariaDisabled ? "true" : null
  button.closest = (selector) => {
    if (selector === TIMER_START_SELECTOR) return matches ? button : null
    if (selector === '[inert], [hidden], [aria-hidden="true"]') {
      return hidden || inert ? button : null
    }
    return null
  }

  let listener = null
  globalThis.document = {
    addEventListener(type, callback) {
      if (type === "click") listener = callback
    },
  }

  let uses = 0
  const attempts = []
  installTimerEventTracking({
    useStart() {
      uses += 1
      return typeof allowed === "function" ? allowed(uses) : allowed
    },
  })

  for (let index = 0; index < times; index += 1) {
    const result = { prevented: false, stopped: false }
    listener({
      composedPath: shadowRetargeted ? () => [button] : () => [],
      defaultPrevented,
      target: shadowRetargeted ? { nodeType: 1, closest: () => null } : button,
      preventDefault() {
        result.prevented = true
      },
      stopImmediatePropagation() {
        result.stopped = true
      },
    })
    attempts.push(result)
  }

  return { attempts, uses }
}

test("verbraucht beim echten Timer-Start genau eine Energie", () => {
  assert.deepEqual(timerClick(), {
    uses: 1,
    attempts: [{ prevented: false, stopped: false }],
  })
})

test("blockiert den Timer-Start vollständig, wenn keine Energie vorhanden ist", () => {
  assert.deepEqual(timerClick({ allowed: false }), {
    uses: 1,
    attempts: [{ prevented: true, stopped: true }],
  })
})

test("erlaubt nach einem abgewiesenen Start einen neuen Versuch", () => {
  assert.deepEqual(
    timerClick({ allowed: (use) => use > 1, times: 2 }),
    {
      uses: 2,
      attempts: [
        { prevented: true, stopped: true },
        { prevented: false, stopped: false },
      ],
    },
  )
})

test("berechnet denselben Startknopf nicht doppelt", () => {
  assert.deepEqual(timerClick({ times: 2 }), {
    uses: 1,
    attempts: [
      { prevented: false, stopped: false },
      { prevented: true, stopped: true },
    ],
  })
})

test("ignoriert deaktivierte, gesperrte und versteckte Timer-Knöpfe", () => {
  assert.equal(timerClick({ disabled: true }).uses, 0)
  assert.equal(timerClick({ ariaDisabled: true }).uses, 0)
  assert.equal(timerClick({ inert: true }).uses, 0)
  assert.equal(timerClick({ hidden: true }).uses, 0)
  assert.equal(timerClick({ isConnected: false }).uses, 0)
})

test("ignoriert fremde und bereits verhinderte Klicks", () => {
  assert.equal(timerClick({ matches: false }).uses, 0)
  assert.equal(timerClick({ defaultPrevented: true }).uses, 0)
})

test("erkennt einen aus dem Shadow-DOM retargeteten Timer-Start", () => {
  assert.deepEqual(timerClick({ shadowRetargeted: true }), {
    uses: 1,
    attempts: [{ prevented: false, stopped: false }],
  })
})

test("verdrahtet Timerstarts nach den Schlössern mit der Energieressource", () => {
  const source = readFileSync(
    new URL("../src/index.ts", import.meta.url),
    "utf8",
  )
  const lockIndex = source.indexOf("installObjectLocks({")
  const timerIndex = source.indexOf("installTimerEventTracking({")
  assert.ok(lockIndex >= 0)
  assert.ok(timerIndex > lockIndex)
  assert.match(
    source.slice(timerIndex),
    /useStart:\s*\(\) => spendResource\("energy"\)/u,
  )
  assert.match(TIMER_START_SELECTOR, /data-sol-timer-ui='solution'/u)
  assert.match(TIMER_START_SELECTOR, /data-sol-timer-ui='hint'/u)
})

test("senkt den echten Energiebestand pro Timerbutton genau einmal", () => {
  resourceSession()
  const resources = new ResourceStore()
  resources.configure(0, 0, 1)

  const first = timerClick({
    allowed: () => resources.spend("energy"),
    times: 2,
  })
  assert.equal(first.uses, 1)
  assert.equal(resources.state()?.energy, 0)

  const blocked = timerClick({
    allowed: () => resources.spend("energy"),
  })
  assert.equal(blocked.uses, 1)
  assert.deepEqual(blocked.attempts, [{ prevented: true, stopped: true }])
  assert.equal(resources.state()?.energy, 0)
})
