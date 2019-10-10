/**
 * Filename: twitterCleaner.js
 * Author: Kevin Coetzee
 * 
 *      This file contains the class used to instantiate cleaners that
 *      clean tracked tweets aggregated from a certain Twitter listener
 */
"use strict";

class TwitterCleaner{
    constructor(){   
    }

    /***
     * clean(array, function, string) : void
     * 
     *      The clean function iterates through the array of collected tweets, 
     *      removing certain parts of each tweet that complicates Nueral Network
     *      processing.
     */
    clean(tweetCollections, callback, response){
        try {
            let urlRegex = /(https?:\/\/[^\s]+)/g;
            // let urlRegex = /(https?:\/\/.*[\r\n]*);
            tweetCollections.forEach((tweet)=>{
                let tweetText = tweet["text"];
                if((tweetText.indexOf("RT")>-1)&&(tweetText.indexOf("RT")<4)){
                    tweetText = tweetText.slice(tweetText.indexOf(":")+2, tweetText.length);
                }
                let removeUrl = tweetText.replace(urlRegex, (url) =>{
                    return "";
                });
                console.log(removeUrl);
                tweet["text"] = tweetText;     
            })
            callback(tweetCollections, response);
        } catch (error) {
            callback(null, response);
        }  
        
    }
}

module.exports = TwitterCleaner;