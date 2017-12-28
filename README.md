Shortcake Gutenberg shim
========================

Provides a basic block preview and edit interface in the Gutenberg editor for
all shortcodes that have UI registered through the Shortcake API.

This plugin is still rough and very much a work in process. Please open issues
for any bugs or features that you find. Code review, testing, and contributions
are very much welcome!

## Installation

Install as a plugin.

This repo does not include the build directory, so if you want to activate it,
you'll have to either use the dev server or build the assets before activating
it.

_Build production assets:_

	yarn install
	yarn run build

_Run the dev server:_

After installing node modules as above, define SCRIPT_DEBUG = true in your
wp-config and run

	yarn start

to enable hot reloading.

## Functionality

Currently, all shortcodes registered through Shortcake will have a block
registered in the "Widgets" category. The only UI currently is a text input
field for each attribute type. The same inputs are available in the block edit
context and in advanced settings in the block inspector.

## To come:

Please consider this a very basic proof of concept. There's a lot of work to be
done to being the shortcode experience in the Gutenberg editor up to par with
where it is in the classic WP editor, including but not limited to:

- [ ] Rendering different input types for each of the attribute field types from Shortcake.
- [ ] Providing some kind of translation between the js-hooks available in Shortcake and their corresponding Gutenberg components.
- [ ] Design and UX feedback and contributions.
- [ ] Accessibility testing!

