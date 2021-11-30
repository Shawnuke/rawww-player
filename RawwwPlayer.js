'use strict'

class RawwwPlayer extends HTMLElement {
	constructor() {
		super()
		
		// Check if the browser actually supports the video element
        // example: Opera Mini supports JS but not <video> element
        const supportsVideo = !!document.createElement('video').canPlayType
        if (!supportsVideo) return

		// Check if the browser supports the Fullscreen API
        this.fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen)
        // If the browser doesn't support the Fulscreen API, then hide the fullscreen button

        this.$video = this.querySelector('video')
        // this.$video.controls = false

		this.$playBtn = this.querySelector('.play-btn')

		this.setListeners()
	}
	togglePlayPause() {
		this.$video.paused ? this.$video.play() : this.$video.pause()
	}
	setListeners() {
		this.$playBtn.addEventListener('click', this.togglePlayPause.bind(this))
	}
}
customElements.define('rawww-player', RawwwPlayer)