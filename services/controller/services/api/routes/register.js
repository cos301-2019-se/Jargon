/**
 * Filename: register.js
 * Author: Kevin Coetzee
 * 
 *      This file contains all the endpoints for the API that handles
 *      registration with the system
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

/***
    * request for root (/) page (string name, surname, 
    * email, username, adminValue, password)
    * 
    * this function receives a collection of data associated with a certain 
    * unregistered user and adds this user, along with his/her data to the 
    * database 
    */
router.post('/', (req, res, next) => {
    let saltToSave = bcrypt.genSaltSync();
    let passwordToSave = bcrypt.hashSync(req.body.password, saltToSave);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        username: req.body.username,
        password: passwordToSave,
        admin: req.body.admin,
        projects: null
    });
    user
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Handled post request to /register",
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
});

module.exports = router;