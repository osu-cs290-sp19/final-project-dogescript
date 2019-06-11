# General

### August Lonibos

* node.js server
* package.json compiling handlebars in handlebars
* express-handlebars
* server side computions

### Joey Didner

* Handlebars Page to show what classes need to be taken including prereqs
* CSS styling

### Max Okazaki

* Handlebars Profile page to save classes taken (/views/account.handlebars)
	* Has options to update classesTaken and classesWanted
	* Has option to delete account (/delete)
* Client side JS
	* Automaticly send post requests on accounts page on keyup to update classesTaken, and classesWanted in realtime
	* talk to Nathan to figure out what on earth what on earth he is talking about
* Design handlebars for templated pages

### Nathan Shaaban

* Login integration
* Git repo management
* Structure and Spec

#### Notes

* Will breakdown jobs more once file structure is created

# MongoDB

## User
```
{
	"username": "",
	"classesWanted": [],
	"prereqsNeeded": [],
	"classesTaken": []
}
```

## Class Entry
```
{
    "code":"AAE 210",
    "title": "INTRO TO AROSPACE ENGINEERING",
    "crn":"57418",
    "description":"bla bla bla boring",
    "restrictions": "Prerequisite: ENGR 211.   A minimum grade of C is ...",
}
```
#### Notes

* all classes are in the form "CS 290"

## Layout of 4 year schedule
