var _wpgpt_settings = { 'search' : 'enabled' };
//	_wpgpt_settings is a known/accepted redundancy for TM script that runs in the same environment.
_wpgpt_settings = ( getLS( 'wpgpt-user-settings' ) !== null ) ? JSON.parse( getLS( 'wpgpt-user-settings' ) ) : _wpgpt_settings;

consistency_tools();

function consistency_tools() {
	if ( _wpgpt_settings.search !== 'enabled' ) {
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

	function wpgpt_page( page_type ) {
		$scrollTo( '.breadcrumb', 'smooth', 'start' );
		var wpgpt_page_notice = $createElement( 'p', { 'class': 'wpgpt-results-notice' }, 'When you\'re done on these result pages click ' );
		wpgpt_page_notice.append( $createElement( 'span', {}, 'Close all' ), document.createTextNode(' in the main tab to close them all.' ) );

		if ( page_type == 'result' ){
			$addElement( '.filter-toolbar', 'beforebegin', wpgpt_page_notice );
		} else {
			$addElement( '.consistency-form', 'beforebegin', wpgpt_page_notice );
			$toggleEl( '.translations-unique', 'hidden' );
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
			$createElement( 'button', { 'class': 'wpgpt-search-close-tabs', 'style': 'display:none;' }, 'Close all tabs' )
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
			} );
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
			for ( const [ s_key, s_value ] of Object.entries( search_url ) ) {
				if ( wpgpt_search_settings[ s_key ] ) {
					tabs[ s_key ] = window.open( s_value, '_blank' );
					tabs_state[ s_key ] = 'opened';
					any_tab = 1;
				}
			}
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
		for ( const [ tab_key ] of Object.entries( tabs_state ) ) {
			if ( ( tabs_state[ tab_key ] === 'opened' ) && ( tabs_group == 'all' || ( tab_key !== 'gt' && tab_key !== 'references' && tab_key !== 'panel_links'  ) ) ) {
				tabs[ tab_key ].close();
				tabs_state[ tab_key ] = 'closed';
			}
		}
		$hideEl( '.wpgpt-search-close-tabs' );
	}

	function wpgpt_do_search_options( event ) {
		wpgpt_search_settings[ event.target.dataset.searchproject ] = event.target.checked;
		var el = document.querySelectorAll( '.wpgpt-search-option' );
		for ( var i = 0; i < el.length; i++ )
			el[ i ].checked = wpgpt_search_settings[ el[ i ].dataset.searchproject ];
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

	function wpgpt_do_consistency( event ) {
		event.target.textContent = 'Loading...';
		var consistency_url = event.target.closest( '.editor-panel' ).querySelectorAll( '.button-menu__dropdown li a' )[ 2 ].href;

		fetch( consistency_url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
		  .then( consistency_response => consistency_response.text() )
		  .then( consistency_response => {
			var consistency_parser = new DOMParser();
			var consistency_page = consistency_parser.parseFromString( consistency_response , 'text/html' );
			var consistency_translations = consistency_page.querySelectorAll( '.consistency-table tbody th strong' );
			var translations_count, unique_translation_count;

			if ( consistency_translations.length == 1 ) {
			  unique_translation_count = consistency_page.querySelectorAll( 'tr' ).length - 2;
			  unique_translation_count = ' ('+ unique_translation_count + ' time' + ( ( unique_translation_count > 1 ) ? 's' : '' ) + ')';
			} else {
				translations_count = consistency_page.querySelectorAll( '.translations-unique small' );
			}

			var wpgpt_consistency_suggestions;

			if ( consistency_translations.length ) {
			  var wpgpt_consistency_item,
			  wpgpt_consistency_item_div,
			  wpgpt_consistency_item_translation,
			  wpgpt_consistency_item_index,
			  wpgpt_consistency_item_count,
			  wpgpt_consistency_item_raw,
			  wpgpt_consistency_item_button;

			  wpgpt_consistency_suggestions = $createElement( 'ul', { class: 'suggestions-list' } );

			  for ( var i = 0; i < consistency_translations.length; i++ ) {
				wpgpt_consistency_item = document.createElement( 'li' );
				wpgpt_consistency_item_div = $createElement( 'div', { 'class': 'translation-suggestion with-tooltip', 'role': 'button', 'aria-pressed': 'false', 'aria-label': 'Copy translation', 'tabindex': '0' } );
				wpgpt_consistency_item_translation = $createElement( 'span', { 'class': 'translation-suggestion__translation' }, consistency_translations[ i ].textContent );
				wpgpt_consistency_item_index = $createElement( 'span', { 'class': 'translation-suggestion__translation index' }, ( i + 1 ) + ': ' );
				wpgpt_consistency_item_count = $createElement( 'span', { 'class': 'consistency-count' }, ( consistency_translations.length == 1 ) ? unique_translation_count : translations_count[ i ].textContent );
				wpgpt_consistency_item_raw = $createElement( 'span', { 'class': 'translation-suggestion__translation-raw', 'aria-hidden': 'true' }, consistency_translations[ i ].textContent );
				wpgpt_consistency_item_button = $createElement( 'button', { 'type': 'button', 'class': 'copy-suggestion' }, 'Copy' );
				wpgpt_consistency_item_translation.prepend( wpgpt_consistency_item_index );
				wpgpt_consistency_item_translation.append( wpgpt_consistency_item_count );
				wpgpt_consistency_item_div.append( wpgpt_consistency_item_translation, wpgpt_consistency_item_raw, wpgpt_consistency_item_button );
				wpgpt_consistency_item.append( wpgpt_consistency_item_div );
				wpgpt_consistency_suggestions.append( wpgpt_consistency_item );
			  }
			} else {
				wpgpt_consistency_suggestions = 'No suggestions.';
			}
			event.target.before ( wpgpt_consistency_suggestions );
			event.target.parentNode.removeChild( event.target );
		  } )
		  .catch( error => console.log( error ) );
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
				switch( event.which ) {
					case 67: wpgpt_do_shortcut( '.wpgpt_get_consistency' ); // Alt + C  - Show consistency suggestions
					break;

					case 49: wpgpt_do_shortcut( '.suggestions__translation-consistency .copy-suggestion', 0 ); // Alt + 1 - Copy first consistency suggestion
					break;

					case 50: wpgpt_do_shortcut( '.suggestions__translation-consistency .copy-suggestion', 1 ); // Alt + 2 - Copy second consistency suggestion
					break;

					case 51: wpgpt_do_shortcut( '.suggestions__translation-consistency .copy-suggestion', 2 ); // Alt + 3 - Copy third consistency suggestion
					break;

					case 71: wpgpt_do_shortcut( '.wpgpt_get_gt' ); // Alt + G - Google Translate string
					break;

					case 80: wpgpt_do_shortcut( '.wpgpt-search-word', 0, false ); // Alt + P - Focus on Search ( since 1.3 for Firefox users )
					break;

					case 83: wpgpt_do_shortcut( '.wpgpt-search-word', 0, false ); // Alt + S - Focus on Search
					break;
				}
			}
		}, false );
	}

	function wpgpt_do_shortcut( target_selector, target_eq = 0, click_evt = true ) {
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
		timezone_offset = 'UTC' + ( ( timezone_offset > 0 ) ? '+' : '' ) + timezone_offset;
		document.querySelectorAll( '.editor-panel__right .meta > dl > dd' ).forEach( function( el ){
			if ( el.textContent.includes( 'UTC' ) ){
				var new_date = new Date( el.textContent );
				el.innerHTML= new_date.toLocaleDateString() + ' ' + new_date.toLocaleTimeString() + ' <small>' + timezone_offset +'</small>';
			}
		} );
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
