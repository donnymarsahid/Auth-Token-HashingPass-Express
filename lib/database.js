const mysql = require('mysql');

//Set
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'electronic_store',
  timezone: '',
});

//Status Connection to Database
connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log('Database is Connected');
  }
});

module.exports = connection;
