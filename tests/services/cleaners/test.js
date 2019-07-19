const chai = require('../node_modules/chai');
const chaiHttp = require('../node_modules/chai-http');
const chaiArray = require('../node_modules/chai-arrays');

chai.use(chaiHttp);
chai.use(chaiArray);
chai.should();


const host = "localhost:3003";

describe('/twitter POST success', () => {
    const path = '/twitter';

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
   
});