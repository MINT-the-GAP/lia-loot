import {
  discoverCourseInlineRevealDeclarations,
  onCourseMarkdownChange,
  parseCourseInlineRevealDeclarations,
  type CourseInlineRevealDeclaration,
  type RevealContainerKind,
} from "./course-chests.ts"
import { sectionFromLootId } from "./slide-activity.ts"

const INLINE_REVEAL_SELECTOR =
  "lia-loot-reveal[data-reveal-layout=inline][data-loot-inline-kind]"
const RENDERER_ATTRIBUTE = "data-loot-inline-renderer"
const TAIL_ATTRIBUTE = "data-loot-inline-tail"
const RENDERED_ATTRIBUTE = "data-loot-inline-rendered"
const OUTPUT_STABILITY_DELAY = 750
const OUTPUT_TIMEOUT = 10_000
const DYNAMIC_ID_ATTRIBUTES = new Set([
  "data-chest-id",
  "data-gate-id",
  "data-key-id",
  "data-lock-id",
  "data-loot-if-id",
  "data-magnifier-id",
  "data-piece-id",
  "data-portal-id",
  "data-reveal-id",
  "data-secret-id",
  "data-tool-id",
])

export interface LiaScriptDynamicSend {
  lia(message: string): void
  liascript(markdown: string): void
}

export interface InlineRevealRenderingApi {
  render(
    revealId: string,
    kind: string,
    send: LiaScriptDynamicSend,
  ): void
}

let declarations: CourseInlineRevealDeclaration[] | null = null
let declarationsPromise: Promise<CourseInlineRevealDeclaration[]> | null = null
let declarationGeneration = 0
let sourceListenerInstalled = false
const dynamicIdObservers = new WeakMap<HTMLElement, MutationObserver>()
const dynamicOutputObservers = new Map<
  string,
  {
    interval: number
    observer: MutationObserver
    settleTimeout: number | null
    timeout: number
  }
>()
// LiaScript can patch the marker, its compiler wrapper, and the trailing text
// in separate DOM turns. Keep one course-scoped registry so later incarnations
// of the same reveal ID cannot leave an orphaned closing delimiter behind.
const pendingCompilerTails = new Map<
  string,
  {
    candidates: Map<
      HTMLElement,
      {
        container: Element
        index: number
        node: Text | null
        marker: HTMLElement
        scope: Node
        wrapper: HTMLElement | null
      }
    >
    host: HTMLElement
    trailingSource: string
  }
>()
let compilerTailObserver: MutationObserver | null = null

function disposeDynamicOutputObservers(): void {
  for (const entry of dynamicOutputObservers.values()) {
    entry.observer.disconnect()
    window.clearInterval(entry.interval)
    if (entry.settleTimeout !== null) {
      window.clearTimeout(entry.settleTimeout)
    }
    window.clearTimeout(entry.timeout)
  }
  dynamicOutputObservers.clear()
}

function normalizedKind(value: string): RevealContainerKind | null {
  const normalized = value.trim().toLocaleLowerCase("de-DE")
  if (normalized === "erde" || normalized === "soil") return "soil"
  if (
    normalized === "pflanze" ||
    normalized === "blume" ||
    normalized === "plant"
  ) {
    return "plant"
  }
  return null
}

function kindToken(kind: RevealContainerKind): "erde" | "pflanze" {
  return kind === "soil" ? "erde" : "pflanze"
}

function revealHost(revealId: string): HTMLElement | null {
  return (
    [...document.querySelectorAll<HTMLElement>(INLINE_REVEAL_SELECTOR)].find(
      (host) => host.getAttribute("data-reveal-id") === revealId,
    ) ?? null
  )
}

function tailMarker(revealId: string): HTMLElement | null {
  return (
    [...document.querySelectorAll<HTMLElement>(`[${TAIL_ATTRIBUTE}]`)].find(
      (marker) => marker.getAttribute(TAIL_ATTRIBUTE) === revealId,
    ) ?? null
  )
}

function rendererMarker(revealId: string): HTMLElement | null {
  return (
    [
      ...document.querySelectorAll<HTMLElement>(
        `[${RENDERER_ATTRIBUTE}]`,
      ),
    ].find(
      (renderer) =>
        renderer.getAttribute(RENDERER_ATTRIBUTE) === revealId,
    ) ?? null
  )
}

