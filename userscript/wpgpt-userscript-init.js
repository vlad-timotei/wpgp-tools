/* UserScript Initialization */ 
const wpgpt_us_assets = {
    wpgpt_warning_icon: 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/warning.png',
    wpgpt_notice_icon: 'https://github.com/vlad-timotei/wpgp-tools/raw/main/src/img/notice.png',
};

const cssTxt = GM_getResourceText( 'wpgpt-style' );
GM_addStyle( cssTxt );

/*
** Scripts loaded below: wpgpt-functions.js, wpgpt-settings.js, wpgpt-checks.js, wpgpt-consistency.js, wpgpt-bulk-consistency.js & wpgpt-history.js
*/
