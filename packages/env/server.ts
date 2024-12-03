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
  },
  emptyStringAsUndefined: true,
  isServer: true,
  runtimeEnv: process.env,
  onValidationError,
  onInvalidAccess,
})
