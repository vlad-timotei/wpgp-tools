if ( wpgpt_settings.bulk_consistency.state == 'enabled' ) {
    wpgpt_do_bulk_consistency();
}
function wpgpt_do_bulk_consistency(){
    if ( window.location.href.includes( '#magicsaveclose_T_WPORG' ) ) {
        if ( $gp_editor_options.can_approve !== '1' ) {
            jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: You don\'t have the required permissions for this project!</div>' );
            setTimeout( function(){ window.close(); }, 5000 );
            return;
        }
        var replacement_alternative = localStorage.getItem( 'wpgpt_chosen_alternative' );
        if ( replacement_alternative == null || replacement_alternative == 'undefined' ) {
            jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: Empty alternative! Please try again!</div>' );
            return;
        }
        replacement_alternative = JSON.parse( replacement_alternative );
        var this_textareas = jQuery( '.translation-wrapper textarea' );
        if ( this_textareas.length !== replacement_alternative.length ) {
            jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: The number of plural forms doesn\'t match. Please try again.</div>' );
            return;
        }

        for ( var i = 0; i < this_textareas.length; i++ ) {
            if ( replacement_alternative[ i ] === '' ) {
                jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: One or more translations are empty. Please try again.</div>' );
                return;
            }
            jQuery( this_textareas[ i ] ).text( replacement_alternative [ i ] );
        }

        var comment_el = document.querySelector( '.source-details__comment p' );
        if ( comment_el !== null ) {
            var comment = comment_el.textContent;
            if ( occurrences( comment, 'name' ) && ( occurrences( comment, 'plugin' ) || occurrences( comment, 'theme' ) ||  occurrences( comment, 'author' ) ) ) {
                jQuery( comment_el ).after( '<br><strong style="color:red;">This might be the name of a plugin, theme or author.</strong><br> If not, please click Save!' );
                return;
            }
        }

       $gp.editor.save( $gp.editor.current.find( 'button.translation-actions__save' ) );
       setTimeout( function(){ window.close(); }, 3000 );
       return;
    }

    if ( window.location.href.includes( '#magicrejectclose_T_WPORG' ) ) {
        if ( $gp_editor_options.can_approve !== '1' ) {
            window.close();
            return;
        }
        $gp.editor.set_status( $gp.editor.current.find( 'button.reject' ), 'rejected' );
        setTimeout( function(){ window.close(); }, 3000 );
        return;
    }
}