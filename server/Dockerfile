FROM python:3.8-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache ffmpeg

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "./app.py"]
