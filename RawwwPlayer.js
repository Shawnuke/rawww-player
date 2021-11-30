'use strict'

class RawwwPlayer extends HTMLElement {
	constructor() {
		super()
		console.log('CustomElement connected')
	}
}
customElements.define('rawww-player', RawwwPlayer)