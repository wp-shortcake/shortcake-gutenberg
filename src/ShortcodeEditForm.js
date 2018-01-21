/* global wp: false, _: false */

import React from 'react';

import sizeMe from 'react-sizeme';

import EditAttributeField from './fields/EditAttributeField';
import * as fields from './fields';


const { Component } = wp.element;

class ShortcodeEditForm extends Component {

	render() {
		const { shortcode, attrs, values, setAttributes } = this.props;

		return (
			<div className="shortcake-gutenberg-shortcode-edit-form">
				{
					attrs.map(
						attribute => {
							const { attr, type } = attribute;
							const { shortcode_tag } = shortcode;
							const { [ attr ]: value } = values;

							// Select the correct attribute field class from the attribute type.
							const AttributeField = _.find( fields, ( { attrType } ) => attrType === type ) || EditAttributeField;

							return (
								<AttributeField
									key={ `shortcode-${shortcode_tag}-attr-${attr}` }
									value={ value }
									attribute={ attribute }
									shortcode={ shortcode }
									updateValue={ newValue => setAttributes( { [ attr ]: newValue } ) }
									/>
							);
						}
					)
				}
			</div>
		);
	}

}

//export default ShortcodeEditForm;
export default sizeMe( { monitorHeight: true } )( ShortcodeEditForm );
