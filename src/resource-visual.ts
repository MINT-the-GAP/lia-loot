export type ResourceVisualKind = "coins" | "gems" | "energy"

const SVG_NS = "http://www.w3.org/2000/svg"

export function createResourceGraphic(
  kind: ResourceVisualKind,
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 32 32")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-resource-icon", `loot-resource-icon--${kind}`)
  svg.innerHTML =
    kind === "coins"
      ? `<ellipse cx="16" cy="8" rx="10" ry="5"/><path d="M6 8v6c0 2.8 4.5 5 10 5s10-2.2 10-5V8"/><path d="M6 14v6c0 2.8 4.5 5 10 5s10-2.2 10-5v-6"/>`
      : kind === "gems"
        ? `<path d="M8 5h16l5 7-13 15L3 12l5-7Z"/><path d="m3 12 8-2 5 17 5-17 8 2M8 5l3 5 5-5 5 5 3-5"/>`
        : `<path d="M19 2 7 18h8l-2 12 12-18h-8l2-10Z"/>`
  return svg
}
