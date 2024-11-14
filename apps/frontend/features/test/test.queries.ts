import { TestTags } from '@/features/test/test.constants'
import { db } from '@repo/database'
import { unstable_cache as cache } from 'next/cache'

export const getTestItems = cache(
  () => db.query.test.findMany(),
  ['getTestItems'],
  { tags: [TestTags.items] },
)
