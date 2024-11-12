'use client';

import { Button } from '@components/ui/button';
import { addTestItem, deleteAllTestItems } from '@/features/test';
import { PlusIcon, TrashIcon } from 'lucide-react';

export function TestButton() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Button type="button" onClick={addTestItem}>
        <PlusIcon size={24} />
        Add another test item
      </Button>
      <Button type="button" variant="destructive" onClick={deleteAllTestItems}>
        <TrashIcon size={24} />
        Clear all test items
      </Button>
    </div>
  );
}
