"use strict";

class twitterListener{
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
   
    get blacklistArray(){
        return this._blacklistArray;
    }

    get blacklist(){
        return this._blacklist;
    }

    get whitelist(){
        return this._whitelist;
    }

    get trackingDuration(){
        return this._trackingDuration;
    }

    set blacklistArray(vals){
        this._blacklistArray = vals;
    }

    set blacklist(vals){
        this._blacklist = vals;
    }

    set whitelist(vals){
        this._whitelist = vals;
    }

    set trackingDuration(val){
        this._trackingDuration = val;
    }

    startTracking(res, projID, callback){
        const twitterConsumerSecret = require('./twitterConfig').consumer_secret;
        const twitterTokenSecret = require('./twitterConfig').token_secret;
        const Twitter = require("node-tweet-stream")
        , t = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: twitterConsumerSecret,
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: twitterTokenSecret
        })
        let tempArray = [];
        t.on('tweet', function(tweet){
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
        t.track(this.whitelist); 
        setTimeout(()=>{
            t.untrack(this.whitelist);
            if(typeof callback == 'function'){
                callback(res, projID, tempArray);
            }else{
                console.log(typeof callback);
            }
        }, this.trackingDuration);
    }

    hardStopTweets(){
        const twitterConsumerSecret = require('./twitterConfig').consumer_secret;
        const twitterTokenSecret = require('./twitterConfig').token_secret;
        const Twitter = require("node-tweet-stream")
        , t = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: twitterConsumerSecret,
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: twitterTokenSecret
        })
        this.whitelistArray.forEach(element => {
            t.untrack(element); 
        }); 
    }
}

module.exports = twitterListener;