import { authMiddleware } from '@/auth'
import { BrainstormList } from '@/features/brainstorm/components/BrainstormList'
import { redirect } from '@/features/i18n/routing'
import { ScrollTopButton } from '@repo/design-system/components/custom/ScrollTopButton'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function MyBrainstormsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search: string
    offset: string
    bookmarks: string
  }>
}) {
  const [translate] = await Promise.all([
    getTranslations('brainstorm'),
    searchParams,
  ])

  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  return (
    <div className="h-screen">
      <div className="container mx-auto px-4">
        <h1 className="mb-4 font-semibold text-4xl">
          {translate('myBrainstorms.pageTitle')}
        </h1>

        <section className="pb-4">
          <BrainstormList showUserBrainstorms />
          <ScrollTopButton />
        </section>
      </div>
    </div>
  )
}
