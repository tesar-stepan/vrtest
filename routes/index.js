var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const response = {
    message: "Welcome to vrify test rest api",
    version: "1.0"
  };
  res.json({"status": 200, "error": null, "response": response});
});

module.exports = router;
