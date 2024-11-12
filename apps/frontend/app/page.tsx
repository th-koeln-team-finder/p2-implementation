import { TestButton } from '@/features/test';
import { getAllTestItems } from '@/features/test/server';

export default async function Home() {
  const data = await getAllTestItems();

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-5xl font-semibold">Normal heading</h1>
      <h2 className="mb-8 text-3xl">Normal font</h2>

      <h1 className="font-head text-5xl font-semibold">Other Heading</h1>
      <h2 className="mb-8 font-head text-3xl">Other font</h2>

      <div className="align-center flex flex-row justify-between gap-2 bg-card">
        <h3 className="mb-2 mt-4 font-head text-3xl">Test Data</h3>
        <TestButton />
      </div>

      <ul className="list-inside list-decimal">
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      {data.length === 0 && <p className="text-muted-foreground">No items found</p>}
    </div>
  );
}
