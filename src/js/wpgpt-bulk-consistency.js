if ( 'enabled' === wpgpt_settings.bulk_consistency.state ) {
	wpgpt_do_bulk_consistency();
}
function wpgpt_do_bulk_consistency() {
	if ( window.location.href.includes( '#magicsaveclose_T_WPORG' ) ) {
		const wpgpt_bulk_warning = $wpgpt_createElement( 'div', { 'class': 'wpgpt-bulk-warning' } );
		if ( $gp_editor_options.can_approve !== '1' ) {
			wpgpt_bulk_warning.textContent = 'WPGPT: You don\'t have the required permissions for this project!';
			$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
			setTimeout( () => { window.close(); }, 5000 );
			return;
		}
		let replacement_alternative = localStorage.getItem( 'wpgpt_chosen_alternative' );
		if ( null === replacement_alternative || 'undefined' === replacement_alternative ) {
			wpgpt_bulk_warning.textContent = 'WPGPT: Empty alternative! Please try again!';
			$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
			return;
		}
		replacement_alternative = JSON.parse( replacement_alternative );

		const translation_forms = document.querySelectorAll( '.translation-wrapper textarea' );
		if ( translation_forms.length !== replacement_alternative.length ) {
			wpgpt_bulk_warning.textContent = 'WPGPT: The number of plural forms doesn\'t match. Please try again.';
			$wpgpt_addElement( '.translation-wrapper', 'beforebegin', wpgpt_bulk_warning );
			return;
		}

		translation_forms.forEach( ( form, form_i ) => {
			if ( '' === replacement_alternative[ form_i ] ) {
				wpgpt_bulk_warning.textContent = 'WPGPT: One or more translations are empty. Please try again.';
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

		$gp.editor.save( $gp.editor.current.find( 'button.translation-actions__save' ) );
		setTimeout( () => { window.close(); }, 3000 );
		return;
	}

	if ( window.location.href.includes( '#magicrejectclose_T_WPORG' ) ) {
		if ( $gp_editor_options.can_approve !== '1' ) {
			window.close();
			return;
		}
		$gp.editor.set_status( $gp.editor.current.find( 'button.reject' ), 'rejected' );
		setTimeout( () => { window.close(); }, 3000 );
	}
}
