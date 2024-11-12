import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export function makeDBConnection(connectionString: string) {
  return drizzle({
    schema: schema,
    connection: {
      connectionString,
    },
  });
}
