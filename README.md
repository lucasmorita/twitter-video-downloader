# Twitter-Video-Downloader

Download videos from twitter

- [Twitter-Video-Downloader](#twitter-video-downloader)
  - [Installation](#installation)
    - [Requisites](#requisites)
    - [Script](#script)
    - [Manual](#manual)
      - [Extension](#extension)
      - [Server](#server)
  - [Development](#development)
  - [Available Commands](#available-commands)
  - [Learn More](#learn-more)
    - [Extension Developer guides](#extension-developer-guides)
    - [Extension Publishing Guides](#extension-publishing-guides)

## Installation

### Requisites

- docker, npm

### Script

- just run:

```sh
sh install.sh
```

### Manual

#### Extension

```sh
cd extension \
&& npm install && npm run build
```

#### Server

- Build

```sh
cd server \
&& docker build . -t twitter-vid-downloader
```

- Run

```sh
docker run -v {dir_with_videos}:/usr/src/app/video -p 5000:5000 twitter-vid-downloader
```

## Development

This extension was created with [Extension CLI](https://oss.mobilefirst.me/extension-cli/)!

If you find this software helpful [star](https://github.com/MobileFirstLLC/extension-cli/) or [sponsor](https://github.com/sponsors/MobileFirstLLC) this project.

## Available Commands

| Commands        | Description                         |
|-----------------|-------------------------------------|
| `npm run start` | build extension, watch file changes |
| `npm run build` | generate release version            |
| `npm run docs`  | generate source code docs           |
| `npm run clean` | remove temporary files              |
| `npm run test`  | run unit tests                      |
| `npm run sync`  | update config files                 |

For CLI instructions see [User Guide &rarr;](https://oss.mobilefirst.me/extension-cli/)

## Learn More

### Extension Developer guides

- [Getting started with extension development](https://developer.chrome.com/extensions/getstarted)
- Manifest configuration: [version 2](https://developer.chrome.com/extensions/manifest) - [version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Permissions reference](https://developer.chrome.com/extensions/declare_permissions)
- [Chrome API reference](https://developer.chrome.com/docs/extensions/reference/)

### Extension Publishing Guides

- [Publishing for Chrome](https://developer.chrome.com/webstore/publish)
- [Publishing for Edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- [Publishing for Opera addons](https://dev.opera.com/extensions/publishing-guidelines/)
- [Publishing for Firefox](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)
