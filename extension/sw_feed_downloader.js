var posts = [];
function getTab() {
    return chrome.tabs.query({ active: true, currentWindow: true });
}

function isFullResolutionVideoLink(details) {
    let isFullResolution = details.url.includes('?tag');
    return isFullResolution;
}

function postToDownload(url) {
    console.debug(`sending ${document.URL} to extension`);
    chrome.runtime.sendMessage({ initiator: document.URL, target: url});
}

chrome.runtime.onMessage.addListener((req, sender, _) => {
    console.debug(`${req.initiator} initiated request to download for ${req.target}!`);
    posts[req.initiator] = req.target;
})

function onBeforeRequestCallback(details) {
    let isHome = isHomePage()
    if (isFullResolutionVideoLink(details) && isHome) {
        console.debug(`getting main video: ${details.url}`);
        getTab().then((tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: postToDownload,
                args: [details.url]
            });
        });
    }
}

chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestCallback, {
    urls: ["https://video.twimg.com/ext_tw_video/*.m3u8*"],
});

async function download(url, currentTab) {
    console.debug(`requesting video for url ${url}`)
    let server = "https://d518-179-113-155-6.ngrok.io/";
    await fetch(server+'videos', {
        body: JSON.stringify({
            videoUrl: url,
        }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5000",
        },
        method: "POST",
    });
}

async function isHomePage() {
    let tabs = await getTab();

    console.debug(`comparing ${tabs[0].url} with homepage`)
    if (tabs[0].url.startsWith("https://twitter.com/home"))
        return true;
    return false;
}

chrome.action.onClicked.addListener((tab) => {
    if (tab.url.startsWith('https://twitter.com/home')) {
        console.debug('cannot download at home page!');
        return;
    }
    console.debug(`initiating download for [${posts[tab.url]}]`);
    download(posts[tab.url].split('?')[0], tab);
});