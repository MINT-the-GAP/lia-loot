export const SURFACE_TARGETS = [
  "toc",
  "menu",
  "classroom",
  "info",
  "translator",
  "mode",
] as const

export type SurfaceTarget = (typeof SURFACE_TARGETS)[number]

interface SurfaceTargetDefinition {
  aliases: readonly string[]
  grouped: boolean
  id: SurfaceTarget
  selector: string
}

const DEFINITIONS: readonly SurfaceTargetDefinition[] = [
  {
    aliases: [],
    grouped: false,
    id: "toc",
    selector: "#lia-toc .lia-toc__content",
  },
  {
    aliases: [],
    grouped: true,
    id: "menu",
    selector:
      "#lia-support-menu .lia-support-menu__item--settings .lia-support-menu__submenu",
  },
  {
    aliases: [],
    grouped: true,
    id: "classroom",
    selector:
      "#lia-support-menu .lia-support-menu__item--share .lia-support-menu__submenu",
  },
  {
    aliases: [],
    grouped: true,
    id: "info",
    selector:
      "#lia-support-menu .lia-support-menu__item--info .lia-support-menu__submenu",
  },
  {
    aliases: [
      "translate",
      "translation",
      "lang",
      "übersetzer",
      "uebersetzer",
    ],
    grouped: true,
    id: "translator",
    selector:
      "#lia-support-menu .lia-support-menu__item--lang .lia-support-menu__submenu",
  },
  {
    aliases: ["display", "view", "darstellung"],
    grouped: true,
    id: "mode",
    selector:
      "#lia-support-menu .lia-support-menu__item--mode .lia-support-menu__submenu",
  },
]

const BY_ID = new Map(
  DEFINITIONS.map((definition) => [definition.id, definition] as const),
)
const ALIASES = new Map<string, SurfaceTarget>()

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("de-DE")
}

for (const definition of DEFINITIONS) {
  for (const alias of [definition.id, ...definition.aliases]) {
    ALIASES.set(normalize(alias), definition.id)
  }
}

export function resolveSurfaceTarget(
  value: string | null | undefined,
): SurfaceTarget | null {
  if (!value) return null
  return ALIASES.get(normalize(value)) ?? null
}

export function isSurfaceTarget(value: string): value is SurfaceTarget {
  return BY_ID.has(value as SurfaceTarget)
}

export function surfaceTargetElement(
  target: SurfaceTarget,
  documentRoot: Document = document,
): HTMLElement | null {
  if (target === "toc") {
    const enhancedToc = documentRoot.querySelector<HTMLElement>(
      "#lia-toc #lia-bm-toc5 > .bm-list",
    )
    if (enhancedToc) return enhancedToc
  }
  return documentRoot.querySelector<HTMLElement>(BY_ID.get(target)!.selector)
}

export function surfaceTargetIsGrouped(target: SurfaceTarget): boolean {
  return BY_ID.get(target)!.grouped
}
