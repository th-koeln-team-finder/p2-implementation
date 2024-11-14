import { AddTestButton, RemoveTestButton, TestItemList } from '@/features/test'

// TODO remove - Only for testing
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="container mx-auto my-4">
      <h1 className="font-semibold text-5xl">Normal heading</h1>
      <h2 className="mb-8 text-3xl">Normal font</h2>

      <h1 className="font-head font-semibold text-5xl">Other Heading</h1>
      <h2 className="mb-8 font-head text-3xl">Other font</h2>

      <div className="flex flex-row justify-between gap-2 bg-card align-center">
        <h3 className="mt-4 mb-2 font-head text-3xl">Test Data</h3>
        <div className="ml-auto flex flex-row gap-2">
          <AddTestButton />
          <RemoveTestButton />
        </div>
      </div>

      <TestItemList />
    </div>
  )
}
