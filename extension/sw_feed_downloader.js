var posts = [];
function getTab() {
    return chrome.tabs.query({ active: true, currentWindow: true });
}

function isFullResolutionVideoLink(details) {
    let isFullResolution = details.url.includes('?tag');
    return isFullResolution;
}

function postToDownload(url) {
    console.log(`sending ${document.URL} to extension`);
    chrome.runtime.sendMessage({ initiator: document.URL, target: url});
}

chrome.runtime.onMessage.addListener((req, sender, _) => {
    console.log(`${req.initiator} initiated request to download for ${req.target}!`);
    posts[req.initiator] = req.target;
})

function onBeforeRequestCallback(details) {
    let isHome = isHomePage()
    if (isFullResolutionVideoLink(details) && isHome) {
        console.log(`getting main video: ${details.url}`);
        getTab().then((tabs) => {
            console.log(`getting initiator`);
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
    console.log(`requesting video for url ${url}`)
    let server = "https://3c09-179-113-155-6.ngrok.io/";
    let res = await fetch(server+'videos', {
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
    if (res.status === 200) {
        res.json().then(data => {
            console.log(`link=${server+'downloads?filename='+data.name}`);
            chrome.downloads.download({
                url: url,
                method: 'GET',
                filename: data.name,
                saveAs: true
            }, id => {
                console.log(`id for downloaded file ${id}`)
            })
        })

    }
}

function createDownloadLink(url, filename) {
    // fetch(url)
    // .then(resp => {
    //     console.log(resp)
    //     resp.blob()
    // })
    // .then(blob => {
    //     console.log(blob)
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.style.display = 'none';
    //   a.href = url;
    //   // the filename you want
    //   a.download = filename;
    //   document.body.appendChild(a);
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   alert('your file has downloaded!'); // or you know, something with better UX...
    // })
    // .catch((err) => alert(err));
}

async function isHomePage() {
    let tabs = await getTab();

    console.log(`comparing ${tabs[0].url} with homepage`)
    if (tabs[0].url.startsWith("https://twitter.com/home"))
        return true;
    return false;
}

chrome.action.onClicked.addListener((tab) => {
    console.log('user clicked at tab ' + tab);
    if (tab.url.startsWith('https://twitter.com/home')) {
        console.log('cannot download at home page!');
        return;
    }
    console.log(`initiating download for [${posts[tab.url]}]`);
    download(posts[tab.url].split('?')[0], tab);
});


chrome.downloads.onChanged.addListener(delta => {
    console.log(delta)
})