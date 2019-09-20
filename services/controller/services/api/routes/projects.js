/**
 * Filename: projects.js
 * Author: Ethan Lindeman & Kevin Coetzee
 * 
 *      This file contains all the endpoints for the API that handles
 *      all project requests to the system
 */
var http = require("http");
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Project = require('../models/project');
const amqp = require('amqplib/callback_api');
var amqpConn = null;

/***
    * request for root (/) page
    * 
    * this function returns all projects stored in the system
    */
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

/***
    * request for basic (/basic) projects page
    * 
    * this function returns a an array of simplified, less detailed projects
    */
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

/***
    * request for detailed (/detailed) projects page
    * 
    * this function mirrors the default root function for legacy use cases
    */
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

/***
    * request for detailedSearch (/detailedSearch) projects page (string id)
    * 
    * this function searches for a certain project by its id, and returns all
    * detailed information about the project based upon that id
    */
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

/***
    * request for earch (/search) projects page (string type, input)
    * 
    * this function searches for a certain project by other values than its
    * id, such as title and username
    */
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

/***
    * request for create (/create) projects page (string project_name, source,
    * createdBy, string array whitelist, blacklist, integer trackTime)
    * 
    * This function is used to create a new project based on a set of input
    * paramaters needed per project. These projects can then be run to aggregate
    * Twitter data
    */
router.post('/create', (req, res, next) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        project_name: req.body.project_name,
        whitelist: req.body.whitelist,
        blacklist: req.body.blacklist,
        source: req.body.source,
        status : false,
        trackTime: req.body.trackTime,
        data: null,
        dataSentiment: null,
        createdBy: "Test User",
        runs: []
    });
    project
    .save()
    .then(result => {
      res.status(200).json({
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

/***
    * request for edit (/edit) projects page (value array)
    * 
    * This function receives an array of values that need to updated for a 
    * certain project as well as the id of a certain project. The projects 
    * specific values are then updated with the new values.
    */
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

/***
    * request for delete (/delete) projects page ()
    * 
    * This function receives a specific project's id and
    * deletes this project in the database
    */
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

/***
    * request for start (/start) projects page (string id, string platform)
    * 
    * This function receives a specific project's id the platform a project
    * needs to run on (e.g. Twitter), and then starts the a listener specific
    * to the platform specified, which aggregates data according to the project's 
    * whitelisted words. Certain metrics are then produced based on the data returned, 
    * before the results are returned. 
    */
router.post('/start', (req, res, next) => {
    try {
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
                            responseString = JSON.parse(responseString);
                            let messages = {
                                data : []
                            }
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
                                    let tweetStructures = [];
                                    Project.find({_id : id})
                                    .exec()
                                    .then((result)=>{
                                        let y = 0;
                                        result[0]['data'].forEach((tweetA) =>{
                                            let x = 0;
                                            tweetsAndSentiments['data'][0].forEach((tweetB)=>{
                                                if(tweetA['tweetID']==tweetB['id_str']){
                                                    result[0]["data"][y]['tweetSentiment'] = tweetsAndSentiments['data'][1]['sentiments'][x];
                                                }
                                                x++;
                                            })
                                            y++;
                                        })
                                        tweetsAndSentiments = JSON.stringify(tweetsAndSentiments);
                                        result[0].status = false;
                                        result[0].save().then(
                                            (result)=>{
                                                console.log(tweetsAndSentiments);
                                                res.status(200).json(tweetsAndSentiments);
                                            }
                                        )
                                    }).catch((err) => {
                                        console.log(err);
                                        res.status(500).json(err);
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
            console.log(err);
            res.status(500).json(err);
        })        
    } catch (error) {
        res.status(500).json(error);
    }
});

/***
    * request for start (/start) projects page (string id, string platform)
    * 
    * This function receives a specific project's id the platform a project
    * needs to run on (e.g. Twitter), and then starts the a listener specific
    * to the platform specified, which aggregates data according to the project's 
    * whitelisted words. Certain metrics are then produced based on the data returned, 
    * before the results are returned. 
    */
router.post('/startStream', (req, res, next) => {
    try {
        startRMQ(res);
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
                    if((platform === "twitter")||(platform === "Twitter")){
                        var options = {
                            host: "localhost",
                            port: 3001,
                            path: "/twitter/stream",
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
                            res.status(200).json(responseString);
                        });
                    });
                    listenerReq.write(postBodyString);
                    listenerReq.end();
                }
            )
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })   
    } catch (error) {
        res.status(500).json(error);
    }
});

/***
    * startRMQ(string res)
    * 
    * This function starts a queue between an instance of the 
    * controller and an instance of a neural-network 
    */
function startRMQ(res){
    var args = process.argv.slice(2);
    amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
        throw error1;
        }
        channel.assertQueue('controller_queue', {
        }, function(error2, q) {
            if (error2) {
            throw error2;
            }
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
        args.forEach(function(severity) {
            channel.bindQueue(q.queue, exchange, severity);
        });
        channel.consume(q.queue, function(msg) {
            let ids = msg.content.toString().split(" ");
            const sock = res.io;
            Project.find({_id : ids[0]})
            .exec()
            .then((result)=>{
                let y = 0;
                while((y<result[0]['data'].length)&&(result[0]['data'][y]['tweetID']!==ids[1])){
                    y++;
                }
                if(y<result[0]['data'].length){
                    console.log("sending message");
                    sock.emit("datasend", result[0]['data'][y]);
                }else if(ids[1]=="/t"){
                    console.log("termination character");
                }
            })
            setTimeout(() => {
                sock.disconnect();
            }, 15000);

        }, {
            noAck: true
        });
        });
    });
    });
}

module.exports = router;
