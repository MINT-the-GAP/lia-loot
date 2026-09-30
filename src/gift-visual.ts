const SVG_NS = "http://www.w3.org/2000/svg"

export function createGiftGraphic(
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.classList.add("loot-gift-graphic")
  svg.setAttribute("viewBox", "0 0 96 82")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.innerHTML = `
    <rect class="loot-gift-shadow" x="12" y="73" width="72" height="6"/>
    <g class="loot-gift-box">
      <path class="loot-gift-outline" d="M14 35h68v40H14Z"/>
      <path class="loot-gift-paper" d="M19 40h58v30H19Z"/>
      <path class="loot-gift-paper-dark" d="M68 40h9v30H62V55h6Z"/>
      <path class="loot-gift-ribbon" d="M42 40h13v30H42Z"/>
      <path class="loot-gift-ribbon-light" d="M46 40h5v30h-5Z"/>
    </g>
    <g class="loot-gift-lid">
      <path class="loot-gift-outline" d="M10 27h76v17H10Z"/>
      <path class="loot-gift-paper-light" d="M15 31h66v8H15Z"/>
      <path class="loot-gift-paper" d="M15 39h66v1H15Z"/>
      <path class="loot-gift-ribbon" d="M41 31h15v9H41Z"/>
      <path class="loot-gift-ribbon-light" d="M46 31h5v9h-5Z"/>
    </g>
    <g class="loot-gift-bow">
      <path class="loot-gift-outline" d="M18 8h18v4h7v8h4v11H31v-4H20v-5h-6V12h4ZM78 8H60v4h-7v8h-4v11h16v-4h11v-5h6V12h-4Z"/>
      <path class="loot-gift-ribbon" d="M20 12h14v4h6v10H30v-4H20v-4h-3v-3h3ZM76 12H62v4h-6v10h10v-4h10v-4h3v-3h-3Z"/>
      <path class="loot-gift-ribbon-light" d="M24 15h9v4h5v3h-8v-3h-6ZM72 15h-9v4h-5v3h8v-3h6Z"/>
      <path class="loot-gift-outline" d="M38 19h21v15H38Z"/>
      <path class="loot-gift-ribbon" d="M43 23h11v7H43Z"/>
    </g>
    <path class="loot-gift-shine" d="M22 46h5v12h-5ZM29 43h4v5h-4Z"/>
  `
  return svg
}
