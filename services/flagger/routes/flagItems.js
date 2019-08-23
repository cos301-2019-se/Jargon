/**
 * Filename: analyse.js
 * Author: Ethan Lindeman
 * 
 *      This file contains all the endpoints for the API that handles
 *      all flagging of tweets.
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Epoch = require('../models/epoch');

const cap = 10;


/***
    * request for add (/flagItems/add) page (array)
    * 
    * this function receives an array of objects where each object consists of text, a current score and an alternate/new score
    * these are then added to the database for later training
    */

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

    let outputList = [];
    let updated = false;
    let inputTweets = [];
    let len = tweetList.length;
    let num = 0;
    
    Epoch.find()
    .exec()
    .then(data => {
      
        if (data.length <= 0)
        {
            
            while (len != 0)
            {   
               
                if (len < cap)
                {
                    const epoch = new Epoch({
                        _id: new mongoose.Types.ObjectId(),
                        size : len,
                        capacity : cap,
                        tweets : tweetList,
                        trained : false
                    });

                    epoch
                    .save()
                    .then(result => {
                        outputList.push("Success.");
                        
                    })
                    .catch(err => {
                        outputList.push("Failed.");
                    });
                    len = 0;
                }
                else
                {
                    
                    inputTweets = tweetList.splice(0, cap);

                    if (num <= 1)
                    {
                        console.log(inputTweets);
                        num++;
                    }
                    
                    const epoch = new Epoch({
                        _id: new mongoose.Types.ObjectId(),
                        size : cap,
                        capacity : cap,
                        tweets : inputTweets,
                        trained : false
                    });

                    epoch
                    .save()
                    .then(result => {
                        outputList.push("Success.");
                        
                        
                    })
                    .catch(err => {
                        outputList.push("Failed.");
                      

                    });
                    len = len - cap;
                    
                }
            }
            res.status(200).json({
                output : outputList
            });
        }
        else
        {
            while(tweetList.length != 0)
            {
                if (!updated)
                {
                    console.log("not updated");
                    let end = data.length - 1;
                    let lastSize = data[end].size;
                   
                    let tweetsAdd = data[end].tweets;
                    updated = true;
                    if (lastSize < cap)
                    {
                        let s = cap - lastSize;
                        if (s > tweetList.length)
                            s = tweetList.length;
                    
                        for (let i = 0; i < s; i++)
                        {
                            tweetsAdd.push(tweetList.pop());
                        }

                        data[end].size = lastSize + s;
                        data[end].tweets = tweetsAdd;

                        data[end]
                        .save()
                        .then(result => {
                            outputList.push("Updated");
                        })
                        .catch(err => {
                            outputList.push("Failed");
                        });


                    }
                }
                else
                {
                    len = tweetList.length;
                    inputTweets = [];
                   
                    while (len != 0)
                    {
                      
                        if (len < cap)
                        {
                            const tempList = tweetList;
                            tweetList = [];
                            const epoch = new Epoch({
                                _id: new mongoose.Types.ObjectId(),
                                size : len,
                                capacity : cap,
                                tweets : tempList,
                                trained : false
                            });

                            epoch
                            .save()
                            .then(result => {
                                outputList.push("Success.");
                                
                            })
                            .catch(err => {
                                outputList.push("Failed.");
                            });
                            len = 0;
                        }
                        else
                        {
                            inputTweets = tweetList.splice(0, cap);
                            const epoch = new Epoch({
                                _id: new mongoose.Types.ObjectId(),
                                size : cap,
                                capacity : cap,
                                tweets : inputTweets,
                                trained : false
                            });

                            epoch
                            .save()
                            .then(result => {
                                outputList.push("Success.");
                                
                            })
                            .catch(err => {
                                outputList.push("Failed.");
                            });
                            len = len - cap;
                            
                        }
                    }
                }
            }
           
        }

        if (tweetList.length == 0)
        {
            res.status(200).json({
                output : outputList
            });
        }
    });


    
});

/***
    * request for train (/flagItems/train) page (none)
    * 
    * this route finds the next set of data to be trained on and sets it to be trained with
    * this is updated in the database
    */

router.post('/train', (req, res, next) => {

    Epoch.find()
    .exec()
    .then(data => {
        let len = data.length;
        if (len > 0)
        {
            for(let i = 0; i < len; i++)
            {
                if (!data[i].trained)
                {
                    data[i].trained = true;
                    data[i].save()
                    .then(result => {
                       
                    });
                    break;
                }
            }
        }

        res.status(200).json({
            success : true
        });
    });

});


module.exports = router;