import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import { onInvalidAccess, onValidationError } from './utils'

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    FRONTEND_URL: z.string().min(1),
    API_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AUTH_TRUST_HOST: z.string().nullish().transform((s) => s !== "false" && s !== "0"),
    AUTH_REDIRECT_PROXY_URL: z.string().nullish(),
    MINIO_BUCKET: z.string().min(1),
    MINIO_PATH: z.string().min(1),
    MINIO_PUBLIC_HOST: z.string().min(1),
    MINIO_HOST: z.string().min(1),
    MINIO_PORT: z.coerce.number().int().min(1),
    MINIO_ACCESS_KEY: z.string().min(1),
    MINIO_SECRET_KEY: z.string().min(1),
    MAX_FILE_SIZE: z.coerce.number().int().min(1),
    ALLOWED_FILE_TYPES: z.string().min(1).transform((s) => s.split(",").map((s) => s.trim()).filter(Boolean)).pipe(z.array(z.string().min(1))),
  },
  emptyStringAsUndefined: true,
  isServer: true,
  runtimeEnv: process.env,
  onValidationError,
  onInvalidAccess,
})
