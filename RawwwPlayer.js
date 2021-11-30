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

		// store handles to DOM
		this.$video = this.querySelector('video')
		// this.$video.controls = false // to be uncommented later

		this.$time = this.querySelector('.time-display')
		this.$playBtn = this.querySelector('.play-btn')

		this.setListeners()
	}
	setListeners() {
		this.$video.addEventListener('loadedmetadata', this.displayVideoDuration.bind(this))
		this.$playBtn.addEventListener('click', this.togglePlayPause.bind(this))
	}
	displayVideoDuration() {
		const formatedTime = this.formatTime(this.$video.duration)
		this.$time.dataset.duration = ` / ${formatedTime}`
	}
	formatTime(durationInSeconds) { // function to convert a timestamp in seconds to display in HH:MM:SS format
		const duration = Math.round(durationInSeconds)

		const h = Math.floor(duration / 360)
		const m = Math.floor(duration % 360 / 60)
		const s = Math.floor(duration % 60)
		
		const hh = h.toString().length == 2 ? h : `0${h}`
		const mm = m.toString().length == 2 ? m : `0${m}`
		const ss = s.toString().length == 2 ? s : `0${s}`

		if (hh == '00') {
			return m.toString().length == 1 ? ${m}:${ss} : `${mm}:${ss}`
		} else {
			return `${hh}:${mm}:${ss}`
		}
	}
	togglePlayPause() {
		this.$video.paused ? this.$video.play() : this.$video.pause()
	}
}
customElements.define('rawww-player', RawwwPlayer)