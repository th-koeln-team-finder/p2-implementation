import type { AuthDrizzleAdapter } from '@repo/database'
import { serverEnv } from '@repo/env/server'
import type {
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters'
import superjson from 'superjson'

const BASE_URL = `${serverEnv.API_URL}/auth/adapter`

async function sendRequest(
  action: string,
  params: Record<string, unknown>,
  // biome-ignore lint/suspicious/noExplicitAny: This will always return the type of the Drizzle Adapter just through HTTP
): Promise<any> {
  const res = await fetch(`${BASE_URL}?action=${action}`, {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: superjson.stringify(params),
  })
  const resJson = await res.json()
  if (!resJson) return
  return superjson.deserialize(resJson)
}

// This is a workaround, since the original drizzle adapter does not work in the middleware (middlewares only run in an edge environment and therefore do not support the postgres connection)
export const DrizzleHttpAdapter: typeof AuthDrizzleAdapter = {
  getSessionAndUser(sessionToken: string) {
    return sendRequest('getSessionAndUser', { sessionToken })
  },
  createUser(user: AdapterUser) {
    return sendRequest('createUser', { user })
  },
  createSession(session: {
    sessionToken: string
    userId: string
    expires: Date
  }) {
    return sendRequest('createSession', { session })
  },
  createAuthenticator(authenticator: AdapterAuthenticator) {
    return sendRequest('createAuthenticator', { authenticator })
  },
  deleteUser(userId: string) {
    return sendRequest('deleteUser', { userId })
  },
  getAccount(
    providerAccountId: AdapterAccount['providerAccountId'],
    provider: AdapterAccount['provider'],
  ) {
    return sendRequest('getAccount', { providerAccountId, provider })
  },
  getUser(id: string) {
    return sendRequest('getUser', { id })
  },
  deleteSession(sessionToken: string) {
    return sendRequest('deleteSession', { sessionToken })
  },
  getAuthenticator(credentialID: AdapterAuthenticator['credentialID']) {
    return sendRequest('getAuthenticator', { credentialID })
  },
  createVerificationToken(verificationToken: VerificationToken) {
    return sendRequest('createVerificationToken', { verificationToken })
  },
  getUserByAccount(
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ) {
    return sendRequest('getUserByAccount', { providerAccountId })
  },
  getUserByEmail(email: string) {
    return sendRequest('getUserByEmail', { email })
  },
  linkAccount(account: AdapterAccount) {
    return sendRequest('linkAccount', { account })
  },
  listAuthenticatorsByUserId(userId: AdapterAuthenticator['userId']) {
    return sendRequest('listAuthenticatorsByUserId', { userId })
  },
  unlinkAccount(
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ) {
    return sendRequest('unlinkAccount', { providerAccountId })
  },
  updateAuthenticatorCounter(
    credentialID: AdapterAuthenticator['credentialID'],
    newCounter: AdapterAuthenticator['counter'],
  ) {
    return sendRequest('updateAuthenticatorCounter', {
      credentialID,
      newCounter,
    })
  },
  updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ) {
    return sendRequest('updateSession', { session })
  },
  updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
    return sendRequest('updateUser', { user })
  },
  useVerificationToken(params: { identifier: string; token: string }) {
    return sendRequest('useVerificationToken', { params })
  },
}
