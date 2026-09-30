const SVG_NS = "http://www.w3.org/2000/svg"

let woodCrateGraphicId = 0

export function createWoodCrateGraphic(
  ownerDocument: Document = document,
): SVGSVGElement {
  const svg = ownerDocument.createElementNS(SVG_NS, "svg")
  svg.classList.add("loot-wood-crate-graphic")
  svg.setAttribute("viewBox", "0 0 144 124")
  svg.setAttribute("shape-rendering", "crispEdges")
  svg.setAttribute("aria-hidden", "true")

  woodCrateGraphicId += 1
  const faceId = `loot-wood-crate-face-${woodCrateGraphicId}`

  svg.innerHTML = `
    <defs>
      <!--
        The authored front face is the single source for all three visible
        cuboid faces. Top and right are affine projections of this exact group.
      -->
      <g id="${faceId}">
        <rect class="loot-wood-crate-dark" width="94" height="84"/>
        <rect class="loot-wood-crate-plank" x="10" y="10" width="74" height="64"/>
        <path class="loot-wood-crate-light" d="M15 15h63v4H15Zm0 25h63v4H15Zm0 25h63v4H15Z"/>
        <path class="loot-wood-crate-grain" d="M19 25h28v3H19Zm38 0h19v3H57ZM14 51h24v3H14Zm36 0h28v3H50Z"/>
        <path class="loot-wood-crate-outline loot-wood-crate-frame" d="M0 0h15v84H0Zm82 0h12v84H82ZM0 0h94v15H0Zm0 69h94v15H0Z"/>
        <path class="loot-wood-crate-frame-light" d="M7 15h4v52H7Zm75 0h5v52h-5ZM15 6h63v4H15Zm0 69h63v4H15Z"/>
        <path class="loot-wood-crate-outline loot-wood-crate-brace" d="m9 13 10-8 70 62-8 12ZM80 5l10 9-72 65-10-9Z"/>
        <path class="loot-wood-crate-brace-light" d="m17 13 3-3 65 58-4 5ZM79 10l4 4-67 60-4-4Z"/>
        <rect class="loot-wood-crate-nail" x="7" y="7" width="4" height="4"/>
        <rect class="loot-wood-crate-nail" x="83" y="7" width="4" height="4"/>
        <rect class="loot-wood-crate-nail" x="7" y="72" width="4" height="4"/>
        <rect class="loot-wood-crate-nail" x="83" y="72" width="4" height="4"/>
      </g>
    </defs>

    <path class="loot-wood-crate-shadow" d="M10 112h91l39-24v12l-35 22H16Z"/>
    <g class="loot-wood-crate-body">
      <path class="loot-wood-crate-outline" d="M6 36 44 8h96v84l-40 28H6Z"/>

      <!-- y of the front face becomes the receding top depth vector (38, -28). -->
      <g class="loot-wood-crate-plank--top">
        <g transform="matrix(1 0 0.452381 -0.333333 6 36)">
          <use href="#${faceId}"/>
        </g>
      </g>

      <!-- x of the front face becomes the receding right depth vector. -->
      <g class="loot-wood-crate-plank--bottom">
        <g transform="matrix(0.404255 -0.297872 0 1 100 36)">
          <use href="#${faceId}"/>
        </g>
      </g>

      <!-- The original front is unchanged and remains the visual source. -->
      <g class="loot-wood-crate-plank--middle">
        <g transform="translate(6 36)">
          <use href="#${faceId}"/>
        </g>
        <g class="loot-wood-crate-damage">
          <path class="loot-wood-crate-crack loot-wood-crate-crack--1" d="m56 47-5 11 7 7-8 10 6 7-5 19h6l6-19-7-7 8-10-7-7 5-11Z"/>
          <path class="loot-wood-crate-crack loot-wood-crate-crack--2" d="m38 62-8 8 6 7-9 10 4 12h6l-4-11 10-11-6-7 8-8Z"/>
          <path class="loot-wood-crate-crack loot-wood-crate-crack--3" d="m72 57 8 9-6 9 11 9-4 15h-6l3-14-11-10 6-9-7-9Z"/>
          <path class="loot-wood-crate-crack loot-wood-crate-crack--4" d="m19 68 9-7 5 7-9 8 8 9-6 13h-6l5-12-9-10Z"/>
          <path class="loot-wood-crate-crack loot-wood-crate-crack--5" d="m85 60-9 9 7 8-8 10 4 13h-6l-5-14 8-9-7-8 10-9Z"/>
          <path class="loot-wood-crate-crack loot-wood-crate-crack--6" d="m63 84-8 8 4 16h7l-4-15 9-9Z"/>
          <path class="loot-wood-crate-crack loot-wood-crate-crack--7" d="m44 46-6 8 6 7-7 8 5 8-7 9 5 12-6 11h-7l7-12-6-10 7-10-5-8 7-8-6-7 5-8Z"/>
          <path class="loot-wood-crate-hole loot-wood-crate-hole--4" d="m49 75 9-8 10 9-6 14-12 1-6-8Z"/>
          <path class="loot-wood-crate-hole loot-wood-crate-hole--6" d="m76 91 10-8 10 7-3 14H79Z"/>
        </g>
      </g>
    </g>
    <g class="loot-wood-crate-splinters">
      <path d="M14 60 1 50l8 19Z"/>
      <path d="m126 43 17-11-9 21Z"/>
      <path d="m29 108-10 16 17-9Z"/>
      <path d="m105 99 19 15-21-5Z"/>
    </g>
  `
  return svg
}
