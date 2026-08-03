export const TEMPLATE_TARGETS = [
  "dynflex",
  "timer",
  "boardmode",
  "marker",
  "markerquiz",
  "annotation",
  "canvasocr",
  "kachel",
  "mathpath",
  "llm",
  "coordinate",
  "freeze",
] as const

export type TemplateTarget = (typeof TEMPLATE_TARGETS)[number]
export type TemplateTargetPurpose = "chest" | "lock"
export type TemplateTargetScope = "global" | "slide"
export type TemplateChestPosition = "overlay" | "below"

export interface TemplateTargetMatch {
  target: TemplateTarget
  root: HTMLElement
  chestAnchor: HTMLElement
  chestAvailable?: boolean
  chestContainer?: HTMLElement
  chestPosition?: TemplateChestPosition
  lockAnchor: HTMLElement | null
  lockControls: HTMLElement[]
  focusCandidates: HTMLElement[]
}

export interface TemplateTargetDefinition {
  id: TemplateTarget
  aliases: readonly string[]
  importName: string
  label: string
  presenceGlobals: readonly string[]
  runtimeSelector?: string
  customElement?: string
  scope: TemplateTargetScope
  locate(documentRoot: Document): TemplateTargetMatch[]
}

type WindowLike = Window & Record<string, unknown>

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[\s_-]+/g, "")
}

export function normalizeTemplateTarget(value: string): string {
  return normalizeName(value)
}

export function templateDocumentCandidates(
  documentRoot: Document,
): Document[] {
  const documents: Document[] = []
  const add = (candidate: unknown): void => {
    if (!candidate || typeof candidate !== "object") return
    const documentCandidate = candidate as Document
    if (
      typeof documentCandidate.querySelectorAll === "function" &&
      !documents.includes(documentCandidate)
    ) {
      documents.push(documentCandidate)
    }
  }

  add(documentRoot)
  for (const candidate of windowCandidates(documentRoot)) {
    try {
      add(candidate.document)
    } catch {
      // A cross-origin document is intentionally ignored.
    }
  }
  return documents
}

export function annotationToggleIsHidden(
  toggle: Element | null,
): boolean {
  return (
    toggle?.getAttribute("aria-pressed") === "false" ||
    toggle?.getAttribute("data-active") === "0"
  )
}

function queryAll(
  documentRoot: Document,
  selector: string,
): HTMLElement[] {
  const elements: HTMLElement[] = []
  for (const candidate of templateDocumentCandidates(documentRoot)) {
    try {
      for (const element of candidate.querySelectorAll<HTMLElement>(selector)) {
        if (!elements.includes(element)) elements.push(element)
      }
    } catch {
      // Invalid selectors and inaccessible documents fail closed.
    }
  }
  return elements
}

function wholeComponent(
  target: TemplateTarget,
  root: HTMLElement,
): TemplateTargetMatch {
  return {
    target,
    root,
    chestAnchor: root,
    lockAnchor: root,
    lockControls: [root],
    focusCandidates: [root],
  }
}

function controlledComponent(
  target: TemplateTarget,
  root: HTMLElement,
  control: HTMLElement | null,
  chestAnchor: HTMLElement = root,
): TemplateTargetMatch {
  return {
    target,
    root,
    chestAnchor,
    lockAnchor: control,
    lockControls: control ? [control] : [],
    focusCandidates: control ? [control, root] : [root],
  }
}

function componentWithControls(
  target: TemplateTarget,
  root: HTMLElement,
  lockAnchor: HTMLElement | null,
  lockControls: HTMLElement[],
  chestAnchor: HTMLElement = root,
): TemplateTargetMatch {
  return {
    target,
    root,
    chestAnchor,
    lockAnchor,
    lockControls,
    focusCandidates: [...lockControls, root],
  }
}

function chestOnlyComponent(
  target: TemplateTarget,
  root: HTMLElement,
): TemplateTargetMatch {
  return {
    target,
    root,
    chestAnchor: root,
    lockAnchor: null,
    lockControls: [],
    focusCandidates: [root],
  }
}

function uniqueMatches(matches: readonly TemplateTargetMatch[]): TemplateTargetMatch[] {
  const seen = new Set<HTMLElement>()
  return matches.filter((match) => {
    if (seen.has(match.root)) return false
    seen.add(match.root)
    return true
  })
}

function timerQuizRoot(element: HTMLElement): HTMLElement | null {
  return element.matches(".lia-quiz")
    ? element
    : element.closest<HTMLElement>(".lia-quiz")
}

