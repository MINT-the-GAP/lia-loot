import { parseBonusPickupOptions, type BonusPickupKind } from "./bonus-options.ts"
import { parseCatPickupOptions } from "./cat-options.ts"
import {
  puzzlePieceMacroOccurrences,
  visibleCourseLines,
} from "./course-chests.ts"
import type { ExplorationStore } from "./exploration-store.ts"
import type { ToolKind } from "./exploration-options.ts"
import type { FlashlightStore } from "./flashlight-store.ts"
import type { KeyInventoryStore } from "./inventory-store.ts"
import { resolveKeyAppearance, type KeyColor } from "./key-colors.ts"
import { parseKeyPickupOptions } from "./key-options.ts"
import type { MagnifierStore } from "./magnifier-store.ts"
import { parsePuzzlePieceOptions } from "./puzzle-options.ts"
import type { PuzzleStore } from "./puzzle-store.ts"
import { parseSimplePickupOptions } from "./simple-pickup-options.ts"
import type { ShopGrant, ShopStore } from "./shop-store.ts"
import type { CatCompanionStore } from "./cat-store.ts"
import type { CatVariant } from "./cat-catalog.ts"

export type StartInventoryGrant =
  | { kind: "cat"; variant: CatVariant }
  | { color: KeyColor; kind: "key" }
  | { kind: "magnifier" }
  | { kind: "flashlight" }
  | { kind: "puzzle-piece"; color: KeyColor; number: number }
  | { kind: "shop"; grant: ShopGrant }
  | { kind: "tool"; tool: ToolKind }

export interface StartInventoryDeclaration {
  grant: StartInventoryGrant
  id: string
  section: number
  sourceOrder: number
}

export interface StartInventoryDiagnostic {
  message: string
  section: number
  sourceOrder: number
}

export interface StartInventoryDiscovery {
  declarations: StartInventoryDeclaration[]
  diagnostics: StartInventoryDiagnostic[]
}

export interface StartInventoryStores {
  cat: Pick<CatCompanionStore, "collect" | "collectCollar">
  exploration: Pick<ExplorationStore, "collectTool">
  flashlight: Pick<FlashlightStore, "collect">
  keys: Pick<KeyInventoryStore, "collectKey">
  magnifier: Pick<MagnifierStore, "collect">
  puzzle: Pick<PuzzleStore, "collectPiece" | "isPieceCollected">
  shop: Pick<ShopStore, "isPurchased" | "recordPurchase">
}

const DIRECT_ITEM_MACRO =
  /^\s*@(Atlaskarte|HighscoreInfo|Perk|Lupe|Taschenlampe|Schaufel|Giesskanne|Axt|Katze|Schluessel)(?:\s*\(\s*([^()\r\n]*)\s*\))?\s*$/iu
