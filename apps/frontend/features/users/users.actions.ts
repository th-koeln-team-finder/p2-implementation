'use server'

import {getUserProjects} from "@/features/users/users.query";

export async function loadMoreProjects(count = 10, offset = 0) {
  return await getUserProjects(1, count, offset)
}