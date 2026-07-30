import {
  KEY_COLOR_DETAILS,
  KEY_COLORS,
} from "./key-colors"
import { createKeyGraphic } from "./key-visual"
import {
  installResourceBar,
  refreshResourceBarVisibility,
} from "./resource-bar"
import type { KeyCounts } from "./key-colors"

const INVENTORY_ID = "lia-loot-key-inventory"

function statusMessage(): HTMLSpanElement {
  const status = document.createElement("span")
  status.className = "loot-key-inventory__status"
  status.setAttribute("role", "status")
  status.setAttribute("aria-live", "polite")
  status.setAttribute("aria-atomic", "true")
  return status
}

function installKeyInventory(): HTMLElement {
  const existing = document.getElementById(INVENTORY_ID)
  if (existing) return existing

  const inventory = document.createElement("div")
  inventory.id = INVENTORY_ID
  inventory.className = "loot-key-inventory"
  inventory.setAttribute("role", "group")
  inventory.setAttribute("aria-label", "Schlüsselinventar")
  inventory.tabIndex = -1

  const list = document.createElement("ul")
  list.className = "loot-key-inventory__list"
  list.setAttribute("role", "list")

  inventory.append(list, statusMessage())
  installResourceBar().appendChild(inventory)
  return inventory
}

export function renderKeyInventory(keys: KeyCounts): void {
  const discovered = KEY_COLORS.filter((color) => keys[color] > 0)
  if (discovered.length === 0) {
    document.getElementById(INVENTORY_ID)?.remove()
    refreshResourceBarVisibility()
    return
  }

  const inventory = installKeyInventory()
  const list = inventory.querySelector<HTMLUListElement>(
    ".loot-key-inventory__list",
  )
  if (!list) return
  list.replaceChildren()

  for (const color of discovered) {
    const details = KEY_COLOR_DETAILS[color]
    const singularName = details.foundMessage.replace(/\s+gefunden\.$/, "")
    for (let index = 0; index < keys[color]; index += 1) {
      const item = document.createElement("li")
      item.className = `loot-key-inventory__item loot-key-color--${color}`
      item.dataset.lootKeyColor = color
      item.dataset.lootKeyInstance = `${color}-${index + 1}`
      item.setAttribute(
        "aria-label",
        keys[color] === 1
          ? singularName
          : `${singularName}, Exemplar ${index + 1} von ${keys[color]}`,
      )

      const icon = createKeyGraphic(color)
      icon.classList.add("loot-key-inventory__icon")
      item.append(icon)
      list.appendChild(item)
    }
  }
  refreshResourceBarVisibility()
}

export function announceKeyFound(message: string): void {
  const status = document.querySelector<HTMLElement>(
    ".loot-key-inventory__status",
  )
  if (!status) return
  status.textContent = ""
  window.setTimeout(() => {
    status.textContent = message
  }, 0)
}

export function focusKeyInventory(): void {
  document.getElementById(INVENTORY_ID)?.focus({ preventScroll: true })
}
