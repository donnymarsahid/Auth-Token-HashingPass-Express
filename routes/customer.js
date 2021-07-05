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
    if (err) {
      req.flash('error', err);

      res.render('customer/buy');
    } else {
      req.flash('successadd', 'successfully buy product ! <a href="https://gmail.com" style="text-decoration: none">cek your email to confirm </a>');
      res.redirect('/');
    }
  });
});

// Add to whistlist
router.get('/whistlist/:whistlistId', function (req, res, next) {
  let whistlistId = req.params.whistlistId;
  let sql = `SELECT * FROM products where id_products = ${whistlistId}`;
  let sqlWhistlist = `INSERT INTO whistlist SET ?`;
  dbConnection.query(sql, (err, result) => {
    if (err) throw err;
    let form = { name: result[0].name, quantity: result[0].quantity, price: result[0].price, images: result[0].images };
    dbConnection.query(sqlWhistlist, form, (err, rows) => {
      req.flash('successWhistlist', 'success add to whistlist');
      res.redirect('/');
    });
  });
});

// Get Data Whistlist
router.get('/whistlist', function (req, res, next) {
  dbConnection.query('SELECT * FROM whistlist ORDER BY id desc', function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('customer/whistlist', { data: '' });
    } else {
      req.flash('empty', 'whistlist not found !');
      res.render('customer/whistlist', { data: rows });
    }
  });
});

// Get Data Buy From Whistlist
router.get('/whistlist/buy/:buyListId', function (req, res, next) {
  let buyListId = req.params.buyListId;
  let sql = `SELECT * FROM whistlist where id = ${buyListId}`;
  dbConnection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('customer/buyWhistlist', {
      data: result[0],
    });
  });
});

// Delete Whistlist
router.get('/whistlist/delete/:deleteId', function (req, res, next) {
  const deleteId = req.params.deleteId;
  let sql = `DELETE FROM whistlist where id = ${deleteId}`;
  dbConnection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect('/whistlist');
  });
});

module.exports = router;
