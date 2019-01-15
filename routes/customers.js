var express = require('express');

module.exports = function (connection, succ, err) {
    const router = express.Router();

    // GET all customers
    router.get('/', function (req, res, next) {
        connection.query('SELECT * from customers', function (error, results, fields) {
            if (error) throw error;
            succ(res, results);
        })
    });

    // GET customer
    router.get('/:id', function (req, res, next) {
        const id = req.params.id;
        connection.query('SELECT * from customers WHERE ID=?',[id], function (error, results, fields) {
            if (error) throw error;
            if(results.length === 0){
                err(res, 404, "Customer with ID "+id+" not found");
            }else {
                succ(res, results);
            }
        })
    });

    // GET customers addresses
    router.get('/:id/address', function (req, res, next) {
        const id = req.params.id;
        connection.query('SELECT a.* from customers c inner join customer_addresses a on c.ID = a.CUSTOMER_ID WHERE c.ID=?',[id], function (error, results, fields) {
            if (error) throw error;
            if(results.length === 0){
                err(res, 404, "Address for customer with ID "+id+" not found.");
            }else {
                succ(res, results);
            }
        })
    });

    router.put('/:id', function (req, res, next) {
        const id = req.params.id; // could also be optional and use auto increment by default
        const name = req.query.name;
        if(!name){
            err(res, 400, "Missing name");
            return;
        }
        // PUT overrides existing resources
        connection.query('DELETE FROM Customers WHERE ID = ? ',[id], function (error, results, fields) {
            if (error) throw error;
            // Create customer
            connection.query('INSERT INTO Customers(ID,NAME) VALUES(?,?)',[id,name], function (error, results, fields) {
                if (error) throw error;
                succ(res, results);
            })
        });

    });

    router.post('/:id', function (req, res, next) {
        const id = req.params.id;
        const name = req.query.name;
        if(!name){
            err(res, 400, "Missing NAME");
            return;
        }
        // Update customer
        connection.query('UPDATE Customers SET NAME=? WHERE ID=? ',[name,id], function (error, results, fields) {
            if (error) throw error;
            if(results.affectedRows === 0){
                err(res, 404, "Customer with ID "+id+" not found.");
            }else {
                succ(res, results);
            }
        })
    });

    router.delete('/:id', function (req, res, next) {
        const id = req.params.id;
        // Delete customer and its addresses
        connection.query('DELETE FROM Customer_Addresses where CUSTOMER_ID = ?', [id], function (error, results, fields) {
            connection.query('DELETE FROM Customers WHERE ID = ? ',[id], function (error, results, fields) {
                if (error) throw error;
                if(results.affectedRows === 0){
                    err(res, 404, "Customer with ID "+id+" not found.");
                }else {
                    succ(res, results);
                }
            })
        });
    });

    return router;
};