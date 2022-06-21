## Build
```
cd server
docker build . -t twitter-vid-downloader
```

## Run 
```
docker run -v {dir_with_videos}:/usr/src/app/video -p 5000:5000 twitter-vid-downloader
```
