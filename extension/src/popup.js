document.getElementById('clear-downloads')?.addEventListener('click', () => {
    console.debug('Clearing downloads...')
    chrome.storage.local.clear();
    window.location.reload();
});

document.getElementById('check-ffmpeg')?.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { ffmpeg: "isLoaded" }, response  => {
            console.log(response)
        });
    });
});

chrome.storage.local.get('posts', results => {
    updateLastVideoHeader(results.posts[results.posts.length - 1])
    for (let postIdx = 0; postIdx < results.posts.length - 1; postIdx++) {
        prepareVideoItem(results.posts[postIdx]);
    }
})

function updateLastVideoHeader(lastPost) {
    console.debug(`updating last video with ${JSON.stringify(lastPost)}`)
    let header = document.getElementById('last-video-header');
    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    h2.textContent = 'Last video to download';
    div.appendChild(h2);
    let referentPost = document.createElement('a');
    referentPost.id = 'last-video-referent';
    referentPost.target = '_blank'
    referentPost.textContent = lastPost.desc;
    referentPost.href = lastPost.url;
    div.appendChild(referentPost);
    let imgContainer = document.createElement('div');
    let img = document.createElement('img');
    img.src = lastPost.thumb;
    imgContainer.append(img);
    imgContainer.id = 'img-container-header'
    div.appendChild(imgContainer);
    let btnDownload = document.createElement('button');
    btnDownload.id = 'btn-download';
    btnDownload.setAttribute('data-url', lastPost.videoUrl);
    btnDownload.setAttribute('download', lastPost.desc);
    btnDownload.textContent = 'Download';
    btnDownload.addEventListener('click', postvideo);
    div.appendChild(btnDownload);
    header?.appendChild(div);
}

function prepareVideoItem() {
    let ul = document.getElementById('video-list');
    let li = document.createElement('li');
    let a = document.createElement('a');
    let container = document.createElement('div');
    let imgContainer = document.createElement('div');
    let btn = document.createElement('button');
    let img = document.createElement('img');
    img.src = post.thumb;
    imgContainer.id = 'img-container'
    container.id = 'list-container';
    a.href = post.url;
    a.text = post.desc;
    btn.textContent = 'Download';
    btn.id = 'btn-download';
    btn.setAttribute('data-url', post.videoUrl);
    btn.addEventListener('click', postvideo);
    imgContainer.appendChild(img);
    li.appendChild(a);
    li.appendChild(imgContainer);
    li.appendChild(btn);
    container.appendChild(li);
    ul?.prepend(container);
}

