const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "list of projects"
    });
});

router.post('/create', (req, res, next) => {
    const project = {
        project_name: req.body.name,
        project_results: req.body.result
    }
    res.status(200).json({
        message: "create project",
        project: project
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