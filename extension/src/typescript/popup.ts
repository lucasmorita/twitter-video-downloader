document.getElementById('clear-downloads')?.addEventListener('click', () => {
    console.debug('Clearing downloads...');
    chrome.storage.local.clear();
    window.location.reload();
});

chrome.storage.local.get('posts', ({ posts }) => {
    if (posts) {
        const lastAccessedVideo = posts.pop();
        updateLastVideoContainer(lastAccessedVideo);
        posts.forEach((post: any) => displayPostInfo(post));
    }
});

function updateLastVideoContainer(lastPost: any) {
    console.debug(`updating last video with ${JSON.stringify(lastPost)}`);

    const videoCard = generateVideoCard(lastPost);
    const lastAccessedVideoContainer = document.querySelector('.last-accessed-video')!;
    const lastAccessedVideoTitle = document.createElement('h2');
    lastAccessedVideoTitle.innerText = 'Last Accessed Video';
    lastAccessedVideoContainer.appendChild(videoCard);

}

function postVideo(videoUrl: string): void {
    const baseUrl = 'http://localhost:5000/videos';
    fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl })
    })
    .then(res => {
        console.debug(`res ${JSON.stringify(res)}`);
        console.debug(`posturl ${videoUrl}`);
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', videoUrl);
        downloadLink.href = res.url;
        downloadLink.target = '_blank';
        downloadLink.click();
    })
    .catch(err => console.error(err));
}

function displayPostInfo(post: any): void {
    const videoListContainer = document.querySelector('.video-list')!;
    const videoCard = generateVideoCard(post);
    videoListContainer.appendChild(videoCard);
}

function generateVideoCard(post: any): HTMLElement {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';

    // Create video title
    const videoTitle = document.createElement('a'); // TODO: Style the anchor.
    videoTitle.className = 'video-card__title';
    videoTitle.href = post.url;
    videoTitle.text = post.desc;
    videoCard.appendChild(videoTitle);

    // Create video thumbnail
    const videoThumbnail = document.createElement('div');
    videoThumbnail.className = 'video-card__thumbnail';
    const img = document.createElement('img');
    img.src = post.thumb;
    videoThumbnail.appendChild(img);
    videoCard.appendChild(videoThumbnail);

    // Create video download button
    const videoActions = document.createElement('div');
    videoActions.className = 'video-card__actions';
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('tt-vid-downloader__button', 'download-button');
    downloadButton.textContent = 'Download';
    downloadButton.id = 'btn-download';
    downloadButton.setAttribute('data-url', post.videoUrl);
    downloadButton.addEventListener('click', () => postVideo(post.videoUrl as string));
    videoActions.appendChild(downloadButton);
    videoCard.appendChild(videoActions);

    return videoCard;
}
