# rawww-player
> Building a Custom Element video player for the web.

----

## Table of Contents
- [rawww-player](#rawww-player)
  - [Table of Contents](#table-of-contents)
  - [Author / Team Members](#author--team-members)
    - [Lead developer](#lead-developer)
  - [Description](#description)
  - [Features](#features)
  - [(Unordered) Roadmap](#unordered-roadmap)
  - [Specifications](#specifications)
  - [Project Demo](#project-demo)
  - [Install instructions](#install-instructions)
  - [Issues](#issues)
  - [Credits / Contributors](#credits--contributors)
  - [License](#license)

## Author / Team Members
### Lead developer
* Corentin Boulanouar <corentin.boulanouar@hetic.net>

## Description
The project is mainly about having a deep dive into the video & Shadow DOM API, while maintaining a git repo decently.

## Features 
Currently ? none.

## (Unordered) Roadmap
* [ ] fallback to `<video controls>` for non-JS users
* [ ] play/pause button
* [ ] current & total video time display
* [ ] mute/unmute button
* [ ] download button
* [ ] fullscreen mode
* [ ] subtitles display
* [ ] 10sec rewind/fast forward buttons
* [ ] manipulable progress bar, with playhead and scrubber-head
* [ ] buffered stream display
* [ ] volume control
* [ ] Video quality (bitrates) settings
* [ ] Video speed management
* [ ] Share button
* [ ] Info button
* [ ] playlist management (next/previous btns, ...)
* [ ] fairly customizable (e.g. solid or fade-in controls, colors, ...)
* [ ] [a11y](https://developer.mozilla.org/en-US/docs/Web/Accessibility)


## Specifications
**NOTE:** This Custom Element is built using Chrome, but other browsers should work too. (cross-browser testing will come at some point anyway)

## Project Demo
Currently ? None.

## Install instructions
* Add `RawwwPlayer.js` to your website's assets
* In your HTML, wrap your `video` element like so:
````html
<rawww-player>
    <video width="100%" height="100%" controls>
        <source src="http://mirrors.standaloneinstaller.com/video-sample/star_trails.mp4" type="video/mp4" />
    </video>
</rawww-player>
````
* Bob's your uncle

## Issues
* no issue yet

## Credits / Contributors
* Corentin Boulanouar <corentin.boulanouar@hetic.net>

## License
[MIT](LICENSE) © Corentin Boulanouar

This project is licensed under the terms of the [MIT](https://spdx.org/licenses/MIT) license.