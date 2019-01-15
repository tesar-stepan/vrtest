var mysql = require("mysql");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
describe('Customer addresses', () => {
    // Prepare database before any testing
    before((done) => {
        // setup database connection
        global.connection = mysql.createConnection({
            host: 'localhost',
            user: 'vrifytest',
            password: 'vrpass',
            database: 'vrify'
        });
        // Connect to mysql
        connection.connect((err) => {
            if (err) {
                throw err;
            }
            console.log('Customers test connected to database');
            connection.query('DELETE FROM Customer_Addresses',[], function (){
                connection.query('DELETE FROM Customers',[], function (){
                    connection.query('INSERT INTO Customers(ID,NAME) VALUES(1,"Tester")',[], function (){
                        connection.query('INSERT INTO Customer_Addresses(ID,CUSTOMER_ID) VALUES(1,1)', [], function(){
                            console.log('Database prepared');
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('/GET addresses', () => {
        it('Should return all addresses', (done) => {
            chai.request(server)
                .get('/api/v1/customer_addresses')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET address', () => {
        it('Should return address with ID=1', (done) => {
            chai.request(server)
                .get('/api/v1/customer_addresses/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(1);
                    res.body.response[0].should.be.a('object');
                    res.body.response[0].ID.should.be.eql(1);
                    res.body.response[0].CUSTOMER_ID.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET address', () => {
        it('Should return 404', (done) => {
            chai.request(server)
                .get('/api/v1/customer_addresses/2')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/GET addresses', () => {
        it('Should return customer of address with ID=1', (done) => {
            chai.request(server)
                .get('/api/v1/customer_addresses/1/customer')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(1);
                    res.body.response[0].should.be.a('object');
                    res.body.response[0].ID.should.be.eql(1);
                    res.body.response[0].NAME.should.be.eql("Tester");
                    done();
                });
        });
    });

    describe('/GET addresses', () => {
        it('Should return 404', (done) => {
            chai.request(server)
                .get('/api/v1/customer_addresses/2/customer')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/PUT address', () => {
        it('Should return 200 and add a new address', (done) => {
            chai.request(server)
                .put('/api/v1/customer_addresses/2?customer_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customer_addresses')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(2);
                            chai.request(server)
                                .get('/api/v1/customer_addresses/2')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.response.should.be.a('array');
                                    res.body.response.length.should.be.eql(1);
                                    res.body.response[0].should.be.a('object');
                                    res.body.response[0].ID.should.be.eql(2);
                                    res.body.response[0].CUSTOMER_ID.should.be.eql(1);
                                    should.equal(res.body.response[0].STREET_ADDRESS, null);
                                    done();
                                });
                        });
                });
        });
    });

    describe('/PUT address', () => {
        it('Should return 200 and override existing address', (done) => {
            chai.request(server)
                .put('/api/v1/customer_addresses/2?customer_id=1&street_address=test addr')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customer_addresses/2')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(1);
                            res.body.response[0].should.be.a('object');
                            res.body.response[0].ID.should.be.eql(2);
                            res.body.response[0].CUSTOMER_ID.should.be.eql(1);
                            res.body.response[0].STREET_ADDRESS.should.be.eql("test addr");
                            done();
                        });
                });
        });
    });

    describe('/PUT address', () => {
        it('Should return 400', (done) => {
            chai.request(server)
                .put('/api/v1/customer_addresses/2')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/PUT address', () => {
        it('Should return 404', (done) => {
            chai.request(server)
                .put('/api/v1/customer_addresses/2?customer_id=3')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/POST address', () => {
        it('Should return 200 and override existing address', (done) => {
            chai.request(server)
                .post('/api/v1/customer_addresses/2?country=US')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customer_addresses/2')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(1);
                            res.body.response[0].should.be.a('object');
                            res.body.response[0].ID.should.be.eql(2);
                            res.body.response[0].COUNTRY.should.be.eql('US');
                            done();
                        });
                });
        });
    });

    describe('/POST address', () => {
        it('Should return 404', (done) => {
            chai.request(server)
                .post('/api/v1/customer_addresses/3?customer_id=1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/DELETE address', () => {
        it('Should return 200 and remove an address', (done) => {
            chai.request(server)
                .delete('/api/v1/customer_addresses/2')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customer_addresses')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(1);
                            chai.request(server)
                                .get('/api/v1/customer_addresses/2')
                                .end((err, res) => {
                                    res.should.have.status(404);
                                    done();
                                });
                        });
                });
        });
    });

});