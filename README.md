# General

### August Lonibos

* node.js server
* express-handlebars
* server side computions

### Joey Didner

* Handlebars Page to show all possible options for when to take classes
* Handlebars Page to view saved possibilities (should be same as above, just different server.js routing)
* CSS styling

### Max Okazaki

* Handlebars Profile page to save classes taken
* Client side JS
	* Automaticly send post requests on accounts page on keyup to update classesTaken, and classesWanted in realtime
	* Automaticly send post requests to get the new list of prereqs needed
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
	"email": "",
	"classesWanted": [],
	"prereqsNeeded": [],
	"classesTaken": []
}
```
#### Notes

* all classes are in the form "CS 290"

## Layout of 4 year schedule
