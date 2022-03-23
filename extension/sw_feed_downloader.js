var initiator = "";
var videoUrl = "";

function getTab() {
    return chrome.tabs.query({ active: true, currentWindow: true });
}

function videoToDownload(url) {
    console.debug(`sending ${document.URL} to extension`);
    chrome.runtime.sendMessage({
        initiator: document.URL,
        videoUrl: url,
        thumbnailUrl: undefined,
    });
}

function thumbnail(url) {
    console.debug(`fetching thumbnail jpg ${url}`);
    chrome.runtime.sendMessage({
        initiator: document.URL,
        videoUrl: undefined,
        thumbnailUrl: url,
    });
}

function isHomePage(tabs) {
    if (tabs[0].url.startsWith("https://twitter.com/home")) return true;
    return false;
}

function isThumbnail(details) {
    return details.url.includes("jpg");
}

function onBeforeRequestCallback(details) {
    getTab().then((tabs) => {
        if (isHomePage(tabs)) return;
        chrome.storage.local.get("actualPage", (result) => {
            console.debug(`actualPage ${result.actualPage}`);
            let sanitizedUrl = details.url.split('?')[0];
            console.debug(`getting main video: ${sanitizedUrl}`);
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: videoToDownload,
                args: [sanitizedUrl],
            });
        });
    });
}

function webNavigationListener(details) {
    console.debug(`Setting actualPage to ${details.url}`);
    chrome.storage.local.set({ actualPage: details.url });
}

chrome.webNavigation.onHistoryStateUpdated.addListener(webNavigationListener, {
    url: [
        {
            hostEquals: "twitter.com",
            pathContains: "status",
        },
    ],
});

// event listeners
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestCallback, {
    urls: [
        "https://video.twimg.com/*/*.m3u8?tag*",
        // "https://pbs.twimg.com/*/*?format=jpg&name=small" url for thumbnail
    ],
});

// syncs up post with the video url
// executes when video url arrives
chrome.runtime.onMessage.addListener((req, sender, _) => {
    if (!sender.tab) return;

    console.debug(`got message on listener ${JSON.stringify(req)}`);
    initiator = req.initiator;
    videoUrl = req.videoUrl;
    chrome.storage.local.get({ posts: [] }, (result) => {
        let { posts } = result;
        if (posts.some((savedPost) => savedPost.initiator === initiator))
            return;
        chrome.storage.local.set(
            { posts: [...posts, { initiator, videoUrl }] },
            () => console.debug(`set value for ${initiator}`)
        );
    });
});

// executes when extension is clicked
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!sender.tab) {
        // popup
        if (msg === "get-info") {
            console.debug(`sending response to extension ${(initiator, videoUrl)}`);
            sendResponse({ initiator: initiator, videoUrl: videoUrl });
            // chrome.storage.local.get(['initiator', 'videoUrl'], post => {
            //     console.debug(`sending response to extension ${JSON.stringify(post)}`);
            //     sendResponse(JSON.stringify(post));
            // })
        }
    }
});
