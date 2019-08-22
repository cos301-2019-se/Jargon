#
#    Filename: Dockerfile
#    Author  : Herbert Magaya
#    Type    : Containerization
#    
#       This file contains the docker build instructions for
#       the controller service.
##
# Base image
FROM node:12-alpine

# Set Workdir
WORKDIR /usr/src/app

# Get package.json
COPY package.json .

# Install application dependencies
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp

# Get source
# .dockerignore is used to exclude files
COPY . .

# Set correct permissions
RUN set -ex && \
  chown -R node:node .

# Switch to node user
USER node

# Expose ports
EXPOSE 3000

# Default command
CMD yarn start
