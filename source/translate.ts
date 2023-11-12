import type { TweenPropertyDriver } from '@anymotion/core'
import { createNumberInterpolate, isFalsyProperty, isHTMLElementType, splitNumberUnit } from './common'

declare global {
  interface TweenProperties {
    translate?: string
  }
}

function getRawTranslate(element: Element): string {
  const style = window.getComputedStyle(element, null)
  return style.translate
}

function parseTranslate(value: string): [string, string, string] {
  if (!value || value == 'none') return ['0', '0', '0']
  const [x = '0', y = '0', z = '0'] = value.split(' ')
  return [x, y, z]
}

export const translate: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null
  if (isFalsyProperty(['translate', 'translate'], to, from)) return null

  const rawTranslate = getRawTranslate(element)

  const [toX, toY, toZ] = parseTranslate(to?.translate ?? rawTranslate)
  const [fromX, fromY, fromZ] = parseTranslate(from?.translate ?? rawTranslate)

  const [toNumberX, toUnitX] = splitNumberUnit(toX)
  const [toNumberY, toUnitY] = splitNumberUnit(toY)
  const [toNumberZ, toUnitZ] = splitNumberUnit(toZ)
  const [fromNumberX, fromUnitX] = splitNumberUnit(fromX)
  const [fromNumberY, fromUnitY] = splitNumberUnit(fromY)
  const [fromNumberZ, fromUnitZ] = splitNumberUnit(fromZ)

  if (toUnitX && fromUnitX && fromUnitX != toUnitX) throw new Error('')
  if (toUnitY && fromUnitY && fromUnitY != toUnitY) throw new Error('')
  if (toUnitZ && fromUnitZ && fromUnitZ != toUnitZ) throw new Error('')

  const xInterpolate = createNumberInterpolate(fromNumberX, toNumberX, { decimalPlaces: 2 })
  const yInterpolate = createNumberInterpolate(fromNumberY, toNumberY, { decimalPlaces: 2 })
  const zInterpolate = createNumberInterpolate(fromNumberZ, toNumberZ, { decimalPlaces: 2 })


  return {
    drive(progress) {
      const x = xInterpolate(progress)
      const y = yInterpolate(progress)
      const z = zInterpolate(progress)
      element.style.translate = `${x}${toUnitX} ${y}${toUnitY} ${z}${toUnitZ}`
    }
  }
}
