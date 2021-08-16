// Translation checks.
var wpgpt_checks_shortcuts = false;
var wpgpt_user_edited = false;

var wpgpt_period = ( wpgpt_settings.custom_period.state != '' ) ? wpgpt_settings.custom_period.state : '.';

if ( typeof $gp !== 'undefined' && ( wpgpt_settings.checks.state == 'enabled' || wpgpt_settings.ro_checks.state == 'enabled' ) ) {
	jQuery( document ).ready( wpgpt_checks );
	wpgpt_checks_shortcuts = true;
}

var wpgpt_next_is_strict = true;
var wpgpt_error_message = '<b>Fix warnings first!</b><br><br>Alternatively, check <br><i>Save / Approve with warnings!</i><br><br>';

function wpgpt_checks() {
	wpgpt_early_init_editors();
	wpgpt_check_all_translations();
	wpgpt_late_init_editors();
	wpgpt_filters();
}

function wpgpt_early_init_editors() {
	jQuery( '#translations tbody tr.editor' ).each( function() {
		jQuery( this ).find( '.translation-wrapper' ).after( '<div class="wpgpt-ignore-warnings noselect"><label>Save / Approve with warnings <input type="checkbox"></label></div>' );
	});
}

function wpgpt_check_all_translations() {
	jQuery( '#translations tbody tr.preview.has-translations' ).each( function() {
		var $translation = jQuery( this );
		var original = [], translated = [];
		var check_results, preview_class;
		var prev_check_status = '', edit_check_list = '';
		var has_warning = false, has_notice = false;
		var translation_id_p = $translation.attr( 'id' );
		var translation_id_e = translation_id_p.replace( 'preview', 'editor' );
		var missing_translation = ( $translation.find( 'td.translation .missing' ).length ) ? true : false;

		$translation.find( 'td.original .original-text' ).each( function() { original.push( jQuery( this ).text() ); } );
		$translation.find( 'td.translation .translation-text' ).each( function() {	translated.push( jQuery( this ).text() ); } );

		for ( var original_i = 0, translated_i = 0; translated_i < translated.length; translated_i++ ) {
			check_results = wpgpt_run_checks( original[original_i], translated[translated_i] );
			edit_check_list += '<dl><dt>Warnings';
			edit_check_list += ( ( translated.length > 1 ) ? ( ' #'+( translated_i + 1 ) ) : '' );
			edit_check_list += ':</dt><dd>';
			edit_check_list += ( check_results.warnings != 'none' ) ?
									( '<ul class="wpgpt-warnings-list">' + check_results.warnings + '</ul>' ) :
									' <b>&#10003;</b>';
			edit_check_list += '</dd></dl>';

			if ( check_results.notices!= 'none' ) {
				edit_check_list += '<dl><dt>Notices' +
				( ( translated.length > 1 ) ? ( ' #'+( translated_i + 1 ) ) : '' ) +
				':</dt><dd>' +
				'<ul class="wpgpt-notices-list">' + check_results.notices + '</ul>' +
				'</dd></dl>';
				has_notice = true;
				if ( wpgpt_settings.checks_labels.state == 'enabled' ) {
					$translation.find( '.translation-text' ).eq( translated_i ).after( '<ul class="wpgpt-notice-labels">' + check_results.notices + '</ul>' );
				}
			}

			if ( check_results.warnings != 'none' ) {
				has_warning = true;
				if ( wpgpt_settings.checks_labels.state == 'enabled' ) {
					$translation.find( '.translation-text' ).eq( translated_i ).after( '<ul class="wpgpt-warning-labels">' + check_results.warnings + '</ul>' );
				}
			}

			if ( wpgpt_settings.checks_labels.state == 'enabled' && check_results.highlight_me.length ) {
				$translation.find( '.translation-text' ).eq( translated_i ).html( wpgpt_highlight( translated[ translated_i ] , check_results.highlight_me ) );
			}

			if ( original.length > 1 ) {
				original_i = 1;
			}
		}

		if ( missing_translation ) {
			has_warning = true;
			edit_check_list += '<dl><dd><ul class="wpgpt-warnings-list empty"><li>Empty translation!</li></ul></dd></dl>';
			$translation.find( '.missing' ).before( '<div class="wpgpt-warning-labels"><li>Empty translation!</li></div>' );
		}

		edit_check_list = '<div class="wpgpt-checks-list">' + edit_check_list + '</div>';

		if ( has_warning ) {
			prev_check_status = '<img class="wpgpt-check-preview" title="String has a warning." src="' + wpgpt_warning_icon + '">';
			jQuery( '#' + translation_id_e ).find( '.wpgpt-ignore-warnings' ).show();
			preview_class = 'wpgpt-has-warning';
		}
		else if ( has_notice ) {
			prev_check_status = '<img class="wpgpt-check-preview" title="String has a notice." src="' + wpgpt_notice_icon + '">';
			preview_class = 'wpgpt-has-notice';
			}
			else {
				prev_check_status = '<span class="wpgpt-check-preview passed" title="All checks passed.">&#10003;</span>';
				preview_class = 'wpgpt-has-nothing';
			}

		$translation.addClass( preview_class );
		jQuery( '#' + translation_id_e ).find( '.editor-panel__right .panel-content .meta dl' ).eq(0).before( edit_check_list );
		$translation.find( '.actions .action.edit' ).prepend( prev_check_status );
	});
}

