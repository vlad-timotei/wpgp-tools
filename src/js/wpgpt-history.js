/** 
**	Start of jsdiff.js 
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

var JsDiff=function(){function c(e){return{newPos:e.newPos,components:e.components.slice(0)}}function n(e){for(var n=[],t=0;t<e.length;t++)e[t]&&n.push(e[t]);return n}function e(e){this.ignoreWhitespace=e}e.prototype={diff:function(e,n){if(n===e)return[{value:n}];if(!n)return[{value:e,removed:!0}];if(!e)return[{value:n,added:!0}];n=this.tokenize(n),e=this.tokenize(e);var t=n.length,o=e.length,r=t+o,s=[{newPos:-1,components:[]}],i=this.extractCommon(s[0],n,e,0);if(s[0].newPos+1>=t&&o<=i+1)return s[0].components;for(var u=1;u<=r;u++)for(var l=-1*u;l<=u;l+=2){var d,a=s[l-1],p=s[l+1];i=(p?p.newPos:0)-l,a&&(s[l-1]=void 0);var f=a&&a.newPos+1<t,h=p&&0<=i&&i<o;if(f||h){!f||h&&a.newPos<p.newPos?(d=c(p),this.pushComponent(d.components,e[i],void 0,!0)):((d=c(a)).newPos++,this.pushComponent(d.components,n[d.newPos],!0,void 0));i=this.extractCommon(d,n,e,l);if(d.newPos+1>=t&&o<=i+1)return d.components;s[l]=d}else s[l]=void 0}},pushComponent:function(e,n,t,o){var r=e[e.length-1];r&&r.added===t&&r.removed===o?e[e.length-1]={value:this.join(r.value,n),added:t,removed:o}:e.push({value:n,added:t,removed:o})},extractCommon:function(e,n,t,o){for(var r=n.length,s=t.length,i=e.newPos,u=i-o;i+1<r&&u+1<s&&this.equals(n[i+1],t[u+1]);)i++,u++,this.pushComponent(e.components,n[i],void 0,void 0);return e.newPos=i,u},equals:function(e,n){var t=/\S/;return!(!this.ignoreWhitespace||t.test(e)||t.test(n))||e===n},join:function(e,n){return e+n},tokenize:function(e){return e}};var t=new e,o=new e(!0);o.tokenize=function(e){return n(e.split(/(\s+|\b)/))};var r=new e(!0);r.tokenize=function(e){return n(e.split(/([{}:;,]|\s+)/))};var w=new e;return w.tokenize=function(e){return e.split(/^/m)},{Diff:e,diffChars:function(e,n){return t.diff(e,n)},diffWords:function(e,n){return o.diff(e,n)},diffLines:function(e,n){return w.diff(e,n)},diffCss:function(e,n){return r.diff(e,n)},createPatch:function(e,n,t,o,r){var s=[];s.push("Index: "+e),s.push("==================================================================="),s.push("--- "+e+(void 0===o?"":"\t"+o)),s.push("+++ "+e+(void 0===r?"":"\t"+r));var i=w.diff(n,t);function u(e){return e.map(function(e){return" "+e})}function l(e,n,t){var o=i[i.length-2],r=n===i.length-2,o=n===i.length-3&&(t.added!==o.added||t.removed!==o.removed);/\n$/.test(t.value)||!r&&!o||e.push("\\ No newline at end of file")}i[i.length-1].value||i.pop(),i.push({value:"",lines:[]});for(var d=0,a=0,p=[],f=1,h=1,c=0;c<i.length;c++){var v,g=i[c],m=g.lines||g.value.replace(/\n$/,"").split("\n");g.lines=m,g.added||g.removed?(d||(d=f,a=h,(v=i[c-1])&&(d-=(p=u(v.lines.slice(-4))).length,a-=p.length)),p.push.apply(p,m.map(function(e){return(g.added?"+":"-")+e})),l(p,c,g),g.added?h+=m.length:f+=m.length):(d&&(m.length<=8&&c<i.length-2?p.push.apply(p,u(m)):(v=Math.min(m.length,4),s.push("@@ -"+d+","+(f-d+v)+" +"+a+","+(h-a+v)+" @@"),s.push.apply(s,p),s.push.apply(s,u(m.slice(0,v))),m.length<=4&&l(s,c,g),a=d=0,p=[])),f+=m.length,h+=m.length)}return s.join("\n")+"\n"},applyPatch:function(e,n){for(var t,o=n.split("\n"),r=[],s=!1,i=!1,u="I"===o[0][0]?4:0;u<o.length;u++)"@"===o[u][0]?(t=o[u].split(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/),r.unshift({start:t[3],oldlength:t[2],oldlines:[],newlength:t[4],newlines:[]})):"+"===o[u][0]?r[0].newlines.push(o[u].substr(1)):"-"===o[u][0]?r[0].oldlines.push(o[u].substr(1)):" "===o[u][0]?(r[0].newlines.push(o[u].substr(1)),r[0].oldlines.push(o[u].substr(1))):"\\"===o[u][0]&&("+"===o[u-1][0]?s=!0:"-"===o[u-1][0]&&(i=!0));for(var l=e.split("\n"),u=r.length-1;0<=u;u--){for(var d=r[u],a=0;a<d.oldlength;a++)if(l[d.start-1+a]!==d.oldlines[a])return!1;Array.prototype.splice.apply(l,[d.start-1,+d.oldlength].concat(d.newlines))}if(s)for(;!l[l.length-1];)l.pop();else i&&l.push("");return l.join("\n")},convertChangesToXML:function(e){for(var n=[],t=0;t<e.length;t++){var o=e[t];o.added?n.push("<ins class='diff'>"):o.removed&&n.push("<del class='diff'>"),n.push(o.value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")),o.added?n.push("</ins>"):o.removed&&n.push("</del>")}return n.join("")},convertChangesToDMP:function(e){for(var n,t=[],o=0;o<e.length;o++)n=e[o],t.push([n.added?1:n.removed?-1:0,n.value]);return t}}}();"undefined"!=typeof module&&(module.exports=JsDiff);

/** 
**	End of jsdiff.js
**	Start of wpgpt-history.js
**/

