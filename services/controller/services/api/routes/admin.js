/**
 * Filename: admin.js
 * Author: Kevin Coetzee
 * 
 *      This file contains all the endpoints for the API that handles
 *      admin management of the system
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../jwtSecret');

/***
    * request for root (/) page (string email, password)
    * 
    * this function receives email and password strings and determines
    * whether they match a user and his/her password in the database
    */
router.post('/deleteUser', (req, res, next) => {
    const id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(200).json({
            message: "No token provided",
            createdProduct: null
        });
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(200).json({
                authenticated: false
            });
        }else{
            if(tokenPlainText.admin == true){
                let updateValues = [
                    {
                        "propName" : "deleted",
                        "value" : true
                    }
                ]
                let updateVals = {};
                for (const vals of updateValues){
                    updateVals[vals.propName] = vals.value;
                }
                User.update({ _id: id }, { $set: updateVals })
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }else{
                res.status(200).json({
                    authenticated: false,
                    message: "This is an admin function."
                });
            }
        }
    })
});

module.exports = router;