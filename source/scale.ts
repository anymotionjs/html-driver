import type { TweenPropertyDriver } from '@anymotion/core'
import { createNumberInterpolate, isFalsyProperty, isHTMLElementType } from './common'

declare global {
  interface TweenProperties {
    /** 缩放；取值范围 [-1,1] */
    scale?: number | [number, number]
  }
}

function getRawScale(element: Element): number | [number, number] {
  const style = window.getComputedStyle(element, null).scale
  if (style === 'none') return 1
  const [width, height] = style
    .split(' ')
    .filter(Boolean)
    .map(i => parseFloat(i.trim()))

  return [width, height]
}

export const scale: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null
  if (isFalsyProperty(['scale'], to, from)) return null

  const rawScale = getRawScale(element)
  const localTo = to?.scale ?? rawScale
  const localFrom = from?.scale ?? rawScale

  const [toWidth, toHeight] = Array.isArray(localTo) ? localTo : [localTo, 1]
  const [fromWidth, fromHeight] = Array.isArray(localFrom) ? localFrom : [localFrom, 1]

  const widthInterpolate = createNumberInterpolate(fromWidth, toWidth, { decimalPlaces: 2, min: 0 })
  const heightInterpolate = createNumberInterpolate(fromHeight, toHeight, { decimalPlaces: 2, min: 0 })

  return {
    drive(progress) {
      const width = widthInterpolate(progress)
      const height = heightInterpolate(progress)
      element.style.scale = `${width} ${height}`
    }
  }
}
