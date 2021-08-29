var wpgpt_settings = {
	'checks' : {
		'desc' : 'General Checks',
		'state' : 'enabled',
		'setting_type' : 2,
		'parent_setting' : 'self'
		},
		'start_end_space' : {
			'desc' : 'Additional or missing start or end space',
			'state' : 'warning',
			'setting_type' : 3,
			'parent_setting' : 'checks'
		},
		'end_period' : {
			'desc' : 'Additional or missing end period symbol',
			'state' : 'warning',
			'setting_type' : 3,
			'parent_setting' : 'checks'
		},
		'end_colon' : {
			'desc' : 'Additional or missing end colon (:)',
			'state' : 'warning',
			'setting_type' : 3,
			'parent_setting' : 'checks'
		},
		'end_question_exclamation' : {
			'desc' : 'Missing end <b>?</b> or <b>!</b>',
			'state' : 'notice',
			'setting_type' : 3,
			'parent_setting' : 'checks'
		},
		'double_spaces' : {
			'desc' : 'Multiple spaces',
			'state' : 'warning',
			'setting_type' : 3,
			'parent_setting' : 'checks'
		},
		'warning_words' : {
			'desc' : 'Prevent saving these words:',
			'state': '',
			'setting_type'	: 4,
			'parent_setting' : 'checks'
		},
		'match_words' : {
			'desc'	: 'Count and match these:',
			'state' : '',
			'setting_type'	: 4,
			'parent_setting' : 'checks'
		},
		'checks_labels' : {
			'desc'	: 'Warning labels and highlights',
			'state' : 'enabled',
			'setting_type'	: 2,
			'parent_setting' : 'checks'
		},
		'placeholders' : {
			'desc' : 'Missing or broken placeholders',
			'state': '<span class="note">Can\'t be disabled. To bypass, click <i>Save / approve with warnings</i> when prompted.</span>',
			'setting_type' : 0,
			'parent_setting' : 'checks'
		},
	'locale_checks' : {
		'desc' : 'Locale specific checks',
		'setting_type' : 0,
		'parent_setting' : 'self'
	},
		'custom_period' : {
			'desc'	: 'My locale uses this custom period symbol:',
			'state' : '',
			'setting_type'	: 5,
			'parent_setting' : 'locale_checks'
		},
		'ro_checks' : {
			'desc' : 'Romanian checks',
			'state' : 'disabled',
			'setting_type' : 2,
			'parent_setting' : 'locale_checks'
		},
			'ro_diacritics' : {
				'desc' : 'Wrong ro_RO diacritics (ÃãŞşŢţ)',
				'state' : 'warning',
				'setting_type' : 3,
				'parent_setting' : 'ro_checks'
				},
			'ro_quotes' : {
				'desc' : 'Wrong ro_RO quotes ("" instead of „”)',
				'state' : 'warning',
				'setting_type' : 3,
				'parent_setting' : 'ro_checks'
				},
			'ro_ampersand' : {
				'desc' : '& instead of „și”',
				'state' : 'warning',
				'setting_type' : 3,
				'parent_setting' : 'ro_checks'
				},
			'ro_slash' : {
				'desc' : 'No spaces around slash (/) ',
				'state' : 'warning',
				'setting_type' : 3,
				'parent_setting' : 'ro_checks'
				},
			'ro_dash' : {
				'desc' : 'No — use - instead',
				'state' : 'warning',
				'setting_type' : 3,
				'parent_setting' : 'ro_checks'
				},
	'history' : {
		'desc' : 'History Tools',
		'setting_type' : 0,
		'parent_setting' : 'self'
	},
		'history_main' : {
				'desc' : 'History Compare',
				'state': 'disabled',
				'setting_type' : 2,
				'parent_setting' : 'history'
			},
				'history_count' : {
					'desc' : 'History Count',
					'state' : 'disabled',
					'setting_type' : 2,
					'parent_setting' : 'history_main'
				},
				'history_page' : {
					'desc' : 'History Tools in Translation History',
					'state' : 'disabled',
					'setting_type' : 2,
					'parent_setting' : 'history_main'
				},
	'others' : {
		'desc' : 'Other settings',
		'setting_type' : 0,
		'parent_setting' : 'self'
	},
		'search' : {
			'desc' : 'Consistency Tools',
			'state' : 'enabled',
			'setting_type' : 2,
			'parent_setting' : 'others'
		},
		'shortcuts' : {
			'desc' : 'Custom Keyboard Shortcuts',
			'state' : 'enabled',
			'setting_type' : 2,
			'parent_setting' : 'others'
		},
		'prevent_unsaved' : {
			'desc' : 'Save before leaving prompt',
			'state' : 'disabled',
			'setting_type' : 2,
			'parent_setting' : 'others'
		},
		'bulk_consistency' : {
			'desc' : 'Bulk Consistency replacement <br><small>(only works for GTEs)</small>',
			'state' : 'disabled',
			'setting_type' : 2,
			'parent_setting' : 'others'
		},
	'last_checked' : {
		'state' : 'never',
		'parent_setting' : 'none',
		'setting_type'	: -1
	},
	'last_version' : {
		'state' : WPGPT_VERSION,
		'parent_setting' : 'none',
		'setting_type' : -1
	},
	'current_version' : {
		'state' : WPGPT_VERSION,
		'parent_setting' : 'none',
		'setting_type' : -1
	},
};
jQuery( '#menu-headline-nav' ).append( '<li class="menu-item wpgpt_settings_menu" style="cursor:pointer;"><a>Tools Settings</a></li>' );
jQuery( '.wpgpt_settings_menu' ).click( function() { wpgpt_settings_page(); } );
var wpgpt_info = '<div class="wpgpt-info"><strong>WPGPT version ' + WPGPT_VERSION + '</strong> | <a href="https://github.com/vlad-timotei/wpgp-tools/blob/main/README.md">Documentation</a> | <a href="https://github.com/vlad-timotei/wpgp-tools/issues/new?assignees=&amp;labels=&amp;template=bug_report.md">Report a bug</a> or <a href="https://github.com/vlad-timotei/wpgp-tools/issues/new?assignees=&amp;labels=&amp;template=feature_request.md">request a feature</a> | <a href="#" class="wpgpt-backup" title="Drag and drop to Bookmarks bar to backup your settings.">Backup WPGPT settings</a> | Happy translating!</div>';
var wpgpt_user_settings = {};
if ( wpgpt_getLS( 'wpgpt-user-settings' ) !== null ) {
	wpgpt_user_settings = JSON.parse( wpgpt_getLS( 'wpgpt-user-settings' ) );
	for( const property in wpgpt_settings ) {
		if ( wpgpt_settings[ property ][ 'setting_type' ] != 0 && wpgpt_user_settings[ property ]!== undefined ) {
			wpgpt_settings[ property ][ 'state' ] = wpgpt_user_settings[ property ];
		}
	}
}

