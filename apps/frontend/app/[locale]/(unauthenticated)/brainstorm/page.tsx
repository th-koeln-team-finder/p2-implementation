import { CanUserServer } from '@/features/auth/components/CanUser.server'
import { BrainstormList } from '@/features/brainstorm/components/BrainstormList'
import { BrainstormListLoading } from '@/features/brainstorm/components/loading/BrainstormListLoading'
import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { BrainIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

export default async function BrainstormPage() {
  const translate = await getTranslations('brainstorm')
  return (
    <div className="h-screen">
      <div className="container mx-auto px-4">
        <Suspense fallback={<BrainstormListLoading />}>
          <BrainstormList />
        </Suspense>
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
