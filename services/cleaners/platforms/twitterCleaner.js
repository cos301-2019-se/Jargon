"use strict";

class twitterCleaner{
    constructor(){
        
    }

    clean(tweetCollection, callback){
        tweetCollection.forEach((tweet)=>{
            let tweetText = tweet["text"];

            

            tweet["text"] = tweetText;
        })
    }
}

module.exports = twitterCleaner;