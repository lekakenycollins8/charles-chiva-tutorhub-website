'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export function ResourceFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.delete('page'); // Reset to page 1 when filter changes
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === (category === "All" ? "all" : category) ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleCategoryChange(category === "All" ? "all" : category)}
        >
          {category === "All" && <Filter className="h-3.5 w-3.5" />}
          <span>{category}</span>
        </Button>
      ))}
    </div>
  );
}
