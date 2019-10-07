/**
 * Filename: app.js
 * Author: Ethan Lindeman, Kevin Coetzee
 * 
 *  The app.js file is used for routing to different 
 *  controller API endpoints
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const loginRoutes = require('./services/api/routes/login');
const registerRoutes = require('./services/api/routes/register');
const projectRoutes = require('./services/api/routes/projects');
const adminRoutes = require('./services/api/routes/admin');

const socketIOClient = require('socket.io-client');

 /***
    *   use wrapper function 
    * 
    *   sets controller API return headers for all requests
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
    res.io = socketIOClient.connect("http://127.0.0.1:3005");
    next();
  });


/***
    *   use function for the login, register and projects routes of the controller
    *   microservice
    * 
    *   sets the route for all requests involving either login, register or projects
    */

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/projects', projectRoutes);
app.use('/admin', adminRoutes);

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