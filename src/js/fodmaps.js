var searchSection = document.getElementById('search');
var listElt = document.getElementById('list');
var filteredListElt = document.getElementById('filteredList');
var searchInput = document.getElementById('searchInput');
var noFoodMessage = document.getElementById('noFoodMessage');
var filteredItemElts = document.getElementsByClassName('filtered-item');

if (searchInput) {

	searchInput.addEventListener('keyup', function () {
		var search = searchInput.value.toUpperCase();
		if (searchInput.value) {
			searchSection.classList.add('filtering');
			for (var i = 0; i < filteredItemElts.length; i++) {
				var eltValue = filteredItemElts[i].textContent || filteredItemElts[i].innerText;
				if (eltValue.toUpperCase().indexOf(search) > -1) {
					filteredItemElts[i].classList.add('displayed');
				} else {
					filteredItemElts[i].classList.remove('displayed');
				}
			}
		} else {
			searchSection.classList.remove('filtering');
		}
	});
}
