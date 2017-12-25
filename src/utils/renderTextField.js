import React from 'react';
import updateContentString from './updateContentString';

/**
 * Render a text input for an attribute value field.
 *
 * TODO: This should be moved to a different component so that we
 * can define multiple input types. Currently all attribute fields
 * are displayed as text inputs, no matter what field type was
 * registered for them.
 *
 * @param {Object} props       Complete props available to component render ("edit" or "save") method..
 * @param {Object} attr        Attribute field as defined in shortcode UI.
 * @return {wp.blocks.element} Section component with label, input, and description if available.
 */
const renderTextField = ( shortcode, props, attr ) => {
	const { attr: attrName, label, description } = attr;
	const { shortcode_attrs } = props.attributes;

	console.log( 'render text field', shortcode, props, attr );
	var value = props.attributes[ attrName ] || '';

	var e = (
		<section key={ `shortcode-key-${attr}` } className='shortcode-ui-block-inspector-form-item'>
			<label className='shortcode-ui-block-inspector-form-item-label'>{ label }</label>
			<input className='shortcode-ui-block-inspector-form-item-input'
				type='text'
				name={ attrName }
				value={ shortcode_attrs[ attrName ] || '' }
				onInput={ event => handleUpdateShortcodeAttribute( props, attrName, event.target.value ) }
				/>
			{ description.length && (
				<span className='shortcode-ui-block-inspector-form-item-description'>{ description }</span>
			) }
		</section>
	);

	return e;
};

/**
 * Respond to updates to an input in an attribute field.
 *
 * @param {Object} shortcode The options registered with register_shortcode_ui()
 * @param {Object} props     All props available on the component.
 * @param {String} attrName  Name of shortcode attribute being updated.
 * @param {String} value     New value for field.
 */
const handleUpdateShortcodeAttribute = function( props, attrName, value ) {

	var newShortcodeAttributes = Object.assign( {}, props.attributes.shortcode_attrs );
	newShortcodeAttributes[ attrName ] =  value || '';

	console.log( 'setting ', attrName, 'to', value );
	props.setAttributes( { shortcode_attrs: newShortcodeAttributes } );

	var newProps = Object.assign( props, { shortcode_attrs: newShortcodeAttributes } );
	console.log( 'after updating props', newProps );
	updateContentString( newProps );
};

export default renderTextField;
