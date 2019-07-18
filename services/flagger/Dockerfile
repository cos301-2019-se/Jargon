# Base image
FROM node:12-alpine

# Set Workdir
WORKDIR /usr/src/app

# Get package.json
COPY package.json .

# Install application dependencies
RUN set -e && \
  yarn

# Get source
# .dockerignore is used to exclude files
COPY . .

# Set correct permissions
RUN set -ex && \
  chown -R node:node .

# Switch to node user
USER node

# Expose ports
EXPOSE 3002

# Default command
CMD yarn start
