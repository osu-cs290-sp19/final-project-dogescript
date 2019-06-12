var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID
var cookieParser = require('cookie-parser')

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
  if(err) throw err
  dbClient=client.db("cs290_shaabann").collection("users")
  console.log("connected to Mongo!")
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(cookieParser())

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('home');
});

app.get('/home', function (req, res, next) {
  if('userid' in req.cookies) {
    dbClient.find({_id:new ObjectId(req.cookies["userid"])}).toArray(function(err,result){
      if (err) throw err
	  result=result[0]
	  console.log(result)
      res.status(200).render('home',{classesWanted:result.classesWanted.join(", "),classesTaken:result.classesTaken.join(", ")});
    });
  } else {
    res.writeHead(302,{'Location':'login'})
	res.end()
  }
});
app.post('/home', function(req,res,next){
  if ('userid' in req.cookies){
    console.log(req.body)
	dbClient.updateOne({_id:new ObjectId(req.cookies["userid"])},{$set:{classesTaken:req.body.classesTaken.split(",").map(s => s.trim()),classesWanted:req.body.classesWanted.split(",").map(s => s.trim())}},function(err,mongoRes){
      if (err) throw err
	  res.writeHead(302,{'Location':'home'})
	  res.end()
    });
  } else {
    res.writeHead(302,{'Location':'login'})
	res.end()
  }
});

app.get('/login', function (req, res, next) {
  res.status(200).render('account');
});

app.get('/createAccount', function (req, res, next) {
  res.status(200).render('createAccount');
});

app.post('/createAccount', function(req, res, next){
  var user = {username: req.body.username,classesWanted:[],prereqsNeeded:[],clasesTaken:[]}
  dbClient.insertOne(user,function(err,mongoRes){
    if (err) throw err
	res.cookie('userid',String(mongoRes.insertedId),{maxAge:900000})
    res.writeHead(302, {'Location':'home'})
	res.end()
  });
});

app.get('/debug',function(req,res,next){
  dbClient.find({}).toArray(function(err,result){
    if (err) throw err
    res.status(200).render('debug',{users:result});
  });
});

app.get('/flush',function(req,res,next){
  dbClient.deleteMany({},function(err,obj){
    if (err) throw err
	console.log("flushed db")
	res.end();
  });
});

var classListMock = { classList: [ {className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"},{className: "ads"}, {className: "asdfds"} ] };

app.get('/viewPossible', function (req, res, next) {
  res.status(200).render('viewPossible', classListMock);
});

// If invalid page
app.get('*', function (req, res) {
  res.status(404).render('404', {});
});

// Listen on port
app.listen(port, function () {
  console.log("== Server is listening on port", port, ". Press Ctrl+c to exit.");
});
