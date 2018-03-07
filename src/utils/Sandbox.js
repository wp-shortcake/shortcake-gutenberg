/* global wp: false */

import React from 'react';

const { SandBox } = wp.components;

/**
 * Extends the wp.component.Sandbox class to include all the same logic, except for the "sandbox" attributes on the iframe.
 *
 * Fixes errors like `Uncaught DOMException: Failed to set the 'domain'
 * property on 'Document': Assignment is forbidden for sandboxed iframes.`
 */
class Sandbox extends SandBox {
	render() {
		return (
			<iframe
				ref={ ( node ) => this.iframe = node }
				title={ this.props.title }
				scrolling="no"
				onLoad={ this.trySandbox }
				width={ Math.ceil( this.state.width ) }
				height={ Math.ceil( this.state.height ) } />
		);
	}
}

export default Sandbox;
