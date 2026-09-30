const SVG_NS = "http://www.w3.org/2000/svg"

export function createFlashlightGraphic(
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 72 64")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add("loot-flashlight-graphic")
  svg.innerHTML = `
    <path class="loot-flashlight-shadow" d="M8 50h50v4H8z"/>
    <g class="loot-flashlight-object" transform="rotate(-14 36 32)">
      <path class="loot-flashlight-glow" d="M1 21h10v22H1l5-5V26l-5-5Z"/>
      <path class="loot-flashlight-outline" d="M5 15h25v5h32v3h6v18h-6v3H30v5H5V15Z"/>
      <path class="loot-flashlight-rim" d="M8 19h15v26H8V19Z"/>
      <path class="loot-flashlight-lens" d="M8 23h7v18H8V23Z"/>
      <path class="loot-flashlight-shine" d="M10 24h3v8h-3v-8Z"/>
      <path class="loot-flashlight-collar" d="M23 20h8v24h-8V20Z"/>
      <path class="loot-flashlight-body" d="M31 24h31v16H31V24Z"/>
      <path class="loot-flashlight-body-light" d="M34 26h22v4H34V26Z"/>
      <path class="loot-flashlight-grip" d="M35 34h23v4H35v-4Z"/>
      <path class="loot-flashlight-switch" d="M39 19h11v6H39V19Z"/>
      <path class="loot-flashlight-switch-light" d="M41 20h7v2h-7v-2Z"/>
      <path class="loot-flashlight-cap" d="M62 25h3v14h-3V25Z"/>
      <path class="loot-flashlight-bolt" d="M55 30h4v4h-4v-4Z"/>
    </g>
  `
  return svg
}
