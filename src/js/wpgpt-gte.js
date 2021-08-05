setTimeout( wpgpt_consistency_replace, 500 );
function wpgpt_consistency_replace(){
    if ( window.location.href.includes( 'wordpress.org/consistency' ) ) {
        var wpgpt_safe_limit = 5;

        $toggleEl( '.translations-unique', 'hidden' );
        if( jQuery('.consistency-table' ).length ){
            jQuery( '#translations-overview p' ).prepend( '<div id="bulk-instructions">To bulk replace <b>singular translations</b>: <ol><li>Set a translation to replace the others with.</li><li>Choose translations that you don\'t want to be replaced.</li><li>Click "Bulk replace & Save".</li></ol></div>' );
            jQuery( '.notice' ).prepend('<div class="fire_magic_reject_close_div">Danger zone: <button class="fire_magic_reject_close">Reject all translations</button></div>');
        }
        localStorage.removeItem( 'wpgpte_main_string' );

        var strings_ids = [], index = 0, btns, main_string;

        jQuery( '.translations-unique li a.anchor-jumper' ).each( function(){
            strings_ids.push( jQuery( this ).attr( 'href' ).replace( '#', '' ) );
            btns = '<div class="wpgpt-bulk-buttons"> &nbsp; <button id="choose-' + strings_ids[ index ] + '" data-string-id="' + strings_ids[ index ] +  '" class="choose-consistency-string" type="button">Set this translation as replacement</button>';
            btns += '  &nbsp; <button id="delete-' + strings_ids[ index ] + '"data-string-index="' + index + '" data-string-id="' + strings_ids[ index ] +  '" class="delete-consistency-strings" type="button" disabled>Do not replace this</button></div>';
            jQuery( this ).after( btns );
            index++;
        });

        index = - 1;
        jQuery( '.consistency-table tbody tr' ).each( function() {
            if ( jQuery( this ).attr( 'id' ) )
                index++;
            jQuery( this ).addClass( 'string-id-' + strings_ids[ index ] );
        });

        jQuery( '.delete-consistency-strings').click( function(){
           jQuery( '.string-id-' + jQuery( this ).data( 'string-id' ) ).remove();
           jQuery( this )
                .before( 'These strings will not be replaced.' )
                .remove();
        });

        jQuery( '.choose-consistency-string' ).click( function(){
            main_string = jQuery( '#' + jQuery( this ).data( 'string-id' ) + ' strong' ).text();
            jQuery( this )
                .before( '<b>This translation will be used to replace all others.</b>' )
                .remove();
            jQuery( '.consistency-table' ).prepend( '<thead><tr><th colspan="2">These are the transations that will be replaced:</th></tr></thead>' );

            localStorage.setItem( 'wpgpte_main_string', main_string );

            var id = jQuery( this ).attr( 'id' ).replace( 'choose', '' );
            jQuery( '.delete-consistency-strings' ).prop( 'disabled', false );
            jQuery( '.fire_magic_save_close' ).show();
            jQuery( '#delete' + id ).click();
            jQuery( '.choose-consistency-string' ).prop( 'disabled', true );
        });

        jQuery( '#translations-overview' ).after( '<button style="display:none;" class="fire_magic_save_close">Bulk replace & Save</button>' );

        jQuery( '.fire_magic_save_close' ).click( function(){
            var main_s = localStorage.getItem( 'wpgpte_main_string' );
            var replace_strings = jQuery( '.consistency-table tr td:odd() .meta a' );
            var replace_strings_length = ( replace_strings.length > wpgpt_safe_limit ) ? wpgpt_safe_limit : replace_strings.length;
            var confirm_msg = replace_strings_length + ' selected strings will be REPLACED with:\n\n' + main_s + '\n\n';
            confirm_msg += ( ( replace_strings.length > wpgpt_safe_limit ) ? ( 'For safety, only ' + replace_strings_length + ' out of ' + replace_strings.length + ' can be replaced in one go.\n' ) : '' );
            confirm_msg += 'A log of replaced translations will be downloaded. \nAre you sure?';
            if ( main_s !== 'undefined' && main_s !== null && confirm( confirm_msg ) ) {
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
                wpgpt_download( '[WPGPT Log][' + current_date.toLocaleDateString() + '][' + replace_strings_length + ' replacements]', 'Date: ' + current_date.toLocaleDateString() + ' at ' + current_date.toLocaleTimeString() + '\nOriginal: ' + original_string + '\nReplaced with: `' + main_s + '`\n' + replace_strings_length + ' replaced translations:\n' + replace_strings_urls );
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
            wpgpt_download( '[WPGPT Log][' + current_date.toLocaleDateString() + '][' + reject_strings_length + ' rejections]', 'Date: ' + current_date.toLocaleDateString() + ' at ' + current_date.toLocaleTimeString() + '\nOriginal: ' + original_string + '\n' + reject_strings_length + ' rejected translations:\n' + reject_strings_urls );

        } else { alert( 'Phew! I thought so!' ); }
        });
        return;
    }
    if( window.location.href.includes( '#magicsaveclose_T_WPORG' ) ) {
        if ( $gp_editor_options.can_approve !== '1' ){
            window.close();
            return;
        }
        var replacement = localStorage.getItem( 'wpgpte_main_string' );
        if ( replacement == null || replacement == 'undefined' ) {
            return;
        }
        var this_textareas = jQuery( '.translation-wrapper textarea' );
        this_textareas.eq(0).text( replacement );

        if ( this_textareas.length > 1 ){
            jQuery( '.translation-wrapper' ).before( '<br><div style="padding-left: 10px;"><strong >Currently, WPGPT doesn\'t replace plural strings.</strong><br>Please manually replace plurals and then Save.</div>' );
            return;
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

    /*
        Draft for plural
        jQuery( '.translation-wrapper textarea' ).eq(0).text( 'Regret, dar nu ai permisiunile necesare pentru a instala modulul %s. Contactează administratorul acestui site pentru ajutor la instalarea modulului.' );
        jQuery( '.translation-wrapper textarea' ).eq(1).text( 'Regret, dar nu ai permisiunile necesare pentru a instala modulele %s. Contactează administratorul acestui site pentru ajutor la instalarea modulelor.' );
        jQuery( '.translation-wrapper textarea' ).eq(2).text( 'Regret, dar nu ai permisiunile necesare pentru a instala modulele %s. Contactează administratorul acestui site pentru ajutor la instalarea modulelor.' );
        $gp.editor.save( $gp.editor.current.find( 'button.translation-actions__save' ) );
        setTimeout( function(){ window.close(); }, 3000 );

    */

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