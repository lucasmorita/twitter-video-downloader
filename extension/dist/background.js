/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
var initiator = "";
var videoUrl = "";

function getTab() {
    return chrome.tabs.query({ active: true, currentWindow: true });
}

function isHomePage(tabs) {
    if (tabs[0].url.startsWith("https://twitter.com/home")) return true;
    return false;
}

function getInfoAboutPost() {
    const thumb = document
        .querySelector("meta[property='og:image']")
        .getAttribute("content");
    const desc = document
        .querySelector("meta[property='og:description']")
        .getAttribute("content");
    const url = document.URL;
    chrome.runtime.sendMessage({ thumb, desc, url });
}

function onBeforeRequestCallback(details) {
    getTab().then((tabs) => {
        if (isHomePage(tabs)) return;

        chrome.storage.local.get({ videoUrl: "notdefined" }, (results) => {
            if (results.videoUrl === "notdefined") {
                chrome.storage.local.set({ videoUrl: details.url }, () => {
                    console.debug(`on callback set value for ${details.url}`);
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: getInfoAboutPost,
                    });
                });
            }
        });
    });
}

function webNavigationListener(details) {
    console.debug(`Setting actualPage to ${details.url}`);
    chrome.storage.local.set({ actualPage: details.url });
    chrome.storage.local.remove("videoUrl", () =>
        console.debug("Removing video url")
    );
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
    urls: ["https://video.twimg.com/*/*.m3u8?tag*"],
});

// executes when getInfoAboutPost is executed
chrome.runtime.onMessage.addListener((req, sender, _) => {
    if (!sender.tab) return;

    console.debug("updating all infos for post... " + JSON.stringify(req));
    let { thumb, desc, url } = req;
    chrome.storage.local.get(
        {
            posts: [],
            videoUrl: "notdefined",
        },
        (results) => {
            if (results.posts.some(post => post.url === url)) return;
            let { videoUrl } = results;
            chrome.storage.local.set({
                posts: [
                    ...results.posts,
                    {
                        thumb,
                        desc,
                        url,
                        videoUrl,
                    },
                ],
            });
        }
    );
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!sender.tab) {
        // popup
        if (msg === "get-posts") {
            chrome.storage.local.get("posts", (results) => {
                console.debug(`sending posts=${JSON.stringify(results.posts)}`);
                sendResponse(results.posts);
            });
        }
        return true;
    }
});

/******/ })()
;
//# sourceMappingURL=background.js.map