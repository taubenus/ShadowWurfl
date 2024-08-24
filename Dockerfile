FROM python:3.11-alpine

RUN mkdir -p /home/shadowurfl

WORKDIR /home/shadowurfl

COPY ./app /home/shadowurfl

CMD ["python","-m", "http.server", "8080"]
