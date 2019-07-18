"use strict";

const http = require("http");
const app = require('./app');
const port = process.env.PORT || 3003;


const server = http.createServer(app);
console.log("running on port 3003");

server.listen(port);