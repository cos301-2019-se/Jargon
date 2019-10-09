#
#    Filename: Dockerfile
#    Author  : Herbert Magaya
#    Type    : Containerization
#    
#       This file contains the docker build instructions for
#       the web service.
##

# Stage 1
FROM node:10.15.1 as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm link @angular/cli

COPY . .

ARG ENV

# RUN npm run build:prod
RUN npm run build
RUN run start

# Stage 2
FROM nginx:1.13.12-alpine

COPY --from=node /usr/src/app/dist /usr/share/nginx/html
COPY docker/nginx /etc/nginx/conf.d
