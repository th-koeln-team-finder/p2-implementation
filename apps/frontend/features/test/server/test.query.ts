import 'server-only';

import { db } from '@/features/common/db';
import { unstable_cache } from 'next/cache';
import { TestTags } from '@/features/test/test.constants';

export const getAllTestItems = unstable_cache(
  async () => db.query.test.findMany(),
  ['getAllTestItems'],
  { revalidate: 3600, tags: [TestTags.data] },
);
