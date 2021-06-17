/* UserScript Initialization */
const WPGPT_VERSION = '1.3'; 

var warning_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/warning.png';
var notice_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/notice.png';

var cssTxt = GM_getResourceText('wpgpt-style');
GM_addStyle( cssTxt );

/*
** Other scripts loaded from the trunk: Settings, Checks, Consistency & Shortcuts
** No need for LS functions, as they are included in wp-gp-tools-consistency.js
*/
