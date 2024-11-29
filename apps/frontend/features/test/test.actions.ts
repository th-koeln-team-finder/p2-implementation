'use server'

import { TestTags } from '@/features/test/test.constants'
import { Schema, db } from '@repo/database'
import { revalidateTag } from 'next/cache'

export async function addRandomTest() {
  const _res = await db
      .insert(Schema.test)
      .values({ name: 'test', checked: false })
      .execute()
  revalidateTag(TestTags.items)
}

export async function removeAllTests() {
  const _res = await db.delete(Schema.test).execute()
  revalidateTag(TestTags.items)
}
