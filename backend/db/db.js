const mongoose = require('mongoose');



const dbURL = require('./dbconfig').url;

module.exports = function() {
    mongoose.connect(dbURL, { useNewUrlParser: true});

    mongoose.connection.on('connected', function(){
        console.log(`Mongoose default connection is open`);
    });

    mongoose.connection.on('error', function(err){
        console.log(`Mongoose default connection has occured ${err} error`);
    });

    mongoose.connection.on('disconnected', function(){
        console.log(("Mongoose default connection is disconnected"));
    });

    process.on('SIGTERM', function(){
        mongoose.connection.close(function(){
            console.log(("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log(("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });
}