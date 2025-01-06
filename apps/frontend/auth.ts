import { DrizzleHttpAdapter } from '@/features/auth/DrizzleHttpAdapter'
import type { UserSelect } from '@repo/database/schema'
import { serverEnv } from '@repo/env/server'
import NextAuth from 'next-auth'
import Passkey from 'next-auth/providers/passkey'

const FRONTEND_HOST = serverEnv.FRONTEND_URL.replace(/^https?:\/\//, '')

declare module 'next-auth' {
  interface Session {
    user: UserSelect
  }
}

export const {
  handlers,
  signOut,
  auth: authMiddleware,
} = NextAuth({
  adapter: DrizzleHttpAdapter,
  session: {
    strategy: 'database',
  },
  pages: {
    error: '/error',
  },
  providers: [
    Passkey({
      relayingParty: {
        id: FRONTEND_HOST,
        origin: serverEnv.FRONTEND_URL,
        name: 'Collaborize App',
      },
      getUserInfo: async (options, request) => {
        const { adapter = DrizzleHttpAdapter } = options

        // Get email address from the query.
        const { query, body, method } = request
        const name = method === 'POST' ? body?.name : query?.name
        const email = (
          method === 'POST' ? body?.email : query?.email
        ) as unknown

        // If email is not provided, return null
        if (!email || typeof email !== 'string') return null

        const existingUser = await adapter.getUserByEmail(email)
        if (existingUser) {
          return { user: existingUser, exists: true }
        }

        if (!name) return null

        // If the user does not exist, return a new user info.
        return { user: { email, name }, exists: false }
      },
    }),
  ],
  callbacks: {
    session: ({ session }) => {
      return session
    },
    redirect: ({ url, baseUrl }) => {
      let res = baseUrl
      // Allows relative callback URLs
      if (url.startsWith('/')) res = `${baseUrl}${url}`

      const urlOrigin = new URL(res).origin
      // Allows callback URLs on the same origin or to the frontend host
      if (urlOrigin === baseUrl || url.includes(FRONTEND_HOST)) res = url

      return res
    },
  },
  experimental: { enableWebAuthn: true },
})
