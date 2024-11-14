import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import { onInvalidAccess, onValidationError } from './utils'

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  isServer: true,
  runtimeEnv: process.env,
  onValidationError,
  onInvalidAccess,
})
