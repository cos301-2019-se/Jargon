"use strict";

const http = require("http");
const app = require('./app');
const {parse} = require("querystring");
const port = process.env.PORT || 3000;


const server = http.createServer(app);

server.listen(port);

const db = require('./db/db');
db();