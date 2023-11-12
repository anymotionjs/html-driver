import type { TweenPropertyDriver } from '@anymotion/core'
import { splitNumberUnit, createNumberInterpolate, isHTMLElementType, isFalsyProperty } from './common'

declare global {
  interface TweenProperties {
    /** 宽度；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    width?: string
    /** 高度；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    height?: string
  }
}

function getRawSize(element: Element): [string, string] {
  const style = window.getComputedStyle(element, null)
  return [style.width, style.height]
}

export const size: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null
  if (isFalsyProperty(['width', 'height'], to, from)) return null

  const [rawWidth, rawHeight] = getRawSize(element)

  const localToWidth = to?.width ?? rawWidth
  const localFromWidth = from?.width ?? rawWidth
  const localToHeight = to?.height ?? rawHeight
  const localFromHeight = from?.height ?? rawHeight

  const [toWidth, toWidthUnit] = splitNumberUnit(localToWidth)
  const [fromWidth, formWidthUnit] = splitNumberUnit(localFromWidth)
  const [toHeight, toHeightUnit] = splitNumberUnit(localToHeight)
  const [fromHeight, formHeightUnit] = splitNumberUnit(localFromHeight)

  if (toWidthUnit && formWidthUnit && toWidthUnit !== formWidthUnit) throw new Error()
  if (toHeightUnit && formHeightUnit && toHeightUnit !== formHeightUnit) throw new Error()

  const widthInterpolate = createNumberInterpolate(fromWidth, toWidth, { decimalPlaces: 2 })
  const heightInterpolate = createNumberInterpolate(fromHeight, toHeight, { decimalPlaces: 2 })

  return {
    drive(progress) {
      const width = widthInterpolate(progress)
      const height = heightInterpolate(progress)
      element.style.width = `${width}${toWidthUnit}`
      element.style.height = `${height}${toHeightUnit}`
    }
  }
}
