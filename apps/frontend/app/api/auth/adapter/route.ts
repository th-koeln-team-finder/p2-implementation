import { AuthDrizzleAdapter } from '@repo/database'
import superjson from 'superjson'

export const revalidate = 0

function makeResponse(data: unknown) {
  return new Response(superjson.stringify(data), {
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams.entries())
  const bodyRaw = await request.json()
  // biome-ignore lint/suspicious/noExplicitAny: This will always contain the request types with the parameters needed for the adapter
  const body = superjson.deserialize<any>(bodyRaw)
  switch (params.action) {
    case 'getSessionAndUser':
      return makeResponse(
        await AuthDrizzleAdapter.getSessionAndUser?.(body.sessionToken),
      )
    case 'createUser':
      return makeResponse(await AuthDrizzleAdapter.createUser?.(body.user))
    case 'createSession':
      return makeResponse(
        await AuthDrizzleAdapter.createSession?.(body.session),
      )
    case 'createAuthenticator':
      return makeResponse(
        await AuthDrizzleAdapter.createAuthenticator?.(body.authenticator),
      )
    case 'deleteUser': {
      await AuthDrizzleAdapter.deleteUser?.(body.userId)
      return Response.json(null)
    }
    case 'getAccount':
      return makeResponse(
        await AuthDrizzleAdapter.getAccount?.(
          body.providerAccountId,
          body.provider,
        ),
      )
    case 'getUser':
      return makeResponse(await AuthDrizzleAdapter.getUser?.(body.id))
    case 'deleteSession': {
      await AuthDrizzleAdapter.deleteSession?.(body.sessionToken)
      return Response.json(null)
    }
    case 'getAuthenticator':
      return makeResponse(
        await AuthDrizzleAdapter.getAuthenticator?.(body.credentialID),
      )
    case 'createVerificationToken':
      return makeResponse(
        await AuthDrizzleAdapter.createVerificationToken?.(
          body.verificationToken,
        ),
      )
    case 'getUserByAccount':
      return makeResponse(
        await AuthDrizzleAdapter.getUserByAccount?.(body.providerAccountId),
      )
    case 'getUserByEmail':
      return makeResponse(await AuthDrizzleAdapter.getUserByEmail?.(body.email))
    case 'linkAccount': {
      await AuthDrizzleAdapter.linkAccount?.(body.account)
      return Response.json(null)
    }
    case 'listAuthenticatorsByUserId': {
      await AuthDrizzleAdapter.listAuthenticatorsByUserId?.(body.userId)
      return Response.json(null)
    }
    case 'unlinkAccount':
      return makeResponse(
        await AuthDrizzleAdapter.unlinkAccount?.(body.providerAccountId),
      )
    case 'updateAuthenticatorCounter':
      return makeResponse(
        await AuthDrizzleAdapter.updateAuthenticatorCounter?.(
          body.credentialID,
          body.newCounter,
        ),
      )
    case 'updateSession':
      return makeResponse(
        await AuthDrizzleAdapter.updateSession?.(body.session),
      )
    case 'updateUser':
      return makeResponse(await AuthDrizzleAdapter.updateUser?.(body.user))
    case 'useVerificationToken':
      return makeResponse(
        await AuthDrizzleAdapter.useVerificationToken?.(body.params),
      )
    default:
      return Response.json({ status: 404 })
  }
}
