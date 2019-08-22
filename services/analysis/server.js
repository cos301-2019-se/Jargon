"use strict";

/**
 * Filename: server.js
 * Author: Ethan Lindeman
 * 
 *      This file executes the Node server
 *      for the analysis microservice
 */

const http = require("http");
const app = require('./app');
const port = process.env.PORT || 3004;


const server = http.createServer(app);

server.listen(port);

const db = require('./db/db');
db();