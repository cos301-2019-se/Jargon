class twitterListener{
    constructor(keyword_, trackingDuration_){
        this.keyword = keyword_;
        this.trackingDuration = trackingDuration_;
    }

    trackTweets(){
        const Twitter = require("node-tweet-stream")
        , t = new Twitter({
            consumer_key: 'DnXz3QBEptjCkSCXoKmj690GQ',
            consumer_secret: '08KQEcV5oSROZR3EvQzMKeH9fxlqn05tK0bl4rpNuVtgDJUqLX',
            token: '1122433281465700352-bPVkrTzBiwMyenSqHfePpi2QNU4t3e',
            token_secret: 'IEqjQrY1FKpfSQ4p0XITpedbZEyHQZRK9UK9ZxtwfVWG9'
        })
    
        t.on('tweet', function(tweet){
            console.log('tweet received', tweet);
        })
    
        t.track(this.keyword); 
        setTimeout(t.untrack(this.keyword), this.trackingDuration);   
    }
}

module.exports = twitterListener;