var wpgpt_settings_state = 0;

function wpgpt_settings_page() {
	if ( wpgpt_settings_state ) {
		wpgpt_exit_settings();
		return;
	} else {
		jQuery( '.wpgpt_settings a' ).html( '<b>Close</b> Settings' );
		wpgpt_settings_state = 1;
	}

	if ( jQuery( '.wpgpt-snippets-window' ).length !== 0 ) {
		jQuery( '.wpgpt-snippets-window' ).hide();
	}

	if ( jQuery( '.wpgpt-settings-window' ).length !== 0 ) {
		jQuery( '.wpgpt-settings-window' ).toggle();
		return;
	}

	var container = '<div class="wpgpt-settings-window"></div>';
	jQuery( '.gp-content' ).html( container );

	var wpgpt_settings_count = Object.keys( wpgpt_settings ).length;
	var i = 1;

	var this_shtml, this_shtml_class;
	var shtml = '';

	jQuery.each( wpgpt_settings, function( key ) {
		if ( wpgpt_settings[ key ][ 'parent_setting' ] != 'none' ) {
			this_shtml = '';
			this_shtml_class = '';

			switch ( wpgpt_settings[ key ][ 'setting_type' ] ) {
				case 0:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[ key ][ 'desc' ] + '</div>' + ( ( wpgpt_settings[ key ][ 'state' ] != undefined ) ? wpgpt_settings[ key ][ 'state' ] : '' );
					break;
				case 2:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[ key ][ 'desc' ] +'</div>' +
									'<div class="wpgpt-setting-type-2"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="enabled" ' + ( ( wpgpt_settings[ key ][ 'state' ] == 'enabled' ) ? 'checked' : '' ) + '> Enabled</label></div>'+
									'<div class="wpgpt-setting-type-2"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="disabled" ' + ( ( wpgpt_settings[ key ][ 'state' ] == 'disabled' ) ? 'checked' : '' ) + '> Disabled</label></div>';
					break;
				case 3:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[ key ][ 'desc' ] +'</div>' +
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="warning" ' + ( ( wpgpt_settings[ key ][ 'state' ] == 'warning' ) ? 'checked' : '' ) + '> Warn & prevent save</label></div>'+
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="notice" ' + ( ( wpgpt_settings[ key ][ 'state' ] == 'notice' ) ? 'checked' : '' )  + '> Just notification</label></div>'+
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="nothing" ' + ( ( wpgpt_settings[ key ][ 'state' ] == 'nothing' ) ? 'checked' : '' ) + '> Don\'t check</label></div>';
					break;
				case 4:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[ key ][ 'desc' ] +'</div>' +
									'<input type="text" id="' + key +'" placeholder="Leave empty to disable. Case insensitive. Separate by comma (,) with no spaces" value="' +
									wpgpt_settings[ key ][ 'state' ] + '">';
					break;
				case 5:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[ key ][ 'desc' ] +'</div>' +
									'<input type="text" id="' + key +'" placeholder="E.g. 。 Leave empty if you use . symbol"value="' +
									wpgpt_settings[ key ][ 'state' ] + '">';
			}

			if ( wpgpt_settings[ key ][ 'parent_setting' ] != 'self' ) {
				if ( wpgpt_settings[wpgpt_settings[ key ][ 'parent_setting' ]][ 'parent_setting' ] != 'self' ) {
					this_shtml_class += 'wpgpt-sub-sub-setting wpgpt-child-of-' + wpgpt_settings[ key ][ 'parent_setting' ] +' wpgpt-s-' + key;
				} else {
					this_shtml_class += 'wpgpt-sub-setting wpgpt-child-of-' + wpgpt_settings[ key ][ 'parent_setting' ] +' wpgpt-s-' + key;
				}
			}
			else {
				this_shtml_class += 'wpgpt-main-setting wpgpt-s-' + key;
			}

		shtml += '<div class="' + this_shtml_class + '">' + this_shtml + '</div>';
		}

		if ( i == wpgpt_settings_count ) {
			shtml += '<button id="save_settings" >Save all settings</button>';
			jQuery( '.wpgpt-settings-window' ).append( shtml );
			jQuery.each( wpgpt_settings, function( key ) {
				if ( wpgpt_settings[ key ][ 'state' ] == 'disabled' ) {
					jQuery( '.wpgpt-child-of-' + key ).hide();
				}
			});
		}
		i++;
	});

	var shortcuts_html=	'<div class="gp-shortcuts"><div class="gp-header gp-row"><div class="gp-shortcut">Default shortcuts</div><div class="gp-shortcut">Key</div><div class="gp-shortcut">Alternative key</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Cancel</div><div class="gp-shortcut">Escape</div><div class="gp-shortcut">Ctrl + Shift + Z</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Previous String Editor</div><div class="gp-shortcut">Page Up</div><div class="gp-shortcut">Ctrl + Up Arrow</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Next String Editor</div><div class="gp-shortcut">Page Down</div><div class="gp-shortcut">Ctrl + Down Arrow</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="s">S</span>ave</div><div class="gp-shortcut"><span class="s">S</span>hift + Enter</div><div class="gp-shortcut"></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="c">C</span>opy original</div><div class="gp-shortcut"><span class="c">C</span>trl + Enter</div><div class="gp-shortcut">Ctrl + Shift + <span class="c">B</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="a">A</span>pprove</div><div class="gp-shortcut">Ctrl + <span class="a big">+</span> <span class="small note">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="a">A</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="r">R</span>eject</div><div class="gp-shortcut">Ctrl + <span class="r big">-</span> <span class="small note">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="r">R</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="f">F</span>uzzy</div><div class="gp-shortcut">Ctrl + <span class="f big">~</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="big f">~</span></div></div></div>';
	shortcuts_html +=	'<div class="gp-shortcuts"><div class="gp-header gp-row"><div class="gp-shortcut">Custom shortcuts</div><div class="gp-shortcut">Key</div><div class="gp-shortcut">Alternative key</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="f">F</span>uzzy</div><div class="gp-shortcut">Ctrl + <span class="f big">*</span><span class="small note">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="f">F</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="r">G</span>oogle Translate<span class="note">*</span></div><div class="gp-shortcut">Alt + <span class="r">G</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="s">C</span>onsistency<span class="note">*</span></div><div class="gp-shortcut">Alt + <span class="s">C</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Copy consistency* <span class="c">#2</span></div><div class="gp-shortcut">Alt + <span class="c">2</span></div><div class="gp-shortcut"><span class="small note">works for suggestions #1 to #9</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Focus on <span class="a">S</span>earch in <span class="a">P</span>rojects<span class="note">*</span></div><div class="gp-shortcut">Alt + <span class="a">S</span></div><div class="gp-shortcut">Alt + <span class="a">P</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Insert all <span class="f">N</span>on-translatables</div><div class="gp-shortcut">Alt + <span class="f">N</span></div><div class="gp-shortcut"></div></div>' +
						'<span class="small note">*if setting is enabled<span>' +
						'</div><br><br>';

	jQuery( '.wpgpt-settings-window' )
		.prepend( wpgpt_info )
		.append( shortcuts_html, wpgpt_info );


	jQuery( '.wpgpt-update' ).click( function() {

		var option_name = jQuery( this ).attr( 'name' );
		var option_value = jQuery( this ).val();
		wpgpt_update_setting( option_name, option_value );

		if ( option_value == 'disabled' ) {
			jQuery( '.wpgpt-child-of-' + option_name ).hide( 200 );
		}
		else {
			jQuery( '.wpgpt-child-of-' + option_name ).show( 200 );
		}
	});

	jQuery( '#save_settings' ).click( wpgpt_exit_settings );

	jQuery( '.wpgpt-backup' ).on( 'mousedown', function(){
		wpgpt_exit_settings( false );
		var backup_user_settings = wpgpt_getLS( 'wpgpt-user-settings');
		var backup_date = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString();
		var backup_script = `javascript: 
		if ( document.location.hostname == 'translate.wordpress.org') {
			var backup_version = '${WPGPT_VERSION}';
			var backup_date = '${backup_date}';
			var current_settings = JSON.parse( localStorage.getItem( 'wpgpt-user-settings') );
			var confirm_message; 
			if ( backup_version == current_settings.current_version ) { 
				confirm_message = 'Backup from ' + backup_date + ' of WPGPT version ' + backup_version + '.\\n\\nRestore old settings?';
			} else {
				confirm_message = 'Backup from ' + backup_date + ' of WPGPT version ' + backup_version + '. \\n\\nNew settings from WPGPT ' + current_settings.current_version + ' will be lost. \\nRestore old settings?';
			}
			if ( confirm( confirm_message ) ) {
				localStorage.setItem( 'wpgpt-user-settings', '${backup_user_settings}' );
				alert( 'Settings restored from backup!' );
				location.reload(); 
			}
		} else { 
			alert( 'To restore settings, click this bookmark while being on a translate.w.org page.' ); 
		}`;
		jQuery( this ).attr( 'href', backup_script );
	} );
}

