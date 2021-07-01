var express = require('express');
var router = express.Router();

// Get Database
const dbConnection = require('../lib/database');

// Get Products
router.get('/', function (req, res, next) {
  dbConnection.query('SELECT * FROM products ORDER BY id_products desc', function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('products', { data: '' });
    } else {
      res.render('products', { data: rows });
    }
  });
});

// Get add
router.get('/add', function (req, res, next) {
  res.render('products/add');
});

// Post add
router.post('/save', function (req, res, next) {
  let name = req.body.name;
  let quantity = req.body.quantity;
  let price = req.body.price;
  let images = req.body.images;
  let errors = false;

  if (name.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', 'Input Your Name !');
    // render to add.ejs with flash message
    res.render('products/add');
  }

  if (quantity.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', 'Input Your Quantity !');
    // render to add.ejs with flash message
    res.render('products/add');
  }

  if (price.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', 'Input Your Price !');
    // render to add.ejs with flash message
    res.render('products/add');
  }
  // if no error
  if (!errors) {
    let formData = { name: req.body.name, quantity: req.body.quantity, price: req.body.price, images: req.body.images };

    // insert query
    dbConnection.query('INSERT INTO products SET ?', formData, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash('error', err);

        // render to add.ejs
        res.render('products/add');
      } else {
        req.flash('successadd', 'successfully added product !');
        res.redirect('/products');
      }
    });
  }
});

// Edit Products get
router.get('/edit/:userId', function (req, res, next) {
  let userId = req.params.userId;
  let sql = `SELECT * FROM products where id_products = ${userId}`;
  dbConnection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('products/edit', {
      user: result[0],
    });
  });
});

// Edit Products Post
router.post('/update', (req, res) => {
  let sql = "UPDATE products SET name='" + req.body.name + "', quantity='" + req.body.quantity + "', price='" + req.body.price + "', images='" + req.body.images + "' WHERE id_products=" + req.body.id_products;
  let query = dbConnection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'success update');
      res.redirect('/products');
    }
  });
});

// Delete Products
router.get('/delete/:userId', function (req, res, next) {
  const userId = req.params.userId;
  let sql = `DELETE FROM products where id_products = ${userId}`;
  dbConnection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect('/products');
  });
});

// Details Product
router.get('/details/:detailId', function (req, res, next) {
  let detailId = req.params.detailId;
  let sql = `SELECT * FROM products where id_products = ${detailId}`;
  dbConnection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('products/details', {
      user: result[0],
    });
  });
});

// Transaction
router.get('/transaction', function (req, res, next) {
  dbConnection.query('SELECT * FROM customer ORDER BY id_customer desc', function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('products/transaction', { data: '' });
    } else {
      res.render('products/transaction', { data: rows });
    }
  });
});

module.exports = router;
