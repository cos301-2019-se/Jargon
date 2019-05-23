const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Project = require('../models/project');
const twitterListener = require('../platforms/twitterListener');

router.post('/', (req, res, next) => {
    const id = req.body.id;
    Project.find({ _id: id })
    .exec()
    .then(results => {
        if((results[0].source==='Twitter')||(results[0].source==='twitter')){
            tl = new twitterListener(results[0].whitelist, results[0].blacklist, results[0].trackTime);
            tl.startTracking(res, results[0].id, returnListenerData);
        }else{
            console.log("Platform does not match project's chosen platform.");
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

function returnListenerData(res, projID, tempArray){
    let updateVals = {};
    updateVals["data"] = tempArray;
    Project.find({_id : projID})
    .exec()
    .then((result)=>{
        result[0].data = tempArray;
        result[0].save().then(
            (result)=>{
                res.status(200).json(result.data);
            }
        )
    }).catch((err) => {
      console.log(typeof result[0].data);
    })
}

module.exports = router;