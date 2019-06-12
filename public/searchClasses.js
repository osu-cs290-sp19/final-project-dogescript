function updateSearchClasses(){
	var classesElem=document.getElementById("classes")
	var search = document.getElementById("searchClasses").value.toLowerCase()
	for (var i=0;i<classesElem.children.length;i++){
		if(classesElem!=undefined){
				if(classesElem.children[i].children[0].textContent.toLowerCase().includes(search)||classesElem.children[i].children[1].textContent.toLowerCase().includes(search)){
					classesElem.children[i].style.display='block'
				} else {
					classesElem.children[i].style.display='none'
				}
		}
	}
}
