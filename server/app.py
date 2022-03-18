from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS, cross_origin
from uuid import uuid4
import os
import logging

app = Flask(__name__)
CORS(app)
app.config['TWITTER_VIDEOS'] = 'D:\\workspace\\anti-fancam\\server\\videos\\'


def convert(url):
    randomname = str(uuid4())
    print(f'convert {url} as {randomname}')
    os.system(f'ffmpeg -i {url} -c copy -bsf:a aac_adtstoasc -hide_banner -loglevel error ./videos/{randomname}.mp4')
    return randomname


@app.route('/videos', methods=['POST', 'GET'])
@cross_origin()
def videos():
    if request.method == 'POST':
        print(request.data, request.json)
        logging.info(app.config['TWITTER_VIDEOS'])
        if request.method == 'POST':
            name = convert(request.json['videoUrl'])
            data = {"name": name}
            return jsonify(data), 200
    if request.method == 'GET':
        data = {"videos": os.listdir(os.path.join('.', 'videos'))}
        return jsonify(data), 200
    return "not possible", 400


@app.route('/downloads', methods=['GET'])
@cross_origin()
def download_videos():
    if request.method == 'GET':
        res = send_from_directory(app.config['TWITTER_VIDEOS'],
                                  path=request.args.get('filename') + '.mp4',
                                  as_attachment=True)
        logging.info(res)
        return res


if __name__ == '__main__':
    print(os.listdir(os.path.join('.', 'videos')))
    app.run(debug=True)
