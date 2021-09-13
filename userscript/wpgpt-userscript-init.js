/* UserScript Initialization */
const WPGPT_VERSION = '1.6';

const wpgpt_warning_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/warning.png';
const wpgpt_notice_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/notice.png';

const cssTxt = GM_getResourceText( 'wpgpt-style' );
GM_addStyle( cssTxt );

/*
** Scripts loaded below: wpgpt-settings.js, wpgpt-checks.js, wpgpt-consistency.js, wpgpt-bulk-consistency.js, wpgpt-history.js & wpgpt-shortcuts.js
** No need for wpgpt-functions.js, as they are included in wpgpt-consistency.js
*/
