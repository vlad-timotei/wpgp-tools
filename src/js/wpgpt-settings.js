const WPGPT_VERSION = '1.8';
const wpgpt_settings = {
	'checks': {
		'desc':           'General Checks',
		'state':          'enabled',
		'setting_type':   2,
		'parent_setting': 'self',
	},
	'start_end_space': {
		'desc':           'Additional or missing start or end space',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'checks',
	},
	'end_period': {
		'desc':           'Additional or missing end period symbol',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'checks',
	},
	'end_colon': {
		'desc':           'Additional or missing end colon (:)',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'checks',
	},
	'end_question_exclamation': {
		'desc':           'Missing end ? or !',
		'state':          'notice',
		'setting_type':   3,
		'parent_setting': 'checks',
	},
	'double_spaces': {
		'desc':           'Multiple spaces',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'checks',
	},
	'warning_words': {
		'desc':           'Prevent saving these words:',
		'state':          '',
		'setting_type':   4,
		'parent_setting': 'checks',
	},
	'match_words': {
		'desc':           'Count and match these:',
		'state':          '',
		'setting_type':   4,
		'parent_setting': 'checks',
	},
	'checks_labels': {
		'desc':           'Warning labels and highlights',
		'state':          'enabled',
		'setting_type':   2,
		'parent_setting': 'checks',
	},
	'placeholders': {
		'desc':           'Missing or broken placeholders',
		'state':          '<span class="note">Can\'t be disabled. To bypass, click <i>Save / approve with warnings</i> when prompted.</span>',
		'setting_type':   0,
		'parent_setting': 'checks',
	},
	'locale_checks': {
		'desc':           'Locale specific checks',
		'setting_type':   0,
		'parent_setting': 'self',
	},
	'custom_period': {
		'desc':           'My locale uses this custom period symbol:',
		'state':          '',
		'setting_type':   5,
		'parent_setting': 'locale_checks',
	},
	'ro_checks': {
		'desc':           'Romanian checks',
		'state':          'disabled',
		'setting_type':   2,
		'parent_setting': 'locale_checks',
	},
	'ro_diacritics': {
		'desc':           'Wrong ro_RO diacritics (ÃãŞşŢţ)',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'ro_checks',
	},
	'ro_quotes': {
		'desc':           'Wrong ro_RO quotes ("" instead of „”)',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'ro_checks',
	},
	'ro_ampersand': {
		'desc':           '& instead of „și”',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'ro_checks',
	},
	'ro_slash': {
		'desc':           'No spaces around slash (/) ',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'ro_checks',
	},
	'ro_dash': {
		'desc':           'No — use - instead',
		'state':          'warning',
		'setting_type':   3,
		'parent_setting': 'ro_checks',
	},
	'history': {
		'desc':           'History Tools',
		'setting_type':   0,
		'parent_setting': 'self',
	},
	'history_main': {
		'desc':           'History Compare',
		'state':          'disabled',
		'setting_type':   2,
		'parent_setting': 'history',
	},
	'history_count': {
		'desc':           'History Count',
		'state':          'disabled',
		'setting_type':   2,
		'parent_setting': 'history_main',
	},
	'history_page': {
		'desc':           'History Tools in Translation History',
		'state':          'disabled',
		'setting_type':   2,
		'parent_setting': 'history_main',
	},
	'others': {
		'desc':           'Other settings',
		'setting_type':   0,
		'parent_setting': 'self',
	},
	'search': {
		'desc':           'Consistency Tools',
		'state':          'enabled',
		'setting_type':   2,
		'parent_setting': 'others',
	},
	'shortcuts': {
		'desc':           'Custom Keyboard Shortcuts',
		'state':          'enabled',
		'setting_type':   2,
		'parent_setting': 'others',
	},
	'prevent_unsaved': {
		'desc':           'Save before leaving prompt',
		'state':          'disabled',
		'setting_type':   2,
		'parent_setting': 'others',
	},
	'bulk_consistency': {
		'desc':           'Bulk Consistency Replacement for GTEs',
		'state':          'disabled',
		'setting_type':   2,
		'parent_setting': 'others',
	},
};
const settings_li = document.createElement( 'li' );
settings_li.classList.add( 'menu-item', 'wpgpt_settings_menu' );
settings_li.appendChild( document.createElement( 'a' ) ).appendChild( document.createTextNode( 'Tools Settings' ) );
document.querySelector( '#menu-headline-nav' ).append( settings_li );
settings_li.addEventListener( 'click', wpgpt_settings_page );

