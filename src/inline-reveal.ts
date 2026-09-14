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
const RENDERER_ORIGIN_ATTRIBUTE = `${RENDERER_ATTRIBUTE}-origin`
const TAIL_ORIGIN_ATTRIBUTE = `${TAIL_ATTRIBUTE}-origin`
const RENDERED_ATTRIBUTE = "data-loot-inline-rendered"
const ERROR_ATTRIBUTE = "data-loot-inline-error"
const HOST_RETRY_DELAY = 50
const SOURCE_TIMEOUT = 15_000
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

interface RenderRequest {
  generation: number
  kind: RevealContainerKind
  send: LiaScriptDynamicSend
}

interface DynamicOutputObserver {
  interval: number
  observer: MutationObserver
  requestedRenderers: WeakSet<HTMLElement>
  settleTimeout: number | null
  timeout: number
}

interface CompilerTailCandidate {
  container: Element
  following: Element | null
  marker: HTMLElement
  previous: Element | null
  scope: Element
  wrapper: HTMLElement | null
}

let declarations: CourseInlineRevealDeclaration[] | null = null
let declarationsPromise: Promise<CourseInlineRevealDeclaration[]> | null = null
let declarationGeneration = 0
let sourceListenerInstalled = false
const declarationBindings = new Map<string, CourseInlineRevealDeclaration>()
const renderRequests = new Map<string, RenderRequest>()
const knownKinds = new Map<string, RevealContainerKind>()
const dynamicIdObservers = new WeakMap<HTMLElement, MutationObserver>()
const dynamicOutputObservers = new Map<string, DynamicOutputObserver>()
// Keep the marker's exact DOM anchors across separate compiler patch turns.
// Never recover an orphaned tail by scanning unrelated paragraphs or macros.
const pendingCompilerTails = new Map<
  string,
  {
    candidates: Map<HTMLElement, CompilerTailCandidate>
    trailingSource: string
  }
>()
let compilerTailObserver: MutationObserver | null = null
let completedCompilerTails = new WeakMap<
  HTMLElement,
  { node: Text; parent: Node | null; scope: Element | null; text: string }
>()

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
  const hosts = [
    ...document.querySelectorAll<HTMLElement>(INLINE_REVEAL_SELECTOR),
  ].filter((host) => host.getAttribute("data-reveal-id") === revealId)
  // Both incarnations can briefly be connected during a compiler patch.
  return hosts.length === 1 ? hosts[0] : null
}

function rendererMarker(revealId: string): HTMLElement | null {
  const markers = [
    ...document.querySelectorAll<HTMLElement>(`[${RENDERER_ATTRIBUTE}]`),
  ].filter((marker) => marker.getAttribute(RENDERER_ATTRIBUTE) === revealId)
  return markers.length === 1 ? markers[0] : null
}

// LiaScript patches siblings by their virtual-DOM index. Removing its spans
// shifts those indices and a later patch can replace authored text next to us.
// Retire only our attributes and preserve the compiler's hidden DOM slots.
function retireMarker(marker: HTMLElement | null, attribute: string): void {
  if (!marker) return
  const id = marker.getAttribute(attribute)
  if (id !== null) {
    marker.setAttribute(`${attribute}-origin`, id)
    marker.removeAttribute(attribute)
  }
  if (!marker.hidden) marker.hidden = true
  if (!marker.inert) marker.inert = true
  if (marker.getAttribute("aria-hidden") !== "true") {
    marker.setAttribute("aria-hidden", "true")
  }
  if (
    marker.style.getPropertyValue("display") !== "none" ||
    marker.style.getPropertyPriority("display") !== "important"
  ) marker.style.setProperty("display", "none", "important")
}

