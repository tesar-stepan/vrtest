/*
 * Test assignment for VRIFY.
 * Assumptions I made about the task:
 * - I am building a minimal get/post/put/delete proof of concept simple rest api access to the database.
 *  Actual production application would require code refactoring, authentication - at least for post/put/delete,
 *  and possibly more queries dependent on application context, e.g pagination.
 * - The tables are stored in a local mysql database.
 * - Customers.ID is the primary key for Customers, Customer_Addresses.ID is the primary key for Customer_Addresses, and
 * Customer_Addresses.CUSTOMER_ID has a foreign constraint to Customers.ID.
 * - Database name is 'vrify', and there is a user called 'vrifytest', password 'vrpass', that has all privileges granted on this database.
 * - Database user password is using mysql_native_password (create user 'vrifytest'@'localhost' identified with mysql_native_password by 'vrpass';) source: https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server#50131831

 * Prerequisites:
 *  - mysql 8
 *  - node 10
 *  + stuff in package.json
 * Bootstrapped with express-generator (https://www.npmjs.com/package/express-generator) using JetBrains WebStorm.
 * Testing with mocha:
 * > npm test
 *
 *
 * This is the first time I am using node.js to develop a backend application and
 * I went for a 'fast and good enough for the moment' approach - apologies for any brutal
 * violations of industry standards or good practices.
 *
 * Hindsight after finishing the assignment:
 * - should have used mongodb and mongoose
 * - should have been doing this on a unix OS
 * - I really like node.js
 *
 * Stepan Tesar.
 */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var mysql = require("mysql");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// setup database connection
global.connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vrifytest',
  password : 'vrpass',
  database : 'vrify'
});
// Connect to mysql
connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

// Helper functions to construct success and error responses
const succ = function(res, results){
  return res.json({
    status: 200,
    error: null,
    response: results
  });
};
const err = function(res, status, msg){
  return res.status(status).json({
    status: status,
    error: {
      status: status,
      message: msg
    },
  });
};

// Setup routes
app.use('/api/v1/', require('./routes/index'));
app.use('/api/v1/customers', require('./routes/customers')(global.connection, succ, err));
app.use('/api/v1/customer_addresses', require('./routes/customer_addresses')(global.connection, succ, err));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = {
    status: 404,
    message: "Resource not found"
  };
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status,
    error: err
  });
});

module.exports = app;
