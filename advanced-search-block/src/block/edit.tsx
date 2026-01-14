import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';

export default function Edit() {
  const blockProps = useBlockProps({
    className: 'advanced-search-block-editor',
  });

  return (
    <div {...blockProps}>
      <Placeholder
        icon="search"
        label={__('Advanced Search Block', 'advanced-search-block')}
        instructions={__(
          'This block displays an advanced search form with keyword, category, and tag filtering. The search functionality will be available on the frontend.',
          'advanced-search-block'
        )}
      >
        <p>{__('Search form will appear on the frontend.', 'advanced-search-block')}</p>
      </Placeholder>
    </div>
  );
}

