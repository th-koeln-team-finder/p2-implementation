import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import { onInvalidAccess, onValidationError } from './utils';

export const serverEnv = createEnv({
  server: {
    MINIO_ENDPOINT: z.string().min(1),
    MINIO_PORT: z.coerce.number(),
    MINIO_BUCKET_NAME: z.string().min(1),
    MINIO_ACCESS_KEY: z.string().min(1),
    MINIO_SECRET_KEY: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  isServer: true,
  runtimeEnv: process.env,
  onValidationError,
  onInvalidAccess,
});
