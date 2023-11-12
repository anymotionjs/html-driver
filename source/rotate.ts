import type { TweenPropertyDriver } from '@anymotion/core'
import { createNumberInterpolate, isFalsyProperty, isHTMLElementType, splitNumberUnit } from './common'

declare global {
  interface TweenProperties {
    /** 旋转；取值范围 [0,360] */
    rotate?: string
  }
}

function getRawRotate(element: Element): string {
  const style = window.getComputedStyle(element, null)
  return style.rotate
}

function parseRotate(value: string): [number, number, number, number, string] {
  // [x轴,y轴，z轴，值，单位]

  if (!value || value == 'none') return [0, 0, 0, 0, '']
  const stmts = value.split(' ').filter(Boolean).map(i => i.trim())
  const [angle, unit] = splitNumberUnit(stmts[stmts.length - 1])

  if (stmts.length === 1) {
    return [0, 0, 1, angle, unit]
  }

  if (stmts.length === 2) {
    const axis = stmts[0]
    if (axis === 'x') return [1, 0, 0, angle, unit]
    if (axis === 'y') return [0, 1, 0, angle, unit]
    if (axis === 'z') return [0, 0, 1, angle, unit]
    throw new Error()
  }

  if (stmts.length === 4) {
    const [x, y, z] = stmts.slice(0, 3).map(i => parseFloat(i))
    return [x, y, z, angle, unit]
  }

  throw new Error()
}


export const rotate: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null
  if (isFalsyProperty(['rotate'], to, from)) return null

  const rawRotate = getRawRotate(element)

  const [toX, toY, toZ, toAngle, toUnit] = parseRotate(to?.rotate ?? rawRotate)
  const [fromX, fromY, fromZ, fromAngle, fromUnit] = parseRotate(from?.rotate ?? rawRotate)
  if (toUnit && fromUnit && toUnit !== fromUnit) throw new Error()

  const xInterpolate = createNumberInterpolate(fromX, toX, { decimalPlaces: 2 })
  const yInterpolate = createNumberInterpolate(fromY, toY, { decimalPlaces: 2 })
  const zInterpolate = createNumberInterpolate(fromZ, toZ, { decimalPlaces: 2 })
  const angleInterpolate = createNumberInterpolate(fromAngle, toAngle, { decimalPlaces: 2 })

  return {
    drive(progress) {
      const x = xInterpolate(progress)
      const y = yInterpolate(progress)
      const z = zInterpolate(progress)
      const angle = angleInterpolate(progress)
      element.style.rotate = `${x} ${y} ${z} ${angle}${toUnit}`
    }
  }
}