function wpgpt_update_setting( name, val ) {
	wpgpt_settings[ name ][ 'state' ] = val;
	for ( const property in wpgpt_settings ) {
		if ( wpgpt_settings[ property ][ 'setting_type' ] != 0 ) {
			wpgpt_user_settings[ property ] = wpgpt_settings[ property ][ 'state' ];
		}
	}
    wpgpt_setLS( 'wpgpt-user-settings', JSON.stringify( wpgpt_user_settings ) );
}

function wpgpt_exit_settings( reload = true ) {
	wpgpt_settings[ 'custom_period' ][ 'state' ] = jQuery( '#custom_period' ).val();
	wpgpt_settings[ 'warning_words' ][ 'state' ] = jQuery( '#warning_words' ).val(); // to avoid redundancy
	wpgpt_update_setting( 'match_words', jQuery( '#match_words' ).val());
	if ( reload ) {
		location.reload();
	}
}

/*
* Override show function to display the editor in the middle of the screen
* Based on: https://meta.trac.wordpress.org/browser/sites/trunk/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/js/editor.js#L143
*/

if ( typeof $gp !== 'undefined' ) {
	$gp.editor.show = ( function( original ) {
		return function( element ) {
			original.apply( $gp.editor, arguments );
			document.getElementById( 'editor-' + element.closest( 'tr' ).attr( 'row' )).scrollIntoView( {
				behavior: 'auto',
				block: 'center',
				inline: 'center'
			} );
		};
	})( $gp.editor.show );
}

