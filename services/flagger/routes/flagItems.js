const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FlaggedItem = require('../models/flaggedItem');
const Epoch = require('../models/epoch');

const cap = 10;

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
    
    Epoch.find()
    .exec()
    .then(data => {
        console.log(data);
        if (data.length <= 0)
        {
            console.log("init");
            while (len != 0)
            {   
                console.log("waiting initial " + len);
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
                        len = 0;
                    })
                    .catch(err => {
                        outputList.push("Failed.");
                    });
                    
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
                        len = len - cap;
                    })
                    .catch(err => {
                        outputList.push("Failed.");
                    });

                    
                }
            }
            res.status(200).json({
                output : outputList
            });
        }
        else
        {
            console.log("extra");
            if (!updated)
            {
                let end = data.length - 1;
                let lastSize = data[end].size;
                
                let tweetsAdd = data[end].tweets;
                updated = true;
                if (lastSize < cap)
                {
                    const s = lastSize - cap;
                    for (let i = 0; i < s; i++)
                    {
                        tweets.push(tweetList.pop());
                    }

                    data[end].size = cap;
                    data[end].tweets = tweetList;

                    data[end]
                    .save()
                    .then(result => {
                        outputList.push("Updated");
                    })
                    .catch(err => {
                        outputList.push("Failed");
                    });


                   /* let updateVals = {
                        size : cap,
                        tweets : tweetsAdd
                    };
                    
                    Epoch.update({ _id: id }, { $set: updateVals })
                    .exec()
                    .then(result => {
                        outputList.push("Updated.");
                        //updated = true;
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });*/


                }
                if (tweetList.length == 0)
                {
                    res.status(200).json({
                        output : outputList
                    });
                }
            }
            else
            {
                len = tweetList.length;
                inputTweets = [];

                while (len != 0)
                {
                    console.log("waiting add " + len);
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
                            len = 0;
                        })
                        .catch(err => {
                            outputList.push("Failed.");
                        });
                        
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
                            len = len - cap;
                        })
                        .catch(err => {
                            outputList.push("Failed.");
                        });

                        
                    }
                }

                res.status(200).json({
                    output : outputList
                });

            }
        }

        
    });


    

    /*const epoch = new Epoch({
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
        res.status(200).json({
            output: outputList
        });
    })
    .catch(err => {
        outputList.push("Failed.");
        res.status(200).json({
            output: err
        });
    });*/

    
});


module.exports = router;