function quizBeforeMarker(marker: HTMLElement): HTMLElement | null {
  const containingQuiz = marker.closest<HTMLElement>(".lia-quiz")
  if (containingQuiz) return containingQuiz

  const slide = marker.closest<HTMLElement>("main.lia-slide__content")
  if (!slide) return null

  let top = marker
  while (top.parentElement && top.parentElement !== slide) {
    top = top.parentElement
  }
  if (top.parentElement !== slide) return null

  let previous = top.previousElementSibling as HTMLElement | null
  while (previous) {
    if (previous.matches(".lia-quiz")) return previous
    const quizzes = previous.querySelectorAll<HTMLElement>(".lia-quiz")
    if (quizzes.length > 0) return quizzes[quizzes.length - 1]
    previous = previous.previousElementSibling as HTMLElement | null
  }
  return null
}

function windowCandidates(documentRoot: Document): WindowLike[] {
  const candidates: WindowLike[] = []
  const add = (candidate: unknown): void => {
    if (!candidate || typeof candidate !== "object") return
    if (!candidates.includes(candidate as WindowLike)) {
      candidates.push(candidate as WindowLike)
    }
  }

  const own = documentRoot.defaultView
  add(own)
  try {
    add(own?.parent)
  } catch {
    // A cross-origin parent is intentionally ignored.
  }
  try {
    add(own?.top)
  } catch {
    // A cross-origin top window is intentionally ignored.
  }
  if (typeof window !== "undefined") add(window)
  return candidates
}

function pathValue(root: WindowLike, path: string): unknown {
  let current: unknown = root
  for (const part of path.split(".")) {
    if (!current || (typeof current !== "object" && typeof current !== "function")) {
      return undefined
    }
    try {
      current = (current as Record<string, unknown>)[part]
    } catch {
      return undefined
    }
  }
  return current
}

function customElementRegistered(
  root: WindowLike,
  name: string,
): boolean {
  try {
    return Boolean(root.customElements?.get(name))
  } catch {
    return false
  }
}

function coordinateBoardRoots(documentRoot: Document): HTMLElement[] {
  const documents = templateDocumentCandidates(documentRoot)
  const roots: HTMLElement[] = []
  for (const candidate of windowCandidates(documentRoot)) {
    const boards = pathValue(candidate, "__boards")
    if (!boards || typeof boards !== "object") continue
    for (const board of Object.values(boards as Record<string, unknown>)) {
      if (!board || typeof board !== "object") continue
      const container = (board as Record<string, unknown>).containerObj
      if (!container || typeof container !== "object") continue
      const root = container as HTMLElement
      if (
        root.nodeType !== 1 ||
        typeof root.matches !== "function" ||
        !root.matches(".jxgbox") ||
        !documents.includes(root.ownerDocument) ||
        roots.includes(root)
      ) {
        continue
      }
      roots.push(root)
    }
  }
  return roots
}

