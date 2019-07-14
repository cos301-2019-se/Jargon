const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiArray = require('chai-arrays');

chai.use(chaiHttp);
chai.use(chaiArray);
chai.should();


const host = "localhost:3000";

describe('/projects', () => {
    const path = '/projects';

    describe('POST error', () => {
        it('Failed POST', () => {
            chai
            .request(host)
            .post(path)
            .send()
            .end((err, res) => {
                res.body.should.have.property('error'); 
            });
        });
    });
});

describe('/projects', () => {
    const path = '/projects';

    describe('GET project list', () => {
        it('GET request success', () => {
            chai
            .request(host)
            .get(path)
            .send({})
            .end((err, res) => {
                chai.expect(res.body).to.be.array();
            });
        });
    });
});

describe('/projects/search', () => {
    const path = '/projects/search';

    describe('Searching project', () => {
        it('Search by user passed', () => {
            chai
            .request(host)
            .get(path)
            .send({
                searchType : "user",
                input: "test"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
            });
        });
    });
});

describe('/projects/search', () => {
    const path = '/projects/search';

    describe('Searching project', () => {
        it('Search by user failed', () => {
            chai
            .request(host)
            .get(path)
            .send({
                input: "test"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(500);
            });
        });
    });
});

describe('/projects/delete', () => {
    const path = '/projects/delete';

    describe('Deleting project', () => {
        it('Delete failed', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                id : "lol"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(500);
            });
        });
    });
});

describe('/login', () => {
    const path = '/login';

    describe('Login test', () => {
        it('User not authenticated', () => {
            chai
            .request(host)
            .post(path)
            .send({
                email: "kevincoetzee@hotmail.com",
                password: "lol123"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.eql({
                    authenticated: false
                });
            });
        });
    });
});

describe('/login', () => {
    const path = '/login';

    describe('Login test', () => {
        it('User authenticated', () => {
            chai
            .request(host)
            .post(path)
            .send({
                email: "kevincoetzee@hotmail.com",
                password: "password"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.eql({
                    authenticated: true
                });
            });
        });
    });
});