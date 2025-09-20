import { z } from 'zod/v4'

import { clients } from '@/db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const insertClientSchema = createInsertSchema(clients, {
  name: schema =>
    schema
      .min(1, 'Name is required')
      .max(100, { error: 'Name must be at most 100 characters!' }),
  userId: schema => schema.min(1, 'UserId is required')
})

export const selectClientSchema = createSelectSchema(clients)

export type insertClientSchemaType = z.infer<typeof insertClientSchema>
export type selectClientSchemaType = z.infer<typeof selectClientSchema>
