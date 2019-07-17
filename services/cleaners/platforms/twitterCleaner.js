"use strict";

class twitterCleaner{
    constructor(){
        
    }

    clean(tweetCollections, callback, res){
        
        tweetCollections.forEach((tweet)=>{
            let tweetText = tweet["text"];

            

            tweet["text"] = tweetText;
            
        })
        
        callback(tweetCollections, res);
    }
}

module.exports = twitterCleaner;