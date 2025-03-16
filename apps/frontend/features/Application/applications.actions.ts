'use server'

import {revalidateTag} from "next/cache";
import {db, Schema} from "@repo/database";
import {eq} from "drizzle-orm";

export const pinApplication = async (applicationId: string, pin: boolean) => {
  await db
    .update(Schema.projectApplication)
    .set({ isPinned: pin })
    .where(eq(Schema.projectApplication.id, applicationId))

  // await revalidateApplications()
}

export async function revalidateApplications() {
  await revalidateTag('applications')
}