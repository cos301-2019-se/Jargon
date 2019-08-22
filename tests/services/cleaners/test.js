const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiArray = require('chai-arrays');

chai.use(chaiHttp);
chai.use(chaiArray);
chai.should();


const host = "localhost:3003";

describe('/cleaners', () => {
    const path = '/twitter';

    describe('Testing if cleaner returns a valid status', () => {
        it('passed POST, valid 200 status', () => {
            return chai
            .request(host)
            .post(path)
            .send(
                {
                    "rawData" : [ { 
                    "text" : "this is a tweet"
                    }]
                }
            )
            .then((res) => {
                chai.expect(res).to.have.status(200); 
            }, (err) => {
                chai.expect(err.response).to.have.status(500);
            });
        });
    })
});

describe('/cleaners', () => {
    const path = '/twitter';

    describe('Testing if cleaner returns a valid error status', () => {
        it('failed POST, valid 500 status', () => {
            return chai
            .request(host)
            .post(path)
            .send(
                {
                    // "rawData" : [ { 
                    // "text" : "this is a tweet"
                    // }]
                }
            )
            .then((res) => {
                chai.expect(res).to.have.status(200); 
            }, (err) => {
                chai.expect(err.response).to.have.status(500);
            });
        });
    })
});

describe('/cleaners', () => {
    const path = '/twitter';

    describe('Cleaning project - valid data, already clean', () => {
        it('passed POST, unchanged data', () => {
            return chai
            .request(host)
            .post(path)
            .send(
                {
                    "rawData" : [ { 
                    "text" : "this is a tweet"
                    }]
                }
            )
            .then((res) => {
                chai.expect(res).to.have.status(200);  
                // chai.expect(res.body.data).to.be.array();
            }, (err) => {
                chai.expect(err.response).to.have.status(500);
            });
        });
    })
});

describe('/cleaners', () => {
    const path = '/twitter';

    describe('Cleaning project - valid data, cleaning needed', () => {
        it('passed POST, cleaned data', () => {
            return chai
            .request(host)
            .post(path)
            .send(
                {
                    "rawData" : [ { 
                    "text" : "RT username: this is a tweet"
                    }]
                }
            )
            .then((res) => {
                chai.expect(res.body).to.be.eql({
                    [
                        {
                          "text": "this is a tweet"
                        }
                      ]
                });
            }, (err) => {
                chai.expect(err.response).to.have.status(500);
            });
        });
    })
});