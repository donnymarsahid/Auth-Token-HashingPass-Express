var express = require('express');
var router = express.Router();

// Get Database
const dbConnection = require('../lib/database');

// Search Products
router.post('/', (req, res, next) => {
  let search = req.body.search;
  dbConnection.query('SELECT * FROM products WHERE name LIKE ?', ['%' + search + '%'], (err, rows) => {
    if (!err) {
      res.render('products', {
        data: rows,
      });
    } else {
      console.log(err);
    }
  });
});

// Data token cookie for login save
const crypto = require('crypto');
const generateAuthToken = () => {
  return crypto.randomBy;
};
const authTokens = {};

// Login
router.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  dbConnection.query('SELECT * FROM admin where username = ? and password = ?', [username, password], function (err, results, fields) {
    if (results.length > 0) {
      const authToken = generateAuthToken();
      const user = results;
      authTokens[authToken] = user;
      res.cookie('AuthToken', authToken);
      res.redirect('/products');
    } else {
      req.flash('login', 'username / password is wrong!');
      res.redirect('/login');
    }
  });
});

// Route for next token Products Login
router.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies['AuthToken'];

  // Inject the user to the request
  req.user = authTokens[authToken];

  next();
});

// Get Products
router.get('/', function (req, res, next) {
  dbConnection.query('SELECT * FROM products ORDER BY id_products desc', function (err, rows) {
    if (req.user) {
      res.render('products', {
        data: rows,
      });
    } else {
      req.flash('errlogin', 'Please Login to continue');
      res.render('admin/login');
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

  if (images.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', 'Input Your Images !');
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
