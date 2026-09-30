const SVG_NS = "http://www.w3.org/2000/svg"

export function createAtlasGraphic(
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 64 64")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-atlas-graphic")
  svg.innerHTML = `
    <path class="loot-atlas-shadow" d="M10 10h42v5h5v39h-5v4H10v-5H6V15h4v-5Z"/>
    <path class="loot-atlas-roll-dark" d="M12 6h40v5h5v10h-5v34H12v-4H7V13h5V6Z"/>
    <path class="loot-atlas-paper" d="M13 11h37v4h4v5h-4v31H14v-4h-4V16h4v-5Z"/>
    <path class="loot-atlas-paper-light" d="M16 14h31v4h4v2H47v25H16V14Z"/>
    <path class="loot-atlas-roll" d="M10 8h42v4h4v7h-4v3H10V8Zm2 39h42v3h3v7H12v-3H8v-4h4v-3Z"/>
    <path class="loot-atlas-roll-light" d="M14 10h35v3H14v-3Zm0 39h37v3H14v-3Z"/>
    <path class="loot-atlas-map-line" d="M19 25h6v-4h7v5h6v-3h7v5h-4v5h-6v6h-7v-4h-6v5h-4v-8h4v-4h-3v-3Z"/>
    <path class="loot-atlas-map-mark" d="M39 34h4v4h-4v-4Zm-17-11h3v3h-3v-3Z"/>
  `
  return svg
}
