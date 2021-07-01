var express = require('express');
const flash = require('express-flash');
var router = express.Router();

// Get Database
const dbConnection = require('../lib/database');

// Get Products
router.get('/', function (req, res, next) {
  dbConnection.query('SELECT * FROM products ORDER BY id_products desc', function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('customer', { data: '' });
    } else {
      res.render('customer', { data: rows });
    }
  });
});

// Buy
router.get('/buy/:buyId', function (req, res, next) {
  let buyId = req.params.buyId;
  let sql = `SELECT * FROM products where id_products = ${buyId}`;
  dbConnection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('customer/buy', {
      user: result[0],
    });
  });
});

//post buy
router.post('/save', function (req, res, next) {
  let formData = { name: req.body.name, no_telp: req.body.no_telp, address: req.body.address, buy: req.body.buy, date: req.body.date };

  // insert query
  dbConnection.query('INSERT INTO customer SET ?', formData, function (err, result) {
    if (err) throw err;
    if (err) {
      req.flash('error', err);

      // render to add.ejs
      res.render('customer/buy');
    } else {
      req.flash('successadd', 'successfully buy product !');
      res.redirect('/');
    }
  });
});

module.exports = router;