if ( wpgpt_settings['string_history']['state'] == 'enabled' )
	wpgpt_load_history_status();

function wpgpt_load_history_status(){
	if( typeof $gp !== 'undefined' ){
		var rows = jQuery('#translations tbody tr.editor');
		rows.each( function(){
			var translation_status = jQuery( this ).find('.panel-header__bubble').attr('class').split(/\s+/)[1].replace('panel-header__bubble--','');
			if( translation_status !== 'current' || wpgpt_settings['string_history_current']['state'] == 'enabled' ){
				var translation_id = jQuery( this ).attr('id');
				var string_id = translation_id.split( '-', 3 )[1];
				var url = 'https://translate.wordpress.org' + window.location.pathname + '?filters%5Bstatus%5D=either&filters%5Boriginal_id%5D=' + string_id + '&sort%5Bby%5D=translation_date_added&sort%5Bhow%5D=desc';
				const data = fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
					.then( response => response.text() )
					.then( data => {
						wpgpt_display_history_status( data, translation_id, translation_status, url);
					} )
					.catch(error => console.error(error));
			}
		});
	}
}

function wpgpt_display_history_status( data, translation_id, translation_status, url ){
	var current_translation_row, current_translation, waiting_translation_row, waiting_translation, old_translation_row, rejected_translation_row, diff_state, editor_output = '', preview_output = ''; 
	var history_page = jQuery.parseHTML( data );
	if ( ['old', 'waiting', 'rejected'].includes( translation_status ) ){
		current_translation_row = jQuery( history_page ).find('#translations tbody tr.preview.status-current');
		if( current_translation_row.length  ){
			current_translation = jQuery( current_translation_row[0] ).find(".translation-text").text();
			diff_state = ( ( jQuery( '#' + translation_id ).find('textarea').text() !== current_translation ) ? 'different' : 'identical' );
			preview_output = '<span class="h-current">Existing <b>' + diff_state + ' current</b> translation</span>';
			editor_output = '<div class="wpgpt-h-editor h-current">' + preview_output + JsDiff.convertChangesToXML( JsDiff['diffWords']( current_translation, jQuery( '#' + translation_id ).find('textarea').text() ) ); + '</div>';		
		}
	}
	if ( 'fuzzy' == translation_status ){
		waiting_translation_row = jQuery( history_page ).find('#translations tbody tr.preview.status-waiting');
		if( waiting_translation_row.length  ){
			waiting_translation = jQuery( waiting_translation_row[0] ).find(".translation-text").text();
			diff_state = ( ( jQuery( '#' + translation_id ).find('textarea').text() !== waiting_translation ) ? 'different' : 'identical' );
			preview_output = '<span class="h-waiting">Existing <b>' + diff_state + ' waiting</b> translation</span>';
			editor_output = '<div class="wpgpt-h-editor h-waiting">' + preview_output + JsDiff.convertChangesToXML( JsDiff['diffWords']( current_translation, jQuery( '#' + translation_id ).find('textarea').text() ) ); + '</div>';		
		}
	}
	if ( 'current' == translation_status ){
		waiting_translation_row = jQuery( history_page ).find('#translations tbody tr.preview.status-waiting');
		old_translation_row = jQuery( history_page ).find('#translations tbody tr.preview.status-old');
		rejected_translation_row = jQuery( history_page ).find('#translations tbody tr.preview.status-rejected'); 	
		preview_output = ( waiting_translation_row.length ) ? ( waiting_translation_row.length + ' waiting string(s)') : '';
		preview_output+= ( preview_output !== '' ) ? ' and ' : '';
		preview_output+= ( old_translation_row.length ) ? ( old_translation_row.length + ' old string(s)') : '';
		preview_output+= ( preview_output !== '' ) ? ' and ' : '';
		preview_output+= ( rejected_translation_row.length ) ? ( rejected_translation_row.length + ' rejected string(s)') : '';
		preview_output = ( preview_output!= '' ) ? ( '<span class="h-misc"><a href="' + url + '" target="_new">' + preview_output + '</a></span>' ) : '';
		editor_output = '<div class="wpgpt-h-editor h-misc">' + preview_output + '</div>';
	}
	jQuery( '#' + translation_id.replace('editor', 'preview') ).find( ".translation .translation-text" ).append( '<div class="wpgpt-h-preview">' + preview_output + '</div>' );	
	jQuery( '#' + translation_id ).find( ".editor-panel__left .panel-content" ).prepend( editor_output );
}