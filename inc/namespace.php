<?php

namespace Shortcode_UI\Gutenberg;

use Shortcode_UI;
use ReactWPScripts;

/**
 * Register blocks for all shortcodes.
 *
 */
function bootstrap() {
	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_block_editor_assets' );
}

/**
 * Register Gutenberg blocks for all shortcodes with UI.
 */
function enqueue_block_editor_assets() {
	$Shortcake         = Shortcode_UI::get_instance();

	$plugin_dir        = plugin_dir_path( dirname( __FILE__ ) );
	$plugin_url        = plugin_dir_url( dirname( __FILE__ ) );

	$shortcodes        = array_values( $Shortcake->get_shortcodes() );
	$current_post_type = get_post_type();

	if ( $current_post_type ) {
		foreach ( $shortcodes as $key => $args ) {
			if ( ! empty( $args['post_type'] ) && ! in_array( $current_post_type, $args['post_type'], true ) ) {
				unset( $shortcodes[ $key ] );
			}
		}
	}

	if ( empty( $shortcodes ) ) {
		return;
	}

	usort( $shortcodes, function( $a, $b ) { return $a['label'] <=> $b['label']; } );

	/*
	 * Enqueue script, styles, and ensure any dependencies are available.
	 *
	 * See README at https://github.com/humanmade/react-wp-scripts for explanation.
	 */
	ReactWPScripts\enqueue_assets(
		plugin_dir_path( dirname( __FILE__ ) ), [
			'handle'  => 'shortcode-ui-gutenberg',
			'scripts' => [ 'wp-blocks', 'wp-element' ],
			'styles'  => [],
		]
	);

	wp_localize_script( 'shortcode-ui-gutenberg', 'shortcodeUIData', array(
		'shortcodes' => $shortcodes,
		'strings'    => [], /* to come */
		'nonces'     => [
			'preview'        => wp_create_nonce( 'shortcode-ui-preview' ),
			'thumbnailImage' => wp_create_nonce( 'shortcode-ui-get-thumbnail-image' ),
		],
	) );
}

/**
 * Render a shortcode as a block in Gutenberg editor.
 */
function render_block( $attributes, $content ) {
	return do_shortcode( $content );
}

