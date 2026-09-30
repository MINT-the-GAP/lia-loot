const SVG_NS = "http://www.w3.org/2000/svg"

export function createCatFoodGraphic(
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.classList.add("loot-cat-food-graphic")
  svg.setAttribute("viewBox", "0 0 88 72")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.innerHTML = `
    <rect class="loot-cat-food-shadow" x="10" y="61" width="68" height="6"/>
    <g class="loot-cat-food-fish">
      <path class="loot-cat-food-outline" d="M18 18h8v-5h29v4h9v5h8v8h-8v5h-9v4H26v-5h-8l-8 7V12Z"/>
      <path class="loot-cat-food-fish-body" d="M22 21h8v-4h22v4h9v4h6v3h-6v4h-9v3H30v-4h-8l-7 5V18Z"/>
      <path class="loot-cat-food-fish-light" d="M30 18h19v4H30Z"/>
      <rect class="loot-cat-food-fish-eye" x="53" y="22" width="4" height="4"/>
    </g>
    <g class="loot-cat-food-bowl">
      <path class="loot-cat-food-outline" d="M9 35h70v14h-6v11h-8v6H23v-6h-8V49H9Z"/>
      <path class="loot-cat-food-bowl-dark" d="M14 40h60v7h-5v10h-7v5H26v-5h-7V47h-5Z"/>
      <path class="loot-cat-food-bowl-main" d="M19 47h50v9h-8v5H27v-5h-8Z"/>
      <path class="loot-cat-food-bowl-light" d="M17 40h54v5H17Z"/>
      <path class="loot-cat-food-pellet" d="M23 34h8v6h-8Zm12-4h8v10h-8Zm12 3h8v7h-8Zm12-5h8v12h-8Z"/>
      <path class="loot-cat-food-label" d="M37 50h14v4h4v4H33v-4h4Z"/>
    </g>
  `
  return svg
}
