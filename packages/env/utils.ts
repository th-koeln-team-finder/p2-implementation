import type { ZodError } from 'zod'

export function onValidationError(error: ZodError): never {
  console.error('❌ | Invalid environment variables:', error.flatten().fieldErrors)
  process.exit(1)
}

export function onInvalidAccess(variable: string): never {
  console.error(`❌ | Attempted to access server-side environment variable on client: ${variable}`)
  process.exit(1)
}
