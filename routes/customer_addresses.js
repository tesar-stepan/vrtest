var express = require('express');


function postAddr(connection,err,succ,addr,res){
  connection.query('UPDATE Customer_Addresses SET CUSTOMER_ID=?,STREET_ADDRESS=?,POSTAL_CODE=?,COUNTRY=? ' +
      'WHERE ID=? ',[addr.CUSTOMER_ID,addr.STREET_ADDRESS,addr.POSTAL_CODE,addr.COUTNRY,addr.ID], function (error, results, fields) {
    if (error) throw error;
    if(results.affectedRows === 0){
      err(res, 404, "Customer with ID "+id+" not found.");
    }else {
      succ(res, results);
    }
  })
}

module.exports = function (connection, succ, err) {
  const router = express.Router();

  // GET all addresses
  router.get('/', function (req, res, next) {
    connection.query('SELECT * from customer_addresses', function (error, results, fields) {
      if (error) throw error;
      succ(res, results);
    })
  });

  // GET address by ID
  router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query('SELECT * from customer_addresses WHERE ID=?',[id], function (error, results, fields) {
      if (error) throw error;
      if(results.length === 0){
        err(res, 404, "Address with ID "+id+" Not found");
      }else {
        succ(res, results);
      }
    })
  });

  // GET address customer
  router.get('/:id/customer', function (req, res, next) {
    const id = req.params.id;
    connection.query('SELECT c.* from customers c inner join customer_addresses a on c.ID = a.CUSTOMER_ID WHERE a.ID=?',[id], function (error, results, fields) {
      if (error) throw error;
      if(results.length === 0){
        err(res, 404, "Customer for address with ID "+id+" not found.");
      }else {
        succ(res, results);
      }
    })
  });

  router.put('/:id', function (req, res, next) {
    const id = req.params.id; // could also be optional and use auto increment by default
    const customer_id = req.query.customer_id; // 1:n
    const street = req.query.street_address;
    const postal = req.query.postal_code;
    const country = req.query.country;
    if(!customer_id){ // Assuming only customer_id is required
      err(res, 400, "Missing customer_id");
      return;
    }
    // Check customer exists
    connection.query('SELECT * from customers WHERE ID=?',[customer_id], function (error, results, fields) {
      if (error) throw error;
      if(results.length === 0) {
        err(res, 404, "Customer with ID " + customer_id + " not found");
      }else{
        // PUT overrides existing resources
        connection.query('DELETE FROM Customer_Addresses WHERE ID = ? ',[id], function (error, results, fields){
          // Create customer
          if (error) throw error;
          connection.query('INSERT INTO Customer_Addresses(ID,CUSTOMER_ID,STREET_ADDRESS,POSTAL_CODE,COUNTRY) VALUES(?,?,?,?,?)',[id,customer_id,street,postal,country], function (error, results, fields) {
            if (error) throw error;
            succ(res, results);
          })
        });
      }
    });
  });

  router.post('/:id', function (req, res, next) {
    const id = req.params.id;
    const customer_id = req.query.customer_id;
    const street = req.query.street_address;
    const postal = req.query.postal_code;
    const country = req.query.country;
    if(!customer_id && !street && !postal && !country){
      err(res, 400, "No values to update");
      return;
    }
    // Update address, only update provided values
    connection.query('SELECT * From Customer_Addresses WHERE ID=? ',[id], function (error, results, fields) {
      if (error) throw error;
      if(results.length === 0){
        err(res, 404, "Address with ID "+id+" not found.");
      }else {
        const addr = results[0];
        if(street) addr.STREET_ADDRESS = street;
        if(postal) addr.POSTAL_CODE = postal;
        if(country) addr.COUTNRY = country;
        if(customer_id){
          // Check customer exists.
          connection.query('SELECT * from customers WHERE ID=?',[customer_id], function (error, results, fields) {
            if (error) throw error;
            if(results.length === 0) {
              err(res, 404, "Customer with ID " + customer_id + " not found");
            }else{
              addr.CUSTOMER_ID = customer_id;
              postAddr(connection,err,succ,addr,res)
            }
          });
        }else{
          postAddr(connection,err,succ,addr,res)
        }
      }
    });
  });

  router.delete('/:id', function (req, res, next) {
    const id = req.params.id;
    // Delete customer and its addresses
    connection.query('DELETE FROM Customer_Addresses WHERE ID = ? ',[id], function (error, results, fields) {
      if (error) throw error;
      if(results.affectedRows === 0){
        err(res, 404, "Address with ID "+id+" not found.");
      }else {
        succ(res, results);
      }
    })
  });

  return router;
};