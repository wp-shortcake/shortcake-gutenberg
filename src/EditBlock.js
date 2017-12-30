/* global wp: false, _wpGutenbergPost: false, shortcodeUIData: false, _: false */
import React from 'react';

import Fetcher from './utils/Fetcher';
import ShortcodeEditForm from './ShortcodeEditForm';

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
		this.state = { content: '', preview: '', minHeight: 0 };

		this.updatePreview = this.updatePreview.bind( this );
		this.maybeUpdatePreview = _.throttle( this.updatePreview, 300 );
	}

	componentWillMount( props ) {
		this.updatePreview();
	}

	/**
	 * When props update, update the shortcode string and re-fetch the preview.
	 */
	//componentWillReceiveProps( nextProps ) {
		//if ( nextProps && nextProps !== this.props ) {
			//this.maybeUpdatePreview();
		//}
	//}

	/**
	 * Fetch a new preview in response to a change in shortcode attributes.
	 *
	 * Calls the Fetcher class to fetch previews for any blocks which haven't been fetched yet.
	 */
	updatePreview() {
		const { shortcode_tag } = this.shortcode;
		const { attributes } = this.props;
		const { id: post_id } = _wpGutenbergPost;
		const { preview: nonce } = shortcodeUIData.nonces;
		const { shortcode } = wp;

		const content = shortcode.string( { tag: shortcode_tag, attrs: attributes } );

		if ( content && content !== this.state.content ) {

			// Trigger an unmount on the sandbox component, so that it can be rebuilt.
			this.setState( { content: '', preview: '' } );

			const fetchPreview = Fetcher.queueToFetch( {
				post_id,
				nonce,
				shortcode: content
			} );

			// When preview is received, set state and re-render component.
			fetchPreview
				.then(
					result => this.setState( {
						content,
						preview: result.response
					} )
				)
				.fail( console.log );
		}
	}

	render() {
		const { SandBox } = wp.components;

		const { attrs, label, shortcode_tag } = this.shortcode;
		const { attributes: values, setAttributes, focus, setFocus } = this.props;
		const { content, preview } = this.state;

		/*
		 * Because the form is displayed in an absolutely-positioned overlay,
		 * the block needs this listener to update it's height when the
		 * shortcode UI form is rendered or updated. Magic number 112 is equal
		 * to the form header and description heights, plus all margin and
		 * padding.
		 */
		const onSize = size => this.setState( { minHeight: size.height + 112 } )

		return [
			preview ?

				// Display the shortcode preview (if it's been fetched properly).
				(
					<div className="wp-block-shortcake-preview" key="preview" style={ focus && { minHeight: this.state.minHeight } }>
						<SandBox html={ preview } title={ `${label} shortcode preview` } type={ shortcode_tag } />
						<div className={ "wp-block-shortcake-preview-overlay" + ( focus ? ' editing' : '' ) }
							onClick={ setFocus }
							onFocus={ setFocus }
							onBlur={ this.maybeUpdatePreview }
							>
							{ focus && (
								<form title={ `Edit ${label} post element` } className="wp-block-shortcode-edit-form">
									<h4 className="shortcode-ui-block-editor-title">Edit {label} post element</h4>
									<p className="shortcode-ui-inspector-controls-description">Shortcode attributes</p>
									<ShortcodeEditForm
										shortcode={ this.shortcode }
										attrs={ attrs }
										values={ values }
										onSize={ onSize }
										setAttributes={ setAttributes } />
								</form>
							) }
						</div>
					</div>
				) :

				// Or the preformatted shortcode text if no preview is available.
				(
					<div className="wp-block-shortcake-preview" key="content" style={ focus && { minHeight: this.state.minHeight } }>
						<code
							onFocus={ setFocus }
							onBlur={ this.maybeUpdatePreview }
							>
							{ content }
						</code>
						{ focus && (
							<form title={ `Edit ${label} post element` } className="wp-block-shortcode-edit-form">
								<h4 className="shortcode-ui-block-editor-title">Edit {label} post element</h4>
								<p className="shortcode-ui-inspector-controls-description">Shortcode attributes</p>
								<ShortcodeEditForm
									shortcode={ this.shortcode }
									attrs={ attrs }
									values={ values }
									onSize={ onSize }
									setAttributes={ setAttributes } />
							</form>
						) }
					</div>
				),

			// Render inspector controls when block is focused.
			focus && [
				<InspectorControls key="advanced-controls">
					<BlockDescription>
						<h4 className="shortcode-ui-inspector-controls-title">Edit {label} post element</h4>
						<p className="shortcode-ui-inspector-controls-description">Shortcode attributes</p>
					</BlockDescription>
					<form className="shortcode-ui-block-inspector">
					</form>
				</InspectorControls>
			]
		];
	}
}

export default EditBlock;
