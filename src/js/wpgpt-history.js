/** 
**	This script uses jsdiff.js in variable JSDiff;
** 	Source: https://github.com/kpdecker/jsdiff 
** 	As seen on: http://jsfiddle.net/ARTsinn/MQdFw/ 
*/
/*Software License Agreement (BSD License)

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

var JsDiff;

function wpgpt_init_history_status(){
	if ( wpgpt_settings['history_main']['state'] == 'disabled' )
		return; 
	if ( document.location.href.includes('historypage') && wpgpt_settings['history_page']['state'] == 'disabled' )
		return;
	
	JsDiff = (function () {
		function clonePath(path) {
			return {
				newPos: path.newPos,
				components: path.components.slice(0)
			};
		}

		function removeEmpty(array) {
			var ret = [];
			for (var i = 0; i < array.length; i++) {
				if (array[i]) {
					ret.push(array[i]);
				}
			}
			return ret;
		}

		function escapeHTML(s) {
			var n = s;
			n = n.replace(/&/g, '&amp;');
			n = n.replace(/</g, '&lt;');
			n = n.replace(/>/g, '&gt;');
			n = n.replace(/"/g, '&quot;');

			return n;
		}

		var Diff = function (ignoreWhitespace) {
			this.ignoreWhitespace = ignoreWhitespace;
		};
		Diff.prototype = {
			diff: function (oldString, newString) {
				if (newString === oldString) {
					return [{
						value: newString
					}];
				}
				if (!newString) {
					return [{
						value: oldString,
						removed: true
					}];
				}
				if (!oldString) {
					return [{
						value: newString,
						added: true
					}];
				}

				newString = this.tokenize(newString);
				oldString = this.tokenize(oldString);

				var newLen = newString.length,
					oldLen = oldString.length;
				var maxEditLength = newLen + oldLen;
				var bestPath = [{
					newPos: -1,
					components: []
				}];

				var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
				if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
					return bestPath[0].components;
				}

				for (var editLength = 1; editLength <= maxEditLength; editLength++) {
					for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
						var basePath;
						var addPath = bestPath[diagonalPath - 1],
							removePath = bestPath[diagonalPath + 1];
						oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
						if (addPath) {
							bestPath[diagonalPath - 1] = undefined;
						}

						var canAdd = addPath && addPath.newPos + 1 < newLen;
						var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
						if (!canAdd && !canRemove) {
							bestPath[diagonalPath] = undefined;
							continue;
						}

						if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
							basePath = clonePath(removePath);
							this.pushComponent(basePath.components, oldString[oldPos], undefined, true);
						} else {
							basePath = clonePath(addPath);
							basePath.newPos++;
							this.pushComponent(basePath.components, newString[basePath.newPos], true, undefined);
						}

						var oldPos = this.extractCommon(basePath, newString, oldString, diagonalPath);

						if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
							return basePath.components;
						} else {
							bestPath[diagonalPath] = basePath;
						}
					}
				}
			},

			pushComponent: function (components, value, added, removed) {
				var last = components[components.length - 1];
				if (last && last.added === added && last.removed === removed) {
					components[components.length - 1] = {
						value: this.join(last.value, value),
						added: added,
						removed: removed
					};
				} else {
					components.push({
						value: value,
						added: added,
						removed: removed
					});
				}
			},
			extractCommon: function (basePath, newString, oldString, diagonalPath) {
				var newLen = newString.length,
					oldLen = oldString.length,
					newPos = basePath.newPos,
					oldPos = newPos - diagonalPath;
				while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
					newPos++;
					oldPos++;

					this.pushComponent(basePath.components, newString[newPos], undefined, undefined);
				}
				basePath.newPos = newPos;
				return oldPos;
			},

			equals: function (left, right) {
				var reWhitespace = /\S/;
				if (this.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right)) {
					return true;
				} else {
					return left === right;
				}
			},
			join: function (left, right) {
				return left + right;
			},
			tokenize: function (value) {
				return value;
			}
		};

		var CharDiff = new Diff(false); // Don't ignoreWhitespace

		var WordDiff = new Diff(true);
		WordDiff.tokenize = function (value) {
			return removeEmpty(value.split(/(\s+|\b)/));
		};

		return {
			Diff: Diff,

			diffChars: function (oldStr, newStr) {
				return CharDiff.diff(oldStr, newStr);
			},
			diffWords: function (oldStr, newStr) {
				return WordDiff.diff(oldStr, newStr);
			},
			
			convertChangesToXML: function (changes) {
				var ret = [];
				for (var i = 0; i < changes.length; i++) {
					var change = changes[i];
					if (change.added) {
						ret.push("<ins class='diff'>");
					} else if (change.removed) {
						ret.push("<del class='diff'>");
					}

					ret.push(escapeHTML(change.value));

					if (change.added) {
						ret.push('</ins>');
					} else if (change.removed) {
						ret.push('</del>');
					}
				}
				return ret.join('');
			}
		};
	})();

	wpgpt_load_history_status();
}

function wpgpt_load_history_status(){
	if( typeof $gp !== 'undefined' ){
		var rows = jQuery('#translations tbody tr.editor');
		rows.each( function(){
			var translation_status = jQuery( this ).find('.panel-header__bubble').attr('class').split(/\s+/)[1].replace('panel-header__bubble--','');
			if( translation_status !== 'current' || wpgpt_settings['history_current']['state'] == 'enabled' ){
				var translation_id = jQuery( this ).attr('id');
				var string_id = translation_id.split( '-', 3 )[1];
				var url = 'https://translate.wordpress.org' + window.location.pathname + '?filters%5Bstatus%5D=either&filters%5Boriginal_id%5D=' + string_id + '&sort%5Bby%5D=translation_date_added&sort%5Bhow%5D=desc';
				const data = fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
					.then( response => response.text() )
					.then( data => {
						wpgpt_analyse_history_status( data, translation_id, translation_status, url);
					} )
					.catch(error => console.error(error));
			}
		});
	}
}

/**
** 			This string status:				
**			Current						=>	counts Waiting, Old and Rejected
**			Old, Rejected and Waiting 	=>	compares to Current
**			Fuzzy 						=> 	compares to Waiting
**/
function wpgpt_analyse_history_status( data, translation_id, translation_status, url ){
	var compare_to = 'current',	compare_to_row = [], compare_to_translation = [], this_translation = [],
		diff_state = 'identical', diff_output = '', preview_label = '', single_multiple, raw_compare_to='',
		history_page = jQuery.parseHTML( data );
		
	if ( 'current' == translation_status ){
		compare_to_row[0] = jQuery( history_page ).find('#translations tbody tr.preview.status-waiting');
		compare_to_row[1] = jQuery( history_page ).find('#translations tbody tr.preview.status-old');
		compare_to_row[2] = jQuery( history_page ).find('#translations tbody tr.preview.status-rejected'); 	
		preview_label = ( compare_to_row[0].length ) ? ( compare_to_row[0].length + ' waiting string' + ( ( compare_to_row[0].length > 1 ) ? 's' : '' ) ) : '';
		preview_label+= ( compare_to_row[1].length ) ? ( ( ( preview_label !== '' ) ? ' and ' : '' ) + compare_to_row[1].length + ' old string' + ( ( compare_to_row[1].length > 1 ) ? 's' : '' ) ) : '';
		preview_label+= ( compare_to_row[2].length ) ? ( ( ( preview_label !== '' ) ? ' and ' : '' ) + compare_to_row[2].length + ' rejected string' + ( ( compare_to_row[2].length > 1 ) ? 's' : '' ) ) : '';
		if ( preview_label !== '' ) {
			preview_label = '<a href="' + url + '&historypage" target="_blank">' + preview_label + ' - view History </a>';
			jQuery ('#' + translation_id ).find(".source-details").append( '<div class="wpgpt-h-label editor">' + preview_label + '</div>');
			jQuery( '#' + translation_id.replace('editor', 'preview') ).find( ".original-text" ).append( '<div class="wpgpt-h-label preview">' + preview_label + '</div>' );	
		}
		return;
	}		
						
	if ( translation_status == 'fuzzy' ){
		compare_to = 'waiting';	
	}
	compare_to_row = jQuery( history_page ).find('#translations tbody tr.preview.status-' + compare_to );
	if( compare_to_row.length  ){
		jQuery( '#' + translation_id.replace('editor', 'preview') ).find( ".translation-text" ).each( function(){ this_translation.push( jQuery( this ).text() ); } );
		jQuery( compare_to_row[0] ).find(".translation-text").each( function(){ compare_to_translation.push( jQuery( this ).text() ); } );
		
		single_multiple = ( this_translation.length > 1 ) ? 'multiple' : 'single'; 
		diff_output = '<details class="wpgpt_diff ' + single_multiple + '"><summary>Differences between <b> this ' + translation_status + '</b> string and <b>' + compare_to +'</b> string</summary><ol>';
		raw_compare_to = '<details class="wpgpt_compared_to ' + single_multiple + '"><summary><b>' + compare_to.charAt(0).toUpperCase() + compare_to.slice(1) + '</b> string from History</summary><ol>';
		
		for ( var i = 0; i < this_translation.length; i++ ){
			if( this_translation[ i ] !== compare_to_translation[ i ] ){
				diff_state = 'different';
				diff_output += '<li>' + JsDiff.convertChangesToXML( JsDiff['diffChars']( this_translation[ i ], compare_to_translation[ i ] ) ) + '</li>';
			}
			else {
				diff_output += '<li>' + this_translation[ i ] + '</li>';
			}
			raw_compare_to += '<li>' + compare_to_translation[ i ] + '</li>'
		}
		diff_output += '</ol></details>';
		raw_compare_to += '</ol></details';
		preview_label = 'Existing <b>' + diff_state + ' ' + compare_to + '</b> translation';
	}
	if( preview_label !== '' ){
		jQuery ('#' + translation_id ).find(".source-details").append( '<div class="wpgpt-h-label editor details">' + preview_label + '</div>' + diff_output + raw_compare_to );
		jQuery( '#' + translation_id.replace('editor', 'preview') ).find( ".original-text" ).append( '<div class="wpgpt-h-label preview">' + preview_label + '</div>' );	
	}
}
wpgpt_init_history_status();