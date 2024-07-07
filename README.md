# Interpolator
An Electron UI for creating video from image sequences. Ability to use AI image interpolation to increase frame rate.

Project started with [Electron Forge](https://www.electronforge.io/).

## Development
- start development
    `npm start`

## Building Distributables
- `npm run make`
- More information can be found [here](https://www.electronforge.io/config/makers)



## Loading Images in Electron
Electron provides some guard rails to prevent unsafe things from happening. This makes it
difficult to interact with images in your file system, ie, `<img src="file:///home/pics/pic.jpg">.

Attempting to load that `file://` image will fail because of Electron's [web security settings](https://www.electronjs.org/docs/latest/tutorial/security#6-do-not-disable-websecurity).
So, we can either disable that, or, define a [protocol](https://www.electronjs.org/docs/latest/api/protocol)
to passthrough to the filesystem. This overrides just the insecure file loading without disabling the
rest of what Electron does for securing the app.

This pressents another issue, the [devContentSecurityPolicy](https://www.electronforge.io/config/plugins/webpack#devcontentsecuritypolicy) that electron-forge's webpack dev server sets.
The Content Security Policy needs to be updated with the protocol name, `atom`.
`devContentSecurityPolicy: 'img-src \'self\' atom:',`



