'use strict'

class RawwwPlayer extends HTMLElement {
	constructor() {
		super()
		
		this.checkBrowserSupport()

		// store handles to DOM
		this.storeHandlesToDOM()

		// this.$video.controls = true // to be inverted later

		// set properties
		this.currentTimeRange = {
			index: 0,
			start: 0,
			end: 0,
			duration: 0
		}

		this.setListeners()
	}
	storeHandlesToDOM() {
		this.$video = this.querySelector('video')

		this.$time = this.querySelector('.time-display')

		this.$playBtn = this.querySelector('.play-btn')

		this.$rewindBtn = this.querySelector('.rewind-btn')
		this.$forwardBtn = this.querySelector('.forward-btn')

		this.$track = this.querySelector('.track')
	}
	checkBrowserSupport() {
		// Check if the browser actually supports the video element
		// example: Opera Mini supports JS but not <video> element
		const supportsVideo = !!document.createElement('video').canPlayType
		if (!supportsVideo) {
			console.log('The browser doesn\'t support the HTML <video> element')
			return
		}

		// Check if the browser supports the Fullscreen API
		const fullScreenSupported = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen)
		if (!fullScreenSupported) {
			console.log('The browser doesn\'t support the Fullscreen API')
			// If the browser doesn't support the Fulscreen API, then hide the fullscreen button
		}

		// Check if the user device is mainly finger-driven
		this.primaryPointerType = matchMedia('(pointer:coarse)').matches ? 'coarse' : 'fine'
		console.log('Primary pointer is ' + this.primaryPointerType)
		if ('coarse' == this.primaryPointer) {
			// If the primary (or should it be 'any'?) pointer is coarse, set the interface accordingly
		}
	}
	setListeners() {
		this.$playBtn.addEventListener('click', this.togglePlayPause.bind(this))
		this.$rewindBtn.addEventListener('click', this.jumpBy.bind(this, -10))
		this.$forwardBtn.addEventListener('click', this.jumpBy.bind(this, 10))

		this.$video.addEventListener('audioprocess', () => {
			console.log('audioprocess')
		})
		this.$video.addEventListener('canplay', () => {
			console.log('canplay')
		})
		this.$video.addEventListener('canplaythrough', () => {
			console.log('canplaythrough')
		})
		this.$video.addEventListener('complete', () => {
			console.log('complete')
		})
		this.$video.addEventListener('durationchange', () => {
			console.log('durationchange')
			this.updateCurrentTime()
			this.displayVideoDuration()
		})
		this.$video.addEventListener('emptied', () => {
			console.log('emptied')
		})
		this.$video.addEventListener('ended', () => {
			console.log('ended')
		})
		this.$video.addEventListener('loadeddata', () => {
			console.log('loadeddata')
		})
		this.$video.addEventListener('loadedmetadata', () => {
			console.log('loadedmetadata')
		})
		this.$video.addEventListener('pause', () => {
			console.log('pause')
			this.updatePlayBtn('pause')
		})
		this.$video.addEventListener('play', () => {
			console.log('play')
			this.updatePlayBtn('play')
		})
		this.$video.addEventListener('playing', () => {
			console.log('playing')
		})
		this.$video.addEventListener('progress', () => {
			console.log('progress')
			this.getCurrentTimeRange()
			this.updatePreloadBar()
		})
		this.$video.addEventListener('ratechange', () => {
			console.log('ratechange')
		})
		this.$video.addEventListener('seeked', () => {
			console.log('seeked')
			this.getCurrentTimeRange() // select the good timerange for preload visualisation
			this.updatePreloadBar()
		})
		this.$video.addEventListener('seeking', () => {
			console.log('seeking')
			this.updateCurrentTime()
			this.updatePlaybackBar()
		})
		this.$video.addEventListener('stalled', () => {
			console.log('stalled')
		})
		this.$video.addEventListener('suspend', () => {
			console.log('suspend')
		})
		this.$video.addEventListener('timeupdate', () => {
			console.log('timeupdate')
			this.updatePlaybackBar()
			this.updateCurrentTime()
		})
		this.$video.addEventListener('volumechange', () => {
			console.log('volumechange')
		})
		this.$video.addEventListener('waiting', () => {
			console.log('waiting')
		})
	}
	updateCurrentTime() {
		this.$time.textContent = this.formatTime(this.$video.currentTime)
	}
	getCurrentTimeRange() {
		const testTimeRange = {}
		for (let i = this.$video.buffered.length - 1; i >= 0; i--) {
			testTimeRange.start = this.$video.buffered.start(i)
			testTimeRange.end = this.$video.buffered.end(i)

			if (testTimeRange.start <= this.$video.currentTime && testTimeRange.end >= this.$video.currentTime) {
				this.currentTimeRange = { index: i, ...testTimeRange }
				return
			}
		}
	}
	updatePreloadBar() {
		this.currentTimeRange.duration = (this.currentTimeRange.end || 0) - (this.currentTimeRange.start || 0)
		const posX = Math.trunc((this.currentTimeRange.start || 0) / this.$video.duration * 1000) / 1000
		const width = Math.trunc(this.currentTimeRange.duration / this.$video.duration * 1000) / 1000

		this.$track.style.setProperty('--preload-x', posX)
		this.$track.style.setProperty('--preload-width', width)
	}
	updatePlaybackBar() {
		this.$track.style.setProperty('--playback-width', Math.trunc(this.$video.currentTime / this.$video.duration * 1000) / 1000)
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
		const duration = Math.trunc(durationInSeconds)

		const h = Math.trunc(duration / 360)
		const m = Math.trunc(duration % 360 / 60)
		const s = Math.trunc(duration % 60)
		
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