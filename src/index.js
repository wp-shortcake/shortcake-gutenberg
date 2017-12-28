/* global shortcodeUIData: false */

import registerServiceWorker from './registerServiceWorker';
import registerShortcodeBlock from './registerShortcodeBlock';

registerServiceWorker();

shortcodeUIData.shortcodes.forEach( registerShortcodeBlock );

