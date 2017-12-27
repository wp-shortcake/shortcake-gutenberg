/* global wp: false */

import mapItemImage from './utils/mapItemImage';

import EditBlock from './EditBlock';

const { registerBlockType } = wp.blocks;

/**
 * Register a Gutenberg block for a shortcode with UI.
 *
 * @param {Object} Shortcode UI as registered with Shortcake
 */
const registerShortcodeBlock = function( shortcode ) {

	const { shortcode_tag, attrs, listItemImage, label } = shortcode;

	registerBlockType( `shortcake/${shortcode_tag}`,
		{
			title: label,

			icon: mapItemImage( listItemImage ),

			category: 'widgets', // todo: register new "Post Element" category

			attributes: attrs.reduce(
				( memo, item ) => {

					// TODO: enable different types depending on attribute type
					memo[ item.attr ] = {
						type: 'string',
						default: '',
					};

					return memo;
				 }, {}
			),

			supports: {
				className:        false,
				customClassName:  false,
				html:             false,
			},

			edit: EditBlock.bind( null, shortcode ),

			save( { attributes } ) {
				return wp.shortcode.string( { tag: shortcode_tag, attrs: attributes } );
			}
		}
	);
};

export default registerShortcodeBlock;
