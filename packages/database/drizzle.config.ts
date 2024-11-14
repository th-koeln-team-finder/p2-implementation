import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config()
config({ path: '.env.local', override: true })

export default defineConfig({
  dialect: 'postgresql',
  schema: './schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
})
