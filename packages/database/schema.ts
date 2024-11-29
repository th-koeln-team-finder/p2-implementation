import { boolean, integer, json, pgTable, varchar } from 'drizzle-orm/pg-core'

export const test = pgTable('test', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  checked: boolean().notNull().default(false),
})

export const projects = pgTable('projects', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  status: varchar({ enum: ['open', 'closed'] }).notNull(),
  createdAt: varchar({ length: 255 }).notNull(),
  updatedAt: varchar({ length: 255 }).notNull(),
  isPublic: boolean().notNull().default(true),
  allowApplications: boolean().notNull().default(true),
  additionalInfo: json().default({}),
})

export type TestInsert = typeof test.$inferInsert
export type ProjectInsert = typeof projects.$inferInsert
export type TestSelect = typeof test.$inferSelect
export type ProjectSelect = typeof projects.$inferSelect
