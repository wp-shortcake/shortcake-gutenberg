/* global wp: false, shortcodeUIData: false */
import React from 'react';

import getBlockAttributesForShortcode from './utils/getBlockAttributesForShortcode';
import renderTextField from './utils/renderTextField';
import mapItemImage from './utils/mapItemImage';
import updateContentString from './utils/updateContentString';

const { registerBlockType, createBlock } = wp.blocks;

/**
 * Register a Gutenberg block for a shortcode with UI.
 *
 * @param {Object} Shortcode UI as registered with Shortcake
 */
const registerShortcodeBlock = function( shortcode ) {
	const { InspectorControls, BlockDescription, Editable } = wp.blocks;
	const { shortcode_tag, listItemImage, label } = shortcode;
	const attributes = getBlockAttributesForShortcode( shortcode );

	console.log( 'attributes', shortcode_tag, attributes );

	registerBlockType( `shortcake/${shortcode_tag}`,
		{
			title: label,

			icon: mapItemImage( listItemImage ),

			category: 'common', // todo: register new "Post Element" category

			shortcode_tag,

			attributes,

			supportHTML: false,

			supports: {
				customClassName: false,
				className: false
			},

			componentWillReceiveProps( nextProps ) {
				const postID = window._wpGutenbergPost.id;

				//var request = fetcher.queueToFetch({
					//post_id: postID,
					//shortcode: this.props.attributes.content,
					//nonce: shortcodeUIData.nonces.preview,
				//});

				// If it returns a shortcode preview, render it. Otherwise, we'll just show text.
				//request.then(
					//function( response ) {

					//}
				//).catch(
					//function( error ) {

					//}
				//);
			},

			edit( props ) {

				const { focus, setFocus, attributes, hasPreview } = props;
				const { content } = attributes;

				console.log( 'on edit', props );

				return [
					hasPreview ?

						// The shortcode preview (if it's been fetched properly).
						(
							<iframe className="shortcode-preview">
								<html>
									<body dangerouslySetInnerHTML={{ __html: hasPreview }} />
								</html>
							</iframe>
						) :

						// Or the preformatted shortcode text if no preview is available.
						(
							<code onFocus={ setFocus }>
								{ content }
							</code>
						),

					// Render inspector controls when block is focused.
					focus && [
						<InspectorControls>
							<BlockDescription>
								<h4 className="shortcode-ui-inspector-controls-title">Edit {label} post element</h4>
								<p className="shortcode-ui-inspector-controls-description">Shortcode attributes</p>
							</BlockDescription>
							<form className="shortcode-ui-block-inspector">
								{ attributes.map( renderTextField ) }
							</form>
						</InspectorControls>
					]
				];
			},

			save( props ) {
				const { content } = props.attributes;

				return content.length ?
					( <Editable tagName="div">{ content }</Editable> ) :
					'Shortcode preview not available';
			},
		}
	);
};

export default registerShortcodeBlock;
