export const validateCep = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  return /^\d{8}$/.test(cleaned)
}
