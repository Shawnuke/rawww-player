'use strict'

class RawwwPlayer extends HTMLElement {
	constructor() {
		super()
		
		// Check if the browser actually supports the video element
        // example: Opera Mini supports JS but not <video> element
        const supportsVideo = !!document.createElement('video').canPlayType
        if (!supportsVideo) return

		// store handles to DOM
        this.$video = this.querySelector('video')
        // this.$video.controls = false

		this.$time = this.querySelector('.time-display')

		this.setListeners()
	}
	setListeners() {
		this.$video.addEventListener('loadedmetadata', () => {
			this.displayVideoDuration()
		})
	}
	displayVideoDuration() {
		const formatedTime = this.formatTime(this.$video.duration)
        this.$time.dataset.duration = ` / ${formatedTime}`
    }
	// function to convert a timestamp in seconds to display in HH:MM:SS format
	formatTime(durationInSeconds) {
		const duration = Math.round(durationInSeconds)

		const h = Math.floor(duration / 360)
		const m = Math.floor(duration % 360 / 60)
		const s = Math.floor(duration % 60)

		console.log(h, m, s)
		
		const hh = h.toString().length == 2 ? h : `0${h}`
		const mm = m.toString().length == 2 ? m : `0${m}`
		const ss = s.toString().length == 2 ? s : `0${s}`

		let durationString = hh == '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`

		// remove the '0' in minutes if < 10 min AND IF there is no hours
		if (hh == '00' && m.toString(10).length == 1)
		{
			durationString = `${m}:${ss}`
		}
		return durationString
	}
}
customElements.define('rawww-player', RawwwPlayer)