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

// function getFoodItems() {
// 	Aias.HTTP.GET('http://nutrimetrics.feedinggood.fr/food?fodmaps=1')
// 		.then(function(response) {
// 			if (response && response.length) {
// 				// foodItems = response;
// 				foodItems = Ch.isJson(response) ? JSON.parse(response) : response;
// 				displayList(foodItems);
// 				displayFilteredList(foodItems);
// 			} else {
// 				displayNoFoodMessage('Etrange, aucun aliment trouvé.');
// 			}
// 		})
// 		.catch(function(_error) {
// 			console.log(_error);
// 			displayNoFoodMessage('Oups, erreur dans la récupération des aliments.');
// 		});
// }

// function displayList(allItems) {
// 	allItems.forEach(function(item) {
// 		// Create element
// 		var itemElt = document.createElement('div');
// 		itemElt.innerHTML = createFoodItemTemplate(item);
// 		itemElt.setAttribute('class', 'item');
// 		// Find parent element
// 		var category = item.fodmaps_category.toLowerCase().replace(/ /g, '');
// 		var parentElt = document.getElementById(category);
// 		// Create parent element if not found
// 		if (!parentElt) {
// 			parentElt = document.createElement('div');
// 			parentElt.id = category;
// 			parentElt.setAttribute('class', 'category');
// 			listElt.append(parentElt);
// 			// Create category title
// 			var title = document.createElement('h4');
// 			title.textContent = item.fodmaps_category;
// 			parentElt.append(title);
// 			// Create low and high sections
// 			var lowSection = document.createElement('div');
// 			lowSection.id = category + '_low';
// 			parentElt.appendChild(lowSection);
// 			var lowSectionTitle = document.createElement('h5');
// 			lowSectionTitle.textContent = 'Pauvres en FODMAPs';
// 			lowSection.appendChild(lowSectionTitle);
// 			var highSection = document.createElement('div');
// 			highSection.id = category + '_high';
// 			parentElt.appendChild(highSection);
// 			var highSectionTitle = document.createElement('h5');
// 			highSectionTitle.textContent = 'Riches en FODMAPs';
// 			highSection.appendChild(highSectionTitle);
// 		}
// 		// Append to the right section
// 		var section = document.getElementById(category + '_' + item.fodmaps_indicator);
// 		section.appendChild(itemElt);
// 	});
// }

// function displayFilteredList(items) {
// 	items.forEach(function(item, index) {
// 		var itemElt = document.createElement('div');
// 		itemElt.innerHTML = createFoodItemTemplate(item);;
// 		itemElt.setAttribute('class', 'filtered-item');
// 		itemElt.id = 'item_' + index;
// 		filteredListElt.appendChild(itemElt);
// 	});
// }

// function createFoodItemTemplate(item) {
// 	var cutoff = item.fodmaps_cutoff ? ' - ' + item.fodmaps_cutoff + ' max' : '';
// 	var low = '<div class="indicator low"></div>';
// 	var high = '<div class="indicator high"></div>';
// 	var indicator = item.fodmaps_indicator === 'low' ? low : high;
// 	return indicator + item.name + cutoff;
// }

// function displayNoFoodMessage(message) {
// 	noFoodMessage.textContent = message;
// 	noFoodMessage.style.display = 'block';
// }