var mysql = require("mysql");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
describe('Customers', () => {
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

    describe('/GET customers', () => {
        it('Should return all customers', (done) => {
            chai.request(server)
                .get('/api/v1/customers')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET customers', () => {
        it('Should return customer with ID=1', (done) => {
            chai.request(server)
                .get('/api/v1/customers/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(1);
                    res.body.response[0].should.be.a('object');
                    res.body.response[0].ID.should.be.eql(1);
                    res.body.response[0].NAME.should.be.eql('Tester');
                    done();
                });
        });
    });

    describe('/GET customers', () => {
        it('Should return 404', (done) => {
            chai.request(server)
                .get('/api/v1/customers/2')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/GET customers', () => {
        it('Should return address of customer with ID=1', (done) => {
            chai.request(server)
                .get('/api/v1/customers/1/address')
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

    describe('/GET customers', () => {
        it('Should return 404', (done) => {
            chai.request(server)
                .get('/api/v1/customers/2/address')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/PUT customers', () => {
        it('Should return 200 and add a new customer', (done) => {
            chai.request(server)
                .put('/api/v1/customers/2?name=Tester2')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customers')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(2);
                            chai.request(server)
                                .get('/api/v1/customers/2')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.response.should.be.a('array');
                                    res.body.response.length.should.be.eql(1);
                                    res.body.response[0].should.be.a('object');
                                    res.body.response[0].ID.should.be.eql(2);
                                    res.body.response[0].NAME.should.be.eql('Tester2');
                                    done();
                                });
                        });
                });
        });
    });

    describe('/PUT customers', () => {
        it('Should return 200 and override existing customer', (done) => {
            chai.request(server)
                .put('/api/v1/customers/2?name=Tester3')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customers/2')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(1);
                            res.body.response[0].should.be.a('object');
                            res.body.response[0].ID.should.be.eql(2);
                            res.body.response[0].NAME.should.be.eql('Tester3');
                            done();
                        });
                });
        });
    });

    describe('/POST customers', () => {
        it('Should return 200 and override existing customer', (done) => {
            chai.request(server)
                .post('/api/v1/customers/2?name=Tester4')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customers/2')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(1);
                            res.body.response[0].should.be.a('object');
                            res.body.response[0].ID.should.be.eql(2);
                            res.body.response[0].NAME.should.be.eql('Tester4');
                            done();
                        });
                });
        });
    });

    describe('/POST customers', () => {
        it('Should return 404', (done) => {
            chai.request(server)
                .post('/api/v1/customers/3?name=Tester5')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/DELETE customers', () => {
        it('Should return 200 and remove a customer', (done) => {
            chai.request(server)
                .delete('/api/v1/customers/2')
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .get('/api/v1/customers')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('array');
                            res.body.response.length.should.be.eql(1);
                            chai.request(server)
                                .get('/api/v1/customers/2')
                                .end((err, res) => {
                                    res.should.have.status(404);
                                    done();
                                });
                        });
                });
        });
    });

});