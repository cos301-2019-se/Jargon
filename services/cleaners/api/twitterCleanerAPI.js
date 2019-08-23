/**
 * Filename: twitterCleanerAPI.js
 * Author: Kevin Coetzee
 * 
 *      This file contains all the endpoints for the API that handles
 *      all cleaner requests for the Twitter platform
 */
const express = require('express');
const router = express.Router();
const twitterCleaner = require('../platforms/twitterCleaner');

/***
    * request for root (/) page (string array rawData)
    * 
    * this function receives a rawData string array, which it sends to a 
    * twitterCleaner instance, which ensures all tweets are cleaned according
    * to the rules implemented for the Twitter platform accordingly 
    */
router.post('/', (request, response, next) =>{
    try {
        let rawTweets = request.body.rawData;
        twitterCleanerInstance = new twitterCleaner();
        console.log("starting clean");
        twitterCleanerInstance.clean(rawTweets, returnCleanedData, response);   
    } catch (err) {
        response.status(500).json(err);
    }
});

/***
    * request for root (/) page (string array rawData)
    * 
    * this function receives a rawData string array, which it sends to a 
    * twitterCleaner instance, which ensures all tweets are cleaned according
    * to the rules implemented for the Twitter platform accordingly 
    */
function returnCleanedData(returnArray, response){
    if(returnArray==null){
        response.status(500);
    }else{

    }
    console.log("finished cleaning");
    response.status(200).json(returnArray);
}

module.exports = router;