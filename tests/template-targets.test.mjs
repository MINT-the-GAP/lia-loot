import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  parseCourseChestCatalogDeclarations,
  parseCourseChestDeclarations,
  parseCourseLockCatalogDeclarations,
  parseCourseLockDeclarations,
} from "../src/course-chests.ts"
import {
  findTemplateTarget,
  findTemplateTargets,
  isTemplateTarget,
  resolveTemplateTarget,
  TEMPLATE_TARGET_DEFINITIONS,
  TEMPLATE_TARGET_LABELS,
  TEMPLATE_TARGETS,
  templateDocumentCandidates,
  templateElementIsVisible,
  templateTargetDefinition,
  templateTargetPresent,
} from "../src/template-targets.ts"

const EXPECTED_DEFINITIONS = [
  ["dynflex", "lia-DynFlex", "slide"],
  ["timer", "lia-timer", "slide"],
  ["boardmode", "lia-board-mode", "global"],
  ["marker", "lia-marker", "global"],
  ["markerquiz", "lia-marker", "slide"],
  ["annotation", "lia-annotation", "global"],
  ["canvasocr", "lia-canvas-ocr", "slide"],
  ["kachel", "lia-kachel", "slide"],
  ["mathpath", "lia-mathpath", "slide"],
  ["llm", "lia-llm", "slide"],
  ["coordinate", "lia-coordinate", "slide"],
  ["freeze", "lia-freeze-v2", "slide"],
]

const EXPECTED_TARGETS = EXPECTED_DEFINITIONS.map(([id]) => id)

class FakeElement {
  constructor({
    attributes = {},
    classes = [],
    id = "",
    visible = true,
  } = {}) {
    this.attributes = new Map(
      Object.entries(attributes).map(([name, value]) => [name, String(value)]),
    )
    this.classes = new Set(classes)
    this.id = id
    this.isConnected = true
    this.nodeType = 1
    this.ownerDocument = null
    this.parentElement = null
    this.previousElementSibling = null
    this.queries = new Map()
    this.rects = visible ? [{}] : []
    this.computedStyle = {
      display: "block",
      opacity: "1",
      visibility: "visible",
    }
  }

  addQuery(selector, elements) {
    this.queries.set(selector, [...elements])
    return this
  }

  closest(selector) {
    let current = this
    while (current) {
      if (current.matches(selector)) return current
      current = current.parentElement
    }
    return null
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  getClientRects() {
    return this.rects
  }

  hasAttribute(name) {
    return this.attributes.has(name)
  }

  matches(selector) {
    if (selector === "[hidden], [aria-hidden='true']") {
      return (
        this.hasAttribute("hidden") ||
        this.getAttribute("aria-hidden") === "true"
      )
    }
    if (selector.startsWith("#")) return this.id === selector.slice(1)
    if (/^\.[a-z0-9_-]+$/iu.test(selector)) {
      return this.classes.has(selector.slice(1))
    }
    return false
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null
  }

  querySelectorAll(selector) {
    return this.queries.get(selector) ?? []
  }
}

class FakeDocument {
  constructor() {
    this.queries = new Map()
    const view = {
      customElements: { get: () => undefined },
      document: this,
      getComputedStyle: (element) => element.computedStyle,
      parent: null,
      top: null,
    }
    view.parent = view
    view.top = view
    this.defaultView = view
  }

  addQuery(selector, elements) {
    const values = [...elements]
    for (const element of values) element.ownerDocument = this
    this.queries.set(selector, values)
    return this
  }

