import z from 'zod'

export const createCampaignSchema = z.object({
  business_id: z.string().nonempty('Campo obrigatório'),
  rule: z.string().nonempty('Campo obrigatório'),
  prize: z.string().nonempty('Campo obrigatório'),
  stamps_required: z
    .number()
    .min(1, 'Mínimo de 1 selo')
    .max(100, 'Máximo de 100 selos'),
})
