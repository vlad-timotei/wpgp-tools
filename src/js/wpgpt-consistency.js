var user_env_settings = { 'search' : 'enabled' };
//	user_env_settings is a known/accepted redundancy for TM script that runs in the same environment.
user_env_settings = ( getLS( 'wpgpt-user-settings' ) !== null ) ? JSON.parse( getLS( 'wpgpt-user-settings' ) ) : user_env_settings;
consistency_tools();

function consistency_tools() {
	if ( user_env_settings.search != 'enabled' ) {
		return;
	}

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
	var search_url = {
		'consistency': '',
		'wp': '',
		'plugin': '',
		'this_project': ''
		};
	var user_search_settings = {
		'this_project' : true,
		'wp' : true,
		'consistency' : true,
		'plugin' : false,
		'plugin_slug' : '',
		'copy_me' : false
	};

	var gp_gt_locales = {
		'bel' : 'be',
		'zh-cn' : 'zh-CN',
		'zh-tw' : 'zh-TW',
		'hat' : 'ht',
		'hau' : 'ha',
		'he' : 'iw',
		'ibo' : 'ig',
		'jv' : 'jw',
		'kin' : 'rw',
		'kmr' : 'ku',
		'ckb' : 'ku',
		'kir' : 'ky',
		'mlt' : 'mt',
		'mri' : 'mi',
		'ary' : 'ar',
		'mya' : 'my',
		'nb' : 'no',
		'nn' : 'no',
		'ory' : 'or',
		'sna' : 'sn',
		'snd' : 'sd',
		'azb' : 'az',
		'tuk' : 'tk',
		'xho' : 'xh',
		'yor' : 'yo',
		'zul' : 'zu'
	};

	var notice_time;
	const protocol = 'https://';
	const hostname = window.location.hostname;
	const pathname = window.location.pathname;
	const resultpage = '&resultpage';
	const historypage = '&historypage';

	var project_url = pathname.split( '/' );
	var short_locale = project_url[ project_url.length - 3 ];
	const current_locale = short_locale + '/' + project_url[ project_url.length - 2 ];

	if ( short_locale in gp_gt_locales ) {
		short_locale = gp_gt_locales[ short_locale ];
	}
	else {
		short_locale = short_locale.split( '-' );
		short_locale = short_locale[ 0 ];
	}

	let is_result_page = document.location.href.includes( 'resultpage' );

	if ( getLS( 'wpgpt-search' ) !== null ) {
		user_search_settings = JSON.parse( getLS( 'wpgpt-search' ) );
	}

	let search_html_output = '' +
    '<form class="wpgpt-search" method="post" autocomplete="on">' +
	'<span class="error-notice"></span>' +
	'<input type="text" class="wpgpt-search-word" name="wpgpt_search_word" placeholder="Search for..." >' +
	'<input type="submit" class="wpgpt-search-action" value="Search"><br >' +
	'<label class="noselect"><input type="checkbox" data-searchproject="this_project" class="wpgpt-search-option"> this project </label><br>' +
	'<label class="noselect"><input type="checkbox" data-searchproject="wp" class="wpgpt-search-option"> WordPress </label><br>' +
	'<label class="noselect"><input type="checkbox" data-searchproject="plugin" class="wpgpt-search-option wpgpt-search-plugin-option"> another plugin </label>' +
	'<input type="text" class="wpgpt-search-plugin-slug hidden" name="wpgpt_search_plugin_slug" placeholder=" enter slug" size="15" >' +
	'<br><label class="noselect"><input type="checkbox" data-searchproject="consistency" class="wpgpt-search-option"> consistency tool</label>' +
	'<br></form><button type="button" class="wpgpt-search-close-tabs" style="display:none;">Close all tabs</button><br>';

	let actions_html_output = '' +
	'<button type="button" class="wpgpt_quicklink_copy with-tooltip' +
	( ( user_search_settings.copy_me ) ? ' active' : '' ) +
	'" aria-label="Click this and another to copy">' +
	'<span class="screen-reader-text">Click this and another to copy</span><span aria-hidden="true" class="dashicons dashicons-clipboard"></span>' +
	'</button><span aria-hidden="true" class="wpgpt_quicklink_plus dashicons ' +
	( ( user_search_settings.copy_me ) ? ' dashicons-plus">' : '"><span class="separator"></span>' ) +
	'</span><button type="button" class="wpgpt_quicklink wpgpt_quicklink_permalink with-tooltip" aria-label="Permalink to translation">' +
	'<span class="screen-reader-text">Permalink to translation</span><span aria-hidden="true" class="dashicons dashicons-admin-links"></span></button>' +
	'<button type="button" class="wpgpt_quicklink wpgpt_quicklink_history with-tooltip" aria-label="Translation History">' +
	'<span class="screen-reader-text">Translation History</span><span aria-hidden="true" class="dashicons dashicons-backup"></span></button>' +
	'<button type="button" class="wpgpt_quicklink wpgpt_quicklink_consistency with-tooltip" aria-label="View original in consistency tool">' +
	'<span class="screen-reader-text">View original in consistency tool</span><span aria-hidden="true" class="dashicons dashicons-list-view"></span></button>';

    const result_page_html_output = '<p class="wpgpt-results-notice">When you\'re done on these result pages click <span>Close all</span> in the main tab to close them all.';

	let consistency_suggestions_html_output = '<summary>Suggestions from Consistency</summary><span class="suggestions-list"><button type="button" class="wpgpt-get-consistency">View Consistency suggestions</button></span>';

	elements_init();

	function elements_init() {
		if ( is_result_page ) {
			add_el( 'single', '.filter-toolbar', 'beforebegin', 'p', 'wpgpt-results-notice', result_page_html_output );
			add_el( 'single', '.consistency-form', 'beforebegin', 'p', 'wpgpt-results-notice', result_page_html_output );
			scroll_to( '.breadcrumb', 'smooth', 'start' );
			toggle_el( '.translations-unique', 'hidden' );
		}
		else {
			if ( document.querySelector( '#translations' ) == null )
				return;

			add_el( 'multiple', '.editor-panel .editor-panel__right .panel-content', 'beforeend', 'div', '', search_html_output );

			var search_option_el = document.querySelectorAll( '.wpgpt-search-option' );
			for ( var i = 0; i < search_option_el.length; i++ ) {
				search_option_el[ i ].checked = user_search_settings[ search_option_el[ i ].dataset.searchproject ];
			}

			if ( user_search_settings.plugin ) {
				toggle_el( '.wpgpt-search-plugin-slug', 'hidden' );
			}

			fill_plugin_slug();
			add_evt_listener( 'submit', '.wpgpt-search', submit_form );
			add_click_evt( '.wpgpt-search-close-tabs', close_tabs, [ 'all' ] );
			add_click_evt( '.wpgpt-search-plugin-option', toggle_el, [ '.wpgpt-search-plugin-slug', 'hidden' ] );
			add_evt_listener( 'click', '.wpgpt-search-option', change_search_options );
		}
		// QuickLinks
		if ( document.querySelector( '.gd_quicklink' ) == null ) { // GlotDict will add QuickLinks feature in a future version.
			add_el( 'multiple', '.editor-panel__right .panel-header', 'beforeend', 'span', 'wpgpt-quicklinks', actions_html_output );
			var menu_links, editor_el, menu_el;
			editor_el = document.querySelectorAll( '.editor' );
			for ( var i = 0; i < editor_el.length; i++ ) {
				menu_links = [];
				menu_el = editor_el[ i ].querySelectorAll( '.button-menu__dropdown li a' );
				for ( var j = 0; j < menu_el.length; j++ ) {
					menu_links[ j ] = menu_el[ j ].href;
				}
				menu_el[ 1 ].href = menu_links[ 1 ] + historypage;
				editor_el[ i ].querySelector( '.wpgpt_quicklink_permalink' ).dataset.quicklink = menu_links[ 0 ];
				editor_el[ i ].querySelector( '.wpgpt_quicklink_history' ).dataset.quicklink =  menu_links[ 1 ] + historypage;
				editor_el[ i ].querySelector( '.wpgpt_quicklink_consistency' ).dataset.quicklink = menu_links[ 2 ] + resultpage;
			}

			add_click_evt( '.wpgpt_quicklink_copy, .wpgpt_quicklink_plus', toggle_copy );
			add_evt_listener( 'click', '.wpgpt_quicklink', do_quick_links );
		}

		// Consistency.
		if ( document.querySelector( '.gd-get-consistency' ) == null ) { // GlotDict will add Get Consistency feature in a future version.
			var wrapper_el = document.querySelectorAll( '.editor-panel__left .suggestions-wrapper' ), consist_element;
			for ( var i = 0; i < wrapper_el.length; i++ ) {
				consist_element = document.createElement( 'details' );
				consist_element.setAttribute( 'open', 'open' );
				consist_element.className = 'wpgpt-consistency suggestions__translation-consistency';
				consist_element.innerHTML = consistency_suggestions_html_output;
				wrapper_el[ i ].insertAdjacentElement( 'beforeend' , consist_element );
			}
			add_evt_listener( 'click', '.wpgpt-get-consistency', get_consistency_suggestions );
		}

		// Google Translate.
		display_gt();
		add_evt_listener( 'click', '.wpgpt-gt', do_gt );

		// Refference.
		add_evt_listener( 'click', '.source-details__references ul li a', do_refferences );

		// Close tabs.
		window.onbeforeunload = function() { close_tabs( 'all' ); };
	}

	function get_consistency_suggestions( event ) {
		const target = event.target;
		const editor_panel = target.closest( '.editor-panel' );
		const new_list_of_suggestions = document.createElement( 'ul' );
		const url = editor_panel.querySelectorAll( '.button-menu__dropdown li a' )[ 2 ].href;
		target.innerHTML = 'Loading...';
		var list_of_suggestions = '';
		const data = fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
			.then( response => response.text() )
			.then( data => {
				var consistency_page = document.implementation.createHTMLDocument();
	            consistency_page.body.innerHTML = data;
				var translations_count = consistency_page.querySelectorAll( '.translations-unique small' ), unique_translation_count;
				if ( ! translations_count.length ) {
					unique_translation_count = consistency_page.querySelectorAll( 'tr' ).length - 2;
					unique_translation_count = '(' + unique_translation_count + ' time' + ( ( unique_translation_count > 1 ) ? 's' : '' ) + ')';
				}
				var translations = consistency_page.querySelectorAll( '.consistency-table tbody th strong' );
				if ( translations.length ) {
					for ( var i = 0; i < translations.length; i++ ) {
						list_of_suggestions += '<li><div class="translation-suggestion with-tooltip" tabindex="0" role="button" aria-pressed="false" aria-label="Copy translation">' +
						'<span class="translation-suggestion__translation"><span class="index">' + ( i + 1 ) + ':</span> ' + translations[ i ].innerHTML +
						' <small>' + ( ( translations_count.length ) ? translations_count[ i ].innerHTML : unique_translation_count ) + '</small></span>' +
						'<span aria-hidden="true" class="translation-suggestion__translation-raw">' + translations[ i ].innerHTML + '</span>' +
						'<button type="button" class="copy-suggestion">Copy</button></div></li>';
					}
				}
				else {
					list_of_suggestions = '<li>Nothing found in the Consistency.</li>';
				}
				new_list_of_suggestions.innerHTML = list_of_suggestions;
				new_list_of_suggestions.className = 'suggestions-list';
				target.insertAdjacentElement( 'beforebegin', new_list_of_suggestions );
				target.parentNode.removeChild( target );
			} )
			.catch( error => console.log( error ) );
	}

	function copyToClipboard( text ) {
		const elem = document.createElement( 'textarea' );
		elem.value = text;
		document.body.appendChild( elem );
		elem.select();
		document.execCommand( 'copy' );
		document.body.removeChild( elem );
	}

	function toggle_copy() {
		var el;
		if ( user_search_settings.copy_me ) {
			user_search_settings.copy_me = false;
			el = document.querySelectorAll( '.wpgpt_quicklink_plus' );
			for ( var i = 0; i < el.length; i++ ) {
				el[ i ].innerHTML = '<span class="separator"></span>';
				el[ i ].classList.remove( 'dashicons-plus' );
			}
			el = document.querySelectorAll( '.wpgpt_quicklink_copy' );
			for ( var i = 0; i < el.length; i++ ) {
				el[ i ].classList.remove( 'active' );
			}
		}
		else {
			user_search_settings.copy_me = true;
			el = document.querySelectorAll( '.wpgpt_quicklink_plus' );
			for ( var i = 0; i < el.length; i++ ) {
				el[ i ].innerHTML = '';
				el[ i ].classList.add( 'dashicons-plus' );
			}
			el = document.querySelectorAll( '.wpgpt_quicklink_copy' );
			for ( var i = 0; i < el.length; i++ ) {
				el[ i ].classList.add( 'active' );
			}
		}
		setLS( 'wpgpt-search', JSON.stringify( user_search_settings ) );
	}

	function open_tab( tab_key, tab_uri ) {
		if ( tabs_state[ tab_key ] == 'opened' ) {
			tabs[ tab_key ].close();
		}
		tabs[ tab_key ] = window.open( tab_uri, '_blank' );
		tabs_state[ tab_key ] = 'opened';
	}

	function fill_plugin_slug() {
		if ( user_search_settings.plugin_slug == undefined )
			return;
		var el = document.querySelectorAll( '.wpgpt-search-plugin-slug' );
		for ( var i = 0; i < el.length; i++ ) {
			el[ i ].value = user_search_settings.plugin_slug;
		}
	}

	function submit_form( event ) {
		event.preventDefault();
		search_in_projects( event.target.elements.wpgpt_search_word.value, event.target.elements.wpgpt_search_plugin_slug.value );
	}

	function change_search_options( event ) {
		user_search_settings[ event.target.dataset.searchproject ] = event.target.checked;
		var el = document.querySelectorAll( '.wpgpt-search-option' );
		for ( var i = 0; i < el.length; i++ )
			el[ i ].checked = user_search_settings[ el[ i ].dataset.searchproject ];
		setLS( 'wpgpt-search', JSON.stringify( user_search_settings ) );
	}

	function do_quick_links( event ) {
		var quicklink = event.currentTarget.dataset.quicklink;
		if ( user_search_settings.copy_me ) {
			const btn_target = event.currentTarget;
			const current_aria_label = btn_target.getAttribute( 'aria-label' );
			copyToClipboard( quicklink );
			btn_target.setAttribute( 'aria-label', 'Copied!' );
			setTimeout( function() { btn_target.setAttribute( 'aria-label', current_aria_label ); }, 2000 );
		}
		else {
			open_tab( 'panel_links', quicklink );
			show_el( '.wpgpt-search-close-tabs' );
		}
	}

	function do_gt( event ) {
		open_tab( 'gt', event.target.dataset.gtstring );
		show_el( '.wpgpt-search-close-tabs' );
	}

	function do_refferences( event ) {
		event.preventDefault();
		open_tab( 'references', event.currentTarget.href );
	}

	function search_in_projects( searching_for, also_searching_in_plugin ) {
		var any_tab = 0;
		const filters = '?filters[term]=' + searching_for + '&filters[status]=current';

		search_url.this_project = encodeURI( protocol + hostname + pathname + filters + resultpage );
		search_url.wp = encodeURI( protocol + hostname + '/projects/wp/dev/' + current_locale + filters + resultpage );
		search_url.consistency = encodeURI( protocol + hostname + '/consistency/?search=' + searching_for + '&set=' + current_locale + resultpage);

		if ( user_search_settings.plugin ) {
		user_search_settings.plugin_slug = also_searching_in_plugin;
		setLS( 'wpgpt-search', JSON.stringify( user_search_settings ) );
		fill_plugin_slug();
		search_url.plugin = encodeURI( protocol + hostname + '/projects/wp-plugins/' + also_searching_in_plugin + '/dev/' + current_locale + filters + resultpage );
		}

		if ( searching_for != '' && ( also_searching_in_plugin != '' || !user_search_settings.plugin ) ) {
			close_tabs( 'searching' );
			for ( const [ s_key, s_value ] of Object.entries( search_url ) ) {
				if ( user_search_settings[ s_key ] ) {
					tabs[ s_key ] = window.open( s_value, '_blank' );
					tabs_state[ s_key ] = 'opened';
					any_tab = 1;
				}
			}
			if ( any_tab ) {
				show_el( '.wpgpt-search-close-tabs' );
			}
			else {
				display_notice( 'Choose a project!' );
			}
		} else {
			display_notice( 'String/slug cannot be empty!' );
		}
	}

	function display_notice( msg ) {
		setHTML( '.error-notice', msg );
		clearTimeout( notice_time );
		notice_time = setTimeout(function() { setHTML( '.error-notice', '' ); }, 3000);
	}

	function display_gt() {
		var orig_txt, suggestion_wrapper, gt_html, gt_url, new_element;
		var editor_el = document.querySelectorAll( '.editor' );
		for ( var i = 0; i < editor_el.length; i++ ) {
	        suggestion_wrapper = editor_el[ i ].querySelector( '.editor-panel__left .suggestions-wrapper' );
			if ( suggestion_wrapper == null )
				return;
			orig_txt =  editor_el[ i ].querySelector( '.source-string__singular span.original' ).textContent;
			orig_txt = encodeURIComponent( orig_txt );
			gt_url = protocol + 'translate.google.com/?sl=en&tl=' + short_locale + '&text=' + orig_txt + '&op=translate';
			gt_url = gt_url.replaceAll( '"','&#34;' );
			gt_html = 	'<summary>Suggestion from Google Translate</summary><span class="suggestions-list"><button type="button" class="wpgpt-gt" data-gtstring="' +
						gt_url + '">View Google Translate suggestion</button></span>';
			new_element = document.createElement( 'details' );
			new_element.className = 'suggestions__translation-gt';
			new_element.setAttribute( 'open', 'open' );
			new_element.innerHTML = gt_html;
			suggestion_wrapper.insertAdjacentElement( 'beforeend' , new_element );
		}
	}

	function close_tabs( tabs_group ) {
		for ( const [ tab_key ] of Object.entries( tabs_state ) ) {
			if ( ( tabs_state[ tab_key ] === 'opened' ) && ( tabs_group == 'all' || ( tab_key !== 'gt' && tab_key !== 'references' && tab_key !== 'panel_links'  ) ) ) {
				tabs[ tab_key ].close();
				tabs_state[ tab_key ] = 'closed';
			}
		}

		hide_el( '.wpgpt-search-close-tabs' );
	}

	document.addEventListener( 'keydown', ( event ) => {
		  if ( event.altKey ) {
			switch( event.which ) {
				case 67: do_shortcut( '.wpgpt-get-consistency' ); // Alt + C  - Show consistency suggestions
				break;

				case 49: do_shortcut( '.suggestions__translation-consistency .copy-suggestion', 0 ); // Alt + 1 - Copy first consistency suggestion
				break;

				case 50: do_shortcut( '.suggestions__translation-consistency .copy-suggestion', 1 ); // Alt + 2 - Copy second consistency suggestion
				break;

				case 51: do_shortcut( '.suggestions__translation-consistency .copy-suggestion', 2 ); // Alt + 3 - Copy third consistency suggestion
				break;

				case 71: do_shortcut( '.wpgpt-gt' ); // Alt + G - Google Translate string
				break;

				case 80: do_shortcut( '.wpgpt-search-word', 0, false ); // Alt + P - Focus on Search ( since 1.3 for Firefox users )
				break;

				case 83: do_shortcut( '.wpgpt-search-word', 0, false ); // Alt + S - Focus on Search
				break;
			}
		}
	}, false );

	function do_shortcut( target_selector, target_eq = 0, click_evt = true ) {
		var el = document.querySelectorAll( '.editor' );
		for ( var i = 0; i < el.length; i++ ) {
			if ( el[ i ].style.display == 'table-row' ) {
				if ( click_evt ) {
					el[ i ].querySelectorAll( target_selector )[ target_eq ].click();
					return;
				}
				else {
					el[ i ].querySelectorAll( target_selector )[ target_eq ].focus();
					return;
				}
			}
		}
	}
}

