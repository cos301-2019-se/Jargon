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
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../jwtSecret');
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
                    let returnObject = {
                        tweetText: result[0]['data'][y]['tweetObject']['text'],
                        tweetSentiment: result[0]['data'][y]['tweetSentiment']
                    };
                    sock.emit("datasend", returnObject);
                }else if(ids[1]=="/t"){
                    console.log("termination character");
                }
            })
            setTimeout(() => {
                sock.disconnect();
            }, 45000);

        }, {
            noAck: true
        });
        });
    });
    });
}

// TOKEN ROUTES

/***
* request for basic (/basic) projects page
* 
* this function returns a an array of simplified, less detailed projects
*/
router.post('/basicTokenized', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            Project.find( {"createdBy" : tokenPlainText.id, "deleted" : false}, "_id project_name whitelist blacklist source trackTime created createdBy deleted status")
            .exec()
            .then(results => {
                console.log(results);
                const allProj = results;
                const retProjects = [];
                let count = 0;
                if(results.length>0){
                    let simplify = results.forEach((proj)=>{
                        if(proj["deleted"]==false){
                            Project.aggregate([{$match: {_id: mongoose.Types.ObjectId(proj["_id"])}}, {$project: {data: {$size: '$data'}}}])
                            .exec()
                            .then(result_ => {
                                let tempProj = {};
                                tempProj["_id"] = proj["_id"];
                                tempProj["project_name"] = proj["project_name"];
                                tempProj["whitelist"] = proj["whitelist"];
                                tempProj["blacklist"] = proj["blacklist"];
                                tempProj["source"] = proj["source"];
                                tempProj["trackTime"] = proj["trackTime"];
                                tempProj["created"] = proj["created"];
                                tempProj["createdBy"] = proj["createdBy"];
                                tempProj["deleted"] = proj["deleted"];
                                tempProj["status"] = proj["status"];
                                tempProj["size"] = result_[0]['data'];
                                retProjects.push(tempProj);
                                count++;
                                if(count==allProj.length){
                                    console.log(retProjects);
                                    res.status(200).json({
                                        success: true,
                                        message: "Successfully retrieved projects",
                                        result: retProjects
                                    });
                                }
                            })
                            .catch((err)=>{
                                console.log(err);
                                res.status(500).json({
                                    message: "Failed to retrieve projects",
                                    success: false,
                                    result: null
                                });
                            })
                        }else{
                            count++;
                            console.log("project is soft deleted.");
                            if(count==allProj.length){
                                console.log(retProjects);
                                res.status(200).json({
                                    success: true,
                                    message: "Successfully retrieved projects",
                                    result: retProjects
                                });
                            }
                        }
                    });
                }else{
                    res.status(200).json({
                        success: true,
                        message: "Successfully retrieved projects",
                        result: [] 
                    });
                }          
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to retrieve projects",
                    success: false,
                    result: null
                });
            });
        }
    })
});

/***
    * request for detailed (/detailed) projects page
    * 
    * this function mirrors the default root function for legacy use cases
    */
   router.post('/detailedTokenized', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            console.log();
            Project.find( {"createdBy" : tokenPlainText.id}, "_id project_name whitelist blacklist source trackTime created createdBy deleted")
            .exec()
            .then(results => {
                const retProjects = [];
                results.forEach((project)=>{
                    if(proj["deleted"]==false){
                        retProjects.push(project);
                    }
                });
                res.status(200).json({
                    success: true,
                    message: "Successfully retrieved projects",
                    result: retProjects 
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to retrieve projects",
                    success: false,
                    result: null
                });
            });
        }
    })
});

/***
    * request for detailedSearch (/detailedSearch) projects page (string id)
    * 
    * this function searches for a certain project by its id, and returns all
    * detailed information about the project based upon that id
    */
   router.post('/detailedSearchTokenized', (req, res, next) => {
        const id = req.body.id;
        let token = req.headers['x-access-token'];
        if(!token){
            res.status(401).json({});
        }
        jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
            if(err){
                res.status(401).json({});
            }else{
                Project.findById(id)
                .exec()
                .then(result_ => {
                    if((result_["createdBy"]==tokenPlainText.id)&&(result_["deleted"]==false)){
                        console.log(result_);
                        res.status(200).json({
                            message: "Successfully retrieved project",
                            success: true,
                            result: result_ 
                        });
                    }else{
                        res.status(200).json({
                            message: "Failed to retrieve project",
                            success: false,
                            result: null
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to retrieve project",
                        success: false,
                        result: null
                    });
                });
            }
        })
  });

