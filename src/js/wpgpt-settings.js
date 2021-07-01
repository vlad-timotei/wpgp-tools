var wpgpt_settings = {
	'checks' : {
		'desc' : 'General Checks',
		'state' : 'enabled',
		'type' : 2,
		'parent' : 'self'
		},
		'start_space' : {
			'desc' : 'Additional or missing start space',
			'state' : 'warning',
			'type' : 3,
			'parent' : 'checks'
		},
		'end_space' : {
		'desc' : 'Additional or missing end space',
		'state' : 'warning',
		'type' : 3,
		'parent' : 'checks'
		},
		'end_period' : {
			'desc' : 'Additional or missing end period',
			'state' : 'warning',
			'type' : 3,
			'parent' : 'checks'
		},
		'end_colon' : {
			'desc' : 'Additional or missing end colon (:)',
			'state' : 'warning',
			'type' : 3,
			'parent' : 'checks'
		},
		'end_question' : {
			'desc' : 'Missing end question mark (?)',
			'state' : 'notice',
			'type' : 3,
			'parent' : 'checks'
		},
		'double_spaces' : {
			'desc' : 'Multiple spaces',
			'state' : 'warning',
			'type' : 3,
			'parent' : 'checks'
		},
		'warning_words' : { 
			'desc' : 'Prevent saving these words',
			'state': '',
			'type'	: 4,
			'parent' : 'checks'
		},
		'notice_words' : {
			'desc'	: 'Notify about these words',
			'state' : '',
			'type'	: 4,
			'parent' : 'checks'
		},
		'placeholders' : {
			'desc' : 'Missing or broken placeholders',
			'state': '<span class="note">Can\'t be disabled. To bypass, click <i>Save / approve with warnings</i> when prompted.</span>',
			'type' : 0,
			'parent' : 'checks'
		},
	'locale_checks' : {
		'desc' : 'Locale specific checks',
		'type' : 0,
		'parent' : 'self'
	},
		'custom_period' : {
			'desc'	: 'My locale uses this custom period symbol:',
			'state' : '',
			'type'	: 5,
			'parent' : 'locale_checks'
		},
		'ro_checks' : {
			'desc' : 'Romanian checks',
			'state' : 'disabled',
			'type' : 2,
			'parent' : 'locale_checks'
		},
			'ro_diacritics' : {
				'desc' : 'Wrong ro_RO diacritics (ÃãŞşŢţ)',
				'state' : 'warning',
				'type' : 3,
				'parent' : 'ro_checks'
				},
			'ro_quotes' : {
				'desc' : 'Wrong ro_RO quotes ("" instead of „”)',
				'state' : 'warning',
				'type' : 3,
				'parent' : 'ro_checks'
				},
			'ro_ampersand' : {
				'desc' : '& instead of „și”',
				'state' : 'warning',
				'type' : 3,
				'parent' : 'ro_checks'
				},
			'ro_slash' : {
				'desc' : 'No spaces around slash (/) ',
				'state' : 'warning',
				'type' : 3,
				'parent' : 'ro_checks'
				},
			'ro_dash' : {
				'desc' : 'No — use - instead',
				'state' : 'warning',
				'type' : 3,
				'parent' : 'ro_checks'
				},
	'others' : {
		'desc' : 'Other settings',
		'type' : 0,
		'parent' : 'self'
	},
		'search' : {
			'desc' : 'Consistency Tools',
			'state' : 'enabled',
			'type' : 2,
			'parent' : 'others'
		},
		'shortcuts' : {
			'desc' : 'Custom Keyboard Shortcuts',
			'state' : 'enabled',
			'type' : 2,
			'parent' : 'others'
		},
		'prevent_unsaved' : {
			'desc' : 'Save before leaving prompt',
			'state' : 'disabled',
			'type' : 2,
			'parent' : 'others'
		},
		'string_history' : {
			'desc' : 'Load string history',
			'state': 'disabled',
			'type' : 2,
			'parent' : 'others'
		},
			'string_history_current' : {
				'desc' : 'Also load current string history',
				'state' : 'disabled',
				'type' : 2,
				'parent' : 'string_history'
			},
	'last_checked' :{
			'state' : 'never',
			'parent' : 'none',
			'type'	: -1
	},
	'last_version' :{
			'state' : WPGPT_VERSION,
			'parent' : 'none',
			'type' : -1
	},
};
if( typeof wpgpt_update_template == 'undefined' ){
	var wpgpt_update_template = '<div class="wpgpt-update-notice"><strong>WPGPTools v.%s has new features!</strong> You\'re using v.' + WPGPT_VERSION + '. Update now! ' +
								'<br><a href="https://github.com/vlad-timotei/wpgp-tools/releases/tag/%s">Click here to download the latest release</a>' +
								', unzip the files and replace them. <br> Don\'t forget to click <i>Reload</i> in <code>chrome://extensions/</code></div>';
}
jQuery('#menu-headline-nav').append('<li class="menu-item wpgpt_settings" style="cursor:pointer;"><a>Tools Settings</a></li>');
jQuery('.wpgpt_settings').click( function() { wpgpt_settings_page(); } );

