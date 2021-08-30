/*
* Override GP (again) and add some shortcuts
* Based on: https://meta.trac.wordpress.org/browser/sites/trunk/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/js/editor.js#L143
*/
if ( typeof $gp !== 'undefined' ) {
	$gp.editor.keydown = ( function( original ) {
		return function( event ) {
			if ( 13 === event.keyCode && event.shiftKey ) {			// Shift-Enter = Save.
				const $textarea = jQuery( event.target );
				if ( ! $textarea.val().trim() ) {
					$gp.notices.error( 'Translation is empty.' );
					return false;
				}
				const $textareas = $gp.editor.current.find( '.textareas:not(.active) textarea' );
				let isValid = true;
				$textareas.each( function() { if ( ! this.value.trim() ) { isValid = false;	} } );
				if ( ! isValid ) {
					$gp.notices.error( 'Translation is empty.' );
					return false;
				}
				/*								wpgpt_next_is_strict = true		wpgpt_next_is_strict = false
					 * warnings_passd = true		false && true = FALSE			false && false = FALSE
					 *  warnings_passd = false		true && true = TRUE				true && false = FALSE
					 */
				if ( wpgpt_checks_shortcuts && ( ! wpgpt_check_this_translation( $gp.editor.current.attr( 'id' ) ) ) && wpgpt_next_is_strict ) {
					$gp.notices.error( wpgpt_error_message );
					return false;
				} else {
					wpgpt_next_is_strict = true;
					jQuery( '.wpgpt-ignore-warnings input' ).prop( 'checked', false );
					wpgpt_user_edited = false;
					$gp.editor.save( $gp.editor.current.find( 'button.translation-actions__save' ) );
				}
			} else if ( ( 107 === event.keyCode && event.ctrlKey ) || ( 65 === event.keyCode && event.shiftKey && event.ctrlKey ) ) { // Ctrl-+ or Ctrl-Shift-A = Approve.
				const approve = jQuery( '.editor:visible' ).find( '.approve' );
				if ( approve.length > 0 ) {
					if ( wpgpt_checks_shortcuts && ( ! wpgpt_check_this_translation( $gp.editor.current.attr( 'id' ) ) ) && wpgpt_next_is_strict ) {
						$gp.notices.error( wpgpt_error_message );
						return false;
					} else {
						approve.trigger( 'click' );
						jQuery( '.wpgpt-ignore-warnings input' ).prop( 'checked', false );
						wpgpt_user_edited = false;
						wpgpt_next_is_strict = true;
					}
				}
			} else if ( 'enabled' === wpgpt_settings.shortcuts.state && ( ( 106 === event.keyCode && event.ctrlKey ) || ( 70 === event.keyCode && event.shiftKey && event.ctrlKey ) ) ) { // Ctrl-* (NumPad) or Ctrl-Shift-F = Fuzzy.
				const reject = jQuery( '.editor:visible' ).find( '.fuzzy' );
				if ( reject.length > 0 ) {
					reject.trigger( 'click' );
				}
			} else {
				return original.apply( $gp.editor, arguments );
			}

			return false;
		};
	} )( $gp.editor.keydown );
}
