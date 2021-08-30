/* UserScript Initialization */
const WPGPT_VERSION = '1.5';

const wpgpt_warning_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/warning.png';
const wpgpt_notice_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/notice.png';

const cssTxt = GM_getResourceText( 'wpgpt-style' );
GM_addStyle( cssTxt );

const wpgpt_is_userscript = true;

/*
** Other scripts loaded from the trunk: Settings, Checks, Consistency, History & Shortcuts
** No need for LS functions, as they are included in wpgpt-consistency.js
*/
