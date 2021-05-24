var settings = { 
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
	/**	'snippets' : {
	**		'desc' : 'Snippets & notes',
	**		'state' : 'disabled',
	**		'type' : 2,
	**		'parent' : 'others'
	**	}, ToDo: in future version */
	'last_checked' :{
			'state' : 'never',
			'parent' : 'none'
	},
	'last_version' :{
			'state' : WPGPT_VERSION,
			'parent' : 'none'
	},
};

var update_notif_template = '<span class="wpgpt-update-notice"><b>WPGlotPress Tools new version available</b><br>Update to version <b>%%last_version%%</b> (from  ' +
							WPGPT_VERSION + ')<br><a href="https://github.com/vlad-timotei/wpgp-tools/releases/tag/%%last_version%%"><br> Click here</a>' +
							', download, unzip the files, replace them and click <i>Reload</i> in chrome://extensions/';

( function( $ ){
	
$('#menu-headline-nav').append('<li class="menu-item wpgpt_settings" style="cursor:pointer;"><a>Tools Settings</a></li>');
$('.wpgpt_settings').click(function() {
	wpgpt_settings();
});

var user_settings = {}; 
if( getLS('wpgpt-user-settings') !== null ){
	user_settings = JSON.parse( getLS('wpgpt-user-settings') ); 
	for( const property in settings ){
		if( settings[property]['type'] && user_settings[property]!== undefined ){
			settings[property]['state'] = user_settings[property];
		}
	}
}

var settings_parent = "";
var settings_state = 0;

function wpgpt_settings(){
	if( settings_state ){
		exit_settings();
		return; //ToDo: don't refresh, but instead reload changes only
	}
	else{
		$(".wpgpt_settings a").html("<b>Close</b> Settings");
		settings_state = 1;
	}
	
	if( $('.wpgpt-snippets-window').length !== 0 ){
		$('.wpgpt-snippets-window').hide();
	}
	
	if( $('.wpgpt-settings-window').length !== 0 ){
		$('.wpgpt-settings-window').toggle();
		return;
	}
	
	var container = '<div class="wpgpt-settings-window"></div>';
	$('.gp-content').html(container);

	var settings_count = Object.keys( settings ).length;
	var i = 1;
	
	var this_shtml, this_shtml_class;
	var shtml = ""; 
	var shtmlo = "";
	
	$.each( settings, function( key ) {
		if( settings[key]['parent'] != 'none' ){
			this_shtml = "";
			this_shtml_class = "";
		
			switch ( settings[key]['type'] ){
				case 0:
					this_shtml = 	'<div class="wpgpt-setting-description">' + settings[key]['desc'] + '</div>' + ( ( settings[key]['state'] != undefined ) ? settings[key]['state'] : '');
					break;
				case 2:
					this_shtml = 	'<div class="wpgpt-setting-description">' + settings[key]['desc'] +'</div>' + 
									'<div class="wpgpt-setting-type-2"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="enabled" ' + ( ( settings[key]['state'] == 'enabled' ) ? 'checked' : '' ) + '> Enabled</label></div>'+
									'<div class="wpgpt-setting-type-2"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="disabled" ' + ( ( settings[key]['state'] == 'disabled' ) ? 'checked' : '' ) + '> Disabled</label></div>';
					break;
				case 3:
					this_shtml = 	'<div class="wpgpt-setting-description">' + settings[key]['desc'] +'</div>' + 
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="warning" ' + ( ( settings[key]['state'] == 'warning' ) ? 'checked' : '' ) + '> Warn & prevent save</label></div>'+
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="notice" ' + ( ( settings[key]['state'] == 'notice' ) ? 'checked' : '' )  + '> Just notification</label></div>'+
									'<div class="wpgpt-setting-type-3"><label><input type="radio" class="wpgpt-update" name="' + key + '" value="nothing" ' + ( ( settings[key]['state'] == 'nothing' ) ? 'checked' : '' ) + '> Don\'t check</label></div>';
					break;
				case 4:
					this_shtml = 	'<div class="wpgpt-setting-description">' + settings[key]['desc'] +'</div>' + 
									'<input type="text" id="' + key +'" placeholder="Leave empty to disable. Case sensitive. Separate words by , " value="' + 
									settings[key]['state'] + '">';
					break;
				case 5:
					this_shtml = 	'<div class="wpgpt-setting-description">' + settings[key]['desc'] +'</div>' + 
									'<input type="text" id="' + key +'" placeholder="E.g. 。 Leave empty if you use . symbol"value="' + 
									settings[key]['state'] + '">';
			}
			
			if( settings[key]['parent'] != 'self' ){
				if(settings[settings[key]['parent']]['parent'] != 'self'){
					this_shtml_class += 'wpgpt-sub-sub-setting wpgpt-child-of-' + settings[key]['parent'] +' wpgpt-s-' + key;
				} else{
					this_shtml_class += 'wpgpt-sub-setting wpgpt-child-of-' + settings[key]['parent'] +' wpgpt-s-' + key;
				}
			}
			else{
				this_shtml_class += 'wpgpt-main-setting wpgpt-s-' + key;
			}
			
		  shtml += '<div class="' + this_shtml_class + '">' + this_shtml + '</div>';
		}
		
		if( i == settings_count ){
			shtml += '<button id="save_settings" >Save all settings</button>'
			$('.wpgpt-settings-window').append( shtml );
			$.each(settings, function( key ) {
				if( settings[key]['state'] == "disabled" ){
					$(".wpgpt-child-of-" + key ).hide();
				}
			});
		}
		i++;

	});
	
	var shortcuts_html=	'<div class="gp-shortcuts"><h3>Keyboard Shortcuts <span class="small">default & custom, if enabled</span></h3><div class="gp-header gp-row"><div class="gp-shortcut">Action</div><div class="gp-shortcut">Shortcut</div><div class="gp-shortcut">Alternative shortcut</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Cancel</div><div class="gp-shortcut">Escape</div><div class="gp-shortcut">Ctrl + Shift + Z</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Previous String Editor</div><div class="gp-shortcut">Page Up</div><div class="gp-shortcut">Ctrl + Up Arrow</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Next String Editor</div><div class="gp-shortcut">Page Down</div><div class="gp-shortcut">Ctrl + Down Arrow</div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="s">S</span>ave</div><div class="gp-shortcut"><span class="s">S</span>hift + Enter</div><div class="gp-shortcut"></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="c">C</span>opy original</div><div class="gp-shortcut"><span class="c">C</span>trl + Enter</div><div class="gp-shortcut">Ctrl + Shift + <span class="c">B</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="a">A</span>pprove</div><div class="gp-shortcut">Ctrl + <span class="a big">+</span> <span class="small">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="a">A</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="r">R</span>eject</div><div class="gp-shortcut">Ctrl + <span class="r big">-</span> <span class="small">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="r">R</span></div></div>' +
						'<div class="gp-row sep"><div class="gp-shortcut"><span class="f">F</span>uzzy</div><div class="gp-shortcut">Ctrl + <span class="f big">~</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="big f">~</span></div><span class="right-note down">default &#8673;</span></div>' ;
	shortcuts_html +=	'<div class="gp-row"><div class="gp-shortcut"><span class="f">F</span>uzzy</div><div class="gp-shortcut">Ctrl + <span class="f big">*</span><span class="small">(numeric keyboard)</span></div><div class="gp-shortcut">Ctrl + Shift + <span class="f">F</span></div><span class="right-note">custom &#8675;</span></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="r">G</span>oogle Translate*</div><div class="gp-shortcut">Alt + <span class="r">G</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut"><span class="s">C</span>onsistency*</div><div class="gp-shortcut">Alt + <span class="s">C</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Copy consistency* <span class="c">#2</span></div><div class="gp-shortcut">Alt + <span class="c">2</span></div><div class="gp-shortcut"><span class="small note">works with #1, #2 and #3</span></div></div>' +
						'<div class="gp-row"><div class="gp-shortcut">Focus on <span class="a">S</span>earch in <span class="a">P</span>rojects* </div><div class="gp-shortcut">Alt + <span class="a">S</span></div><div class="gp-shortcut">Alt + <span class="a">P</span></div></div>' +
						'<span class="right-note">* if <i>Consistency Tools</i> enabled<span>' +
						'</div>';
									
	$('.wpgpt-settings-window').append( shortcuts_html );
	$(".wpgpt-update").click(function(){
		var option_name = $(this).attr('name'); 
		var option_value = $(this).val();
		update_setting( option_name, option_value );	
		
		if( option_value == "disabled" ){
			$(".wpgpt-child-of-" + option_name ).hide(200);
		}
		else{
			$(".wpgpt-child-of-" + option_name ).show(200);
		}			
	}); 
	
	$("#save_settings").click( exit_settings );
 }
 
function update_feature( feature_name, feature_status ){
	if( feature_status == "nothing" ){
		$(".wpgpt-settings-" + feature_name ).hide(200);
	}
	else{
		$(".wpgpt-settings-" + feature_name ).show(200);
	}
}
 
function update_setting( name, val ){
	settings[name]['state'] = val;
	for ( const property in settings ){
		if( settings[property]['type'] != 0 ){
			user_settings[property]= settings[property]['state'];
		}
	}
    setLS( 'wpgpt-user-settings', JSON.stringify( user_settings ) );
}

function exit_settings(){
	settings["custom_period"]['state'] = $("#custom_period").val();
	settings["warning_words"]['state'] = $("#warning_words").val(); // this instead update_setting to avoid redundancy;
	update_setting("notice_words", $("#notice_words").val());	
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

function check_version() {
	if( settings['last_checked']['state'] != 'never' )
		if( ( Date.now() - settings['last_checked']['state'] ) < 43200000 ){ // check every 12h
			display_check_version();
			return;
		}
		
    var req = "https://wptools.vladtimotei.ro/wpgp-tools/version.php";
    $.get( req, function( current_version ) {
        if ( current_version != WPGPT_VERSION ){
			settings["last_version"]['state'] = current_version; // this instead update_setting to avoid redundancy;
		}
		update_setting( "last_checked", Date.now() );
		display_check_version();
    });
}
	
function display_check_version(){
	if( settings['last_version']['state'] > WPGPT_VERSION ){	
		$("#masthead").after( update_notif_template.replaceAll( '%%last_version%%', settings['last_version']['state'] ) );
	}
}

setTimeout(check_version, 3000); 

})( jQuery );