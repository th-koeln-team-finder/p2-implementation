'use client'

import {createEnv} from '@t3-oss/env-core'
import {onInvalidAccess, onValidationError} from './utils'
import {z} from 'zod'

export const clientEnv = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_MAX_FILE_SIZE: z.coerce.number().int().min(1),
    NEXT_PUBLIC_ALLOWED_FILE_TYPES: z.string().min(1).transform((s) => s.split(",").map((s) => s.trim()).filter(Boolean)).pipe(z.array(z.string().min(1))),
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  isServer: false,
  skipValidation: true,
  runtimeEnv: {
    NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE,
    NEXT_PUBLIC_ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  },
  onValidationError,
  onInvalidAccess,
})