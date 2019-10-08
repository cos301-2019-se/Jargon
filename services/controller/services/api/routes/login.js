/**
 * Filename: login.js
 * Author: Kevin Coetzee
 * 
 *      This file contains all the endpoints for the API that handles
 *      login to the system
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../jwtSecret');

/***
    * request for root (/) page (string email, password)
    * 
    * this function receives email and password strings and determines
    * whether they match a user and his/her password in the database
    */
router.post('/', (req, res, next) => {
    User.find({
        email : req.body.email
    })
    .exec()
    .then(data => {
        if(data.length > 0){
            if(bcrypt.compareSync(req.body.password, data[0].password)){
                if(data[0].deleted==false){
                    jwt.sign({id: data[0]._id, admin: data[0].admin}, jwtConfig.secret, {expiresIn: 86400}, (err, _token) => {
                        if(err){
                            res.status(200).json({
                                message: "Failed to log in",
                                success : false,
                                result : null
                            });
                        }else{
                            safeData = {
                                "_id" : data[0]._id,
                                "name" : data[0].name,
                                "surname" : data[0].surname,
                                "email" : data[0].email,
                                "username" : data[0].username,
                                "deleted" : data[0].deleted,
                                "admin" : data[0].admin,
                                "projects" : data[0].projects
                            }
                            res.status(200).json({
                                message : "Successfully logged in",
                                success : true,
                                result : {
                                    user : safeData,
                                    token : _token
                                } 
                            });   
                        }
                    });
                }else{
                    res.status(200).json({
                        message : "Incorrect username or password",
                        success : false,
                        result : null
                    });
                }
            }else{
                res.status(200).json({
                    message : "Incorrect username or password",
                    success : false,
                    result : null
                });
            }
        }else{
            res.status(200).json({
                message : "Incorrect username or password",
                success : false,
                result : null
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Failed to log in",
            success : false,
            result : null
        });
    });
});

module.exports = router;
