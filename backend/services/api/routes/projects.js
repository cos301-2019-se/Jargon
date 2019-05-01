const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Project = require('../models/project');


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

router.post('/create', (req, res, next) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        project_name: req.body.name,
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
    const project = {
        project_name: req.body.name,
        project_results: req.body.result
    }
    res.status(200).json({
        message: "edit project",
        project: project
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: "Handled post request to /project",
       
    });
});


module.exports = router;