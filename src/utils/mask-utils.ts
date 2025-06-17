export type MaskType = 'phone' | 'cpf' | 'date'

export type MaskOptions = {
  mask: string
  replacement?: Record<string, RegExp>
}

export const maskMap: Record<MaskType, MaskOptions> = {
  phone: { mask: '(__) _ ____ ____', replacement: { _: /\d/ } },
  cpf: { mask: '___.___.___-__', replacement: { _: /\d/ } },
  date: { mask: '__/__/____', replacement: { _: /\d/ } },
}

export const getMaskConfig = (
  maskType?: MaskType,
  customMask?: { mask: string; replacement?: Record<string, RegExp> }
) => {
  return customMask ?? (maskType ? maskMap[maskType] : undefined)
}

export const applyMask = (
  value: string | undefined,
  maskType: MaskType
): string | undefined => {
  const maskConfig = getMaskConfig(maskType)
  if (!value || !maskConfig) return value

  let maskedValue = maskConfig.mask
  let valueIndex = 0

  for (let i = 0; i < maskedValue.length; i++) {
    if (maskedValue[i] === '_') {
      maskedValue =
        maskedValue.substring(0, i) +
        (value[valueIndex] || '') +
        maskedValue.substring(i + 1)
      valueIndex++
    }
  }

  return maskedValue
}
