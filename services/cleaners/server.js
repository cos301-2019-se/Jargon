"use strict";

const http = require("http");
const app = require('./app');
const port = process.env.PORT || 3002;


const server = http.createServer(app);
console.log("running on port 3002");

server.listen(port);