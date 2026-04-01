export const categorizeConfigArray = (
  inputConfigArray: any,
  transposedConfigMap,
) => {
  return inputConfigArray.reduce(
    (p: any, c: any) => {
      const targetKey = c.key ?? c.title
      const categoryName = transposedConfigMap[targetKey] ?? "custom"
      if (p[categoryName]) {
        p[categoryName].push(c)
      } else {
        p[categoryName] = [c]
      }
      return p
    },
    {} as { [key: string]: any[] },
  )
}
