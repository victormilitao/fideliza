import z from 'zod'

export const createCampaignSchema = z.object({
  business_id: z.string().nonempty('Campo obrigatório'),
  rule: z.string().nonempty('Campo obrigatório'),
  prize: z.string().nonempty('Campo obrigatório'),
  stamps_required: z.coerce
    .number({ invalid_type_error: 'Informe um número válido' })
    .min(1, 'Mínimo de 1 selo')
    .max(99, 'Máximo de 99 selos'),
})
