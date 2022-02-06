/*
	WPGPTdiff is a modified version of jsdiff.js
	Source: https://github.com/kpdecker/jsdiff
	As seen on: http://jsfiddle.net/ARTsinn/MQdFw/
	Software License Agreement (BSD License)
	Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
	All rights reserved.
	Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	* Neither the name of Kevin Decker nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
	IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

let WPGPTdiff, wpgpt_history_editors, wpgpt_cache = '';
wpgpt_init_history_status();

function wpgpt_init_history_status() {
	const is_history = document.location.href.includes( 'historypage' );
	if ( 	'undefined' === typeof $gp_editor_options ||
			'disabled' === wpgpt_settings.history_main.state ||
			( is_history && 'disabled' === wpgpt_settings.history_page.state )
	) {
		return;
	}

	WPGPTdiff = ( () => {
		function diff( oldString, newString ) {
			if ( ! newString ) {
				return [ { value: oldString, removed: true } ];
			}
			if ( ! oldString ) {
				return [ { value: newString, added: true } ];
			}

			newString = removeEmpty( newString.split( /(\s|\b)/ ) );
			oldString = removeEmpty( oldString.split( /(\s|\b)/ ) );

			const newLen = newString.length, oldLen = oldString.length;
			const maxEditLength = newLen + oldLen;
			const bestPath = [ { newPos: -1, components: []	} ];

			let oldPos = extractCommon( bestPath[ 0 ], newString, oldString, 0 );
			if ( bestPath[ 0 ].newPos + 1 >= newLen && oldPos + 1 >= oldLen ) {
				return bestPath[ 0 ].components;
			}
			for ( let editLength = 1; editLength <= maxEditLength; editLength++ ) {
				for ( let diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2 ) {
					let basePath;
					const addPath = bestPath[ diagonalPath - 1 ], removePath = bestPath[ diagonalPath + 1 ];
					oldPos = ( removePath ? removePath.newPos : 0 ) - diagonalPath;
					if ( addPath ) {
						bestPath[ diagonalPath - 1 ] = undefined;
					}
					const canAdd = addPath && addPath.newPos + 1 < newLen;
					const canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
					if ( ! canAdd && ! canRemove ) {
						bestPath[ diagonalPath ] = undefined;
						continue;
					}

					if ( ! canAdd || ( canRemove && addPath.newPos < removePath.newPos ) ) {
						basePath = clonePath( removePath );
						pushComponent( basePath.components, oldString[ oldPos ], undefined, true );
					} else {
						basePath = clonePath( addPath );
						basePath.newPos++;
						pushComponent( basePath.components, newString[ basePath.newPos ], true, undefined );
					}

					oldPos = extractCommon( basePath, newString, oldString, diagonalPath );

					if ( basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen ) {
						return basePath.components;
					} else {
						bestPath[ diagonalPath ] = basePath;
					}
				}
			}
		}

		function clonePath( path ) {
			return {
				newPos:     path.newPos,
				components: path.components.slice( 0 ),
			};
		}

		function removeEmpty( array_data ) {
			const ret = [];
			array_data.forEach( ( arr ) => {
				arr && wpgpt_push( ret, arr );
			} );
			return ret;
		}

		function pushComponent( components, value, added, removed ) {
			const last = components[ components.length - 1 ];
			if ( last && last.added === added && last.removed === removed ) {
				components[ components.length - 1 ] = {
					value:   `${last.value}${value}`,
					added:   added,
					removed: removed,
				};
			} else {
				wpgpt_push1( components, {
					value:   value,
					added:   added,
					removed: removed,
				} );
			}
		}

		function extractCommon( basePath, newString, oldString, diagonalPath ) {
			let newPos = basePath.newPos;
			let oldPos = newPos - diagonalPath;
			while ( newPos + 1 < newString.length &&
					oldPos + 1 < oldString.length &&
					newString[ newPos + 1 ] === oldString[ oldPos + 1 ]
			) {
				newPos++;
				oldPos++;
				pushComponent( basePath.components, newString[ newPos ], undefined, undefined );
			}
			basePath.newPos = newPos;
			return oldPos;
		}

		const methods = {
			getDiff: ( oldStr, newStr ) => {
				return diff( oldStr, newStr );
			},
			convertChangesToElement: ( changes ) => {
				const fragment = document.createDocumentFragment();
				const span = document.createElement( 'span' );
				changes.forEach( ( change ) => {
					let changeEl;
					if ( change.added || change.removed ) {
						changeEl = span.cloneNode( true );
						changeEl.textContent = change.value;
						changeEl.className = ( change.added ) ? 'diff-added' : 'diff-removed';
					} else {
						changeEl = document.createTextNode( change.value );
					}
					fragment.appendChild( changeEl );
				} );
				return fragment;
			},
		};
		return methods;
	} )();
	wpgpt_history_editors = document.querySelectorAll( '#translations tbody tr.editor' );
	wpgpt_load_history_status( 0, is_history );
}

function wpgpt_load_history_status( row_id, is_history = false ) {
	if ( row_id >= wpgpt_history_editors.length ) {
		return;
	}

	let translation_status;
	switch ( wpgpt_history_editors[ row_id ].querySelector( '.panel-header__bubble' ).textContent ) {
	case 'current': translation_status = 'current'; break;
	case 'waiting': translation_status = 'waiting'; break;
	case 'rejected': translation_status = 'rejected'; break;
	case 'old': translation_status = 'old'; break;
	case 'fuzzy': translation_status = 'fuzzy'; break;
	default: translation_status = 'untranslated';
	}

	if ( ( translation_status !== 'current' && translation_status !== 'untranslated' ) || 'enabled' === wpgpt_settings.history_count.state ) {
		const translation_id = wpgpt_history_editors[ row_id ].id;
		const string_id = translation_id.split( '-', 3 )[1];
		const url = `https://translate.wordpress.org${window.location.pathname}?filters%5Bstatus%5D=either&filters%5Boriginal_id%5D=${string_id}&sort%5Bby%5D=translation_date_added&sort%5Bhow%5D=desc`;

		if ( wpgpt_cache !== '' ) {
			wpgpt_analyse_history_status( wpgpt_cache, translation_id, translation_status, url, row_id === wpgpt_history_editors.length - 1 );
			wpgpt_load_history_status( row_id + 1, is_history );
		} else {
			fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
				.then( response => response.text() )
				.then( data => {
					wpgpt_analyse_history_status( data, translation_id, translation_status, url, row_id === wpgpt_history_editors.length - 1 );
					if ( is_history ) {
						wpgpt_cache = data;
						wpgpt_load_history_status( row_id + 1, is_history );
					}
				} )
				.catch( () => console.log( `A WPGPT History URL (${url}) could not be fetched due to a network issue. Histoy count might be incomplete.` ) );
		}
	} else {
		wpgpt_load_history_status( row_id + 1, is_history );
		return;
	}

	if ( ! is_history ) {
		wpgpt_load_history_status( row_id + 1, is_history );
	}
}

/*			Analyze History:
* 			String status:									Action:
*		Old, Rejected, Waiting, Fuzzy, Current	=>		displays History Count (if History Count enabled)
*		Old, Rejected and Waiting 		 		=>		compares to Current
*		Fuzzy 									=> 		compares to Waiting
*/
function wpgpt_analyse_history_status( history_data, translation_id, translation_status, url, isLast ) {
	let 	compared_translations_row = [];
	const	compared_translation_forms = [];
	const	translation_forms = [];
	let		diff_state = 'Identical';
	let 	diff_output = '';
	let 	raw_compare_to_output = '';
	let 	diff_label = '';
	let 	single_multiple;
	const 	string_history = [];
	let		count_label = '';
	let 	unique_warning_class = null;

	const history_parser = new DOMParser();
	const history_page = history_parser.parseFromString( history_data, 'text/html' );
	const history_length = history_page.querySelectorAll( '#translations tbody tr.preview' ).length;
	const unique_state = 'current';

	// Histoy Count.
	if ( 'enabled' === wpgpt_settings.history_count.state && history_length ) {
		[ 'current', 'waiting', 'fuzzy', 'rejected', 'old' ].forEach( ( state ) => {
			string_history[ state ] = history_page.querySelectorAll( `#translations tbody tr.preview.status-${state}` ).length;
			if (
				translation_status === unique_state &&
				state === unique_state &&
				string_history[unique_state] > 1
			) {
				string_history[unique_state] = `❌ ${string_history[unique_state]}`;
				unique_warning_class = 'label_error';
			}
			if (
				state === translation_status &&
				'number' === typeof ( string_history[ translation_status ] )
			) {
				string_history[ translation_status ]--;
			}
			count_label += ( string_history[ state ] ) ? ( `${( ( count_label !== '' ) ? ', ' : '' ) + string_history[ state ]} ${state}` ) : '';
		} );
		if ( ! history_page.querySelectorAll( '.next.disabled' ).length ) {count_label = `More than ${count_label} | Click to view`;}
	}

	// History Compare.
	const compare_to_status = ( 'fuzzy' === translation_status ) ? 'waiting' : 'current';
	if ( translation_status !== 'current' && translation_status !== 'untranslated' && history_length ) {
		compared_translations_row = history_page.querySelectorAll( `#translations tbody tr.preview.status-${compare_to_status}` );
		if ( compared_translations_row.length ) {
			document.querySelectorAll( `#${translation_id.replace( 'editor', 'preview' )} .translation-text` ).forEach( ( translation_form ) => { translation_forms[ translation_forms.length ] = translation_form.textContent; } );
			compared_translations_row[ 0 ].querySelectorAll( '.translation-text' ).forEach( ( compared_translation_form ) => { compared_translation_forms[ compared_translation_forms.length ] = compared_translation_form.textContent; } );

			single_multiple = ( translation_forms.length > 1 ) ? 'multiple' : 'single';

			diff_output = $wpgpt_createElement( 'details', { 'class': `wpgpt_diff ${single_multiple}`, 'open': 'open' } );
			const diff_title = $wpgpt_createElement( 'summary', {}, 'Differences between ' );
			diff_title.append(
				$wpgpt_createElement( 'b', {}, `this ${translation_status}` ),
				document.createTextNode( ' string and ' ),
				$wpgpt_createElement( 'b', {}, `${( compared_translations_row.length > 1 ) ? 'last ' : ''}${compare_to_status}` ),
				document.createTextNode( ' string:' ),
			);
			const diff_content = document.createElement( 'ol' );

			raw_compare_to_output = $wpgpt_createElement( 'details', { 'class': `wpgpt_compared_to ${single_multiple}`, 'open': 'open' } );
			const raw_compare_to_title = $wpgpt_createElement( 'summary', {}, ' string:' );
			raw_compare_to_title.prepend( $wpgpt_createElement( 'b', {}, `${( compared_translations_row.length > 1 ) ? 'Last ' : ''}${compare_to_status.charAt( 0 ).toUpperCase()}${compare_to_status.slice( 1 )}` )	);
			const raw_compare_to_content = document.createElement( 'ol' );

			translation_forms.forEach( ( translation_form, form_i ) => {
				if ( translation_form !== compared_translation_forms[ form_i ] ) {
					diff_state = 'Different';
					const diff_content_item = document.createElement( 'li' );
					diff_content_item.appendChild( WPGPTdiff.convertChangesToElement( WPGPTdiff.getDiff( translation_form, compared_translation_forms[ form_i ] ) ) );
					diff_content.append( diff_content_item );
				} else {
					diff_content.append( $wpgpt_createElement( 'li', { 'class': 'identical-history' }, `Identic with ${compare_to_status}` ) );
				}
				raw_compare_to_content.append( $wpgpt_createElement( 'li', {}, compared_translation_forms[ form_i ] ) );
			} );

			diff_output.append( diff_title, diff_content );
			raw_compare_to_output.append( raw_compare_to_title, raw_compare_to_content );

			diff_label = `${( compared_translations_row.length > 1 ) ? 'Multiple ' : ''}${diff_state} ${compare_to_status}`;
		}
	}

	const h_label = document.createElement( 'a' );
	h_label.className = 'wpgpt-h-label';
	h_label.target = '_blank';
	h_label.href = `${url}&historypage`;

	const preview_fragment = document.createDocumentFragment();
	const editor_fragment = document.createDocumentFragment();

	if ( diff_label !== '' ) {
		const diff_a_preview = h_label.cloneNode( true );
		diff_a_preview.textContent = diff_label;
		diff_a_preview.classList.add( 'preview_label' );
		preview_fragment.appendChild( diff_a_preview );

		const diff_a_editor = h_label.cloneNode( true );
		diff_a_editor.textContent = `${diff_label} ↧ `;
		diff_a_editor.classList.add( 'editor_label' );
		editor_fragment.appendChild( diff_a_editor );
	}

	if ( count_label !== '' ) {
		const count_a_preview = h_label.cloneNode( true );
		count_a_preview.textContent = count_label;
		count_a_preview.classList.add( 'preview_label', unique_warning_class );
		preview_fragment.appendChild( count_a_preview );

		const count_a_editor = h_label.cloneNode( true );
		count_a_editor.textContent = count_label;
		count_a_editor.classList.add( 'editor_label', unique_warning_class );
		editor_fragment.appendChild( count_a_editor );
	}

	if ( diff_label !== '' || count_label !== '' ) {
		document.querySelector( `#${translation_id.replace( 'editor', 'preview' )} .original-tags` ).append( preview_fragment );
		document.querySelector( `#${translation_id} .source-details` ).append( editor_fragment, diff_output, raw_compare_to_output );
	}

	if ( isLast ) {
		const errors_count = document.querySelectorAll( '.preview .label_error' ).length;
		const txt = errors_count ? ' ❌ ' : ' ✔️ ';
		const label = errors_count ? `${errors_count} duplicate current translation(s) found.
Please correct them!` : `Perfect!
No duplicate translations found.`;
		const unique_status = document.querySelector( '.wpgpt_unique_status' );
		if ( unique_status ) {
			unique_status.title = label;
			unique_status.textContent = txt;
		} else {
			document.querySelectorAll( '#upper-filters-toolbar a' )[3]
				.insertAdjacentElement( 'afterend', $wpgpt_createElement( 'span', {class: 'wpgpt_unique_status', title: label}, txt ) );
		}
	}
}
