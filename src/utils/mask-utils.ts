export type MaskType = 'phone' | 'cpf' | 'date'

export type MaskOptions = {
  mask: string
  replacement?: Record<string, RegExp>
}

export const maskMap: Record<MaskType, MaskOptions> = {
  phone: { mask: '(__) _ ____-____', replacement: { _: /\d/ } },
  cpf: { mask: '___.___.___-__', replacement: { _: /\d/ } },
  date: { mask: '__/__/____', replacement: { _: /\d/ } },
}

export const getMaskConfig = (
  maskType?: MaskType,
  customMask?: { mask: string; replacement?: Record<string, RegExp> }
) => {
  return customMask ?? (maskType ? maskMap[maskType] : undefined)
}