var wpgpt_user_settings = {}; 
if( getLS('wpgpt-user-settings') !== null ){
	wpgpt_user_settings = JSON.parse( getLS('wpgpt-user-settings') ); 
	for( const property in wpgpt_settings ){
		if( wpgpt_settings[property]['type'] != 0 && wpgpt_user_settings[property]!== undefined ){
			wpgpt_settings[property]['state'] = wpgpt_user_settings[property];
		}
	}
}

var wpgpt_settings_parent = '';
var wpgpt_settings_state = 0;

function wpgpt_settings_page(){
	if( wpgpt_settings_state ){
		wpgpt_exit_settings();
		return;
	}
	else{
		jQuery('.wpgpt_settings a').html('<b>Close</b> Settings');
		wpgpt_settings_state = 1;
	}
	
	if( jQuery('.wpgpt-snippets-window').length !== 0 ){
		jQuery('.wpgpt-snippets-window').hide();
	}
	
	if( jQuery('.wpgpt-settings-window').length !== 0 ){
		jQuery('.wpgpt-settings-window').toggle();
		return;
	}
	
	var container = '<div class="wpgpt-settings-window"></div>';
	jQuery('.gp-content').html(container);

	var wpgpt_settings_count = Object.keys( wpgpt_settings ).length;
	var i = 1;
	
	var this_shtml, this_shtml_class;
	var shtml = ''; 
	var shtmlo = '';
	
	jQuery.each( wpgpt_settings, function( key ) {
		if( wpgpt_settings[key]['parent'] != 'none' ){
			this_shtml = '';
			this_shtml_class = '';
		
			switch ( wpgpt_settings[key]['type'] ){
				case 0:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[key]['desc'] + '</div>' + ( ( wpgpt_settings[key]['state'] != undefined ) ? wpgpt_settings[key]['state'] : '');
					break;
				case 2:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[key]['desc'] +'</div>' + 
									'<div class="wpgpt-setting-type-2"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="enabled" ' + ( ( wpgpt_settings[key]['state'] == 'enabled' ) ? 'checked' : '' ) + '> Enabled</label></div>'+
									'<div class="wpgpt-setting-type-2"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="disabled" ' + ( ( wpgpt_settings[key]['state'] == 'disabled' ) ? 'checked' : '' ) + '> Disabled</label></div>';
					break;
				case 3:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[key]['desc'] +'</div>' + 
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="warning" ' + ( ( wpgpt_settings[key]['state'] == 'warning' ) ? 'checked' : '' ) + '> Warn & prevent save</label></div>'+
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="notice" ' + ( ( wpgpt_settings[key]['state'] == 'notice' ) ? 'checked' : '' )  + '> Just notification</label></div>'+
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="nothing" ' + ( ( wpgpt_settings[key]['state'] == 'nothing' ) ? 'checked' : '' ) + '> Don\'t check</label></div>';
					break;
				case 4:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[key]['desc'] +'</div>' + 
									'<input type="text" id="' + key +'" placeholder="Leave empty to disable. Case sensitive. Separate words by , " value="' + 
									wpgpt_settings[key]['state'] + '">';
					break;
				case 5:
					this_shtml = 	'<div class="wpgpt-setting-description">' + wpgpt_settings[key]['desc'] +'</div>' + 
									'<input type="text" id="' + key +'" placeholder="E.g. 。 Leave empty if you use . symbol"value="' + 
									wpgpt_settings[key]['state'] + '">';
			}
			
			if( wpgpt_settings[key]['parent'] != 'self' ){
				if( wpgpt_settings[wpgpt_settings[key]['parent']]['parent'] != 'self' ){
					this_shtml_class += 'wpgpt-sub-sub-setting wpgpt-child-of-' + wpgpt_settings[key]['parent'] +' wpgpt-s-' + key;
				} else{
					this_shtml_class += 'wpgpt-sub-setting wpgpt-child-of-' + wpgpt_settings[key]['parent'] +' wpgpt-s-' + key;
				}
			}
			else{
				this_shtml_class += 'wpgpt-main-setting wpgpt-s-' + key;
			}
			
		  shtml += '<div class="' + this_shtml_class + '">' + this_shtml + '</div>';
		}
		
		if( i == wpgpt_settings_count ){
			shtml += '<button id="save_settings" >Save all settings</button>'
			jQuery('.wpgpt-settings-window').append( shtml );
			jQuery.each( wpgpt_settings, function( key ) {
				if( wpgpt_settings[key]['state'] == 'disabled' ){
					jQuery('.wpgpt-child-of-' + key ).hide();
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
						'<div class="gp-row"><div class="gp-shortcut"><span class="r">G</span>oogle Translate*</div><div class="gp-shortcut">Alt + <span class="r">G</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="s">C</span>onsistency*</div><div class="gp-shortcut">Alt + <span class="s">C</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Copy consistency* <span class="c">#2</span></div><div class="gp-shortcut">Alt + <span class="c">2</span></div><div class="gp-shortcut"><span class="small note">works with #1, #2 and #3</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Focus on <span class="a">S</span>earch in <span class="a">P</span>rojects* </div><div class="gp-shortcut">Alt + <span class="a">S</span></div><div class="gp-shortcut">Alt + <span class="a">P</span></div></div>' +
						'<span class="right-note">*if setting is enabled<span>' +
						'</div>';
									
	jQuery('.wpgpt-settings-window').append( shortcuts_html );
	jQuery('.wpgpt-update').click( function(){
		
		var option_name = jQuery(this).attr('name'); 
		var option_value = jQuery(this).val();
		wpgpt_update_setting( option_name, option_value );	
		
		if( option_value == 'disabled' ){
			jQuery('.wpgpt-child-of-' + option_name ).hide(200);
		}
		else{
			jQuery('.wpgpt-child-of-' + option_name ).show(200);
		}			
	}); 
	
	jQuery('#save_settings').click( wpgpt_exit_settings );
}
 
function wpgpt_update_setting( name, val ){
	wpgpt_settings[name]['state'] = val;
	for ( const property in wpgpt_settings ){
		if( wpgpt_settings[property]['type'] != 0 ){
			wpgpt_user_settings[property] = wpgpt_settings[property]['state'];
		}
	}
    setLS( 'wpgpt-user-settings', JSON.stringify( wpgpt_user_settings ) );
}

function wpgpt_exit_settings(){
	wpgpt_settings['custom_period']['state'] = jQuery('#custom_period').val();
	wpgpt_settings['warning_words']['state'] = jQuery('#warning_words').val(); // to avoid redundancy
	wpgpt_update_setting('notice_words', jQuery('#notice_words').val());	
	location.reload();
}

/**
 ** Override show function to display the editor in the middle of the screen
 ** Based on: https://meta.trac.wordpress.org/browser/sites/trunk/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/js/editor.js#L143
 */

if( typeof $gp !== 'undefined' ){
 $gp.editor.show = ( function( original ) {
	 return function(element) {
		 original.apply( $gp.editor, arguments );	 			
		 document.getElementById('editor-' + element.closest( 'tr' ).attr( 'row' )).scrollIntoView({
			 behavior: 'auto',
			 block: 'center',
			 inline: 'center'
			 });
		}
	})( $gp.editor.show );
}

/** Extension version */
function wpgpt_version(){
	if( wpgpt_settings['last_checked']['state'] != 'never' ){
		if( ( Date.now() - wpgpt_settings['last_checked']['state'] ) < 43200000 ){ // >12h
			if( wpgpt_new_version( wpgpt_settings['last_version']['state'],  WPGPT_VERSION ) ){	
				jQuery('#masthead').after( wpgpt_update_template.replaceAll( '%s', wpgpt_settings['last_version']['state'] ) );
			}
			return;
		}
	}
	setTimeout(wpgpt_check_version, 5000); 
}

function wpgpt_check_version() {
    var req = 'https://wptools.vladtimotei.ro/wpgp-tools/';
    jQuery.get( req, function( wpgpt_last_version ) {
        wpgpt_settings['last_version']['state'] = wpgpt_last_version; // to avoid redundancy
		wpgpt_update_setting( 'last_checked', Date.now() );
		if( wpgpt_new_version( wpgpt_settings['last_version']['state'], WPGPT_VERSION ) ){	
			jQuery('#masthead').after( wpgpt_update_template.replaceAll( '%s', wpgpt_settings['last_version']['state'] ) );
		}
    });
}

function wpgpt_new_version(last, current){
	last = parseInt( last.replaceAll('.', '') );
	last = ( ( last < 100 ) ? ( last*10 ) : last );
	
	current = parseInt( current.replaceAll('.', '') );
	current = ( ( current < 100 ) ? ( current*10 ) : current );
	
	return ( last > current );
}

wpgpt_version();