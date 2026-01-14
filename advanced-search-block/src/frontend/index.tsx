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
function initAdvancedSearchBlocks() {
  const containers = document.querySelectorAll('.advanced-search-block-container:not([data-initialized])');
  if (containers.length === 0) {
    return;
  }
  
  containers.forEach((container) => {
    // Skip if already initialized
    if (container.getAttribute('data-initialized') === 'true') {
      return;
    }
    container.setAttribute('data-initialized', 'true');
    try {
      render(<AdvancedSearchBlock />, container);
    } catch (error) {
      console.error('Advanced Search Block initialization error:', error);
      container.innerHTML = '<p>Error loading search block. Please refresh the page.</p>';
    }
  });
}

// Make function globally available for inline script
(window as any).asbInitBlocks = initAdvancedSearchBlocks;

// Try to initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdvancedSearchBlocks);
} else {
  // Small delay to ensure DOM is fully ready
  setTimeout(initAdvancedSearchBlocks, 0);
}