function declarationForHost(
  host: HTMLElement,
  kind: RevealContainerKind,
  source: readonly CourseInlineRevealDeclaration[],
): CourseInlineRevealDeclaration | null {
  const revealId = host.getAttribute("data-reveal-id") ?? ""
  const section = sectionFromLootId(revealId)
  if (section === null) return null

  const siblingHosts = [
    ...document.querySelectorAll<HTMLElement>(INLINE_REVEAL_SELECTOR),
  ].filter(
    (candidate) =>
      sectionFromLootId(candidate.getAttribute("data-reveal-id") ?? "") ===
        section &&
      normalizedKind(candidate.getAttribute("data-loot-inline-kind") ?? "") ===
        kind,
  )
  const occurrence = siblingHosts.indexOf(host)
  if (occurrence < 0) return null

  return (
    source.filter(
      (candidate) =>
        candidate.section === section && candidate.kind === kind,
    )[occurrence] ?? null
  )
}

function textPrefixLength(actual: string, expected: string): number | null {
  let actualIndex = 0
  let expectedIndex = 0
  while (expectedIndex < expected.length) {
    if (/\s/u.test(expected[expectedIndex])) {
      while (/\s/u.test(expected[expectedIndex] ?? "")) expectedIndex += 1
      while (/\s/u.test(actual[actualIndex] ?? "")) actualIndex += 1
      continue
    }
    if (actual[actualIndex] !== expected[expectedIndex]) return null
    actualIndex += 1
    expectedIndex += 1
  }
  return actualIndex
}

function removeCompilerTail(
  marker: HTMLElement | null,
  trailingSource: string,
): boolean {
  if (!marker) return true
  if (!trailingSource) {
    marker.remove()
    return true
  }
  const candidate = compilerTailText(marker, trailingSource)
  if (!candidate || !removeCompilerTailSource(candidate, trailingSource)) {
    return false
  }
  marker.remove()
  return true
}

function compilerTailText(
  marker: HTMLElement,
  trailingSource: string,
): Text | null {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let candidate = walker.nextNode()
  let inspected = 0
  while (candidate && inspected < 24) {
    const followsMarker = Boolean(
      marker.compareDocumentPosition(candidate) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    )
    if (!followsMarker) {
      candidate = walker.nextNode()
      continue
    }
    inspected += 1
    const text = candidate.textContent ?? ""
    if (textPrefixLength(text, trailingSource) !== null || text.trim()) {
      return candidate as Text
    }
    candidate = walker.nextNode()
  }
  return null
}

function removeCompilerTailSource(
  candidate: Text,
  trailingSource: string,
): boolean {
  const text = candidate.textContent ?? ""
  const prefixLength = textPrefixLength(text, trailingSource)
  if (prefixLength === null) return false
  const remainder = text.slice(prefixLength)
  if (remainder) candidate.textContent = remainder
  else candidate.parentNode?.removeChild(candidate)
  return true
}

