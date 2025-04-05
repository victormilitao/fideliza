import { useMask } from '@react-input/mask'
import { getMaskConfig, MaskType } from '@/utils/mask-utils'

type CustomMask = { mask: string; replacement?: Record<string, RegExp> }

export const useInputMask = (
  maskType?: MaskType,
  customMask?: CustomMask
) => {
  const maskConfig = getMaskConfig(maskType, customMask)
  return useMask(maskConfig)
}
