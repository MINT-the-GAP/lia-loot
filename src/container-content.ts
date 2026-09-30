const ROOT_ITEM =
  /^@([\p{L}\p{N}_.-]+)(?:\(([\s\S]*)\))?$/u

type Attribute = readonly [name: string, value: string]

function escapeAttribute(value: string): string {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#39;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
}

function lootElement(tag: string, attributes: readonly Attribute[]): string {
  const renderedAttributes = attributes
    .map(([name, value]) => `${name}="${escapeAttribute(value)}"`)
    .join(" ")
  return `<lia-keep>\n<${tag} ${renderedAttributes}></${tag}>\n</lia-keep>`
}

function nestedGift(scopedId: string): string {
  const escapedId = escapeAttribute(scopedId)
  const scriptId = JSON.stringify(scopedId)
  return `<lia-keep>
<lia-loot-gift data-gift-id="${escapedId}"></lia-loot-gift>
</lia-keep>
<span data-loot-gift-renderer="${escapedId}" hidden>
<script modify="false">
(function waitForLootGift(remaining) {
  var api = window.__LIA_LOOT_GIFTS__;
  if (api) {
    api.render(${scriptId}, send);
    return;
  }
  if (remaining > 0) {
    window.setTimeout(function () { waitForLootGift(remaining - 1); }, 50);
  } else {
    send.lia("LIA: stop");
  }
})(400);
"LIA: wait"
</script>
</span>`
}

function nestedWoodCrate(scopedId: string): string {
  const escapedId = escapeAttribute(scopedId)
  const scriptId = JSON.stringify(scopedId)
  return `<lia-keep>
<lia-loot-wood-crate data-crate-id="${escapedId}"></lia-loot-wood-crate>
</lia-keep>
<span data-loot-wood-crate-renderer="${escapedId}" hidden>
<script modify="false">
(function waitForLootWoodCrate(remaining) {
  var api = window.__LIA_LOOT_WOOD_CRATES__;
  if (api) {
    api.render(${scriptId}, send);
    return;
  }
  if (remaining > 0) {
    window.setTimeout(function () { waitForLootWoodCrate(remaining - 1); }, 50);
  } else {
    send.lia("LIA: stop");
  }
})(400);
"LIA: wait"
</script>
</span>`
}

function nestedCatFood(scopedId: string): string {
  const escapedId = escapeAttribute(scopedId)
  const scriptId = JSON.stringify(scopedId)
  return `<lia-keep>
<lia-loot-cat-food data-food-id="${escapedId}"></lia-loot-cat-food>
</lia-keep>
<span data-loot-cat-food-renderer="${escapedId}" hidden>
<script modify="false">
(function waitForLootCatFood(remaining) {
  var api = window.__LIA_LOOT_CAT_FOOD__;
  if (api) {
    api.render(${scriptId}, send);
    return;
  }
  if (remaining > 0) {
    window.setTimeout(function () { waitForLootCatFood(remaining - 1); }, 50);
  } else {
    send.lia("LIA: stop");
  }
})(400);
"LIA: wait"
</script>
</span>`
}

export function scopedContainerContentId(containerId: string): string {
  const safeContainerId = containerId
    .trim()
    .replace(/[^\p{L}\p{N}_-]+/gu, "_")
  return `${safeContainerId || "container"}_content`
}

/**
 * LiaScript expands macros before a dynamically rendered fragment is sent.
 * Expanding another internal @Loot... macro in that fragment leaves its @0/@1
 * placeholders unresolved and displays the invocation tail as course text.
 * Emit the known custom elements directly and give each contained root item an
 * id derived from its authored container id.
 */
export function scopeContainerContent(
  content: string,
  containerId: string,
): string {
  const trimmed = content.trim()
  const match = ROOT_ITEM.exec(trimmed)
  if (!match) return content

  const name = match[1].toLocaleLowerCase("de-DE")
  const options = match[2]?.trim() ?? ""
  const scopedId = scopedContainerContentId(containerId)

  switch (name) {
    case "schatztruhe":
      return lootElement("lia-loot-chest", [
        ["data-chest-id", scopedId],
        ["data-placement", options],
        ["data-reward", "gold"],
      ])
    case "diamanttruhe":
    case "diamantentruhe":
      return lootElement("lia-loot-chest", [
        ["data-chest-id", scopedId],
        ["data-placement", options],
        ["data-reward", "diamonds"],
      ])
    case "energiekiste":
    case "energietruhe":
      return lootElement("lia-loot-chest", [
        ["data-chest-id", scopedId],
        ["data-placement", options],
        ["data-reward", "energy"],
      ])
    case "schluessel":
      return lootElement("lia-loot-key", [
        ["data-key-id", scopedId],
        ["data-color", options],
      ])
    case "puzzleteil":
      return lootElement("lia-loot-puzzle-piece", [
        ["data-piece-id", scopedId],
        ["data-options", options],
      ])
    case "puzzletor":
      return lootElement("lia-loot-puzzle-gate", [
        ["data-gate-id", scopedId],
        ["data-options", options],
      ])
    case "lupe":
      return lootElement("lia-loot-magnifier", [
        ["data-magnifier-id", scopedId],
        ["data-options", options],
      ])
    case "taschenlampe":
      return lootElement("lia-loot-flashlight", [
        ["data-flashlight-id", scopedId],
        ["data-options", options],
      ])
    case "schaufel":
      return lootElement("lia-loot-tool", [
        ["data-tool-id", scopedId],
        ["data-tool", "shovel"],
        ["data-options", options],
      ])
    case "giesskanne":
      return lootElement("lia-loot-tool", [
        ["data-tool-id", scopedId],
        ["data-tool", "watering-can"],
        ["data-options", options],
      ])
    case "axt":
      return lootElement("lia-loot-tool", [
        ["data-tool-id", scopedId],
        ["data-tool", "axe"],
        ["data-options", options],
      ])
    case "shop":
      return lootElement("lia-loot-shop", [
        ["data-shop-id", scopedId],
        ["data-options", options],
      ])
    case "atlaskarte":
      return lootElement("lia-loot-bonus", [
        ["data-bonus-id", scopedId],
        ["data-bonus-kind", "atlas"],
        ["data-options", options],
      ])
    case "perk":
      return lootElement("lia-loot-bonus", [
        ["data-bonus-id", scopedId],
        ["data-bonus-kind", "perk"],
        ["data-options", options],
      ])
    case "katze":
      return lootElement("lia-loot-cat", [
        ["data-cat-id", scopedId],
        ["data-options", options],
      ])
    case "geschenk":
      return nestedGift(scopedId)
    case "kiste":
      return nestedWoodCrate(scopedId)
    case "futter":
      return nestedCatFood(scopedId)
    default:
      return content
  }
}