const WRAPPER_MACRO =
  /@(Geschenk|Futter|Kiste|Unsichtbar|Zauberstaub|Nebel|Erdhaufen\.inline|Pflanze\.inline|Blume\.inline)(?![\p{L}\p{N}_.])\s*\(/iu

function normalizedName(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("de-DE")
}

function sourceId(kind: string, lineIndex: number, characterIndex = 0): string {
  return `start-inventory:${kind}:${lineIndex}:${characterIndex}`
}

function diagnosticMessage(
  macro: string,
  errors: readonly string[],
): string {
  return `${macro} wurde nicht ins Startinventar übernommen: ${errors.join(" ")}`
}

export function parseCourseStartInventory(
  markdown: string,
): StartInventoryDiscovery {
  const declarations: StartInventoryDeclaration[] = []
  const diagnostics: StartInventoryDiagnostic[] = []
  const lines = visibleCourseLines(markdown)

  const reject = (
    macro: string,
    errors: readonly string[],
    section: number,
    sourceOrder: number,
  ): void => {
    diagnostics.push({
      message: diagnosticMessage(macro, errors),
      section,
      sourceOrder,
    })
  }

  for (const [lineIndex, line] of lines.entries()) {
    if (
      !line.lootIfCatalogEligible ||
      line.lootIfDepth > 0 ||
      line.revealDepth > 0
    ) {
      continue
    }

    const item = DIRECT_ITEM_MACRO.exec(line.content)
    if (item) {
      const macro = item[1]
      const name = normalizedName(macro)
      const options = (item[2] ?? "").trim()
      const id = sourceId(name, lineIndex)

      if (["atlaskarte", "highscoreinfo", "perk"].includes(name)) {
        const kind: BonusPickupKind =
          name === "atlaskarte"
            ? "atlas"
            : name === "highscoreinfo"
              ? "highscore-info"
              : "perk"
        const parsed = parseBonusPickupOptions(kind, options)
        if (!parsed.initiallyOwned) continue
        if (!parsed.valid || !parsed.grant) {
          reject(`@${macro}`, parsed.errors, line.section, lineIndex)
          continue
        }
        declarations.push({
          grant: { kind: "shop", grant: parsed.grant },
          id,
          section: line.section,
          sourceOrder: lineIndex,
        })
        continue
      }

      if (name === "katze") {
        const parsed = parseCatPickupOptions(options)
        if (!parsed.initiallyOwned) continue
        if (!parsed.valid) {
          reject(`@${macro}`, parsed.errors, line.section, lineIndex)
          continue
        }
        declarations.push({
          grant: { kind: "cat", variant: parsed.variant },
          id,
          section: line.section,
          sourceOrder: lineIndex,
        })
        continue
      }

      if (name === "schluessel") {
        const parsed = parseKeyPickupOptions(options)
        if (!parsed.initiallyOwned) continue
        if (!parsed.valid) {
          reject(`@${macro}`, parsed.errors, line.section, lineIndex)
          continue
        }
        declarations.push({
          grant: {
            color: resolveKeyAppearance(id, parsed.requestedColor).color,
            kind: "key",
          },
          id,
          section: line.section,
          sourceOrder: lineIndex,
        })
        continue
      }

      const parsed = parseSimplePickupOptions(
        options,
        `Unbekannte ${macro}-Option`,
      )
      if (!parsed.initiallyOwned) continue
      if (!parsed.valid) {
        reject(`@${macro}`, parsed.errors, line.section, lineIndex)
        continue
      }
      const grant: StartInventoryGrant =
        name === "lupe"
          ? { kind: "magnifier" }
          : name === "taschenlampe"
            ? { kind: "flashlight" }
            : {
                kind: "tool",
                tool:
                  name === "schaufel"
                    ? "shovel"
                    : name === "giesskanne"
                      ? "watering-can"
                      : "axe",
              }
      declarations.push({
        grant,
        id,
        section: line.section,
        sourceOrder: lineIndex,
      })
      continue
    }

    if (WRAPPER_MACRO.test(line.content)) continue
    for (const occurrence of puzzlePieceMacroOccurrences(line.content)) {
      const parsed = parsePuzzlePieceOptions(occurrence.options)
      if (!parsed.initiallyOwned) continue
      const sourceOrder =
        lineIndex + occurrence.start / Math.max(1, line.content.length + 1)
      if (!parsed.valid || !parsed.color || parsed.number === null) {
        reject("@Puzzleteil", parsed.errors, line.section, sourceOrder)
        continue
      }
      declarations.push({
        grant: {
          color: parsed.color,
          kind: "puzzle-piece",
          number: parsed.number,
        },
        id: sourceId("puzzleteil", lineIndex, occurrence.start),
        section: line.section,
        sourceOrder,
      })
    }
  }

  declarations.sort((left, right) => left.sourceOrder - right.sourceOrder)
  diagnostics.sort((left, right) => left.sourceOrder - right.sourceOrder)
  return { declarations, diagnostics }
}

export function seedStartInventory(
  declarations: readonly StartInventoryDeclaration[],
  stores: StartInventoryStores,
): string[] {
  const diagnostics: string[] = []
  for (const declaration of declarations) {
    const grant = declaration.grant
    if (grant.kind === "magnifier") {
      stores.magnifier.collect()
    } else if (grant.kind === "flashlight") {
      stores.flashlight.collect()
    } else if (grant.kind === "tool") {
      stores.exploration.collectTool(grant.tool)
    } else if (grant.kind === "cat") {
      stores.cat.collect(grant.variant)
    } else if (grant.kind === "key") {
      stores.keys.collectKey(declaration.id, grant.color)
    } else if (grant.kind === "puzzle-piece") {
      const collected = stores.puzzle.collectPiece(grant.color, grant.number)
      if (!collected && !stores.puzzle.isPieceCollected(grant.color, grant.number)) {
        diagnostics.push(
          `@Puzzleteil auf Folie ${declaration.section + 1} gehört zu keinem gültig konfigurierten Puzzletor.`,
        )
      }
    } else {
      const purchaseId = declaration.id
      if (!stores.shop.isPurchased(purchaseId)) {
        stores.shop.recordPurchase(purchaseId, grant.grant)
      }
      if (grant.grant.kind === "collar") {
        stores.cat.collectCollar(grant.grant.color)
      }
    }
  }
  return diagnostics
}
