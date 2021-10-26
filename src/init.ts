/*
* Based on https://github.com/Mte90/GlotDict/blob/master/js/init.js
* Scripts are loaded at the end of the head to override some editor keyboard shortcuts*
*/

const wpgpt_scripts = [ 'functions', 'settings', 'checks', 'history', 'bulk-consistency' ];
// wp-gp-tools-consistency.js must load as content_script

wpgpt_load_scripts( wpgpt_scripts );
wpgpt_load_imgs();

function wpgpt_load_imgs() {
	const warning_icon = ( window as any ).chrome.runtime.getURL( 'img/warning.png' );
	const notice_icon = ( window as any ).chrome.runtime.getURL( 'img/notice.png' );
	const img_script = document.createElement( 'script' );
	img_script.type = 'text/javascript';
	img_script.textContent = `var wpgpt_warning_icon = '${warning_icon}'; var wpgpt_notice_icon = '${notice_icon}';`;
	document.getElementsByTagName( 'head' )[0].appendChild( img_script );
}

function wpgpt_load_scripts( resource: string | string[] ): Promise<void> {
	if ( Array.isArray( resource ) ) {
		const prom: Array<Promise<void>> = [];
		resource.forEach( ( item ) => {
			prom.push( wpgpt_load_scripts( item ) );
		} );
		return Promise.all( prom );
	}
	return new Promise<void>( ( resolve, reject ) => {
		let r = false;
		const t = document.getElementsByTagName( 'head' )[0];
		interface Script extends HTMLScriptElement {
			onreadystatechange: Function;
			readyState: boolean | string;

		}
		const	s = document.createElement( 'script' ) as Script;
		s.type = 'text/javascript';
		s.src = ( window as any ).chrome.runtime.getURL( `js/wpgpt-${resource}.js` );
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
