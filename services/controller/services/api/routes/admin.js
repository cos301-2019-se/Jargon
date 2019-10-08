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
                .then(_result => {
                    console.log(_result);
                    res.status(200).json({
                        message: "Successfully created admin user",
                        success: true,
                        result: null
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to create admin user",
                        success: false,
                        result: null
                    });
                })
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
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
                    res.status(200).json({
                        success: true,
                        message: "Successfully deleted user",
                        result: null
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to delete user",
                        success: false,
                        result: null
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
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
                Project.find({"deleted" : false}, "_id project_name whitelist blacklist source trackTime created createdBy deleted status")
                .exec()
                .then(results => {
                    const allProj = results;
                    const retProjects = [];
                    let count = 0;
                    let simplify = results.forEach((proj)=>{
                        Project.aggregate([{$match: {_id: mongoose.Types.ObjectId(proj["_id"])}}, {$project: {data: {$size: '$data'}}}])
                        .exec()
                        .then(result_ => {
                            let tempProj = {};
                            tempProj["_id"] = proj["_id"];
                            tempProj["project_name"] = proj["project_name"];
                            tempProj["whitelist"] = proj["whitelist"];
                            tempProj["blacklist"] = proj["blacklist"];
                            tempProj["source"] = proj["source"];
                            tempProj["trackTime"] = proj["trackTime"];
                            tempProj["created"] = proj["created"];
                            tempProj["createdBy"] = proj["createdBy"];
                            tempProj["size"] = result_[0]['data'];
                            retProjects.push(tempProj);
                            count++;
                            if(count==allProj.length){
                                console.log(retProjects);
                                res.status(200).json({
                                    success: true,
                                    message: "Successfully retrieved projects",
                                    result: retProjects
                                });
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                message: "Failed to retrieve projects",
                                success: false,
                                result: null
                            });
                        });
                    });           
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to retrieve projects",
                        success: false,
                        result: null
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
                });
            }
        }
    })
});

/***
* request for tweets (/tweets) page (string id)
* 
* this function searches for a certain project by its id, and returns
* an array of tweets stored in that project based on the page and count specified
*/
router.post('/tweetsAdmin', (req, res, next) => {
    const projectID = req.body.id;
    const page = req.body.page;
    const count = req.body.count;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin==true){
                Project.aggregate([{$match: {_id: mongoose.Types.ObjectId(projectID)}}, {$project: {data: {$size: '$data'}}}])
                .exec()
                .then(result_ => {
                    let size = result_[0]['data'];
                    let firstIndex = (page-1)*count;
                    let lastIndex = (page*count)-1; 
                    if(firstIndex<size){
                        if(lastIndex<size){
                            Project.find({"_id" : projectID, "deleted" : false}, {data: {$slice: [firstIndex, (lastIndex-firstIndex+1)]}})
                            .exec()
                            .then((result_) => {
                                console.log(result_[0]["data"]);
                                res.status(200).json({
                                    message: "Successfully retrieved project",
                                    success: true,
                                    result: result_[0]["data"] 
                                });
                            })
                            .catch(() => {
                                console.log(err);
                                res.status(500).json({
                                    message: "Failed to retrieve tweets",
                                    success: false,
                                    result: null
                                });
                            });
                        }else{
                            Project.find({"_id" : projectID, "deleted" : false}, {data: {$slice: [firstIndex, (size-firstIndex+1)]}})
                            .exec()
                            .then(() => {
                                console.log(result_[0]["data"]);
                                res.status(200).json({
                                    message: "Successfully retrieved project",
                                    success: true,
                                    result: result_[0]["data"] 
                                });
                            })
                            .catch(() => {
                                console.log(err);
                                res.status(500).json({
                                    message: "Failed to retrieve tweets",
                                    success: false,
                                    result: null
                                });
                            });
                        }
                    }else{
                        res.status(200).json({
                            success: false,
                            message: "Invalid index given",
                            result: null
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to retrieve project",
                        success: false,
                        result: null
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
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
                    res.status(200).json({
                        success: true,
                        message: "Successfully retrieved projects",
                        result: retProjects
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to retrieve projects",
                        success: false,
                        result: null
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
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
                    res.status(200).json({
                        success: true,
                        message: "Successfully retrieved project",
                        result: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to retrieve project",
                        success: false,
                        result: null
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
                });
            }
        }
    })
});

/***
* request for edit User (/editUser) page (value array)
* 
* This function receives an array of values that need to updated for a 
* certain user. The user's specific values are then updated with the new values.
*/
router.post('/editUser', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            User.findById(tokenPlainText.id)
            .exec()
            .then(result => {
                console.log("authenticated successfully.")
                let updateVals = {};
                for (const vals of req.body.updateValues){
                    if(!((vals.propName=="admin")||(vals.propName=="deleted")||(vals.propName=="projects")||(vals.propName=="_id"))){
                        if(vals.propName=="password"){
                            let saltToSave = bcrypt.genSaltSync();
                            let passwordToSave = bcrypt.hashSync(vals.value, saltToSave);
                            updateVals[vals.propName] = passwordToSave;
                        }else{
                            updateVals[vals.propName] = vals.value;
                        }
                    }
                }
                User.updateOne({ _id: tokenPlainText.id }, { $set: updateVals })
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        success: true,
                        message: "Successfully edited user",
                        result: null
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to edit user",
                        success: false,
                        result: null
                    });
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to edit user",
                    success: false,
                    result: null
                });
            });
        }
    })
});

