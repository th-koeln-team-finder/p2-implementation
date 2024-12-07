import { authMiddleware } from '@/auth'
import { routing } from '@/features/i18n/routing'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware(routing)

export default authMiddleware(intlMiddleware)

export const config = {
  matcher: [
    '/',
    '/(de|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
