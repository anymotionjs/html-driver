import type { TweenPropertyDriver } from '@anymotion/core'
import { splitNumberUnit, createNumberInterpolate, isHTMLElementType } from './common'

declare global {
  interface TweenProperties {
    /** 宽度；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    width?: string
  }
}

function getRawWidth(element: Element): string {
  const style = window.getComputedStyle(element, null)
  return style.width
}

export const width: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null

  const rawWidth = getRawWidth(element)

  const localTo = to?.width ?? rawWidth
  const localFrom = from?.width ?? rawWidth

  const [toWidth, toUnit] = splitNumberUnit(localTo)
  const [fromWidth, formUnit] = splitNumberUnit(localFrom)
  if (toUnit !== formUnit) throw new Error('The from and to units of width must be consistent.')

  const interpolate = createNumberInterpolate(fromWidth, toWidth, { decimalPlaces: 2 })

  return {
    transform(progress) {
      const currentValue = interpolate(progress)
      element.style.width = `${currentValue}${toUnit}`
    }
  }
}
