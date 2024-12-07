import type { ZodError } from 'zod'

export function onValidationError(error: ZodError): never {
  console.error('❌ | Invalid environment variables:', error.flatten().fieldErrors)
  throw new Error('Unreachable')
}

export function onInvalidAccess(variable: string): never {
  console.error(`❌ | Attempted to access server-side environment variable on client: ${variable}`)
  throw new Error('Unreachable')
}
