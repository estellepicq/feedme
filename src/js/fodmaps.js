var searchSection = document.getElementById('search');
var listElt = document.getElementById('list');
var filteredListElt = document.getElementById('filteredList');
var searchInput = document.getElementById('searchInput');
var noFoodMessage = document.getElementById('noFoodMessage');

// Load & display food items
var foodItems = [];
getFoodItems();

searchInput.addEventListener('keyup', function () {
	var search = searchInput.value;
	foodItems.forEach(function(foodItem, index) {
		var itemElt = document.getElementById('item_' + index);
		if (searchInput.value) {
			searchSection.classList.add('filtering');
			if (foodItem.name.toLowerCase().includes(search.toLowerCase())) {
				if (!itemElt.classList.contains('displayed')) {
					itemElt.classList.add('displayed');
				}
			} else {
				itemElt.classList.remove('displayed');
			}
		} else {
			searchSection.classList.remove('filtering');
			itemElt.classList.remove('displayed');
		}
	});
});

function getFoodItems() {
	Aias.HTTP.GET('http://nutrimetrics.estellepicq.com/food?fodmaps=1', 'json')
		.then(function(response) {
			if (response && response.length) {
				foodItems = response;
				displayList(foodItems);
				displayFilteredList(foodItems);
			} else {
				displayNoFoodMessage('Etrange, aucun aliment trouvé.');
			}
		})
		.catch(function() {
			displayNoFoodMessage('Oups, erreur dans la récupération des aliments.');
		});
}

function displayList(allItems) {
	allItems.forEach(function(item) {
		// Create element
		var itemElt = document.createElement('div');
		itemElt.innerHTML = createFoodItemTemplate(item);
		itemElt.setAttribute('class', 'item');
		// Find parent element
		var category = item.fodmaps_category.toLowerCase().replace(/ /g, '');
		var parentElt = document.getElementById(category);
		// Create parent element if not found
		if (!parentElt) {
			parentElt = document.createElement('div');
			parentElt.id = category;
			parentElt.setAttribute('class', 'category');
			listElt.append(parentElt);
			// Create category title
			var title = document.createElement('h4');
			title.textContent = item.fodmaps_category;
			parentElt.append(title);
			// Create low and high sections
			var lowSection = document.createElement('div');
			lowSection.id = category + '_low';
			parentElt.appendChild(lowSection);
			var lowSectionTitle = document.createElement('h5');
			lowSectionTitle.textContent = 'Pauvres en FODMAPs';
			lowSection.appendChild(lowSectionTitle);
			var highSection = document.createElement('div');
			highSection.id = category + '_high';
			parentElt.appendChild(highSection);
			var highSectionTitle = document.createElement('h5');
			highSectionTitle.textContent = 'Riches en FODMAPs';
			highSection.appendChild(highSectionTitle);
		}
		// Append to the right section
		var section = document.getElementById(category + '_' + item.fodmaps_indicator);
		section.appendChild(itemElt);
	});
}

function displayFilteredList(items) {
	items.forEach(function(item, index) {
		var itemElt = document.createElement('div');
		itemElt.innerHTML = createFoodItemTemplate(item);;
		itemElt.setAttribute('class', 'filtered-item');
		itemElt.id = 'item_' + index;
		filteredListElt.appendChild(itemElt);
	});
}

function createFoodItemTemplate(item) {
	var cutoff = item.fodmaps_cutoff ? ' - ' + item.fodmaps_cutoff + ' max' : '';
	var low = '<div class="indicator low"></div>';
	var high = '<div class="indicator high"></div>';
	var indicator = item.fodmaps_indicator === 'low' ? low : high;
	return indicator + item.name + cutoff;
}

function displayNoFoodMessage(message) {
	noFoodMessage.textContent = message;
	noFoodMessage.style.display = 'block';
}