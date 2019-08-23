
/**
 * Filename: app.js
 * Author: Ethan Lindeman
 * 
 *  The app.js file is used for routing to different 
 * `platforms' analysis APIs
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const analysisRoutes = require('./routes/analyse');


 /***
    *   use wrapper function 
    * 
    *   sets analysis API return headers for all requests
    */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "*"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET');
        return res.status(200).json({});
    }
    next();
  });

  /***
    *   use function for the analyse route of the analysis
    *   microservice
    * 
    *   sets the route for all requests involving analysis
    */
app.use('/analyse', analysisRoutes);

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