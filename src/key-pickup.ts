import {
  isKeyColorRequest,
  KEY_COLOR_DETAILS,
  requestedKeyColor,
  resolveKeyAppearance,
} from "./key-colors.ts"
import {
  discoverCourseKeyDeclarations,
  type CourseKeyDeclaration,
} from "./course-chests.ts"
import { createKeyGraphic } from "./key-visual.ts"
import type { KeyColor } from "./key-colors.ts"
import {
  CollectibleVisibilityGate,
  collectibleVisibilitySignature,
  parseCollectibleOptions,
  type CollectibleVisibilityRule,
} from "./collectible-visibility.ts"
import {
  extractConcealmentOptions,
  setHostConcealment,
  type ConcealmentMode,
} from "./concealment.ts"
import {
  observeLiaSlideActivity,
  sectionFromLootId,
  sourceSlideIsActive,
} from "./slide-activity.ts"
import {
  resolveSurfaceTarget,
  surfaceTargetElement,
  surfaceTargetIsGrouped,
  type SurfaceTarget,
} from "./surface-targets.ts"

const KEY_TAG = "lia-loot-key"
const KEY_PLACEMENT_ATTRIBUTE = "data-loot-key-placement"
const KEY_TRAY_ATTRIBUTE = "data-loot-key-tray"
const COLLECT_DURATION = 650

interface KeyPickupController {
  collected(keyId: string): boolean
  collect(keyId: string, color: KeyColor): boolean
  focusInventory(): void
}

