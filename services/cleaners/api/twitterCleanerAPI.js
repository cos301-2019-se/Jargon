const express = require('express');
const router = express.Router();
const twitterCleaner = require('../platforms/twitterCleaner');

router.post('/', (req, res, next) =>{
    let rawTweets = req.body.rawData;
    tc = new twitterCleaner();
    tc.clean(rawTweets, returnCleanedData);
});

function returnCleanedData(retArray){
    res.status(200).json(retArray);
}

module.exports = router;