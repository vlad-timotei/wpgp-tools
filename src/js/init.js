/**
 ** Based on https://github.com/Mte90/GlotDict/blob/master/js/init.js 
 ** Scripts are loaded at the end of the head to override some editor keyboard shortcuts*
 */

var wpgpt_scripts = ['functions', 'settings' , 'checks', 'shortcuts', 'history' ];
/** wp-gp-tools-consistency.js must load as content_script to prevent new windows being blocked */

wpgpt_load_scripts( wpgpt_scripts );
wpgpt_load_imgs();

function wpgpt_load_imgs(){
	var warning_icon = chrome.extension.getURL('img/warning.png');
	var notice_icon = chrome.extension.getURL('img/notice.png');
	var img_script = document.createElement('script');
	img_script.type = 'text/javascript';
	img_script.innerHTML = ' var warning_icon = "' + warning_icon + '"; var notice_icon = "' + notice_icon + '";';    
	document.getElementsByTagName('head')[0].appendChild( img_script );
}

function wpgpt_load_scripts( resource ){
  if( Array.isArray( resource ) ){
    var self = this,
      prom = [];
    resource.forEach( function( item ){
      prom.push( self.wpgpt_load_scripts( item ) );
    });
    return Promise.all( prom );
  } 
  return new Promise( function( resolve, reject ) {
    var r = false,
	t = document.getElementsByTagName('head')[0],
    s = document.createElement('script'); 
    s.type = 'text/javascript';
    s.src = chrome.extension.getURL('js/wpgpt-' + resource + '.js');
    s.async = false;
    s.onload = s.onreadystatechange = function() {
      if( !r && (!this.readyState || this.readyState === 'complete') ){
        r = true;
        resolve( this );
      }
    };
    s.onerror = s.onabort = reject;
    t.appendChild( s );
  });
}