let wpgpt_user_settings = {};
if ( localStorage.getItem( 'wpgpt-user-settings' ) !== null ) {
	wpgpt_user_settings = JSON.parse( localStorage.getItem( 'wpgpt-user-settings' ) );
	for ( const property in wpgpt_settings ) {
		if ( wpgpt_settings[ property ][ 'setting_type' ] !== 0 && wpgpt_user_settings[ property ] !== undefined ) {
			wpgpt_settings[ property ][ 'state' ] = wpgpt_user_settings[ property ];
		}
	}
}

let wpgpt_settings_state = 'closed';
function wpgpt_settings_page() {
	if ( 'open' === wpgpt_settings_state ) {
		wpgpt_exit_settings();
		return;
	}
	wpgpt_settings_state = 'open';
	settings_li.querySelector( 'a' ).textContent = 'Close Settings';

	const settingsFragment = document.createDocumentFragment();
	const settingsSubFragment = document.createDocumentFragment();
	const settingsSubSubFragment = document.createDocumentFragment();
	const settingsLabel = document.createElement( 'label' );

	const wpgpt_info = document.createElement( 'div' );
	wpgpt_info.className = 'wpgpt-info';
	wpgpt_info.append(
		$wpgpt_createElement( 'strong', {}, `WPGPT version ${WPGPT_VERSION}` ), ' | ',
		$wpgpt_createElement( 'a', { 'href': 'https://github.com/vlad-timotei/wpgp-tools/blob/main/README.md' }, 'Documentation' ), ' | ',
		$wpgpt_createElement( 'a', { 'href': 'https://github.com/vlad-timotei/wpgp-tools/issues/new?assignees=&amp;labels=&amp;template=bug_report.md' }, 'Report a bug' ),	' or ',
		$wpgpt_createElement( 'a', { 'href': 'https://github.com/vlad-timotei/wpgp-tools/issues/new?assignees=&amp;labels=&amp;template=feature_request.md' }, 'request a feature' ), ' | ',
		$wpgpt_createElement( 'a', { 'href': '#', 'title': 'Drag and drop to Bookmarks bar to backup your settings.', 'id': 'wpgpt-backup' }, 'Backup WPGPT settings' ), ' | Happy translating!',
	);
	settingsFragment.appendChild( wpgpt_info.cloneNode( true ) );

	let setting_class;
	Object.entries( wpgpt_settings ).forEach( setting_data => {
		const [ key, setting ] = setting_data;
		if ( setting.parent_setting !== 'none' ) {
			settingsSubFragment.append( $wpgpt_createElement( 'div', { 'class': 'wpgpt-setting-description' }, setting.desc ) );
			const setting_type = document.createElement( 'div' );
			setting_type.className = `wpgpt-setting-type-${setting.setting_type}`;
			switch ( setting.setting_type ) {
			case 2:
			case 3:
				Object.entries( ( 2 === setting.setting_type ) ? { 'enabled': 'Enabled', 'disabled': 'Disabled' } : { 'warning': 'Warn & prevent save', 'notice': 'Just notification', 'nothing': 'Don\'t check' } ).forEach( ( data ) => {
					const [ value, value_txt ] = data;
					const isChecked = ( value === setting.state ) ? 'checked' : 'not_checked';
					settingsSubSubFragment.appendChild( setting_type.cloneNode( true ) ).append(
						$wpgpt_createElement( 'input', { 'type': 'radio', 'class': 'wpgpt-update', 'name': key, 'value': value, [isChecked]: true } ),
						value_txt,
					);
					settingsSubFragment.appendChild( settingsLabel.cloneNode( true ) ).appendChild( settingsSubSubFragment );
				} );
				break;
			case 4:
				settingsSubFragment.appendChild(
					$wpgpt_createElement( 'input', { 'type': 'text', 'id': key, 'placeholder': 'Leave empty to disable. Case insensitive. Separate by comma (,) with no spaces', 'value': setting.state } ),
				);
				break;
			case 5:
				settingsSubFragment.appendChild( $wpgpt_createElement( 'input', { 'type': 'text', 'id': key, 'placeholder': 'E.g. 。 Leave empty if you use . symbol', 'value': setting.state } ) );
			}

			if ( 'self' === setting.parent_setting ) {
				setting_class = `wpgpt-main-setting wpgpt-s-${key}`;
			} else if ( 'self' === wpgpt_settings[ setting.parent_setting ][ 'parent_setting' ] ) {
				setting_class = `wpgpt-sub-setting wpgpt-child-of-${setting.parent_setting} wpgpt-s-${key}`;
			} else {
				setting_class = `wpgpt-sub-sub-setting wpgpt-child-of-${setting.parent_setting} wpgpt-s-${key}`;
			}

			const setting_div = document.createElement( 'div' );
			setting_div.className = setting_class;
			setting_div.appendChild( settingsSubFragment );
			settingsFragment.appendChild( setting_div );
		}
	} );

	settingsFragment.appendChild( $wpgpt_createElement( 'button', { 'id': 'save_settings' }, 'Save all settings' ) );

	const shortcuts_el_default = document.createElement( 'div' );
	shortcuts_el_default.className = 'gp-shortcuts';
	const shortcuts_el_custom = shortcuts_el_default.cloneNode( true );
	shortcuts_el_default.innerHTML = `<div class="gp-header gp-row"><div class="gp-shortcut">Default shortcuts</div><div class="gp-shortcut">Key</div><div class="gp-shortcut">Alternative key</div></div>
	<div class="gp-row"><div class="gp-shortcut">Cancel</div><div class="gp-shortcut">Escape</div><div class="gp-shortcut">Ctrl + Shift + Z</div></div>
	<div class="gp-row"><div class="gp-shortcut">Previous String Editor</div><div class="gp-shortcut">Page Up</div><div class="gp-shortcut">Ctrl + Up Arrow</div></div>
	<div class="gp-row"><div class="gp-shortcut">Next String Editor</div><div class="gp-shortcut">Page Down</div><div class="gp-shortcut">Ctrl + Down Arrow</div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="s">S</span>ave</div><div class="gp-shortcut"><span class="s">S</span>hift + Enter</div><div class="gp-shortcut"></div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="c">C</span>opy original</div><div class="gp-shortcut"><span class="c">C</span>trl + Enter</div><div class="gp-shortcut">Ctrl + Shift + <span class="c">B</span></div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="a">A</span>pprove</div><div class="gp-shortcut">Ctrl + <span class="a big">+</span> <span class="small note">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="a">A</span></div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="r">R</span>eject</div><div class="gp-shortcut">Ctrl + <span class="r big">-</span> <span class="small note">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="r">R</span></div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="f">F</span>uzzy</div><div class="gp-shortcut">Ctrl + <span class="f big">~</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="big f">~</span></div></div>`;

	shortcuts_el_custom.innerHTML = `<div class="gp-header gp-row"><div class="gp-shortcut">Custom shortcuts</div><div class="gp-shortcut">Key</div><div class="gp-shortcut">Alternative key</div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="f">F</span>uzzy</div><div class="gp-shortcut">Ctrl + <span class="f big">*</span><span class="small note">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="f">F</span></div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="r">G</span>oogle Translate<span class="note">*</span></div><div class="gp-shortcut">Alt + <span class="r">G</span></div></div>
	<div class="gp-row"><div class="gp-shortcut"><span class="s">C</span>onsistency<span class="note">*</span></div><div class="gp-shortcut">Alt + <span class="s">C</span></div></div>
	<div class="gp-row"><div class="gp-shortcut">Copy consistency* <span class="c">#2</span></div><div class="gp-shortcut">Alt + <span class="c">2</span></div><div class="gp-shortcut"><span class="small note">works for suggestions #1 to #9</span></div></div>
	<div class="gp-row"><div class="gp-shortcut">Focus on <span class="a">S</span>earch in <span class="a">P</span>rojects<span class="note">*</span></div><div class="gp-shortcut">Alt + <span class="a">S</span></div><div class="gp-shortcut">Alt + <span class="a">P</span></div></div>
	<div class="gp-row"><div class="gp-shortcut">Insert all <span class="f">N</span>on-translatables</div><div class="gp-shortcut">Alt + <span class="f">N</span></div><div class="gp-shortcut"></div></div>
	<span class="small note">*if setting is enabled<span><br><br>`;
	settingsFragment.append( shortcuts_el_default, shortcuts_el_custom );

	const settings_window = document.createElement( 'div' );
	settings_window.classList.add( 'wpgpt-settings-window', 'gp-content' );
	settingsFragment.appendChild( wpgpt_info );
	settings_window.appendChild( settingsFragment );
	const gp_div = document.querySelector( '.gp-content' );
	gp_div.parentNode.replaceChild( settings_window, gp_div );

	Object.keys( wpgpt_settings ).forEach( ( key ) => {
		( 'disabled' === wpgpt_settings[ key ][ 'state' ] ) && document.querySelectorAll( `.wpgpt-child-of-${key}` ).forEach( ( el ) => { el.style.display = 'none'; } );
	} );

	document.querySelectorAll( '.wpgpt-update' ).forEach( ( el ) => {
		el.addEventListener( 'click', ( ev ) => {
			wpgpt_update_setting( ev.target.name, ev.target.value );
			( 'enabled' === ev.target.value ) && jQuery( `.wpgpt-child-of-${ev.target.name}` ).show( 200 );
			( 'disabled' === ev.target.value ) && jQuery( `.wpgpt-child-of-${ev.target.name}` ).hide( 200 );
		} );
	} );

	document.getElementById( 'save_settings' ).addEventListener( 'click', wpgpt_exit_settings );

	document.getElementById( 'wpgpt-backup' ).addEventListener( 'mousedown', ( ev ) => {
		wpgpt_exit_settings( false );
		ev.target.href = `javascript: 
		if ( typeof WPGPT_VERSION !== 'undefined' ) {
			let confirm_message = 'Backup from ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} of WPGPT version ${WPGPT_VERSION}.\\n\\n';
			confirm_message += 	( '${WPGPT_VERSION}' !== WPGPT_VERSION ) ? 'New settings from WPGPT ' + WPGPT_VERSION + ' will be lost. \\n' : '';
			confirm_message +=  'Restore old settings?';
			if ( confirm( confirm_message ) ) {
				localStorage.setItem( 'wpgpt-user-settings', '${localStorage.getItem( 'wpgpt-user-settings' )}' );
				alert( 'Settings restored from backup!' );
				location.reload(); 
			}
		} else { 
			alert( 'To restore settings, click this bookmark while being on a translate.w.org page with WPGPT active.' ); 
		}`;
	} );
}

