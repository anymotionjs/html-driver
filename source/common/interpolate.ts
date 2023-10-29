import { splitNumberUnit } from './common'

interface NumberInterpolateOptions {
  max?: number
  min?: number
  decimalPlaces?: number
}

/**
 * 计算两个数字之间的差值
 */
export function createNumberInterpolate(start: number, end: number, options?: NumberInterpolateOptions) {
  const { max, min, decimalPlaces } = options ?? {}
  const range = Math.abs(end - start)
  const direction = end >= start ? 1 : -1

  return (progress: number) => {
    const value = start + direction * range * progress
    const final = Number(value.toFixed(decimalPlaces))
    if (max != null && final > max) max
    if (min != null && final < min) min
    return final
  }
}

/**
 * 计算两个颜色之间的差值
 */
export function createColorInterpolate(start: string, end: string) {
  type RGBA = [number, number, number, number]

  function parseHexStringToRGBA(hex: string): RGBA {
    let color = hex.replace("#", "")

    // 处理缩写形式的十六进制颜色值（如 #ABC）
    if (color.length === 3) {
      color = color
        .split("")
        .map((char) => char + char)
        .join("")
    }

    // 提取颜色分量
    const r = parseInt(color.substring(0, 2), 16)
    const g = parseInt(color.substring(2, 4), 16)
    const b = parseInt(color.substring(4, 6), 16)

    // 检查是否存在 alpha 分量
    let a = 255
    if (color.length === 8) {
      a = parseInt(color.substring(6, 8), 16)
    }

    return [r, g, b, a]
  }

  function parseRGBStringToRGBA(rgb: string): RGBA {
    const values = rgb
      .substring(rgb.indexOf("(") + 1, rgb.indexOf(")"))
      .split(",")
      .map((value) => parseFloat(value.trim()))

    const [r, g, b] = values
    return [r, g, b, 255]
  }

  function parseRGBAStringToRGBA(rgba: string): RGBA {
    const values = rgba
      .substring(rgba.indexOf("(") + 1, rgba.indexOf(")"))
      .split(",")
      .map((value) => parseFloat(value.trim()))

    const [r, g, b, a = 255] = values
    return [r, g, b, a]
  }

  function getColorStringType(value: string) {
    if (value.startsWith("#")) return 'hex'
    if (value.startsWith("rgb(")) return 'rgb'
    if (value.startsWith("rgba(")) return 'rgba'
  }

  function parseStringToRGBA(value: string): RGBA {
    const type = getColorStringType(value)
    if (type === 'hex') return parseHexStringToRGBA(value)
    if (type === 'rgb') return parseRGBStringToRGBA(value)
    if (type === 'rgba') return parseRGBAStringToRGBA(value)
    throw new Error('??')
  }

  const [toR, toG, toB, toA] = parseStringToRGBA(end)
  const [fromR, fromG, fromB, fromA] = parseStringToRGBA(start)
  const rInterpolate = createNumberInterpolate(fromR, toR, { decimalPlaces: 0, max: 255, min: 0 })
  const gInterpolate = createNumberInterpolate(fromG, toG, { decimalPlaces: 0, max: 255, min: 0 })
  const bInterpolate = createNumberInterpolate(fromB, toB, { decimalPlaces: 0, max: 255, min: 0 })
  const aInterpolate = createNumberInterpolate(fromA, toA, { decimalPlaces: 0, max: 255, min: 0 })

  return (progress: number) => {
    const r = rInterpolate(progress)
    const g = gInterpolate(progress)
    const b = bInterpolate(progress)
    const a = aInterpolate(progress)
    return `rgba(${r},${g},${b},${a})`
  }
}

/**
 * 计算两个角度之间的差值
 */
export function createAngleInterpolate(start: string, end: string) {
  const [from,] = splitNumberUnit(start)
  const [to,] = splitNumberUnit(end)
  const interpolate = createNumberInterpolate(from, to, { decimalPlaces: 2, max: 360, min: 0 })
  return (progress: number) => `${interpolate(progress)}deg`
}
