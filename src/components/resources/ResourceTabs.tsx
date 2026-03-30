'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ResourceTabs({ 
  allCount, 
  freeCount, 
  paidCount 
}: { 
  allCount: number; 
  freeCount: number; 
  paidCount: number; 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', value);
    }
    params.delete('page'); // Reset to page 1 when filter changes
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <Tabs value={currentFilter} onValueChange={handleFilterChange}>
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
        <TabsTrigger value="all">All ({allCount})</TabsTrigger>
        <TabsTrigger value="free">Free ({freeCount})</TabsTrigger>
        <TabsTrigger value="paid">Paid ({paidCount})</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
