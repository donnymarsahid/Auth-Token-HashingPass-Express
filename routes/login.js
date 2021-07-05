var express = require('express');
var router = express.Router();

// login
router.get('/', (req, res, next) => {
  res.render('admin/login');
});

module.exports = router;
