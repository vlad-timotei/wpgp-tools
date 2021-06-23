/* UserScript Initialization */
const WPGPT_VERSION = '1.3'; 

var warning_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/warning.png';
var notice_icon = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/notice.png';

var cssTxt = GM_getResourceText('wpgpt-style');
GM_addStyle( cssTxt );

var update_notif_template = '<div class="wpgpt-update-notice"><strong>WPGPTools v.%s has new features!</strong> You\'re using v.' + WPGPT_VERSION + '. Update now! ' +
							'<br><a href="https://github.com/vlad-timotei/wpgp-tools/raw/main/userscript/wpgpt-userscript-latest.user.js"><br>Click here</a>' +
							' and Tampermonkey will prompt to reinstall the userscript. If that somehow fails, please manually copy the url and install it.';

/*
** Other scripts loaded from the trunk: Settings, Checks, Consistency & Shortcuts
** No need for LS functions, as they are included in wp-gp-tools-consistency.js
*/
