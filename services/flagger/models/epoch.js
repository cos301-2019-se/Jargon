const mongoose = require('mongoose');

const epochSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    size : Number,
    timestamp : Date,
    capacity : Number,
    source: String,
    startTime: Number,
    trackTime: Number,
    tweets: [{type : mongoose.Schema.Types.ObjectId, ref : 'FlaggedItem'}]
});

module.exports = mongoose.model('Epoch', epochSchema);