const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    surname : String,
    email : String,
    username : String,
    password : String,
    admin : Boolean,
    projects : [{type : mongoose.Schema.Types.ObjectId, ref : 'Project'}],
    deleted : Boolean
});

module.exports = mongoose.model('User', userSchema);