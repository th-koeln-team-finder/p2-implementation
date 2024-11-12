'use client';

import { createEnv } from '@t3-oss/env-core';
import { onInvalidAccess, onValidationError } from './utils';

export const clientEnv = createEnv({
  clientPrefix: 'PUBLIC_',
  client: {},
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  onValidationError,
  onInvalidAccess,
});
