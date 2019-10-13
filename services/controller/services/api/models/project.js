const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    project_name : String,
    whitelist: [
        {
            type : String
        }
    ],
    blacklist: [
        {
            type : String
        }
    ],
    source: String,
    startTime: Number,
    trackTime: Number,
    data: [
        {
            tweetID : String,
            tweetObject : Object,
            tweetSentiment : Number,
        }
    ],
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: String,
    status: Boolean,
    runs: [
        {
            type : Object
        }
    ],
    deleted: Boolean
});

module.exports = mongoose.model('Project', projectSchema);