const DEFINITIONS: readonly TemplateTargetDefinition[] = [
  {
    id: "dynflex",
    aliases: ["lia-dynflex", "flex", "flexbereich"],
    importName: "lia-DynFlex",
    label: "DynFlex-Bereich",
    presenceGlobals: ["__LIA_DYNFLEX_V1_0__"],
    runtimeSelector: "[data-dynflex-doc]",
    scope: "slide",
    locate: (documentRoot) =>
      queryAll(documentRoot, ".dynFlex").map((root) =>
        wholeComponent("dynflex", root),
      ),
  },
  {
    id: "timer",
    aliases: ["lia-timer", "quiztimer", "zeit"],
    importName: "lia-timer",
    label: "Quiz-Timer",
    presenceGlobals: ["__LIA_SOLUTION_TIMER_V0_0_1__"],
    runtimeSelector:
      "#__lia_solution_timer_css_v0_0_1__, .lia-sol-timer-badge[data-sol-timer-ui]",
    scope: "slide",
    locate: (documentRoot) => {
      const roots = queryAll(
        documentRoot,
        "[data-solution-timer], [data-hint-timer]",
      )
      const startButtons = queryAll(
        documentRoot,
        ".lia-sol-timer-startbtn[data-sol-timer-ui='solution'], " +
          ".lia-sol-timer-startbtn[data-sol-timer-ui='hint']",
      )
      const matches = roots.map((root) =>
        componentWithControls("timer", root, null, [])
      )
      const controlGroups = new Map<HTMLElement, HTMLElement[]>()
      for (const control of startButtons) {
        const root =
          timerQuizRoot(control) ??
          control.parentElement ??
          control
        const controls = controlGroups.get(root) ?? []
        controls.push(control)
        controlGroups.set(root, controls)
      }
      for (const [root, controls] of controlGroups) {
        const match = componentWithControls(
          "timer",
          root,
          controls[0] ?? null,
          controls,
          controls[0] ?? root,
        )
        match.chestAvailable = false
        matches.push(match)
      }
      return matches
    },
  },
  {
    id: "boardmode",
    aliases: [
      "lia-board-mode",
      "board-modus",
      "schriftgroesse",
      "boardmodefontbutton",
      "fontbutton",
    ],
    importName: "lia-board-mode",
    label: "Board-Mode-Schriftsteuerung",
    presenceGlobals: ["__LIA_TFF_REG_V2__"],
    runtimeSelector: "#lia-tff-btn-v2",
    scope: "global",
    locate: (documentRoot) => {
      const panels = queryAll(documentRoot, "#lia-tff-panel-v2")
      return queryAll(documentRoot, "#lia-tff-btn-v2").map((button) => {
        const panel = panels.find(
          (candidate) => candidate.ownerDocument === button.ownerDocument,
        )
        const match = controlledComponent(
          "boardmode",
          button.parentElement ?? button,
          button,
          button,
        )
        match.chestAvailable = panel !== undefined
        if (panel) match.chestContainer = panel
        return match
      })
    },
  },
  {
    id: "marker",
    aliases: [
      "lia-marker",
      "textmarker",
      "highlighter",
      "textmarkerbutton",
      "markerbutton",
    ],
    importName: "lia-marker",
    label: "Textmarker-Werkzeug",
    presenceGlobals: ["__LIA_TEXTMARKER_REG_V4__"],
    runtimeSelector: "#lia-hl-btn",
    scope: "global",
    locate: (documentRoot) => {
      const panelBodies = queryAll(documentRoot, "#lia-hl-panel > .body")
      return queryAll(documentRoot, "#lia-hl-btn").map((button) => {
        const panelBody = panelBodies.find(
          (candidate) => candidate.ownerDocument === button.ownerDocument,
        )
        const match = controlledComponent(
          "marker",
          button.parentElement ?? button,
          button,
          button,
        )
        match.chestAvailable = panelBody !== undefined
        if (panelBody) match.chestContainer = panelBody
        return match
      })
    },
  },
  {
    id: "markerquiz",
    aliases: ["textmarkerquiz", "marker-quiz", "highlightquiz"],
    importName: "lia-marker",
    label: "Textmarker-Quiz",
    presenceGlobals: ["__LIA_TEXTMARKER_REG_V4__"],
    runtimeSelector: ".hlq-proxy",
    scope: "slide",
    locate: (documentRoot) => {
      const roots = queryAll(documentRoot, ".hlq-proxy").map(
        (proxy) => proxy.closest<HTMLElement>(".markerquiz") ?? proxy,
      )
      return uniqueMatches(
        roots.map((root) => wholeComponent("markerquiz", root)),
      )
    },
  },
  {
    id: "annotation",
    aliases: [
      "lia-annotation",
      "annotieren",
      "zeichenleiste",
      "annotationsbar",
      "annotationbar",
    ],
    importName: "lia-annotation",
    label: "Anmerkungs-Werkzeugleiste",
    presenceGlobals: ["__LIA_ANNOTATION__"],
    runtimeSelector: ".lia-annot-toolbar",
    scope: "global",
    locate: (documentRoot) =>
      queryAll(documentRoot, ".lia-annot-toolbar").map((root) => {
        const toggle = root.querySelector<HTMLElement>(
          "button[data-act='toggle']",
        )
        const annotationsHidden = annotationToggleIsHidden(toggle)
        return {
          target: "annotation",
          root,
          chestAnchor: root,
          chestAvailable: annotationsHidden,
          chestPosition: "below",
          lockAnchor: root,
          lockControls: [root],
          focusCandidates: toggle ? [toggle, root] : [root],
        }
      }),
  },
  {
    id: "canvasocr",
    aliases: ["lia-canvas-ocr", "canvas-ocr", "zeichenflaeche"],
    importName: "lia-canvas-ocr",
    label: "Canvas-/OCR-Zeichenfläche",
    presenceGlobals: ["__LIA_CANVAS_OCR__"],
    runtimeSelector: ".lia-canvas-pair",
    scope: "slide",
    locate: (documentRoot) =>
      queryAll(documentRoot, ".lia-canvas-pair").map((root) => {
        const mount = root.querySelector<HTMLElement>(".lia-canvas-mount")
        const canvas = mount?.querySelector<HTMLElement>("canvas.lia-draw") ??
          null
        const launcher = root.querySelector<HTMLElement>(".lia-canvas-launch")
        return {
          target: "canvasocr",
          root,
          chestAnchor: canvas ?? mount ?? root,
          chestAvailable:
            mount?.getAttribute("data-open") === "1" && canvas !== null,
          lockAnchor: root,
          lockControls: [root],
          focusCandidates: launcher ? [launcher, root] : [root],
        }
      }),
  },
  {
    id: "kachel",
    aliases: ["lia-kachel", "kachelfolge", "tiles"],
    importName: "lia-kachel",
    label: "Kachelaufgabe",
    presenceGlobals: ["LiaKachel.kachelfolge"],
    runtimeSelector: "[data-lia-kachelfolge]",
    scope: "slide",
    locate: (documentRoot) => {
      const roots = queryAll(
        documentRoot,
        "[data-lia-kachelfolge], div.Kachel",
      ).filter(
        (root) =>
          root.hasAttribute("data-lia-kachelfolge") ||
          !root.querySelector("[data-lia-kachelfolge]"),
      )
      return roots.map((root) => wholeComponent("kachel", root))
    },
  },
  {
    id: "mathpath",
    aliases: ["lia-mathpath", "erklaerpfad", "explain"],
    importName: "lia-mathpath",
    label: "MathPath-Erklärquiz",
    presenceGlobals: ["__LIA_MATHPATH__"],
    runtimeSelector:
      ".lia-quiz[data-lia-explain-enabled='1'], " +
      ".lia-quiz[data-hint-button='1'][data-adetail-tags], " +
      ".lia-mathpath-explain-list",
    scope: "slide",
    locate: (documentRoot) => {
      const roots = queryAll(
        documentRoot,
        ".lia-quiz[data-lia-explain-enabled='1'], " +
          ".lia-quiz[data-hint-button='1'][data-adetail-tags], " +
          ".lia-mathpath-explain-list",
      ).map((element) => {
        return element.matches(".lia-quiz")
          ? element
          : element.closest<HTMLElement>(".lia-quiz") ?? element
      })
      return uniqueMatches(
        roots.map((root) => {
          const links = [
            ...root.querySelectorAll<HTMLElement>(
              "a.lia-mathpath-explain-link[data-lia-explain-href]",
            ),
          ].filter(templateElementIsVisible)
          return componentWithControls(
            "mathpath",
            root,
            links[0] ?? null,
            links,
          )
        }),
      )
    },
  },
  {
    id: "llm",
    aliases: ["lia-llm", "llmquiz", "kiquiz"],
    importName: "lia-llm",
    label: "LLM-Quiz",
    presenceGlobals: ["LiaLLM.version"],
    runtimeSelector:
      "lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']",
    scope: "slide",
    locate: (documentRoot) => {
      const matches = queryAll(
        documentRoot,
        "lia-llm-quiz-use, lia-llm-feedback[id^='lia-llm-feedback-']",
      )
        .map(quizBeforeMarker)
        .filter((root): root is HTMLElement => root !== null)
        .map((root) => wholeComponent("llm", root))
      return uniqueMatches(matches)
    },
  },
  {
    id: "coordinate",
    aliases: ["lia-coordinate", "koordinaten", "koordinatensystem"],
    importName: "lia-coordinate",
    label: "Koordinatensystem",
    presenceGlobals: ["__coord"],
    scope: "slide",
    locate: (documentRoot) =>
      coordinateBoardRoots(documentRoot).map((root) =>
        wholeComponent("coordinate", root),
      ),
  },
  {
    id: "freeze",
    aliases: ["lia-freeze-v2", "abgabe", "submission"],
    importName: "lia-freeze-v2",
    label: "Freeze-Abgabe",
    presenceGlobals: [],
    runtimeSelector: "#lia-submission-runtime-style",
    scope: "slide",
    locate: (documentRoot) =>
      uniqueMatches(
        queryAll(
          documentRoot,
          ".lia-submit-box, #lia-exam-overlay > .lia-exam-intro-virtual-slide, .lia-adetails-points, #lia-freeze-bar, #lia-eval-placeholder",
        ).map((root) => {
          if (root.matches("#lia-eval-placeholder")) {
            return chestOnlyComponent("freeze", root)
          }

          const controls = [
            ...root.querySelectorAll<HTMLElement>(
              "button, input, textarea, select, a[href], [tabindex]",
            ),
          ]
          if (controls.length === 0) {
            return chestOnlyComponent("freeze", root)
          }
          return componentWithControls(
            "freeze",
            root,
            root,
            [...new Set(controls)],
          )
        }),
      ),
  },
]

