import json

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from uuid import uuid4
from pathlib import Path
import os
import platform

app = Flask(__name__)
CORS(app)
home = Path.home()
if platform.system() == 'Windows':
    videopath = os.path.join(home, 'Videos')
    app.config['TWITTER_VIDEOS'] = videopath
elif platform.system() == 'Linux':
    videopath = os.path.join(home, 'videos')
    app.config['TWITTER_VIDEOS'] = videopath


def get_twitter_videos_path(filename):
    return os.path.join(app.config['TWITTER_VIDEOS'], filename)


def convert(url):
    """
    Generate a file using ffmpeg, with a random name
    """
    randomname = str(uuid4())
    sanitizedurl = url.split("?")[0]
    print(f'convert {sanitizedurl} as {randomname}')
    file = get_twitter_videos_path(randomname + ".mp4")
    os.system(
        f'ffmpeg -i {sanitizedurl} -c copy -hide_banner -loglevel error "{file}"')
    return randomname


@app.route('/videos', methods=['POST'])
@cross_origin()
def videos():
    if request.method == 'POST':
        requestjson = request.data.decode('utf8').replace("'", '"')
        data = json.loads(requestjson)
        name = convert(data['videoUrl'])
        return jsonify({"filename": name})
    return "not possible", 400


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
