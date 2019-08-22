/**
 * Filename: twitterAPI.js
 * Author: Kevin Coetzee
 * 
 *      This file contains all the endpoints for the API that handles
 *      all listener requests for the Twitter platform
 */
var http = require("http");
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Project = require('../models/project');
const twitterListener = require('../platforms/twitterListener');


const amqp = require('amqplib/callback_api');
let streamChannel = null;
let streamConnection = null;
let streamQueue = null;
const send = (msg) => {
    amqp.connect("amqp://localhost", function(error0, connection) {
    if (error0)
    {
        throw error0;
    }

    streamConnection = connection;
    connection.createChannel(function(error1, channel) {
        if (error1)
            throw error1;

        let queue = "tweet_queue";
        streamQueue = queue;
        
        channel.assertQueue(queue, {
            durable: false
        });
        streamChannel = channel;
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log("[x] sent to %s", msg);
    });

    setTimeout(() => {
        connection.close();
    }, 500);
    });
};

// function sendMessage(message){ 
//     if(streamChannel != null){
//         console.log("sending: " + message);
//         streamChannel.sendToQueue(streamQueue, Buffer.from(message), {
//             persistent : true
//         });
//     }
// }

// function closeQueue(){
//     streamConnection.close();
// }



/***
    * request for root (/) page (string id)
    * 
    * this function receives an id string, which it uses to search
    * for a project in the database, and starts a twitterListener 
    * object with the keywords in that specific project 
    */
router.post('/', (req, res, next) => {
    const id = req.body.id;
    Project.find({ _id: id })
    .exec()
    .then(results => {
        if((results[0].source).toUpperCase()==='TWITTER'){
            twitterListenerInstance = new twitterListener(results[0].whitelist, results[0].blacklist, results[0].trackTime);     
            twitterListenerInstance.startTracking(res, results[0].id, returnListenerData);   
        }else{
            console.log("Platform does not match project's chosen platform.");
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

/***
    * request for stream (/stream) page (string id)
    * 
    * this function receives an id string, which it uses to search
    * for a project in the database, and starts a twitterListener 
    * object with the keywords in that specific project, in a manner
    * that allows it to stream tweets in realtime
    */
router.post('/stream', (req, res, next) => {
    const id = req.body.id;
    Project.find({ _id: id })
    .exec()
    .then(results => {
        if((results[0].source).toUpperCase()==='TWITTER'){
            twitterListenerInstance = new twitterListener(results[0].whitelist, results[0].blacklist, results[0].trackTime);
            // send("");     
            twitterListenerInstance.startStreamTracking(res, results[0].id, returnListenerDataStream, send);   
        }else{
            console.log("Platform does not match project's chosen platform.");
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

/***
    * returnListenerData(null, string, null) : json object
    * 
    *   a callback function sent to an instance of the twitterListener class
    *   that updates the specific project (based on the projectID) with all 
    *   the tweets found from running a listener with the relevant whitelisted
    *   words from this project
    */
function returnListenerData(response, projID, tempArray){ 
    let updateVals = {};
    updateVals["data"] = tempArray;
    let postBody = {
        'rawData' : tempArray
    }
    let postBodyString = JSON.stringify(postBody);
    var options = {
        host: "localhost",
        port: 3003,
        path: "/twitter/",
        method: "POST",
        headers: {
            'Content-Length': Buffer.byteLength(postBodyString),
            "Content-Type": "application/json"
        }
    };
    let responseString = "";
    var listenerRequest = http.request(options, (listenerResponse)=>{
        responseString = "";
        listenerResponse.on("data", (data) => {
            responseString += data;
        });
        listenerResponse.on("end", () => {
            Project.find({_id : projID})
            .exec()
            .then((result)=>{
                result[0].data = JSON.parse(responseString);
                result[0].save().then(
                    (result)=>{     
                        response.status(200).json(result.data);
                    }
                ).catch((err) =>{
                    console.log(err);
                    response.status(500).json({
                        error: err
                    });
                })
            }).catch((err) => {
                console.log(err);
                response.status(500).json({
                    error: err
                });
            })
        });
    });
    listenerRequest.write(postBodyString);
    listenerRequest.end();
}

/***
    * returnListenerData(null, string, null) : json object
    * 
    *   a callback function sent to an instance of the twitterListener class
    *   that updates the specific project (based on the projectID) with all 
    *   the tweets found from running a listener with the relevant whitelisted
    *   words from this project
    */
    function returnListenerDataStream(response, projID, requestSuccess){ 
        // closeQueue();
        response.status(200).json({success : requestSuccess});
    }   

module.exports = router;