function wpgpt_late_init_editors() {
	jQuery( '#translations tbody tr.editor' ).each( function() {
		var translation_id = jQuery( this ).attr( 'id' );
		jQuery( this ).find( '.translation-actions__save' ).click( function( event ) {
			if ( ( ! wpgpt_check_this_translation( translation_id ) ) && wpgpt_next_is_strict ) {
				event.preventDefault();
				event.stopPropagation();
				$gp.notices.error( wpgpt_error_message );
			}
			wpgpt_next_is_strict = true;
			jQuery( '.wpgpt-ignore-warnings input' ).prop( 'checked', false );
			wpgpt_user_edited = false;
		});

		jQuery( this ).find( '.approve' ).click( function( event ) {
			if ( ( ! wpgpt_check_this_translation( translation_id ) ) && wpgpt_next_is_strict ) {
				event.preventDefault();
				event.stopPropagation();
				$gp.notices.error( wpgpt_error_message );
			}
			wpgpt_next_is_strict = true;
			jQuery( '.wpgpt-ignore-warnings input' ).prop( 'checked', false );
			wpgpt_user_edited = false;
		});
	});

   jQuery( '.wpgpt-ignore-warnings input' ).click( function() {
	   wpgpt_next_is_strict = ( jQuery( this ).prop( 'checked' ) == true ) ? false : true;
   });
}