function rendererForRequest(revealId: string): HTMLElement | null {
  const active = rendererMarker(revealId)
  if (active) return active
  if ([...document.querySelectorAll<HTMLElement>(`[${RENDERER_ATTRIBUTE}]`)]
    .some((marker) => marker.getAttribute(RENDERER_ATTRIBUTE) === revealId)) {
    return null
  }
  const retired = [
    ...document.querySelectorAll<HTMLElement>(`[${RENDERER_ORIGIN_ATTRIBUTE}]`),
  ].filter(
    (marker) => marker.getAttribute(RENDERER_ORIGIN_ATTRIBUTE) === revealId,
  )
  if (retired.length !== 1) return null
  retired[0].setAttribute(RENDERER_ATTRIBUTE, revealId)
  return retired[0]
}

function declarationForHost(
  host: HTMLElement,
  kind: RevealContainerKind,
  source: readonly CourseInlineRevealDeclaration[],
): CourseInlineRevealDeclaration | null {
  const revealId = host.getAttribute("data-reveal-id") ?? ""
  const section = sectionFromLootId(revealId)
  if (section === null) return null
  const bound = declarationBindings.get(revealId)
  if (bound) return bound.kind === kind ? bound : null

  const hosts = [
    ...document.querySelectorAll<HTMLElement>(INLINE_REVEAL_SELECTOR),
  ]
  for (const candidate of hosts) {
    const id = candidate.getAttribute("data-reveal-id")
    const hostKind = normalizedKind(
      candidate.getAttribute("data-loot-inline-kind") ?? "",
    )
    if (id && hostKind) knownKinds.set(id, hostKind)
  }
  const siblingHosts = hosts.filter(
    (candidate) =>
      sectionFromLootId(candidate.getAttribute("data-reveal-id") ?? "") === section &&
      knownKinds.get(candidate.getAttribute("data-reveal-id") ?? "") === kind,
  )
  const hostIds = siblingHosts.map(
    (candidate) => candidate.getAttribute("data-reveal-id") ?? "",
  )
  if (new Set(hostIds).size !== hostIds.length) return null

  const ids = new Set<string>()
  for (const candidate of document.querySelectorAll<HTMLElement>(
    `${INLINE_REVEAL_SELECTOR}, [${RENDERER_ATTRIBUTE}], [${TAIL_ATTRIBUTE}], [${RENDERER_ORIGIN_ATTRIBUTE}], [${TAIL_ORIGIN_ATTRIBUTE}]`,
  )) {
    const id =
      candidate.getAttribute("data-reveal-id") ??
      candidate.getAttribute(RENDERER_ATTRIBUTE) ??
      candidate.getAttribute(TAIL_ATTRIBUTE) ??
      candidate.getAttribute(RENDERER_ORIGIN_ATTRIBUTE) ??
      candidate.getAttribute(TAIL_ORIGIN_ATTRIBUTE) ??
      ""
    if (sectionFromLootId(id) === section && knownKinds.get(id) === kind) {
      ids.add(id)
    }
  }
  const siblings = source.filter(
    (candidate) => candidate.section === section && candidate.kind === kind,
  )
  // A temporarily missing predecessor must not shift later occurrences. Its
  // own renderer/tail can preserve its position without blocking healthy hosts.
  // Bind the complete, deduplicated ID group and retain it on replacement.
  if (!host.isConnected || ids.size !== siblings.length || !ids.has(revealId)) {
    return null
  }
  Array.from(ids).forEach((id, index) => declarationBindings.set(id, siblings[index]))
  return declarationBindings.get(revealId) ?? null
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

function removeCompilerTailSource(
  candidate: Text,
  trailingSource: string,
  marker: HTMLElement,
): boolean {
  const text = candidate.textContent ?? ""
  const prefixLength = textPrefixLength(text, trailingSource)
  if (prefixLength === null) return false
  const remainder = text.slice(prefixLength)
  // Preserve text-node slots too, including an empty final delimiter.
  candidate.textContent = remainder
  completedCompilerTails.set(marker, {
    node: candidate,
    parent: candidate.parentNode,
    scope: marker.parentElement,
    text: remainder,
  })
  return true
}

function followingTailNode(marker: HTMLElement): ChildNode | null {
  let node = marker.nextSibling
  while (node?.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) {
    node = node.nextSibling
  }
  return node
}

function compilerWrapper(node: Node | null): HTMLElement | null {
  return node instanceof HTMLElement && node.matches("span[ondblclick]")
    ? node
    : null
}

function anchoredCompilerWrapper(
  candidate: CompilerTailCandidate,
): HTMLElement | null {
  if (candidate.marker.isConnected) {
    return compilerWrapper(followingTailNode(candidate.marker))
  }
  const { container, previous, following } = candidate
  if (
    (previous && previous.parentElement !== container) ||
    (following && following.parentElement !== container)
  ) return null
  const node = previous
    ? previous.nextElementSibling
    : container.firstElementChild
  const wrapper = compilerWrapper(node)
  // Only a wrapper inserted in the marker's exact former slot is attributable
  // to this reveal. Nearby wrappers can belong to normal text or another macro.
  return wrapper && wrapper.nextElementSibling === following ? wrapper : null
}

function clearRetiredRendererOutputs(): void {
  for (const renderer of document.querySelectorAll<HTMLElement>(
    `[${RENDERER_ORIGIN_ATTRIBUTE}]`,
  )) {
    if (renderer.hasAttribute(RENDERER_ATTRIBUTE)) continue
    const revealId = renderer.getAttribute(RENDERER_ORIGIN_ATTRIBUTE) ?? ""
    // A later LiaScript patch can recreate output inside its retained slot.
    // The live instance already owns the real content; discard only this
    // hidden duplicate, never the compiler's surrounding sibling slots.
    if (!hasRenderedPayload(revealHost(revealId))) continue
    const output = renderer.querySelector<HTMLElement>("output")
    if (output?.hasChildNodes()) output.replaceChildren()
  }
}

function flushCompilerTails(): void {
  clearRetiredRendererOutputs()
  for (const marker of document.querySelectorAll<HTMLElement>(
    `[${TAIL_ATTRIBUTE}], [${TAIL_ORIGIN_ATTRIBUTE}]`,
  )) {
    const pending = pendingCompilerTails.get(
      marker.getAttribute(TAIL_ATTRIBUTE) ??
        marker.getAttribute(TAIL_ORIGIN_ATTRIBUTE) ?? "",
    )
    if (!pending) continue
    if (!pending.trailingSource) {
      retireMarker(marker, TAIL_ATTRIBUTE)
      continue
    }
    const completed = completedCompilerTails.get(marker)
    if (
      completed?.node.isConnected &&
      completed.node.parentNode === completed.parent &&
      marker.parentElement === completed.scope &&
      completed.scope?.contains(completed.node) &&
      completed.node.textContent === completed.text
    ) {
      retireMarker(marker, TAIL_ATTRIBUTE)
      continue
    }
    const following = followingTailNode(marker)
    // LiaScript puts delimiters BETWEEN same-line macros in direct text nodes;
    // only the final delimiter is normally inside a compiler span.
    if (
      following?.nodeType === Node.TEXT_NODE &&
      removeCompilerTailSource(following as Text, pending.trailingSource, marker)
    ) {
      pending.candidates.delete(marker)
      retireMarker(marker, TAIL_ATTRIBUTE)
      continue
    }
    if (!pending.candidates.has(marker)) {
      const container = marker.parentElement
      const scope = marker.closest("p, .lia-paragraph") ?? container
      if (!container || !scope) continue
      const wrapper = compilerWrapper(following)
      pending.candidates.set(marker, {
        container,
        following: wrapper ? wrapper.nextElementSibling : marker.nextElementSibling,
        marker,
        previous: marker.previousElementSibling,
        scope,
        wrapper,
      })
      // Preserve its exact wrapper reference even if text arrives much later.
      if (wrapper && !wrapper.textContent?.trim()) {
        retireMarker(marker, TAIL_ATTRIBUTE)
      }
    }
  }

  for (const pending of pendingCompilerTails.values()) {
    for (const [originMarker, candidate] of pending.candidates) {
      if (
        !candidate.container.isConnected ||
        !candidate.scope.isConnected ||
        !candidate.scope.contains(candidate.container)
      ) {
        pending.candidates.delete(originMarker)
        continue
      }
      if (
        candidate.wrapper &&
        (candidate.wrapper.parentElement !== candidate.container ||
          !candidate.scope.contains(candidate.wrapper))
      ) {
        // A moved wrapper no longer belongs to the recorded instance area.
        pending.candidates.delete(originMarker)
        continue
      }
      candidate.wrapper ??= anchoredCompilerWrapper(candidate)
      if (!candidate.wrapper) continue
      const node = [...candidate.wrapper.childNodes].find(
        (child): child is Text =>
          child.nodeType === Node.TEXT_NODE && Boolean(child.textContent?.trim()),
      )
      if (
        node &&
        removeCompilerTailSource(node, pending.trailingSource, candidate.marker)
      ) {
        pending.candidates.delete(originMarker)
        retireMarker(candidate.marker, TAIL_ATTRIBUTE)
      }
    }
  }
}

function cleanCompilerTail(
  revealId: string,
  trailingSource: string,
): void {
  if (pendingCompilerTails.get(revealId)?.trailingSource !== trailingSource) {
    pendingCompilerTails.set(revealId, {
      candidates: new Map(),
      trailingSource,
    })
  }
  if (!compilerTailObserver) {
    compilerTailObserver = new MutationObserver(flushCompilerTails)
    compilerTailObserver.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true,
    })
  }
  flushCompilerTails()
}

