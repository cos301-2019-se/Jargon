var http = require("http");
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Project = require('../models/project');
// const querystring = require('querystring');

router.get('/', (req, res, next) => {
    Project.find()
    .exec()
    .then(results => {
        console.log(results);
        res.status(200).json(results);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.get('/basic', (req, res, next) => {
    Project.find()
    .exec()
    .then(results => {
        const retProjects = [];
        let simplify = results.forEach((proj)=>{
            let tempProj = {};
            tempProj["_id"] = proj["_id"];
            tempProj["project_name"] = proj["project_name"];
            tempProj["whitelist"] = proj["whitelist"];
            tempProj["blacklist"] = proj["blacklist"];
            tempProj["source"] = proj["source"];
            tempProj["trackTime"] = proj["trackTime"];
            tempProj["created"] = proj["created"];
            tempProj["createdBy"] = proj["createdBy"];
            retProjects.push(tempProj);
        });
        console.log(retProjects);
        res.status(200).json(retProjects);           
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/detailed', (req, res, next) => {
    Project.find()
    .exec()
    .then(results => {
        console.log(results);
        res.status(200).json(results);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/detailedSearch', (req, res, next) => {
    const id = req.body.id;
      Project.findById(id)
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

router.get('/search', (req, res, next) => {
  const type = req.body.searchType;
  const input = req.body.input;
  if (type === 'title')
  {
    Project.find({
      project_name: new RegExp(input, "i")
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  }
  else if (type === 'user')
  {
    Project.find({
      createdBy: new RegExp(input, "i")
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  }
});

router.post('/create', (req, res, next) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        project_name: req.body.project_name,
        whitelist: req.body.whitelist,
        blacklist: req.body.blacklist,
        source: req.body.source,
        status : false,
        // startTime: req.body.startTime,
        trackTime: req.body.trackTime,
        data: null,
        dataSentiment: null,
        createdBy: "Test User",
        runs: null
    });

    project
    .save()
    .then(result => {
      res.status(201).json({
        message: "Handling POST requests to /projects/create",
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/edit', (req, res, next) => {
    const id = req.body.id;

    let updateVals = {};
    for (const vals of req.body.updateValues)
    {
        updateVals[vals.propName] = vals.value;
    }
    Project.update({ _id: id }, { $set: updateVals })
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
});

router.post('/delete', (req, res, next) => {
  const id = req.body.id;
  Project.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
  });
});

router.post('/start', (req, res, next) => {
    const id = req.body.id;
    const platform = req.body.platform;

    Project.find({_id : id})
    .exec()
    .then((result)=>{
        result[0].status = true;
        result[0].save().then(
            ()=>{
                let postBody = {
                    'id' : id,
                    'platform' : platform
                }
                let postBodyString = JSON.stringify(postBody);
                if((platform === "twitter")||(platform==="Twitter")){
                    var options = {
                        host: "localhost",
                        port: 3001,
                        path: "/twitter/",
                        method: "POST",
                        headers: {
                            'Content-Length': Buffer.byteLength(postBodyString),
                            "Content-Type": "application/json"
                        }
                    };
                }
                let responseString;
                var listenerReq = http.request(options, (listenerRes)=>{
                    responseString = "";
                    listenerRes.on("data", (data) => {
                        responseString += data;
                    });
                    listenerRes.on("end", () => {
                        responseString = JSON.parse(responseString);
                        let messages = {
                            data : []
                        }
                        // messages = JSON.parse(messages);
                        responseString.forEach((element)=>{
                            messages['data'].push(element['text']);
                        });
                        messages = JSON.stringify(messages);
                        var nnOptions = {
                            host: "localhost",
                            port: 5000,
                            path: "/api/evaluate",
                            method: "POST",
                            headers: {
                                'Content-Length': Buffer.byteLength(messages),
                                "Content-Type": "application/json"
                            }
                        };
            
                        var nnReq = http.request(nnOptions, (nnRes)=>{
                            var nnResponseString = "";
                            nnRes.on("data", (nnData) => {
                                nnResponseString += nnData;
                            });
                            nnRes.on("end", () => {
                                nnResponseString = JSON.parse(nnResponseString);
                                
                                let tweetsAndSentiments = {
                                    data : []
                                }
                                tweetsAndSentiments['data'].push(responseString);
                                tweetsAndSentiments['data'].push(nnResponseString);
                 
                                Project.find({_id : id})
                                .exec()
                                .then((result)=>{
                                    let today = new Date();
                                    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                                    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                    let currDate = date+' '+time;

                                    let totalTweets = 0;
                                    let posTweets = 0;
                                    let negTweets = 0;
                                    let bestTweet = -1;
                                    let worstTweet = -1;
                                    let bestTweetScore = -0.1;
                                    let worstTweetScore = 1.1;

                                    
                                    tweetsAndSentiments['data'][1]['sentiments'].forEach((sentiment, ind)=>{
                                        totalTweets++;
                                        if(sentiment>0.5){
                                            posTweets++;
                                        }
                                        if(sentiment<0.5){
                                            negTweets++;
                                        }
                                        if(sentiment<worstTweetScore){
                                            worstTweet = ind;
                                            worstTweetScore = sentiment;
                                        }
                                        if(sentiment>bestTweetScore){
                                            bestTweet = ind;
                                            bestTweetScore = sentiment;
                                        }
                                    })

                                    let runInfo = {
                                        dateRun : currDate,
                                        positivePercentage : (posTweets/totalTweets),
                                        negativePercentage : (negTweets/totalTweets),
                                        bestTweet : tweetsAndSentiments['data'][0][bestTweet]["text"],
                                        bestTweetSentiment : bestTweetScore,
                                        worstTweet : tweetsAndSentiments['data'][0][worstTweet]["text"],
                                        worstTweetSentiment : worstTweetScore
                                    }
                                    result[0].dataSentiment = tweetsAndSentiments["data"][1]['sentiments'];
                                    tweetsAndSentiments = JSON.stringify(tweetsAndSentiments);
                                    
                                    result[0].runs.push(runInfo);
                                    result[0].status = false;
                                    result[0].save().then(
                                        (result)=>{
                                            res.status(200).json(tweetsAndSentiments);
                                        }
                                    )
                                }).catch((err) => {
                                    // console.log(typeof result[0].data);
                                })
                            });
                        });
                        nnReq.write(messages);
                        nnReq.end();
            
                    });
                });
            
                listenerReq.write(postBodyString);
                listenerReq.end();
            }
        )
    }).catch((err) => {
    //   console.log(typeof result[0].data);
    })

    
});

module.exports = router;
