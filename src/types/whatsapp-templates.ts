export type WhastappTemplates = LoginCustomer | FirstStamp | CountStamps | StampsCompleted

export const LoginCustomerSid = 'HXab47fdb19a1c243151a5c77751801c38'
export type LoginCustomer = {
  1: string
  message: string
}

export const FirstStampSid = 'HXc0cc83eaf5ad0a84cb200acbbb31b973'
export type FirstStamp = {
  businessName: string
  stampsRequired: string
  link: string
  message: string
}

export const CountStampsSid = 'HX7b54ceeb8e5f44385f0438e585c03298'
export type CountStamps = {
  businessName: string
  stampsRequired: string
  link: string
  stampsCount: string
  message: string
}

export const StampsCompletedSid = 'HX96f26f4d5e17816e39e1e4efe8ef90c0'
export type StampsCompleted = {
  businessName: string
  stampsRequired: string
  link: string
  code: string
  message: string
}
