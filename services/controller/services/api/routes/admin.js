/**
 * Filename: admin.js
 * Author: Kevin Coetzee
 * 
 *      This file contains all the endpoints for the API that handles
 *      admin management of the system
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Project = require('../models/project');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../jwtSecret');
const bcrypt = require('bcrypt-nodejs');

/***
* request for createAdminUser (/) route (string name, surname, 
* email, username, password)
* 
* this function receives a collection of data associated with a certain 
* unregistered user and adds this user, along with his/her data to the 
* database, as an admin user 
*/
router.post('/createAdminUser', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin == true){
                let saltToSave = bcrypt.genSaltSync();
                let passwordToSave = bcrypt.hashSync(req.body.password, saltToSave);
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    username: req.body.username,
                    password: passwordToSave,
                    admin: true,
                    projects: null,
                    deleted: false
                });
                user
                .save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: "Handled post request to /createAdminUser",
                        success: true,
                        createdProduct: result
                    });
                })
                .catch(err =>{
                    console.log(err),
                    res.status(200).json({
                        message: "Could not register",
                        success: false,
                        createdProduct: null
                    })
                })
            }else{
                res.status(200).json({
                    authenticated: false,
                    message: "This is an admin function."
                });
            }
        }
    })
});

/***
    * request for deleteUser (/) route (string id)
    * 
    * this function receives a user ID and determines
    * whether they match a user in the database, after which it is soft-deleted
    */
router.post('/deleteUser', (req, res, next) => {
    const id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin == true){
                let updateValues = [
                    {
                        "propName" : "deleted",
                        "value" : true
                    }
                ]
                let updateVals = {};
                for (const vals of updateValues){
                    updateVals[vals.propName] = vals.value;
                }
                User.update({ _id: id }, { $set: updateVals })
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
            }else{
                res.status(200).json({
                    authenticated: false,
                    message: "This is an admin function."
                });
            }
        }
    })
});

/***
* request for basic (/basicAllProjects) projects route
* 
* this function returns a an array of simplified, less detailed projects
*/
router.post('/basicAllProjects', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin == true){
                Project.find()
                .exec()
                .then(results => {
                    const retProjects = [];
                    let simplify = results.forEach((proj)=>{
                        let tempProj = {};
                        tempProj["_id"] = proj["_id"];
                        tempProj["project_name"] = proj["project_name"];
                        tempProj["whitelist"] = proj["whitelist"];
                        tempProj["blacklist"] = proj["blacklist"];
                        tempProj["source"] = proj["source"];
                        tempProj["trackTime"] = proj["trackTime"];
                        tempProj["created"] = proj["created"];
                        tempProj["createdBy"] = proj["createdBy"];
                        retProjects.push(tempProj);
                    });
                    console.log(retProjects);
                    res.status(200).json(retProjects);           
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }else{
                res.status(200).json({
                    authenticated: false,
                    message: "This is an admin function."
                });
            }
        }
    })
});

/***
    * request for detailed (/detailedAllProjects) projects page
    * 
    * this function returns detailed data on all projects
    */
router.post('/detailedAllProjects', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin == true){
                Project.find()
                .exec()
                .then(results => {
                    const retProjects = [];
                    results.forEach((project)=>{
                        retProjects.push(project);
                    });
                    res.status(200).json(retProjects);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }else{
                res.status(200).json({
                    authenticated: false,
                    message: "This is an admin function."
                });
            }
        }
    })
});

/***
    * request for detailedSearch (/detailedSearch) projects page (string id)
    * 
    * this function searches for a certain project by its id, and returns all
    * detailed information about the project based upon that id
    */
router.post('/detailedSearch', (req, res, next) => {
    const id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin == true){
                Project.findById(id)
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
            }else{
                res.status(200).json({
                    authenticated: false,
                    message: "This is an admin function."
                });
            }
        }
    })
});

module.exports = router;