function wpgpt_check_this_translation( translation_id_e ) {
	translation_id_e = '#' + translation_id_e;
	var translation_id_p = translation_id_e.replace( 'editor', 'preview' );
	var original = [], translated = [];
	var check_results, preview_class, save_warnings_state;
	var prev_check_status = '', edit_check_list = '';
	var has_warning = false, has_notice = false;
	var when_to_do = 0;
	var this_labels = [];
	var this_highlights = [];

	jQuery( translation_id_e + ' .source-string.strings div' ).each( function() { original.push( jQuery( this ).find( 'span.original' ).text() ); } );
	jQuery( translation_id_e + ' .translation-wrapper div.textareas' ).each(function() { translated.push( jQuery( this ).find( 'textarea' ).val() ); } );

	for ( var original_i = 0, translated_i = 0; translated_i < translated.length; translated_i++ ) {
		check_results = wpgpt_run_checks( original[ original_i ], translated[ translated_i ] );
		edit_check_list += '<dl><dt>Warnings' +
		( ( translated.length > 1 ) ? ( ' #'+( translated_i + 1 ) ) : '' ) +
		':</dt><dd>' +
		(
				( check_results.warnings != 'none' ) ?
					( '<ul class="wpgpt-warnings-list">' + check_results.warnings + '</ul>' ) :
					' <b>&#10003;</b>'
		) +
		'</dd></dl>';

		this_labels[ translated_i ] = { 'notices': '', 'warnings': '' };

		if ( check_results.notices!= 'none' ) {
			edit_check_list += '<dl><dt>Notices' +
			( ( translated.length > 1 ) ? ( ' #' + ( translated_i + 1 ) ) : '' ) +
			':</dt><dd>' +
			'<ul class="wpgpt-notices-list">' + check_results.notices + '</ul>' +
			'</dd></dl>';
			has_notice = true;
			this_labels[ translated_i ].notices = '<ul class="wpgpt-notice-labels">' + check_results.notices + '</ul>';
		}

		if ( check_results.warnings != 'none' ) {
			has_warning = true;
			this_labels[ translated_i ].warnings = '<ul class="wpgpt-warning-labels">' + check_results.warnings + '</ul>';
		}

		if ( wpgpt_settings.checks_labels.state == 'enabled' && check_results.highlight_me.length ) {
			this_highlights[ translated_i ] = wpgpt_highlight( translated[ translated_i ] , check_results.highlight_me );
		}

		if ( original.length > 1 ) {
				original_i = 1;
		}
	}

	edit_check_list = '<div class="wpgpt-checks-list">' + edit_check_list + '</div>';

	if ( has_warning ) {
		save_warnings_state = 'block';
		preview_class = 'wpgpt-has-warning';
		prev_check_status = '<img class="wpgpt-check-preview" src="' + wpgpt_warning_icon + '">';
	}
	else if ( has_notice ) {
			save_warnings_state = 'none';
			preview_class = 'wpgpt-has-notice';
			prev_check_status = '<img class="wpgpt-check-preview" src="' + wpgpt_notice_icon + '">';
		}
		else {
				save_warnings_state = 'none';
				preview_class = 'wpgpt-has-nothing';
				prev_check_status = '<span class="wpgpt-check-preview passed">&#10003;</span>';
		}

	var saved = false;
	if ( ! ( has_warning && wpgpt_next_is_strict ) ) {
		when_to_do = 1000;
		saved = true;
		translation_id_e = 'tr[id^="' + translation_id_e.replace( /(?:(editor-[^- ]*)(?:-[^' ]*))/g, '$1' ).replace( '#','' ) +'"]';
		translation_id_p = translation_id_e.replace( 'editor', 'preview' );
	}

	setTimeout( function() {
		jQuery( translation_id_e ).find( '.wpgpt-ignore-warnings' ).fadeIn().css( 'display', save_warnings_state );

		var current_edit_check_list = jQuery( translation_id_e ).find( '.meta .wpgpt-checks-list' );
		if ( current_edit_check_list.length > 0 ) {
			current_edit_check_list.replaceWith( edit_check_list );
		}
		else{
			jQuery( translation_id_e ).find( '.meta dl' ).first().before( edit_check_list );
		}
		if ( saved ) {
			jQuery( translation_id_p ).removeClass( 'wpgpt-has-warning wpgpt-has-notice wpgpt-has-nothing' ).addClass( preview_class );

			var current_preview = jQuery( translation_id_p ).find( '.wpgpt-check-preview' );
			if ( current_preview.length > 0 ) {
				current_preview.replaceWith( prev_check_status );
			}
			else{
				jQuery( translation_id_p ).find( '.actions .action.edit' ).prepend( prev_check_status );
			}
			if ( wpgpt_settings.checks_labels.state == 'enabled' ) {
				jQuery( translation_id_p ).find( '.wpgpt-warning-labels, .wpgpt-notices-labels' ).remove();
				for ( var i = 0; i < this_labels.length; i++ ) {
					if ( this_labels[ i ].warnings != '' || this_labels[ i ].notices != '' ) {
						var $this_translation_p = jQuery( translation_id_p ).find( '.translation-text' ).eq( i );
						$this_translation_p.after( '<div class="wpgpt-warning-labels">' + this_labels[ i ].warnings + '</div><div class="wpgpt-notices-labels">' + this_labels[ i ].notices + '</div>' );
						if ( this_highlights.length ) {
							$this_translation_p.html( this_highlights[ i ] );
						}
					}
				}
			}
			wpgpt_filters();
		}
	}, when_to_do );
	return ! has_warning;
}

function wpgpt_run_checks( original, translated ) {
	var warnings = {
		'placeholders'		:	'', // A.
		'start_end_space' 	:	'', // B.
		'end_char'			: 	'', // C.
		'others'			:	'', // D. + E.3, E.4, E.5
		'ro_diacritics'		:	'', // E.1
		'ro_quotes'			:	''  // E.2
	};
	var notices = {
		'placeholders'		:	'',
		'start_end_space' 	:	'',
		'end_char'			: 	'',
		'others'			:	'',
		'ro_diacritics'		:	'',
		'ro_quotes'			:	''
	};

	var highlight_me = [];
	var error_message = '';

	// A. Placeholders.
	let placeholder_pattern =  /(?:%[bcdefgosuxl]|%\d[$][bcdefgosuxl])/g;
	var original_ph = original.match( placeholder_pattern );
	var translated_ph = translated.match( placeholder_pattern );

	if (
		original_ph != null ||
		translated_ph != null
	) {
		if (
			original_ph != null &&
			translated_ph == null
		) {
			warnings.placeholders = '<li>Missing/broken placeholder'  +  ( ( original_ph.length > 1 ) ? 's' : '' ) +  ': <b>' + original_ph.toString() + '</b></li>';
		}
		else{
			if (
				original_ph == null &&
				translated_ph != null
			) {
				warnings.placeholders = '<li>Additional placeholder'  +  ( ( translated_ph.length > 1 ) ? 's' : '' ) +  ': <b>' + translated_ph.toString() + '</b></li>';
			}
			else{
				if ( original_ph.length < translated_ph.length ) {
					warnings.placeholders = '<li>Additional placeholder'  +  ( ( ( translated_ph.length - original_ph.length ) > 1 ) ? 's' : '' ) +  ': <b>' + arr_diff( translated_ph, original_ph ) + '</b></li>';
				}
				if ( original_ph.length > translated_ph.length ) {
					warnings.placeholders = '<li>Missing/broken placeholder'  +  ( ( ( original_ph.length - translated_ph.length ) > 1 ) ? 's' : '' ) +  ': <b>' + arr_diff( original_ph, translated_ph ) + '</b></li>';
				}
				if ( original_ph.length == translated_ph.length ) {
					original_ph.sort();
					translated_ph.sort();
					var broken_placeholders = [];
					for ( var i = 0; i < original_ph.length; i++ )
						if ( original_ph[ i ] != translated_ph[ i ] ) {
							broken_placeholders.push( translated_ph[ i ] + ' instead of ' +  original_ph[ i ] );
						}
					if ( broken_placeholders.length ) {
						warnings.placeholders = '<li>Possible broken: <b>' + broken_placeholders.toString() + '</b></li>';
					}
				}
			}
		}
	}

	if ( wpgpt_settings.checks.state == 'enabled' ) {
		let first_original_char = original.substr( 0, 1 );
		let first_translated_char = translated.substr( 0, 1 );
		let last_original_char = original.substr( original.length - 1 );
		let last_translated_char = translated.substr( translated.length - 1 );
		let last_but_one_original_char = original.substr( original.length - 2, 1 );
		let last_but_one_translated_char = translated.substr( translated.length - 2, 1 );

		/* 	B. Start character
			B. 1. Additional start space */
		if (
			first_translated_char == ' ' &&
			first_original_char  != ' '
		) {
			error_message = '<li>Additional start space</li>';
			switch ( wpgpt_settings.start_end_space.state ) {
				case 'warning': warnings.start_end_space = error_message; break;
				case 'notice': notices.start_end_space = error_message;
			}
		}

		// B. 2. Missing start space.
		if (
			first_translated_char != ' ' &&
			first_original_char  == ' '
		) {
			error_message = '<li>Missing start space</li>';
			switch ( wpgpt_settings.start_end_space.state ) {
				case 'warning': warnings.start_end_space = error_message; break;
				case 'notice': notices.start_end_space = error_message;
			}
		}

		// C. Ending character/
		if ( last_original_char != last_translated_char ) {
			// C. 1. Additional end space/
			if ( last_translated_char == ' ' ) {
				error_message = '<li>Additional end space</li>';
				switch ( wpgpt_settings.start_end_space.state ) {
					case 'warning': warnings.end_char = error_message; break;
					case 'notice': notices.end_char = error_message;
				}
			}

			// C. 2. Missing end space.
			if (
				warnings.end_char == '' &&
				notices.end_char == '' &&
				last_original_char == ' '
			) {
				error_message = '<li>Missing end space</li>';
				switch ( wpgpt_settings.start_end_space.state ) {
					case 'warning': warnings.end_char = error_message; break;
					case 'notice': notices.end_char = error_message;
				}
			}

			// C. 3. Missing end :
			if (
				warnings.end_char == '' &&
				notices.end_char == '' &&
				last_original_char == ':'
			) {
				error_message = '<li>Missing end <b>:</b></li>';
				switch ( wpgpt_settings.end_colon.state ) {
					case 'warning': warnings.end_char = error_message; break;
					case 'notice': notices.end_char = error_message;
				}
			}

			// C. 4. Additional end :
			if (
				warnings.end_char == '' &&
				notices.end_char == '' &&
				last_translated_char == ':'
			) {
				error_message = '<li>Additional end <b>:</b></li>';
				switch ( wpgpt_settings.end_colon.state ) {
					case 'warning': warnings.end_char = error_message; break;
					case 'notice': notices.end_char = error_message;
				}
			}

			// C. 5. Missing end ?
			if (
				warnings.end_char == '' &&
				notices.end_char == '' &&
				last_original_char == '?'
			) {
				error_message = '<li>Missing end <b>?</b></li>';
				switch ( wpgpt_settings.end_question_exclamation.state ) {
					case 'warning': warnings.end_char = error_message; break;
					case 'notice': notices.end_char = error_message;
				}
			}

			// C. 6. Missing end !
			if (
				warnings.end_char == '' &&
				notices.end_char == '' &&
				last_original_char == '!'
			) {
				error_message = '<li>Missing end <b>!</b></li>';
				switch ( wpgpt_settings.end_question_exclamation.state ) {
					case 'warning': warnings.end_char = error_message; break;
					case 'notice': notices.end_char = error_message;
				}
			}

			/* C. 7. Missing end period symbol;
			* Ignore if:
			*	a. original ends with . and translation ends with a period symbol
			*	b. char - period swap( char should not be a letter or number ); Ideal examples: ". => ." or ). => .)
			*	c. tag - period swap
			*	d. 3 periods translated as elipsis
			*/
			var not_tag_period_swap = true,
				not_translated_as_elipsis = true,
				not_character_period_swap = true;
			if (
				warnings.end_char == '' &&
				notices.end_char == '' &&
				last_original_char == '.' &&
				last_translated_char != wpgpt_period &&
				last_translated_char != '.'
			) {	not_character_period_swap = !(	 (		last_but_one_translated_char == wpgpt_period ||
														last_but_one_translated_char == '.'
												 ) &&
												 (		last_but_one_original_char == last_translated_char  ||
														is_locale_alternative( last_but_one_original_char, last_translated_char )
												 ) &&
												 (/[^a-zA-Z1-50]/).test( last_translated_char )
											 );
				if ( not_character_period_swap ) {
					if ( last_translated_char == '>' ) {
						var translated_last_period_index = translated.lastIndexOf( wpgpt_period );
						var translated_last_tag = translated.substr( translated_last_period_index  + 1 );
						if ( translated_last_tag == original.substr( original.length - translated_last_tag.length - 1, translated_last_tag.length ) ) {
							not_tag_period_swap = false;
						}
						else if ( wpgpt_period != '.' ) {
							translated_last_period_index = translated.lastIndexOf( '.' );
							translated_last_tag = translated.substr( translated_last_period_index  + 1 );
								if ( translated_last_tag == original.substr( original.length - translated_last_tag.length - 1, translated_last_tag.length ) ) {
									not_tag_period_swap = false;
								}
						}
					}
					if ( not_tag_period_swap ) {
						not_translated_as_elipsis = !( last_translated_char == '…' && last_but_one_original_char == '.'  );
					}
				}

				if ( not_tag_period_swap && not_translated_as_elipsis && not_character_period_swap ) {
					error_message = '<li>Missing end period (<b>' + wpgpt_period + ( ( wpgpt_period != '.' ) ? ' or . ' : '' ) + '</b>)</li>';
					switch ( wpgpt_settings.end_period.state ) {
						case 'warning': warnings.end_char = error_message; break;
						case 'notice': notices.end_char = error_message;
					}
				}
			}

			/* C. 8. Additional end period;
			* Ignore if:
			*	a. original doesn't end with . and translation doesn't end with period symbol
			*	b. period - char swap ( char should not be a letter or number )
			*	c. period - tag swap
			*	d. elipsis translated as 3 periods
			*/
			var not_period_tag_swap = true,
				not_translated_from_elipsis = true,
				not_period_character_swap = true;
			if (
				warnings.end_char == '' &&
				notices.end_char == '' &&
				last_original_char != '.' &&
				( last_translated_char == wpgpt_period ||
				  last_translated_char == '.' )
			) {
				not_period_character_swap = !(	(		last_but_one_original_char == wpgpt_period ||
														last_but_one_original_char == '.'
												) &&
												(		last_original_char == last_but_one_translated_char ||
														is_locale_alternative( last_original_char, last_but_one_translated_char )
												) &&
												(/[^a-zA-Z1-50]/).test( last_original_char )
											 );
				if ( not_period_character_swap ) {
					if ( last_but_one_translated_char == '>' ) {
						var original_last_period_index = original.lastIndexOf( '.' );
						var original_last_tag = original.substr( original_last_period_index  + 1 );
						if ( original_last_tag == translated.substr( translated.length - original_last_tag.length - 1, original_last_tag.length ) ) {
							not_period_tag_swap = false;
						}
					}
					if ( not_period_tag_swap ) {
						not_translated_from_elipsis = !( last_original_char == '…' && last_but_one_translated_char == '.' );
					}
				}

				if (	not_translated_from_elipsis && not_period_character_swap && not_period_tag_swap ) {
					error_message = '<li>Additional end period (<b>' + wpgpt_period + ( ( wpgpt_period != '.' ) ? ' or . ' : '' ) + '</b>)</li>';
					switch ( wpgpt_settings.end_period.state ) {
						case 'warning': warnings.end_char = error_message; break;
						case 'notice': notices.end_char = error_message;
					}
				}
			}
		}
		/* D. Others
			D. 1. Double spaces */
		var translated_double_spaces = translated.match( /[^ ]* {2,7}[^ ]*/gm ) || [];
		var original_double_spaces = original.match( /[^ ]* {2,7}[^ ]*/gm ) || [];

		if ( translated_double_spaces.length > original_double_spaces.length ) {
			error_message = '<li alt="Remove this double space.">' + ( translated_double_spaces.length - original_double_spaces.length ) + ' double space' + ( ( ( translated_double_spaces.length - original_double_spaces.length ) > 1 ) ? 's' : '' ) + ': ' + '"' + translated_double_spaces.join( '", "' ).replaceAll( ' ', '&nbsp;' ) + '"' + '</li>';
			switch ( wpgpt_settings.double_spaces.state ) {
				case 'warning':
					warnings.others += error_message;
					highlight_me = highlight_me.concat( translated_double_spaces );
					break;
				case 'notice':
					notices.others += error_message;
					highlight_me = highlight_me.concat( translated_double_spaces );
					break;
			}
		}
		else if ( wpgpt_settings.double_spaces.state !== 'nothing' && ( translated_double_spaces.length < original_double_spaces.length ) ) {
				notices.others += '<li>' + ( original_double_spaces.length - translated_double_spaces.length ) + ' missing double space' + ( ( ( original_double_spaces.length - translated_double_spaces.length ) > 1 ) ? 's' : '' ) + '</li>';
		}

		var findW_list, findW, findW_transl_count;

		// D. 2. Warning words.
		if ( wpgpt_settings.warning_words.state != '' ) {
			findW_list = wpgpt_settings.warning_words.state.split( ',' );
			for ( findW of findW_list ) {
				if ( findW != '' && findW != ' ' ) {
					findW_transl_count = occurrences( translated, findW );
					if ( findW_transl_count ) {
						warnings.others += '<li class="has-highlight" alt="Replace in translation this user defined warning word.">Using <b>' + findW + '</b></li>';
						highlight_me.push( findW );
					}
				}
			}
		}

		// D. 3. Match words
		if ( wpgpt_settings.match_words.state != '' ) {
			findW_list = wpgpt_settings.match_words.state.split( ',' );
			for ( findW of findW_list) {
				if ( findW != '' && findW != ' ' ) {
					findW_transl_count = occurrences( translated, findW );
					var findW_orig_count = occurrences( original, findW );
					if ( findW_transl_count > findW_orig_count ) {
						warnings.others += '<li alt="Remove this additional user defined symbol.">Additional ' + ( findW_transl_count - findW_orig_count ) + ' <b>' + findW + '</b></li>';
					} else if ( findW_transl_count < findW_orig_count ) {
						warnings.others += '<li alt="Add this missing user defined symbol.">Missing ' + ( findW_orig_count - findW_transl_count ) + ' <b>' + findW + '</b></li>';
					}
				}
			}
		}
	}

	// E. Romanian checks.
	if ( wpgpt_settings.ro_checks.state == 'enabled' ) {
		let not_ro_diacritics =  /[ãşţ]/ig;
		let not_ro_quotes = /(?<!=)"(?:[^"<=]*)"/g;
		let not_ro_ampersand = /[&](?!.{1,7}?[;=])/g;

		// E. 1. ro diacritics.
		var not_using_ro_diacritics = translated.match( not_ro_diacritics );
		if ( not_using_ro_diacritics != null ) {
			error_message = '<li class="has-highlight" alt="Replace this wrong Romanian diacritic.">' + not_using_ro_diacritics.length + ' wrong diacritic' + ( ( not_using_ro_diacritics.length > 1 ) ? 's' : '' ) + ': <b>' + not_using_ro_diacritics.toString() + '</b></li>';
			switch ( wpgpt_settings.ro_diacritics.state ) {
				case 'warning':
					warnings.ro_diacritics = error_message;
					highlight_me = highlight_me.concat( not_using_ro_diacritics );
					break;
				case 'notice':
					notices.ro_diacritics = error_message;
					highlight_me = highlight_me.concat( not_using_ro_diacritics );
					break;
			}
		}

		// E. 2. ro quotes.
		var not_using_ro_quotes = translated.match( not_ro_quotes );
		if ( not_using_ro_quotes != null ) {
			error_message = '<li>' + not_using_ro_quotes.length + ' wrong quotes: <b>' + not_using_ro_quotes.toString() + '</b>. Use „ ”</li>';
			switch ( wpgpt_settings.ro_quotes.state ) {
				case 'warning': warnings.ro_quotes = error_message; break;
				case 'notice': notices.ro_quotes = error_message;
			}
		}
		else{
			findW_list = [ "'", '&quot;', '&#34;', '&apos;', '&#39;', '&ldquo;', '&#8220;', '“' ];
			for ( findW of findW_list) {
				if ( occurrences( translated, findW ) ) {
					error_message = '<li class="has-highlight" alt="Replace these wrong quotes.">Wrong quote: <b>' + findW.replace( '&', '&amp;' ) + '</b></li>';
					switch ( wpgpt_settings.ro_quotes.state ) {
						case 'warning':
							warnings.ro_quotes = error_message;
							highlight_me.push( findW );
							break;
						case 'notice':
							notices.ro_quotes = error_message;
							highlight_me.push( findW );
							break;
					}
				break;
				}
			}
		}

		// E. 3. ro slash spaces.
		var not_using_ro_slash_spaces = occurrences( translated, ' / ' );
		if ( not_using_ro_slash_spaces ) {
			error_message =  '<li class="has-highlight" alt="Remove spaces around slash.">' + not_using_ro_slash_spaces + ' <b>/</b> space' + ( ( not_using_ro_slash_spaces > 1 ) ? 's' : '' ) +  '</li>';
			switch ( wpgpt_settings.ro_slash.state ) {
					case 'warning':
						warnings.others += error_message;
						highlight_me.push( ' / ' );
						break;
					case 'notice':
						notices.others += error_message;
						highlight_me.push( ' / ' );
						break;
			}
		}

		// E. 4. ro ampersand.
		var not_using_ro_ampersand = translated.match( not_ro_ampersand );
		if ( not_using_ro_ampersand!= null ) {
			error_message = '<li> Using ' + not_using_ro_ampersand.length + ' <b>&</b></li>';
			switch ( wpgpt_settings.ro_ampersand.state ) {
					case 'warning': warnings.others += error_message; break;
					case 'notice': notices.others += error_message;
			}
		}

		// E. 5. ro — dash.
		var not_using_ro_dash = occurrences( translated, '—' );
		if ( not_using_ro_dash ) {
			error_message = '<li class="has-highlight" alt="Use simple dash instead."> Using ' + not_using_ro_dash + ' <b>—</b></li>';
			switch ( wpgpt_settings.ro_dash.state ) {
					case 'warning':
						warnings.others += error_message;
						highlight_me.push( '—' );
						break;
					case 'notice':
						notices.others += error_message;
						highlight_me.push( '—' );
						break;
			}
		}
	}

	var warnings_results = Object.values(warnings).join( '' );
	warnings_results  = ( warnings_results == '' ) ? 'none' : ( warnings_results );

	var notices_results = Object.values(notices).join( '' );
	notices_results  =  ( notices_results == '' ) ? 'none' : ( notices_results );

	var results = { 'warnings': warnings_results, 'notices': notices_results, 'highlight_me': highlight_me };
	return results;
}

/*
*	Fix for ro_RO case where original ends with << "WordPress." >> and translation ends with << „WordPress”. >>
*	Others alternatives can be added for other locales.
*/
function is_locale_alternative( original, translated ) {
	if ( wpgpt_settings.ro_checks.state == 'enabled' ) {
		var en_end_characters = [ '"' ];
		var ro_end_characters = [ '”' ];

		for ( var i = 0; i < en_end_characters.length; i++ ) {
			if ( en_end_characters [ i ] == original && ro_end_characters[i] == translated ) {
				return true;
			}
		}
	}
	return false;
}

// Highlight errors.
function wpgpt_highlight( string, lookfor ) {
	var search_pattern;
	string = string.replaceAll( '<', '&lt;' ).replaceAll( '>', '&gt;' );
	for ( var i = 0; i < lookfor.length; i++ ) {
		lookfor[ i ] = lookfor[ i ].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		search_pattern = new RegExp( '(' + lookfor[ i ] + ')', 'ig' );
		string = string.replaceAll( search_pattern, '<span class="wpgpt-highlight">$1</span>' );
	}
	return string;
}

// Prevent leaving without saving.
jQuery( 'textarea' ).bind( 'input propertychange', function() { wpgpt_user_edited = true; } );
jQuery( window ).on( 'beforeunload', function() {
	if ( wpgpt_settings.prevent_unsaved.state == 'enabled' && wpgpt_user_edited && jQuery( '.editor:visible textarea' ).val() !== undefined ) {
		return false;
	}
});

// Row filter by existance of warnings and notices.
function wpgpt_filters() {
	var notices_count = jQuery( '.wpgpt-has-notice' ).length;
	var warnings_count = jQuery( '.wpgpt-has-warning' ).length;
	var filters = '';
    filters += '<a href="#" title="Click to view strings with notice only - ' + notices_count + ' strings" class="wpgpt-filter-notices count-' + notices_count + '"><img src="' + wpgpt_notice_icon + '"> Notices (' + notices_count + ')</a><span class="separator">•</span>';
    filters += '<a href="#" title="Click to view strings with warning only - ' + warnings_count + ' strings" class="wpgpt-filter-warnings count-' + warnings_count + '"><img src="' + wpgpt_warning_icon + '"> Warnings (' + warnings_count + ')</a><span class="separator">•</span>';
	filters += '<a href="#" title="Click to view all strings" class="wpgpt-filter-all">All</a>';

	var current_filters = jQuery( '.wpgpt-filters' );
	if ( current_filters.length ) {
		current_filters.html( filters );
	} else {
		jQuery( '.paging' ).first().before( '<div class="wpgpt-filters">' + filters + '</div' );
	}
	
	jQuery( '.wpgpt-filter-warnings' ).click( function() {
		jQuery( '#translations tr.preview' ).hide( 200 );
		jQuery( '#translations tr.preview.wpgpt-has-warning' ).show( 200 );
	});

	jQuery( '.wpgpt-filter-notices' ).click( function() {
		jQuery( '#translations tr.preview' ).hide( 200 );
		jQuery( '#translations tr.preview.wpgpt-has-notice' ).show( 200 );
	});
	jQuery( '.wpgpt-filter-all' ).click( function() {
		jQuery( '#translations tr.preview' ).show( 200 );
	});
}

function arr_diff( a, b ) {
    return a.filter( function( i ) {
		var pos = b.indexOf( i );
		if ( pos < 0 ) {
			return true;
		}
		else{
			b[ pos ] += '-checked';
			return false;
		}
	}).toString();
}

// Count occurrences by Vitim.us at https://gist.github.com/victornpb/7736865
function occurrences( string, subString ) {
    string = '' + string.toLowerCase();
    subString = '' + subString.toLowerCase();
    if ( subString.length <= 0 ) return ( string.length + 1 );
    var n = 0, pos = 0, step = subString.length;
    while ( true ) {
        pos = string.indexOf( subString, pos );
        if ( pos >= 0 ) { ++n; pos += step; } else break;
    }
    return n;
}