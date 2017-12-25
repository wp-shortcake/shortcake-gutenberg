<?php

namespace Shortcode_UI\Gutenberg;

use Shortcode_UI;

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

	wp_enqueue_script(
		'shortcode-ui-gutenberg',
		$plugin_url  . '/js/build/shortcode-ui-gutenberg.js',
		[ 'wp-blocks', 'wp-element' ]
	);

	usort( $shortcodes, function( $a, $b ) { return $a['label'] <=> $b['label']; } );

	wp_localize_script( 'shortcode-ui-gutenberg', ' shortcodeUIData', array(
		'shortcodes' => $shortcodes,
		'strings'    => [], /* to come */
		'nonces'     => [], /* to come, if needed */
	) );

	wp_enqueue_style(
		'shortcode-ui-gutenberg',
		$plugin_url . '/css/shortcode-ui-gutenberg-styles.css',
		[ 'wp-blocks' ]
	);
}

/**
 * Render a shortcode as a block in Gutenberg editor.
 */
function render_block( $attributes, $content ) {
	return do_shortcode( $content );
}

