import z from 'zod'
import { validateCep } from '@/utils/inputValidations/validateCep'
import { validateCnpj } from '@/utils/inputValidations/validateCnpj'
import { validatePhone } from '@/utils/inputValidations/validatePhone'

export const createBusinessSchema = z.object({
  user_id: z.string().optional(),
  name: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
  cnpj: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório')
    .refine(validateCnpj, {
      message: 'CNPJ inválido',
    }),
  cep: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório')
    .refine(validateCep, {
      message: 'CEP inválido',
    }),
  state: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  street_number: z.string().optional(),
  complement: z.string().optional(),
  phone: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório')
    .refine(validatePhone, {
      message: 'Telefone inválido',
    }),
})
