export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([A-Z])/g, '_$1').toLowerCase(),
        toSnakeCase(value),
      ])
    )
  }
  return obj
}
