import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const test = pgTable('test', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const TEST = 1;
