import assert from "node:assert/strict"
import test from "node:test"

import { scopeContainerContent } from "../src/container-content.ts"

test("erzeugt entpackte Items direkt mit containergebundener ID", () => {
  assert.equal(
    scopeContainerContent("@Schluessel(gruen)", "0_5"),
    '<lia-keep>\n<lia-loot-key data-key-id="0_5_content" data-color="gruen"></lia-loot-key>\n</lia-keep>',
  )
  assert.equal(
    scopeContainerContent("@Katze", "0_6"),
    '<lia-keep>\n<lia-loot-cat data-cat-id="0_6_content" data-options=""></lia-loot-cat>\n</lia-keep>',
  )
  assert.equal(
    scopeContainerContent("@Schatztruhe(3; menu)", "0_7"),
    '<lia-keep>\n<lia-loot-chest data-chest-id="0_7_content" data-placement="3; menu" data-reward="gold"></lia-loot-chest>\n</lia-keep>',
  )
  assert.equal(
    scopeContainerContent("@Axt", "0_8"),
    '<lia-keep>\n<lia-loot-tool data-tool-id="0_8_content" data-tool="axe" data-options=""></lia-loot-tool>\n</lia-keep>',
  )
  assert.equal(
    scopeContainerContent("@Lupe", "gift:7"),
    '<lia-keep>\n<lia-loot-magnifier data-magnifier-id="gift_7_content" data-options=""></lia-loot-magnifier>\n</lia-keep>',
  )
})

test("escaped Optionen koennen keine Elementattribute verlassen", () => {
  const content = scopeContainerContent(
    '@Katze(grau" data-fremd="ja & <nein>)',
    "0_9",
  )
  assert.match(
    content,
    /data-options="grau&quot; data-fremd=&quot;ja &amp; &lt;nein&gt;"/u,
  )
  assert.doesNotMatch(content, /@Loot/u)
})

test("erzeugt verschachtelte Geschenk-, Kisten- und Futterrenderer ohne Makroreste", () => {
  const gift = scopeContainerContent("@Geschenk", "11_2")
  const crate = scopeContainerContent("@Kiste", "12_1")
  const food = scopeContainerContent("@Futter", "13_4")

  assert.match(gift, /data-gift-id="11_2_content"/u)
  assert.match(gift, /api\.render\("11_2_content", send\)/u)
  assert.match(crate, /data-crate-id="12_1_content"/u)
  assert.match(crate, /api\.render\("12_1_content", send\)/u)
  assert.match(food, /data-food-id="13_4_content"/u)
  assert.match(food, /api\.render\("13_4_content", send\)/u)
  assert.doesNotMatch(gift + crate + food, /@(?:Loot|[01])/u)
})

test("lässt freien Inhalt unverändert", () => {
  assert.equal(
    scopeContainerContent("Ein normaler Absatz.", "0_5"),
    "Ein normaler Absatz.",
  )
})
