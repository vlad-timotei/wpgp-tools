/**	
** Translation checks 
**/
var wpgpt_checks_shortcuts = false;
var wpgpt_user_edited = false;

var wpgpt_period = ( wpgpt_settings['custom_period']['state'] != '' ) ? wpgpt_settings['custom_period']['state'] : '.';

if( wpgpt_settings['checks']['state'] == 'enabled' || wpgpt_settings['ro_checks']['state'] == 'enabled' ){
	jQuery(document).ready( wpgpt_checks );
	wpgpt_checks_shortcuts = true;
}

var wpgpt_next_is_strict = true;
var wpgpt_error_message = '<b>Fix warnings first!</b><br><br>Alternatively, check <br><i>Save / Approve with warnings!</i><br><br>';

function wpgpt_checks(){
	if( typeof $gp !== 'undefined' ){
		wpgpt_early_init_editors();
		wpgpt_check_all_translations(); 
		wpgpt_late_init_editors();
		wpgpt_filters();
	}
}

function wpgpt_early_init_editors(){
	jQuery('#translations tbody tr.editor').each(function(){
		jQuery(this).find('.translation-wrapper').after('<div class="wpgpt-ignore-warnings noselect"><label>Save / Approve with warnings <input type="checkbox"></label></div>');	
	});  
}

function wpgpt_check_all_translations(){
	jQuery('#translations tbody tr.preview.has-translations').each( function(){
		var original = [], translated = [];
		var check_results, preview_class; 
		var preview_html_output = '', editor_html_output = '';
		var preview_warning = false, preview_notice = false;
		jQuery(this).find('td.original .original-text').each( function(){ original.push( jQuery( this ).text() ); } );
		jQuery(this).find('td.translation .translation-text').each( function(){	translated.push( jQuery( this ).text() ); } );
	
		for( var original_i = 0, translated_i = 0; translated_i < translated.length; translated_i++ ){
			check_results = wpgpt_run_checks( original[original_i], translated[translated_i] );
			editor_html_output += '<dl><dt>Warnings' +
			( (translated.length > 1) ? (' #'+( translated_i + 1 ) ) : '' ) +
			':</dt><dd>' +
			check_results[0] +
			( (check_results[0] == 'none') ? ' <b>&#10003;</b>' :'') +
			'</dd></dl>';
			
			if( check_results[1]!= 'none' ){
				editor_html_output += '<dl><dt>Notices' +
				( (translated.length > 1) ? (' #'+( translated_i + 1 ) ) : '' ) +
				':</dt><dd>' +
				check_results[1] +
				'</dd></dl>';
				preview_notice = true;
			}
			
			if( check_results[0] != 'none' ){
				preview_warning = true;
			}
			if( original.length > 1 ){
				original_i = 1;
			}
		}
		
		editor_html_output = '<div class="wpgpt-checks-list">' + editor_html_output + '</div>';

		if( preview_warning ){
			preview_html_output = '<img class="wpgpt-warning-preview" title="String has a warning." src="' + warning_icon + '">';
			jQuery('#' + jQuery(this).attr('id').replace('preview', 'editor')).find('.wpgpt-ignore-warnings').show();	
			preview_class = 'wpgpt-has-warning';
		} 
		else if( preview_notice ){
			preview_html_output = '<img class="wpgpt-check-preview" title="String has a notice." src="' + notice_icon + '">'; 
			preview_class = 'wpgpt-has-notice';
			}
			else {
				preview_html_output = '<span class="wpgpt-check-preview passed" title="All checks passed.">&#10003;</span>';
				preview_class = 'wpgpt-has-nothing';
			}
			
		jQuery(this).addClass(preview_class);
		jQuery('#' + jQuery(this).attr('id').replace('preview', 'editor')).find('.meta .status-actions').after(editor_html_output);
		jQuery(this).find('.actions .action.edit').prepend( preview_html_output );
	});
}

