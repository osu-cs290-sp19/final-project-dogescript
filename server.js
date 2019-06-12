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

var classData = JSON.parse(fs.readFileSync('./classes.json'));
var classesData = JSON.parse(fs.readFileSync('./classes-title-description.json'));

// usage:
// getReqString("CS 162", function (str) { console.log(str); });

function getReqString(classCode,classesTaken) {
	if(!(classCode in classData)){
		return classCode
	}
	if(classesTaken.includes(classCode)){
		return "["+classCode+"]"//read this and parce into green text later
    }
	var string = "("+classCode+" and "+classData[classCode]+")"
	if(classData[classCode]==""){
		string=classCode
	} else {
		var matches = string.match(/<.*?>/g)
		if(matches!=null){
				var strMatch = ""
				for(var i=0;i<matches.length;i++){
					string=string.replace(matches[i],getReqString(matches[i].substring(1,matches[i].length-1),classesTaken))
				}
		}
	}
	return string
}

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
	  var params = {}
	  if(result.classesTaken){
	    params.classesTaken=result.classesTaken.join(", ")
	  }
	  if(result.classesWanted){
	    params.classesWanted=result.classesWanted.join(", ")
	  }
	  if(result.classesNeeded){
	    params.classesNeeded=new String(result.classesNeeded).replace(/\[/g,'<span style=\"color:green;\">').replace(/\]/g,'</span>')
	  }
      res.status(200).render('home',params);
    });
  } else {
    res.writeHead(302,{'Location':'login'})
	res.end()
  }
});
app.post('/home', function(req,res,next){
  if ('userid' in req.cookies){
	var classesWanted=req.body.classesWanted.split(",").map(s => s.trim())
	var classesTaken=req.body.classesTaken.split(",").map(s => s.trim())
	var classesNeeded=[]
	for (var i=0;i<classesWanted.length;i++){
		classesNeeded.push(getReqString(classesWanted[i],classesTaken));
	}
	dbClient.updateOne({_id:new ObjectId(req.cookies["userid"])},{$set:{classesTaken:classesTaken,classesWanted:classesWanted,classesNeeded:classesNeeded}},function(err,mongoRes){
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
  res.status(200).render('account',{loggedIn:"userid" in req.cookies});
});

app.post('/login', function(req, res, next){
  dbClient.find({username:req.body.username}).toArray(function(err,result){
    if (err) throw err
    if (result.length==0) {
      var user = {username: req.body.username,classesWanted:[],prereqsNeeded:[],clasesTaken:[]}
      dbClient.insertOne(user,function(err,mongoRes){
        if (err) throw err
    	res.cookie('userid',String(mongoRes.insertedId),{maxAge:900000})
    	res.writeHead(302, {'Location':'home'})
		res.end()
  	  });
	} else {
	  //already has acount, login with it
      res.cookie('userid',String(result[0]._id),{maxAge:900000})
      res.writeHead(302, {'Location':'home'})
	  res.end()
	}
  });
});

app.get('/searchClasses',function(req, res, next){
  res.status(200).render('searchClasses',{classes:classesData});
});

app.get('/deleteAccount',function(req,res,next){
  if ('userid' in req.cookies){
    dbClient.deleteOne({_id:new ObjectId(req.cookies["userid"])},function(err,obj){
      if (err) throw err
      res.clearCookie('userid')
      res.writeHead(302,{'Location':'login'})
      res.end()
    });
  } else {
    res.writeHead(302,{'Location':'login'})
	res.end()
  }
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

// If invalid page
app.get('*', function (req, res) {
  res.status(404).render('404', {});
});

// Listen on port
app.listen(port, function () {
  console.log("== Server is listening on port", port, ". Press Ctrl+c to exit.");
});
