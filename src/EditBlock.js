/* global wp: false, _wpGutenbergPost: false, shortcodeUIData: false, _: false */
import React from 'react';

import Fetcher from './utils/Fetcher';

import './EditBlock.css'

const { InspectorControls, BlockDescription } = wp.blocks;
const { Component } = wp.element;

/**
 * React component to render the edit() method of a Shortcake block.
 */
class EditBlock extends Component {

	/**
	 * Note that this constructor is bound when it's initially called in the
	 * registerBlockType() method. This is done in order to pass in the shortcode
	 * definition, so it can be accessed here without being exposed in the props.
	 *
	 * @param {Object}                shortcode Shortcode UI args as defined through the Shortcake API.
	 * @param {React.Component.Props} props     Component props.
	 */
	constructor( shortcode, ...args ) {
		super( ...args );

		this.shortcode = shortcode;
		this.state = { content: '', preview: '' };

		this.renderTextField = this.renderTextField.bind( this );

		this.updateContentString = this.updateContentString.bind( this );
		this.updatePreview = this.updatePreview.bind( this );
		this.maybeUpdatePreview = _.throttle( this.updatePreview, 300 );
	}

	componentWillMount( props ) {
		this.updateContentString();
	}

	/**
	 * When props update, update the shortcode string and re-fetch the preview.
	 */
	componentWillReceiveProps( nextProps ) {
		if ( nextProps && nextProps !== this.props ) {
			this.updateContentString();
		}
	}

	/**
	 * Update the content string in response to a change in attributes.
	 */
	updateContentString() {
		const { shortcode_tag } = this.shortcode;
		const { attributes } = this.props;
		const { shortcode } = wp;

		const content = shortcode.string( { tag: shortcode_tag, attrs: attributes } );

		this.setState({ content });
		this.maybeUpdatePreview();
	}

	/**
	 * Fetch a new preview in response to a change in shortcode attributes.
	 *
	 * Calls the Fetcher class to fetch previews for any blocks which haven't been fetched yet.
	 */
	updatePreview() {
		const { content } = this.state;
		const { id: post_id } = _wpGutenbergPost;
		const { preview: nonce } = shortcodeUIData.nonces;

		if ( ! content ) {
			return;
		}

		const fetchPreview = Fetcher.queueToFetch({
			post_id,
			nonce,
			shortcode: content,
		});

		fetchPreview
			.then( result => this.setState( { html: result.response } ) )
			.fail( console.log );
	}

	render() {
		const { SandBox } = wp.components;
		const { focus, setFocus } = this.props;
		const { content = '', html = false } = this.state;
		const { attrs, label, shortcode_tag } = this.shortcode;

		return [
			html ?

				// Display the shortcode preview (if it's been fetched properly).
				(
					<div className="wp-block-shortcake-preview" >
						<SandBox html={ html } title={ `${label} shortcode preview`  }type={ shortcode_tag } />
						<div class="wp-block-shortcake-preview-overlay" onClick={ setFocus } onFocus={ setFocus } ></div>
					</div>
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
						{ attrs.map( attr => this.renderTextField( attr ) ) }
					</form>
				</InspectorControls>
			]
		];
	}

	/**
	 * Render a text input for an attribute value field.
	 *
	 * TODO: This should be moved to a different component so that we
	 * can define multiple input types. Currently all attribute fields
	 * are displayed as text inputs, no matter what field type was
	 * registered for them.
	 *
	 * @param  {Object}            attribute  Attribute field as defined in shortcode UI.
	 * @return {wp.blocks.element}            HTML for section with label, input, and description if available.
	 */
	renderTextField( attribute ) {
		const { attr, label, description } = attribute;
		const { attributes, setAttributes } = this.props;
		const { shortcode_tag } = this.shortcode;
		const value = attributes[ attr ] || '';

		const updateValue = e => setAttributes( { [ attr ]: e.target.value } );

		return (
			<section key={ `shortcode-${shortcode_tag}-${attr}` } className='shortcode-ui-block-inspector-form-item'>
				<label className='shortcode-ui-block-inspector-form-item-label'>{ label }</label>
				<input className='shortcode-ui-block-inspector-form-item-input'
					type='text'
					name={ attr }
					value={ value }
					onInput={ updateValue }
					onChange={ updateValue }
					/>
				{ description.length && (
					<span className='shortcode-ui-block-inspector-form-item-description'>{ description }</span>
				) }
			</section>
		);
	};
}

export default EditBlock;
