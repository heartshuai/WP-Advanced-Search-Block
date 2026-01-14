import { render } from '@wordpress/element';
import { useSearchParams } from './hooks/useSearchParams';
import { useSearchResults } from './hooks/useSearchResults';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import '../style.css';

function AdvancedSearchBlock() {
  const [params, updateParams, resetParams] = useSearchParams();
  const { posts, loading, error, total, totalPages, currentPage } = useSearchResults(params);

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  return (
    <div className="advanced-search-block">
      <SearchForm params={params} onParamsChange={updateParams} />
      <SearchResults
        posts={posts}
        loading={loading}
        error={error}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.advanced-search-block-container');
  containers.forEach((container) => {
    render(<AdvancedSearchBlock />, container);
  });
});

