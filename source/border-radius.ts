import type { TweenPropertyDriver } from '@anymotion/core'
import { isHTMLElementType } from './common'

declare global {
  interface TweenProperties {
    /** 圆角；语法参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius */
    borderRadius?: string
  }
}

type OrderRadiusItem = [string, string]

interface OrderRadius {
  topLeft: OrderRadiusItem
  topRight: OrderRadiusItem
  bottomLeft: OrderRadiusItem
  bottomRight: OrderRadiusItem
}

function parseBorderRadiusSyntax(borderRadius: string): OrderRadius {
  function parseRadiusValue(value: string): OrderRadiusItem {
    const parts = value.split("/")
    const horizontalValue = parts[0].trim()
    const verticalValue = parts[1]?.trim() || horizontalValue

    return [horizontalValue, verticalValue]
  }


  const values = borderRadius.split(" ")
  const orderRadius: Partial<OrderRadius> = {}

  if (values.length === 1) {
    const singleValue = values[0].trim()
    const [horizontalValue, verticalValue] = parseRadiusValue(singleValue)

    orderRadius.topLeft = [horizontalValue, verticalValue]
    orderRadius.topRight = [horizontalValue, verticalValue]
    orderRadius.bottomLeft = [horizontalValue, verticalValue]
    orderRadius.bottomRight = [horizontalValue, verticalValue]
  } else if (values.length === 2) {
    const [topLeftValue, bottomRightValue] = values.map((value) =>
      parseRadiusValue(value.trim())
    )

    orderRadius.topLeft = topLeftValue
    orderRadius.bottomRight = bottomRightValue

    // 使用对角线对称的值来填充其余的角
    orderRadius.topRight = [...topLeftValue]
    orderRadius.bottomLeft = [...bottomRightValue]
  } else if (values.length === 3) {
    const [topLeftValue, topRightValue, bottomLeftRightValue] = values.map((value) =>
      parseRadiusValue(value.trim())
    )

    orderRadius.topLeft = topLeftValue
    orderRadius.topRight = topRightValue
    orderRadius.bottomLeft = bottomLeftRightValue

    // 使用与 topLeft 相同的值来填充 bottomRight 角
    orderRadius.bottomRight = [...topLeftValue]
  } else if (values.length === 4) {
    const [topLeftValue, topRightValue, bottomRightValue, bottomLeftValue] = values.map(
      (value) => parseRadiusValue(value.trim())
    )

    orderRadius.topLeft = topLeftValue
    orderRadius.topRight = topRightValue
    orderRadius.bottomRight = bottomRightValue
    orderRadius.bottomLeft = bottomLeftValue
  } else {
    throw new Error('??')
  }

  return orderRadius as OrderRadius
}

function getRawBorderRadius(element: Element): string {
  const style = window.getComputedStyle(element, null)
  return style.borderRadius
}

export const scale: TweenPropertyDriver = ({ from, to }, element) => {
  if (!isHTMLElementType(element)) return null

  const rawOrderRadius = getRawBorderRadius(element)

  const localTo = parseBorderRadiusSyntax(to?.borderRadius ?? rawOrderRadius)
  const localFrom = parseBorderRadiusSyntax(from?.borderRadius ?? rawOrderRadius)

  return {
    drive(progress) {
      // element.style.borderRadius
    }
  }
}
