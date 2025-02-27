import 'server-only'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { serverEnv } from '@repo/env/server'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { users } from './schema'

export const Schema = schema

export const db = drizzle({
  schema: Schema,
  connection: {
    connectionString: serverEnv.DATABASE_URL,
  },
  logger: true,
})

export const CustomDrizzleAdapter: typeof DrizzleAdapter = (db, schema) => {
  const adapter = DrizzleAdapter(db, schema)

  return {
    ...adapter,
    async getUser(id: string) {
      if (!adapter.getUser) {
        return await db.query.users.where(eq(users.id, id)).execute()
      }
      const user = await adapter.getUser(id)
      if (user) {
        await db
          .update(users)
          .set({ lastActive: new Date() })
          .where(eq(users.id, id))
          .execute()
      }
      return user
    },
  }
}

export const AuthDrizzleAdapter = CustomDrizzleAdapter(db, {
  usersTable: schema.users,
  accountsTable: schema.accounts,
  sessionsTable: schema.sessions,
  authenticatorsTable: schema.authenticators,
})