function flushCompilerTails(): void {
  const markersByRevealId = new Map<string, HTMLElement[]>()
  for (const marker of document.querySelectorAll<HTMLElement>(
    `[${TAIL_ATTRIBUTE}]`,
  )) {
    const revealId = marker.getAttribute(TAIL_ATTRIBUTE)
    if (!revealId) continue
    const markers = markersByRevealId.get(revealId)
    if (markers) markers.push(marker)
    else markersByRevealId.set(revealId, [marker])
  }
  for (const [revealId, pending] of [...pendingCompilerTails]) {
    if (!pending.host.isConnected) {
      const liveHost = revealHost(revealId)
      if (liveHost) pending.host = liveHost
    }
    for (const marker of markersByRevealId.get(revealId) ?? []) {
      if (!pending.trailingSource) {
        marker.remove()
      } else {
        const container = marker.parentElement
        const index = container
          ? [...container.children].indexOf(marker)
          : -1
        const text = compilerTailText(marker, pending.trailingSource)
        const adjacentWrapper = marker.nextElementSibling
        const textWrapper = text?.parentElement
        const textWrapperIndex =
          container && textWrapper?.parentElement === container
            ? [...container.children].indexOf(textWrapper)
            : -1
        const wrapper =
          (adjacentWrapper instanceof HTMLElement &&
          adjacentWrapper.matches("span[ondblclick]")
            ? adjacentWrapper
            : null) ??
          (textWrapper?.matches("span[ondblclick]") &&
          textWrapperIndex >= 0 &&
          Math.abs(textWrapperIndex - index) <= 2
            ? textWrapper
            : null)
        const scope =
          marker.closest("p, .lia-paragraph") ?? container
        if (container && scope) {
          for (const [oldMarker, old] of pending.candidates) {
            if (
              !oldMarker.isConnected &&
              !old.wrapper &&
              old.container === container &&
              old.index === index
            ) {
              pending.candidates.delete(oldMarker)
            }
          }
          pending.candidates.set(marker, {
            container,
            index,
            marker,
            node: wrapper === textWrapper ? text : null,
            scope,
            wrapper,
          })
          // The origin record remains active, so a tail inserted into this
          // currently empty wrapper is still removed before the next paint.
          if (wrapper && !wrapper.textContent?.trim()) marker.remove()
        }
      }
    }

    for (const [originMarker, candidate] of [...pending.candidates]) {
      if (
        !candidate.container.isConnected ||
        !candidate.scope.isConnected ||
        !candidate.scope.contains(candidate.container)
      ) {
        pending.candidates.delete(originMarker)
        continue
      }
      if (
        !candidate.wrapper?.isConnected ||
        candidate.wrapper.parentElement !== candidate.container ||
        !candidate.scope.contains(candidate.wrapper)
      ) {
        candidate.wrapper = null
        candidate.node = null
      }
      if (!candidate.wrapper) {
        const siblings = [...candidate.container.children]
        // Element positions deliberately ignore LiaScript's whitespace nodes.
        const indexes = [
          candidate.index,
          candidate.index - 1,
          candidate.index + 1,
          candidate.index - 2,
          candidate.index + 2,
        ]
        const wrapper = indexes
          .map((index) => siblings[index])
          .find(
            (node): node is HTMLElement =>
              node instanceof HTMLElement &&
              node.matches("span[ondblclick]"),
          )
        if (wrapper) candidate.wrapper = wrapper
      }
      if (!candidate.wrapper) continue
      const textNodes = [...candidate.wrapper.childNodes].filter(
        (node): node is Text => node.nodeType === Node.TEXT_NODE,
      )
      const matchingNode = textNodes.find(
        (node) =>
          textPrefixLength(
            node.textContent ?? "",
            pending.trailingSource,
          ) !== null,
      )
      candidate.node =
        matchingNode ??
        textNodes.find((node) => (node.textContent ?? "").trim()) ??
        textNodes[0] ??
        null
      if (!candidate.node) continue
      if (
        removeCompilerTailSource(candidate.node, pending.trailingSource)
      ) {
        pending.candidates.delete(originMarker)
        if (candidate.marker.isConnected) candidate.marker.remove()
      }
    }
  }
}

function ensureCompilerTailObserver(): void {
  if (compilerTailObserver || pendingCompilerTails.size === 0) return
  compilerTailObserver = new MutationObserver(flushCompilerTails)
  compilerTailObserver.observe(document.body, {
    characterData: true,
    childList: true,
    subtree: true,
  })
}

function watchCompilerTail(
  revealId: string,
  trailingSource: string,
  host: HTMLElement,
): void {
  const current = pendingCompilerTails.get(revealId)
  if (current && current.trailingSource === trailingSource) {
    current.host = host
  } else {
    pendingCompilerTails.set(revealId, {
      candidates: new Map(),
      host,
      trailingSource,
    })
  }
  ensureCompilerTailObserver()
  flushCompilerTails()
}

function cleanCompilerTail(
  revealId: string,
  trailingSource: string,
  host: HTMLElement,
): void {
  watchCompilerTail(revealId, trailingSource, host)
}

function resetCompilerTailTracking(): void {
  pendingCompilerTails.clear()
  compilerTailObserver?.disconnect()
  compilerTailObserver = null
}

