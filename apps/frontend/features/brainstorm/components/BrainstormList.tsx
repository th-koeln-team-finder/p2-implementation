import { getBrainstorms } from '@/features/brainstorm/brainstorm.queries'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'

export async function BrainstormList() {
  const brainstorms = await getBrainstorms()
  return brainstorms.map((brainstorm) => (
    <BrainstormListEntry key={brainstorm.id} brainstorm={brainstorm} />
  ))
}
