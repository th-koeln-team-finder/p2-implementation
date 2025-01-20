'use server'

import {getUserProjects} from "@/features/users/users.query";
import {db, Schema} from "@repo/database";
import {UserInsert} from "@repo/database/schema";
import {eq} from "drizzle-orm";
import {revalidateTag} from "next/cache";

export async function loadMoreProjects(count = 10, offset = 0) {
  return await getUserProjects(1, count, offset)
}

export async function updateUserData(user: Partial<UserInsert>) {
  await db
    .update(Schema.users)
    .set(user)
    .where(eq(Schema.users.id, user.id!))
    .execute()
}

export async function revalidateUser() {
  return revalidateTag('user')
}