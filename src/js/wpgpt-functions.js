/** Simpler naive implementation of push
 *
 * @param {Array} arr
 * @param {Element} el
 */

function wpgpt_push1( arr, el ) {
	if ( el !== '' ) {
		arr[ arr.length	] = el;
	}
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
