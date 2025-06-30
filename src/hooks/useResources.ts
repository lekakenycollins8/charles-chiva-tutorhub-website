"use client";

import { useState, useEffect } from 'react';
import { getResources } from '@/lib/actions/resource-actions';

interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isPaid: boolean;
  price: number | null;
  category: string;
  downloads: number;
  imageUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getResources();
        
        if (response.success && response.data) {
          // Convert Date objects to strings for consistent client-side usage
          const formattedResources = response.data.map(resource => ({
            ...resource,
            createdAt: resource.createdAt instanceof Date ? resource.createdAt.toISOString() : resource.createdAt,
            updatedAt: resource.updatedAt instanceof Date ? resource.updatedAt.toISOString() : resource.updatedAt
          }));
          
          setResources(formattedResources);
        } else {
          setError(response.error || 'Failed to fetch resources');
          console.error('Error fetching resources:', response.error);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error in useResources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  return { resources, isLoading, error };
}
