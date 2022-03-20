var posts = [];

function getTab() {
    return chrome.tabs.query({ active: true, currentWindow: true });
}

function isFullResolutionVideoLink(details) {
    return details.url.includes("?tag");
}

function postToDownload(url) {
    console.debug(`sending ${document.URL} to extension`);
    chrome.runtime.sendMessage({ initiator: document.URL, target: url });
}

async function isHomePage() {
    let tabs = await getTab();
    console.debug(`comparing ${tabs[0].url} with homepage`);
    if (tabs[0].url.startsWith("https://twitter.com/home")) return true;
    return false;
}

function onBeforeRequestCallback(details) {
    chrome.storage.local.get("actualPage", (result) => {
        console.debug(`actualPage ${JSON.stringify(result)}`);
        if (result) {
            if (isFullResolutionVideoLink(details) && isHomePage()) {
                console.debug(`getting main video: ${details.url}`);
                getTab().then((tabs) => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: postToDownload,
                        args: [details.url],
                    });
                });
            }
            chrome.storage.local.remove("actualPage");
        }
    });
}

function webNavigationListener(details) {
    if (!details.url.match(/twitter\.com/)) {
        return;
    }
    console.debug(`Setting actualPage to ${details.url}`);
    chrome.storage.local.set({ actualPage: details.url });
}

chrome.webNavigation.onHistoryStateUpdated.addListener(webNavigationListener);

async function requestDownload(url, currentTab) {
    console.debug(`requesting video for url ${url}`);
    let server = "https://d518-179-113-155-6.ngrok.io/";
    await fetch(server + "videos", {
        body: JSON.stringify({
            videoUrl: url,
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
    });
}

// event listeners
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestCallback, {
    urls: ["https://video.twimg.com/*/*.m3u8?tag*"],
});

// syncs up post with the video url
chrome.runtime.onMessage.addListener((req, sender, _) => {
    console.debug(
        `syncing post: ${req.initiator} with video: ${req.target}!`
    );
    posts[req.initiator] = req.target;
});

function sendToServer(initiator, videoUrl) {
    console.debug(`Sending request to download video ${videoUrl} for post ${initiator}`)
}

function showDownloadStarted(initiator, videoUrl) {
    sendToServer(initiator, videoUrl);
    alert(`Download started for video ${initiator}`);
}

chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id},
        func: showDownloadStarted,
        args: [tab.url, posts[tab.url]]
    })
})