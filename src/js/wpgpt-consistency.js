var _wpgpt_settings = { 'search': 'enabled', 'bulk_consistency': 'disabled' };
//	_wpgpt_settings is a known/accepted redundancy for TM script that runs in the same environment.
_wpgpt_settings = ( getLS( 'wpgpt-user-settings' ) !== null ) ? JSON.parse( getLS( 'wpgpt-user-settings' ) ) : _wpgpt_settings;

if ( _wpgpt_settings.search == 'enabled' ) {
	consistency_tools();
}

if ( _wpgpt_settings.bulk_consistency == 'enabled' ) {
    wpgpt_bulk_consistency();
    var alternatives_data = [],
    alternatives_forms = [];
}

function consistency_tools() {
	var tabs = [];
	var tabs_state = {
		'consistency': 'closed',
		'wp': 'closed',
		'plugin': 'closed',
		'this_project': 'closed',
		'gt': 'closed',
		'references': 'closed',
		'panel_links': 'closed'
	};

	var search_url = {};

	var wpgpt_search_settings = {
		'this_project' : true,
		'wp' : true,
		'consistency' : true,
		'plugin' : false,
		'plugin_slug' : '',
		'copy_me' : false
	};
	wpgpt_search_settings = ( getLS( 'wpgpt-search' ) !== null ) ? JSON.parse( getLS( 'wpgpt-search' ) ) : wpgpt_search_settings;

	var notice_time;

	const hostname = window.location.hostname;
	const pathname = window.location.pathname;
	var project_url = pathname.split( '/' );
	var short_locale = project_url[ project_url.length - 3 ];
	const current_locale = short_locale + '/' + project_url[ project_url.length - 2 ];

	if ( document.location.href.includes( 'consistencypage' ) ) {
		wpgpt_page( 'consistency' );
		return;
	}

	if ( document.location.href.includes( 'resultpage' ) ) {
		wpgpt_page( 'result' );
	} else {
		wpgpt_search();
	}

	wpgpt_quicklinks();
	wpgpt_consistency();
	wpgpt_anonymous();
	wpgpt_gt();
	wpgpt_events();
	wpgpt_localdate();
	wpgpt_notranslate();

	function wpgpt_page( page_type ) {
		$scrollTo( '.breadcrumb', 'smooth', 'start' );
		var wpgpt_page_notice = $createElement( 'p', { 'class': 'wpgpt-results-notice' }, 'When you\'re done on these result pages click ' );
		wpgpt_page_notice.append( $createElement( 'span', {}, 'Close all' ), document.createTextNode(' in the main tab to close them all.' ) );

		if ( page_type == 'result' ){
			$addElement( '.filter-toolbar', 'beforebegin', wpgpt_page_notice );
		} else {
			$addElement( '.consistency-form', 'beforebegin', wpgpt_page_notice );
			var view_unique = document.querySelector( '.translations-unique' );
			if ( view_unique && _wpgpt_settings.bulk_consistency == 'disabled' ) {
				view_unique.classList.remove( 'hidden' );
			}
		}
	}

	function wpgpt_search(){
		var wpgpt_search_output = $createElement( 'form', { 'class':  'wpgpt-search' } );
		var wpgpt_search_label_project = $createElement( 'label', {}, ' this project' );
			wpgpt_search_label_project.prepend(
				$createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option', 'data-searchproject': 'this_project' } )
			);
		var wpgpt_search_label_WP = $createElement( 'label', {}, ' WordPress' );
			wpgpt_search_label_WP.prepend(
				$createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option ', 'data-searchproject': 'wp' } )
			);
		var wpgpt_search_label_plugin = $createElement( 'label', { 'class': 'wpgpt-search-plugin-label' }, ' another plugin' );
			wpgpt_search_label_plugin.prepend(
				$createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option wpgpt-search-plugin-option', 'data-searchproject': 'plugin' } )
			);
		var wpgpt_search_label_consistency = $createElement( 'label', {}, ' consistency tool' );
			wpgpt_search_label_consistency.prepend(
				$createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option', 'data-searchproject': 'consistency' } )
			);

		wpgpt_search_output.append(
			$createElement( 'span', { 'class': 'error-notice' } ),
			$createElement( 'input', { 'class': 'wpgpt-search-word', 'name': 'wpgpt_search_word', 'placeholder': 'Search for...', 'type': 'text' } ),
			$createElement( 'input', { 'class': 'wpgpt-search-action', 'value': 'Search', 'type': 'submit' } ),
			wpgpt_search_label_project,
			wpgpt_search_label_WP,
			wpgpt_search_label_plugin,
			$createElement( 'input', { 'class': 'wpgpt-search-plugin-slug hidden', 'name': 'wpgpt_search_plugin_slug', 'placeholder': ' enter slug', 'type': 'text', 'size': '15' } ),
			wpgpt_search_label_consistency,
			$createElement( 'button', { 'class': 'wpgpt-search-close-tabs', 'style': 'display:none;', 'type': 'button' }, 'Close all tabs' )
		);

		$addElements( '.editor-panel .editor-panel__right .panel-content', 'beforeend', wpgpt_search_output );

		document.querySelectorAll( '.wpgpt-search-option' ).forEach( function( search_element ) {
			search_element.checked = wpgpt_search_settings[ search_element.dataset.searchproject ];
		});

		if ( wpgpt_search_settings.plugin ) {
			$toggleEl( '.wpgpt-search-plugin-slug', 'hidden' );
		}

		if ( wpgpt_search_settings.plugin_slug !== undefined ) {
			document.querySelectorAll( '.wpgpt-search-plugin-slug' ).forEach( function( el ){
				el.value = wpgpt_search_settings.plugin_slug;
			} );
		}

		$addEvtListener(
			'submit',
			'.wpgpt-search',
			function( event ) {
				event.preventDefault();
				wpgpt_do_search( event.target.elements.wpgpt_search_word.value, event.target.elements.wpgpt_search_plugin_slug.value );
			}
		);
		$addClickEvt( '.wpgpt-search-close-tabs', wpgpt_close_tabs, [ 'all' ] );
		$addClickEvt( '.wpgpt-search-plugin-option', $toggleEl, [ '.wpgpt-search-plugin-slug', 'hidden' ] );
		$addEvtListener( 'click', '.wpgpt-search-option', wpgpt_do_search_options );
	}

	function wpgpt_do_search( searching_for, also_searching_in_plugin ) {
		var any_tab = 0;
		const filters = '?filters[term]=' + searching_for + '&filters[status]=current';

		search_url.this_project = encodeURI( 'https://' + hostname + pathname + filters + '&resultpage' );
		search_url.wp = encodeURI( 'https://' + hostname + '/projects/wp/dev/' + current_locale + filters + '&resultpage' );
		search_url.consistency = encodeURI( 'https://' + hostname + '/consistency/?search=' + searching_for + '&set=' + current_locale + '&consistencypage');

		if ( wpgpt_search_settings.plugin ) {
		wpgpt_search_settings.plugin_slug = also_searching_in_plugin;
		setLS( 'wpgpt-search', JSON.stringify( wpgpt_search_settings ) );
		if ( wpgpt_search_settings.plugin_slug !== 'undefined' ){
			document.querySelectorAll( '.wpgpt-search-plugin-slug' ).forEach( function( el ) {
				el.value = wpgpt_search_settings.plugin_slug;
			} );
		}
		search_url.plugin = encodeURI( 'https://' + hostname + '/projects/wp-plugins/' + also_searching_in_plugin + '/dev/' + current_locale + filters + '&resultpage' );
		}

		if ( searching_for != '' && ( also_searching_in_plugin != '' || !wpgpt_search_settings.plugin ) ) {
			wpgpt_close_tabs( 'searching' );
			Object.entries( search_url ).forEach( ( url ) => {
				const [ key, value ] = url;
				if ( wpgpt_search_settings[ key ] ) {
					tabs[ key ] = window.open( value, '_blank' );
					tabs_state[ key ] = 'opened';
					any_tab = 1;
				}
			} );
			if ( any_tab ) {
				$showEl( '.wpgpt-search-close-tabs' );
			}
			else {
				wpgpt_do_search_notice( 'Choose a project!' );
			}
		} else {
			wpgpt_do_search_notice( 'String/slug cannot be empty!' );
		}
	}

	function wpgpt_open_tab( tab_key, tab_uri ) {
		if ( tabs_state[ tab_key ] == 'opened' ) {
			tabs[ tab_key ].close();
		}
		tabs[ tab_key ] = window.open( tab_uri, '_blank' );
		tabs_state[ tab_key ] = 'opened';
	}

	function wpgpt_close_tabs( tabs_group ) {
		Object.entries( tabs_state ).forEach( ( tab ) => {
			const [ tab_key, tab_value ] = tab;
			if ( ( tab_value === 'opened' ) && ( tabs_group == 'all' || ( tab_key !== 'gt' && tab_key !== 'references' && tab_key !== 'panel_links'  ) ) ) {
				tabs[ tab_key ].close();
				tabs_state[ tab_key ] = 'closed';
			}
		} );
		$hideEl( '.wpgpt-search-close-tabs' );
	}

	function wpgpt_do_search_options( event ) {
		wpgpt_search_settings[ event.target.dataset.searchproject ] = event.target.checked;
		document.querySelectorAll( '.wpgpt-search-option' ).forEach( ( el, i ) => {
			el.checked = wpgpt_search_settings[ el.dataset.searchproject ];
		} );
		setLS( 'wpgpt-search', JSON.stringify( wpgpt_search_settings ) );
	}

	function wpgpt_do_search_notice( msg ) {
		$setTextContent( '.error-notice', msg );
		clearTimeout( notice_time );
		notice_time = setTimeout( function() { $setTextContent( '.error-notice', '' ); }, 3000);
	}

	function wpgpt_consistency(){
		if ( document.querySelector( '.gd-get-consistency' ) !== null ) {
			return;
		}
		var wpgpt_consistency_output = $createElement( 'details', { 'class': 'wpgpt_consistency suggestions__translation-consistency', 'open': 'open' } );
		var wpgpt_consistency_summary = $createElement( 'summary', { }, 'Suggestions from Consistency' );
		var wpgpt_consistency_button = $createElement( 'button', { 'class': 'wpgpt_get_consistency' }, 'View Consistency suggestions' );

		wpgpt_consistency_output.append( wpgpt_consistency_summary, wpgpt_consistency_button );

		$addElements( '.editor-panel__left .suggestions-wrapper', 'beforeend', wpgpt_consistency_output );
		$addEvtListener( 'click', '.wpgpt_get_consistency', wpgpt_do_consistency );
	}

	async function wpgpt_do_consistency( event ) {
		event.target.textContent = 'Loading...';
		var consistency_url = event.target.closest( '.editor-panel' ).querySelectorAll( '.button-menu__dropdown li a' )[ 2 ].href.replace( 'consistency?search', 'consistency/?search' );
		var this_panel_content = event.target.closest( '.panel-content');
		var translations_forms = this_panel_content.querySelectorAll( '.translation-wrapper textarea' ).length;
		var consistency_response = await wpgpt_get_fetch_results( consistency_url );
		var consistency_parser = new DOMParser();
		var consistency_page = consistency_parser.parseFromString( consistency_response , 'text/html' );
		var consistency_alternatives = consistency_page.querySelectorAll( '.consistency-table tbody tr th strong' );
		var translations_count, unique_translation_count;

		if ( consistency_alternatives.length == 1 ) {
		  unique_translation_count = consistency_page.querySelectorAll( 'tr' ).length - 2;
		  unique_translation_count = ' ('+ unique_translation_count + ' time' + ( ( unique_translation_count > 1 ) ? 's' : '' ) + ')';
		} else {
			translations_count = consistency_page.querySelectorAll( '.translations-unique small' );
		}

		var wpgpt_consistency_suggestions;
		if ( consistency_alternatives.length ) {
			var wpgpt_consistency_item, wpgpt_consistency_item_div, wpgpt_consistency_item_translation, wpgpt_consistency_item_meta, wpgpt_consistency_item_count, wpgpt_consistency_item_raw, wpgpt_consistency_item_button, wpgpt_consistency_item_header;
			wpgpt_consistency_suggestions = $createElement( 'ul', { class: 'suggestions-list' } );
			  
			for ( var consistency_alternatives_i = 0; consistency_alternatives_i < consistency_alternatives.length; consistency_alternatives_i++ ) {
				var this_translation_count = ( consistency_alternatives.length == 1 ) ? unique_translation_count : translations_count[ consistency_alternatives_i ].textContent;
				var this_translation_text = [ consistency_alternatives[ consistency_alternatives_i ].textContent ];
				var this_translation_forms = [];

				if ( translations_forms > 1 ) {
					var string_response = await wpgpt_get_fetch_results( consistency_alternatives[ consistency_alternatives_i ].parentNode.parentNode.nextSibling.querySelectorAll( 'td .meta a')[ 1 ].href.replace( '?filters', '/?filters' ) );
					var string_parser = new DOMParser();
					var string_page = string_parser.parseFromString( string_response , 'text/html' );
					var consistency_textareas = string_page.querySelectorAll( '.translation-wrapper .textareas textarea' );
					
					var index = 0;
					consistency_textareas.forEach( function ( textarea ){
						this_translation_text[ index ] = textarea.value;
						index++;
					});
					
					var consistency_forms = string_page.querySelectorAll( '.translation-form-list .translation-form-list__tab' );
					consistency_forms.forEach( function ( form ){
						this_translation_forms.push( form.textContent.trim() );
					});
					wpgpt_consistency_item_header = $createElement( 'li', { 'class': 'consistency_index' }, `#${ consistency_alternatives_i + 1 }` );
					wpgpt_consistency_item_header.append(

						$createElement( 'button', { 'type': 'button', 'class': 'copy-full-alternative', 'data-alternative_id': consistency_alternatives_i }, 'Copy' ),
						$createElement( 'span', { 'class': 'consistency_count' }, this_translation_count ),
					);
					wpgpt_consistency_suggestions.append( wpgpt_consistency_item_header );
				}

				var meta_info, alternative_as_words;
				var space_span = $createElement( 'span', { 'class': 'space' }, ' ' );

				this_translation_text.forEach( ( form_text, form_text_i ) => {
					wpgpt_consistency_item = document.createElement( 'li' );
					wpgpt_consistency_item_div = $createElement( 'div', { 'class': 'translation-suggestion with-tooltip', 'role': 'button', 'aria-pressed': 'false', 'aria-label': 'Copy translation', 'tabindex': '0' } );
					wpgpt_consistency_item_translation = $createElement( 'span', { 'class': 'translation-suggestion__translation' } );
					alternative_as_words = form_text.split( ' ' );
					alternative_as_words.forEach( ( word, word_i ) => {
						wpgpt_consistency_item_translation.appendChild( document.createTextNode( word ) );
							if ( word_i < alternative_as_words.length - 1 ) {
								wpgpt_consistency_item_translation.append( space_span.cloneNode( true ) );
							}
					} );
					meta_info = ( translations_forms > 1 ) ? `${ this_translation_forms[ form_text_i ] }: ` : `${ consistency_alternatives_i + 1 }: `;
					wpgpt_consistency_item_meta = $createElement( 'span', { 'class': 'translation-suggestion__translation index' }, meta_info );
					
					wpgpt_consistency_item_raw = $createElement( 'span', { 'class': `translation-suggestion__translation-raw consistency_alternative__${ consistency_alternatives_i }_${ form_text_i }`, 'aria-hidden': 'true' }, form_text );
					wpgpt_consistency_item_button = $createElement( 'button', { 'type': 'button', 'class': 'copy-suggestion' }, 'Copy' );
					wpgpt_consistency_item_translation.prepend( wpgpt_consistency_item_meta );
					
					if ( translations_forms === 1 ) {
						wpgpt_consistency_item_count = $createElement( 'span', { 'class': 'consistency_count' }, this_translation_count );
						wpgpt_consistency_item_translation.append( wpgpt_consistency_item_count );
					}

					wpgpt_consistency_item_div.append( wpgpt_consistency_item_translation, wpgpt_consistency_item_raw, wpgpt_consistency_item_button );
					wpgpt_consistency_item.append( wpgpt_consistency_item_div );
					wpgpt_consistency_suggestions.append( wpgpt_consistency_item );
				} );
			}
		} else {
			wpgpt_consistency_suggestions = 'No suggestions.';
		}
		event.target.before ( wpgpt_consistency_suggestions );
		event.target.parentNode.removeChild( event.target );
		if ( translations_forms > 1 ) {
			$addEvtListener( 'click', '.copy-full-alternative', wpgpt_copy_full_alternative );
			this_panel_content.querySelectorAll( '.wpgpt_consistency .copy-suggestion' ).forEach( function( el ) { el.parentNode.removeChild( el ) } );
			this_panel_content.querySelectorAll( '.wpgpt_consistency .translation-suggestion' ).forEach( function( el ) { el.classList.remove( 'translation-suggestion' ); } );
			this_panel_content.querySelectorAll( '.wpgpt_consistency .with-tooltip' ).forEach( function( el ) { el.classList.remove( 'with-tooltip' ); } );
		}
	}

	async function wpgpt_get_fetch_results( url ) {
		try {
			let res = await fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } );
			return await res.text();
		} catch ( error ) {
			console.log( error );
		}
	}

	function wpgpt_copy_full_alternative( event ) {
		var panel_content = event.target.closest( '.panel-content' );
		var alternative_id = event.currentTarget.dataset.alternative_id;
		panel_content.querySelectorAll( 'textarea' ).forEach( ( textarea, i ) => {
			textarea.value = panel_content.querySelector( `.consistency_alternative__${ alternative_id }_${ i }` ).textContent;
		} );
		panel_content.querySelector( ' .textareas.active textarea' ).focus();
	}

	function wpgpt_quicklinks(){
		if ( document.querySelector( '.gd_quicklink' ) !== null ) {
			/* In case GD removes it.
			document.querySelectorAll( '.editor' ).forEach( function( editor ){
				editor.querySelectorAll( '.button-menu__dropdown li a' )[ 1 ].href += '&historypage';
			} );*/
			return;
		}
		var wpgpt_quicklinks_output = $createElement( 'span', { 'class': 'wpgpt_quicklinks' } );
		var wpgpt_quicklinks_copy_atributes = {
		  'type': 'button',
		  'class': 'wpgpt_quicklinks_copy with-tooltip' + ( ( wpgpt_search_settings.copy_me ) ? ' active' : ' inactive' ),
		  'aria-label':'Click this and another to copy',
		};
		var wpgpt_quicklinks_copy = $createElement( 'button', wpgpt_quicklinks_copy_atributes );
		wpgpt_quicklinks_copy.append(
		  $createElement ( 'span', { 'class': 'screen-reader-text' } ),
		  $createElement ( 'span', { 'class': 'dashicons dashicons-clipboard', 'aria-hidden': 'true' } ),
		);

		var wpgpt_quicklinks_separator_atributes = {
		  'class': 'wpgpt_quicklinks_plus dashicons' + ( ( wpgpt_search_settings.copy_me ) ? ' dashicons-plus' : ' separator' ),
		  'aria-hidden': 'true',
		};
		var wpgpt_quicklinks_separator = $createElement( 'span', wpgpt_quicklinks_separator_atributes );

		var wpgpt_quicklinks_permalink = $createElement( 'button', { 'class': 'wpgpt_quicklinks_item wpgpt_quicklinks_permalink with-tooltip', 'aria-label': 'Permalink to translation' } );
		wpgpt_quicklinks_permalink.append(
		  $createElement ( 'span', { 'class': 'screen-reader-text' }, 'Permalink to translation' ),
		  $createElement ( 'span', { 'class': 'dashicons dashicons-admin-links', 'aria-hidden': 'true' } ),
		);

		var wpgpt_quicklinks_history = $createElement( 'button', { 'class': 'wpgpt_quicklinks_item wpgpt_quicklinks_history with-tooltip', 'aria-label': 'Translation History' } );
		wpgpt_quicklinks_history.append(
		  $createElement ( 'span', { 'class': 'screen-reader-text' }, 'Translation History' ),
		  $createElement ( 'span', { 'class': 'dashicons dashicons-backup', 'aria-hidden': 'true' } ),
		);

		var wpgpt_quicklinks_consistency = $createElement( 'button', { 'class': 'wpgpt_quicklinks_item wpgpt_quicklinks_consistency with-tooltip', 'aria-label': 'View original in consistency tool' } );
		wpgpt_quicklinks_consistency.append(
		  $createElement ( 'span', { 'class': 'screen-reader-text' }, 'View original in consistency tool' ),
		  $createElement ( 'span', { 'class': 'dashicons dashicons-list-view', 'aria-hidden': 'true' } ),
		);

		wpgpt_quicklinks_output.append(
		  wpgpt_quicklinks_copy,
		  wpgpt_quicklinks_separator,
		  wpgpt_quicklinks_permalink,
		  wpgpt_quicklinks_history,
		  wpgpt_quicklinks_consistency,
		);

		$addElements( '.editor-panel__right .panel-header', 'beforeend', wpgpt_quicklinks_output );

		document.querySelectorAll( '.editor' ).forEach( function( editor ){
			var editor_menu = editor.querySelectorAll( '.button-menu__dropdown li a' );
			editor.querySelector( '.wpgpt_quicklinks_permalink' ).dataset.quicklink = editor_menu[ 0 ].href;
			editor_menu[ 1 ].href += '&historypage';
			editor.querySelector( '.wpgpt_quicklinks_history' ).dataset.quicklink =  editor_menu[ 1 ].href;
			editor.querySelector( '.wpgpt_quicklinks_consistency' ).dataset.quicklink = editor_menu[ 2 ].href + '&consistencypage';
		} );

		$addEvtListener( 'click', '.wpgpt_quicklinks_copy, .wpgpt_quicklinks_plus', wpgpt_toggle_quicklinks_copy );
		$addEvtListener( 'click', '.wpgpt_quicklinks_item', wpgpt_do_quicklinks );
	}

	function wpgpt_do_quicklinks( event ) {
		if ( wpgpt_search_settings.copy_me ) {
		  var btn_target = event.currentTarget;
		  var current_aria_label = btn_target.getAttribute( 'aria-label' );
		  wpgpt_copyClipboard( event.currentTarget.dataset.quicklink );
		  btn_target.setAttribute( 'aria-label', 'Copied!' );
		  setTimeout( function() { btn_target.setAttribute( 'aria-label', current_aria_label ); }, 2000 );
		} else {
			wpgpt_open_tab( 'panel_links', event.currentTarget.dataset.quicklink );
			$showEl( '.wpgpt-search-close-tabs' );

		}
	}

	function wpgpt_toggle_quicklinks_copy() {
		document.querySelectorAll( '.wpgpt_quicklinks_plus' ).forEach( function( el ) {
		  el.classList.toggle( 'dashicons-plus' );
		  el.classList.toggle( 'separator' );
		} );
		document.querySelectorAll( '.wpgpt_quicklinks_copy' ).forEach( function( el ) {
		  el.classList.toggle( 'active' );
		  el.classList.toggle( 'inactive' );
		} );
		wpgpt_search_settings.copy_me = ! wpgpt_search_settings.copy_me;
		setLS( 'wpgpt-search', JSON.stringify( wpgpt_search_settings ) );
	}
	
	// Adds checkbox to set user field value to 'anonymous' - author submitted translations.
	function wpgpt_anonymous(){
		var user_filter_el = document.getElementById( 'filters[user_login]' );
		if ( ! user_filter_el ){
			return;
		}
		var anonymous = $createElement( 'div' );
		var anonymous_input = $createElement( 'input', { 'type': 'checkbox', 'id': 'wpgpt_search_anonymous' } );
		var anonymous_label = $createElement( 'label', { 'for': 'wpgpt_search_anonymous' }, 'Anonymous author' );
		anonymous.append( anonymous_input, anonymous_label );
		user_filter_el.insertAdjacentElement( 'afterend' , anonymous );
		anonymous_input.addEventListener( 'click', function( event ){
			if ( event.target.checked ) {
				document.getElementById( 'filters[user_login]' ).value = 'anonymous';
			} else {
				document.getElementById( 'filters[user_login]' ).value = '';
			}
		} );
	}

	function wpgpt_gt() {
		if ( typeof short_locale == 'undefined' ){
			return;
		}
		var gp_gt_locales = { 'bel': 'be', 'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW', 'hat': 'ht', 'hau': 'ha', 'he': 'iw', 'ibo': 'ig', 'jv': 'jw', 'kin': 'rw', 'kmr': 'ku', 'ckb': 'ku', 'kir': 'ky', 'mlt': 'mt', 'mri': 'mi', 'ary': 'ar', 'mya': 'my', 'nb': 'no', 'nn': 'no', 'ory': 'or', 'sna': 'sn', 'snd': 'sd', 'azb': 'az', 'tuk': 'tk', 'xho': 'xh', 'yor': 'yo', 'zul': 'zu' };

		if ( short_locale in gp_gt_locales ) {
			short_locale = gp_gt_locales[ short_locale ];
		}
		else {
			short_locale = short_locale.split( '-' );
			short_locale = short_locale[ 0 ];
		}

		document.querySelectorAll( '.editor' ).forEach( function( editor_el ){
			var suggestion_wrapper = editor_el.querySelector( '.editor-panel__left .suggestions-wrapper' );
			if ( suggestion_wrapper == null ){
				return;
			}

			var wpgpt_gt_string = encodeURIComponent( editor_el.querySelector( '.source-string__singular span.original' ).textContent );
			var wpgpt_gt_url = 'https://translate.google.com/?sl=en&tl=' + short_locale + '&text=' + wpgpt_gt_string + '&op=translate';
			wpgpt_gt_url = wpgpt_gt_url.replaceAll( '"','&#34;' );

			var wpgpt_gt_output = $createElement( 'details', { 'class': 'wpgpt_gt suggestions__translation-gt', 'open': 'open' } );
			var wpgpt_gt_summary = $createElement( 'summary', { }, 'Suggestion from Google Translate' );
			var wpgpt_gt_button = $createElement( 'button', { 'class': 'wpgpt_get_gt', 'data-wpgpt_gt_string': wpgpt_gt_url }, 'View Google Translate suggestions' );

			wpgpt_gt_output.append( wpgpt_gt_summary,  wpgpt_gt_button );
			suggestion_wrapper.insertAdjacentElement( 'beforeend' , wpgpt_gt_output );

		} );

		$addEvtListener( 'click', '.wpgpt_get_gt', wpgpt_do_gt );
	}

	function wpgpt_do_gt( event ) {
		wpgpt_open_tab( 'gt', event.target.dataset.wpgpt_gt_string );
		$showEl( '.wpgpt-search-close-tabs' );
	}

	function wpgpt_events(){
		$addEvtListener( 'click', '.source-details__references ul li a', do_refferences );
		window.onbeforeunload = function() { wpgpt_close_tabs( 'all' ); };
		document.addEventListener( 'keydown', ( event ) => {
			if ( event.altKey ) {
				if ( ! isNaN( parseInt( event.key ) ) ) {
					wpgpt_do_event( '.suggestions__translation-consistency .copy-suggestion', parseInt( event.key ), 'click', '.suggestions__translation-consistency .copy-full-alternative' ); // Alt + number - Copy consistency suggestion
				} else {
					switch( event.key.toLowerCase() ) {
						case 'c': wpgpt_do_event( '.wpgpt_get_consistency' ); // Alt + C  - Show consistency suggestions
						break;

						case 'g': wpgpt_do_event( '.wpgpt_get_gt' ); // Alt + G - Google Translate string
						break;

						case 'n':  wpgpt_do_event( '.wpgpt_notranslate_copy_all' ) // Alt + N - Copy all non-translatable strings
						break; 

						case 'p':
						case 's':
							wpgpt_do_event( '.wpgpt-search-word', 1, 'focus' ); // Alt + P OR Alt + S - Focus on Search
						break;
					}
				}
			}
		}, false );
	}

	function wpgpt_do_event( target_selector, target_index = 1, event_type = 'click', alternative_target_selector = false ) {
		const open_editor = document.querySelector( '.editor[style*="display: table-row;"]' );
		if ( ! open_editor ) {
			return;
		}
		const target_element = open_editor.querySelectorAll( target_selector )[ target_index - 1 ];
		if ( target_element ) {
			if ( event_type === 'click' ) {
				target_element.click();
			} else {
				target_element.focus();
			}
			return;
		}
		if ( alternative_target_selector ) {
			wpgpt_do_event( alternative_target_selector, target_index, event_type );
		}
	}

	function wpgpt_copyClipboard( text ) {
		const elem = document.createElement( 'textarea' );
		elem.value = text;
		document.body.appendChild( elem );
		elem.select();
		document.execCommand( 'copy' );
		document.body.removeChild( elem );
	}
	
	function do_refferences( event ) {
		event.preventDefault();
		wpgpt_open_tab( 'references', event.currentTarget.href );
	}

	function wpgpt_localdate(){
		var local_time = new Date();
		var timezone_offset = local_time.getTimezoneOffset() / 60 * -1;
		timezone_offset = 'UTC' + ( ( timezone_offset !== 0 ) ? ( ( ( timezone_offset > 0 ) ? '+' : '' ) + timezone_offset ) : '' );
		var localized_date = $createElement( 'span', { 'class': 'localized_date' } );
		localized_date.append( $createElement( 'span', { 'class': 'timezone' }, timezone_offset ) );
		document.querySelectorAll( '.editor-panel__right .meta dd' ).forEach( ( el ) => {
				if ( el.textContent.includes( 'UTC' ) ) {
					var date_data = el.textContent.split( ' ', 3 );
					var date_date = date_data[ 0 ].split( '-', 3 );
					var date_time = date_data[ 1 ].split( ':', 3 );
					var new_date =  new Date( Date.UTC( date_date[ 0 ], date_date[ 1 ] - 1, date_date[ 2 ], date_time[ 0 ], date_time[ 1 ], date_time[ 2 ] ) );	
					var this_localized_date = localized_date.cloneNode( true );
					this_localized_date.prepend( new_date.toLocaleDateString() + ' ' + new_date.toLocaleTimeString() );
					el.insertAdjacentElement( 'afterend', this_localized_date );
					el.style.display = 'none';
				}
		} );
	}

	function wpgpt_notranslate() {
		const notranslate_header = document.createElement( 'div' );
		notranslate_header.innerHTML = '<span>&#9654;</span> Non-translatable:';
		notranslate_header.append( $createElement( 'button', { 'type': 'button', 'class': 'wpgpt_notranslate_copy_all' }, 'Copy all' ) );
		document.querySelectorAll( '.preview .original' ).forEach( ( original ) => {
			let has_notranslate = false;
			const editor = original.parentNode.nextElementSibling;
			const notranslate = $createElement( 'div', { 'class': 'wpgpt_notranslate' } );
			const notranslate_fragment = document.createDocumentFragment();
			original.querySelector( '.original-text' ).parentNode.querySelectorAll( '.original-text > .notranslate' ).forEach(
				( item ) => {
					const notranslate_item = document.createElement( 'a' );
					notranslate_item.setAttribute( 'title', 'Click to add this item to textarea' );
					notranslate_item.textContent = item.textContent;
					notranslate_fragment.appendChild( notranslate_item );
					has_notranslate = true;
				}
			);
			if ( has_notranslate ) {
				notranslate.prepend( notranslate_header.cloneNode( true ) );
				notranslate.append( notranslate_fragment );
				editor.querySelector( '.suggestions-wrapper' ).prepend( notranslate );
			}
		} );
	
		$addEvtListener( 'click', '.translation-form-list li button', ( ev ) => {
			const textareas = ev.currentTarget.closest( '.translation-wrapper' ).querySelectorAll( '.textareas' )[ ev.currentTarget.dataset.pluralIndex ];
			textareas.classList.add( 'active' );
			textareas.querySelector( 'textarea' ).focus();
		} );
		$addEvtListener( 'focus', '.editor textarea', wpgpt_update_notranslate );
		$addEvtListener( 'keyup', '.editor textarea', wpgpt_update_notranslate );
		$addEvtListener( 'click', '.wpgpt_notranslate a', ( ev ) => {
			wpgpt_insertText( ev.currentTarget.closest( '.editor-panel__left' ).querySelector( '.textareas.active textarea' ), ev.currentTarget.textContent );
		} );
		$addEvtListener( 'click', '.wpgpt_notranslate_copy_all', ( ev ) => {
			let all_notranslate = '';
			const notranslate_div = ev.currentTarget.parentNode.parentNode;
			notranslate_div.querySelectorAll( 'a' ).forEach( ( el ) => {
				all_notranslate += `${el.textContent} `;
			} );
			wpgpt_insertText( notranslate_div.closest( '.editor-panel__left' ).querySelector( '.textareas.active textarea' ), all_notranslate );
		} );

		const unique_editor = document.querySelector( '.editor[style*="display: table-row;"] textarea' );
		if ( unique_editor ) {
			unique_editor.blur();
			unique_editor.focus();
		}
	}

	function wpgpt_insertText( el, text ){
		const selection = { start: el.selectionStart, end: el.selectionEnd };
		const new_position = selection.start + text.length;
		el.value = el.value.slice( 0, selection.start ) + text + el.value.slice( selection.end );
		el.focus();
		el.setSelectionRange( new_position, new_position );
	}
	
	function wpgpt_update_notranslate( ev ) {
		let textarea_content = ev.currentTarget.value;
		ev.currentTarget.closest( '.editor-panel__left' ).querySelectorAll( '.wpgpt_notranslate a' ).forEach( ( notranslate_item ) => {
			const notranslate_text = notranslate_item.textContent;
			if ( textarea_content.indexOf( notranslate_text ) > -1 ) {
				notranslate_item.classList.add( 'used' );
				textarea_content = textarea_content.replace( notranslate_text, '' );
			} else {
				notranslate_item.classList.remove( 'used' );
			}
		} );
	}
}