function stableNumericId(value: string): string {
  let result = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 0x01000193)
  }
  return String(result >>> 0)
}

function normalizeDynamicIds(
  host: HTMLElement,
  revealId: string,
  section: number,
): void {
  let elementIndex = 0
  for (const element of host.querySelectorAll<HTMLElement>("*")) {
    for (const attribute of [...element.attributes]) {
      if (
        !DYNAMIC_ID_ATTRIBUTES.has(attribute.name) ||
        !/^-1_\d+$/u.test(attribute.value)
      ) {
        continue
      }
      element.setAttribute(
        attribute.name,
        `${section}_${stableNumericId(
          `${revealId}:${elementIndex}:${attribute.name}:${attribute.value}`,
        )}`,
      )
    }
    elementIndex += 1
  }
}

function observeDynamicIds(
  host: HTMLElement,
  revealId: string,
  section: number,
): void {
  dynamicIdObservers.get(host)?.disconnect()
  const normalize = (): void => normalizeDynamicIds(host, revealId, section)
  const observer = new MutationObserver(normalize)
  observer.observe(host, {
    attributeFilter: [...DYNAMIC_ID_ATTRIBUTES],
    attributes: true,
    childList: true,
    subtree: true,
  })
  dynamicIdObservers.set(host, observer)
  normalize()
  window.setTimeout(() => {
    if (dynamicIdObservers.get(host) !== observer) return
    normalize()
    observer.disconnect()
    dynamicIdObservers.delete(host)
  }, 10_000)
}

function observeDynamicOutput(
  revealId: string,
  kind: RevealContainerKind,
  declaration: CourseInlineRevealDeclaration,
): void {
  const previous = dynamicOutputObservers.get(revealId)
  if (previous) return

  let moving = false
  let lastAdoptedHost: HTMLElement | null = null
  let entry:
    | {
        interval: number
        observer: MutationObserver
        settleTimeout: number | null
        timeout: number
      }
    | undefined
  const dispose = (): void => {
    if (!entry || dynamicOutputObservers.get(revealId) !== entry) return
    entry.observer.disconnect()
    window.clearInterval(entry.interval)
    if (entry.settleTimeout !== null) {
      window.clearTimeout(entry.settleTimeout)
    }
    window.clearTimeout(entry.timeout)
    dynamicOutputObservers.delete(revealId)
  }
  const scheduleDisposal = (): void => {
    if (!entry) return
    if (entry.settleTimeout !== null) {
      window.clearTimeout(entry.settleTimeout)
    }
    entry.settleTimeout = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!entry || dynamicOutputObservers.get(revealId) !== entry) return
          if (move()) return
          const liveHost = revealHost(revealId)
          const payload =
            liveHost?.querySelector<HTMLElement>(
              "[data-loot-reveal-payload]",
            ) ?? null
          if (
            liveHost === lastAdoptedHost &&
            liveHost?.getAttribute(RENDERED_ATTRIBUTE) === "true" &&
            payload?.hasChildNodes() &&
            !rendererMarker(revealId)
          ) {
            dispose()
          }
        })
      })
    }, OUTPUT_STABILITY_DELAY)
  }
  const move = (): boolean => {
    if (
      moving ||
      !entry ||
      dynamicOutputObservers.get(revealId) !== entry
    ) {
      return false
    }
    const host = revealHost(revealId)
    const renderer = rendererMarker(revealId)
    const marker = tailMarker(revealId)
    if (marker) {
      if (host) {
        cleanCompilerTail(
          revealId,
          declaration.trailingSource,
          host,
        )
      } else if (removeCompilerTail(marker, declaration.trailingSource)) {
        pendingCompilerTails.get(revealId)?.candidates.delete(marker)
      }
    }
    const output = renderer?.querySelector<HTMLElement>("output") ?? null
    const payload =
      host?.querySelector<HTMLElement>("[data-loot-reveal-payload]") ??
      null
    if (!host || !renderer || !output?.hasChildNodes()) {
      return false
    }

    moving = true
    try {
      host.setAttribute(
        "data-options",
        `${kindToken(kind)}${declaration.options ? `; ${declaration.options}` : ""}`,
      )
      const livePayload = payload ?? host
      livePayload.replaceChildren(...output.childNodes)
      renderer.remove()
      host.setAttribute(RENDERED_ATTRIBUTE, "true")

      const section = sectionFromLootId(revealId)
      if (section !== null) observeDynamicIds(host, revealId, section)
      lastAdoptedHost = host
      scheduleDisposal()
      return true
    } finally {
      moving = false
    }
  }

  const observer = new MutationObserver(() => {
    move()
  })
  observer.observe(document.body, {
    characterData: true,
    childList: true,
    subtree: true,
  })
  const interval = window.setInterval(move, 20)
  const timeout = window.setTimeout(() => {
    if (!entry || dynamicOutputObservers.get(revealId) !== entry) return
    const adoptedNow = move()
    const liveHost = revealHost(revealId)
    const payload =
      liveHost?.querySelector<HTMLElement>("[data-loot-reveal-payload]") ??
      null
    const outputStable =
      adoptedNow ||
      (liveHost === lastAdoptedHost &&
        liveHost?.getAttribute(RENDERED_ATTRIBUTE) === "true" &&
        Boolean(payload?.hasChildNodes()) &&
        !rendererMarker(revealId))
    dispose()
    if (!outputStable) {
      rendererMarker(revealId)?.remove()
      revealHost(revealId)?.removeAttribute(RENDERED_ATTRIBUTE)
    }
  }, OUTPUT_TIMEOUT)
  entry = { interval, observer, settleTimeout: null, timeout }
  dynamicOutputObservers.set(revealId, entry)
  move()
}

