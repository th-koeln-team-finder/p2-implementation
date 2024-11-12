import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config();
config({ path: '.env.local', override: true });

export default defineConfig({
  dialect: 'postgresql',
  schema: './schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: 'postgresql://dbadmin:dbadmin@127.0.0.1:5432/collaborize',
  },
  verbose: true,
  strict: true,
});
