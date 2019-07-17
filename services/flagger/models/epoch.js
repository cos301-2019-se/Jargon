const mongoose = require('mongoose');

const epochSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    size : Number,
    timestamp : Date,
    capacity : Number,
    tweets: [
        {
            text: String,
            currentScore : Number,
            alternateScore : Number
        }
    ]
});

module.exports = mongoose.model('Epoch', epochSchema);