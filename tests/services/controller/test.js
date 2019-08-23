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

// describe('/projects/create', () => {
//     const path = '/projects/create';

//     describe('Creating a project with new project data', () => {
//         it('Passed POST, valid 200 status', () => {
//             chai
//             .request(host)
//             .post(path)
//             .send({ 
//                 {
//                     "project_name" : "project8",
//                     "whitelist" : ["linux"],
//                     "blacklist" : [""],
//                     "source" : "Twitter",
//                     "startTime" : 0,
//                     "trackTime" : 5000
//                 }
//             })
//             .end((err, res) => {
//                 chai.expect(res.body).to.be.object();
//             });
//         });
//     });
// });

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

describe('/projects/detailedSearch', () => {
    const path = '/projects/detailedSearch';

    describe('Searching for a specific project by ID, with all detail returned', () => {
        it('Passed POST, valid 200 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                id : "5d5eb897ee0b3b4821186c59"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
            });
        });
    });
});

describe('/projects/detailedSearch', () => {
    const path = '/projects/detailedSearch';

    describe('Searching with invalid ID', () => {
        it('Passed POST, valid 500 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(500);
            });
        });
    });
});

describe('/projects/detailedSearch', () => {
    const path = '/projects/detailedSearch';

    describe('Searching for a specific project by ID, with all detail returned', () => {
        it('Passed POST, valid project structure returned', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                id : "5d5eb897ee0b3b4821186c59"
            })
            .end((err, res) => {
                chai.expect(res.body).to.be.object();
            });
        });
    });
});

describe('/projects/start', () => {
    const path = '/projects/start';

    describe('Starting a specific project with invalid data', () => {
        it('Failed POST, valid 500 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(500);
            });
        });
    });
});

describe('/projects/start', () => {
    const path = '/projects/start';

    describe('Starting a specific project with valid data, but an invalid project id', () => {
        it('Failed POST, valid 500 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                    "id" : "notAnID",
                    "platform" : "twitter"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(500);
            });
        });
    });
});

describe('/projects/start', () => {
    const path = '/projects/start';

    describe('Starting a specific project with a valid id', () => {
        it('Passed POST, valid 200 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                    "id" : "5d5f419245480a7261529251",
                    "platform" : "twitter"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
            });
        });
    });
});

describe('/projects/start', () => {
    const path = '/projects/start';

    describe('Starting a specific project with a valid id', () => {
        it('Passed POST, valid return structure', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                    "id" : "5d5f419245480a7261529251",
                    "platform" : "twitter"
            })
            .end((err, res) => {
                chai.expect(res.body).to.be.object();
            });
        });
    });
});

describe('/projects/startStream', () => {
    const path = '/projects/startStream';

    describe('Starting a specific project with invalid data', () => {
        it('Failed POST, valid 500 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(500);
            });
        });
    });
});

describe('/projects/startStream', () => {
    const path = '/projects/startStream';

    describe('Starting a specific project with valid data, but an invalid project id', () => {
        it('Failed POST, valid 500 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                    "id" : "notAnID",
                    "platform" : "twitter"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(500);
            });
        });
    });
});

describe('/projects/startStream', () => {
    const path = '/projects/startStream';

    describe('Starting a specific project with a valid id', () => {
        it('Passed POST, valid 200 status', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                    "id" : "5d5f419245480a7261529251",
                    "platform" : "twitter"
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
            });
        });
    });
});

describe('/projects/startStream', () => {
    const path = '/projects/startStream';

    describe('Starting a specific project with a valid id', () => {
        it('Passed POST, valid return structure', () => {
            chai
            .request(host)
            .post(path)
            .send({ 
                    "id" : "5d5f419245480a7261529251",
                    "platform" : "twitter"
            })
            .end((err, res) => {
                chai.expect(res.body).to.be.object();
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
            });
        });
    });
});