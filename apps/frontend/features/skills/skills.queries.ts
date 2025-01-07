'use server'

import {db} from '@repo/database'
import {like} from "drizzle-orm";
import {skills} from "@repo/database/schema";

export async function searchSkills(input: string) {
  return await db.query.skills.findMany({
    where: like(skills.skill, `%${input}%`),
  });
}