const express = require('express');
const router = express.Router();
const twitterCleaner = require('../platforms/twitterCleaner');


router.post('/', (req, res, next) =>{
    
    let rawTweets = req.body.rawData;
    tc = new twitterCleaner();
    console.log("starting clean");
    tc.clean(rawTweets, returnCleanedData, res);
});

function returnCleanedData(retArray, res){
    console.log("finished cleaning");
    res.status(200).json(retArray);
}

module.exports = router;