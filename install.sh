#!/bin/bash

dir=$(pwd)

setup_extension() {
    cd $dir/extension \
        && npm install && npm run build \
        && echo "Installation DONE!"
}

setup_server() {
    cd $dir/server \
        && docker build . -t twitter-vid-downloader \
        && docker run -v {dir_with_videos}:/usr/src/app/videos -p 5000:5000 twitter-vid-downloader \
        && echo "Docker container Done!"
}

#### MAIN ####
etup_extension
setup_server