// Extension version.
function wpgpt_version() {
	if ( wpgpt_settings[ 'last_checked' ][ 'state' ] != 'never' ) {
		if ( ( Date.now() - wpgpt_settings[ 'last_checked' ][ 'state' ] ) < 43200000 ) { // >12h
			if ( wpgpt_new_version( wpgpt_settings[ 'last_version' ][ 'state' ],  WPGPT_VERSION ) ) {
				wpgpt_display_notice();	
			}
			return;
		}
	}
	setTimeout( wpgpt_check_version, 5000 );
}

function wpgpt_check_version() {
    var req = 'https://wptools.vladtimotei.ro/wpgp-tools/';
    jQuery.get( req, function( wpgpt_last_version ) {
        wpgpt_settings[ 'last_version' ][ 'state' ] = wpgpt_last_version;
		wpgpt_settings[ 'current_version' ][ 'state' ] = WPGPT_VERSION; // to avoid redundancy
		wpgpt_update_setting( 'last_checked', Date.now() );
		if ( wpgpt_new_version( wpgpt_settings[ 'last_version' ][ 'state' ], WPGPT_VERSION ) ) {
			wpgpt_display_notice();			
		}
    });
}

function wpgpt_display_notice() {
	var wpgpt_update_output = $wpgpt_createElement( 'div', { 'class': 'wpgpt-update-notice' } );
	var wpgpt_update_new_version = $wpgpt_createElement( 'strong', {}, 'WPGPTools version ' + wpgpt_settings.last_version.state + ' is available! ' );
	var wpgpt_update_current_version = document.createTextNode( 'You are using version ' + WPGPT_VERSION + '. Update now!' );
	var wpgpt_update_br = $wpgpt_createElement( 'br' );
	var wpgpt_update_link, wpgpt_update_instruction;
	if ( typeof wpgpt_is_userscript == 'undefined' ) {
		wpgpt_update_link = 'https://github.com/vlad-timotei/wpgp-tools/releases/tag/' + wpgpt_settings.last_version.state;
		wpgpt_update_instruction = ' to download the latest release, unzip the files and replace them. Then click Reload in chrome://extensions/';
	} else {
		wpgpt_update_link = 'https://github.com/vlad-timotei/wpgp-tools/raw/main/userscript/wpgpt-userscript-latest.user.js';
		wpgpt_update_instruction = ' and Tampermonkey will prompt to reinstall the userscript. If that somehow fails, please manually copy the url and install it.';
	}
	wpgpt_update_link = $wpgpt_createElement( 'a', { 'href': wpgpt_update_link }, 'Click here' );
	wpgpt_update_instruction = document.createTextNode( wpgpt_update_instruction );
	wpgpt_update_output.append(
		wpgpt_update_new_version,
		wpgpt_update_current_version,
		wpgpt_update_br.cloneNode(),
		wpgpt_update_br,
		wpgpt_update_link,
		wpgpt_update_instruction
	);
	$wpgpt_addElement( '#masthead', 'afterend', wpgpt_update_output );
}

function wpgpt_new_version( last, current ) {
	last = parseInt( last.replaceAll( '.', '' ) );
	last = ( ( last < 100 ) ? ( last*10 ) : last );

	current = parseInt( current.replaceAll( '.', '' ) );
	current = ( ( current < 100 ) ? ( current*10 ) : current );

	return ( last > current );
}

wpgpt_version();