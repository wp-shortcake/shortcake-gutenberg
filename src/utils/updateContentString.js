/* global wp: false */

/**
 * Update the content string after input changes.
 *
 * @param {Object} ...
 */
const updateContentString = function( props ) {

	const { attributes: { shortcode_tag, shortcode_attrs}, setAttributes } = props;
	const { shortcode } = wp;

	setAttributes( { content: shortcode.string( { tag: shortcode_tag, attrs: shortcode_attrs } ) } );
};

export default updateContentString;
