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

/**
 * Map Shortcake's attribute fields to Gutenberg attribute structure.
 *
 * @todo We should also be registering the callback for display of the field.
 */
const getBlockAttributesForShortcode = shortcode => {
	var blockAttrs = {
		shortcode_tag: {
			type: 'string',
			source: function() { return shortcode.shortcode_tag; }
		},
		shortcode_attrs: shortcode.attrs.reduce(
			 function( memo, item ) {
				 memo[ item.attr ] = {
					 type: 'string',
					 source: function( block ) {
						if ( ! block ) return '';

						var attrName = item.attr;
						var attrs = wp.shortcode.attrs( block );
						return ( attrName in attrs ) ? attrs[ attrName ] : null;
					}
				 };

				 return memo;
			 }, {}
		),
		content: {
			type: 'string',
			source: updateContentString
		}
	};

	return blockAttrs;
};

/**
 * Respond to updates to an input in an attribute field.
 *
 * @param {Object} shortcode The options registered with register_shortcode_ui()
 * @param {Object} props     All props available on the component.
 * @param {String} attrName  Name of shortcode attribute being updated.
 * @param {String} value     New value for field.
 */
var handleUpdateShortcodeAttribute = function( props, attrName, value ) {

	var newShortcodeAttributes = Object.assign( {}, props.attributes.shortcode_attrs );
	newShortcodeAttributes[ attrName ] =  value || '';

	console.log( 'setting ', attrName, 'to', value );
	props.setAttributes( { shortcode_attrs: newShortcodeAttributes } );

	var newProps = Object.assign( props, { shortcode_attrs: newShortcodeAttributes } );
	console.log( 'after updating props', newProps );
	updateContentString( newProps );
};

/**
 * Update the content string after input changes.
 *
 * @param {Object} ...
 */
var updateContentString = function( props ) {
	if ( typeof props === 'undefined' ) {
		return;
	}

	console.log( 'updating content string', props );

	var shortcodeString = wp.shortcode.string({ tag: props.attributes.shortcode_tag, attrs: props.attributes.shortcode_attrs });

	props.setAttributes( { content: shortcodeString } );
};

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
var renderTextField = function( shortcode, props, attr ) {
	var attrName = attr.attr;
	console.log( 'render text field', shortcode, props, attr );
	var value = props.attributes[ attrName ] || '';
	var shortcode_attrs = props.attributes.shortcode_attrs || {};

	var e =  el(
		'section', { key: 'shortcode-key-' + attr.attr, className: 'shortcode-ui-block-inspector-form-item' }, [
			el( 'label', { className: 'shortcode-ui-block-inspector-form-item-label' }, attr.label ),
			el( 'input', {
				className: 'shortcode-ui-block-inspector-form-item-input',
				type:      'text',
				name:      attrName,
				value:     props.attributes.shortcode_attrs[ attrName ] || '',
				onInput:   function ( event ) { handleUpdateShortcodeAttribute( props, attrName, event.target.value ); }
			} ),
			attr.description.length && el( 'span', { className: 'shortcode-ui-block-inspector-form-item-description' }, attr.description )
		]
	);

	return e;
};


