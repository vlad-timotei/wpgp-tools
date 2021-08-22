if ( wpgpt_settings.bulk_consistency.state == 'enabled' ) {
    wpgpt_consistency_replace();
    var alternatives_data = [],
    alternatives_forms = [];
}
function wpgpt_consistency_replace(){
    if ( window.location.href.includes( 'wordpress.org/consistency' ) ) {
        var wpgpt_safe_limit = 25;
        localStorage.removeItem( 'wpgpt_chosen_alternative' );

        var view_unique = document.querySelector( '.translations-unique' );
        if ( view_unique ) {
            view_unique.classList.remove( 'hidden' );
		}

        if( jQuery('.consistency-table' ).length ){
            jQuery( '#translations-overview p' ).prepend( '<div id="bulk-instructions">To bulk replace translations: <ol><li>Set a translation to replace the others with.</li><li>Choose translations that you don\'t want to be replaced.</li><li>Click "Bulk replace & Save".</li>Note: You need to Allow pop-ups for translate.wordpress.org</ol></div>' );
            jQuery( '.notice' ).prepend('<div class="fire_magic_reject_close_div">Danger zone: <button class="fire_magic_reject_close">Reject all translations</button></div>');
            jQuery( '#translations-overview' ).after( '<button style="display:none;" class="fire_magic_save_close">Bulk replace & Save</button>' );
        }

        var consistency_rows = jQuery( '.consistency-table tbody tr' );
        var alternative_id, alternatives_url = {};
        for ( var i = 0; i < consistency_rows.length; i++ ) {
            var row_id =  jQuery( consistency_rows[ i ] ).attr( 'id' );
            if ( row_id ) { // Alternative header
                alternative_id = row_id;
                alternatives_url[ row_id ] = jQuery( consistency_rows[ i + 1 ] ).find( 'td:odd() .meta a' ).attr( 'href' );
            }
            jQuery( consistency_rows[ i ] ).addClass( 'alternative-' + alternative_id );
        }

        var unique_translations = jQuery( '.translations-unique li a.anchor-jumper' );
        for ( var i = 0; i < unique_translations.length; i++ ) {
            var unique_translation_id = jQuery( unique_translations[ i ] ).attr( 'href' ).replace( '#', '' );
            var btns = '<div class="wpgpt-bulk-buttons"><span class="wpgpt_loading" >Loading...</span> &nbsp; <button id="choose-' + unique_translation_id + '" class="choose-consistency-string" style="display:none"t ype="button">Set this translation as replacement</button>';
            btns += '  &nbsp; <button id="delete-' + unique_translation_id + '" class="delete-consistency-strings" style="display:none" type="button" disabled>Do not replace this</button></div>';
            jQuery( unique_translations[ i ] ).after( btns );
            var is_last = ( i === ( unique_translations.length - 1 ) ) ? true : false;
            wpgpt_get_alternative( alternatives_url[ unique_translation_id ], unique_translation_id, unique_translations[ i ], is_last );
        }

        jQuery( '.choose-consistency-string' ).click( function(){
            var alternative_id = jQuery( this ).attr( 'id' ).replace( 'choose-', '' );
            localStorage.setItem( 'wpgpt_chosen_alternative', JSON.stringify( alternatives_data [ alternative_id ] ) );
            jQuery( '#delete-' + alternative_id ).click();
            jQuery( '.delete-consistency-strings' ).prop( 'disabled', false );
            jQuery( '.choose-consistency-string' ).prop( 'disabled', true );
            jQuery( '.fire_magic_save_close' ).show();
            jQuery( this )
                .before( '<b>This translation will be used to replace all others.</b>' )
                .remove();
            jQuery( '.consistency-table' ).prepend( '<thead><tr><th colspan="2">These are the transations that will be replaced:</th></tr></thead>' );
        });

        jQuery( '.delete-consistency-strings').click( function(){
            jQuery( '.alternative-' + jQuery( this ).attr( 'id' ).replace( 'delete-', '' ) ).remove();
            jQuery( this )
                 .before( 'These strings will not be replaced.' )
                 .remove();
         });


        jQuery( '.fire_magic_save_close' ).click( function(){
            if ( localStorage.getItem( 'wpgpt_chosen_alternative' ) === null ) {
                console.log( 'Unexpected error, please contact developers and let them know that upon `.fire_magic_save_close` click, localStorage is still empty!' );
                return;
            }
            var chosen_alternative_data = JSON.parse( localStorage.getItem( 'wpgpt_chosen_alternative' ) );
            var chosen_alternative = '';
            if ( chosen_alternative_data.length > 1 ){
                for ( var i = 0; i < chosen_alternative_data.length; i++ ){
                    chosen_alternative += alternatives_forms[ i ] + ': ' + chosen_alternative_data[ i ] + '\n';
                }
            } else {
                chosen_alternative = chosen_alternative_data[ 0 ];
            }
            var replace_strings = jQuery( '.consistency-table tr td:odd() .meta a' );
            var replace_strings_length = ( replace_strings.length > wpgpt_safe_limit ) ? wpgpt_safe_limit : replace_strings.length;
            var confirm_msg = replace_strings_length + ' selected strings will be REPLACED with:\n\n' + chosen_alternative + '\n\n';
            confirm_msg += ( ( replace_strings.length > wpgpt_safe_limit ) ? ( 'For safety, only ' + replace_strings_length + ' out of ' + replace_strings.length + ' can be replaced in one go.\n' ) : '' );
            confirm_msg += 'A log of replaced translations will be downloaded. \nAre you sure?';
            if ( confirm( confirm_msg ) ) {
                var replace_strings_urls = '', wpgpt_safe_limit_index = 1;
                replace_strings.each( function(){
                    if ( wpgpt_safe_limit_index > wpgpt_safe_limit ){
                        return false;
                    }
                    wpgpt_safe_limit_index++;
                    var this_url = jQuery( this ).attr( 'href' );
                    replace_strings_urls +='https://translate.w.org' + this_url + '\n';
                    window.open( this_url + '#magicsaveclose_T_WPORG' );
                });
                var original_string = jQuery('#original').val();
                var current_date = new Date();
                wpgpt_download( '[' + current_date.toLocaleString( [], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' } ) + '][WPGPT Log][' + replace_strings_length + ' replacements]', 'Date: ' + current_date.toLocaleDateString() + ' at ' + current_date.toLocaleTimeString() + '\nOriginal: ' + original_string + '\nReplaced with: `' + chosen_alternative + '`\n' + replace_strings_length + ' replaced translations:\n' + replace_strings_urls );
            } else { alert( 'Phew! Ok!' ); }
        });

        jQuery( '.fire_magic_reject_close' ).click( function(){
            var reject_strings =  jQuery( '.consistency-table tr td:odd() .meta a' );
            var reject_strings_length = ( reject_strings.length > wpgpt_safe_limit ) ? wpgpt_safe_limit : reject_strings.length;
            var confirm_msg = reject_strings_length + ' strings will be REJECTED! \n\n';
            confirm_msg += ( (  reject_strings.length > wpgpt_safe_limit ) ? ( 'For safety, only ' + reject_strings_length + ' out of ' + reject_strings.length + ' strings can be rejected in one go.\n' ) : '' );
            confirm_msg += 'A log of rejected translations will be downloaded. \nAre you sure?';
            if ( confirm( confirm_msg ) ) {
                var reject_strings_urls = '', wpgpt_safe_limit_index = 1;
                reject_strings.each( function(){
                    if ( wpgpt_safe_limit_index > wpgpt_safe_limit ){
                        return false;
                    }
                    wpgpt_safe_limit_index++;
                    var this_url = jQuery( this ).attr( 'href' );
                    reject_strings_urls +='https://translate.w.org' + this_url + '\n';
                    window.open(  this_url + '#magicrejectclose_T_WPORG' );
                });
            var original_string = jQuery('#original').val();
            var current_date = new Date();
            wpgpt_download( '[' + current_date.toLocaleString( [], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' } ) + '][WPGPT Log][' + reject_strings_length + ' rejections]', 'Date: ' + current_date.toLocaleDateString() + ' at ' + current_date.toLocaleTimeString() + '\nOriginal: ' + original_string + '\n' + reject_strings_length + ' rejected translations:\n' + reject_strings_urls );
        } else { alert( 'Phew! I thought so!' ); }
        });
        return;
    }
    if( window.location.href.includes( '#magicsaveclose_T_WPORG' ) ) {
        if ( $gp_editor_options.can_approve !== '1' ){
            jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: You don\'t have the required permissions for this project!</div>' );
            setTimeout( function(){ window.close(); }, 500 );
            return;
        }
        var replacement_alternative = localStorage.getItem( 'wpgpt_chosen_alternative' );
        if ( replacement_alternative == null || replacement_alternative == 'undefined' ) {
            jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: Empty alternative! Please try again!</div>' );
            return;
        }
        replacement_alternative = JSON.parse( replacement_alternative );
        var this_textareas = jQuery( '.translation-wrapper textarea' );
        if( this_textareas.length !== replacement_alternative.length ){
            jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: The number of plural forms doesn\'t match. Please try again.</div>' );
            return;
        }

        for ( var i = 0; i < this_textareas.length; i++ ){
            if ( replacement_alternative[ i ] === '' ){
                jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px; color:red;">WPGPT: One or more translations are empty. Please try again.</div>' );
                return;
            }
            jQuery( this_textareas[ i ] ).text( replacement_alternative [ i ] );
        }

        var comment_el = document.querySelector( '.source-details__comment p' );
        if ( comment_el !== null ){
            var comment = comment_el.textContent;
            if ( occurrences( comment, 'name' ) && ( occurrences( comment, 'plugin' ) || occurrences( comment, 'theme' ) ||  occurrences( comment, 'author' ) ) ) {
                comment_el.innerHTML = comment + '<br><br><strong style="color:red;">This might be the name of a plugin, theme or author.</strong><br> If not, please click Save!';
                return;
            }
        }
        
       $gp.editor.save( $gp.editor.current.find( 'button.translation-actions__save' ) );
       setTimeout( function(){ window.close(); }, 3000 );
       return;
    }

    if( window.location.href.includes( '#magicrejectclose_T_WPORG' ) ) {
        if ( $gp_editor_options.can_approve !== '1' ){
            window.close();
            return;
        }
        $gp.editor.set_status( $gp.editor.current.find( 'button.reject' ), 'rejected');
        setTimeout( function(){ window.close(); }, 3000 );
        return;
    }

    function wpgpt_get_alternative( alternative_url, alternative_id, alternative_element, is_last ) {
        fetch( alternative_url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } )
          .then( alternative_response => alternative_response.text() )
          .then( alternative_response => {
            var alternative_parser = new DOMParser();
            var alternative_page = alternative_parser.parseFromString( alternative_response , 'text/html' );
            var textareas = jQuery( alternative_page ).find( '.translation-wrapper .textareas' );
            alternatives_forms = [];
            jQuery( alternative_page ).find( '.translation-form-list .translation-form-list__tab').each( function(){ alternatives_forms.push( jQuery( this ).text().trim() ); } );
            var this_alternative = [];
            textareas.each( function() {
                 this_alternative [ parseInt( jQuery ( this ).data( 'plural-index' ) ) ] =  jQuery( this ).find('textarea').val();
            });
            alternatives_data[ alternative_id ] = this_alternative;
            var plurals = '';
            for ( var i = 1; i < this_alternative.length; i++ ){
               plurals += '<div><span class="plural_form">' + alternatives_forms[ i ] + ':</span> ' + this_alternative[ i ].replaceAll( '&', '&amp;' ).replaceAll( '<', '&lt;' ).replaceAll( '>', '&gt;' ) + '</div>';
            }
           
            if ( this_alternative.length !== 1 ){
                jQuery( alternative_element ).closest( 'li' ).prepend( '<span class="plural_form">' + alternatives_forms[ 0 ] + ':</span> ' );
                jQuery( alternative_element ).after( plurals );
            }

            if ( is_last ) {
               jQuery( '.wpgpt_loading' ).hide( 100 );
               jQuery( '.choose-consistency-string, .delete-consistency-strings ').show( 100 );
            }
          } )
          .catch( error => console.log( error ) );
    }

    function wpgpt_download( filename, text) {
        var element = document.createElement( 'a' );
        element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( text ) );
        element.setAttribute( 'download', filename );
        element.style.display = 'none';
        document.body.appendChild( element );
        element.click();
        document.body.removeChild( element );
      }
}