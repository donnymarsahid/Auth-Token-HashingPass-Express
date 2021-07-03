var express = require('express');
const flash = require('express-flash');
const app = require('../app');
var router = express.Router();

// Get Database
const dbConnection = require('../lib/database');

// login
router.get('/', (req, res, next) => {
  res.render('admin/login');
});
router.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  dbConnection.query('SELECT * FROM admin where username = ? and password = ?', [username, password], function (err, results, fields) {
    if (results.length > 0) {
      res.redirect('/products');
    } else {
      req.flash('login', 'username / password is wrong!');
      res.redirect('/login');
    }
  });
});

module.exports = router;
