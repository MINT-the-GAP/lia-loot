import assert from "node:assert/strict"
import test from "node:test"

import {
  setLiaCourseRevision,
  setLiaCourseVersion,
} from "../src/course-identity.ts"
import { ExplorationStore } from "../src/exploration-store.ts"

function browserSession(search = "?exploration=1", data = new Map()) {
  globalThis.window = {
    location: {
      href: `https://example.test/exploration-course${search}`,
      origin: "https://example.test",
      pathname: "/exploration-course",
      search,
    },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, String(value)),
    },
  }
  return data
}

test("sammelt Werkzeuge und führt Layertransitionen idempotent aus", () => {
  browserSession()
  const store = new ExplorationStore()

  assert.deepEqual(store.state(), {
    version: 1,
    collectedTools: [],
    dugLayers: [],
    foundDustObjects: [],
    foundInvisibleObjects: [],
    wateredPlants: [],
    openedPlants: [],
  })
  assert.equal(store.collectTool("shovel"), true)
  assert.equal(store.collectTool("shovel"), false)
  assert.equal(store.collectTool("watering-can"), true)
  assert.equal(store.isToolCollected("shovel"), true)

  assert.equal(store.digLayer(" soil-1 "), true)
  assert.equal(store.digLayer("soil-1"), false)
  assert.equal(store.isLayerDug(" soil-1"), true)
  assert.equal(store.findConcealedObject(" secret-1 ", "solid"), true)
  assert.equal(store.findConcealedObject("secret-1", "solid"), false)
  assert.equal(store.findConcealedObject("secret-1", "dust"), true)
  assert.equal(store.isConcealedObjectFound("secret-1", "solid"), true)
  assert.equal(store.isConcealedObjectFound("secret-1", "dust"), true)
  assert.equal(store.waterPlant("plant-1"), true)
  assert.equal(store.waterPlant(" plant-1 "), false)
  assert.equal(store.isPlantWatered("plant-1"), true)
})

test("öffnet Pflanzen erst nach dem Gießen und höchstens einmal", () => {
  browserSession("?plant-transition=1")
  const store = new ExplorationStore()

  assert.equal(store.openPlant("plant-1"), false)
  assert.equal(store.waterPlant("plant-1"), true)
  assert.equal(store.openPlant(" plant-1 "), true)
  assert.equal(store.openPlant("plant-1"), false)
  assert.equal(store.isPlantOpened("plant-1"), true)
})

test("persistiert Fortschritt, aber keine Werkzeugaktivierung", () => {
  browserSession("?persistence=1")
  const first = new ExplorationStore()
  first.collectTool("shovel")
  first.collectTool("watering-can")
  first.digLayer("soil-1")
  first.findConcealedObject("solid-1", "solid")
  first.findConcealedObject("dust-1", "dust")
  first.waterPlant("plant-1")
  first.openPlant("plant-1")
  assert.equal(first.setActiveTool("shovel"), true)
  assert.equal(first.activeTool(), "shovel")

  const restored = new ExplorationStore()
  assert.deepEqual(restored.state(), first.state())
  assert.equal(restored.activeTool(), null)
  assert.equal(restored.setActiveTool("watering-can"), true)
  assert.equal(restored.setActiveTool("watering-can"), false)
  assert.equal(restored.setActiveTool(null), true)
  assert.equal(restored.setActiveTool(null), false)
})

test("aktiviert nur bereits gesammelte Werkzeuge", () => {
  browserSession("?activation=1")
  const store = new ExplorationStore()

  assert.equal(store.setActiveTool("shovel"), false)
  store.collectTool("shovel")
  assert.equal(store.setActiveTool("shovel"), true)
  assert.equal(store.activeTool(), "shovel")
})

test("trennt Exploration zwischen unterschiedlichen Kurs-URLs", () => {
  const data = browserSession("?course=one")
  const first = new ExplorationStore()
  first.collectTool("shovel")
  first.digLayer("soil-1")

  browserSession("?course=two", data)
  assert.deepEqual(new ExplorationStore().state(), {
    version: 1,
    collectedTools: [],
    dugLayers: [],
    foundDustObjects: [],
    foundInvisibleObjects: [],
    wateredPlants: [],
    openedPlants: [],
  })
})

test("zählt alte Fund-IDs nicht in einem geänderten Kursstand weiter", () => {
  browserSession("?course-revision=1")
  try {
    setLiaCourseVersion("1.0.0")
    setLiaCourseRevision("source-old")
    const oldCourse = new ExplorationStore()
    oldCourse.findConcealedObject("old-solid-1", "solid")
    oldCourse.findConcealedObject("old-solid-2", "solid")
    oldCourse.findConcealedObject("old-solid-3", "solid")

    setLiaCourseRevision("source-current")
    const currentCourse = new ExplorationStore()
    currentCourse.findConcealedObject("current-solid-1", "solid")
    assert.deepEqual(currentCourse.state().foundInvisibleObjects, [
      "current-solid-1",
    ])
  } finally {
    setLiaCourseVersion("0.0.1")
  }
})

test("liefert eine defensive Zustandskopie", () => {
  browserSession("?clone=1")
  const store = new ExplorationStore()
  store.collectTool("shovel")
  store.digLayer("soil-1")

  const snapshot = store.state()
  snapshot.collectedTools.length = 0
  snapshot.dugLayers.push("soil-2")
  snapshot.foundInvisibleObjects.push("solid-2")

  assert.deepEqual(store.state().collectedTools, ["shovel"])
  assert.deepEqual(store.state().dugLayers, ["soil-1"])
  assert.deepEqual(store.state().foundInvisibleObjects, [])
})

test("verwirft beschädigte oder inkonsistente Speicherzustände", () => {
  const invalidStates = [
    { version: 2, collectedTools: [], dugLayers: [], wateredPlants: [], openedPlants: [] },
    { version: 1, collectedTools: ["hammer"], dugLayers: [], wateredPlants: [], openedPlants: [] },
    { version: 1, collectedTools: ["shovel", "shovel"], dugLayers: [], wateredPlants: [], openedPlants: [] },
    { version: 1, collectedTools: [], dugLayers: [""], wateredPlants: [], openedPlants: [] },
    { version: 1, collectedTools: [], dugLayers: ["soil-1", " soil-1 "], wateredPlants: [], openedPlants: [] },
    { version: 1, collectedTools: [], dugLayers: [], foundInvisibleObjects: ["secret-1", " secret-1 "], wateredPlants: [], openedPlants: [] },
    { version: 1, collectedTools: [], dugLayers: [], foundDustObjects: [""], wateredPlants: [], openedPlants: [] },
    { version: 1, collectedTools: [], dugLayers: [], wateredPlants: [], openedPlants: ["plant-1"] },
  ]

  for (const [index, invalid] of invalidStates.entries()) {
    const data = browserSession(`?corrupt=${index}`)
    new ExplorationStore().collectTool("shovel")
    const [key] = data.keys()
    data.set(key, JSON.stringify(invalid))

    assert.deepEqual(new ExplorationStore().state(), {
      version: 1,
      collectedTools: [],
      dugLayers: [],
      foundDustObjects: [],
      foundInvisibleObjects: [],
      wateredPlants: [],
      openedPlants: [],
    })
  }
})
