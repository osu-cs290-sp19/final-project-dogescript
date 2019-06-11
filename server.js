var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var port = process.env.PORT || 3069;

// fancy-dancy ES6 async
var classData = fs.promises.readFile('./classes.json')
                           .then(obj => JSON.parse(obj))
                           .catch(err => console.log(err));

function getReqString(classCode, callback) {
  classData.then((data) => {
    let classEntry = data.find(element => element.code === classCode);
    let reqString = classEntry.restrictions.match(/:\s*(.+)[.]\s/)[1];
    callback(reqString);
  }).catch(err => console.log(err));
}
// usage:
// getReqString("CS 162", function (str) { console.log(str); });


var mongoHost = "classmongo.engr.oregonstate.edu";
var mongoPort = 27017;
var mongoUser = "cs290_shaabann";
var mongoPassword = "dogeFinalPassword";
var mongoDBName = "c290_shaabann";

var mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;
dbClient=null
MongoClient.connect("mongodb://cs290_shaabann:dogeFinalPassword@classmongo.engr.oregonstate.edu:27017/c290_shaabann?authSource=cs290_shaabann&w=1", { useNewUrlParser: true }, function(err,client) {
	if(err){
		console.log(err);
	} else {
		dbClient=client
	}
});

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

app.get('/createAccount', function (req, res, next) {
  res.status(200).render('createAccount');
});

app.get('/createAccountPost', function(req, res, next){
  console.log(requesnt.body.username)
  res.status(200).end();
});

app.get('/viewPossible', function (req, res, next) {
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
