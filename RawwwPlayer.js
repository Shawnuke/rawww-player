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

		this.$preloadBar = this.querySelector('.preload-bar')
		this.$playbackBar = this.querySelector('.playback-bar')

		this.$fullscreenBtn = this.querySelector('.fullscreen-btn')
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
		this.$fullscreenBtn.addEventListener('click', this.toggleFullscreen.bind(this))

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

		this.$preloadBar.style.setProperty('--preload-x', posX)
		this.$preloadBar.style.setProperty('--preload-width', width)
	}
	updatePlaybackBar() {
		this.$playbackBar.style.setProperty('--playback-width', Math.trunc(this.$video.currentTime / this.$video.duration * 1000) / 1000)
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
	get isFullscreen() {
		return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement)
	}
	toggleFullscreen() {
		if (this.isFullscreen) 
		{
			// ...exit fullscreen mode
			// (Note: this can only be called on document)
			if (document.exitFullscreen) document.exitFullscreen()
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
			else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
			else if (document.msExitFullscreen) document.msExitFullscreen()
		}
		else // ...otherwise enter fullscreen mode
		{
			// (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
			if (this.requestFullscreen) this.requestFullscreen()
			else if (this.mozRequestFullScreen) this.mozRequestFullScreen()
			else if (this.webkitRequestFullScreen) 
			{
				// Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
				// ensures that our custom controls are visible:
				// figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
				// figure[data-fullscreen=true] .controls { z-index:2147483647; }
				this.$video.webkitRequestFullScreen()
			}
			else if (this.msRequestFullscreen) this.msRequestFullscreen()
		}
	}
}
customElements.define('rawww-player', RawwwPlayer)