function wpgpt_bulk_consistency(){
    if ( ! ( window.location.href.includes( 'wordpress.org/consistency' ) && document.querySelector( '.consistency-table' ) ) ) {
		return; 
	}
	var translations_overview = document.getElementById( 'translations-overview');
	if ( translations_overview ) { 
		translations_overview.classList.add( 'wporg-notice-notice' );
		translations_overview.classList.remove( 'wporg-notice-warning' );
	}

    var wpgpt_safe_limit = 25;
    localStorage.removeItem( 'wpgpt_chosen_alternative' );
	var toggle_view_unique = document.querySelector( '#toggle-translations-unique' );
	if ( toggle_view_unique ) {
		toggle_view_unique.parentNode.replaceChild( $createElement( 'span', { 'id': 'wpgpt_loading' }, 'Loading...'), toggle_view_unique );
	}

	var reject_div = $createElement( 'div', { 'class': 'fire_magic_reject_close_div' }, 'Danger zone: ' );
	reject_div.append(
	   $createElement( 'button', { 'class': 'fire_magic_reject_close' }, 'Reject all translations' )
	);
	$addElement( '.notice', 'afterbegin', reject_div );
		   
	var replace_btn = $createElement( 'button', { 'class': 'fire_magic_save_close', 'style': 'display:none;' }, 'Bulk replace & Save' );
	$addElement( '#translations-overview', 'afterend', replace_btn );

	var alternative_id, alternatives_url = {};
	var consistency_rows = document.querySelectorAll( '.consistency-table tbody tr' );
	consistency_rows.forEach( ( row, row_i ) => {
        var row_id =  row.id;
        if ( row_id ) { // Alternative's header
            alternative_id = row_id;
            alternatives_url[ row_id ] = consistency_rows[ row_i + 1 ].querySelectorAll( 'td .meta a' )[ 1 ].href;
        }
        row.classList.add( 'alternative-' + alternative_id );
    } );
	
	var unique_translations = document.querySelectorAll( '.translations-unique li a.anchor-jumper' );
	unique_translations.forEach( ( translation, translation_i ) => {
        var translation_id = translation.href.split( '#' )[ 1 ];
        var bulk_buttons = $createElement( 'div', { 'class': 'wpgpt-bulk-buttons' } );
        bulk_buttons.append(
            $createElement( 'button', { 'id': `choose-${ translation_id }`, 'class': 'choose-consistency-string', 'type': 'button' }, 'Set this translation as replacement' ),
            $createElement( 'button', { 'id': `delete-${ translation_id }`, 'class': 'delete-consistency-strings', 'type': 'button', 'disabled': 'disabled' }, 'Do not replace this translation' )
        );
        translation.insertAdjacentElement( 'afterend', bulk_buttons );
        wpgpt_get_alternative( alternatives_url[ translation_id ], translation_id, translation, translation_i === ( unique_translations.length - 1 ) );
    } );

    $addEvtListener( 'click', '.choose-consistency-string', wpgpt_choose_alternative );
    function wpgpt_choose_alternative( event ){
        var alternative_id = event.target.id.replace( 'choose-', '' );
        localStorage.setItem( 'wpgpt_chosen_alternative', JSON.stringify( alternatives_data [ alternative_id ] ) );
        document.querySelectorAll( '.delete-consistency-strings' ).forEach( function( el ){ el.disabled = false; } );
        document.querySelectorAll( '.choose-consistency-string' ).forEach( function( el ){ el.disabled = true; } );
        document.querySelector( `#delete-${ alternative_id }` ).click();
        document.querySelector( '.fire_magic_save_close' ).style.display = 'inline-block';
        event.target.insertAdjacentElement( 'beforeBegin', $createElement( 'strong', {}, 'This translation will be used to replace all others. ' ) );
        event.target.parentNode.removeChild( event.target );
        var table_head = $createElement( 'thead' );
        var table_tr = $createElement( 'tr' );
        var table_th = $createElement( 'th', { 'colspan': '2' }, 'These are the transations that will be replaced:' );
        table_tr.append( table_th );
        table_head.append( table_tr );
        $addElement( '.consistency-table', 'afterbegin', table_head );
    }

    $addEvtListener( 'click', '.delete-consistency-strings', wpgpt_delete_alternative );
    function wpgpt_delete_alternative( event ){
        document.querySelectorAll( `.alternative-${ event.target.id.replace( 'delete-', '' ) }`).forEach( function( el ){ el.parentNode.removeChild( el ); } );
        event.target.insertAdjacentElement( 'beforeBegin', $createElement( 'span', {}, 'This translation will not be replaced.' ) );
        event.target.parentNode.removeChild( event.target );
    }

    $addEvtListener( 'click', '.fire_magic_save_close', wpgpt_fire_save_close );
    function wpgpt_fire_save_close( event ){
        if ( localStorage.getItem( 'wpgpt_chosen_alternative' ) === null ) {
            console.log( 'Unexpected error, please contact developers and let them know that upon `.fire_magic_save_close` click, localStorage is still empty!' );
            return;
        }
        var chosen_alternative_data = JSON.parse( localStorage.getItem( 'wpgpt_chosen_alternative' ) );
        var chosen_alternative = '';
        if ( chosen_alternative_data.length > 1 ) {
			chosen_alternative_data.forEach( ( alternative, alternative_i ) => {
                chosen_alternative += alternatives_forms[ alternative_i ] + ': ' + alternative + '\n';
            } );
        } else {
            chosen_alternative = chosen_alternative_data[ 0 ];
        }
        var replace_strings = [];
		document.querySelectorAll( '.consistency-table tr td' ).forEach( ( td, td_i ) => {
            if ( td_i % 2 ) {
                replace_strings.push( td.querySelector( '.meta a ') );
            }
        } );
        var replace_strings_length = ( replace_strings.length > wpgpt_safe_limit ) ? wpgpt_safe_limit : replace_strings.length;
        var confirm_msg = replace_strings_length + ' selected strings will be REPLACED with:\n\n' + chosen_alternative + '\n\n';
        confirm_msg += ( ( replace_strings.length > wpgpt_safe_limit ) ? ( 'For safety, only ' + replace_strings_length + ' out of ' + replace_strings.length + ' can be replaced in one go.\n' ) : '' );
        confirm_msg += 'A log of replaced translations will be downloaded. \nAre you sure?';
        if ( confirm( confirm_msg ) ) {
            var replace_strings_urls = '', wpgpt_safe_limit_index = 1;
            replace_strings.forEach( function( el ){
                if ( wpgpt_safe_limit_index > wpgpt_safe_limit ) {
                    return false;
                }
                wpgpt_safe_limit_index++;
                replace_strings_urls += el.href + '\n';
                window.open( `${ el.href }#magicsaveclose_T_WPORG` );
            });
            var original_string = document.querySelector( '#original' ).value;
            var current_date = new Date();
            wpgpt_download( '[' + current_date.toLocaleString( [], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' } ) + '][WPGPT Log][' + replace_strings_length + ' replacements]', 'Date: ' + current_date.toLocaleDateString() + ' at ' + current_date.toLocaleTimeString() + '\nOriginal: ' + original_string + '\nReplaced with: `' + chosen_alternative + '`\n' + replace_strings_length + ' replaced translations:\n' + replace_strings_urls );
            var bulk_replace =  document.querySelector( '.fire_magic_save_close' );
            bulk_replace.removeEventListener( 'click', wpgpt_fire_save_close );
            bulk_replace.addEventListener( 'click', function(){ location.reload(); } );
            bulk_replace.textContent = 'Reload page';
        } else { alert( 'Phew! Ok!' ); }
	}

    $addEvtListener( 'click', '.fire_magic_reject_close', wpgpt_fire_reject_close );
    function wpgpt_fire_reject_close( event ){
        var reject_strings = [];
		document.querySelectorAll( '.consistency-table tr td' ).forEach( ( td, td_i ) => {
            if ( td_i % 2 ) {
                reject_strings.push( td.querySelector( '.meta a ') );
            }
        } );
        var reject_strings_length = ( reject_strings.length > wpgpt_safe_limit ) ? wpgpt_safe_limit : reject_strings.length;
        var confirm_msg = reject_strings_length + ' strings will be REJECTED! \n\n';
        confirm_msg += ( (  reject_strings.length > wpgpt_safe_limit ) ? ( 'For safety, only ' + reject_strings_length + ' out of ' + reject_strings.length + ' strings can be rejected in one go.\n' ) : '' );
        confirm_msg += 'A log of rejected translations will be downloaded. \nAre you sure?';
        if ( confirm( confirm_msg ) ) {
            var reject_strings_urls = '', wpgpt_safe_limit_index = 1;
            reject_strings.forEach( function( el ){
                if ( wpgpt_safe_limit_index > wpgpt_safe_limit ) {
                    return false;
                }
                wpgpt_safe_limit_index++;
                reject_strings_urls += el.href + '\n';
                window.open( `${ el.href }#magicrejectclose_T_WPORG` );
            });
        var original_string = document.querySelector( '#original' ).value;
        var current_date = new Date();
        wpgpt_download( '[' + current_date.toLocaleString( [], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' } ) + '][WPGPT Log][' + reject_strings_length + ' rejections]', 'Date: ' + current_date.toLocaleDateString() + ' at ' + current_date.toLocaleTimeString() + '\nOriginal: ' + original_string + '\n' + reject_strings_length + ' rejected translations:\n' + reject_strings_urls );
        } else { alert( 'Phew! I thought so!' ); }
    }

    function wpgpt_get_alternative( alternative_url, alternative_id, alternative_element, is_last ) {
        fetch( alternative_url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
          .then( alternative_response => alternative_response.text() )
          .then( alternative_response => {
            var alternative_parser = new DOMParser();
            var alternative_page = alternative_parser.parseFromString( alternative_response , 'text/html' );
            var textareas = alternative_page.querySelectorAll( '.translation-wrapper .textareas' );
            alternatives_forms = [];
            alternative_page.querySelectorAll( '.translation-form-list .translation-form-list__tab' ).forEach( function( el ){ alternatives_forms.push( el.textContent.trim() ); } );
            var this_alternative = [];
            textareas.forEach( function( el ) {
                this_alternative [ parseInt( el.dataset.pluralIndex ) ] =  el.querySelector( 'textarea' ).value;
            });
            alternatives_data[ alternative_id ] = this_alternative;

			var plurals = document.createElement( 'div' );
			var space_span = $createElement( 'span', { 'class': 'space' }, ' ' );

			this_alternative.forEach( ( form, form_i ) => {
				if ( form_i === 0 ) {
					return;
				}
				var plurals_item = document.createElement( 'div' );
				var alternative_as_words = form.split( ' ' );
				alternative_as_words.forEach( ( word, word_i ) => {
					plurals_item.appendChild( document.createTextNode( word	) );
					if ( word_i < alternative_as_words.length - 1 ) {
						plurals_item.append( space_span.cloneNode( true ) );
					}
				} );
				plurals_item.prepend( $createElement( 'span', { 'class': 'plural_form' }, `${ alternatives_forms[ form_i ] }:` ) );
                plurals.append( plurals_item );
            } );

            if ( this_alternative.length !== 1 ) {
				document.querySelector( '.translations-unique' ).classList.add( 'plural-unique' );
                alternative_element.closest( 'li' ).insertAdjacentElement( 'afterBegin', $createElement( 'span', { 'class': 'plural_form' }, `${ alternatives_forms[ 0 ] }:`));
                alternative_element.insertAdjacentElement( 'afterEnd', plurals );
            }

            if ( is_last ) {
			   var bulk_instructions = $createElement( 'div', { 'class': 'bulk-instructions' }, 'To bulk replace translations: ' );
			   var bulk_instructions_ol = document.createElement( 'ol' );
			   bulk_instructions_ol.append( 
				   $createElement( 'li', {}, 'Set a translation to replace the others with.' ),
				   $createElement( 'li', {}, 'Choose translations that you don\'t want to be replaced.' ),
				   $createElement( 'li', {}, 'Click "Bulk replace & Save".' ),
			   );
			   bulk_instructions.append( bulk_instructions_ol );
			   $addElement( '#translations-overview p', 'afterbegin', bulk_instructions );

			   document.querySelector( '#wpgpt_loading' ).style = 'display: none';
			   var view_unique = document.querySelector( '.translations-unique' );
			   if ( view_unique ) {
				   view_unique.classList.remove( 'hidden' );
			   }
            }
          } )
          .catch( error => console.log( error ) );
    }

    function wpgpt_download( filename, text) {
        var element = document.createElement( 'a' );
        element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( text ) );
        element.setAttribute( 'download', filename );
        element.style.display = 'none';
        document.body.appendChild( element );
        element.click();
        document.body.removeChild( element );
    }
}

function setLS( name, value ) {
  localStorage.setItem( name, value );
}

function getLS( name ) {
  return localStorage.getItem( name );
}

// Functions to replace jQuery library.
function $createElement( tagName = 'div', attributes = {}, textContent = '' ) {
	var element = document.createElement( tagName );
	for ( var attribute in attributes ) {
	  if ( attributes.hasOwnProperty( attribute ) ) {
		element.setAttribute( attribute, attributes[ attribute ] );
	  }
	}
	element.textContent = textContent;
	return element;
}

function $addElement( target_selector, el_position, new_element ){
	var el = document.querySelector( target_selector );
	if ( el !== null ) {
		el.insertAdjacentElement( el_position , new_element );
	}
}

function $addElements( target_selector, el_position, new_element ) {
	document.querySelectorAll( target_selector ).forEach( function( el ){
	  el.insertAdjacentElement( el_position , new_element.cloneNode( true ) );
	} );
}

function $addEvtListener( event_name, target_selector, function_to_call ) {
	document.querySelectorAll( target_selector ).forEach( function ( el ){
		el.addEventListener( event_name, function_to_call );
	} );
}

function $toggleEl( target_selector, el_class ) {
	document.querySelectorAll( target_selector ).forEach( function( el ){
		el.classList.toggle( el_class );
	} );
}

function $showEl( target_selector ) {
	document.querySelectorAll( target_selector ).forEach( function( el ){
		el.style.display = 'inline-block';
	} );
}

function $hideEl( target_selector ) {
	document.querySelectorAll( target_selector ).forEach( function( el ){
		el.style.display = 'none';
	} );
}

function $setTextContent( target_selector, new_txt ) {
	document.querySelectorAll( target_selector ).forEach( function( el ) {
		el.textContent = new_txt;
	} );
}

// This is not a duplicate.
function $addClickEvt( target_selector, function_to_call, function_parameters = [] ) {
	document.querySelectorAll( target_selector ).forEach( function( el ){
		el.onclick = function() {
			if ( function_parameters.length )
				function_to_call( ...function_parameters );
			else
				function_to_call();
		};
	} );
}
// This is not a duplicate.
function $scrollTo( target_selector, scroll_behavior = 'auto', vertical_align = 'start', horizontal_align = 'nearest' ) {
	var el = document.querySelector( target_selector );
	el.scrollIntoView( { behavior: scroll_behavior, block: vertical_align, inline: horizontal_align } );
}