function setLS( name, value ) {
  localStorage.setItem( name, value );
}

function getLS( name ) {
  return localStorage.getItem( name );
}

// Functions to replace jQuery library.
function add_el( times, target_selector, el_position, el_type, el_class, el_html ) {
	if ( times == 'multiple' ) {
		var el = document.querySelectorAll( target_selector ),
			new_element;
		for ( var i = 0; i < el.length; i++ ) {
			new_element = document.createElement( el_type );
			new_element.innerHTML = el_html;
			if ( el_class !== '' ) {
				new_element.className = el_class;
			}
			el[ i ].insertAdjacentElement( el_position , new_element );
		}
	}
	else {
		var el = document.querySelector( target_selector );
		if ( el !== null ) {
			var new_element = document.createElement( el_type );
			new_element.innerHTML = el_html;
			if ( el_class !== '' ) {
				new_element.className = el_class;
			}
			el.insertAdjacentElement( el_position , new_element );
		}
	}
}

function scroll_to( target_selector, scroll_behavior = 'auto', vertical_align = 'start', horizontal_align = 'nearest' ) {
	var el = document.querySelector( target_selector );
	el.scrollIntoView( { behavior: scroll_behavior, block: vertical_align, inline: horizontal_align } );
}

function toggle_el( target_selector, el_class ) {
	var el = document.querySelectorAll( target_selector );
	for ( var i = 0; i < el.length; i++ ) {
		el[ i ].classList.toggle( el_class );
	}
}

function show_el( target_selector ) {
	var el = document.querySelectorAll( target_selector );
	for ( var i = 0; i < el.length; i++ )
		el[ i ].style.display = 'inline-block';
}

function hide_el( target_selector ) {
	var el = document.querySelectorAll( target_selector );
	for ( var i = 0; i < el.length; i++ )
		el[ i ].style.display = 'none';
}

function add_evt_listener( event_name, target_selector, function_to_call ) {
	var el = document.querySelectorAll( target_selector );
	for ( var i = 0; i < el.length; i++ ) {
		el[ i ].addEventListener( event_name, function_to_call );
	}
}

function add_click_evt( target_selector, function_to_call, function_parameters = [] ) {
	var el = document.querySelectorAll( target_selector );
	for ( var i = 0; i < el.length; i++ ) {
		el[ i ].onclick = function() {
			if ( function_parameters.length )
				function_to_call( ...function_parameters );
			else
				function_to_call();
		};
	}
}

function setHTML( target_selector, new_html ) {
	var el = document.querySelectorAll( target_selector );
	for ( var i = 0; i < el.length; i++ )
		el[ i ].innerHTML = new_html;
}