  querySelectorAll(selector) {
    return this.queries.get(selector) ?? []
  }
}

test("hält IDs, Importnamen, Scopes, Labels und Aliase vollständig synchron", () => {
  assert.deepEqual([...TEMPLATE_TARGETS], EXPECTED_TARGETS)
  assert.equal(TEMPLATE_TARGET_DEFINITIONS.length, 12)
  assert.equal(new Set(TEMPLATE_TARGETS).size, 12)
  assert.equal(
    new Set(TEMPLATE_TARGET_DEFINITIONS.map(({ importName }) => importName))
      .size,
    11,
  )
  const repeatedImports = new Map()
  for (const { id, importName } of TEMPLATE_TARGET_DEFINITIONS) {
    const ids = repeatedImports.get(importName) ?? []
    ids.push(id)
    repeatedImports.set(importName, ids)
  }
  assert.deepEqual(
    [...repeatedImports].filter(([, ids]) => ids.length > 1),
    [["lia-marker", ["marker", "markerquiz"]]],
  )

  assert.deepEqual(
    TEMPLATE_TARGET_DEFINITIONS.map(({ id, importName, scope }) => [
      id,
      importName,
      scope,
    ]),
    EXPECTED_DEFINITIONS,
  )
  assert.deepEqual(Object.keys(TEMPLATE_TARGET_LABELS), EXPECTED_TARGETS)
  assert.deepEqual(
    TEMPLATE_TARGET_DEFINITIONS
      .filter(({ scope }) => scope === "global")
      .map(({ id }) => id),
    ["boardmode", "marker", "annotation"],
  )

  for (const definition of TEMPLATE_TARGET_DEFINITIONS) {
    assert.equal(templateTargetDefinition(definition.id), definition)
    assert.equal(resolveTemplateTarget(definition.id), definition.id)
    assert.equal(isTemplateTarget(definition.id), true)
    assert.ok(TEMPLATE_TARGET_LABELS[definition.id].trim().length > 0)
    assert.ok(
      definition.presenceGlobals.length > 0 ||
        definition.runtimeSelector ||
        definition.customElement,
      definition.id,
    )
    for (const alias of definition.aliases) {
      assert.equal(resolveTemplateTarget(alias), definition.id, alias)
    }
  }

  assert.equal(resolveTemplateTarget("Koordinaten_System"), "coordinate")
  for (const removed of [
    "orthography",
    "Rechtschreibung",
    "mathe",
    "Bruchquiz",
    "jsxgraph",
    "JSX Graph",
    "resetter",
    "lia-resetter",
  ]) {
    assert.equal(resolveTemplateTarget(removed), null, removed)
  }
  assert.equal(resolveTemplateTarget("unbekannt"), null)
  assert.equal(isTemplateTarget("unbekannt"), false)
})

test("verlangt einen echten Importmarker statt bloßem Autoren-Markup", () => {
  const documentRoot = new FakeDocument()
  const dynflex = new FakeElement({ classes: ["dynFlex"] })
  documentRoot.addQuery(".dynFlex", [dynflex])

  assert.equal(templateTargetPresent("dynflex", documentRoot), false)
  assert.equal(findTemplateTarget("dynflex", "chest", documentRoot), null)

  documentRoot.defaultView.__LIA_DYNFLEX_V1_0__ = {}
  assert.equal(templateTargetPresent("dynflex", documentRoot), true)
  assert.equal(
    findTemplateTarget("dynflex", "chest", documentRoot)?.chestAnchor,
    dynflex,
  )

  delete documentRoot.defaultView.__LIA_DYNFLEX_V1_0__
  const runtimeMarker = new FakeElement({
    attributes: { "data-dynflex-doc": "ready" },
  })
  documentRoot.addQuery("[data-dynflex-doc]", [runtimeMarker])
  assert.equal(templateTargetPresent("dynflex", documentRoot), false)
  assert.equal(findTemplateTarget("dynflex", "chest", documentRoot), null)

  const freezeDocument = new FakeDocument()
  const freezeRuntime = new FakeElement({ id: "lia-submission-runtime-style" })
  freezeDocument.addQuery("#lia-submission-runtime-style", [freezeRuntime])
  assert.equal(templateTargetPresent("freeze", freezeDocument), true)
})

test("liefert nur verbundene und tatsächlich sichtbare Template-Ziele", () => {
  const documentRoot = new FakeDocument()
  const dynflex = new FakeElement({ classes: ["dynFlex"] })
  documentRoot.defaultView.__LIA_DYNFLEX_V1_0__ = {}
  documentRoot.addQuery(".dynFlex", [dynflex])

  assert.equal(templateElementIsVisible(dynflex), true)
  assert.deepEqual(
    findTemplateTargets("dynflex", "chest", documentRoot).map(
      ({ chestAnchor }) => chestAnchor,
    ),
    [dynflex],
  )

  dynflex.attributes.set("hidden", "")
  assert.equal(templateElementIsVisible(dynflex), false)
  assert.equal(findTemplateTarget("dynflex", "chest", documentRoot), null)

  dynflex.attributes.delete("hidden")
  dynflex.attributes.set("aria-hidden", "true")
  assert.equal(findTemplateTarget("dynflex", "chest", documentRoot), null)

  dynflex.attributes.delete("aria-hidden")
  dynflex.computedStyle.display = "none"
  assert.equal(findTemplateTarget("dynflex", "chest", documentRoot), null)

  dynflex.computedStyle.display = "block"
  const transparentParent = new FakeElement()
  transparentParent.computedStyle.opacity = "0"
  dynflex.parentElement = transparentParent
  assert.equal(findTemplateTarget("dynflex", "chest", documentRoot), null)

  transparentParent.computedStyle.opacity = "1"
  dynflex.isConnected = false
  assert.equal(findTemplateTarget("dynflex", "chest", documentRoot), null)
})

test("findet den extern erzeugten Timer-Startbutton im selben Quiz", () => {
  const documentRoot = new FakeDocument()
  const quiz = new FakeElement({ classes: ["lia-quiz"] })
  const timer = new FakeElement()
  const controlHost = new FakeElement()
  const startButton = new FakeElement()
  const timerSelector = "[data-solution-timer], [data-hint-timer]"
  const startSelector =
    ".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], " +
    ".lia-sol-timer-startbtn[data-sol-timer-ui='hint']"
  timer.parentElement = quiz
  controlHost.parentElement = quiz
  startButton.parentElement = controlHost
  documentRoot.defaultView.__LIA_SOLUTION_TIMER_V0_0_1__ = {}
  documentRoot.addQuery(timerSelector, [timer])

  assert.equal(
    findTemplateTarget("timer", "chest", documentRoot)?.chestAnchor,
    timer,
  )
  assert.equal(findTemplateTarget("timer", "lock", documentRoot), null)

  documentRoot.addQuery(startSelector, [startButton])
  const lock = findTemplateTarget("timer", "lock", documentRoot)
  assert.equal(lock?.root, quiz)
  assert.equal(lock?.lockAnchor, startButton)
  assert.deepEqual(lock?.lockControls, [startButton])
  assert.equal(
    findTemplateTarget("timer", "chest", documentRoot)?.chestAnchor,
    timer,
  )

  timer.rects = []
  assert.equal(findTemplateTarget("timer", "chest", documentRoot), null)
  assert.equal(
    findTemplateTarget("timer", "lock", documentRoot)?.lockAnchor,
    startButton,
  )
})

test("findet globale Board-Mode-Ziele auch im gleichorigin Top-Dokument", () => {
  const courseDocument = new FakeDocument()
  const topDocument = new FakeDocument()
  const toolbar = new FakeElement()
  const button = new FakeElement({ id: "lia-tff-btn-v2" })
  const panel = new FakeElement({ id: "lia-tff-panel-v2", visible: false })
  button.parentElement = toolbar
  toolbar.ownerDocument = topDocument
  topDocument.addQuery("#lia-tff-btn-v2", [button])
  topDocument.addQuery("#lia-tff-panel-v2", [panel])
  topDocument.defaultView.__LIA_TFF_REG_V2__ = {}

  courseDocument.defaultView.parent = topDocument.defaultView
  courseDocument.defaultView.top = topDocument.defaultView

  assert.deepEqual(templateDocumentCandidates(courseDocument), [
    courseDocument,
    topDocument,
  ])
  const match = findTemplateTarget("boardmode", "lock", courseDocument)
  assert.equal(match?.root, toolbar)
  assert.equal(match?.chestAnchor, button)
  assert.equal(match?.chestContainer, panel)
  assert.equal(match?.lockAnchor, button)
  assert.deepEqual(match?.lockControls, [button])
  assert.equal(
    findTemplateTarget("boardmode", "chest", courseDocument)?.chestContainer,
    panel,
  )
  assert.equal(resolveTemplateTarget("boardmodefontbutton"), "boardmode")
})

test("setzt die Textmarker-Truhe in das Menü und sperrt den Markerbutton", () => {
  const documentRoot = new FakeDocument()
  const toolbar = new FakeElement()
  const button = new FakeElement({ id: "lia-hl-btn" })
  const panelBody = new FakeElement({ visible: false })
  button.parentElement = toolbar
  documentRoot.defaultView.__LIA_TEXTMARKER_REG_V4__ = {}
  documentRoot.addQuery("#lia-hl-btn", [button])
  documentRoot.addQuery("#lia-hl-panel > .body", [panelBody])

  const chest = findTemplateTarget("marker", "chest", documentRoot)
  assert.equal(chest?.chestAnchor, button)
  assert.equal(chest?.chestContainer, panelBody)

  const lock = findTemplateTarget("marker", "lock", documentRoot)
  assert.equal(lock?.lockAnchor, button)
  assert.deepEqual(lock?.lockControls, [button])
  assert.equal(resolveTemplateTarget("textmarker"), "marker")
  assert.equal(resolveTemplateTarget("textmarkerbutton"), "marker")
})

test("zeigt die Annotation-Truhe nur im ausgeblendeten Zustand", () => {
  const documentRoot = new FakeDocument()
  const toolbar = new FakeElement({ classes: ["lia-annot-toolbar"] })
  const toggle = new FakeElement({
    attributes: {
      "aria-pressed": "true",
      "data-active": "1",
    },
  })
  toggle.parentElement = toolbar
  toolbar.addQuery("button[data-act='toggle']", [toggle])
  documentRoot.defaultView.__LIA_ANNOTATION__ = {}
  documentRoot.addQuery(".lia-annot-toolbar", [toolbar])

  assert.equal(findTemplateTarget("annotation", "chest", documentRoot), null)
  const lock = findTemplateTarget("annotation", "lock", documentRoot)
  assert.equal(lock?.lockAnchor, toolbar)
  assert.deepEqual(lock?.lockControls, [toolbar])

  toggle.attributes.set("aria-pressed", "false")
  toggle.attributes.set("data-active", "0")
  const chest = findTemplateTarget("annotation", "chest", documentRoot)
  assert.equal(chest?.chestAnchor, toolbar)
  assert.equal(chest?.chestPosition, "below")

  toggle.attributes.set("aria-pressed", "true")
  toggle.attributes.set("data-active", "1")
  assert.equal(findTemplateTarget("annotation", "chest", documentRoot), null)
  assert.equal(resolveTemplateTarget("annotationsbar"), "annotation")
})

test("setzt die OCR-Truhe erst in die geöffnete echte Canvas", () => {
  const documentRoot = new FakeDocument()
  const pair = new FakeElement({ classes: ["lia-canvas-pair"] })
  const launcher = new FakeElement({ classes: ["lia-canvas-launch"] })
  const mount = new FakeElement({
    attributes: { "data-open": "0" },
    classes: ["lia-canvas-mount"],
  })
  const canvas = new FakeElement({ classes: ["lia-draw"] })
  launcher.parentElement = pair
  mount.parentElement = pair
  canvas.parentElement = mount
  pair.addQuery(".lia-canvas-launch", [launcher])
  pair.addQuery(".lia-canvas-mount", [mount])
  mount.addQuery("canvas.lia-draw", [canvas])
  documentRoot.defaultView.__LIA_CANVAS_OCR__ = {}
  documentRoot.addQuery(".lia-canvas-pair", [pair])

  assert.equal(findTemplateTarget("canvasocr", "chest", documentRoot), null)
  const closedLock = findTemplateTarget("canvasocr", "lock", documentRoot)
  assert.equal(closedLock?.lockAnchor, pair)
  assert.deepEqual(closedLock?.lockControls, [pair])

  mount.attributes.set("data-open", "1")
  const openChest = findTemplateTarget("canvasocr", "chest", documentRoot)
  assert.equal(openChest?.root, pair)
  assert.equal(openChest?.chestAnchor, canvas)
  assert.equal(openChest?.chestContainer, undefined)

  mount.attributes.set("data-open", "0")
  assert.equal(findTemplateTarget("canvasocr", "chest", documentRoot), null)
})

test("bindet Coordinate über den registrierten Board-Container statt über dessen DOM-ID", () => {
  const documentRoot = new FakeDocument()
  const registered = new FakeElement({
    classes: ["jxgbox"],
    id: "jxgbox-runtime-42",
  })
  const foreign = new FakeElement({
    classes: ["jxgbox"],
    id: "authored_coordinate_id",
  })
  const stale = new FakeElement({
    classes: ["jxgbox"],
    id: "jxgbox-stale",
  })
  stale.isConnected = false
  documentRoot.addQuery(".jxgbox[id]", [registered, foreign, stale])
  documentRoot.defaultView.__coord = {}
  documentRoot.defaultView.__boards = {
    authored_coordinate_id: { containerObj: registered },
    stale_coordinate: { containerObj: stale },
    invalid_coordinate: { containerObj: {} },
  }

  const chest = findTemplateTarget("coordinate", "chest", documentRoot)
  const lock = findTemplateTarget("coordinate", "lock", documentRoot)
  assert.equal(chest?.root, registered)
  assert.equal(chest?.chestAnchor, registered)
  assert.equal(lock?.lockAnchor, registered)
  assert.deepEqual(lock?.lockControls, [registered])
  assert.notEqual(registered.id, "authored_coordinate_id")
  assert.notEqual(lock?.root, foreign)
})

test("sperrt bei MathPath nur die von @Explain erzeugten Links", () => {
  const documentRoot = new FakeDocument()
  const quiz = new FakeElement({
    attributes: {
      "data-adetail-tags": '["Bruchrechnung"]',
      "data-hint-button": "1",
    },
    classes: ["lia-quiz"],
  })
  const list = new FakeElement({ classes: ["lia-mathpath-explain-list"] })
  const firstLink = new FakeElement({
    attributes: { "data-lia-explain-href": "bruchrechnung.html" },
    classes: ["lia-mathpath-explain-link"],
  })
  const secondLink = new FakeElement({
    attributes: { "data-lia-explain-href": "einheiten.html" },
    classes: ["lia-mathpath-explain-link"],
  })
  const normalQuizButton = new FakeElement()
  list.parentElement = quiz
  firstLink.parentElement = list
  secondLink.parentElement = list
  firstLink.ownerDocument = documentRoot
  secondLink.ownerDocument = documentRoot
  quiz.addQuery(
    "a.lia-mathpath-explain-link[data-lia-explain-href]",
    [firstLink, secondLink],
  )
  documentRoot.defaultView.__LIA_MATHPATH__ = {}
  documentRoot.addQuery(
    ".lia-quiz[data-lia-explain-enabled='1'], " +
      ".lia-quiz[data-hint-button='1'][data-adetail-tags], " +
      ".lia-mathpath-explain-list",
    [quiz, list],
  )

  const chest = findTemplateTarget("mathpath", "chest", documentRoot)
  const lock = findTemplateTarget("mathpath", "lock", documentRoot)
  assert.equal(chest?.root, quiz)
  assert.equal(chest?.chestAnchor, quiz)
  assert.equal(lock?.root, quiz)
  assert.equal(lock?.lockAnchor, firstLink)
  assert.deepEqual(lock?.lockControls, [firstLink, secondLink])
  assert.ok(!lock?.lockControls.includes(normalQuizButton))
  assert.ok(!lock?.lockControls.includes(quiz))

  list.computedStyle.display = "none"
  assert.equal(findTemplateTarget("mathpath", "chest", documentRoot)?.root, quiz)
  assert.equal(findTemplateTarget("mathpath", "lock", documentRoot), null)
})

test("ignoriert unzugängliche Parent-Registries fail-closed", () => {
  const documentRoot = new FakeDocument()
  const inaccessibleParent = {}
  Object.defineProperties(inaccessibleParent, {
    customElements: {
      get() {
        throw new Error("cross-origin")
      },
    },
    document: {
      get() {
        throw new Error("cross-origin")
      },
    },
  })
  documentRoot.defaultView.parent = inaccessibleParent
  documentRoot.defaultView.top = inaccessibleParent

  assert.deepEqual(templateDocumentCandidates(documentRoot), [documentRoot])
  assert.equal(templateTargetPresent("dynflex", documentRoot), false)
})

test("fasst Markerquiz-Proxies zu einer ganzen Quizfläche zusammen", () => {
  const documentRoot = new FakeDocument()
  const quiz = new FakeElement({ classes: ["markerquiz"] })
  const firstProxy = new FakeElement({ classes: ["hlq-proxy"] })
  const secondProxy = new FakeElement({ classes: ["hlq-proxy"] })
  firstProxy.parentElement = quiz
  secondProxy.parentElement = quiz
  quiz.ownerDocument = documentRoot
  documentRoot.defaultView.__LIA_TEXTMARKER_REG_V4__ = {}
  documentRoot.addQuery(".hlq-proxy", [firstProxy, secondProxy])

  const chestMatches = findTemplateTargets(
    "markerquiz",
    "chest",
    documentRoot,
  )
  assert.equal(chestMatches.length, 1)
  assert.equal(chestMatches[0].root, quiz)
  assert.equal(chestMatches[0].chestAnchor, quiz)

  const lockMatches = findTemplateTargets(
    "markerquiz",
    "lock",
    documentRoot,
  )
  assert.equal(lockMatches.length, 1)
  assert.equal(lockMatches[0].lockAnchor, quiz)
  assert.deepEqual(lockMatches[0].lockControls, [quiz])
})

test("unterscheidet sperrbare Freeze-Flächen vom reinen Eval-Truhenziel", () => {
  const documentRoot = new FakeDocument()
  const runtimeMarker = new FakeElement({
    id: "lia-submission-runtime-style",
  })
  const submit = new FakeElement({ classes: ["lia-submit-box"] })
  const exam = new FakeElement({
    classes: ["lia-exam-intro-virtual-slide"],
  })
  const details = new FakeElement({ classes: ["lia-adetails-points"] })
  const evaluation = new FakeElement({ id: "lia-eval-placeholder" })
  const submitButton = new FakeElement()
  const examButton = new FakeElement()
  const detailsButton = new FakeElement()
  const controlsSelector =
    "button, input, textarea, select, a[href], [tabindex]"
  submit.addQuery(controlsSelector, [submitButton])
  exam.addQuery(controlsSelector, [examButton])
  details.addQuery(controlsSelector, [detailsButton])
  documentRoot.addQuery("#lia-submission-runtime-style", [runtimeMarker])
  documentRoot.addQuery(
    ".lia-submit-box, #lia-exam-overlay > .lia-exam-intro-virtual-slide, .lia-adetails-points, #lia-freeze-bar, #lia-eval-placeholder",
    [submit, exam, details, evaluation],
  )

  assert.deepEqual(
    findTemplateTargets("freeze", "chest", documentRoot).map(
      ({ root }) => root,
    ),
    [submit, exam, details, evaluation],
  )

  const lockMatches = findTemplateTargets("freeze", "lock", documentRoot)
  assert.deepEqual(
    lockMatches.map(({ root }) => root),
    [submit, exam, details],
  )
  assert.deepEqual(
    lockMatches.map(({ lockControls }) => lockControls),
    [[submitButton], [examButton], [detailsButton]],
  )

  const evaluationMatch = templateTargetDefinition("freeze")
    .locate(documentRoot)
    .find(({ root }) => root === evaluation)
  assert.equal(evaluationMatch?.lockAnchor, null)
  assert.deepEqual(evaluationMatch?.lockControls, [])
})

test("portaliert Template-Truhen floating oder als echtes Menü-Kind", () => {
  const chestSource = readFileSync(
    new URL("../src/treasure-chest.ts", import.meta.url),
    "utf8",
  )
  const lockSource = readFileSync(
    new URL("../src/object-lock.ts", import.meta.url),
    "utf8",
  )
  const styleSource = readFileSync(
    new URL("../src/style.ts", import.meta.url),
    "utf8",
  )

  assert.match(
    chestSource,
    /match\.chestContainer \?\? match\.chestAnchor\.ownerDocument\.body/u,
  )
  assert.match(
    chestSource,
    /templateLayout:\s*match\.chestContainer \? "inside" : "floating"/u,
  )
  assert.match(
    chestSource,
    /templatePosition:\s*match\.chestContainer[\s\S]*?match\.chestPosition \?\? "overlay"/u,
  )
  assert.match(
    chestSource,
    /const mount = portalMount\(destination, placement\)/u,
  )
  assert.match(
    chestSource,
    /if \(wrapper\.parentElement !== mount\) \{[\s\S]*?mount\.appendChild\(wrapper\)/u,
  )
  assert.match(
    chestSource,
    /destination\.grouped[\s\S]*?ensurePortalTray\(destination, placement\)/u,
  )
  assert.match(
    styleSource,
    /\.loot-chest-tray\s*\{[\s\S]*?flex-flow:\s*row nowrap;[\s\S]*?overflow-x:\s*auto;/u,
  )
  assert.match(
    styleSource,
    /\.loot-chest-tray\s*>\s*\.loot-chest-placement\s*\{[\s\S]*?width:\s*44px;/u,
  )
  assert.match(
    styleSource,
    /\.loot-chest-placement--template\s*\{[\s\S]*?position:\s*fixed;/u,
  )
  assert.match(
    chestSource,
    /"loot-chest-placement--template-inside",\s*destination\.templateLayout === "inside"/u,
  )
  assert.match(
    chestSource,
    /"loot-chest-placement--template-below",[\s\S]*?destination\.templatePosition === "below"/u,
  )
  assert.match(
    styleSource,
    /\.loot-chest-placement--template-inside\s*\{[\s\S]*?position:\s*relative;/u,
  )
  assert.match(
    chestSource,
    /"aria-pressed",[\s\S]*?"data-active",[\s\S]*?"data-open"/u,
  )
  assert.match(lockSource, /"data-open"/u)

  assert.match(
    lockSource,
    /function templateBinding\([\s\S]*?mode:\s*"floating",/u,
  )
  assert.match(
    lockSource,
    /if \(binding\.mode === "fill"\) \{[\s\S]*?binding\.root\.appendChild\(button\)[\s\S]*?\} else \{\s*binding\.anchor\.ownerDocument\.body\.appendChild\(button\)/u,
  )
  assert.match(
    styleSource,
    /\.loot-object-lock-button--floating\s*\{[\s\S]*?position:\s*fixed;/u,
  )
})

test("dokumentiert zwölf direkte Importe, zwölf Ziele und die Coordinate-Abhängigkeit", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8")
  const frontmatter = /^<!--([\s\S]*?)-->/u.exec(readme)?.[1] ?? ""
  const imports = [
    ...frontmatter.matchAll(/^import:\s+(https:\/\/\S+)\s*$/gmu),
  ].map((match) => match[1])

  assert.equal(imports.length, 12)
  for (const { importName } of TEMPLATE_TARGET_DEFINITIONS) {
    const repository = importName.includes("/")
      ? importName
      : "MINT-the-GAP/" + importName
    assert.ok(
      imports.some((url) =>
        url.toLowerCase().includes("/" + repository.toLowerCase() + "/"),
      ),
      importName,
    )
  }

  for (const removedRepository of [
    "lia-orthography",
    "lia-mathe",
    "algebrite",
    "lia-resetter",
  ]) {
    assert.ok(
      imports.every((url) => !url.toLowerCase().includes(removedRepository)),
      removedRepository,
    )
  }
  assert.equal(
    imports.filter((url) =>
      url.toLowerCase().includes("/liatemplates/jsxgraph/"),
    ).length,
    1,
  )

  const tableRows = readme
    .split(/\r?\n/u)
    .filter((line) => /^\|.*\|$/u.test(line))
  const tick = String.fromCharCode(96)
  const targetRows = tableRows.filter((line) =>
    TEMPLATE_TARGETS.some((target) =>
      line.includes(tick + target + tick),
    ),
  )
  assert.equal(targetRows.length, 12)
  for (const target of TEMPLATE_TARGETS) {
    assert.equal(
      targetRows.filter((line) => line.includes(tick + target + tick)).length,
      1,
      target,
    )
  }

  assert.equal(
    tableRows.filter((line) =>
      /orthography|lia-mathe|algebrite|jsxgraph|resetter/iu.test(line),
    ).length,
    0,
  )
})

test("hält den direkten Template-Smoke für alle Ziele vollständig", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8")
  const smoke = readFileSync(
    new URL("../TemplateTargets.md", import.meta.url),
    "utf8",
  )
  const importLines = (markdown) => {
    const frontmatter = /^<!--([\s\S]*?)-->/u.exec(markdown)?.[1] ?? ""
    return [...frontmatter.matchAll(/^import:\s+(\S+)\s*$/gmu)].map(
      (match) => match[1],
    )
  }
  const readmeImports = importLines(readme)
  const smokeImports = importLines(smoke)

  assert.deepEqual(
    smokeImports.slice(0, readmeImports.length),
    readmeImports,
  )
  assert.equal(smokeImports[readmeImports.length], "./README.md")
  assert.equal(smokeImports.length, 13)

  const chestExamples = { marker: "textmarker" }
  const anchoredChestTargets = new Set(["annotation", "boardmode", "marker"])
  const lockExamples = {
    annotation: "annotationsbar",
    boardmode: "boardmodefontbutton",
    marker: "textmarkerbutton",
  }
  for (const target of TEMPLATE_TARGETS) {
    const chestTarget = chestExamples[target] ?? target
    const lockTarget = lockExamples[target] ?? target
    const escapedChest = chestTarget.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")
    const escapedLock = lockTarget.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")
    const chestOptions = anchoredChestTargets.has(target) ? ";\\s*anker" : ""
    assert.equal(
      [
        ...smoke.matchAll(
          new RegExp(
            "^@Schatztruhe\\(" + escapedChest + chestOptions + "\\)$",
            "gmu",
          ),
        ),
      ].length,
      1,
      `Truhe: ${target}`,
    )
    assert.equal(
      [
        ...smoke.matchAll(
          new RegExp(`^@Schloss\\(${escapedLock},\\s*[^)]+\\)$`, "gmu"),
        ),
      ].length,
      1,
      `Schloss: ${target}`,
    )
    assert.equal(resolveTemplateTarget(chestTarget), target)
    assert.equal(resolveTemplateTarget(lockTarget), target)
  }

  assert.doesNotMatch(
    smoke,
    /lia-orthography|lia-mathe|algebrite|lia-resetter/iu,
  )
})

test("zeigt am README-Ende genau eine praktische Folie je Direktimport", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8")
  const anchor = "<a id=template-live-beispiele></a>"
  assert.equal(readme.split(anchor).length, 2)
  const demo = readme.slice(readme.indexOf(anchor))

  const expectedSlides = [
    {
      heading: "lia-DynFlex – `dynflex`",
      component: /<section class="dynFlex">/u,
    },
    {
      heading: "lia-timer – `timer`",
      component: /data-solution-timer="10s"/u,
    },
    {
      heading: "lia-board-mode – `boardmode`",
      component: /globale Schriftsteuerung/u,
    },
    {
      heading: "lia-marker – `marker` und `markerquiz`",
      component: /<div class="markerquiz">/u,
    },
    {
      heading: "lia-annotation – `annotation`",
      component: /globalen Werkzeugleiste/u,
    },
    {
      heading: "lia-canvas-ocr – `canvasocr`",
      component: /^@canvas$/mu,
    },
    {
      heading: "lia-kachel – `kachel`",
      component: /<div class="Kachel">/u,
    },
    {
      heading: "lia-llm – `llm`",
      component: /@LLMQuiz\(0\.66;/u,
    },
    {
      heading: "lia-coordinate – `coordinate`",
      component: /^@CoordinateSystem\(/mu,
    },
    {
      heading: "lia-freeze-v2 – `freeze`",
      component: /^@Abgabe$/mu,
    },
    {
      heading: "lia-mathpath – `mathpath`",
      component: /\[\[\?\]\] @Explain/u,
    },
  ]

  const headingMatches = [...demo.matchAll(/^##\s+(.+)$/gmu)]
  assert.deepEqual(
    headingMatches.map((match) => match[1]),
    expectedSlides.map(({ heading }) => heading),
  )
  const slides = headingMatches.map((match, index) =>
    demo.slice(
      match.index,
      headingMatches[index + 1]?.index ?? demo.length,
    ),
  )
  assert.equal(slides.length, 11)
  for (let index = 0; index < slides.length; index += 1) {
    assert.match(slides[index], expectedSlides[index].component)
  }

  const targetOrder = [
    "dynflex",
    "timer",
    "boardmode",
    "marker",
    "markerquiz",
    "annotation",
    "canvasocr",
    "kachel",
    "llm",
    "coordinate",
    "freeze",
    "mathpath",
  ]
  const publicChestTargets = { marker: "textmarker" }
  const publicLockTargets = {
    annotation: "annotationsbar",
    boardmode: "boardmodefontbutton",
    marker: "textmarkerbutton",
  }
  for (const target of targetOrder) {
    const chestTarget = publicChestTargets[target] ?? target
    const lockTarget = publicLockTargets[target] ?? target
    const escapedChest = chestTarget.replace(/[.*+?^$()|[\]\\]/gu, "\\$&")
    const escapedLock = lockTarget.replace(/[.*+?^$()|[\]\\]/gu, "\\$&")
    assert.match(
      demo,
      new RegExp(
        "^@(?:Schatztruhe|Diamanttruhe|Energiekiste)\\(" +
          escapedChest +
          "(?:;\\s*anker)?\\)$",
        "mu",
      ),
      "kopierbare Truhe: " + target,
    )
    assert.match(
      demo,
      new RegExp("^@Schloss\\(" + escapedLock + ",\\s*[^)]+\\)$", "mu"),
      "kopierbares Schloss: " + target,
    )
    assert.equal(resolveTemplateTarget(chestTarget), target)
    assert.equal(resolveTemplateTarget(lockTarget), target)
  }

  for (const lockTarget of Object.values(publicLockTargets)) {
    const escapedLock = lockTarget.replace(/[.*+?^$()|[\]\\]/gu, "\\$&")
    assert.match(
      demo,
      new RegExp(
        "^@Schloss\\(" + escapedLock + ",\\s*[^;)]+;\\s*anker\\)$",
        "mu",
      ),
      "folienlokales öffentliches Schloss: " + lockTarget,
    )
    assert.match(
      demo,
      new RegExp(
        "^@LootSchloss_\\(@uid," +
          escapedLock +
          ",[^;)]+;\\s*anker\\)$",
        "mu",
      ),
      "folienlokales internes Schloss: " + lockTarget,
    )
  }

  assert.deepEqual(
    [
      ...demo.matchAll(
        /^@LootTruhe_\(@uid,([^;,]+);\s*anker,(gold|diamonds|energy)\)$/gmu,
      ),
    ].map((match) => match[1]),
    targetOrder,
  )
  const internalLockTargets = [
    ...demo.matchAll(
      /^@LootSchloss_\(@uid,([^,]+),([^)]+)\)$/gmu,
    ),
  ].map((match) => match[1])
  assert.deepEqual(internalLockTargets, [
    "dynflex",
    "timer",
    "boardmodefontbutton",
    "textmarkerbutton",
    "markerquiz",
    "annotationsbar",
    "canvasocr",
    "kachel",
    "llm",
    "coordinate",
    "freeze",
    "mathpath",
  ])
  assert.deepEqual(
    internalLockTargets.map((target) => resolveTemplateTarget(target)),
    targetOrder,
  )

  assert.deepEqual(parseCourseLockDeclarations(demo), [])
  assert.deepEqual(parseCourseChestDeclarations(demo), [])
  assert.deepEqual(
    parseCourseLockCatalogDeclarations(demo).map(({ target }) => target),
    internalLockTargets,
  )
  assert.deepEqual(
    parseCourseChestCatalogDeclarations(demo).map(({ placement }) =>
      resolveTemplateTarget(placement.split(";")[0]),
    ),
    targetOrder,
  )
  assert.equal([...demo.matchAll(/^```/gmu)].length % 2, 0)
  assert.equal(
    [...readme.matchAll(/^Wie heißt dieses Template\?$/gmu)].length,
    1,
  )
})
