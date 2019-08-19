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
router.post('/', (req, res, next) =>{
    let rawTweets = req.body.rawData;
    tc = new twitterCleaner();
    console.log("starting clean");
    tc.clean(rawTweets, returnCleanedData, res);
});

/***
    * request for root (/) page (string array rawData)
    * 
    * this function receives a rawData string array, which it sends to a 
    * twitterCleaner instance, which ensures all tweets are cleaned according
    * to the rules implemented for the Twitter platform accordingly 
    */
function returnCleanedData(retArray, res){
    console.log("finished cleaning");
    res.status(200).json(retArray);
}

module.exports = router;