/***
* request for tweets (/tweets) page (string id)
* 
* this function searches for a certain project by its id, and returns
* an array of tweets stored in that project based on the page and count specified
*/
router.post('/tweets', (req, res, next) => {
    const projectID = req.body.id;
    const page = req.body.page;
    const count = req.body.count;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            Project.aggregate([{$match: {_id: mongoose.Types.ObjectId(projectID)}}, {$project: {data: {$size: '$data'}}}])
            .exec()
            .then(result_ => {
                let size = result_[0]['data'];
                let firstIndex = (page-1)*count;
                let lastIndex = (page*count)-1; 
                if(firstIndex<size){
                    if(lastIndex<size){
                        Project.find({"_id" : projectID, "createdBy" : tokenPlainText.id, "deleted" : false}, {data: {$slice: [firstIndex, (lastIndex-firstIndex+1)]}})
                        .exec()
                        .then((result_) => {
                            let returnArray = [];
                            result_[0]["data"].forEach((element)=>{
                                let tempObject = {}
                                tempObject["tweetID"] = element["tweetID"];
                                tempObject["tweetSentiment"] = element["tweetSentiment"];
                                tempObject["tweetText"] = element["tweetObject"]["text"];
                                tempObject["id"] = element["id"];
                                returnArray.push(tempObject);
                            })
                            console.log(returnArray);
                            res.status(200).json({
                                message: "Successfully retrieved data",
                                success: true,
                                result: returnArray 
                            });
                        })
                        .catch(() => {
                            console.log(err);
                            res.status(500).json({
                                message: "Failed to retrieve data",
                                success: false,
                                result: null
                            });
                        });
                    }else{
                        Project.find({"_id" : projectID, "createdBy" : tokenPlainText.id, "deleted" : false}, {data: {$slice: [firstIndex, (size-firstIndex+1)]}})
                        .exec()
                        .then(() => {
                            let returnArray = [];
                            result_[0]["data"].forEach((element)=>{
                                let tempObject = {}
                                tempObject["tweetID"] = element["tweetID"];
                                tempObject["tweetSentiment"] = element["tweetSentiment"];
                                tempObject["tweetText"] = element["tweetObject"]["text"];
                                tempObject["id"] = element["id"];
                                returnArray.push(tempObject);
                            })
                            console.log(returnArray);
                            res.status(200).json({
                                message: "Successfully retrieved data",
                                success: true,
                                result: returnArray
                            });
                        })
                        .catch(() => {
                            console.log(err);
                            res.status(500).json({
                                message: "Failed to retrieve data",
                                success: false,
                                result: null
                            });
                        });
                    }
                }else{
                    if(page==1){
                        res.status(200).json({
                            success: true,
                            message: "No tweets saved yet",
                            result: []
                        });
                    }else{
                        res.status(200).json({
                            success: false,
                            message: "Invalid index given",
                            result: []
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to retrieve data",
                    success: false,
                    result: null
                });
            });
        }
    })
});

/***
    * request for create (/create) projects page (string project_name, source,
    * createdBy, string array whitelist, blacklist, integer trackTime)
    * 
    * This function is used to create a new project based on a set of input
    * paramaters needed per project. These projects can then be run to aggregate
    * Twitter data
    */
   router.post('/createTokenized', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, plainTextToken)=>{
        if(err){
            res.status(401).json({});
        }else{
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                project_name: req.body.project_name,
                whitelist: req.body.whitelist,
                blacklist: req.body.blacklist,
                source: req.body.source,
                status : false,
                trackTime: req.body.trackTime,
                data: [],
                dataSentiment: [],
                createdBy: plainTextToken.id,
                runs: [],
                deleted: false
            });
            project
            .save()
            .then(result => {
                res.status(200).json({
                    message: "Successfully created project",
                    success: true,
                    result: null
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to create project",
                    success: false,
                    result: null
                });
            });
        }
    });
});

/***
    * request for edit (/edit) projects page (value array)
    * 
    * This function receives an array of values that need to updated for a 
    * certain project as well as the id of a certain project. The projects 
    * specific values are then updated with the new values.
    */
   router.post('/editTokenized', (req, res, next) => {
    const id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            Project.findById(id)
            .exec()
            .then(result => {
                if((result["createdBy"]==tokenPlainText.id)&&(result["deleted"]==false)){
                    console.log("authenticated successfully.")
                    let updateVals = {};
                    for (const vals of req.body.updateValues){
                        updateVals[vals.propName] = vals.value;
                    }
                    Project.updateOne({ _id: id }, { $set: updateVals })
                    .exec()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            message: "Successfully edited project",
                            success: true,
                            result: null
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Failed to edit project",
                            success: false,
                            result: null
                        });
                    });
                }else{
                    res.status(200).json({
                        message: "Failed to edit project",
                        success: false,
                        result: null
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to edit project",
                    success: false,
                    result: null
                });
            });
        }
    })
});

/***
* request for delete (/delete) projects page ()
* 
* This function receives a specific project's id and
* deletes this project in the database
*/
router.post('/deleteTokenized', (req, res, next) => {
    const id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            Project.findById(id)
            .exec()
            .then(result => {
                if((result["createdBy"]==tokenPlainText.id)&&(result["deleted"]==false)){
                    console.log("authenticated successfully.")
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
                    Project.update({ _id: id }, {$set: updateVals})
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Successfully deleted project",
                            success: true,
                            result: null
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Failed to delete project",
                            success: false,
                            result: null
                        });
                    });
                }else{
                    res.status(200).json({
                        message: "Failed to delete project",
                        success: false,
                        result: null
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to delete project",
                    success: false,
                    result: null
                });
            });
        }
    })
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
   router.post('/startStreamTokenized', (req, res, next) => {
    try {
        startRMQ(res);
        const id = req.body.id;
        const platform = req.body.platform;
        let token = req.headers['x-access-token'];
        if(!token){
            res.status(401).json({});
        }
        jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
            if(err){
                res.status(401).json({});
            }else{
                Project.find({_id : id})
                .exec()
                .then((result)=>{
                    if((result[0]["createdBy"]==tokenPlainText.id)&&(result[0]["deleted"]==false)){
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
                                        res.status(200).json({
                                            message: "Successfully ran project",
                                            success: true,
                                            result: responseString
                                        });
                                    });
                                });
                                listenerReq.write(postBodyString);
                                listenerReq.end();
                            }
                        )
                    }else{
                        res.status(200).json({
                            message: "Failed to run project",
                            success: false,
                            result: null
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to run project",
                        success: false,
                        result: null
                    });
                }) 
            }
        })  
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to run project",
            success: false,
            result: null
        });
    }
});

module.exports = router;
