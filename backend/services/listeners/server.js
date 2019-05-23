"use strict";

const http = require("http");
const app = require('./app');
const port = process.env.PORT || 3001;


const server = http.createServer(app);

server.listen(port);

const db = require('./db/db');
db();