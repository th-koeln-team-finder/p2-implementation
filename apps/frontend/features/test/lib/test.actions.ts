'use server';

import { db, schema } from '@/features/common/db';
import { revalidateTag } from 'next/cache';
import { TestTags } from '@/features/test/test.constants';

export async function addTestItem() {
  await db.insert(schema.test).values({ name: 'test' });
  revalidateTag(TestTags.data);
}

export async function deleteAllTestItems() {
  await db.delete(schema.test).execute();
  revalidateTag(TestTags.data);
}