export const TEMPLATE_TARGET_DEFINITIONS = DEFINITIONS

export const TEMPLATE_TARGET_LABELS: Readonly<Record<TemplateTarget, string>> =
  Object.fromEntries(
    DEFINITIONS.map((definition) => [definition.id, definition.label]),
  ) as Record<TemplateTarget, string>

const DEFINITION_BY_ID = new Map(
  DEFINITIONS.map((definition) => [definition.id, definition] as const),
)
const TARGET_SET = new Set<string>(TEMPLATE_TARGETS)
const ALIASES = new Map<string, TemplateTarget>()

for (const definition of DEFINITIONS) {
  for (const alias of [definition.id, ...definition.aliases]) {
    const normalized = normalizeName(alias)
    const existing = ALIASES.get(normalized)
    if (existing && existing !== definition.id) {
      throw new Error(
        `Loot: Template-Zielalias ${alias} kollidiert zwischen ${existing} und ${definition.id}.`,
      )
    }
    ALIASES.set(normalized, definition.id)
  }
}

export function resolveTemplateTarget(
  value: string | null | undefined,
): TemplateTarget | null {
  if (!value) return null
  return ALIASES.get(normalizeName(value)) ?? null
}

export function isTemplateTarget(value: string): value is TemplateTarget {
  return TARGET_SET.has(value)
}

