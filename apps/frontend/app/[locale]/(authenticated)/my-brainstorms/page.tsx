import {CanUserServer} from '@/features/auth/components/CanUser.server'
import {BrainstormList} from '@/features/brainstorm/components/BrainstormList'
import {BrainstormListLoading} from '@/features/brainstorm/components/loading/BrainstormListLoading'
import {Link, redirect} from '@/features/i18n/routing'
import {ScrollTopButton} from '@repo/design-system/components/custom/ScrollTopButton'
import {Button} from '@repo/design-system/components/ui/button'
import {BrainIcon} from 'lucide-react'
import {getLocale, getTranslations} from 'next-intl/server'
import {Suspense} from 'react'
import {getSession} from 'next-auth/react'
import {authMiddleware} from "@/auth";
import {getUser} from "@/features/users/users.query";

export default async function MyBrainstormsPage({
                                                  searchParams,
                                                }: {
  searchParams: Promise<{
    search: string
    offset: string
    bookmarks: string
  }>
}) {
  const [translate, { search, offset, bookmarks }] = await Promise.all([
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
          <Suspense key={search} fallback={<BrainstormListLoading />}>
            <BrainstormList
              search={search}
              offset={offset}
              bookmarks={bookmarks}
              createdById={session.user.id}
            />
          </Suspense>
          <ScrollTopButton />
        </section>
      </div>

      <CanUserServer target="brainstorm" action="create">
        <div className="pointer-events-none fixed right-0 bottom-0 left-0 flex flex-row justify-end p-4">
          <Link href="/brainstorm/create">
            <Button className="pointer-events-auto">
              <BrainIcon />
              {translate('createButton')}
            </Button>
          </Link>
        </div>
      </CanUserServer>
    </div>
  )
}