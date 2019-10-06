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
                jwt.sign({id: data[0]._id, admin: data[0].admin}, jwtConfig.secret, {expiresIn: 86400}, (err, _token) => {
                    if(err){
                        res.status(200).json({
                            status : true,
                            authenticated : false,
                            token: err
                        });
                    }else{
                        res.status(200).json({
                            status : true,
                            authenticated : true,
                            token: _token,
                            admin: data[0].admin
                        });   
                    }
                });
            }else{
                res.status(200).json({
                    status : true,
                    authenticated : false
                });
            }
        }
        else{
            res.status(200).json({
                status: false,
                result: "User does not exist."
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;