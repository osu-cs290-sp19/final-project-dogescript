var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var port = process.env.PORT || 3069;

// var mongoHost = process.env.MONGO_HOST;
// var mongoPort = process.env.MONGO_PORT || 27017;
// var mongoUser = process.env.MONGO_USER;
// var mongoPassword = process.env.MONGO_PASSWORD;
// var mongoDBName = process.env.MONGO_DB_NAME;
//
// var mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;
// var db = null;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('home');
});

app.get('/home', function (req, res, next) {
  res.status(200).render('home');
});

app.get('/login', function (req, res, next) {
  res.status(200).render('account');
});

app.get('/check', function (req, res, next) {
  res.status(200).render('viewPossible');
});

// If invalid page
app.get('*', function (req, res) {
  res.status(404).render('404', {});
});

// Listen on port
app.listen(port, function () {
  console.log("== Server is listening on port", port, ". Press Ctrl+c to exit.");
});
