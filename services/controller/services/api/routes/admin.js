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
const bcrypt = require('bcrypt-nodejs');

/***
* request for createAdminUser (/) route (string name, surname, 
* email, username, password)
* 
* this function receives a collection of data associated with a certain 
* unregistered user and adds this user, along with his/her data to the 
* database, as an admin user 
*/
router.post('/createAdminUser', (req, res, next) => {
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
                let saltToSave = bcrypt.genSaltSync();
                let passwordToSave = bcrypt.hashSync(req.body.password, saltToSave);
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    username: req.body.username,
                    password: passwordToSave,
                    admin: true,
                    projects: null,
                    deleted: false
                });
                user
                .save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: "Handled post request to /createAdminUser",
                        success: true,
                        createdProduct: result
                    });
                })
                .catch(err =>{
                    console.log(err),
                    res.status(200).json({
                        message: "Could not register",
                        success: true,
                        createdProduct: null
                    })
                })
            }else{
                res.status(200).json({
                    authenticated: false,
                    message: "This is an admin function."
                });
            }
        }
    })
});

/***
    * request for deleteUser (/) route (string id)
    * 
    * this function receives a user ID and determines
    * whether they match a user in the database, after which it is soft-deleted
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

/***
* request for createAdminUser (/) route (string name, surname, 
* email, username, password)
* 
* this function receives a collection of data associated with a certain 
* unregistered user and adds this user, along with his/her data to the 
* database, as an admin user 
*/
router.post('/', (req, res, next) => {
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