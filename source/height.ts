import type { TweenPropertyDriver } from '@anymotion/core'
import { splitNumberUnit, createNumberInterpolate, isHTMLElementType, } from './common'

declare global {
  interface TweenProperties {
    /** 高度；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    height?: string
  }
}

function getRawHeight(element: Element): string {
  const style = window.getComputedStyle(element, null)
  return style.height
}

export const height: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null

  const rawHeight = getRawHeight(element)

  const localTo = to?.height ?? rawHeight
  const localFrom = from?.height ?? rawHeight

  const [toHeight, toUnit] = splitNumberUnit(localTo)
  const [fromHeight, formUnit] = splitNumberUnit(localFrom)
  if (toUnit !== formUnit) throw new Error('The from and to units of height must be consistent.')

  const interpolate = createNumberInterpolate(fromHeight, toHeight, { decimalPlaces: 2 })

  return {
    transform(progress) {
      const currentValue = interpolate(progress)
      element.style.height = `${currentValue}${toUnit}`
    }
  }
}
