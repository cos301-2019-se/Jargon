const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiArray = require('chai-arrays');

chai.use(chaiHttp);
chai.use(chaiArray);
chai.should();


const host = "localhost:3003";

describe('/cleaners', () => {
    const path = '/twitter';

    describe('Cleaning project - valid data, already clean', () => {
        it('passed POST', () => {
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

    describe('Cleaning project - valid data, already clean', () => {
        it('passed POST', () => {
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
                chai.expect(res).to.have.status(200);  
                // chai.expect(res.body.data).to.be.array();
            }, (err) => {
                chai.expect(err.response).to.have.status(500);
            });
        });
    })
});