const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');


router.post('/', (req, res, next) => {
    console.log('here');
    User.find({
        email : req.body.email
    })
    .exec()
    .then(data => {
        if (data.length > 0)
        {
            if (bcrypt.compareSync(req.body.password, data[0].password))
            {
                res.status(200).json({
                    status : true,
                    authenticated : true
                });
            }
            else
            {
                res.status(200).json({
                    status : true,
                    authenticated : false
                });
            }
        }
        else
        {
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

    // .then(results => {
    //     if( bcrypt.compareSync(req.body.password, results[0].password)){
    //         res.status(200).json({
    //             authenticated: true
    //         });
    //     }else{
    //         res.status(200).json({
    //             authenticated: false
    //         });
    //     }
    // })
    // .catch(err => {
    //     res.status(500).json({
    //         error: err
    //     });
    // });
});


module.exports = router;