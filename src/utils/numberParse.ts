
export type Options = {
  /** 保留小数点精度 */
  digits?: number
  /** 处理成浮点数 */
  isFloat?: boolean
  /** 自定义匹配规则 */
  customRegexp?: RegExp
}
/** 整数匹配 */
const INTEGER_REGEXP = /-?\d+/g
/** 浮点数匹配 */
const FLOAT_REGEXP = /-?\d+(\.\d+)?/g

export default (str: string, options?: Options): string => {
  const { digits, isFloat, customRegexp } = options ?? {}
  let matchRegexp: RegExp = INTEGER_REGEXP
  if (customRegexp) {
    matchRegexp = customRegexp
  } else if (isFloat) {
    matchRegexp = FLOAT_REGEXP
  }
  const matchs: string[] = str.match(matchRegexp) ?? []
  if (digits === undefined) {
    // 保留全部小数位
    return matchs[0]
  } else {
    return matchs.map(item => Number(item).toFixed(digits))[0]
  }
}
