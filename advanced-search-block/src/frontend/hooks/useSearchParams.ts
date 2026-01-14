import { useState, useEffect, useCallback } from '@wordpress/element';

export interface SearchParams {
  keyword?: string;
  category?: number;
  tags?: number[];
  page?: number;
}

export function useSearchParams(): [
  SearchParams,
  (params: Partial<SearchParams>) => void,
  () => void
] {
  const [params, setParams] = useState<SearchParams>(() => {
    // Initialize from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tagsParam = urlParams.getAll('tags[]').map(Number).filter(Boolean);
    
    return {
      keyword: urlParams.get('q') || undefined,
      category: urlParams.get('cat') ? Number(urlParams.get('cat')) : undefined,
      tags: tagsParam.length > 0 ? tagsParam : undefined,
      page: urlParams.get('page') ? Number(urlParams.get('page')) : 1,
    };
  });

  // Update URL when params change
  const updateParams = useCallback((newParams: Partial<SearchParams>) => {
    setParams((prev) => {
      const updated = { ...prev, ...newParams };
      
      // Reset page when other params change
      if (newParams.keyword !== undefined || 
          newParams.category !== undefined || 
          newParams.tags !== undefined) {
        updated.page = 1;
      }

      // Update URL
      const url = new URL(window.location.href);
      
      if (updated.keyword) {
        url.searchParams.set('q', updated.keyword);
      } else {
        url.searchParams.delete('q');
      }

      if (updated.category) {
        url.searchParams.set('cat', String(updated.category));
      } else {
        url.searchParams.delete('cat');
      }

      if (updated.tags && updated.tags.length > 0) {
        url.searchParams.delete('tags[]');
        updated.tags.forEach((tag) => {
          url.searchParams.append('tags[]', String(tag));
        });
      } else {
        url.searchParams.delete('tags[]');
      }

      if (updated.page && updated.page > 1) {
        url.searchParams.set('page', String(updated.page));
      } else {
        url.searchParams.delete('page');
      }

      window.history.pushState({}, '', url.toString());
      
      return updated;
    });
  }, []);

  // Listen to browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tagsParam = urlParams.getAll('tags[]').map(Number).filter(Boolean);
      
      setParams({
        keyword: urlParams.get('q') || undefined,
        category: urlParams.get('cat') ? Number(urlParams.get('cat')) : undefined,
        tags: tagsParam.length > 0 ? tagsParam : undefined,
        page: urlParams.get('page') ? Number(urlParams.get('page')) : 1,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const resetParams = useCallback(() => {
    setParams({ page: 1 });
    const url = new URL(window.location.href);
    url.search = '';
    window.history.pushState({}, '', url.toString());
  }, []);

  return [params, updateParams, resetParams];
}

