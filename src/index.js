/* global shortcodeUIData: false */

import './shortcode-ui-gutenberg-editor.scss';
import './shortcode-ui-gutenberg-styles.scss';
import registerServiceWorker from './registerServiceWorker';
import registerShortcodeBlock from './registerShortcodeBlock';

registerServiceWorker();

shortcodeUIData.shortcodes.forEach( registerShortcodeBlock );

