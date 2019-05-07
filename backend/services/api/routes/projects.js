var http = require("http");
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Project = require('../models/project');
// const querystring = require('querystring');

router.get('/', (req, res, next) => {
    Project.find()
    .exec()
    .then(results => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/search', (req, res, next) => {
  const type = req.body.searchType;
  const input = req.body.input;
  if (type === 'title')
  {
    Project.find({
      project_name: new RegExp(input, "i")
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  }
  else if (type === 'user')
  {
    Project.find({
      createdBy: new RegExp(input, "i")
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  }
});

router.post('/create', (req, res, next) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        project_name: req.body.project_name,
        whitelist: req.body.whitelist,
        blacklist: req.body.blacklist,
        source: req.body.source,
        startTime: req.body.startTime,
        trackTime: req.body.trackTime,
        data: null,
        createdBy: "Test User"
    });

    project
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /projects/create",
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/edit', (req, res, next) => {
    const id = req.body.id;

    let updateVals = {};
    for (const vals of req.body.updateValues)
    {
        updateVals[vals.propName] = vals.value;
    }
    Project.update({ _id: id }, { $set: updateVals })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/delete', (req, res, next) => {
  const id = req.body.id;
  Project.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
  });
});

router.post('/start', (req, res, next) => {
    const id = req.body.id;
    const platform = req.body.platform;
    let postBody = {
        'id' : id,
        'platform' : platform
    }
    let postBodyString = JSON.stringify(postBody);
    if(platform === "twitter"){
        var options = {
            host: "localhost",
            port: 3001,
            path: "/twitter/",
            method: "POST",
            headers: {
                'Content-Length': Buffer.byteLength(postBodyString),
                "Content-Type": "application/json"
            }
        };
    }
    var listenerReq = http.request(options, (listenerRes)=>{
        var responseString = "";
        listenerRes.on("data", (data) => {
            responseString += data;
        });
        listenerRes.on("end", () => {
            responseString = JSON.parse(responseString);
            console.log(responseString);
            res.status(200).json(responseString);
        });
    });

    // const postBody = querystring.stringify({
    //     'id': id
    // });
    // listenerReq.write(JSON.stringify(postBody));
    listenerReq.write(postBodyString);
    listenerReq.end();
});

module.exports = router;