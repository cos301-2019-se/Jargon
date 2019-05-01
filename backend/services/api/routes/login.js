const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.post('/', (req, res, next) => {
    User.find({
        email : req.body.email
    }).exec()
    .then(results => {
        if(results[0].password===req.body.password){
            res.status(200).json({
                authenticated: true
            });
        }else{
            res.status(200).json({
                authenticated: false
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