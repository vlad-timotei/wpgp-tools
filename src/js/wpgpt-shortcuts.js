// Based on: https://meta.trac.wordpress.org/browser/sites/trunk/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/js/editor.js#L143
if ( typeof $gp_editor_options !== 'undefined' ) {
	$gp.editor.keydown = ( function( original ) {
		return function( event ) {
			if ( 13 === event.keyCode && event.shiftKey ) {	// Shift-Enter = Save.
				wpgpt_save( event.target.closest( '.editor-panel' ).querySelector( 'button.translation-actions__save' ), event.ctrlKey );
			} else if ( ( 107 === event.keyCode && event.ctrlKey ) || ( 65 === event.keyCode && event.shiftKey && event.ctrlKey ) ) { // Ctrl-+ or Ctrl-Shift-A = Approve.
				wpgpt_save( event.target.closest( '.editor-panel' ).querySelector( '.approve' ) );
			} else if ( 'enabled' === wpgpt_settings.shortcuts.state && ( ( 106 === event.keyCode && event.ctrlKey ) || ( 70 === event.keyCode && event.shiftKey && event.ctrlKey ) ) ) { // Ctrl-* (NumPad) or Ctrl-Shift-F = Fuzzy.
				const fuzzy = event.target.closest( '.editor-panel' ).querySelector( '.fuzzy' );
				fuzzy && fuzzy.click();
			} else {
				return original.apply( $gp.editor, arguments );
			}
			return false;
		};
	} )( $gp.editor.keydown );
}

/**
*                         wpgpt_next_is_strict = true  wpgpt_next_is_strict = false
* warnings_passd = true   false && true = FALSE        false && false = FALSE
* warnings_passd = false  true && true = TRUE          true && false = FALSE
*/
function wpgpt_save( save, forced_save = false ) {
	if ( forced_save ) {
		wpgpt_next_is_strict = false;
	}
	if ( wpgpt_checks_shortcuts && ! wpgpt_check_this_translation( `#${$gp.editor.current.attr( 'id' )}`, `#${$gp.editor.current.attr( 'id' ).replace( 'editor', 'preview' )}` ) && wpgpt_next_is_strict ) {
		$gp.notices.error( wpgpt_error_message );
		return false;
	} else {
		document.querySelectorAll( '.wpgpt-ignore-warnings input' ).forEach( ( check ) => { check.checked = false; } );
		wpgpt_user_edited = false;
		save.click();
	}
	wpgpt_next_is_strict = true;
}
