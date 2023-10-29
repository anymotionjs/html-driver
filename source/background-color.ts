import type { TweenPropertyDriver } from '@anymotion/core'
import { createColorInterpolate, isHTMLElementType } from './common'

declare global {
  interface TweenProperties {
    backgroundColor?: string
  }
}

function getRawBackgroundColor(element: Element): string {
  const style = window.getComputedStyle(element, null)
  return style.backgroundColor
}

export const backgroundColor: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null

  const rawColor = getRawBackgroundColor(element)

  const localTo = to?.backgroundColor ?? rawColor
  const localFrom = from?.backgroundColor ?? rawColor

  const interpolate = createColorInterpolate(localFrom, localTo)

  return {
    transform(progress) {
      const color = interpolate(progress)
      element.style.backgroundColor = `${color}`
    }
  }
}
