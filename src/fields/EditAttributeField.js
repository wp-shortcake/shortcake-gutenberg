/* global wp: false */

import React from 'react';

const { Component } = wp.element;

/**
 * The most basic attribute field for a shortcode.
 *
 * Renders a text input, with the label and description if defined, for a
 * string attribute value.
 */
class EditAttributeField extends Component {

	/**
	 * Render a text input for an attribute value field.
	 *
	 * TODO: This should be moved to a different component so that we
	 * can define multiple input types. Currently all attribute fields
	 * are displayed as text inputs, no matter what field type was
	 * registered for them.
	 */
	render() {
		const { attribute, shortcode, value, updateValue } = this.props;
		const { attr, label, description } = attribute;
		const { shortcode_tag } = shortcode;

		return (
			<section key={ `shortcode-${shortcode_tag}-${attr}` } className='shortcode-ui-block-inspector-form-item'>
				<label className='shortcode-ui-block-inspector-form-item-label'>{ label }</label>
				<input className='shortcode-ui-block-inspector-form-item-input'
					type='text'
					name={ attr }
					value={ value }
					onChange={ updateValue }
					/>
				{ description.length && (
					<span className='shortcode-ui-block-inspector-form-item-description'>{ description }</span>
				) }
			</section>
		);
	};
}

export default EditAttributeField;