function wpgpt_late_init_editors(){
	jQuery('#translations tbody tr.editor').each(function(){
		var translation_id = jQuery(this).attr('id');
		jQuery(this).find('.translation-actions__save').click(function(event){
			if( ( ! wpgpt_check_this_translation( translation_id ) ) && wpgpt_next_is_strict ){
				event.preventDefault();
				event.stopPropagation();
				$gp.notices.error( wpgpt_error_message );
			}
			wpgpt_next_is_strict = true;
			jQuery('.wpgpt-ignore-warnings input').prop('checked', false);
			wpgpt_user_edited = false;
		});
				
		jQuery(this).find('.approve').click(function(event){
			if( ( ! wpgpt_check_this_translation( translation_id ) ) && wpgpt_next_is_strict ){
				event.preventDefault();
				event.stopPropagation();
				$gp.notices.error( wpgpt_error_message );
			}
			wpgpt_next_is_strict = true;
			jQuery('.wpgpt-ignore-warnings input').prop('checked', false);
			wpgpt_user_edited = false;
		});
	});
   
   jQuery('.wpgpt-ignore-warnings input').click(function(){
	   wpgpt_next_is_strict = ( jQuery(this).prop('checked') == true ) ? false : true;	 
   });
}

function wpgpt_check_this_translation( translation_id ){
	var original = [], translated = [];
	var check_results; 
	var warnings_passed = true, notices_passed = true;
	var editor_html_output = '';
	
	jQuery('#' + translation_id + ' .source-string.strings div').each( function() { original.push( jQuery(this).find('span.original').text() ); } );
	jQuery('#' + translation_id + ' .translation-wrapper div.textareas').each(function(){ translated.push( jQuery(this).find('textarea').val() ); } );
	
	for( var original_i = 0, translated_i = 0; translated_i < translated.length; translated_i++ ){
		check_results = wpgpt_run_checks( original[original_i], translated[translated_i] );
		
		if( check_results[0] != 'none' ){
			warnings_passed = false;
		}
		
		editor_html_output += '<dl><dt>Warnings' +
		( (translated.length > 1) ? ( ' #'+( translated_i + 1 ) ) : '' ) +
		':</dt><dd>' +
		check_results[0] +
		( ( check_results[0] == 'none' ) ? ' <b>&#10003;</b>' :'') +
		'</dd></dl>';
		
		if( check_results[1]!= 'none' ){
			notices_passed = false;

			editor_html_output += '<dl><dt>Notices' +
			( ( translated.length > 1 ) ? (' #'+( translated_i + 1 ) ) : '' ) +
			':</dt><dd>' +
			check_results[1] +
			'</dd></dl>';			
		}
		if( original.length > 1 ){
				original_i = 1;
		}
	}
	
	var check_list = jQuery('#' + translation_id ).find('.meta .wpgpt-checks-list');
	if( check_list.length > 0 ){
		check_list.html( editor_html_output );	
	}
	else{
		editor_html_output = '<div class="wpgpt-checks-list">' + editor_html_output + '</div>';
		jQuery('#' + translation_id ).find('.meta dl').first().before( editor_html_output ); 
	}
		
	if( warnings_passed ){
		jQuery('#' + translation_id).find('.wpgpt-ignore-warnings').fadeIn().css('display', 'none');
		var next_preview;
		if( notices_passed ){
		next_preview = '<span class="wpgpt-check-preview passed">&#10003;</span>';
		}
		else{
			next_preview = '<img class="wpgpt-check-preview" src="' + notice_icon + '">';
		}
		translation_id = translation_id.replace(/(?:(editor-[^- ]*)(?:-[^' ]*))/g,'$1').replace('editor', 'preview'); // Look for original ID prefix only
		setTimeout( function(){ 
			var current_preview = jQuery("tr[id^='" + translation_id +"']").find('.wpgpt-check-preview');
			if( current_preview.length > 0 ){
				current_preview.replaceWith( next_preview );
			}
			else{
				jQuery("tr[id^='" + translation_id +"']").find('.actions .action.edit').prepend(next_preview);
			}
		},1000); // Waits for the new translation to load before display preview warning state
    }
	else{
		jQuery('#' + translation_id).find('.wpgpt-ignore-warnings').fadeIn().css('display', 'block');
	}
	return warnings_passed;
}

function wpgpt_run_checks( original, translated ){
	var warnings = {
		'placeholders'		:	'',
		'start_space' 		:	'',
		'end_char'			: 	'',
		'others'			:	'',
		'ro_diacritics'		:	'',
		'ro_quotes'			:	''
	};
	var notices = {
		'placeholders'		:	'',
		'start_space' 		:	'',
		'end_char'			: 	'',
		'others'			:	'',
		'ro_diacritics'		:	'',
		'ro_quotes'			:	''
	};
	
	var error_message = '';
			
	/** Wrong Placeholders **/
	let placeholder_pattern =  /(?:%[bcdefgosuxl]|%\d[$][bcdefgosuxl])/g;
	var original_ph = original.match( placeholder_pattern );
	var translated_ph = translated.match( placeholder_pattern );

	if(
		original_ph != null ||
		translated_ph != null
	){
		if(
			original_ph != null &&
			translated_ph == null
		){
			warnings['placeholders'] = '<li>Missing or broken placeholder(s): ' + original_ph.toString() + '</li>';
		}
		else{
			if(
				original_ph == null &&
				translated_ph != null
			){
				warnings['placeholders'] = '<li>Additional placeholder(s) found: ' + translated_ph.toString() + '</li>';
			}
			else{
				if ( original_ph.length < translated_ph.length ){
					warnings['placeholders'] = '<li>Additional placeholder(s) found: ' + arr_diff( translated_ph, original_ph ) + '</li>';
				}
				if ( original_ph.length > translated_ph.length ){
					warnings['placeholders'] = '<li>Missing or broken placeholder(s): ' + arr_diff( original_ph, translated_ph ) + '</li>';
				}
				if ( original_ph.length == translated_ph.length ) {
					original_ph.sort();
					translated_ph.sort();
					var broken_placeholders = [];
					for ( var i = 0; i < original_ph.length; i++ )
						if ( original_ph[i] != translated_ph[i] ){
							broken_placeholders.push( '<br>' + original_ph[i] + ' might be translated as ' + translated_ph[i] );
						}
					if ( broken_placeholders.length ){
						warnings['placeholders'] = '<li>Possible broken placeholder(s): ' + broken_placeholders.toString() + '</li>';
					}
				}
			}
		}
	}

	/** General checks */
	if( wpgpt_settings['checks']['state'] == 'enabled' ){
		let first_original_char = original.substr( 0, 1 );
		let first_translated_char = translated.substr( 0, 1 );
		let last_original_char = original.substr( original.length - 1 );
		let last_translated_char = translated.substr( translated.length - 1 );
		let last_but_one_original_char = original.substr( original.length-2, 1 );
		let last_but_one_translated_char = translated.substr( translated.length-2, 1 );
		
		/** Additional start space **/
		if(
			first_translated_char == ' ' &&
			first_original_char  != ' '
		){  
			error_message = '<li>Additional start space</li>';
			switch( wpgpt_settings['start_space']['state'] ){
				case 'warning': warnings['start_space'] = error_message; break;
				case 'notice': notices['start_space'] = error_message; 
			}
		}
	
		/** Missing start space **/
		if(
			first_translated_char != ' ' &&
			first_original_char  == ' '
		){	
			error_message = '<li>Missing start space</li>';
			switch( wpgpt_settings['start_space']['state'] ){
				case 'warning': warnings['start_space'] = error_message; break;
				case 'notice': notices['start_space'] = error_message; 
			}
		}
	
		/** Different ending character **/
		if( last_original_char != last_translated_char ){
			/** Additional end space **/			
			if( last_translated_char == ' '){
				error_message = '<li>Additional end space</li>';
				switch( wpgpt_settings['end_space']['state'] ){
					case 'warning': warnings['end_char'] = error_message; break;
					case 'notice': notices['end_char'] = error_message; 
				}
			}
		
			/** Missing end space **/
			if( 
				warnings['end_char'] == '' &&
				notices['end_char'] == '' &&
				last_original_char == ' '
			){
				error_message = '<li>Missing end space</li>';
				switch( wpgpt_settings['end_space']['state'] ){
					case 'warning': warnings['end_char'] = error_message; break;
					case 'notice': notices['end_char'] = error_message; 
				}
			}
	
			/** Missing end period symbol; 
			** Ignore if:
			**	a. original ends with . and translation ends with a period symbol
			**	b. char - period swap( char should not be a letter or number ); Ideal examples: ". => ." or ). => .) 
			**	c. tag - period swap 
			**	d. 3 periods translated as elipsis
			**/
			var not_tag_period_swap = true,
				not_translated_as_elipsis = true,
				not_character_period_swap = true;
			if( 
				warnings['end_char'] == '' &&
				notices['end_char'] == '' &&
				last_original_char == '.' &&
				last_translated_char != wpgpt_period &&
				last_translated_char != '.'
			){	not_character_period_swap = !(	 (		last_but_one_translated_char == wpgpt_period ||
														last_but_one_translated_char == '.'
												 ) &&
												 (		last_but_one_original_char == last_translated_char  ||
														is_locale_alternative( last_but_one_original_char, last_translated_char )
												 ) &&
												 (/[^a-zA-Z1-50]/).test( last_translated_char )
											 ); 
				if ( not_character_period_swap ){
					if( last_translated_char == '>' ){
						var translated_last_period_index = translated.lastIndexOf( wpgpt_period );
						var translated_last_tag = translated.substr( translated_last_period_index  + 1 );
						if( translated_last_tag == original.substr( original.length - translated_last_tag.length - 1, translated_last_tag.length ) ){
							not_tag_period_swap = false;
						}
						else if ( wpgpt_period != '.' ) {
							translated_last_period_index = translated.lastIndexOf( '.' );
							translated_last_tag = translated.substr( translated_last_period_index  + 1 );
								if( translated_last_tag == original.substr( original.length - translated_last_tag.length - 1, translated_last_tag.length ) ){
									not_tag_period_swap = false;
								}
						}
					}
					if ( not_tag_period_swap ){
						not_translated_as_elipsis = !( last_translated_char == '…' && last_but_one_original_char == '.'  );
					}
				}
			
				if( not_tag_period_swap && not_translated_as_elipsis && not_character_period_swap ){
					error_message = '<li>Missing end period: ' + wpgpt_period + ( ( wpgpt_period != '.' ) ? ' or . ' : '' ) + '</li>';
					switch( wpgpt_settings['end_period']['state'] ){
						case 'warning': warnings['end_char'] = error_message; break;
						case 'notice': notices['end_char'] = error_message; 
					}
				}
			}
		
			/** Additional end period; 
			** Ignore if:
			**	a. original doesn't end with . and translation doesn't end with period symbol
			**	b. period - char swap ( char should not be a letter or number )
			**	c. period - tag swap
			**	d. elipsis translated as 3 periods
			**/
			var not_period_tag_swap = true,
				not_translated_from_elipsis = true,
				not_period_character_swap = true;
			if( 
				warnings['end_char'] == '' &&
				notices['end_char'] == '' &&
				last_original_char != '.' &&
				( last_translated_char == wpgpt_period ||
				  last_translated_char == '.' )
			){	
				not_period_character_swap = !(	(		last_but_one_original_char == wpgpt_period ||
														last_but_one_original_char == '.'
												) &&
												(		last_original_char == last_but_one_translated_char ||
														is_locale_alternative( last_original_char, last_but_one_translated_char ) 
												) &&
												(/[^a-zA-Z1-50]/).test( last_original_char )
											 );
				if ( not_period_character_swap ){
					if( last_but_one_translated_char == '>' ){
						var original_last_period_index = original.lastIndexOf( '.' );
						var original_last_tag = original.substr( original_last_period_index  + 1 );
						if( original_last_tag == translated.substr( translated.length - original_last_tag.length - 1, original_last_tag.length ) ){
							not_period_tag_swap = false;
						}
					}
					if( not_period_tag_swap ){
						not_translated_from_elipsis = !( last_original_char == '…' && last_but_one_translated_char == '.' );
					}
				}
			
				if(	not_translated_from_elipsis && not_period_character_swap && not_period_tag_swap ){
					error_message = '<li>Additional end period: ' + wpgpt_period + ( ( wpgpt_period != '.' ) ? ' or . ' : '' ) + '</li>';
					switch( wpgpt_settings['end_period']['state'] ){
						case 'warning': warnings['end_char'] = error_message; break;
						case 'notice': notices['end_char'] = error_message; 
					}
				}
			}
		
			/** Missing end : **/
			if( 
				warnings['end_char'] == '' &&
				notices['end_char'] == '' &&
				last_original_char == ':'
			){
				error_message = '<li>Missing end :</li>';
				switch( wpgpt_settings['end_colon']['state'] ){
					case 'warning': warnings['end_char'] = error_message; break;
					case 'notice': notices['end_char'] = error_message; 
				}
			}
		
			/** Additional end : **/
			if( 
				warnings['end_char'] == '' &&
				notices['end_char'] == '' &&
				last_translated_char == ':'
			){
				error_message = '<li>Additional end :</li>';
				switch( wpgpt_settings['end_colon']['state'] ){
					case 'warning': warnings['end_char'] = error_message; break;
					case 'notice': notices['end_char'] = error_message; 
				}
			}
		
			/** Missing end ? **/
			if( 
				warnings['end_char'] == '' &&
				notices['end_char'] == '' &&
				last_original_char == '?'
			){
				error_message = '<li>Missing end question mark ?</li>';
				switch( wpgpt_settings['end_question']['state'] ){
					case 'warning': warnings['end_char'] = error_message; break;
					case 'notice': notices['end_char'] = error_message; 
				}
			}
		}
	
		/**Double spaces **/
		let double_spaces = /  /g;
		var using_double_spaces = translated.match(double_spaces);
		var original_double_spaces = original.match(double_spaces);
		using_double_spaces = (using_double_spaces != null) ? using_double_spaces : [];
		original_double_spaces = (original_double_spaces != null) ? original_double_spaces : [];
	
		if( using_double_spaces.length > original_double_spaces.length ){
			error_message = '<li>' + using_double_spaces.length + ' double space(s) detected </li>'; 
			switch( wpgpt_settings['double_spaces']['state'] ){
				case 'warning': warnings['others'] += error_message; break;
				case 'notice': notices['others'] += error_message; 
			}
		} 
		else if( wpgpt_settings['double_spaces']['state'] !== 'nothing' && ( using_double_spaces.length < original_double_spaces.length ) ){
				notices['others'] += '<li>' + ( original_double_spaces.length - using_double_spaces.length ) + 'missing double space(s)</li>';	
		}
		
		var bad_words_list, bad_word; 
	
		/** Warning words **/
		if( wpgpt_settings['warning_words']['state'] != '' ){
			bad_words_list = wpgpt_settings['warning_words']['state'].split(',');
			for( bad_word of bad_words_list ) {
				if( bad_word != '' && bad_word != ' ' && translated.match( bad_word ) !== null){
					warnings['others'] += '<li>You use "' + bad_word + '"</li>';
					break;
				}
			}
		}
	
		/** Notice words */
		if( wpgpt_settings['notice_words']['state'] != '' ){
			bad_words_list = wpgpt_settings['notice_words']['state'].split(',');
			for( bad_word of bad_words_list) {
				if( bad_word != '' && bad_word != ' ' && translated.match( bad_word ) !== null ){
					notices['others'] += '<li>You use "' + bad_word + '"</li>';
					break;
				}
			}
		}
	}

	/** Romanian checks **/
	if( wpgpt_settings['ro_checks']['state'] == 'enabled' ){
		let not_ro_diacritics =  /[ÃãŞşŢţ]/ig;  
		let not_ro_quotes = /(?<!=)"(?:[^"<=]*)"/g; 
		let not_ro_slash_spaces = / [/] /g;
		let not_ro_ampersand = /[&](?!.{1,7}?[;=])/g;
		let not_ro_dash = /[—]/g;

		/** RegEx explications
		**	not_ro_diacritics =  /[ÃãŞşŢţ]/ig; 			Find globally, case insensitive any of the chars inside []
		**	not_ro_quotes = /(?<!=)"(?:[^"<=]*)"/g; 	Find globally strings, using a non-capturing group
		**												- doesn't start with = 
		**												- next, have "
		**												- next, don't have ", = nor < in any of the following characters
		**												- ends with "
		** not_ro_slash_spaces = / [/] /g;				Find globally strings that have space/space
		** not_ro_ampersand = /[&](?!.{1,7}?[;=])/g;	Find globally strings, using negative lookahead and lazy matching
		**												- starts with &
		**												- doesn't have ; nor = after 1 to 7 characters
		**												- ; is for HTML entities AND = is for URL parameters
		** not_ro_dash = /[—]/g;						Find globally strings with —
		**/ 
	
		/** ro diacritics **/
		var not_using_ro_diacritics = translated.match( not_ro_diacritics );
		if( not_using_ro_diacritics != null ){
			error_message = '<li>' + not_using_ro_diacritics.length + ' wrong diacritic(s) found: ' + not_using_ro_diacritics.toString() + '</li>';
			switch( wpgpt_settings['ro_diacritics']['state'] ){
				case 'warning': warnings['ro_diacritics'] = error_message; break;
				case 'notice': notices['ro_diacritics'] = error_message; 
			}
		}
		
		/** ro quotes **/
		var not_using_ro_quotes = translated.match( not_ro_quotes );
		if( not_using_ro_quotes != null ){ 
			var i;
			error_message = '<li>' + not_using_ro_quotes.length + ' pair' + ( ( i > 1 ) ? 's' : '' ) + ' of wrong quotes: ' + not_using_ro_quotes.toString() + '<br> Use „ ” instead.</li>';
			switch( wpgpt_settings['ro_quotes']['state'] ){
				case 'warning': warnings['ro_quotes'] = error_message; break;
				case 'notice': notices['ro_quotes'] = error_message; 
			}
		}
		else{
			bad_words_list = ['&quot;', '&#34;', '&apos;', '&#39;', '&ldquo;', '&#8220;', '“'];
			for( bad_word of bad_words_list) {
				if( translated.match( bad_word ) !== null ){
					error_message = '<li>At least one wrong quote: ' + bad_word.replace('&', '&amp;') + '</li>';
					switch( wpgpt_settings['ro_quotes']['state'] ){
						case 'warning': warnings['ro_quotes'] = error_message; break;
						case 'notice': notices['ro_quotes'] = error_message; 
					}
				break;
				}
			}
		}

		/** ro slash spaces **/
		var not_using_ro_slash_spaces = translated.match( not_ro_slash_spaces );
		if ( not_using_ro_slash_spaces != null ){
			error_message =  '<li>' + not_using_ro_slash_spaces.length + ' / space detected </li>';
			switch( wpgpt_settings['ro_slash']['state'] ){
					case 'warning': warnings['others'] += error_message; break;
					case 'notice': notices['others'] += error_message; 
			}
		}
	
		/** ro ampersand **/
		var not_using_ro_ampersand = translated.match( not_ro_ampersand );
		if( not_using_ro_ampersand!= null ){
			error_message = '<li>' + not_using_ro_ampersand.length + ' & detected</li>';
			switch( wpgpt_settings['ro_ampersand']['state'] ){
					case 'warning': warnings['others'] += error_message; break;
					case 'notice': notices['others'] += error_message; 
			}
		}
	
		/** ro — dash **/
		var not_using_ro_dash = translated.match( not_ro_dash );
		if( not_using_ro_dash!= null ){
			error_message = '<li>' + not_using_ro_dash.length + ' — detected</li>';
			switch( wpgpt_settings['ro_dash']['state'] ){
					case 'warning': warnings['others'] += error_message; break;
					case 'notice': notices['others'] += error_message; 
			}
		}
	}
	   
	var warnings_results = Object.values(warnings).join('');
	warnings_results  = ( warnings_results == '' ) ? 'none' : ( '<ul class="wpgpt-warnings-list">' + warnings_results + '</ul>');

	var notices_results = Object.values(notices).join('');
	notices_results  =  ( notices_results == '' ) ? 'none' : ( '<ul class="wpgpt-notices-list">' + notices_results + '</ul>');
	
	var results = [ warnings_results, notices_results ]; 
	return results;
}

/** Fix for ro_RO case where original ends with << "WordPress." >> and translation ends with << „WordPress”. >>
**	Others alternatives can be added for other locales 
*/ 
function is_locale_alternative( original, translated ){
	if( wpgpt_settings['ro_checks']['state'] == 'enabled' ){
		var en_end_characters = ['"'];
		var ro_end_characters = ['”'];
		
		for ( var i = 0; i < en_end_characters.length; i++ ){
			if( en_end_characters [i] == original && ro_end_characters[i] == translated ){
				return true;
			}			
		}	
	}
	
	return false;
}

 
//Prevent leaving without saving
jQuery('textarea').bind('input propertychange', function() { wpgpt_user_edited = true; });
jQuery(window).on('beforeunload', function(){
	if( wpgpt_settings['prevent_unsaved']['state'] == 'enabled' && wpgpt_user_edited && jQuery('.editor:visible textarea').val() !== undefined ){
		return false;
	}
});

// Row filter by existance of warnings and notices
function wpgpt_filters(){
	var notices_count = jQuery('.wpgpt-has-notice').length;
	var warnings_count = jQuery('.wpgpt-has-warning').length
	var filters = '';
	var notice_icon_style = 'background: url(' + notice_icon + ');background-size: 100%;background-repeat: no-repeat;';
	var warning_icon_style = 'background: url(' + warning_icon + ');background-size: 100%;background-repeat: no-repeat;';
	filters +='<div class="wpgpt-filters">';
    filters += '<a href="#" title="Click to view strings with notice only - ' + notices_count + ' strings" class="wpgpt-filter-notices count-' + notices_count + '"><img src="' + notice_icon + '"> Notices (' + notices_count + ')</a><span class="separator">•</span>';
    filters += '<a href="#" title="Click to view strings with warning only - ' + warnings_count + ' strings" class="wpgpt-filter-warnings count-' + warnings_count + '"><img src="' + warning_icon + '"> Warnings (' + warnings_count + ')</a><span class="separator">•</span>';
	filters += '<a href="#" title="Click to view all strings" class="wpgpt-filter-all">All</a>';
	filters += '</div>';
	jQuery('.paging').first().before(filters);
	
	jQuery('.wpgpt-filter-warnings').click(function(){ 
		jQuery('#translations tr.preview').hide(200);
		jQuery('#translations tr.preview.wpgpt-has-warning').show(200);
	});
	
	jQuery('.wpgpt-filter-notices').click(function(){ 
		jQuery('#translations tr.preview').hide(200);
		jQuery('#translations tr.preview.wpgpt-has-notice').show(200);
	});
	jQuery(".wpgpt-filter-all").click(function(){ 
		jQuery('#translations tr.preview').show(200);
	})
}

function arr_diff( a, b ){
    return a.filter(function(i){
		var pos = b.indexOf(i);
		if( pos < 0 ){
			return true;
		}
		else{
			b[pos] += '-checked';
			return false;
		}
	}).toString();
}