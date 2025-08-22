import z from 'zod'
import { validateCep } from '@/utils/inputValidations/validateCep'
import { validateCnpj } from '@/utils/inputValidations/validateCnpj'
import { validatePhone } from '@/utils/inputValidations/validatePhone'

export const createBusinessSchema = z.object({
  user_id: z.string().optional(),
  name: z.string().nonempty('Campo obrigatório'),
  cnpj: z
    .string()
    .nonempty({ message: 'Campo obrigatório' })
    .refine(validateCnpj, {
      message: 'CNPJ inválido',
    }),
  cep: z
    .string()
    .nonempty({ message: 'Campo obrigatório' })
    .refine(validateCep, {
      message: 'CEP inválido',
    }),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  address: z.string(),
  street_number: z.string(),
  complement: z.string().optional(),
  phone: z
    .string()
    .nonempty({ message: 'Campo obrigatório' })
    .refine(validatePhone, {
      message: 'Telefone inválido',
    }),
})
