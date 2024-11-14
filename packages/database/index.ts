import 'server-only'

import { serverEnv } from '@repo/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const Schema = schema

export const db = drizzle({
  schema: Schema,
  connection: {
    connectionString: serverEnv.DATABASE_URL,
  },
})
