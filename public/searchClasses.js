function updateSearchClasses(){
	var classesElem=document.getElementById("classes")
	var search = document.getElementById("searchClasses").value.toLowerCase()
	for (var i in classesElem.children){
		if(classesElem.children[i].children[0].textContent.toLowerCase().includes(search)||classesElem.children[i].children[1].textContent.toLowerCase().includes(search)){
			classesElem.children[i].style.display='block'
		} else {
			classesElem.children[i].style.display='none'
		}
	}
}
