<?php
/**
 * A Gutenberg block shim for shortcodes that have UI registered with the Shortcake API.
 *
 * @package   alfie
 * @link      https://github.com/humanmade/wp-alfie
 * @author    Human Made <hello@humanmade.com>
 * @copyright 2009-2017 Human Made
 * @license   GPL v2 or later
 *
 * Plugin Name:     Shortcake Gutenberg Shim
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     Adds a shim to register Gutenberg blocks for any shortcodes with UI registered through Shortcake.
 * Author:          goldenapples
 * Text Domain:     shortcake-gutenberg
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
namespace Shortcode_UI\Gutenberg;

const PLUGIN_VERSION = '0.1.0';

require_once( __DIR__ . '/inc/namespace.php' );

// Kick everything off!
add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );
