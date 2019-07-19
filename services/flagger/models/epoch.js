const mongoose = require('mongoose');

const epochSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    size : Number,
    timestamp : 
    {
        type : Date,
        default : Date.now
    },
    capacity : Number,
    tweets: [
        {
            text: String,
            currentScore : Number,
            alternateScore : Number
        }
    ],
    trained : Boolean
});

module.exports = mongoose.model('Epoch', epochSchema);