function wpgpt_update_setting( name, val ) {
	wpgpt_settings[ name ][ 'state' ] = val;
	for ( const property in wpgpt_settings ) {
		if ( wpgpt_settings[ property ][ 'setting_type' ] !== 0 ) {
			wpgpt_user_settings[ property ] = wpgpt_settings[ property ][ 'state' ];
		}
	}
	localStorage.setItem( 'wpgpt-user-settings', JSON.stringify( wpgpt_user_settings ) );
}

function wpgpt_exit_settings( reload = true ) {
	wpgpt_settings.custom_period.state = document.getElementById( 'custom_period' ).value;
	wpgpt_settings.warning_words.state = document.getElementById( 'warning_words' ).value; // to avoid redundancy
	wpgpt_update_setting( 'match_words', document.getElementById( 'match_words' ).value );
	if ( reload ) {
		location.reload();
	}
}

/*
* Override show function to display the editor in the middle of the screen
* Based on: https://meta.trac.wordpress.org/browser/sites/trunk/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/js/editor.js#L143
*/

if ( typeof $gp_editor_options !== 'undefined' ) {
	$gp.editor.show = ( function( original ) {
		return function( element ) {
			original.apply( $gp.editor, arguments );
			document.getElementById( `editor-${element.closest( 'tr' ).attr( 'row' )}` ).scrollIntoView( {
				behavior: 'auto',
				block:    'center',
				inline:   'center',
			} );
		};
	} )( $gp.editor.show );
}
