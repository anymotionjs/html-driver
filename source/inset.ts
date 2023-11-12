import type { TweenPropertyDriver } from '@anymotion/core'
import { splitNumberUnit, createNumberInterpolate, isHTMLElementType, isFalsyProperty } from './common'

declare global {
  interface TweenProperties {
    /** 距离顶部的值；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    top?: string
    /** 距离右侧的值；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    right?: string
    /** 距离底部的值；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    bottom?: string
    /** 距离左侧的值；例如：100px, 支持所有 css 单位，但请保证 from 和 to 单位一致 */
    left?: string
  }
}

function getRawInset(element: Element): [string, string, string, string] {
  const style = window.getComputedStyle(element, null)
  return [style.top, style.right, style.bottom, style.left]
}

function parseInset(value: string): string {
  if (!value || value == 'auto') return '0'
  return value
}

export const inset: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null
  if (isFalsyProperty(['top', 'right', 'bottom', 'left'], to, from)) return null

  const [rawTop, rawRight, rawBottom, rawLeft,] = getRawInset(element)

  const localFromTop = from?.top ?? rawTop
  const localFromRight = from?.right ?? rawRight
  const localFromBottom = from?.bottom ?? rawBottom
  const localFromLeft = from?.left ?? rawLeft

  const [fromTop, fromTopUnit] = splitNumberUnit(parseInset(localFromTop))
  const [fromRight, fromRightUnit] = splitNumberUnit(parseInset(localFromRight))
  const [fromBottom, fromBottomUnit] = splitNumberUnit(parseInset(localFromBottom))
  const [fromLeft, fromLeftUnit] = splitNumberUnit(parseInset(localFromLeft))

  const localToTop = to?.top ?? rawTop
  const localToRight = to?.right ?? rawRight
  const localToBottom = to?.bottom ?? rawBottom
  const localToLeft = to?.left ?? rawLeft

  const [toTop, toTopUnit] = splitNumberUnit(parseInset(localToTop))
  const [toRight, toRightUnit] = splitNumberUnit(parseInset(localToRight))
  const [toBottom, toBottomUnit] = splitNumberUnit(parseInset(localToBottom))
  const [toLeft, toLeftUnit] = splitNumberUnit(parseInset(localToLeft))


  if (toTopUnit && fromTopUnit && toTopUnit !== fromTopUnit) throw new Error()
  if (toRightUnit && fromRightUnit && toRightUnit !== fromRightUnit) throw new Error()
  if (toBottomUnit && fromBottomUnit && toBottomUnit !== fromBottomUnit) throw new Error()
  if (toLeftUnit && fromLeftUnit && toLeftUnit !== fromLeftUnit) throw new Error()

  const topInterpolate = createNumberInterpolate(fromTop, toTop, { decimalPlaces: 2 })
  const rightInterpolate = createNumberInterpolate(fromRight, toRight, { decimalPlaces: 2 })
  const bottomInterpolate = createNumberInterpolate(fromBottom, toBottom, { decimalPlaces: 2 })
  const leftInterpolate = createNumberInterpolate(fromLeft, toLeft, { decimalPlaces: 2 })

  return {
    drive(progress) {
      const top = topInterpolate(progress)
      const right = rightInterpolate(progress)
      const bottom = bottomInterpolate(progress)
      const left = leftInterpolate(progress)
      element.style.top = `${top}${toTopUnit}`
      element.style.right = `${right}${toRightUnit}`
      element.style.bottom = `${bottom}${toBottomUnit}`
      element.style.left = `${left}${toLeftUnit}`
    }
  }
}
