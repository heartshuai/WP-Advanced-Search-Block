import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name as string, {
  ...metadata,
  edit: Edit,
  save: () => null, // Dynamic block, rendered on server
});

