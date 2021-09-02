/*
*	JSDiff is a minified and simplified version of jsdiff.js
* 	Source: https://github.com/kpdecker/jsdiff
* 	As seen on: http://jsfiddle.net/ARTsinn/MQdFw/

Software License Agreement (BSD License)

Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>

All rights reserved.

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Kevin Decker nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

let JsDiff, wpgpt_page_rows, wpgpt_cache = '';
wpgpt_init_history_status();

function wpgpt_init_history_status() {
	const is_history = document.location.href.includes( 'historypage' );
	if ( 	'undefined' === typeof $gp_editor_options ||
			'disabled' === wpgpt_settings.history_main.state ||
			( is_history && 'disabled' === wpgpt_settings.history_page.state )
	) {
		return;
	}
	// eslint-disable-next-line
	JsDiff = ( function() {function e( e ) {return {newPos: e.newPos, components: e.components.slice( 0 )}} const n = function( e ) {this.ignoreWhitespace = e}; n.prototype = {diff: function( n, o ) {if ( o === n ) {return [ {value: o} ];} if ( ! o ) {return [ {value: n, removed: ! 0} ];} if ( ! n ) {return [ {value: o, added: ! 0} ];} o = this.tokenize( o ), n = this.tokenize( n ); let t = o.length, r = n.length, s = t + r, i = [ {newPos: -1, components: []} ], u = this.extractCommon( i[0], o, n, 0 ); if ( i[0].newPos + 1 >= t && u + 1 >= r ) {return i[0].components;} for ( let a = 1; a <= s; a++ ) {for ( let d = -1 * a; d <= a; d += 2 ) {var f, c = i[d - 1], v = i[d + 1]; u = ( v ? v.newPos : 0 ) - d, c && ( i[d - 1] = void 0 ); const h = c && c.newPos + 1 < t, p = v && 0 <= u && u < r; if ( h || p ) {! h || p && c.newPos < v.newPos ? ( f = e( v ), this.pushComponent( f.components, n[u], void 0, ! 0 ) ) : ( ( f = e( c ) ).newPos++, this.pushComponent( f.components, o[f.newPos], ! 0, void 0 ) ); u = this.extractCommon( f, o, n, d ); if ( f.newPos + 1 >= t && u + 1 >= r ) {return f.components;} i[d] = f} else {i[d] = void 0}}}}, pushComponent: function( e, n, o, t ) {const r = e[e.length - 1]; r && r.added === o && r.removed === t ? e[e.length - 1] = {value: this.join( r.value, n ), added: o, removed: t} : e.push( {value: n, added: o, removed: t} )}, extractCommon: function( e, n, o, t ) {for ( var r = n.length, s = o.length, i = e.newPos, u = i - t; i + 1 < r && u + 1 < s && this.equals( n[i + 1], o[u + 1] ); ) {i++, u++, this.pushComponent( e.components, n[i], void 0, void 0 );} return e.newPos = i, u}, equals: function( e, n ) {const o = /\S/; return ! ( ! this.ignoreWhitespace || o.test( e ) || o.test( n ) ) || e === n}, join: function( e, n ) {return e + n}, tokenize: function( e ) {return e}}; const o = new n( ! 1 ); return o.tokenize = function( e ) {return ( function( e ) {for ( var n = [], o = 0; o < e.length; o++ ) {e[o] && n.push( e[o] );} return n}( e.split( /(\s|\b)/ ) ) )}, {Diff: n, WPGPT: function( e, n ) {return o.diff( e, n )}, convertChangesToXML: function( e ) {for ( var n, o = [], t = 0; t < e.length; t++ ) {const r = e[t]; r.added ? o.push( "<ins class='diff'>" ) : r.removed && o.push( '<del class="diff">' ), o.push( ( n = r.value, void 0, n.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ) ) ), r.added ? o.push( '</ins>' ) : r.removed && o.push( '</del>' )} return o.join( '' )}}}() );
	wpgpt_page_rows = jQuery( '#translations tbody tr.editor' );
	wpgpt_load_history_status( 0, is_history );
}

function wpgpt_load_history_status( row_id, is_history ) {
	if ( row_id >= wpgpt_page_rows.length ) {
		return;
	}

	let translation_status;
	switch ( jQuery( wpgpt_page_rows[ row_id ] ).find( '.panel-header__bubble' ).eq( 0 ).text() ) {
	case 'current': translation_status = 'current'; break;
	case 'waiting': translation_status = 'waiting'; break;
	case 'rejected': translation_status = 'rejected'; break;
	case 'old': translation_status = 'old'; break;
	case 'fuzzy': translation_status = 'fuzzy'; break;
	default: translation_status = 'untranslated';
	}

	if ( ( translation_status !== 'current' && translation_status !== 'untranslated' ) || 'enabled' === wpgpt_settings.history_count.state ) {
		const translation_id = jQuery( wpgpt_page_rows[ row_id ] ).attr( 'id' );
		const string_id = translation_id.split( '-', 3 )[1];
		const url = `https://translate.wordpress.org${window.location.pathname}?filters%5Bstatus%5D=either&filters%5Boriginal_id%5D=${string_id}&sort%5Bby%5D=translation_date_added&sort%5Bhow%5D=desc`;

		if ( wpgpt_cache !== '' ) {
			wpgpt_analyse_history_status( wpgpt_cache, translation_id, translation_status, url );
			wpgpt_load_history_status( row_id + 1, is_history );
		} else {
			fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
				.then( response => response.text() )
				.then( data => {
					wpgpt_analyse_history_status( data, translation_id, translation_status, url );
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

/*								Analyze History:
* 			String status:									Action:
*		Old, Rejected, Waiting, Fuzzy, Current	=>		displays History Count (if History Count enabled)
*		Old, Rejected and Waiting 		 		=>		compares to Current
*		Fuzzy 									=> 		compares to Waiting
*/
function wpgpt_analyse_history_status( history_data, translation_id, translation_status, url ) {
	let 	compared_translations_row = [];
	const	compared_translation_forms = [];
	const	translation_forms = [];
	let		diff_state = 'Identical';
	let 	diff_output = '';
	let 	diff_label = '';
	let 	single_multiple;
	const 	string_history = [];
	let		count_label = '';
	let		preview_label = '';
	let		editor_label = '';

	const history_parser = new DOMParser();
	const history_page = history_parser.parseFromString( history_data, 'text/html' );
	const history_length = jQuery( history_page ).find( '#translations tbody tr.preview' ).length;

	// Histoy Count.
	if ( 'enabled' === wpgpt_settings.history_count.state && history_length ) {
		[ 'current', 'waiting', 'fuzzy', 'rejected', 'old' ].forEach( ( state ) => {
			string_history[ state ] = jQuery( history_page ).find( `#translations tbody tr.preview.status-${state}` ).length;
			if ( state === translation_status && string_history[ translation_status ] ) {
				string_history[ translation_status ]--;
			}
			count_label += ( string_history[ state ] ) ? ( `${( ( count_label !== '' ) ? ', ' : '' ) + string_history[ state ]} ${state}` ) : '';
		} );
		if ( ! jQuery( history_page ).find( '.next.disabled' ).length ) {count_label = `More than ${count_label} | Click to view`;}
	}

	// History Compare.
	const compare_to_status = ( 'fuzzy' === translation_status ) ? 'waiting' : 'current';
	let raw_compare_to_output;
	if ( translation_status !== 'current' && translation_status !== 'untranslated' && history_length ) {
		compared_translations_row = jQuery( history_page ).find( `#translations tbody tr.preview.status-${compare_to_status}` );
		if ( compared_translations_row.length ) {
			jQuery( `#${translation_id.replace( 'editor', 'preview' )}` ).find( '.translation-text' ).each( function() { translation_forms.push( jQuery( this ).text() ); } );
			jQuery( compared_translations_row[ 0 ] ).find( '.translation-text' ).each( function() { compared_translation_forms.push( jQuery( this ).text() ); } );

			single_multiple = ( translation_forms.length > 1 ) ? 'multiple' : 'single';

			diff_output = $wpgpt_createElement( 'details', { 'class': `wpgpt_diff ${single_multiple}`, 'open': 'open' } );
			const diff_title = $wpgpt_createElement( 'summary', {}, 'Differences between ' );
			diff_title.append(
				$wpgpt_createElement( 'b', {}, `this ${translation_status}` ),
				document.createTextNode( ' string and ' ),
				$wpgpt_createElement( 'b', {}, compare_to_status ),
				document.createTextNode( ' string:' ),
			);
			const diff_content = document.createElement( 'ol' );

			raw_compare_to_output = $wpgpt_createElement( 'details', { 'class': `wpgpt_compared_to ${single_multiple}`, 'open': 'open' } );
			const raw_compare_to_title = $wpgpt_createElement( 'summary', {}, ' string:' );
			raw_compare_to_title.prepend( $wpgpt_createElement( 'b', {}, compare_to_status.charAt( 0 ).toUpperCase() + compare_to_status.slice( 1 ) )	);
			const raw_compare_to_content = document.createElement( 'ol' );

			translation_forms.forEach( ( translation_form, form_i ) => {
				if ( translation_form !== compared_translation_forms[ form_i ] ) {
					diff_state = 'Different';
					const diff_content_item = document.createElement( 'li' );
					diff_content_item.innerHTML = JsDiff.convertChangesToXML( JsDiff.WPGPT( translation_form, compared_translation_forms[ form_i ] ) );
					diff_content.append( diff_content_item );
				} else {
					diff_content.append( $wpgpt_createElement( 'li', { 'class': 'identical-history' }, `Identic with ${compare_to_status}` ) );
				}
				raw_compare_to_content.append( $wpgpt_createElement( 'li', {}, compared_translation_forms[ form_i ] ) );
			} );

			diff_output.append( diff_title, diff_content );
			raw_compare_to_output.append( raw_compare_to_title, raw_compare_to_content );

			diff_label = `${diff_state} ${compare_to_status}`;
		}
	}

	if ( diff_label !== '' ) {
		preview_label += `<span class="wpgpt-h-label preview"><a href="${url}&historypage" target="_blank">${diff_label}</a></span>`;
		editor_label += `<div class="wpgpt-h-label editor"><a href="${url}&historypage" target="_blank">${diff_label}</a> &#8615;</div>`;
	}

	if ( count_label !== '' ) {
		preview_label += `<span class="wpgpt-h-label preview"><a href="${url}&historypage" target="_blank">${count_label}</a></span>`;
		editor_label += `<div class="wpgpt-h-label editor"><a href="${url}&historypage" target="_blank">${count_label}</a></div>`;
	}

	if ( preview_label !== '' ) {
		jQuery( `#${translation_id.replace( 'editor', 'preview' )}` ).find( '.original-tags' ).append( preview_label );
		jQuery( `#${translation_id}` ).find( '.source-details' ).append( editor_label, diff_output, raw_compare_to_output );
	}
}
