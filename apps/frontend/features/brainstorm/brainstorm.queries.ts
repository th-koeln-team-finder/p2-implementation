import { Schema, db } from '@repo/database'
import { eq } from 'drizzle-orm'

export function getBrainstorms() {
  return db.query.brainstorms.findMany()
}

export function getSingleBrainstorm(id: string) {
  return db.query.brainstorms.findFirst({
    where: eq(Schema.brainstorms.id, id),
    with: {
      creator: true,
    },
  })
}
