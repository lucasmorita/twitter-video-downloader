const baseurl = 'http://localhost:5000/videos';

document.getElementById('clear-downloads')?.addEventListener('click', () => {
    chrome.storage.local.clear();
    window.location.reload();
});

chrome.storage.local.get('posts', results => {
    if (Object.keys(results).length === 0) return;
    const lastPost = results.posts.length - 1;
    updateLastVideoHeader(results.posts[lastPost]);
    for (let postIdx = 0; postIdx < lastPost; postIdx++) {
        prepareVideoItem(results.posts[postIdx]);
    }
})

function updateLastVideoHeader(lastPost: any) {
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
    btnDownload.className = 'btn-download';
    btnDownload.setAttribute('data-url', lastPost.videoUrl);
    btnDownload.setAttribute('download', lastPost.desc);
    btnDownload.textContent = 'Download';
    btnDownload.addEventListener('click', postvideo);
    div.appendChild(btnDownload);
    header?.appendChild(div);
}

async function postvideo(event: any) {
    let btn = event.target.closest('button');
    let posturl = btn.getAttribute('data-url');
    const res = await fetch(baseurl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({videoUrl: posturl})
    });
    if (res.status === 200) {
        console.debug('success')
    }
}

function prepareVideoItem(post: any) {
    let ul = document.getElementById('video-list');
    let li = document.createElement('li');
    let a = document.createElement('a');
    let imgContainer = document.createElement('div');
    let btn = document.createElement('button');
    let img = document.createElement('img');
    img.src = post.thumb;
    imgContainer.id = 'img-container';
    a.href = post.url;
    a.text = post.desc;
    a.target = '_blank';
    btn.textContent = 'Download';
    btn.className = 'btn-download';
    btn.setAttribute('data-url', post.videoUrl);
    btn.addEventListener('click', postvideo);
    imgContainer.appendChild(img);
    li.className = 'video-item';
    li.appendChild(a);
    li.appendChild(imgContainer);
    li.appendChild(btn);
    ul?.prepend(li);
}