function resetCompilerTailTracking(): void {
  pendingCompilerTails.clear()
  completedCompilerTails = new WeakMap()
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
  for (const element of host.querySelectorAll<HTMLElement>("*")) {
    for (const attribute of [...element.attributes]) {
      if (
        !DYNAMIC_ID_ATTRIBUTES.has(attribute.name) ||
        !/^-1_\d+$/u.test(attribute.value)
      ) {
        continue
      }
      // LiaScript @uid identifies the authored item within this output. DOM
      // positions also count covers and SVGs and vary with runtime timing.
      element.setAttribute(
        attribute.name,
        `${section}_${stableNumericId(
          `${revealId}:${attribute.name}:${attribute.value}`,
        )}`,
      )
    }
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

function ownPayload(host: HTMLElement): HTMLElement | null {
  return host.querySelector<HTMLElement>(":scope > [data-loot-reveal-payload]")
}

function ensurePayload(host: HTMLElement): HTMLElement {
  const existing = ownPayload(host)
  if (existing) return existing
  // Inline rendering can finish before exploration registers its elements.
  // Dynamic output must remain gated throughout that interval.
  const payload = host.ownerDocument.createElement("div")
  payload.dataset.lootRevealPayload = "true"
  payload.hidden = true
  payload.inert = true
  payload.setAttribute("aria-hidden", "true")
  payload.append(
    ...[...host.childNodes].filter(
      (node) =>
        !(node instanceof Element && node.hasAttribute("data-loot-reveal-cover-slot")),
    ),
  )
  host.append(payload)
  return payload
}

function hasRenderedPayload(host: HTMLElement | null): boolean {
  return Boolean(
    host?.getAttribute(RENDERED_ATTRIBUTE) === "true" &&
      ownPayload(host)?.hasChildNodes(),
  )
}

function applyDeclaration(
  host: HTMLElement,
  kind: RevealContainerKind,
  declaration: CourseInlineRevealDeclaration,
): void {
  const options =
    `${kindToken(kind)}${declaration.options ? `; ${declaration.options}` : ""}`
  if (host.getAttribute("data-options") !== options) {
    host.setAttribute("data-options", options)
  }
}

function failInlineReveal(revealId: string, reason: string): void {
  const host = revealHost(revealId)
  if (host && !hasRenderedPayload(host)) {
    host.removeAttribute(RENDERED_ATTRIBUTE)
    host.setAttribute(ERROR_ATTRIBUTE, reason)
  }
  retireMarker(rendererMarker(revealId), RENDERER_ATTRIBUTE)
}

function observeDynamicOutput(
  revealId: string,
  kind: RevealContainerKind,
  declaration: CourseInlineRevealDeclaration,
): DynamicOutputObserver {
  const previous = dynamicOutputObservers.get(revealId)
  if (previous) return previous

  let moving = false
  let lastAdoptedHost: HTMLElement | null = null
  let lastAdoptedPayload: HTMLElement | null = null
  let entry: DynamicOutputObserver | undefined
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
          const host = revealHost(revealId)
          if (
            host === lastAdoptedHost &&
            hasRenderedPayload(host) &&
            !rendererMarker(revealId)
          ) dispose()
        })
      })
    }, OUTPUT_STABILITY_DELAY)
  }
  const move = (): boolean => {
    if (
      moving ||
      !entry ||
      dynamicOutputObservers.get(revealId) !== entry
    ) return false
    const host = revealHost(revealId)
    if (!host) return false
    const renderer = rendererMarker(revealId)
    const output = renderer?.querySelector<HTMLElement>("output") ?? null
    const detachedPayload =
      lastAdoptedHost &&
      !lastAdoptedHost.isConnected &&
      host !== lastAdoptedHost &&
      !hasRenderedPayload(host)
        ? lastAdoptedPayload
        : null
    const content = output?.hasChildNodes()
      ? output
      : detachedPayload?.hasChildNodes()
        ? detachedPayload
        : null
    if (!content) return false

    moving = true
    try {
      applyDeclaration(host, kind, declaration)
      const payload = ensurePayload(host)
      payload.replaceChildren(...content.childNodes)
      retireMarker(renderer, RENDERER_ATTRIBUTE)
      // "Rendered" means adopted output, never merely a request in flight.
      host.setAttribute(RENDERED_ATTRIBUTE, "true")
      host.removeAttribute(ERROR_ATTRIBUTE)
      const section = sectionFromLootId(revealId)
      if (section !== null) observeDynamicIds(host, revealId, section)
      lastAdoptedHost = host
      lastAdoptedPayload = payload
      scheduleDisposal()
      return true
    } finally {
      moving = false
    }
  }

  const observer = new MutationObserver(() => { move() })
  observer.observe(document.body, {
    characterData: true,
    childList: true,
    subtree: true,
  })
  const interval = window.setInterval(move, 20)
  const timeout = window.setTimeout(() => {
    if (!entry || dynamicOutputObservers.get(revealId) !== entry) return
    move()
    const outputStable = hasRenderedPayload(revealHost(revealId))
    dispose()
    if (!outputStable) failInlineReveal(revealId, "output")
  }, OUTPUT_TIMEOUT)
  entry = {
    interval,
    observer,
    requestedRenderers: new WeakSet(),
    settleTimeout: null,
    timeout,
  }
  dynamicOutputObservers.set(revealId, entry)
  move()
  return entry
}

