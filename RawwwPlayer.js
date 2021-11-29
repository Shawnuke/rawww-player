'use strict'

class RawwwPlayer extends HTMLElement {
	constructor() {
		super()
		
		// Check if the browser actually supports the video element
        // example: Opera Mini supports JS but not <video> element
        const supportsVideo = !!document.createElement('video').canPlayType
        if (!supportsVideo) return

        this.$video = this.querySelector('video')
        this.$video.controls = false
	}
}
customElements.define('rawww-player', RawwwPlayer)