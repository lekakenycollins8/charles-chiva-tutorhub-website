'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Filter, Download, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { getResources } from "@/lib/actions/resource-actions";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch resources with filters
  const fetchResources = async () => {
    try {
      setLoading(true);
      const filters = {
        searchQuery: searchQuery || undefined,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        isPaid: paidFilter === 'all' ? undefined : paidFilter === 'paid',
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };

      const { success, data, pagination, error } = await getResources(filters);
      
      if (success && data) {
        setResources(data);
        setTotalPages(pagination?.totalPages || 1);
        setTotalItems(pagination?.total || 0);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((r: any) => r.category))];
        setCategories(prev => {
          const newCategories = [...new Set([...prev, ...uniqueCategories])];
          return newCategories;
        });
      } else {
        setError(error || 'Failed to fetch resources');
      }
    } catch (err) {
      setError('An error occurred while fetching resources');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchResources();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchResources();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter, paidFilter]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading resources...' : `Showing ${resources.length} of ${totalItems} resources`}
          </p>
        </div>
        <Link href="/admin/dashboard/resources/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Resource</span>
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2 opacity-50" />
                  <span>{categoryFilter === 'all' ? 'All Categories' : categoryFilter}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={paidFilter}
                onValueChange={(value: 'all' | 'paid' | 'free') => setPaidFilter(value)}
                disabled={loading}
              >
                <SelectTrigger className="w-[120px]">
                  <span>{paidFilter === 'all' ? 'All Types' : paidFilter === 'paid' ? 'Paid' : 'Free'}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20">
          <p>{error}</p>
        </div>
      )}

      {/* Resources List */}
      <Card>
        <CardContent className="p-0">
          {loading && resources.length === 0 ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border-b">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : resources.length > 0 ? (
            <ul className="divide-y">
              {resources.map((resource) => (
                <li key={resource.id} className="hover:bg-muted/50 transition-colors">
                  <div className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {resource.description || 'No description'}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{resource.category}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {resource.downloads || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resource.isPaid 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {resource.isPaid ? `£${resource.price}` : 'Free'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/dashboard/resources/${resource.id}`}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/dashboard/resources/${resource.id}/edit`}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No resources found. Try adjusting your search or create a new resource.</p>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                <span className="mr-2">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
