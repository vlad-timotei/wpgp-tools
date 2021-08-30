if ( 'enabled' === wpgpt_settings.bulk_consistency.state ) {
	wpgpt_do_bulk_consistency();
}
function wpgpt_do_bulk_consistency() {
	if ( window.location.href.includes( '#magicsaveclose_T_WPORG' ) ) {
		const wpgpt_bulk_warning = $wpgpt_createElement( 'div', { 'class': 'wpgpt-bulk-warning' } );
		if ( $gp_editor_options.can_approve !== '1' ) {
			wpgpt_bulk_warning.textContent = 'You don\'t have the required permissions for this project! This tab will close.';
			$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
			setTimeout( () => { window.close(); }, 5000 );
			return;
		}
		let replacement_alternative = localStorage.getItem( 'wpgpt_chosen_alternative' );
		if ( null === replacement_alternative || 'undefined' === replacement_alternative ) {
			wpgpt_bulk_warning.textContent = 'Empty alternative! No action taken. You may close this tab.';
			$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
			return;
		}
		replacement_alternative = JSON.parse( replacement_alternative );

		const translation_forms = document.querySelectorAll( '.translation-wrapper textarea' );
		if ( translation_forms.length !== replacement_alternative.length ) {
			wpgpt_bulk_warning.textContent = 'The number of plural forms doesn\'t match. No action taken. You may close this tab.';
			$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
			return;
		}

		translation_forms.forEach( ( form, form_i ) => {
			if ( '' === replacement_alternative[ form_i ] ) {
				wpgpt_bulk_warning.textContent = 'One or more translations are empty. No action taken. You may close this tab.';
				$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
				return;
			}
			form.value = replacement_alternative[ form_i ];
		} );

		const comment_el = document.querySelector( '.source-details__comment' );
		if ( comment_el !== null ) {
			const comment = comment_el.textContent;
			if ( wpgpt_occurrences( comment, 'name' ) && ( wpgpt_occurrences( comment, 'plugin' ) || wpgpt_occurrences( comment, 'theme' ) || wpgpt_occurrences( comment, 'author' ) ) ) {
				wpgpt_bulk_warning.innerHTML = 'WPGPT: This might be the name of a plugin, theme or author. <br>If not, please click Save!';
				$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
				comment_el.open = true;
				return;
			}
		}
		gp_action( 'save' );
		return;
	}

	if ( window.location.href.includes( '#magicrejectclose_T_WPORG' ) ) {
		if ( $gp_editor_options.can_approve !== '1' ) {
			window.close();
			return;
		}
		gp_action( 'reject' );
	}

	function gp_action( action_type ) {
		if ( null === $gp.editor.current || 'undefined' === typeof $gp.editor.current ) {
			console.log( `$gp.editor.current not available yet. Trying to ${action_type} after 1 second again.` );
			setTimeout( () => { gp_action( action_type ) }, 1000 );
			return;
		}
		switch ( action_type ) {
		case 'save':
			$gp.editor.save( $gp.editor.current.find( 'button.translation-actions__save' ) );
			console.log( 'I pressed Save button!' );
			break;
		case 'reject':
			$gp.editor.set_status( $gp.editor.current.find( 'button.reject' ), 'rejected' );
			console.log( 'I pressed Reject button!' );
			break;
		}
		// setTimeout( () => { window.close(); }, 3000 );
	}
}
