#
#    Filename: Dockerfile
#    Author  : Herbert Magaya
#    Type    : Containerization
#    
#       This file contains the docker build instructions for
#       the neural network service.
#
FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install -r requirements.txt
RUN python -m spacy download en
RUN pip install connexion[swagger-ui]

COPY . .

CMD [ "python", "./server.py" ]
