/* global wp: false */

import updateContentString from './updateContentString';

/**
 * Map Shortcake's attribute fields to Gutenberg attribute structure.
 *
 * @todo We should also be registering the callback for display of the field.
 */
const getBlockAttributesForShortcode = shortcodeBlock => {
	const { shortcode_tag, attrs } = shortcodeBlock;
	const { shortcode } = wp;

	const blockAttrs = {
		shortcode_tag: {
			type: 'string',
			source: () => shortcode_tag,
		},
		shortcode_attrs: attrs.reduce(
			 ( memo, item ) => {
				 memo[ item.attr ] = {
					 type: 'string',
					 source: function( block ) {
						if ( ! block ) return '';
						const { attr } = item;
						const localAttrs = attrs( block );
						return ( attr in localAttrs ) ? localAttrs[ attr ] : null;
					}
				 };
			 }, {}
		),
		content: {
			type: 'string',
			source: updateContentString
		}
	};

	return blockAttrs;
};

export default getBlockAttributesForShortcode;