export function templateTargetDefinition(
  target: TemplateTarget,
): TemplateTargetDefinition {
  return DEFINITION_BY_ID.get(target)!
}

export function templateTargetPresent(
  target: TemplateTarget,
  documentRoot: Document = document,
): boolean {
  const definition = templateTargetDefinition(target)
  const hasImportSignal =
    definition.presenceGlobals.length > 0 ||
    definition.customElement !== undefined
  for (const candidate of windowCandidates(documentRoot)) {
    if (
      definition.presenceGlobals.some(
        (path) => pathValue(candidate, path) !== undefined,
      )
    ) {
      return true
    }
    if (
      definition.customElement &&
      customElementRegistered(candidate, definition.customElement)
    ) {
      return true
    }
  }
  if (hasImportSignal) return false
  return definition.runtimeSelector
    ? queryAll(documentRoot, definition.runtimeSelector).length > 0
    : false
}

export function templateElementIsVisible(element: HTMLElement): boolean {
  if (element.isConnected === false) return false
  if (element.hasAttribute?.("hidden")) return false
  if (element.getAttribute?.("aria-hidden") === "true") return false
  if (element.closest?.("[hidden], [aria-hidden='true']")) return false

  const view = element.ownerDocument?.defaultView
  if (view?.getComputedStyle) {
    try {
      let current: HTMLElement | null = element
      while (current) {
        const style = view.getComputedStyle(current)
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.visibility === "collapse" ||
          Number(style.opacity) === 0
        ) {
          return false
        }
        current = current.parentElement
      }
    } catch {
      // Detached test doubles can intentionally lack a complete CSS engine.
    }
  }

  if (typeof element.getClientRects === "function") {
    try {
      return element.getClientRects().length > 0
    } catch {
      return false
    }
  }
  return true
}

export function findTemplateTargets(
  target: TemplateTarget,
  purpose: TemplateTargetPurpose,
  documentRoot: Document = document,
): TemplateTargetMatch[] {
  if (!templateTargetPresent(target, documentRoot)) return []

  const matches = templateTargetDefinition(target).locate(documentRoot)
  const available: TemplateTargetMatch[] = []
  for (const match of matches) {
    if (!templateElementIsVisible(match.root)) continue
    if (purpose === "chest") {
      if (match.chestAvailable === false) continue
      if (templateElementIsVisible(match.chestAnchor)) available.push(match)
      continue
    }
    if (
      match.lockAnchor &&
      match.lockControls.length > 0 &&
      templateElementIsVisible(match.lockAnchor)
    ) {
      available.push(match)
    }
  }
  return available
}

export function findTemplateTarget(
  target: TemplateTarget,
  purpose: TemplateTargetPurpose,
  documentRoot: Document = document,
): TemplateTargetMatch | null {
  return findTemplateTargets(target, purpose, documentRoot)[0] ?? null
}
