export type WhastappTemplates = LoginCustomer | FirstStamp | CountStamps | StampsCompleted

export const LoginCustomerSid = 'HXab47fdb19a1c243151a5c77751801c38'
export type LoginCustomer = {
  1: string
  message: string
}

export const FirstStampSid = 'HXd66bc68d2f8102519cce22d0736b83ea'
export type FirstStamp = {
  businessName: string
  link: string
  message: string
}

export const CountStampsSid = 'HX29efbd48c0f56c0c27986d8af21f0242'
export type CountStamps = {
  businessName: string
  stampsRequired: string
  link: string
  stampsCount: string
  message: string
}

export const StampsCompletedSid = 'HXfa7fb09b4ed318021bf63e19cf4efa89'
export type StampsCompleted = {
  businessName: string
  stampsRequired: string
  link: string
  code: string
  message: string
}