/***
* request for edit User as admin (/editUserAdmin) page (value array)
* 
* This function receives an array of values that need to updated for a 
* certain user. The user's specific values are then updated with the new values.
*/
router.post('/editUserAdmin', (req, res, next) => {
    let id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin==true){
                User.findById(id)
                .exec()
                .then(result => {
                    console.log("authenticated successfully.")
                    let updateVals = {};
                    for (const vals of req.body.updateValues){
                        if(!((vals.propName=="_id"))){
                            if((vals.propName=="password")&&(vals.propName!="")){
                                let saltToSave = bcrypt.genSaltSync();
                                let passwordToSave = bcrypt.hashSync(vals.value, saltToSave);
                                updateVals[vals.propName] = passwordToSave;
                            }else{
                                if((vals.propName=="name")||(vals.propName=="surname")||(vals.propName=="email")||(vals.propName=="username")||(vals.propName=="admin")||(vals.propName=="deleted")){
                                    updateVals[vals.propName] = vals.value;
                                }
                            }
                        }
                    }
                    User.updateOne({ _id: id }, { $set: updateVals })
                    .exec()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            success: true,
                            message: "Successfully edited user",
                            result: null
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Failed to edit user",
                            success: false,
                            result: null
                        });
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to edit user",
                        success: false,
                        result: null
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
                });
            }
        }
    })
});

/***
* request for getUser (/getUser) page
* 
* this function searches for a certain user by their token id, and returns
* basic information about the user based upon that id
*/
router.post('/getUser', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            User.findById(tokenPlainText.id)
            .exec()
            .then(_result => {
                console.log(_result);
                res.status(200).json({
                    message: "Successfully retrieved user",
                    success: true,
                    result: {
                    "name" : _result["name"],
                    "surname" : _result["surname"],
                    "email" : _result["email"],
                    "username" : _result["username"]
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to retrieve user",
                    success: false,
                    result: null
                });
            });
        }
    })
});

/***
* request for getUser (/getUser) page
* 
* this function searches for a certain user by their token id, and returns
* basic information about the user based upon that id
*/
router.post('/getUserAdmin', (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            if(tokenPlainText.admin==true){
                User.find()
                .exec()
                .then(results => {
                    let retUsers = [];
                    results.forEach((user)=>{
                        let tempUser = {};
                        tempUser["id"] = user["_id"];
                        tempUser["name"] = user["name"];
                        tempUser["surname"] = user["surname"];
                        tempUser["email"] = user["email"];
                        tempUser["username"] = user["username"];
                        tempUser["admin"] = user["admin"];
                        tempUser["deleted"] = user["deleted"];
                        retUsers.push(tempUser);
                    });
                    console.log(retUsers);
                    res.status(200).json({
                        message: "Successfully retrieved users",
                        success: true,
                        result: retUsers
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "Failed to retrieve users",
                        success: false,
                        result: null
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message: "User does not have sufficient privileges",
                    result: null
                });
            }
        }
    })
});

/***
    * request for edit (/edit) projects page (value array)
    * 
    * This function receives an array of values that need to updated for a 
    * certain project as well as the id of a certain project. The projects 
    * specific values are then updated with the new values.
    */
   router.post('/editProjectAdmin', (req, res, next) => {
    const id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            Project.findById(id)
            .exec()
            .then(result => {
                if(tokenPlainText.admin==true){
                    console.log("authenticated successfully.")
                    let updateVals = {};
                    for (const vals of req.body.updateValues){
                        updateVals[vals.propName] = vals.value;
                    }
                    Project.updateOne({ _id: id }, { $set: updateVals })
                    .exec()
                    .then(_result => {
                        console.log(_result);
                        res.status(200).json({
                            message: "Successfully edited project",
                            success: true,
                            result: null
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Failed to edit project",
                            success: false,
                            result: null
                        });
                    });
                }else{
                    res.status(200).json({
                        success: false,
                        message: "User does not have sufficient privileges",
                        result: null
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to edit project",
                    success: false,
                    result: null
                });
            });
        }
    })
});

/***
* request for delete (/delete) projects page ()
* 
* This function receives a specific project's id and
* deletes this project in the database
*/
router.post('/deleteProjectAdmin', (req, res, next) => {
    const id = req.body.id;
    let token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({});
    }
    jwt.verify(token, jwtConfig.secret, (err, tokenPlainText)=>{
        if(err){
            res.status(401).json({});
        }else{
            Project.findById(id)
            .exec()
            .then(result => {
                if(tokenPlainText.admin==true){
                    console.log("authenticated successfully.")
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
                    Project.update({ _id: id }, {$set: updateVals})
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Successfully deleted project",
                            success: true,
                            result: null
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Failed to delete project",
                            success: false,
                            result: null
                        });
                    });
                }else{
                    res.status(200).json({
                        success: false,
                        message: "User does not have sufficient privileges",
                        result: null
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Failed to delete project",
                    success: false,
                    result: null
                });
            });
        }
    })
});

module.exports = router;