/**
 * 将单位和数字拆开
 */
export function splitNumberUnit(valueWithUnit: string): [number, string] {
  const match = valueWithUnit.match(/^(-?\d*\.?\d+)([a-z%]+)?$/i)
  if (match) {
    const value = parseFloat(match[1])
    const unit = match[2]
    return [value, unit]
  }

  throw new Error(`Invalid valueWithUnit: ${valueWithUnit}`)
}

export function isHTMLElementType(element: Element): element is HTMLElement {
  return element instanceof HTMLElement
}

export function isEveryFalsy(...params: unknown[]): boolean {
  for (const item of params) {
    if (item !== '' && item != null) {
      return false
    }
  }
  return true
}

export function isFalsyProperty(keys: string[], ...objects: unknown[]): boolean {
  const properties: unknown[] = []

  for (const target of objects) {
    if (typeof target === 'object' && target != null) {
      for (const key of keys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        properties.push((target as any)[key])
      }
    }
  }

  return isEveryFalsy(...properties)
}
