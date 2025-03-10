import 'server-only'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { serverEnv } from '@repo/env/server'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const Schema = schema

export const db = drizzle({
  schema: Schema,
  connection: {
    connectionString: serverEnv.DATABASE_URL,
  },
  logger: true,
})

export const AuthDrizzleAdapter = DrizzleAdapter(db, {
  usersTable: schema.users,
  accountsTable: schema.accounts,
  sessionsTable: schema.sessions,
  authenticatorsTable: schema.authenticators,
})
