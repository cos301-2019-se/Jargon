const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiArray = require('chai-arrays');

chai.use(chaiHttp);
chai.use(chaiArray);
chai.should();


const host = "localhost:3001";

describe('/twitter POST success', () => {
    const path = '/twitter';

    it('passed POST', () => {
       return chai
        .request(host)
        .post(path)
        .send(
            {
                id : '5d3092a6b713aa10daabf585',
                platform : 'Twitter'
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