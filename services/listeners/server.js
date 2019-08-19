/**
 * Filename: app.js
 * Author: Kevin Coetzee
 * 
 *      This file provides the API routing for the
 *      different files within the listeners microservice
 */
"use strict";

const http = require("http");
const app = require('./app');
const port = process.env.PORT || 3001;

const server = http.createServer(app);
server.listen(port);
const db = require('./db/db');
db();