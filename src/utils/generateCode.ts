export const generateCode = (): string => {
  const code = Math.floor(1000 + Math.random() * 9000).toString()
  return code
}
