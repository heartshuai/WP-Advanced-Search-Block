import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SearchParams } from './hooks/useSearchParams';
import { Category, Tag } from '../types';

declare const asbData: {
  restUrl: string;
  nonce: string;
};

interface SearchFormProps {
  params: SearchParams;
  onParamsChange: (params: Partial<SearchParams>) => void;
}

export default function SearchForm({ params, onParamsChange }: SearchFormProps) {
  const [keyword, setKeyword] = useState(params.keyword || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);

  // Load categories and tags on mount
  useEffect(() => {
    // Load categories
    fetch(`${asbData.restUrl}categories`, {
      headers: {
        'X-WP-Nonce': asbData.nonce,
      },
    })
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => setLoadingCategories(false));

    // Load tags
    fetch(`${asbData.restUrl}tags`, {
      headers: {
        'X-WP-Nonce': asbData.nonce,
      },
    })
      .then((res) => res.json())
      .then((data: Tag[]) => {
        setTags(data);
        setLoadingTags(false);
      })
      .catch(() => setLoadingTags(false));
  }, []);

  // Sync keyword with params
  useEffect(() => {
    setKeyword(params.keyword || '');
  }, [params.keyword]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    onParamsChange({ keyword: value || undefined });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    onParamsChange({ category: value });
  };

  const handleTagToggle = (tagId: number) => {
    const currentTags = params.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    onParamsChange({ tags: newTags.length > 0 ? newTags : undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onParamsChange({ keyword: keyword || undefined });
  };

  return (
    <form className="asb-search-form" onSubmit={handleSubmit}>
      <div className="asb-form-row">
        <label htmlFor="asb-keyword" className="asb-label">
          {__('Keyword', 'advanced-search-block')}
        </label>
        <input
          id="asb-keyword"
          type="text"
          className="asb-input"
          value={keyword}
          onChange={handleKeywordChange}
          placeholder={__('Enter search keyword...', 'advanced-search-block')}
        />
      </div>

      <div className="asb-form-row">
        <label htmlFor="asb-category" className="asb-label">
          {__('Category', 'advanced-search-block')}
        </label>
        <select
          id="asb-category"
          className="asb-select"
          value={params.category || ''}
          onChange={handleCategoryChange}
          disabled={loadingCategories}
        >
          <option value="">{__('All Categories', 'advanced-search-block')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>

      {tags.length > 0 && (
        <div className="asb-form-row">
          <label className="asb-label">
            {__('Tags', 'advanced-search-block')}
          </label>
          <div className="asb-tags-container">
            {loadingTags ? (
              <span>{__('Loading tags...', 'advanced-search-block')}</span>
            ) : (
              tags.map((tag) => (
                <label key={tag.id} className="asb-tag-checkbox">
                  <input
                    type="checkbox"
                    checked={params.tags?.includes(tag.id) || false}
                    onChange={() => handleTagToggle(tag.id)}
                  />
                  <span>
                    {tag.name} ({tag.count})
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      <div className="asb-form-actions">
        <button type="submit" className="asb-button asb-button-primary">
          {__('Search', 'advanced-search-block')}
        </button>
        {(params.keyword || params.category || params.tags?.length) && (
          <button
            type="button"
            className="asb-button asb-button-secondary"
            onClick={() => {
              setKeyword('');
              onParamsChange({ keyword: undefined, category: undefined, tags: undefined });
            }}
          >
            {__('Clear', 'advanced-search-block')}
          </button>
        )}
      </div>
    </form>
  );
}

