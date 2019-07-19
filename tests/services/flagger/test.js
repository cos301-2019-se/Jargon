const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiArray = require('chai-arrays');


chai.use(chaiHttp);
chai.use(chaiArray);
chai.should();

const host = "localhost:3002";

describe('/flag/add pass', () => {
    const path = '/flag/add';

   
    it('Passed adding of flagged items', () => {
       return chai
        .request(host)
        .post(path)
        .send(
            {
                tweets :
                [
                    {
                        text : "test1",
                        currentScore : 20,
                        alternateScore : 30
                    }
                ]
            }
        )
        .then((res) => {
            chai.expect(res).to.have.status(200); 
        }, (err) => {
            chai.expect(err.response).to.have.status(500);
        });
    });
   
});

describe('/flag/train pass', () => {
    const path = '/flag/train';

   
    it('Passed training on flagged items', () => {
       return chai
        .request(host)
        .post(path)
        .send()
        .then((res) => {
            chai.expect(res).to.have.status(200); 
        }, (err) => {
            chai.expect(err.response).to.have.status(500);
        });
    });
   
});