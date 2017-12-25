import React from 'react';

/**
 * Map Shortcake's image definition to Gutenberg's block image format.
 *
 * Shortcake's item images can accept an HTML string or a full class name
 * for a dashicon. Determine which one is being used, and convert it to the
 * dashicon slug only, or a React element with the HTML string.
 *
 * @param {String} shortcodeListItemImage Either a dashicons classname or an HTML element which renders an image.
 * @return {String|wp.element}            The slug portion of the dashicon class or a wp.element which renders an image.
 */
const mapItemImage = shortcodeListItemImage => {
	if ( shortcodeListItemImage.startsWith( 'dashicons-' ) ) {
		return shortcodeListItemImage.replace( 'dashicons-', '' );
	}

	return (
		<div
			style={{ height: '20px', width: '20px' }}
			dangerouslySetInnerHTML={{ __html: shortcodeListItemImage } }
		/>
	);
};

export default mapItemImage;
