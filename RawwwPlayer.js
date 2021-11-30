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
		this.$time.textContent = this.formatTime(this.$video.currentTime)
		this.$playBtn = this.querySelector('.play-btn')

		this.$rewindBtn = this.querySelector('.rewind-btn')
		this.$forwardBtn = this.querySelector('.forward-btn')

		this.setListeners()
	}
	setListeners() {
		this.$video.addEventListener('loadedmetadata', this.displayVideoDuration.bind(this))
		this.$playBtn.addEventListener('click', this.togglePlayPause.bind(this))
		this.$rewindBtn.addEventListener('click', this.jumpBy.bind(this, -10))
		this.$forwardBtn.addEventListener('click', this.jumpBy.bind(this, 10))

		this.$video.addEventListener('play', this.updatePlayBtn.bind(this, 'play'))
		this.$video.addEventListener('pause', this.updatePlayBtn.bind(this, 'pause'))

		this.$video.addEventListener('timeupdate', (e) => {
			this.$time.textContent = this.formatTime(this.$video.currentTime)
		})
	}
	jumpBy(seconds) {
		this.$video.currentTime += seconds
	}
	updatePlayBtn(state) {
		if (state == 'play') {
			this.$playBtn.textContent = 'pause'
		} else {
			this.$playBtn.textContent = 'play'
		}
	}
	displayVideoDuration() {
		const formatedTime = this.formatTime(this.$video.duration)
		this.$time.dataset.duration = ` / ${formatedTime}`
	}
	formatTime(durationInSeconds) { // function to convert a timestamp in seconds to display in HH:MM:SS format
		const duration = Math.floor(durationInSeconds)

		const h = Math.floor(duration / 360)
		const m = Math.floor(duration % 360 / 60)
		const s = Math.floor(duration % 60)
		
		const hh = h.toString().length == 2 ? h : `0${h}`
		const mm = m.toString().length == 2 ? m : `0${m}`
		const ss = s.toString().length == 2 ? s : `0${s}`

		if (hh == '00') {
			return m.toString().length == 1 ? `${m}:${ss}` : `${mm}:${ss}`
		} else {
			return `${hh}:${mm}:${ss}`
		}
	}
	togglePlayPause() {
		this.$video.paused ? this.$video.play() : this.$video.pause()
	}
}
customElements.define('rawww-player', RawwwPlayer)