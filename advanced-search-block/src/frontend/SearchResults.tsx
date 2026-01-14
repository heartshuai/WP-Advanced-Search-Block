import { __, sprintf } from '@wordpress/i18n';
import { Post } from '../types';

interface SearchResultsProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function SearchResults({
  posts,
  loading,
  error,
  total,
  totalPages,
  currentPage,
  onPageChange,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="asb-results-loading">
        <p>{__('Searching...', 'advanced-search-block')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="asb-results-error">
        <p>{__('Error:', 'advanced-search-block')} {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="asb-results-empty">
        <p>{__('No results found.', 'advanced-search-block')}</p>
      </div>
    );
  }

  return (
    <div className="asb-results">
      <div className="asb-results-header">
        <p className="asb-results-count">
          {sprintf(
            __('Found %d result(s)', 'advanced-search-block'),
            total
          )}
        </p>
      </div>

      <div className="asb-posts-list">
        {posts.map((post) => (
          <article key={post.id} className="asb-post-item">
            {post.featured_image && (
              <div className="asb-post-image">
                <a href={post.permalink}>
                  <img src={post.featured_image} alt={post.title} />
                </a>
              </div>
            )}
            <div className="asb-post-content">
              <h3 className="asb-post-title">
                <a href={post.permalink}>{post.title}</a>
              </h3>
              <div className="asb-post-meta">
                <span className="asb-post-date">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="asb-post-author">
                  {__('By', 'advanced-search-block')} {post.author}
                </span>
              </div>
              <div className="asb-post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              {post.categories.length > 0 && (
                <div className="asb-post-categories">
                  {post.categories.map((cat, index) => (
                    <span key={index} className="asb-post-category">{cat}</span>
                  ))}
                </div>
              )}
              {post.tags.length > 0 && (
                <div className="asb-post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="asb-post-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="asb-pagination">
          <button
            className="asb-pagination-button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            {__('Previous', 'advanced-search-block')}
          </button>
          <span className="asb-pagination-info">
            {sprintf(
              __('Page %1$d of %2$d', 'advanced-search-block'),
              currentPage,
              totalPages
            )}
          </span>
          <button
            className="asb-pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            {__('Next', 'advanced-search-block')}
          </button>
        </div>
      )}
    </div>
  );
}

