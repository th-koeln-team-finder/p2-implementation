import {boolean, integer, pgTable, varchar, json} from 'drizzle-orm/pg-core'

export const test = pgTable('test', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    checked: boolean().notNull().default(false),
})

export const projects = pgTable('projects', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    description: varchar({length: 255}).notNull(),
    status: varchar({ enum: ["open", "closed"] }).notNull(),
    created_at: varchar({length: 255}).notNull(),
    updated_at: varchar({length: 255}).notNull(),
    isPublic: boolean().notNull().default(true),
    allowApplications: boolean().notNull().default(true),
    additionalInfo: json().default({}),
})

export type TestInsert = typeof test.$inferInsert
export type ProjectInsert = typeof projects.$inferInsert
export type TestSelect = typeof test.$inferSelect
export type ProjectSelect = typeof projects.$inferSelect
