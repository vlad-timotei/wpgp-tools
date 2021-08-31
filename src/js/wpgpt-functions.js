const WPGPT_VERSION = '1.6';

/**
 * Sets LocalStorage value.
 *
 * @param {String} name
 * @param {String} value
 */
function wpgpt_setLS( name, value ) {
	localStorage.setItem( name, value );
}

/**
 * Gets LocalStorage value.
 *
 * @param {String} name
 * @returns {String}
 */
function wpgpt_getLS( name ) {
	return localStorage.getItem( name );
}

/**
 * Deletes LocalStorage item.
 *
 * @param {String} name
 */
function wpgpt_delLS( name ) {
	localStorage.removeItem( name );
}

/**
 * Creates HTML Element.
 *
 * @param {String} tagName This must be a valid HTML tag name.
 * @param {Object} attributes
 * @param {String} textContent
 * @returns {Element}
 */
function $wpgpt_createElement( tagName = 'div', attributes = {}, textContent = '' ) {
	const element = document.createElement( tagName );
	for ( const attribute in attributes ) {
		if ( attributes.hasOwnProperty( attribute ) ) {
			element.setAttribute( attribute, attributes[ attribute ] );
		}
	}
	element.textContent = textContent;
	return element;
}

/**
 * Inserts adjacent element to firs found target selector.
 *
 * @param {String} target_selector This must be valid CSS syntax.
 * @param {('beforebegin' | 'afterbegin' | 'beforeend' | 'afterend')} el_position
 * @param {Element} new_element
 */
function $wpgpt_addElement( target_selector, el_position, new_element ) {
	const el = document.querySelector( target_selector );
	if ( el !== null ) {
		el.insertAdjacentElement( el_position, new_element );
	}
}

/**
 * Inserts adjacent elements to all target selectors.
 *
 * @param {String} target_selector This must be valid CSS syntax.
 * @param {('beforebegin' | 'afterbegin' | 'beforeend' | 'afterend')} el_position
 * @param {Element} new_element
 */
function $wpgpt_addElements( target_selector, el_position, new_element ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.insertAdjacentElement( el_position, new_element.cloneNode( true ) );
	} );
}

/**
 * Adds event listeners for all target selectors.
 *
 * @param {Event} event_name
 * @param {String} target_selector This must be valid CSS syntax.
 * @param {Function} function_to_call
 */
function $wpgpt_addEvtListener( event_name, target_selector, function_to_call ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.addEventListener( event_name, function_to_call );
	} );
}

/**
 * Toggles class for all target selectors.
 *
 * @param {String} target_selector This must be valid CSS syntax.
 * @param {String} el_class
 */
function $wpgpt_toggleEl( target_selector, el_class ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.classList.toggle( el_class );
	} );
}

/**
 * Shows all target selctors.
 *
 * @param {String} target_selector This must be valid CSS syntax.
 */
function $wpgpt_showEl( target_selector ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.style.display = 'inline-block';
	} );
}

/**
 * Hides all target selectors.
 *
 * @param {String} target_selector This must be valid CSS syntax.
 */
function $wpgpt_hideEl( target_selector ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.style.display = 'none';
	} );
}

/**
 * Sets textContent for all target selectors.
 *
 * @param {String} target_selector This must be valid CSS syntax.
 * @param {String} new_txt
 */
function $wpgpt_setTextContent( target_selector, new_txt ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.textContent = new_txt;
	} );
}
