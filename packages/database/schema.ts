import { boolean, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const test = pgTable('test', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  checked: boolean().notNull().default(false),
})
