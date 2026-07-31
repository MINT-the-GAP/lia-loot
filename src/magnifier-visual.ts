const SVG_NS = "http://www.w3.org/2000/svg"

export function createMagnifierGraphic(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 56 56")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-magnifier-graphic")
  svg.innerHTML = `
    <rect class="loot-magnifier-shadow" x="8" y="46" width="42" height="6"/>
    <path class="loot-magnifier-outline" d="M10 2h20v4h8v8h4v20h-4v6h-8v4H10v-4H4v-6H0V14h4V8h6V2Z"/>
    <path class="loot-magnifier-glass" d="M14 10h12v4h4v16h-4v4H14v-4h-4V14h4v-4Z"/>
    <rect class="loot-magnifier-glint" x="14" y="12" width="8" height="4"/>
    <rect class="loot-magnifier-glint" x="12" y="16" width="4" height="8"/>
    <path class="loot-magnifier-outline" d="M30 34h8v4h4v4h4v4h4v10H38v-4h-4v-4h-4v-4h-4V36h4v-2Z"/>
    <path class="loot-magnifier-handle" d="M32 40h4v4h4v4h4v4h-4v-4h-4v-4h-4v-4Z"/>
    <rect class="loot-magnifier-handle-light" x="32" y="38" width="4" height="6"/>
  `
  return svg
}
