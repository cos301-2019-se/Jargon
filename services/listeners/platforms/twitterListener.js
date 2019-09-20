/**
 * Filename: twitterListener.js
 * Author: Kevin Coetzee
 * 
 *      This file contains the class used to instantiate listeners that
 *      track tweets based on certain projects' whitelisted and blacklisted
 *      words.
 */
"use strict";

var http = require("http");
const Project = require('../models/project');

class TwitterListener{
    /*** 
     * conctructor(string array, string array, integer)
     * 
     *      The constructor takes a string array corresponding to a 
     *      project's whitelisted words, a string array corresponding 
     *      to a project's blacklisted words, and the duration in seconds
     *      corresponding to a project's runtime.
     * */  
    constructor(whitelist_, blacklist_, trackingDuration_){
        this.whitelist = "";
        this.blacklist = "";
        this.blacklistArray = blacklist_;
        this.whitelistArray = whitelist_;
        this.trackingDuration = trackingDuration_;
        for(var x = 0; x < whitelist_.length; x++){
            if(x==0){
                this.whitelist = whitelist_[x];
            }else{
                this.whitelist += "," + whitelist_[x];
            }
        }
        for(var x = 0; x < blacklist_.length; x++){
            if(x==0){
                this.blacklist = blacklist_[x];
            }else{
                this.blacklist += "," + blacklist_[x];
            }
        }
    }

    /***
    * get blacklist() : string
    * 
    * getter for the concatenated string blacklist 
    */
    get blacklist(){
        return this._blacklist;
    }

    /***
    * get whitelist() : string
    * 
    * getter for the concatenated string whitelist 
    */
    get whitelist(){
        return this._whitelist;
    }

    /***
    * get trackingDuration() : integer
    * 
    * getter for the tracking duration
    */
    get trackingDuration(){
        return this._trackingDuration;
    }

    /***
    * set blacklist() : void
    * 
    * setter for the blacklist concatenated string
    */
    set blacklist(vals){
        this._blacklist = vals;
    }

    /***
    * set whitelist() : void
    * 
    * setter for the whitelist concatenated string
    */
    set whitelist(vals){
        this._whitelist = vals;
    }

    /***
    * set trackingDuration() : void
    * 
    * setter for the tracking duration
    */
    set trackingDuration(val){
        this._trackingDuration = val;
    }

    /***
     * startTracking(null object, string, function) : void
     * 
     *      The startTracking function takes a null response object and a projID 
     *      string which it sends as a parameter to the third parameter 
     *      (callback function). The function connects to the Twitter API and 
     *      starts collecting tweets that contain whitelisted words and does not
     *      contain blacklisted words. After it has run for the required duration,
     *      it calls the callback function.
     */
    startTracking(response, projectID, callback){
        const twitterConsumerSecret = require('./twitterConfig').consumer_secret;
        const twitterTokenSecret = require('./twitterConfig').token_secret;
        const Twitter = require("node-tweet-stream")
        , twitterAPI = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: twitterConsumerSecret,
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: twitterTokenSecret
        })
        let tempArray = [];
        twitterAPI.on('tweet', function(tweet){
            let found = false;
            this.blacklistArray.forEach(element=>{
                if(tweet.text.indexOf(element)>-1){
                    found = true;
                }
            })
            if(!found){
                tempArray.push(tweet);
            }
        }.bind(this))
        twitterAPI.track(this.whitelist); 
        setTimeout(()=>{
            twitterAPI.untrack(this.whitelist);
            if(typeof callback == 'function'){
                callback(response, projectID, tempArray);
            }else{
                console.log(typeof callback);
            }
        }, this.trackingDuration);
    }

    /***
     * startStreamTracking(null object, string, function, function) : void
     * 
     *      The startStreamTracking function takes a null response object and a projID 
     *      string which it sends as a parameter to the third parameter 
     *      (callback function). The function connects to the Twitter API and 
     *      starts collecting tweets that contain whitelisted words and does not
     *      contain blacklisted words. It sends these tweets in real time as they 
     *      are collected, to the nueral network for processing
     */
    startStreamTracking(response, projectID, callback, streamStart, streamSend){
        // streamStart("one message");
        const twitterConsumerSecret = require('./twitterConfig').consumer_secret;
        const twitterTokenSecret = require('./twitterConfig').token_secret;
        const Twitter = require("node-tweet-stream")
        , twitterAPI = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: twitterConsumerSecret,
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: twitterTokenSecret
        })
        twitterAPI.on('tweet', function(tweet){
            let found = false;
            this.blacklistArray.forEach(element=>{
                if(tweet.text.indexOf(element)>-1){
                    found = true;
                }
            })
            if(!found){
                //TODO clean tweet
                let tweetArray = [];
                tweetArray[0] = tweet;
                let postBody = {
                    'rawData' : tweetArray
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
                let sendString = " ";
                // let sendString = " T";
                var listenerRequest = http.request(options, (listenerResponse)=>{
                    responseString = "";
                    listenerResponse.on("data", (data) => {
                        responseString += data;
                    });
                    listenerResponse.on("end", () => {
                        //TODO save tweet to DB
                        responseString = JSON.parse(responseString);
                        sendString += responseString[0]["id_str"];
                        let tweetStructure = {
                            "tweetID" : responseString[0]["id_str"],
                            "tweetObject" : responseString[0],
                            "tweetSentiment" : -2
                        }
                        Project.find({_id : projectID})
                        .exec()
                        .then((result)=>{
                            if(result[0].data==null){
                                result[0].data = [];
                            }
                            result[0].data.push(tweetStructure);
                            sendString = result[0]["_id"] + sendString;
                            console.log("saving tweet");
                            result[0].save().then(() =>{ 
                                streamStart(sendString);
                            });
                        }).catch((err) => {
                            console.log(err);
                        })
                    });
                });
                listenerRequest.write(postBodyString);
                listenerRequest.end();
            }
        }.bind(this))
        twitterAPI.track(this.whitelist); 
        setTimeout(()=>{
            twitterAPI.untrack(this.whitelist);
            if(typeof callback == 'function'){
                streamStart(projectID + " /t");
                callback(response, projectID, true);
            }else{
                console.log(typeof callback);
            }
        }, this.trackingDuration);
    }

    /*** 
     * hardStopTweets() : void
     * 
     *      This function immediately stops tracking tweets using the Twitter API.
    */
    hardStopTweets(){
        const twitterConsumerSecret = require('./twitterConfig').consumer_secret;
        const twitterTokenSecret = require('./twitterConfig').token_secret;
        const Twitter = require("node-tweet-stream")
        , twitterAPI = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: twitterConsumerSecret,
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: twitterTokenSecret
        })
        this.whitelistArray.forEach(element => {
            twitterAPI.untrack(element); 
        }); 
    }
}

module.exports = TwitterListener;