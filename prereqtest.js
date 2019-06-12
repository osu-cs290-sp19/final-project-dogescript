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
var classesTaken = [
	"CS 160",
	"CS 161"
]


//standardized format
//enclose all class codes in <>
//expand the shortcut to full codes using python
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
		//		console.log("\t\t"+matches)
				var strMatch = ""
				for(var i=0;i<matches.length;i++){
		//			console.log("\t\t"+matches[i]+" with "+getReqString(matches[i].substring(1,matches[i].length-1),classesTaken))
					string=string.replace(matches[i],getReqString(matches[i].substring(1,matches[i].length-1),classesTaken))
				}
		}
	}
//	console.log("\t"+classCode+":"+string)
	return string
}
console.log("CS 290: "+getReqString("CS 290",classesTaken))
console.log("CS 344: "+getReqString("CS 344",classesTaken))
console.log("MTH 100: "+getReqString("MTH 100",classesTaken))
console.log("ECE 290: "+getReqString("ECE 290",classesTaken))
console.log("CS 161: "+getReqString("CS 161",classesTaken))
console.log("CS 162: "+getReqString("CS 162",classesTaken))
//OLD IDEA, BAD

//standarized format
//change or to | and and to &
//change to postfix
//(<LLL NNN> or <LLL NNN>)
//(BI 211 or 211H) and (BI 212 or 212H) and (BI 213 or 213H) and (CH 233 or 233H) and (CH 263 or 263H)
/*function getReqString(classCode) {
	var needed = [classCode]
	var str = classData[classCode]
	var lastOpen = []
	var data = []
	var operator = ""
	var c = ''
	for(int i=0;i<str.length;i++){
		c=str.chatAt(i)
		if(c=='('){
			lastOpen.push(i)
			operator=''
		} else if (c==')'){
			lastOpen.pop()
		} else if (c=='<'){
			//start of class code
			for(int j=i+1;j<str.length;j++){
				c=str.chatAt(i)
				if(c=='>'){
					data.push(str.substring(i+1,j-1)
					i=j+1
					break;
				}
			}
		} else if(c=='|') {
			needed.push([data.pop(),data.pop()]);//this should be recursive
		} else if(c=='&') {

		}
	}
}*/
