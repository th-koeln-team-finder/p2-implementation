import { getTestItems } from '@/features/test/test.queries'

export async function TestItemList() {
  const data = await getTestItems()
  if (!data.length)
    return <p className="text-muted-foreground italic">No data</p>
  return (
    <ul className="list-inside list-decimal">
      {data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
