const SVG_NS = "http://www.w3.org/2000/svg"

export type ExplorationToolVisualKind = "shovel" | "watering-can"
export type RevealCoverVisualKind = "soil" | "plant"
export type PlantVisualPhase = "seedling" | "bloomed"

function graphic(
  className: string,
  markup: string,
  ownerDocument: Document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", "0 0 64 64")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.classList.add(
    "loot-exploration-graphic",
    ...className.split(/\s+/u).filter(Boolean),
  )
  svg.innerHTML = markup
  return svg
}

export function createExplorationToolGraphic(
  kind: ExplorationToolVisualKind,
  ownerDocument: Document = document,
): SVGSVGElement {
  if (kind === "shovel") {
    return graphic(
      "loot-shovel-graphic",
      `
        <rect class="loot-exploration-shadow" x="7" y="54" width="50" height="5"/>
        <path class="loot-exploration-outline" d="M38 2h12v4h4v12h-4v4h-4v8h-4v8h-4v8h10v4h4v8H22v-8h4v-4h4v-8h4v-8h4v-8h-4v-4h-4V6h4V2h4Z"/>
        <path class="loot-shovel-handle" d="M38 6h8v4h4v4h-4v4h-8v-4h-4v-4h4V6Z"/>
        <path class="loot-shovel-shaft" d="M38 18h8v8h-4v8h-4v8h-8v-4h4v-8h4V18Z"/>
        <path class="loot-shovel-metal" d="M30 42h12v4h6v8H26v-8h4v-4Z"/>
        <path class="loot-shovel-light" d="M34 46h8v4h-12v-2h4v-2Z"/>
      `,
      ownerDocument,
    )
  }

  return graphic(
    "loot-watering-can-graphic",
    `
      <rect class="loot-exploration-shadow" x="5" y="53" width="54" height="5"/>
      <path class="loot-exploration-outline" d="M22 12h24v4h6v4h4v8h-4v4h-8v-4h4v-8h-6v-4H26v8h20v4h4v24h-4v4H14v-4h-4V32H4v-4h16v-4h2V12Zm-8 20v16h28V28H22v4h-8Z"/>
      <path class="loot-watering-can-body" d="M14 32h28v16H14V32Z"/>
      <path class="loot-watering-can-light" d="M18 34h12v4H18v-4Z"/>
      <path class="loot-watering-can-handle" d="M26 16h16v4h6v8h-4v-4h-4v-4H26v-4Z"/>
      <path class="loot-watering-can-spout" d="M4 32h10v8H8v-4H4v-4Zm0-8h10v4H4v-4Z"/>
      <rect class="loot-watering-can-water" x="2" y="18" width="4" height="4"/>
      <rect class="loot-watering-can-water" x="8" y="14" width="4" height="4"/>
      <rect class="loot-watering-can-water" x="14" y="18" width="4" height="4"/>
    `,
    ownerDocument,
  )
}

export function createRevealCoverGraphic(
  kind: RevealCoverVisualKind,
  plantPhase: PlantVisualPhase = "seedling",
  ownerDocument: Document = document,
): SVGSVGElement {
  if (kind === "soil") {
    return graphic(
      "loot-soil-graphic",
      `
        <rect class="loot-exploration-shadow" x="5" y="54" width="54" height="5"/>
        <path class="loot-exploration-outline" d="M16 34h6v-8h8v-6h12v6h8v8h6v6h4v16H4V40h4v-6h8Z"/>
        <path class="loot-soil-dark" d="M8 42h8v-8h10v-8h14v6h10v8h6v12H8V42Z"/>
        <path class="loot-soil-main" d="M12 40h10v-8h16v4h12v6h6v6H12v-8Z"/>
        <rect class="loot-soil-light" x="20" y="34" width="12" height="4"/>
        <rect class="loot-soil-light" x="38" y="40" width="8" height="4"/>
        <rect class="loot-soil-stone" x="14" y="46" width="7" height="4"/>
        <rect class="loot-soil-stone" x="46" y="48" width="6" height="4"/>
      `,
      ownerDocument,
    )
  }

  if (plantPhase === "bloomed") {
    return graphic(
      "loot-plant-graphic loot-plant-graphic--bloomed",
      `
        <rect class="loot-exploration-shadow" x="12" y="55" width="40" height="4"/>
        <path class="loot-exploration-outline" d="M28 6h8v4h8v8h6v10h-6v6h-8v20h12v5H16v-5h12V34h-8v-6h-6V18h6v-8h8V6Z"/>
        <path class="loot-flower-petal" d="M28 10h8v6h8v10h-8v8h-8v-8h-8V16h8v-6Z"/>
        <rect class="loot-flower-center" x="28" y="18" width="8" height="8"/>
        <rect class="loot-plant-stem" x="30" y="30" width="4" height="24"/>
        <path class="loot-plant-leaf" d="M18 36h12v10h-6v-4h-6v-6Zm16 4h12v6h-6v4h-6V40Z"/>
        <path class="loot-plant-pot-dark" d="M20 48h24v6h-4v5H24v-5h-4v-6Z"/>
        <rect class="loot-plant-pot" x="24" y="50" width="16" height="5"/>
      `,
      ownerDocument,
    )
  }

  return graphic(
    "loot-plant-graphic loot-plant-graphic--seedling",
    `
      <rect class="loot-exploration-shadow" x="12" y="55" width="40" height="4"/>
      <path class="loot-exploration-outline" d="M29 17h6v14h9v4h5v11H38v8h10v5H16v-5h10v-8H15V35h5v-4h9V17Z"/>
      <rect class="loot-plant-stem" x="30" y="25" width="4" height="29"/>
      <path class="loot-plant-leaf" d="M19 31h11v11h-5v-4h-6v-7Zm15 4h11v7h-6v4h-5V35Z"/>
      <path class="loot-plant-pot-dark" d="M20 46h24v8h-4v5H24v-5h-4v-8Z"/>
      <rect class="loot-plant-pot" x="24" y="49" width="16" height="6"/>
      <rect class="loot-plant-pot-light" x="26" y="49" width="8" height="3"/>
    `,
    ownerDocument,
  )
}
