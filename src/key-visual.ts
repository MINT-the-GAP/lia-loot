import type { KeyColor } from "./key-colors"

const SVG_NS = "http://www.w3.org/2000/svg"

export function createKeyGraphic(color: KeyColor): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 48 32")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-key-graphic", `loot-key-color--${color}`)
  svg.innerHTML = `
    <rect class="loot-key-shadow" x="4" y="28" width="40" height="3"/>
    <rect class="loot-key-outline" x="4" y="4" width="20" height="20"/>
    <rect class="loot-key-outline" x="20" y="10" width="24" height="12"/>
    <rect class="loot-key-outline" x="32" y="18" width="4" height="8"/>
    <rect class="loot-key-outline" x="40" y="18" width="4" height="8"/>
    <rect class="loot-key-main" x="8" y="8" width="12" height="12"/>
    <rect class="loot-key-main" x="20" y="14" width="20" height="4"/>
    <rect class="loot-key-main" x="32" y="18" width="4" height="4"/>
    <rect class="loot-key-main" x="40" y="18" width="4" height="4"/>
    <rect class="loot-key-light" x="8" y="8" width="12" height="4"/>
    <rect class="loot-key-light" x="20" y="14" width="16" height="2"/>
    <rect class="loot-key-hole" x="12" y="12" width="4" height="4"/>
  `
  return svg
}
