let _wpgpt_settings = { 'search': 'enabled', 'bulk_consistency': 'disabled' };
//	_wpgpt_settings is a known/accepted redundancy for TM script that runs in the same environment.
_wpgpt_settings = ( localStorage.getItem( 'wpgpt-user-settings' ) !== null ) ? JSON.parse( localStorage.getItem( 'wpgpt-user-settings' ) ) : _wpgpt_settings;
const wpgpt_safe_limit = 25;

if ( 'enabled' === _wpgpt_settings.search ) {
	consistency_tools();
}

const consistency_alternatives = [];

if ( 'enabled' === _wpgpt_settings.bulk_consistency ) {
	wpgpt_bulk_consistency();
}

function consistency_tools() {
	const tabs = {};
	tabs.plugin = [];
	const tabs_state = {
		'consistency':  'closed',
		'wp':           'closed',
		'plugin':       'closed',
		'this_project': 'closed',
		'gt':           'closed',
		'references':   'closed',
		'panel_links':  'closed',
	};

	const search_url = {};
	search_url.plugin = [];

	let wpgpt_search_settings = {
		'this_project': true,
		'wp':           true,
		'consistency':  true,
		'plugin':       false,
		'plugin_slug':  '',
		'copy_me':      false,
	};
	wpgpt_search_settings = ( localStorage.getItem( 'wpgpt-search' ) !== null ) ? JSON.parse( localStorage.getItem( 'wpgpt-search' ) ) : wpgpt_search_settings;

	let notice_time;

	const hostname = window.location.hostname;
	const pathname = window.location.pathname;
	const project_url = pathname.split( '/' );
	let short_locale = project_url[ project_url.length - 3 ];
	const current_locale = `${short_locale}/${project_url[ project_url.length - 2 ]}`;

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
		$wpgpt_scrollTo( '.breadcrumb', 'smooth', 'start' );
		const wpgpt_page_notice = $wpgpt_createElement( 'p', { 'class': 'wpgpt-results-notice' }, 'Search result page | Click ' );
		wpgpt_page_notice.append( $wpgpt_createElement( 'span', {}, 'Close all tabs' ), document.createTextNode( ' in the main tab to close.' ) );

		if ( 'result' === page_type ) {
			$wpgpt_addElement( '.filter-toolbar', 'beforebegin', wpgpt_page_notice );
		} else {
			$wpgpt_addElement( '.consistency-form', 'beforebegin', wpgpt_page_notice );
			const view_unique = document.querySelector( '.translations-unique' );
			if ( view_unique && 'disabled' === _wpgpt_settings.bulk_consistency ) {
				view_unique.classList.remove( 'hidden' );
			}
		}
	}

	function wpgpt_search() {
		const wpgpt_search_output = $wpgpt_createElement( 'form', { 'class': 'wpgpt-search' } );
		const wpgpt_search_label_project = $wpgpt_createElement( 'label', {}, ' this project' );
		wpgpt_search_label_project.prepend(
			$wpgpt_createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option', 'data-searchproject': 'this_project' } ),
		);
		const wpgpt_search_label_WP = $wpgpt_createElement( 'label', {}, ' WordPress' );
		wpgpt_search_label_WP.prepend(
			$wpgpt_createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option ', 'data-searchproject': 'wp' } ),
		);
		const wpgpt_search_label_plugin = $wpgpt_createElement( 'label', { 'class': 'wpgpt-search-plugin-label' }, ' other plugins' );
		wpgpt_search_label_plugin.prepend(
			$wpgpt_createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option wpgpt-search-plugin-option', 'data-searchproject': 'plugin' } ),
		);
		const wpgpt_search_label_consistency = $wpgpt_createElement( 'label', {}, ' consistency tool' );
		wpgpt_search_label_consistency.prepend(
			$wpgpt_createElement( 'input', { 'type': 'checkbox', 'class': 'wpgpt-search-option', 'data-searchproject': 'consistency' } ),
		);

		wpgpt_search_output.append(
			$wpgpt_createElement( 'span', { 'class': 'error-notice' } ),
			$wpgpt_createElement( 'input', { 'class': 'wpgpt-search-word', 'name': 'wpgpt_search_word', 'placeholder': 'Search for...', 'type': 'text' } ),
			$wpgpt_createElement( 'input', { 'class': 'wpgpt-search-action', 'value': 'Search', 'type': 'submit' } ),
			wpgpt_search_label_project,
			wpgpt_search_label_WP,
			wpgpt_search_label_plugin,
			$wpgpt_createElement( 'input', { 'class': 'wpgpt-search-plugin-slug hidden', 'name': 'wpgpt_search_plugin_slug', 'placeholder': 'slug1 slug2 slug3', 'type': 'text', 'size': '15' } ),
			wpgpt_search_label_consistency,
			$wpgpt_createElement( 'button', { 'class': 'wpgpt-search-close-tabs', 'style': 'display:none;', 'type': 'button' }, 'Close all tabs' ),
		);

		$wpgpt_addElements( '.editor-panel .editor-panel__right .panel-content', 'beforeend', wpgpt_search_output );

		document.querySelectorAll( '.wpgpt-search-option' ).forEach( ( el ) => {
			el.checked = wpgpt_search_settings[ el.dataset.searchproject ];
		} );

		if ( wpgpt_search_settings.plugin ) {
			$wpgpt_toggleEl( '.wpgpt-search-plugin-slug', 'hidden' );
		}

		if ( wpgpt_search_settings.plugin_slug !== undefined ) {
			document.querySelectorAll( '.wpgpt-search-plugin-slug' ).forEach( ( el ) => {
				el.value = wpgpt_search_settings.plugin_slug;
			} );
		}

		$wpgpt_addEvtListener(
			'submit',
			'.wpgpt-search',
			( event ) => {
				event.preventDefault();
				wpgpt_do_search( event.target.elements.wpgpt_search_word.value, event.target.elements.wpgpt_search_plugin_slug.value );
			},
		);
		$wpgpt_addClickEvt( '.wpgpt-search-close-tabs', wpgpt_close_tabs, [ 'all' ] );
		$wpgpt_addClickEvt( '.wpgpt-search-plugin-option', $wpgpt_toggleEl, [ '.wpgpt-search-plugin-slug', 'hidden' ] );
		$wpgpt_addEvtListener( 'click', '.wpgpt-search-option', wpgpt_do_search_options );
	}

	function wpgpt_do_search( searching_for, also_searching_in_plugins ) {
		let any_tab = 0;
		const filters = `?filters[term]=${searching_for}&filters[status]=current`;

		search_url.this_project = encodeURI( `https://${hostname}${pathname}${filters}&resultpage` );
		search_url.wp = encodeURI( `https://${hostname}/projects/wp/dev/${current_locale}${filters}&resultpage` );
		search_url.consistency = encodeURI( `https://${hostname}/consistency/?search=${searching_for}&set=${current_locale}&consistencypage` );

		if ( wpgpt_search_settings.plugin ) {
			wpgpt_search_settings.plugin_slug = also_searching_in_plugins;
			localStorage.setItem( 'wpgpt-search', JSON.stringify( wpgpt_search_settings ) );
			if ( wpgpt_search_settings.plugin_slug !== 'undefined' ) {
				document.querySelectorAll( '.wpgpt-search-plugin-slug' ).forEach( ( el ) => {
					el.value = wpgpt_search_settings.plugin_slug;
				} );
			}
			also_searching_in_plugins.split( ' ' ).forEach( ( slug ) => {
				if ( slug !== '' ) {
					search_url.plugin[ search_url.plugin.length ] = encodeURI( `https://${hostname}/projects/wp-plugins/${slug}/dev/${current_locale}${filters}&resultpage` );
				}
			} );
		}

		if ( searching_for !== '' && ( also_searching_in_plugins !== '' || ! wpgpt_search_settings.plugin ) ) {
			wpgpt_close_tabs( 'searching' );
			Object.entries( search_url ).forEach( ( url ) => {
				const [ key, value ] = url;
				if ( wpgpt_search_settings[ key ] ) {
					if ( 'plugin' === key ) {
						search_url.plugin.forEach( ( plugin_url ) => {
							tabs.plugin[ tabs.plugin.length ] = window.open( plugin_url, '_blank' );
						} );
					} else {
						tabs[ key ] = window.open( value, '_blank' );
					}
					tabs_state[ key ] = 'opened';
					any_tab = 1;
				}
			} );
			if ( any_tab ) {
				$wpgpt_showEl( '.wpgpt-search-close-tabs' );
			} else {
				wpgpt_do_search_notice( 'Choose a project!' );
			}
		} else {
			wpgpt_do_search_notice( 'String/slug cannot be empty!' );
		}
	}

	function wpgpt_open_tab( tab_key, tab_uri ) {
		if ( 'opened' === tabs_state[ tab_key ] ) {
			tabs[ tab_key ] && tabs[ tab_key ].close();
		}
		tabs[ tab_key ] = window.open( tab_uri, '_blank' );
		tabs_state[ tab_key ] = 'opened';
	}

	function wpgpt_close_tabs( tabs_group ) {
		Object.entries( tabs_state ).forEach( ( tab ) => {
			const [ tab_key, tab_value ] = tab;
			if ( 'plugin' === tab_key ) {
				tabs.plugin.forEach( ( tab ) => {
					tab && tab.close();
				} );
				tabs_state.plugin = 'closed';
			} else if ( ( 'opened' === tab_value ) && ( 'all' === tabs_group || ( tab_key !== 'gt' && tab_key !== 'references' && tab_key !== 'panel_links' ) ) ) {
				tabs[ tab_key ] && tabs[ tab_key ].close();
				tabs_state[ tab_key ] = 'closed';
			}
		} );
		document.querySelectorAll( '.wpgpt-search-close-tabs' ).forEach( ( el ) => {
			el.style.display = 'none';
		} );
	}

	function wpgpt_do_search_options( event ) {
		wpgpt_search_settings[ event.target.dataset.searchproject ] = event.target.checked;
		document.querySelectorAll( '.wpgpt-search-option' ).forEach( ( el ) => {
			el.checked = wpgpt_search_settings[ el.dataset.searchproject ];
		} );
		localStorage.setItem( 'wpgpt-search', JSON.stringify( wpgpt_search_settings ) );
	}

	function wpgpt_do_search_notice( msg ) {
		$wpgpt_setTextContent( '.error-notice', msg );
		clearTimeout( notice_time );
		notice_time = setTimeout( () => { $wpgpt_setTextContent( '.error-notice', '' ); }, 3000 );
	}

	function wpgpt_consistency() {
		if ( document.querySelector( '.gd-get-consistency' ) !== null ) {
			return;
		}
		const wpgpt_consistency_output = $wpgpt_createElement( 'details', { 'class': 'wpgpt_consistency suggestions__translation-consistency', 'open': 'open' } );
		const wpgpt_consistency_summary = $wpgpt_createElement( 'summary', { }, 'Suggestions from Consistency' );
		const wpgpt_consistency_button = $wpgpt_createElement( 'button', { 'class': 'wpgpt_get_consistency' }, 'View Consistency suggestions' );

		wpgpt_consistency_output.append( wpgpt_consistency_summary, wpgpt_consistency_button );

		$wpgpt_addElements( '.editor-panel__left .suggestions-wrapper', 'beforeend', wpgpt_consistency_output );
		$wpgpt_addEvtListener( 'click', '.wpgpt_get_consistency', wpgpt_do_consistency );
	}

	async function wpgpt_do_consistency( event ) {
		event.target.textContent = 'Loading...';
		const consistency_url = event.target.closest( '.editor-panel' ).querySelectorAll( '.button-menu__dropdown li a' )[ 2 ].href.replace( 'consistency?search', 'consistency/?search' );
		const this_panel_content = event.target.closest( '.panel-content' );
		const translation_forms = this_panel_content.querySelectorAll( '.translation-form-list .translation-form-list__tab' );
		const translation_forms_name = [];
		translation_forms.forEach( ( form ) => {
			translation_forms_name[ translation_forms_name.length ] = form.textContent.trim();
		} );
		const consistency_response = await wpgpt_get_fetch_results( consistency_url );
		const consistency_parser = new DOMParser();
		const consistency_page = consistency_parser.parseFromString( consistency_response, 'text/html' );
		const consistency_alternatives = consistency_page.querySelectorAll( '.consistency-table tbody tr th strong' );
		let translations_count, unique_translation_count;

		if ( 1 === consistency_alternatives.length ) {
			unique_translation_count = consistency_page.querySelectorAll( 'tr' ).length - 2;
			unique_translation_count = ` (${unique_translation_count} time${( unique_translation_count > 1 ) ? 's' : ''})`;
		} else {
			translations_count = consistency_page.querySelectorAll( '.translations-unique small' );
		}

		let wpgpt_consistency_suggestions;
		if ( consistency_alternatives.length ) {
			let wpgpt_consistency_item, wpgpt_consistency_item_div, wpgpt_consistency_item_translation, wpgpt_consistency_item_meta, wpgpt_consistency_item_count, wpgpt_consistency_item_raw, wpgpt_consistency_item_button, wpgpt_consistency_item_header;

			wpgpt_consistency_suggestions = $wpgpt_createElement( 'ul', { class: 'suggestions-list' } );

			for ( let consistency_alternatives_i = 0; consistency_alternatives_i < consistency_alternatives.length; consistency_alternatives_i++ ) {
				const this_translation_count = ( 1 === consistency_alternatives.length ) ? unique_translation_count : translations_count[ consistency_alternatives_i ].textContent;
				const this_translation_text = [ consistency_alternatives[ consistency_alternatives_i ].textContent ];
				if ( translation_forms.length > 1 ) {
					const string_response = await wpgpt_get_fetch_results( consistency_alternatives[ consistency_alternatives_i ].parentNode.parentNode.nextSibling.querySelectorAll( 'td .meta a' )[ 1 ].href.replace( '?filters', '/?filters' ) );
					const string_parser = new DOMParser();
					const string_page = string_parser.parseFromString( string_response, 'text/html' );
					const consistency_textareas = string_page.querySelectorAll( '.translation-wrapper .textareas textarea' );

					let index = 0;
					consistency_textareas.forEach( ( textarea ) => {
						this_translation_text[ index ] = textarea.value;
						index++;
					} );

					wpgpt_consistency_item_header = $wpgpt_createElement( 'li', { 'class': 'consistency_index' }, `#${consistency_alternatives_i + 1}` );
					wpgpt_consistency_item_header.append(
						$wpgpt_createElement( 'button', { 'type': 'button', 'class': 'copy-full-alternative', 'data-alternative_id': consistency_alternatives_i }, 'Copy' ),
						$wpgpt_createElement( 'span', { 'class': 'consistency_count' }, this_translation_count ),
					);
					wpgpt_consistency_suggestions.append( wpgpt_consistency_item_header );
				}

				let meta_info, alternative_as_words;
				const space_span = $wpgpt_createElement( 'span', { 'class': 'space' }, ' ' );

				this_translation_text.forEach( ( form_text, form_text_i ) => {
					wpgpt_consistency_item = document.createElement( 'li' );
					wpgpt_consistency_item_div = $wpgpt_createElement( 'div', { 'class': 'translation-suggestion with-tooltip', 'role': 'button', 'aria-pressed': 'false', 'aria-label': 'Copy translation', 'tabindex': '0' } );
					wpgpt_consistency_item_translation = $wpgpt_createElement( 'span', { 'class': 'translation-suggestion__translation' } );
					alternative_as_words = form_text.split( ' ' );
					alternative_as_words.forEach( ( word, word_i ) => {
						wpgpt_consistency_item_translation.appendChild( document.createTextNode( word ) );
						if ( word_i < alternative_as_words.length - 1 ) {
							wpgpt_consistency_item_translation.append( space_span.cloneNode( true ) );
						}
					} );
					meta_info = ( translation_forms.length > 1 ) ? `${translation_forms_name[ form_text_i ]}: ` : `${consistency_alternatives_i + 1}: `;
					wpgpt_consistency_item_meta = $wpgpt_createElement( 'span', { 'class': 'translation-suggestion__translation index' }, meta_info );

					wpgpt_consistency_item_raw = $wpgpt_createElement( 'span', { 'class': `translation-suggestion__translation-raw consistency_alternative__${consistency_alternatives_i}_${form_text_i}`, 'aria-hidden': 'true' }, form_text );
					wpgpt_consistency_item_button = $wpgpt_createElement( 'button', { 'type': 'button', 'class': 'copy-suggestion' }, 'Copy' );
					wpgpt_consistency_item_translation.prepend( wpgpt_consistency_item_meta );

					if ( translation_forms.length < 2 ) {
						wpgpt_consistency_item_count = $wpgpt_createElement( 'span', { 'class': 'consistency_count' }, this_translation_count );
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
		event.target.before( wpgpt_consistency_suggestions );
		event.target.parentNode.removeChild( event.target );
		if ( translation_forms.length > 1 ) {
			$wpgpt_addEvtListener( 'click', '.copy-full-alternative', wpgpt_copy_full_alternative );
			this_panel_content.querySelectorAll( '.wpgpt_consistency .copy-suggestion' ).forEach( ( el ) => {
				el.parentNode.removeChild( el )
			} );
			this_panel_content.querySelectorAll( '.wpgpt_consistency .translation-suggestion' ).forEach( ( el ) => {
				el.classList.remove( 'translation-suggestion' );
			} );
			this_panel_content.querySelectorAll( '.wpgpt_consistency .with-tooltip' ).forEach( ( el ) => {
				el.classList.remove( 'with-tooltip' );
			} );
		}
	}

	async function wpgpt_get_fetch_results( url ) {
		try {
			const res = await fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } );
			return await res.text();
		} catch ( error ) {
			console.log( `A WPGPT Consistency Suggestion URL (${url}) could not be fetched due to a network issue. Consistency suggestions might be incomplete.` );
		}
	}

	function wpgpt_copy_full_alternative( event ) {
		const panel_content = event.target.closest( '.panel-content' );
		const alternative_id = event.currentTarget.dataset.alternative_id;
		panel_content.querySelectorAll( 'textarea' ).forEach( ( textarea, i ) => {
			const suggestion_form = panel_content.querySelector( `.consistency_alternative__${alternative_id}_${i}` );
			if ( suggestion_form ) {
				textarea.value = suggestion_form.textContent;
			}
		} );
		panel_content.querySelector( ' .textareas.active textarea' ).focus();
	}

	function wpgpt_quicklinks() {
		if ( document.querySelector( '.gd_quicklink' ) !== null ) {
			/* In case GD removes it.
			document.querySelectorAll( '.editor' ).forEach( ( editor ) => {
				editor.querySelectorAll( '.button-menu__dropdown li a' )[ 1 ].href += '&historypage';
			} ); */
			return;
		}
		const wpgpt_quicklinks_output = $wpgpt_createElement( 'span', { 'class': 'wpgpt_quicklinks' } );
		const wpgpt_quicklinks_copy_atributes = {
			'type':       'button',
			'class':      `wpgpt_quicklinks_copy with-tooltip${( wpgpt_search_settings.copy_me ) ? ' active' : ' inactive'}`,
			'aria-label': 'Click this and another to copy',
		};
		const wpgpt_quicklinks_copy = $wpgpt_createElement( 'button', wpgpt_quicklinks_copy_atributes );
		wpgpt_quicklinks_copy.append(
			$wpgpt_createElement( 'span', { 'class': 'screen-reader-text' } ),
			$wpgpt_createElement( 'span', { 'class': 'dashicons dashicons-clipboard', 'aria-hidden': 'true' } ),
		);

		const wpgpt_quicklinks_separator_atributes = {
			'class':       `wpgpt_quicklinks_plus dashicons${( wpgpt_search_settings.copy_me ) ? ' dashicons-plus' : ' separator'}`,
			'aria-hidden': 'true',
		};
		const wpgpt_quicklinks_separator = $wpgpt_createElement( 'span', wpgpt_quicklinks_separator_atributes );

		const wpgpt_quicklinks_permalink = $wpgpt_createElement( 'button', { 'class': 'wpgpt_quicklinks_item wpgpt_quicklinks_permalink with-tooltip', 'aria-label': 'Permalink to translation' } );
		wpgpt_quicklinks_permalink.append(
			$wpgpt_createElement( 'span', { 'class': 'screen-reader-text' }, 'Permalink to translation' ),
			$wpgpt_createElement( 'span', { 'class': 'dashicons dashicons-admin-links', 'aria-hidden': 'true' } ),
		);

		const wpgpt_quicklinks_history = $wpgpt_createElement( 'button', { 'class': 'wpgpt_quicklinks_item wpgpt_quicklinks_history with-tooltip', 'aria-label': 'Translation History' } );
		wpgpt_quicklinks_history.append(
			$wpgpt_createElement( 'span', { 'class': 'screen-reader-text' }, 'Translation History' ),
			$wpgpt_createElement( 'span', { 'class': 'dashicons dashicons-backup', 'aria-hidden': 'true' } ),
		);

		const wpgpt_quicklinks_consistency = $wpgpt_createElement( 'button', { 'class': 'wpgpt_quicklinks_item wpgpt_quicklinks_consistency with-tooltip', 'aria-label': 'View original in consistency tool' } );
		wpgpt_quicklinks_consistency.append(
			$wpgpt_createElement( 'span', { 'class': 'screen-reader-text' }, 'View original in consistency tool' ),
			$wpgpt_createElement( 'span', { 'class': 'dashicons dashicons-list-view', 'aria-hidden': 'true' } ),
		);

		wpgpt_quicklinks_output.append(
			wpgpt_quicklinks_copy,
			wpgpt_quicklinks_separator,
			wpgpt_quicklinks_permalink,
			wpgpt_quicklinks_history,
			wpgpt_quicklinks_consistency,
		);

		$wpgpt_addElements( '.editor-panel__right .panel-header', 'beforeend', wpgpt_quicklinks_output );

		document.querySelectorAll( '.editor' ).forEach( ( editor ) => {
			const editor_menu = editor.querySelectorAll( '.button-menu__dropdown li a' );
			if ( editor_menu.length ) {
				editor.querySelector( '.wpgpt_quicklinks_permalink' ).dataset.quicklink = editor_menu[ 0 ].href;
				editor_menu[ 1 ].href += '&historypage';
				editor.querySelector( '.wpgpt_quicklinks_history' ).dataset.quicklink = editor_menu[ 1 ].href;
				editor.querySelector( '.wpgpt_quicklinks_consistency' ).dataset.quicklink = `${editor_menu[ 2 ].href}&consistencypage`;
			}
		} );

		$wpgpt_addEvtListener( 'click', '.wpgpt_quicklinks_copy, .wpgpt_quicklinks_plus', wpgpt_toggle_quicklinks_copy );
		$wpgpt_addEvtListener( 'click', '.wpgpt_quicklinks_item', wpgpt_do_quicklinks );
	}

	function wpgpt_do_quicklinks( event ) {
		if ( wpgpt_search_settings.copy_me ) {
			const btn_target = event.currentTarget;
			const current_aria_label = btn_target.getAttribute( 'aria-label' );
			navigator.clipboard.writeText( event.currentTarget.dataset.quicklink );
			btn_target.setAttribute( 'aria-label', 'Copied!' );
			setTimeout( () => { btn_target.setAttribute( 'aria-label', current_aria_label ); }, 2000 );
		} else {
			wpgpt_open_tab( 'panel_links', event.currentTarget.dataset.quicklink );
			$wpgpt_showEl( '.wpgpt-search-close-tabs' );
		}
	}

	function wpgpt_toggle_quicklinks_copy() {
		document.querySelectorAll( '.wpgpt_quicklinks_plus' ).forEach( ( el ) => {
			el.classList.toggle( 'dashicons-plus' );
			el.classList.toggle( 'separator' );
		} );
		document.querySelectorAll( '.wpgpt_quicklinks_copy' ).forEach( ( el ) => {
			el.classList.toggle( 'active' );
			el.classList.toggle( 'inactive' );
		} );
		wpgpt_search_settings.copy_me = ! wpgpt_search_settings.copy_me;
		localStorage.setItem( 'wpgpt-search', JSON.stringify( wpgpt_search_settings ) );
	}

	// Adds checkbox to set user field value to 'anonymous' - author submitted translations.
	function wpgpt_anonymous() {
		const user_filter_el = document.getElementById( 'filters[user_login]' );
		if ( ! user_filter_el ) {
			return;
		}
		const anonymous = document.createElement( 'div' );
		const anonymous_input = $wpgpt_createElement( 'input', { 'type': 'checkbox', 'id': 'wpgpt_search_anonymous' } );
		const anonymous_label = $wpgpt_createElement( 'label', { 'for': 'wpgpt_search_anonymous' }, 'Anonymous author' );
		anonymous.append( anonymous_input, anonymous_label );
		user_filter_el.insertAdjacentElement( 'afterend', anonymous );
		anonymous_input.addEventListener( 'click', ( event ) => {
			if ( event.target.checked ) {
				document.getElementById( 'filters[user_login]' ).value = 'anonymous';
			} else {
				document.getElementById( 'filters[user_login]' ).value = '';
			}
		} );
	}

	function wpgpt_gt() {
		if ( 'undefined' === typeof short_locale ) {
			return;
		}
		const gp_gt_locales = { 'bel': 'be', 'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW', 'hat': 'ht', 'hau': 'ha', 'he': 'iw', 'ibo': 'ig', 'jv': 'jw', 'kin': 'rw', 'kmr': 'ku', 'ckb': 'ku', 'kir': 'ky', 'mlt': 'mt', 'mri': 'mi', 'ary': 'ar', 'mya': 'my', 'nb': 'no', 'nn': 'no', 'ory': 'or', 'sna': 'sn', 'snd': 'sd', 'azb': 'az', 'tuk': 'tk', 'xho': 'xh', 'yor': 'yo', 'zul': 'zu' };

		if ( short_locale in gp_gt_locales ) {
			short_locale = gp_gt_locales[ short_locale ];
		} else {
			short_locale = short_locale.split( '-' );
			short_locale = short_locale[ 0 ];
		}

		document.querySelectorAll( '.editor' ).forEach( ( editor_el ) => {
			const suggestion_wrapper = editor_el.querySelector( '.editor-panel__left .suggestions-wrapper' );
			if ( null === suggestion_wrapper ) {
				return;
			}

			const wpgpt_gt_string = encodeURIComponent( editor_el.querySelector( '.source-string__singular span.original' ).textContent );
			let wpgpt_gt_url = `https://translate.google.com/?sl=en&tl=${short_locale}&text=${wpgpt_gt_string}&op=translate`;
			wpgpt_gt_url = wpgpt_gt_url.replaceAll( '"', '&#34;' );

			const wpgpt_gt_output = $wpgpt_createElement( 'details', { 'class': 'wpgpt_gt suggestions__translation-gt', 'open': 'open' } );
			const wpgpt_gt_summary = $wpgpt_createElement( 'summary', { }, 'Suggestion from Google Translate' );
			const wpgpt_gt_button = $wpgpt_createElement( 'button', { 'class': 'wpgpt_get_gt', 'data-wpgpt_gt_string': wpgpt_gt_url }, 'View Google Translate suggestions' );

			wpgpt_gt_output.append( wpgpt_gt_summary, wpgpt_gt_button );
			suggestion_wrapper.insertAdjacentElement( 'beforeend', wpgpt_gt_output );
		} );

		$wpgpt_addEvtListener( 'click', '.wpgpt_get_gt', wpgpt_do_gt );
	}

	function wpgpt_do_gt( event ) {
		wpgpt_open_tab( 'gt', event.target.dataset.wpgpt_gt_string );
		$wpgpt_showEl( '.wpgpt-search-close-tabs' );
	}

	function wpgpt_events() {
		$wpgpt_addEvtListener( 'click', '.source-details__references ul li a', do_refferences );
		window.onbeforeunload = function() { wpgpt_close_tabs( 'all' ); };
		document.addEventListener( 'keydown', ( event ) => {
			if ( event.altKey ) {
				if ( ! isNaN( parseInt( event.key, 10 ) ) ) {
					wpgpt_do_event( '.suggestions__translation-consistency .copy-suggestion', parseInt( event.key, 10 ), 'click', '.suggestions__translation-consistency .copy-full-alternative' ); // Alt + number - Copy consistency suggestion
				} else {
					switch ( event.key.toLowerCase() ) {
					case 'c': wpgpt_do_event( '.wpgpt_get_consistency' ); // Alt + C  - Show consistency suggestions
						break;

					case 'g': wpgpt_do_event( '.wpgpt_get_gt' ); // Alt + G - Google Translate string
						break;

					case 'n': wpgpt_do_event( '.wpgpt_notranslate_copy_all' ) // Alt + N - Copy all non-translatable strings
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
			if ( 'click' === event_type ) {
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

	function do_refferences( event ) {
		event.preventDefault();
		wpgpt_open_tab( 'references', event.currentTarget.href );
	}

	function wpgpt_localdate() {
		const local_time = new Date();
		let timezone_offset = local_time.getTimezoneOffset() / 60 * -1;
		timezone_offset = `UTC${( timezone_offset !== 0 ) ? ( ( ( timezone_offset > 0 ) ? '+' : '' ) + timezone_offset ) : ''}`;
		const localized_date = $wpgpt_createElement( 'span', { 'class': 'localized_date' } );
		localized_date.append( $wpgpt_createElement( 'span', { 'class': 'timezone' }, timezone_offset ) );
		document.querySelectorAll( '.editor-panel__right .meta dd' ).forEach( ( dd ) => {
			if ( dd.textContent.includes( 'UTC' ) ) {
				const date_data = dd.textContent.split( ' ', 3 );
				const date_date = date_data[ 0 ].split( '-', 3 );
				const date_time = date_data[ 1 ].split( ':', 3 );
				const new_date = new Date( Date.UTC( date_date[ 0 ], date_date[ 1 ] - 1, date_date[ 2 ], date_time[ 0 ], date_time[ 1 ], date_time[ 2 ] ) );
				const this_localized_date = localized_date.cloneNode( true );
				this_localized_date.prepend( `${new_date.toLocaleDateString()} ${new_date.toLocaleTimeString()}` );
				dd.insertAdjacentElement( 'afterend', this_localized_date );
				dd.style.display = 'none';
			}
		} );
	}

	function wpgpt_notranslate() {
		const notranslate_header = document.createElement( 'div' );
		notranslate_header.textContent = 'Non-translatable';
		notranslate_header.append( $wpgpt_createElement( 'button', { 'type': 'button', 'class': 'wpgpt_notranslate_copy_all' }, 'Copy all' ) );
		document.querySelectorAll( '.preview .original' ).forEach( ( original_preview ) => {
			let has_notranslate = false;
			const editor = original_preview.parentNode.nextElementSibling;
			const notranslate = $wpgpt_createElement( 'div', { 'class': 'wpgpt_notranslate' } );
			const notranslate_fragment = document.createDocumentFragment();
			const original_preview_forms = original_preview.querySelectorAll( '.original-text' );

			/*
			* This is a workaround that clones <span class="original-text"> node from preview in editor.
			* Reason for this is that strings having plurals do not go trough preapre_original in GlotPress
			* https://github.com/WordPress/wordpress.org/blob/a6274d460e522dc99cdd4900431a0b9423c4b92f/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/translation-row-preview.php#L29-L41
			* https://github.com/WordPress/wordpress.org/blob/8a6414e009ae9cc4035486ccb168e17cea49b098/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/translation-row-editor.php#L81-L98
			* https://github.com/GlotPress/GlotPress-WP/blob/0c395a7a8f37ab3b5ebafd2b239c74392e5177f9/gp-templates/translation-row-editor.php#L34
			* https://github.com/GlotPress/GlotPress-WP/blob/0c395a7a8f37ab3b5ebafd2b239c74392e5177f9/gp-templates/helper-functions.php#L17
			* This needs to be fixed upstrean.
			*/
			if ( original_preview_forms.length > 1 ) {
				editor.querySelectorAll( '.source-string.strings div .original' ).forEach( ( original_editor_form, form_i ) => {
					original_editor_form.textContent = '';
					original_editor_form.append( original_preview_forms[ form_i ].cloneNode( true ) );
				} );
			}

			original_preview_forms[ 0 ].parentNode.querySelectorAll( '.original-text > .notranslate' ).forEach( ( item ) => {
				const notranslate_item = document.createElement( 'a' );
				notranslate_item.setAttribute( 'title', 'Click to insert this item to textarea!' );
				notranslate_item.textContent = item.textContent;
				notranslate_fragment.appendChild( notranslate_item );
				has_notranslate = true;
			},
			);
			if ( has_notranslate ) {
				notranslate.prepend( notranslate_header.cloneNode( true ) );
				notranslate.append( notranslate_fragment );
				// To prevent errors for not-logged in users. To do: use a global check.
				const suggestion_wrapper_el = editor.querySelector( '.suggestions-wrapper' );
				( suggestion_wrapper_el ) && suggestion_wrapper_el.prepend( notranslate );
			}
		} );

		$wpgpt_addEvtListener( 'click', '.translation-form-list li button', ( ev ) => {
			const textareas = ev.currentTarget.closest( '.translation-wrapper' ).querySelectorAll( '.textareas' )[ ev.currentTarget.dataset.pluralIndex ];
			textareas.classList.add( 'active' );
			textareas.querySelector( 'textarea' ).focus();
		} );
		$wpgpt_addEvtListener( 'focus', '.editor textarea', wpgpt_update_notranslate );
		$wpgpt_addEvtListener( 'keyup', '.editor textarea', wpgpt_update_notranslate );
		$wpgpt_addEvtListener( 'click', '.wpgpt_notranslate a, .editor .notranslate', ( ev ) => {
			wpgpt_insertText( ev.currentTarget.closest( '.editor-panel__left' ).querySelector( '.textareas.active textarea' ), ev.currentTarget.textContent );
		} );
		document.querySelectorAll( '.editor .notranslate' ).forEach( ( el ) => { el.setAttribute( 'title', 'Click to insert this item to textarea!' ); } );
		$wpgpt_addEvtListener( 'click', '.wpgpt_notranslate_copy_all', ( ev ) => {
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

	function wpgpt_insertText( el, text ) {
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

function wpgpt_bulk_consistency() {
	let alternative_forms_name = [], first_alternative_forms = 0, constant_alternative_forms = true, fetched_alternatives = 0;
	if ( ! ( window.location.href.includes( 'wordpress.org/consistency' ) && document.querySelector( '.consistency-table' ) ) ) {
		return;
	}
	localStorage.removeItem( 'wpgpt_chosen_alternative' );

	const translations_overview = document.getElementById( 'translations-overview' );
	if ( translations_overview ) {
		translations_overview.classList.add( 'wporg-notice-notice' );
		translations_overview.classList.remove( 'wporg-notice-warning' );
	}

	const toggle_view_unique = document.querySelector( '#toggle-translations-unique' );
	if ( toggle_view_unique ) {
		toggle_view_unique.parentNode.replaceChild( $wpgpt_createElement( 'span', { 'id': 'wpgpt_loading' }, 'Loading...' ), toggle_view_unique );
	}

	const reject_div = $wpgpt_createElement( 'div', { 'class': 'fire_magic_reject_close_div' }, 'Danger zone: ' );
	reject_div.append(
		$wpgpt_createElement( 'button', { 'class': 'fire_magic_reject_close' }, 'Reject all translations' ),
	);
	$wpgpt_addElement( '.notice', 'afterbegin', reject_div );

	const relax_text = 'Click the button below, sit back, relax and let me do the work for you. It\'s your one minute break and you deserve it!';
	const relax = $wpgpt_createElement( 'div', { 'class': 'wpgpt-relax' }, relax_text );

	const replace_btn = $wpgpt_createElement( 'button', { 'class': 'fire_magic_save_close', 'style': 'display:none;' }, 'Bulk replace & Save' );
	const translation_overview = document.querySelector( '#translations-overview' );
	translation_overview && translation_overview.after( relax, replace_btn );

	const consistency_alternatives_url = {};
	let temp_id;
	const consistency_rows = document.querySelectorAll( '.consistency-table tbody tr' );
	consistency_rows.forEach( ( row, row_i ) => {
		const row_id = row.id;
		if ( row_id ) { // Alternative's header
			temp_id = row_id;
			consistency_alternatives_url[ row_id ] = consistency_rows[ row_i + 1 ].querySelectorAll( 'td .meta a' )[ 1 ].href;
		}
		row.classList.add( `alternative-${temp_id}` );
	} );

	const header_alternatives = document.querySelectorAll( '.translations-unique li a.anchor-jumper' );
	header_alternatives.forEach( ( alternative ) => {
		const alternative_id = alternative.href.split( '#' )[ 1 ];
		const bulk_buttons = $wpgpt_createElement( 'div', { 'class': 'wpgpt-bulk-buttons' } );
		bulk_buttons.append(
			$wpgpt_createElement( 'button', { 'id': `choose-${alternative_id}`, 'class': 'choose-consistency-string', 'type': 'button' }, 'Set this translation as replacement' ),
			$wpgpt_createElement( 'button', { 'id': `delete-${alternative_id}`, 'class': 'delete-consistency-strings', 'type': 'button', 'disabled': 'disabled' }, 'Do not replace this translation' ),
		);
		alternative.insertAdjacentElement( 'afterend', bulk_buttons );
		wpgpt_get_alternative( consistency_alternatives_url[ alternative_id ], alternative_id, alternative, header_alternatives.length );
	} );

	$wpgpt_addEvtListener( 'click', '.choose-consistency-string', ( event ) => {
		const alternative_id = event.target.id.replace( 'choose-', '' );
		localStorage.setItem( 'wpgpt_chosen_alternative', JSON.stringify( consistency_alternatives[ alternative_id ] ) );
		document.querySelectorAll( '.delete-consistency-strings' ).forEach( ( el ) => { el.disabled = false; } );
		document.querySelectorAll( '.choose-consistency-string' ).forEach( ( el ) => { el.disabled = true; } );
		document.querySelector( `#delete-${alternative_id}` ).click();
		document.querySelectorAll( '.fire_magic_save_close, .wpgpt-relax' ).forEach( ( el ) => { el.style.display = 'block'; } )
		event.target.insertAdjacentElement( 'beforeBegin', $wpgpt_createElement( 'strong', {}, 'This translation will be used to replace all others. ' ) );
		event.target.parentNode.removeChild( event.target );
		const table_head = document.createElement( 'thead' );
		const table_tr = document.createElement( 'tr' );
		const table_th = $wpgpt_createElement( 'th', { 'colspan': '2' }, 'These are the transations that will be replaced:' );
		table_tr.append( table_th );
		table_head.append( table_tr );
		$wpgpt_addElement( '.consistency-table', 'afterbegin', table_head );
	} );

	$wpgpt_addEvtListener( 'click', '.delete-consistency-strings', ( event ) => {
		document.querySelectorAll( `.alternative-${event.target.id.replace( 'delete-', '' )}` ).forEach( ( el ) => { el.parentNode.removeChild( el ); } );
		event.target.insertAdjacentElement( 'beforeBegin', $wpgpt_createElement( 'span', {}, 'This translation will not be replaced.' ) );
		event.target.parentNode.removeChild( event.target );
	} );

	$wpgpt_addEvtListener( 'click', '.fire_magic_save_close', wpgpt_fire_save_close );
	function wpgpt_fire_save_close() {
		if ( null === localStorage.getItem( 'wpgpt_chosen_alternative' ) ) {
			console.log( 'Unexpected error, please contact developers and let them know that upon `.fire_magic_save_close` click, localStorage is still empty!' );
			return;
		}
		const chosen_alternative_data = JSON.parse( localStorage.getItem( 'wpgpt_chosen_alternative' ) );
		let chosen_alternative = '';
		if ( chosen_alternative_data.length > 1 ) {
			chosen_alternative_data.forEach( ( alternative, alternative_i ) => {
				chosen_alternative += `${alternative_forms_name[ alternative_i ]}: ${alternative}\n`;
			} );
		} else {
			chosen_alternative = chosen_alternative_data[ 0 ];
		}

		const replace_strings = [];
		document.querySelectorAll( '.consistency-table tr td' ).forEach( ( td, td_i ) => {
			if ( td_i % 2 ) {
				replace_strings[ replace_strings.length ] = td.querySelector( '.meta a ' );
			}
		} );
		const replace_strings_length = ( replace_strings.length > wpgpt_safe_limit ) ? wpgpt_safe_limit : replace_strings.length;

		let confirm_msg = `${replace_strings_length} selected strings will be REPLACED with:\n\n${chosen_alternative}\n\n`;
		confirm_msg += ( ( replace_strings.length > wpgpt_safe_limit ) ? ( `For safety, only ${replace_strings_length} out of ${replace_strings.length} can be replaced in one go.\n` ) : '' );
		confirm_msg += 'A log of replaced translations will be downloaded. \nAre you sure?';

		if ( confirm( confirm_msg ) ) {
			let replace_strings_urls = '', wpgpt_safe_limit_index = 1;
			replace_strings.forEach( ( r_string ) => {
				if ( wpgpt_safe_limit_index > wpgpt_safe_limit ) {
					return false;
				}
				wpgpt_safe_limit_index++;
				replace_strings_urls += `${r_string.href}\n`;
				window.open( `${r_string.href}#magicsaveclose_T_WPORG` );
			} );
			const current_date = new Date();
			const replacement_notice = ( ! constant_alternative_forms ) ? 'Note: Replacement of translations with a different singular/plural form has been skipped. \n' : '';
			wpgpt_download(
				`[${current_date.toLocaleString( [], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } )}][WPGPT Log][${replace_strings_length} replacements]`,
				`Date: ${current_date.toLocaleDateString()} at ${current_date.toLocaleTimeString()}\nOriginal: ${document.querySelector( '#original' ).value}\nReplaced with: ${chosen_alternative}\n${replacement_notice}${replace_strings_length} replaced translations:\n${replace_strings_urls}`,
			);

			const bulk_replace = document.querySelector( '.fire_magic_save_close' );
			bulk_replace.removeEventListener( 'click', wpgpt_fire_save_close );
			bulk_replace.addEventListener( 'click', () => { location.reload(); } );
			bulk_replace.textContent = 'Reload page';
			return;
		}
		alert( 'Phew! Ok!' );
	}

	$wpgpt_addEvtListener( 'click', '.fire_magic_reject_close', wpgpt_fire_reject_close );
	function wpgpt_fire_reject_close() {
		const reject_strings = [];
		document.querySelectorAll( '.consistency-table tr td' ).forEach( ( td, td_i ) => {
			if ( td_i % 2 ) {
				reject_strings[ reject_strings.length ] = td.querySelector( '.meta a ' );
			}
		} );
		const reject_strings_length = ( reject_strings.length > wpgpt_safe_limit ) ? wpgpt_safe_limit : reject_strings.length;

		let confirm_msg = `${reject_strings_length} strings will be REJECTED! \n\n`;
		confirm_msg += ( ( reject_strings.length > wpgpt_safe_limit ) ? ( `For safety, only ${reject_strings_length} out of ${reject_strings.length} strings can be rejected in one go.\n` ) : '' );
		confirm_msg += 'A log of rejected translations will be downloaded. \nAre you sure?';
		if ( confirm( confirm_msg ) ) {
			let reject_strings_urls = '', wpgpt_safe_limit_index = 1;
			reject_strings.forEach( ( r_string ) => {
				if ( wpgpt_safe_limit_index > wpgpt_safe_limit ) {
					return false;
				}
				wpgpt_safe_limit_index++;
				reject_strings_urls += `${r_string.href}\n`;
				window.open( `${r_string.href}#magicrejectclose_T_WPORG` );
			} );
			const current_date = new Date();
			wpgpt_download(
				`[${current_date.toLocaleString( [], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } )}][WPGPT Log][${reject_strings_length} rejections]`,
				`Date: ${current_date.toLocaleDateString()} at ${current_date.toLocaleTimeString()}\nOriginal: ${document.querySelector( '#original' ).value}\n${reject_strings_length} rejected translations:\n${reject_strings_urls}`,
			);
			return;
		}
		alert( 'Phew! I thought so!' );
	}

	function wpgpt_get_alternative( alternative_url, alternative_id, alternative_element, all_alternatives_length ) {
		fetch( alternative_url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
			.then( alternative_response => alternative_response.text() )
			.then( alternative_response => {
				const alternative_parser = new DOMParser();
				const alternative_page = alternative_parser.parseFromString( alternative_response, 'text/html' );

				alternative_forms_name = [];
				alternative_page.querySelectorAll( '.translation-form-list .translation-form-list__tab' ).forEach( ( form_tab ) => {
					alternative_forms_name[ alternative_forms_name.length ] = form_tab.textContent.trim();
				} );

				const alternative_forms = [];
				alternative_page.querySelectorAll( '.translation-wrapper .textareas' ).forEach( ( textarea ) => {
					alternative_forms[ parseInt( textarea.dataset.pluralIndex ) ] = textarea.querySelector( 'textarea' ).value;
				} );

				consistency_alternatives[ alternative_id ] = alternative_forms;

				const alternative_plurals = document.createElement( 'div' );
				const space_span = $wpgpt_createElement( 'span', { 'class': 'space' }, ' ' );

				alternative_forms.forEach( ( form, form_i ) => {
					if ( 0 === form_i ) {
						return;
					}
					const alternative_plural_el = document.createElement( 'div' );

					const alternative_form_as_words = form.split( ' ' );
					alternative_form_as_words.forEach( ( word, word_i ) => {
						alternative_plural_el.appendChild( document.createTextNode( word	) );
						if ( word_i < alternative_form_as_words.length - 1 ) {
							alternative_plural_el.append( space_span.cloneNode( true ) );
						}
					} );

					alternative_plural_el.prepend( $wpgpt_createElement( 'span', { 'class': 'plural_form' }, `${alternative_forms_name[ form_i ]}:` ) );
					alternative_plurals.append( alternative_plural_el );
				} );

				if ( alternative_forms.length !== 1 ) {
					document.querySelector( '.translations-unique' ).classList.add( 'plural-unique' );
					alternative_element.closest( 'li' ).insertAdjacentElement( 'afterBegin', $wpgpt_createElement( 'span', { 'class': 'plural_form' }, `${alternative_forms_name[ 0 ]}:` ) );
					alternative_element.insertAdjacentElement( 'afterEnd', alternative_plurals );
				}

				if ( 0 === first_alternative_forms ) {
					first_alternative_forms = alternative_forms.length;
				}

				if ( first_alternative_forms !== 0 && first_alternative_forms !== alternative_forms.length ) {
					constant_alternative_forms = false;
				}
				fetched_alternatives++;

				if ( fetched_alternatives === all_alternatives_length ) {
					const bulk_instructions = $wpgpt_createElement( 'div', { 'class': 'bulk-instructions' }, 'To bulk replace translations: ' );
					const bulk_instructions_ol = document.createElement( 'ol' );
					bulk_instructions_ol.append(
						$wpgpt_createElement( 'li', {}, 'Set a translation to replace the others with.' ),
						$wpgpt_createElement( 'li', {}, 'Choose translations that you don\'t want to be replaced.' ),
						$wpgpt_createElement( 'li', {}, 'Click "Bulk replace & Save".' ),
					);
					bulk_instructions.append( bulk_instructions_ol );
					if ( ! constant_alternative_forms ) {
						const note = document.createElement( 'div' );
						note.textContent = 'Note: The above translations have both singular and plural forms, but replacement of translations with a different form will be skipped';
						$wpgpt_addElement( '#translations-overview', 'beforeend', note );
					}
					$wpgpt_addElement( '#translations-overview p', 'afterbegin', bulk_instructions );
					document.querySelector( '#wpgpt_loading' ).style = 'display: none';
					const view_unique = document.querySelector( '.translations-unique' );
					if ( view_unique ) {
						view_unique.classList.remove( 'hidden' );
					}
				}
			} )
			.catch( () => console.log( `A WPGPT Consistency Alternative URL (${alternative_url}) could not be fetched due to a network issue. Consistency might be incomplete.` ) );
	}

	function wpgpt_download( filename, text ) {
		const element = document.createElement( 'a' );
		element.setAttribute( 'href', `data:text/plain;charset=utf-8,${encodeURIComponent( text )}` );
		element.setAttribute( 'download', filename );
		element.style.display = 'none';
		document.body.appendChild( element );
		element.click();
		document.body.removeChild( element );
	}
}

// Functions to replace jQuery library.

function $wpgpt_addElements( target_selector, el_position, new_element ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.insertAdjacentElement( el_position, new_element.cloneNode( true ) );
	} );
}

function $wpgpt_addEvtListener( event_name, target_selector, function_to_call ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.addEventListener( event_name, function_to_call );
	} );
}

function $wpgpt_toggleEl( target_selector, el_class ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.classList.toggle( el_class );
	} );
}

function $wpgpt_showEl( target_selector ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.style.display = 'inline-block';
	} );
}

function $wpgpt_setTextContent( target_selector, new_txt ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.textContent = new_txt;
	} );
}

function $wpgpt_addClickEvt( target_selector, function_to_call, function_parameters = [] ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.onclick = function() {
			if ( function_parameters.length ) {function_to_call( ... function_parameters );} else {function_to_call();}
		};
	} );
}

function $wpgpt_scrollTo( target_selector, scroll_behavior = 'auto', vertical_align = 'start', horizontal_align = 'nearest' ) {
	const el = document.querySelector( target_selector );
	el.scrollIntoView( { behavior: scroll_behavior, block: vertical_align, inline: horizontal_align } );
}
