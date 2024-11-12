import { serverEnv } from '@/env/server';
import { makeDBConnection } from '@project/database/db';
import * as schemaRaw from '@project/database/schema';

export const db = makeDBConnection(serverEnv.DATABASE_URL);

export const schema = schemaRaw;
