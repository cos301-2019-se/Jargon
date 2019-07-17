const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FlaggedItem = require('../models/flaggedItem');
const Epoch = require('../models/epoch');



router.post('/add', (req, res, next) => {

    const list = req.body.tweets;

    let tweetList = [];
    list.forEach(elem => {
        const item = {
            text: elem.text,
            currentScore: elem.currentScore,
            alternateScore: elem.alternateScore
        };
        tweetList.push(item);
    });
    
    Epoch.find()
    .exec()
    .then(data => {
        if (data.length <= 0)
        {
            const epoch = new Epoch({
                _id: new mongoose.Types.ObjectId(),
                size : 0,
                capacity : 10,
                timestamp : Date.now,
                tweets : tweetList
            })
            .save()
            .then(result => {
                res.status(200).json({
                    message: "Epoch successfully added"
                });
            });
        }
    });
    .save()
    .then(result => {

      
      res.status(200).json({
        message: "Flagged item successfully added",
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}


module.exports = router;