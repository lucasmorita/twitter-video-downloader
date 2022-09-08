const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
    log: true,
    corePath: chrome.runtime.getURL('vendor/ffmpeg-core.js'),
});

(async () => {
    console.log(`is ffmpeg loaded: ${ffmpeg.isLoaded()}`)
    if (!ffmpeg.isLoaded()) {
        console.log('loading')
        ffmpeg.load();
    }
})();

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.ffmpeg === 'isLoaded') {
            sendResponse(ffmpeg.isLoaded())
        }
    }
)