interface KeyRequest {
  baseId: string
  concealment: ConcealmentMode | null
  errors: string[]
  inline: boolean
  placement: SurfaceTarget | null
  requestedColor: string | null
  sourceHost: HTMLElement
  sourceSection: number | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

interface SurfaceKeyRequest {
  baseId: string
  concealment: ConcealmentMode | null
  placement: SurfaceTarget
  requestedColor: string | null
  sourceHost?: HTMLElement
  sourceSection: number | null
  visibility: CollectibleVisibilityRule
}

export interface ParsedKeyPickupOptions {
  concealment: ConcealmentMode | null
  errors: string[]
  inline: boolean
  placement: SurfaceTarget | null
  requestedColor: string | null
  valid: boolean
  visibility: CollectibleVisibilityRule
}

let controller: KeyPickupController | null = null
let runtimeId = 0
const collectingIds = new Set<string>()
const eligibleKeyIds = new Set<string>()
const warnedInvalidSpecs = new Set<string>()
const visibilityGate = new CollectibleVisibilityGate()
const surfaceRequests = new Map<string, SurfaceKeyRequest>()
const pendingSurfaceRequests = new Map<string, SurfaceKeyRequest>()
const sourceRequestIds = new Set<string>()
const sourceSignatureCounts = new Map<string, number>()
const matchedSourceHosts = new Map<string, string>()
let sourceDiscovery: "idle" | "pending" | "complete" = "idle"
let documentObserver: MutationObserver | null = null
let syncTimer: number | null = null
let slideActivityInstalled = false

function resolveBaseId(host: HTMLElement): string {
  const authoredId = host.getAttribute("data-key-id")?.trim()
  if (authoredId && !authoredId.startsWith("@")) return authoredId

  const existingId = host.dataset.lootKeyRuntimeId
  if (existingId) return existingId

  runtimeId += 1
  const generatedId = `runtime-${runtimeId}`
  host.dataset.lootKeyRuntimeId = generatedId
  return generatedId
}

function inlineKeyId(baseId: string): string {
  return `key:${baseId}:inline`
}

export function surfaceKeyInstanceId(
  baseId: string,
  placement: SurfaceTarget,
): string {
  return `key:${baseId}:${placement}`
}

function createRewardBadge(): HTMLSpanElement {
  const reward = document.createElement("span")
  reward.className = "loot-key-pickup__reward"
  reward.setAttribute("aria-hidden", "true")
  reward.textContent = "+1"
  return reward
}

function createKeyButton(
  keyId: string,
  color: KeyColor,
): HTMLButtonElement {
  const button = document.createElement("button")
  button.type = "button"
  button.className = `loot-key-pickup loot-key-color--${color}`
  button.dataset.lootKeyButton = keyId
  button.dataset.lootKeyColor = color
  button.setAttribute(
    "aria-label",
    `${KEY_COLOR_DETAILS[color].pickupLabel} einsammeln`,
  )
  button.append(createKeyGraphic(color), createRewardBadge())

  button.addEventListener("click", (event) => {
    if (
      !controller ||
      collectingIds.has(keyId) ||
      !eligibleKeyIds.has(keyId)
    ) {
      return
    }
    collectingIds.add(keyId)

    if (!controller.collect(keyId, color)) {
      collectingIds.delete(keyId)
      syncAllKeys()
      return
    }

    const keyboardActivated = event.detail === 0
    button.disabled = true
    button.classList.add("loot-key-pickup--collected")
    button.setAttribute("aria-label", KEY_COLOR_DETAILS[color].foundMessage)

    window.setTimeout(() => {
      collectingIds.delete(keyId)
      button.remove()
      syncAllKeys()
      if (keyboardActivated) controller?.focusInventory()
    }, COLLECT_DURATION)
  })

  return button
}

export function parseKeyPickupOptions(
  rawSpecification: string,
): ParsedKeyPickupOptions {
  const parsed = parseCollectibleOptions(
    rawSpecification.trim() === "@0" ? "" : rawSpecification,
  )
  const concealment = extractConcealmentOptions(parsed.values)
  const errors = [...parsed.errors, ...concealment.errors]
  let placement: SurfaceTarget | null = null
  let requestedColor: string | null = null

  for (const value of concealment.values) {
    const target = resolveSurfaceTarget(value)
    if (target) {
      if (placement) {
        errors.push("Für einen Schlüssel darf höchstens ein Oberflächenziel angegeben werden.")
      } else {
        placement = target
      }
      continue
    }

    if (isKeyColorRequest(value)) {
      if (requestedColor !== null) {
        errors.push("Für einen Schlüssel darf höchstens eine Farbe angegeben werden.")
      } else {
        requestedColor = value
      }
      continue
    }

    errors.push(`Unbekannte Schlüsselfarbe, Zielangabe oder Option: ${value}`)
  }

  return {
    concealment: concealment.mode,
    errors,
    inline: placement === null,
    placement,
    requestedColor,
    valid: errors.length === 0,
    visibility: parsed.rule,
  }
}

function readKeyRequest(host: HTMLElement): KeyRequest {
  const baseId = resolveBaseId(host)
  const authored = host.getAttribute("data-color")?.trim() ?? ""
  return {
    ...parseKeyPickupOptions(authored),
    baseId,
    sourceHost: host,
    sourceSection: sectionFromLootId(baseId),
  }
}

function clearKeyHost(host: HTMLElement): void {
  setHostConcealment(host, null)
  if (host.childNodes.length > 0) host.replaceChildren()
}

function warnInvalidSpecification(
  keyId: string,
  errors: readonly string[],
): void {
  if (warnedInvalidSpecs.has(keyId)) return
  warnedInvalidSpecs.add(keyId)
  console.warn(
    `Loot: Schlüssel ${keyId} bleibt wegen ungültiger Optionen verborgen. ${errors.join(" ")}`,
  )
}

function normalizedRequestedColor(requested: string | null): string {
  return requestedKeyColor(requested) ?? "auto"
}

function surfaceRequestSignature(request: SurfaceKeyRequest): string {
  return [
    normalizedRequestedColor(request.requestedColor),
    request.placement,
    collectibleVisibilitySignature(request.visibility),
    request.concealment ?? "none",
  ].join(":")
}

function sourceMatchKey(
  section: number,
  request: SurfaceKeyRequest,
): string {
  return `${section}:${surfaceRequestSignature(request)}`
}

function matchedCount(
  matches: ReadonlyMap<string, string>,
  signature: string,
): number {
  let count = 0
  for (const matchedSignature of matches.values()) {
    if (matchedSignature === signature) count += 1
  }
  return count
}

export function pruneStaleKeySourceMatches(
  matches: Map<string, string>,
  connectedBaseIds: ReadonlySet<string>,
): void {
  for (const baseId of matches.keys()) {
    if (!connectedBaseIds.has(baseId)) matches.delete(baseId)
  }
}

export function sourceCatalogCoversKeyHost(
  matches: Map<string, string>,
  baseId: string,
  signature: string | null,
  sourceCount: number,
): boolean {
  const previousSignature = matches.get(baseId)
  if (signature !== null && sourceCount > 0 && previousSignature === signature) {
    return true
  }
  if (previousSignature) matches.delete(baseId)
  if (signature === null || sourceCount <= 0) return false
  if (matchedCount(matches, signature) < sourceCount) {
    matches.set(baseId, signature)
  }
  return true
}

function asSurfaceRequest(request: KeyRequest): SurfaceKeyRequest {
  return {
    baseId: request.baseId,
    concealment: request.concealment,
    placement: request.placement!,
    requestedColor: request.requestedColor,
    sourceHost: request.sourceHost,
    sourceSection: request.sourceSection,
    visibility: request.visibility,
  }
}

function registerDomSurfaceRequest(
  baseId: string,
  request: SurfaceKeyRequest,
): void {
  const section = request.sourceSection
  const matchKey = section === null ? null : sourceMatchKey(section, request)
  const sourceCount =
    matchKey === null ? 0 : sourceSignatureCounts.get(matchKey) ?? 0
  if (
    sourceCatalogCoversKeyHost(
      matchedSourceHosts,
      baseId,
      matchKey,
      sourceCount,
    )
  ) {
    surfaceRequests.delete(baseId)
    return
  }
  surfaceRequests.set(baseId, request)
}

function registerSourceDeclarations(
  declarations: readonly CourseKeyDeclaration[],
): void {
  for (const requestId of sourceRequestIds) surfaceRequests.delete(requestId)
  sourceRequestIds.clear()
  sourceSignatureCounts.clear()
  matchedSourceHosts.clear()

  for (const declaration of declarations) {
    const parsed = parseKeyPickupOptions(declaration.options)
    if (!parsed.valid) {
      warnInvalidSpecification(declaration.baseId, parsed.errors)
      continue
    }
    if (parsed.inline || !parsed.placement) continue

    const request: SurfaceKeyRequest = {
      baseId: declaration.baseId,
      concealment: parsed.concealment,
      placement: parsed.placement,
      requestedColor: parsed.requestedColor,
      sourceSection: declaration.section,
      visibility: parsed.visibility,
    }
    surfaceRequests.set(declaration.baseId, request)
    sourceRequestIds.add(declaration.baseId)
    const signature = sourceMatchKey(declaration.section, request)
    sourceSignatureCounts.set(
      signature,
      (sourceSignatureCounts.get(signature) ?? 0) + 1,
    )
  }

  sourceDiscovery = "complete"
  for (const [baseId, request] of pendingSurfaceRequests) {
    registerDomSurfaceRequest(baseId, request)
  }
  pendingSurfaceRequests.clear()
  scheduleSync()
}

function discoverSourceKeys(): void {
  if (sourceDiscovery !== "idle") return
  sourceDiscovery = "pending"
  void discoverCourseKeyDeclarations()
    .then(registerSourceDeclarations)
    .catch(() => registerSourceDeclarations([]))
}

function restoreInlineHost(host: HTMLElement): void {
  const wasSurfaceSource = host.classList.contains(
    "loot-key-host--surface-source",
  )
  host.classList.remove("loot-key-host--surface-source")
  if (wasSurfaceSource) {
    setHostConcealment(host, null)
    host.removeAttribute("aria-hidden")
  }
}

function hideSurfaceSourceHost(host: HTMLElement): void {
  setHostConcealment(host, null)
  host.classList.add("loot-key-host--surface-source")
  host.setAttribute("aria-hidden", "true")
  if (host.childNodes.length > 0) host.replaceChildren()
}

function registerHost(host: HTMLElement): KeyRequest {
  const request = readKeyRequest(host)
  if (!request.valid) {
    pendingSurfaceRequests.delete(request.baseId)
    surfaceRequests.delete(request.baseId)
    matchedSourceHosts.delete(request.baseId)
    restoreInlineHost(host)
    warnInvalidSpecification(request.baseId, request.errors)
    clearKeyHost(host)
    return request
  }

  if (request.inline || !request.placement) {
    pendingSurfaceRequests.delete(request.baseId)
    surfaceRequests.delete(request.baseId)
    matchedSourceHosts.delete(request.baseId)
    restoreInlineHost(host)
    return request
  }

  const surfaceRequest = asSurfaceRequest(request)
  if (sourceDiscovery === "complete") {
    registerDomSurfaceRequest(request.baseId, surfaceRequest)
  } else {
    pendingSurfaceRequests.set(request.baseId, surfaceRequest)
  }
  hideSurfaceSourceHost(host)
  return request
}

function buttonIn(
  container: ParentNode,
  keyId: string,
  color: KeyColor,
): HTMLButtonElement | null {
  return (
    [...container.querySelectorAll<HTMLButtonElement>("[data-loot-key-button]")]
      .find(
        (button) =>
          button.dataset.lootKeyButton === keyId &&
          button.dataset.lootKeyColor === color,
      ) ?? null
  )
}

interface SurfacePlacementLike {
  dataset: {
    lootKeyPlacement?: string
  }
}

export function splitSurfaceKeyPlacements<T extends SurfacePlacementLike>(
  candidates: readonly T[],
  keyId: string,
): { duplicates: T[]; primary: T | null } {
  const matches = candidates.filter(
    (candidate) => candidate.dataset.lootKeyPlacement === keyId,
  )
  return {
    duplicates: matches.slice(1),
    primary: matches[0] ?? null,
  }
}

function allSurfacePlacements(): HTMLElement[] {
  return [
    ...document.querySelectorAll<HTMLElement>(
      `[${KEY_PLACEMENT_ATTRIBUTE}]`,
    ),
  ]
}

function removeEmptyKeyTray(candidate: HTMLElement | null): void {
  if (
    candidate?.hasAttribute(KEY_TRAY_ATTRIBUTE) &&
    !candidate.querySelector(`[${KEY_PLACEMENT_ATTRIBUTE}]`)
  ) {
    candidate.remove()
  }
}

function removeSurfacePlacement(
  placement: HTMLElement | null | undefined,
): void {
  if (!placement) return
  const tray = placement.parentElement
  placement.remove()
  removeEmptyKeyTray(tray)
}

function removeSurfacePlacements(keyId: string): void {
  const { duplicates, primary } = splitSurfaceKeyPlacements(
    allSurfacePlacements(),
    keyId,
  )
  removeSurfacePlacement(primary)
  duplicates.forEach(removeSurfacePlacement)
}

function ensureKeyTray(
  container: HTMLElement,
  placement: SurfaceTarget,
): HTMLElement {
  const existing = container.querySelector<HTMLElement>(
    `:scope > [${KEY_TRAY_ATTRIBUTE}="${placement}"]`,
  )
  if (existing) return existing

  const listTarget = container.matches("ul, ol")
  const tray = document.createElement(listTarget ? "li" : "div")
  tray.className = "loot-key-tray"
  tray.dataset.lootKeyTray = placement
  tray.setAttribute("role", "group")
  tray.setAttribute("aria-label", "Sammelbare Schlüssel")
  container.appendChild(tray)
  return tray
}

function ensureSurfaceKey(
  keyId: string,
  request: SurfaceKeyRequest,
): void {
  const destination = surfaceTargetElement(request.placement, document)
  const partition = splitSurfaceKeyPlacements(allSurfacePlacements(), keyId)
  let wrapper = partition.primary as HTMLElement | null
  partition.duplicates.forEach((duplicate) =>
    removeSurfacePlacement(duplicate as HTMLElement),
  )
  if (!destination) {
    removeSurfacePlacement(wrapper)
    return
  }

  const mount = surfaceTargetIsGrouped(request.placement)
    ? ensureKeyTray(destination, request.placement)
    : destination
  const { color } = resolveKeyAppearance(keyId, request.requestedColor)
  if (!wrapper) {
    const listTarget = mount.matches("ul, ol")
    wrapper = document.createElement(listTarget ? "li" : "div")
    wrapper.className =
      `loot-key-placement loot-key-placement--${request.placement}`
    wrapper.dataset.lootKeyPlacement = keyId
    wrapper.dataset.lootKeyLocation = request.placement
    if (listTarget) wrapper.setAttribute("role", "none")
    wrapper.append(createKeyButton(keyId, color))
  } else if (!buttonIn(wrapper, keyId, color)) {
    setHostConcealment(wrapper, null)
    wrapper.replaceChildren(createKeyButton(keyId, color))
  }

  if (wrapper.parentElement !== mount) {
    const previousParent = wrapper.parentElement
    mount.appendChild(wrapper)
    removeEmptyKeyTray(previousParent)
  }
  setHostConcealment(wrapper, request.concealment)
}

function syncInlineKey(
  host: HTMLElement,
  keyId: string,
  request: KeyRequest,
): void {
  if (!controller) return
  if (controller.collected(keyId) && !collectingIds.has(keyId)) {
    eligibleKeyIds.delete(keyId)
    visibilityGate.forget(`pickup:${keyId}`)
    clearKeyHost(host)
    return
  }

  const { color } = resolveKeyAppearance(keyId, request.requestedColor)
  if (collectingIds.has(keyId)) return

  const visible = visibilityGate.visible(
    `pickup:${keyId}`,
    request.visibility,
    sourceSlideIsActive(request.sourceSection, host),
    scheduleSync,
  )
  if (!visible) {
    eligibleKeyIds.delete(keyId)
    clearKeyHost(host)
    return
  }
  eligibleKeyIds.add(keyId)

  if (buttonIn(host, keyId, color)) {
    setHostConcealment(host, request.concealment)
    return
  }
  setHostConcealment(host, null)
  host.replaceChildren(createKeyButton(keyId, color))
  setHostConcealment(host, request.concealment)
}

function syncSurfaceKeys(): void {
  if (!controller) return
  const activeIds = new Set<string>()

  for (const request of surfaceRequests.values()) {
    const keyId = surfaceKeyInstanceId(request.baseId, request.placement)
    const collecting = collectingIds.has(keyId)
    if (controller.collected(keyId) && !collecting) {
      eligibleKeyIds.delete(keyId)
      visibilityGate.forget(`pickup:${keyId}`)
      removeSurfacePlacements(keyId)
      continue
    }

    const visible = visibilityGate.visible(
      `pickup:${keyId}`,
      request.visibility,
      sourceSlideIsActive(request.sourceSection, request.sourceHost),
      scheduleSync,
    )
    if (!visible && !collecting) {
      eligibleKeyIds.delete(keyId)
      removeSurfacePlacements(keyId)
      continue
    }

    activeIds.add(keyId)
    if (visible && !collecting) eligibleKeyIds.add(keyId)
    else eligibleKeyIds.delete(keyId)
    if (!collecting) ensureSurfaceKey(keyId, request)
  }

  for (const placement of allSurfacePlacements()) {
    const keyId = placement.dataset.lootKeyPlacement
    if (!keyId || (!activeIds.has(keyId) && !collectingIds.has(keyId))) {
      removeSurfacePlacement(placement)
    }
  }
}

function syncAllKeys(): void {
  if (!controller) return
  eligibleKeyIds.clear()
  const hosts = [...document.querySelectorAll<HTMLElement>(KEY_TAG)]
  pruneStaleKeySourceMatches(
    matchedSourceHosts,
    new Set(hosts.map(resolveBaseId)),
  )
  const inlineGroups = new Map<
    string,
    { host: HTMLElement; request: KeyRequest }[]
  >()

  for (const host of hosts) {
    const request = registerHost(host)
    if (!request.valid || !request.inline) continue
    const keyId = inlineKeyId(request.baseId)
    const group = inlineGroups.get(keyId) ?? []
    group.push({ host, request })
    inlineGroups.set(keyId, group)
  }

  for (const [keyId, candidates] of inlineGroups) {
    const preferred =
      candidates.find(({ host, request }) =>
        sourceSlideIsActive(request.sourceSection, host),
      ) ?? candidates[0]
    for (const candidate of candidates) {
      if (candidate !== preferred) clearKeyHost(candidate.host)
    }
    syncInlineKey(preferred.host, keyId, preferred.request)
  }
  syncSurfaceKeys()
  discardObservedKeyWrites(documentObserver)
}

function scheduleSync(): void {
  if (syncTimer !== null) return
  syncTimer = window.setTimeout(() => {
    syncTimer = null
    syncAllKeys()
  }, 0)
}

type KeyMutationObserver = Pick<MutationObserver, "takeRecords">

export function discardObservedKeyWrites(
  observer: KeyMutationObserver | null,
): void {
  observer?.takeRecords()
}

export function keyMutationBatchNeedsSync(
  mutations: readonly MutationRecord[],
): boolean {
  return mutations.length > 0
}

function observedDocumentMutations(mutations: MutationRecord[]): void {
  if (keyMutationBatchNeedsSync(mutations)) scheduleSync()
}

class LootKeyElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-key-id", "data-color"]
  }

  connectedCallback(): void {
    registerHost(this)
    scheduleSync()
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return
    registerHost(this)
    scheduleSync()
  }
}

export function installKeyPickups(nextController: KeyPickupController): void {
  controller = nextController
  discoverSourceKeys()
  if (!slideActivityInstalled) {
    slideActivityInstalled = true
    observeLiaSlideActivity(scheduleSync)
  }
  if (!customElements.get(KEY_TAG)) {
    customElements.define(KEY_TAG, LootKeyElement)
  }
  if (!documentObserver) {
    documentObserver = new MutationObserver(observedDocumentMutations)
    documentObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  }
  syncAllKeys()
}
