/**
 ** Override (again) and add some shortcuts
 ** Based on: https://meta.trac.wordpress.org/browser/sites/trunk/wordpress.org/public_html/wp-content/plugins/wporg-gp-customizations/templates/js/editor.js#L143
 */
if( typeof $gp !== 'undefined' ){	
	$gp.editor.keydown  = ( function( original ) {
		return function( event ) {
			if ( 13 === event.keyCode && event.shiftKey ) {			// Shift-Enter = Save.
				var $textarea = jQuery( event.target );
				if ( ! $textarea.val().trim() ) {
					$gp.notices.error( 'Translation is empty.' );
					return false;
				}
				var $textareas = $gp.editor.current.find( '.textareas:not(.active) textarea' );
				var isValid = true;
				$textareas.each( function() { if ( ! this.value.trim() ) { isValid = false;	} } );
				if ( ! isValid ) {
					$gp.notices.error( 'Translation is empty.' );
					return false;
				}	
					/**								next_is_strict = true		next_is_strict = false
					 **  warnings_passd = true		false && true = FALSE		false && false = FALSE
					 **  warnings_passd = false		true && true = TRUE			true && false = FALSE
					 */
				if( checks_shortcuts && !run_this_translation_checks( $gp.editor.current.attr( 'id' ) ) && next_is_strict ){ 
					$gp.notices.error( notification_error_message );
					return false;	
					}
				else{
					next_is_strict = true;
					$gp.editor.save( $gp.editor.current.find( 'button.translation-actions__save' ) );
				}
			} else if ( ( 107 === event.keyCode && event.ctrlKey ) || ( 65 === event.keyCode && event.shiftKey && event.ctrlKey ) ) { // Ctrl-+ or Ctrl-Shift-A = Approve.
					approve = jQuery( '.editor:visible' ).find( '.approve' );
					if( approve.length > 0 ){
						if( checks_shortcuts && !run_this_translation_checks( $gp.editor.current.attr( 'id' ) ) && next_is_strict ){ 
							$gp.notices.error( notification_error_message );
							return false;	
						}
						else{
							next_is_strict = true;
							approve.trigger( 'click' );
						}
					}
			} else if ( settings['shortcuts']['state'] == "enabled" && ( ( 106 === event.keyCode && event.ctrlKey ) || ( 70 === event.keyCode && event.shiftKey && event.ctrlKey ) ) ) { // Ctrl-* (NumPad) or Ctrl-Shift-F = Fuzzy.
					reject = jQuery( '.editor:visible' ).find( '.fuzzy' );
					if ( reject.length > 0 ) {
						reject.trigger( 'click' );
					}
			} 
			else{
				return original.apply( $gp.editor, arguments );
			}

			return false;
		}
	})( $gp.editor.keydown );
}