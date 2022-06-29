Write-Host "Setting up docker container..."
echo $args[0]

$dir = Get-Location
$dir = $dir.ToString()
$server = $dir + "\server"
$extension = $dir + "\extension"
$tag = "twitter-vid-downloader"
$videoDir = $args[0]
cd $server 
docker build -t $tag .

Write-Host "Mounting to dir: $videoDir" 
docker run -v ${videoDir}:/usr/src/app/videos -p 5000:5000 --name ${tag} -i ${tag}

Write-Host "Container up and running"

Write-Host "Setting up chrome extension..."

cd ($dir + "\extension") 
npm install 
npm run build
cd ..

Expand-Archive ($dir + "\extension\release.zip") -DestinationPath release -Force
