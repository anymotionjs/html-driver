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
