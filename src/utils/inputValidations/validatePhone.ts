export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return /^(\d{10}|\d{11})$/.test(cleaned)
}
