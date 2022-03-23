function updateFromLastVideo(response) {
    console.debug(`updating last video with ${JSON.stringify(response)}`)
    let a = document.getElementById('download-link');
    a.href = response.videoUrl;
    a.textContent = response.initiator;
}

chrome.runtime.sendMessage('get-info', response => {
    console.log(`get info response ${JSON.stringify(response)}`);
    if (response === "") return;
    console.debug(`updating using ${JSON.stringify(response)}`);
    chrome.storage.local.get('posts', result => {
        let { posts } = result;
        updateFromLastVideo(response);
        let ul = document.getElementById('video-list');
        posts.forEach(post => {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.href = post.videoUrl;
            a.textContent = post.initiator;
            li.appendChild(a);
            ul.appendChild(li);
        })
    })
    
})
