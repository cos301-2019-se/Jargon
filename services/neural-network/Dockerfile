FROM python:3

WORKDIR ./

COPY requirements.txt ./
RUN pip install -r requirements.txt
RUN python -m spacy download en
RUN pip install connexion[swagger-ui]

COPY . .

CMD [ "python", "./server.py" ]
