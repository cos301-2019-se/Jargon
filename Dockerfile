FROM ubuntu:18.04
RUN apt-get update && apt install -y git
# FROM node:alpine as builder
COPY package.json ./
RUN apt update -y && apt install -y nodejs npm
RUN node -v
RUN npm install && mkdir /jargon && mv ./node_modules ./jargon
WORKDIR /jargon
COPY . .
RUN npm build
# CMD ["npm","start"]
#RUN cd backend
CMD ["npm","start"]
# FROM nginx:alpine
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=builder /jargon/dist /usr/share/nginx/html
# COPY --from=builder /jargon/entrypoint.sh /usr/share/nginx/
# RUN chmod +x /usr/share/nginx/entrypoint.sh
# CMD ["/bin/sh", "/usr/share/nginx/entrypoint.sh"]
