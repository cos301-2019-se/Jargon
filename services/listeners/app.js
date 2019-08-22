/**
 * Filename: app.js
 * Author: Kevin Coetzee
 * 
 *      This file provides the API routing for the
 *      different files within the listeners microservice
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twitterRoutes = require('./api/twitterAPI');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/***
    *   use wrapper function 
    * 
    *   sets listener API return headers for all requests
    */
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
      "Access-Control-Allow-Headers",
      "*"
    );
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'POST, GET');
        return response.status(200).json({});
    }
    next();
  });

/***
    *   use function for the Twitter route of the listener
    *   microservice
    * 
    *   sets the route for all requests involving Twitter 
    */
app.use('/twitter', twitterRoutes);

/***
    *   use function for the default error page
    * 
    *   sets the response for the default error (404) page 
    */
app.use((req, res, next) => {
    const error = new Error("Resource not found");
    error.status = 404;
    next(error);
  });
  
/***
    *   use function for the default server error page
    * 
    *   sets the response for the default server error 
    *   (500) page 
    */
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        status: error.status,
        message: error.message
      }
    });
  });

module.exports = app;