async function courseInlineDeclarations(): Promise<
  CourseInlineRevealDeclaration[]
> {
  if (declarations) return declarations
  if (declarationsPromise) return declarationsPromise

  const generation = declarationGeneration
  declarationsPromise = discoverCourseInlineRevealDeclarations()
    .then((discovered) => {
      if (generation === declarationGeneration && declarations === null) {
        declarations = discovered
      }
      return declarations ?? discovered
    })
    .finally(() => {
      declarationsPromise = null
    })
  return declarationsPromise
}

function stop(send: LiaScriptDynamicSend): void {
  send.lia("LIA: stop")
}

async function renderInlineReveal(
  revealId: string,
  authoredKind: string,
  send: LiaScriptDynamicSend,
): Promise<void> {
  const host = revealHost(revealId)
  const kind = normalizedKind(authoredKind)
  if (!host || !kind) {
    stop(send)
    return
  }

  const source = await courseInlineDeclarations()
  const declaration = declarationForHost(host, kind, source)
  if (!declaration) {
    stop(send)
    return
  }

  host.setAttribute(
    "data-options",
    `${kindToken(kind)}${declaration.options ? `; ${declaration.options}` : ""}`,
  )
  cleanCompilerTail(
    revealId,
    declaration.trailingSource,
    host,
  )
  if (!declaration.deferred) {
    rendererMarker(revealId)?.remove()
    stop(send)
    return
  }
  if (host.getAttribute(RENDERED_ATTRIBUTE) === "true") {
    stop(send)
    return
  }
  if (dynamicOutputObservers.has(revealId)) {
    stop(send)
    return
  }

  const renderer = rendererMarker(revealId)
  if (!renderer) {
    stop(send)
    return
  }
  host.setAttribute(RENDERED_ATTRIBUTE, "true")
  observeDynamicOutput(revealId, kind, declaration)
  send.liascript(declaration.content)
  stop(send)
}

function installSourceListener(): void {
  if (sourceListenerInstalled) return
  sourceListenerInstalled = true
  onCourseMarkdownChange((markdown) => {
    declarationGeneration += 1
    disposeDynamicOutputObservers()
    resetCompilerTailTracking()
    declarations = parseCourseInlineRevealDeclarations(markdown)
    declarationsPromise = null
  })
}

export function installInlineRevealRendering(): void {
  if (window.__LIA_LOOT_INLINE_REVEALS__) return
  installSourceListener()
  window.__LIA_LOOT_INLINE_REVEALS__ = {
    render(revealId, kind, send) {
      void renderInlineReveal(revealId, kind, send).catch(() => stop(send))
    },
  }
}