async function courseInlineDeclarations(): Promise<
  CourseInlineRevealDeclaration[]
> {
  if (declarations) return declarations
  if (declarationsPromise) return declarationsPromise

  const generation = declarationGeneration
  const pending = discoverCourseInlineRevealDeclarations()
    .then((discovered) => {
      if (
        generation === declarationGeneration &&
        declarations === null &&
        discovered.length > 0
      ) declarations = discovered
      return generation === declarationGeneration
        ? declarations ?? discovered
        : discovered
    })
    .finally(() => {
      if (declarationsPromise === pending) declarationsPromise = null
    })
  declarationsPromise = pending
  return pending
}

function stop(send: LiaScriptDynamicSend): void {
  send.lia("LIA: stop")
}

function currentRequest(revealId: string, request: RenderRequest): boolean {
  return (
    request.generation === declarationGeneration &&
    renderRequests.get(revealId) === request
  )
}

async function renderInlineReveal(
  revealId: string,
  request: RenderRequest,
): Promise<void> {
  let sourceTimeout: number | undefined
  let source: CourseInlineRevealDeclaration[]
  try {
    source = await Promise.race([
      courseInlineDeclarations(),
      new Promise<never>((_, reject) => {
        sourceTimeout = window.setTimeout(
          () => reject(new Error("Inline reveal source timeout")),
          SOURCE_TIMEOUT,
        )
      }),
    ])
  } catch {
    if (currentRequest(revealId, request)) failInlineReveal(revealId, "source")
    return
  } finally {
    window.clearTimeout(sourceTimeout)
  }
  if (!currentRequest(revealId, request)) return
  if (source.length === 0) {
    failInlineReveal(revealId, "source")
    return
  }

  const deadline = Date.now() + OUTPUT_TIMEOUT
  while (currentRequest(revealId, request)) {
    // In particular, do not retain the host from before source resolution.
    const host = revealHost(revealId)
    const declaration = host
      ? declarationForHost(host, request.kind, source)
      : null
    if (host && declaration) {
      applyDeclaration(host, request.kind, declaration)
      cleanCompilerTail(revealId, declaration.trailingSource)
      if (!declaration.deferred || hasRenderedPayload(host)) {
        host.removeAttribute(ERROR_ATTRIBUTE)
        retireMarker(rendererMarker(revealId), RENDERER_ATTRIBUTE)
        return
      }
      const renderer = rendererForRequest(revealId)
      if (renderer) {
        const output = observeDynamicOutput(revealId, request.kind, declaration)
        if (
          !hasRenderedPayload(revealHost(revealId)) &&
          !output.requestedRenderers.has(renderer)
        ) {
          output.requestedRenderers.add(renderer)
          request.send.liascript(declaration.content)
        }
        return
      }
    }
    if (Date.now() >= deadline) {
      failInlineReveal(revealId, host ? "declaration-or-renderer" : "host")
      return
    }
    await new Promise<void>((resolve) =>
      window.setTimeout(resolve, HOST_RETRY_DELAY),
    )
  }
}

