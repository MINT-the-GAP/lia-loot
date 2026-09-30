const SVG_NS = "http://www.w3.org/2000/svg"

import {
  DEFAULT_CAT_VARIANT,
  type CatVariant,
} from "./cat-catalog.ts"
import type { CatCollarColor } from "./cat-collar.ts"

export function createCatGraphic(
  ownerDocument: Document = document,
  variant: CatVariant = DEFAULT_CAT_VARIANT,
  collar: CatCollarColor | null = null,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.classList.add("loot-cat-graphic")
  svg.dataset.catVariant = variant
  if (collar) svg.dataset.catCollar = collar
  svg.setAttribute("viewBox", "0 0 112 104")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.innerHTML = `
    <rect class="loot-cat-shadow" x="11" y="97" width="94" height="6"/>

    <g class="loot-cat-pose loot-cat-pose--sleeping">
      <g class="loot-cat-sleep-body">
        <path class="loot-cat-outline" d="M31 42h43v4h13v7h9v9h7v23h-7v8H83v5H28v-4H16v-7H9V68h7V56h7V48h8Z"/>
        <path class="loot-cat-fur" d="M35 47h36v4h12v7h8v8h7v15h-7v7H80v5H30v-4H20v-6h-6V71h7V59h7V52h7Z"/>
        <path class="loot-cat-fur-dark" d="M72 52h12v7h8v9h6v13h-7v7H79v5H57v-7h17v-5h8V69h-7v7H63V63h9Z"/>
        <path class="loot-cat-stripe" d="M79 57h9v6h-9ZM86 68h12v6H86ZM80 82h12v6H80Z"/>
      </g>

      <g class="loot-cat-head loot-cat-sleep-head">
        <path class="loot-cat-outline" d="M19 58h5V45h12l6 8h9l7-8h12v14h6v20h-7v7H57v6H29v-5H18v-6h-6V65h7Z"/>
        <path class="loot-cat-fur" d="M24 61h5V51h5l6 8h14l6-8h5v12h6v12h-6v6H54v6H31v-5H22v-5h-5v-8h7Z"/>
        <path class="loot-cat-ear" d="M30 51h5l5 8H30ZM60 51h5v10H54Z"/>
        <path class="loot-cat-fur-light" d="M22 69h20v-4h12v4h14v10h-8v6H31v-4h-9Z"/>
        <path class="loot-cat-sleep-eye" d="M29 66h11v3H29ZM50 66h11v3H50Z"/>
        <path class="loot-cat-nose" d="M42 70h8v5h-3v3h-3v-3h-2Z"/>
        <path class="loot-cat-mouth" d="M44 77h4v4h6v3H44v-3h-6v-3h6Z"/>
        <path class="loot-cat-whisker" d="M6 68h19v2H6ZM3 75h22v2H3ZM7 82h19v2H7ZM65 68h19v2H65ZM65 75h22v2H65ZM65 82h19v2H65Z"/>
        <rect class="loot-cat-collar" x="29" y="85" width="34" height="5"/>
      </g>
      <g class="loot-cat-sleep-paws">
        <path class="loot-cat-outline" d="M26 86h42v10H26Z"/>
        <path class="loot-cat-paw" d="M31 87h32v6H31Z"/>
        <path class="loot-cat-paw-detail" d="M41 87h3v6h-3ZM52 87h3v6h-3Z"/>
      </g>
    </g>

    <g class="loot-cat-pose loot-cat-pose--sitting">
      <g class="loot-cat-tail">
        <path class="loot-cat-outline" d="M74 58h12V47h9v5h8v8h5v26h-6v8H76V82h20v-5h5V62h-5v13h-9v8H74Z"/>
        <path class="loot-cat-fur-dark" d="M79 62h11V53h4v5h6v6h4v18h-6v7H80v-4h19v-6h5V63h-8v14h-7v7H79Z"/>
        <path class="loot-cat-stripe" d="M96 59h8v6h-8ZM96 71h8v6h-8ZM90 83h9v6h-9Z"/>
      </g>

      <g class="loot-cat-torso">
        <path class="loot-cat-outline loot-cat-body" d="M34 53h43v5h8v10h6v29H22V69h6V59h6Z"/>
        <path class="loot-cat-fur loot-cat-body" d="M39 58h34v5h7v9h6v20H27V72h6v-9h6Z"/>
        <path class="loot-cat-fur-dark" d="M70 61h10v10h6v21H69V77h-5V66h6Z"/>
        <path class="loot-cat-fur-light loot-cat-chest" d="M39 59h22v9h5v24H32V72h7Z"/>
        <path class="loot-cat-marking" d="M69 66h11v6H69ZM73 77h12v6H73Z"/>
        <g class="loot-cat-sit-paws">
          <rect class="loot-cat-outline" x="27" y="88" width="29" height="9"/>
          <rect class="loot-cat-outline" x="60" y="88" width="27" height="9"/>
          <path class="loot-cat-paw" d="M32 89h20v5H32ZM65 89h18v5H65Z"/>
          <path class="loot-cat-paw-detail" d="M42 89h3v5h-3ZM74 89h3v5h-3Z"/>
        </g>
      </g>

      <g class="loot-cat-head">
        <path class="loot-cat-outline" d="M21 22h6V5h16l8 12h12L71 5h16v17h6v6h7v25h-7v7H79v6H37v-5H23v-6h-8V29h6Z"/>
        <path class="loot-cat-fur" d="M27 25h5V11h8l8 12h18l8-12h8v15h7v6h6v17h-7v6H76v6H39v-5H27v-6h-7V33h7Z"/>
        <path class="loot-cat-ear" d="M33 12h7l7 11H33ZM74 12h7v12H67Z"/>
        <path class="loot-cat-marking" d="M48 22h18v5h-5v7h-5v-7h-8ZM28 29h8v5h-8ZM78 29h10v5H78Z"/>

        <g class="loot-cat-eyes">
          <path class="loot-cat-eye" d="M32 33h13v11H32ZM61 33h13v11H61Z"/>
          <path class="loot-cat-eye-light" d="M35 35h7v7h-7ZM64 35h7v7h-7Z"/>
          <path class="loot-cat-pupil" d="M35 36h4v7h-4ZM64 36h4v7h-4Z"/>
          <rect class="loot-cat-eye-glint" x="36" y="36" width="2" height="2"/>
          <rect class="loot-cat-eye-glint" x="65" y="36" width="2" height="2"/>
        </g>
        <g class="loot-cat-doze-eyes">
          <path class="loot-cat-sleep-eye" d="M32 38h13v3H32ZM61 38h13v3H61Z"/>
        </g>

        <path class="loot-cat-fur-light" d="M25 43h22v-4h12v5h17v12h-9v5H38v-4H25Z"/>
        <path class="loot-cat-nose" d="M43 44h9v6h-3v3h-4v-3h-2Z"/>
        <path class="loot-cat-mouth" d="M45 52h4v5h7v3H45v-3h-6v-3h6Z"/>
        <path class="loot-cat-whisker" d="M10 41h20v2H10ZM7 49h23v2H7ZM10 57h20v2H10ZM76 41h20v2H76ZM76 49h23v2H76ZM76 57h20v2H76Z"/>
        <rect class="loot-cat-collar" x="34" y="60" width="45" height="6"/>
        <path class="loot-cat-tag" d="M51 64h9v7h-2v3h-5v-3h-2Z"/>
        <g class="loot-cat-yawn-face">
          <path class="loot-cat-yawn-eye" d="M32 38h13v2H32ZM61 38h13v2H61Z"/>
          <g class="loot-cat-yawn-jaw">
            <path class="loot-cat-yawn-mouth" d="M43 50h9v2h3v3h2v8h-2v3h-3v2h-9v-2h-3v-3h-2v-8h2v-3h3Z"/>
            <path class="loot-cat-yawn-palate" d="M42 53h11v3H42Z"/>
            <path class="loot-cat-yawn-fang" d="M41 54h2v3h-2ZM52 54h2v3h-2Z"/>
            <path class="loot-cat-yawn-tongue" d="M42 61h12v3h-2v2h-8v-2h-2Z"/>
          </g>
        </g>
      </g>
    </g>

  `
  return svg
}

export function createCatCollarGraphic(
  ownerDocument: Document = document,
  color: CatCollarColor,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.classList.add("loot-cat-collar-graphic")
  svg.dataset.catCollar = color
  svg.setAttribute("viewBox", "0 0 64 44")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")
  svg.innerHTML = `
    <rect class="loot-cat-collar-icon-shadow" x="9" y="35" width="48" height="5"/>
    <path class="loot-cat-collar-icon-outline" d="M5 9h54v17h-7v5H12v-5H5Z"/>
    <path class="loot-cat-collar-icon-band" d="M9 13h46v10h-7v4H16v-4H9Z"/>
    <path class="loot-cat-collar-icon-light" d="M12 14h37v3H12Z"/>
    <path class="loot-cat-collar-icon-tag-outline" d="M25 24h15v9h-3v6H28v-6h-3Z"/>
    <path class="loot-cat-collar-icon-tag" d="M29 27h7v6h-2v3h-3v-3h-2Z"/>
  `
  return svg
}
