import type { SlidePortalMode } from "./slide-portal-options.ts"

const SVG_NS = "http://www.w3.org/2000/svg"

export function createPortalGraphic(
  mode: SlidePortalMode,
  returning = false,
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 64 72")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-slide-portal__graphic")
  const arrows =
    mode === "one-way"
      ? '<path class="loot-slide-portal__arrow" d="M20 31h17v-7l11 12-11 12v-7H20V31Z"/>'
      : returning
        ? '<path class="loot-slide-portal__arrow" d="M46 27H29v-7L18 32l11 12v-7h17V27Zm-28 22h17v7l11-12-11-12v7H18v10Z"/>'
        : '<path class="loot-slide-portal__arrow" d="M18 27h17v-7l11 12-11 12v-7H18V27Zm28 22H29v7L18 44l11-12v7h17v10Z"/>'
  svg.innerHTML = `
    <rect class="loot-slide-portal__shadow" x="8" y="65" width="50" height="5"/>
    <path class="loot-slide-portal__outline" d="M8 66V28h4V18h6V12h8V8h16v4h8v6h6v10h4v38H48V31h-4v-7h-6v-4H26v4h-6v7h-4v35H8Z"/>
    <path class="loot-slide-portal__rim" d="M12 64V29h4V19h7v-5h22v5h7v10h4v35h-8V31h-4v-7h-6v-3H27v3h-7v7h-4v33h-4Z"/>
    <path class="loot-slide-portal__core" d="M17 64V33h4v-8h7v-3h10v3h6v8h4v31H17Z"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--one" x="24" y="27" width="4" height="4"/>
    <rect class="loot-slide-portal__spark loot-slide-portal__spark--two" x="40" y="48" width="4" height="4"/>
    ${arrows}
  `
  return svg
}
