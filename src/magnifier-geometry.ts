export const MAGNIFIER_RADIUS = 72

export interface MagnifierRect {
  left: number
  right: number
  top: number
  bottom: number
}

export function magnifierIntersectsRect(
  x: number,
  y: number,
  rect: MagnifierRect,
  radius = MAGNIFIER_RADIUS,
): boolean {
  if (
    ![x, y, rect.left, rect.right, rect.top, rect.bottom, radius].every(
      Number.isFinite,
    ) ||
    radius < 0 ||
    rect.right < rect.left ||
    rect.bottom < rect.top
  ) {
    return false
  }

  const nearestX = Math.max(rect.left, Math.min(x, rect.right))
  const nearestY = Math.max(rect.top, Math.min(y, rect.bottom))
  const deltaX = x - nearestX
  const deltaY = y - nearestY
  return deltaX * deltaX + deltaY * deltaY <= radius * radius
}
