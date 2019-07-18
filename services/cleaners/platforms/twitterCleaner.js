"use strict";

class twitterCleaner{
    constructor(){
        
    }

    clean(tweetCollections, callback, res){
        
        tweetCollections.forEach((tweet)=>{
            let tweetText = tweet["text"];

            if((tweetText.indexOf("RT")>-1)&&(tweetText.indexOf("RT")<4)){
                tweetText = tweetText.slice(tweetText.indexOf(":")+2, tweetText.length);
            }

            tweet["text"] = tweetText;     
        })
        callback(tweetCollections, res);
    }
}

module.exports = twitterCleaner;