
/**  判断字符串是否包含中文  */
export const hasChinese = (str: string) => {
  return /[\u4e00-\u9fa5]/.test(str)
}
