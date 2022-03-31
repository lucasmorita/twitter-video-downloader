import json

from flask import Flask, send_from_directory, jsonify, request, url_for, make_response
from flask_cors import CORS, cross_origin
from uuid import uuid4
import os

from werkzeug.utils import redirect, send_file

app = Flask(__name__)
CORS(app)
app.config['TWITTER_VIDEOS'] = 'D:\\workspace\\twitter-vd-downloader\\server\\videos'


def convert(url):
    randomname = str(uuid4())
    sanitizedurl = url.split("?")[0]
    print(f'convert {sanitizedurl} as {randomname}')
    os.system(f'ffmpeg -i {sanitizedurl} -c copy -bsf:a aac_adtstoasc -hide_banner -loglevel error ./videos/{randomname}.mp4')
    return randomname


@app.route('/videos', methods=['POST', 'GET'])
@cross_origin()
def videos():
    if request.method == 'POST':
        requestjson = request.data.decode('utf8').replace("'", '"')
        data = json.loads(requestjson)
        name = convert(data['videoUrl'])
        return redirect(url_for('downloads', filename=name))
    if request.method == 'GET':
        data = {"videos": os.listdir(os.path.join('.', 'videos'))}
        return jsonify(data), 200
    return "not possible", 400


@app.route('/downloads', methods=['GET'])
@cross_origin()
def downloads():
    if request.method == 'GET':
        res = make_response(send_from_directory(app.config['TWITTER_VIDEOS'],
                                                path=request.args.get('filename') + '.mp4',
                                                as_attachment=True))
        return res


if __name__ == '__main__':
    print(os.listdir(os.path.join('.', 'videos')))
    app.run(debug=True)
