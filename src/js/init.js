/*
* Based on https://github.com/Mte90/GlotDict/blob/master/js/init.js
* Scripts are loaded at the end of the head to override some editor keyboard shortcuts*
*/

const wpgpt_scripts = [ 'functions', 'settings', 'checks', 'history', 'bulk-consistency' ];
// wp-gp-tools-consistency.js must load as content_script

wpgpt_load_scripts( wpgpt_scripts );
wpgpt_load_imgs();

function wpgpt_load_imgs() {
	const assets = document.createElement( 'span' );
	assets.style.display = 'none';
	assets.dataset.warning = chrome.runtime.getURL( 'img/warning.png' );
	assets.dataset.notice = chrome.runtime.getURL( 'img/notice.png' );
	assets.id = 'wpgpt_assets';
	document.querySelector( 'footer' ).appendChild( assets );
}

function wpgpt_load_scripts( resource ) {
	if ( Array.isArray( resource ) ) {
		const self = this,
			prom = [];
		resource.forEach( ( item ) => {
			prom.push( self.wpgpt_load_scripts( item ) );
		} );
		return Promise.all( prom );
	}
	return new Promise( ( resolve, reject ) => {
		let r = false;
		const t = document.getElementsByTagName( 'head' )[0];
		const	s = document.createElement( 'script' );
		s.type = 'text/javascript';
		s.src = chrome.runtime.getURL( `js/wpgpt-${resource}.js` );
		s.async = false;
		s.onload = s.onreadystatechange = function() {
			if ( ! r && ( ! this.readyState || 'complete' === this.readyState ) ) {
				r = true;
				resolve( this );
			}
		};
		s.onerror = s.onabort = reject;
		t.appendChild( s );
	} );
}
