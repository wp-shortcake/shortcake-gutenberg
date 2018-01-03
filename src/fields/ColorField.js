import React from 'react';
import { ChromePicker } from 'react-color';

import EditAttributeField from './EditAttributeField';

export default class ColorField extends EditAttributeField {
	static attrType = 'color';

	render() {
		const { attribute, value, updateValue } = this.props;
		const { attr, label, description } = attribute;

		return (
			<section className='shortcode-ui-block-inspector-form-item'>
				<label className='shortcode-ui-block-inspector-form-item-label'>{ label }</label>
				<ChromePicker
					name={ attr }
					color={ value }
					onChangeComplete={ ( color ) => updateValue( color.hex ) }
					style={ { width: '100%' } }
					disableAlpha
				/>
				{ description && description.length && (
					<span className='shortcode-ui-block-inspector-form-item-description'>{ description }</span>
				) }
			</section>
		);

	}
}