function installSourceListener(): void {
  if (sourceListenerInstalled) return
  sourceListenerInstalled = true
  onCourseMarkdownChange((markdown) => {
    declarationGeneration += 1
    declarationBindings.clear()
    renderRequests.clear()
    knownKinds.clear()
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
    render(revealId, authoredKind, send) {
      const kind = normalizedKind(authoredKind)
      if (!kind) {
        stop(send)
        return
      }
      knownKinds.set(revealId, kind)
      const previous = renderRequests.get(revealId)
      if (previous && previous.generation === declarationGeneration) {
        // A replacement script supplies the live output channel while the
        // shared source lookup is pending. Emit once through the latest one.
        if (previous.kind !== kind || previous.send === send) {
          if (previous.send !== send) stop(send)
          return
        }
        stop(previous.send)
        previous.send = send
        return
      }
      const request: RenderRequest = {
        generation: declarationGeneration,
        kind,
        send,
      }
      renderRequests.set(revealId, request)
      void renderInlineReveal(revealId, request)
        .catch(() => {
          if (currentRequest(revealId, request)) {
            failInlineReveal(revealId, "render")
          }
        })
        .finally(() => {
          if (renderRequests.get(revealId) === request) {
            renderRequests.delete(revealId)
          }
          stop(request.send)
        })
    },
  }
}
