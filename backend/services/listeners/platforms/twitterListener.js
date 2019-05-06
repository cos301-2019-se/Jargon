class twitterListener{
    constructor(keywords_, trackingDuration_){
        this.keywords = "";
        this.trackingDuration = trackingDuration_;
        for(var x = 0; x < keywords_.length; x++){
            if(x==0){
                this.keywords = keywords_[x];
            }else{
                this.keywords = "," + keywords_[x];
            }
        }
    }
    
    get keywords(){
        return this._keywords;
    }

    get trackingDuration(){
        return this._trackingDuration;
    }

    set keywords(vals){
        this._keywords = vals;
    }

    set trackingDuration(val){
        this._trackingDuration = val;
    }

    
    trackTweets(){
        const Twitter = require("node-tweet-stream")
        , t = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: '08KQEcV5oSROZR3EvQzMKeH9fxlqn05tK0bl4rpNuVtgDJUqLX',
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: 'IEqjQrY1FKpfSQ4p0XITpedbZEyHQZRK9UK9ZxtwfVWG9'
        })
        // let promises = [];
        let trackResults = [];
        message = "";
        // this.keywords.forEach(element => {
        //     promises.push(new Promise((resolve, reject)=>{
                let tempArray = [];
                t.on('tweet', function(tweet){
                    tempArray.push(tweet);
                })
        //         // setTimeout(()=>{
        //         //     message += "ja";
        //         //     resolve(message)
        //         // }, )
                
        //         t.track(element); 
        //         setTimeout(()=>{
        //             t.untrack(element);
        //             trackResults.push(tempArray);
        //             resolve(trackResults);
        //         }, 3);
        //     }))  
        // }); 
        promises.push(new Promise((resolve, reject) => {
            t.track("Trump,javascript"); 
            setTimeout(()=>{
                t.untrack(element);
                trackResults.push(tempArray);
                resolve(trackResults);
            }, 5000);
        })) 
        Promise.all(promises).then((results)=>{
            //TODO: save to mongoDB

            return results;
        });
    }

    startTracking(res, projID, callback){
        const Twitter = require("node-tweet-stream")
        , t = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: '08KQEcV5oSROZR3EvQzMKeH9fxlqn05tK0bl4rpNuVtgDJUqLX',
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: 'IEqjQrY1FKpfSQ4p0XITpedbZEyHQZRK9UK9ZxtwfVWG9'
        })
        let tempArray = [];
        t.on('tweet', function(tweet){
            tempArray.push(tweet);
        })
        t.track(this.keywords); 
        setTimeout(()=>{
            t.untrack(this.keywords);
            if(typeof callback == 'function'){
                callback(res, projID, tempArray);
            }else{
                console.log(typeof callback);
            }
        }, this.trackingDuration);
    }

    hardStopTweets(){
        const Twitter = require("node-tweet-stream")
        , t = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: '08KQEcV5oSROZR3EvQzMKeH9fxlqn05tK0bl4rpNuVtgDJUqLX',
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: 'IEqjQrY1FKpfSQ4p0XITpedbZEyHQZRK9UK9ZxtwfVWG9'
        })
        this.keywords.forEach(element => {
            t.untrack(element); 
        }); 
    }
}

module.exports = twitterListener;