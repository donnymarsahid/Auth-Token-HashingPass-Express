var express = require('express');
var router = express.Router();

// Get Database
const dbConnection = require('../lib/database');

// Search Products
router.post('/', (req, res, next) => {
  let search = req.body.search;
  dbConnection.query('SELECT * FROM products WHERE name LIKE ?', ['%' + search + '%'], (err, rows) => {
    if (!err) {
      res.render('customer', {
        data: rows,
      });
    } else {
      console.log(err);
    }
  });
});

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
      data: result[0],
    });
  });
});

//post buy
router.post('/save', function (req, res, next) {
  let formData = { name: req.body.name, no_telp: req.body.no_telp, email: req.body.email, address: req.body.address, buy: req.body.buy, product: req.body.product, date: req.body.date, price: req.body.price };

  // insert query
  dbConnection.query('INSERT INTO customer SET ?', formData, function (err, result) {
    if (err) throw err;
    if (err) {
      req.flash('error', err);

      // render to add.ejs
      res.render('customer/buy');
    } else {
      req.flash('successadd', 'successfully buy product ! <a href="https://gmail.com" style="text-decoration: none">cek your email to confirm </a>');
      res.redirect('/');
    }
  });
});

module.exports = router;
