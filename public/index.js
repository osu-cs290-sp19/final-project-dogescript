
// Function to save all inputs into the forms
function autoSave() {
  var cTaken = document.getElementById('classesTaken').value.trim();
  var cWanted = document.getElementById('classesWanted').value.trim();

  var postRequest = new XMLHttpRequest();
  var requestURL = '/addClasses';
  postRequest.open('POST', requestURL);

  var requestBody = JSON.stringify({
    classesTaken: cTaken,
    classesWanted: cWanted
  });

  postRequest.addEventListener('load', function (event) {
    if (event.target.status === 200) {
      var classesTemplate = Handlebars.templates.classes;
      var newClassesHTML = classesTemplate({
        classesTaken: cTaken,
        classesWanted: cWanted
      });
      var classContainer = document.querySelector('INSERT STUFF');
      classContainer.insertAdjacentHTML('beforeend', newClassesHTML);
    } else {
      alert("Error storing classes: " + event.target.response);
    }
  });

  postRequest.setRequestHeader('Content-Type', 'application/json');
  postRequest.send(requestBody);
}

//Getting Class Data for the viewPossible page
function getClassData() {
	var classesTaken = [];
	var classesWanted = [];

	//var classNames = Handlebars.templates.home;

	var classTakenNames = document.getElementsById("classesTaken");
	var classWantedNames = document.getElementsById("classesWanted");

	var classContainer = document.getElementsByClassName("Class-container");

	classContainer[0].insertAdjacentHTML('beforeend', classTakenNames);
	}

//This function goes through the mongodb database and selects a background color for the boxes depending on if the preReq was met with class pages or not
function changeColor(classTaken, classWanted, preReqs) {

	pR = db.user.find({preReqsNeeded: preReqs});
	cT = db.user.find({classesTaken: classTaken});

	if(cT == pR) {
		var cardColor = document.getElementbyId("class-card");
		cardColor.style.color="green";
		}
	else if(pR == {}) {
		var cardColor = document.getElementbyId("class-card");
		cardColor.style.color="green";
		}
	else{
		var cardColor = document.getElementbyId("class-card");
		cardColor.style.color="red";

		}
	
	}
