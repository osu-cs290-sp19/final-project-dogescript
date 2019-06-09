
// Function to save all inputs into the forms
function autoSave() {
  var cTaken = document.getElementById('classesTaken').value.trim();
  var cWanted = document.getElementById('clasesWanted').value.trim();

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
