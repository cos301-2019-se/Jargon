const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
        projects: null
    });

    user
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Handled post request to /register",
            createdProduct: result
        });
    })
    .catch(err =>{
        console.log(err),
        res.status(500).json({
            error: err
        })
    })
});


module.exports = router;