import { useState, useEffect, useCallback } from '@wordpress/element';
import { Post, SearchResponse, SearchParams } from '../../types';

declare const asbData: {
  restUrl: string;
  nonce: string;
};

export function useSearchResults(params: SearchParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchResults = useCallback(async (searchParams: SearchParams) => {
    // Don't search if no parameters are provided
    if (!searchParams.keyword && !searchParams.category && !searchParams.tags?.length) {
      setPosts([]);
      setTotal(0);
      setTotalPages(0);
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.keyword) {
        queryParams.set('keyword', searchParams.keyword);
      }
      if (searchParams.category) {
        queryParams.set('category', String(searchParams.category));
      }
      if (searchParams.tags && searchParams.tags.length > 0) {
        searchParams.tags.forEach((tag) => {
          queryParams.append('tags[]', String(tag));
        });
      }
      if (searchParams.page) {
        queryParams.set('page', String(searchParams.page));
      }
      queryParams.set('per_page', '10');

      const response = await fetch(
        `${asbData.restUrl}search?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'X-WP-Nonce': asbData.nonce,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data: SearchResponse = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPosts([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(params);
  }, [params, fetchResults]);

  return {
    posts,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    refetch: () => fetchResults(params),
  };
}

