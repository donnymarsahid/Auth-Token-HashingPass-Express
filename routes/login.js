var express = require('express');
var router = express.Router();

// Get Database
const dbConnection = require('../lib/database');

// login
router.get('/', (req, res, next) => {
  res.render('admin/login');
});

module.exports = router;
