var searchSection = document.getElementById('search');
var listElt = document.getElementById('list');
var filteredListElt = document.getElementById('filteredList');
var searchInput = document.getElementById('searchInput');

// Load & display food items
var foodItems;
getFooodItems();

searchInput.addEventListener('keyup', function () {
	var search = searchInput.value;
	foodItems.forEach((foodItem, index) => {
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

function getFooodItems() {
	Aias.HTTP.GET('http://nutrimetrics.estellepicq.com/food?fodmaps=1', 'json')
		.then(response => {
			foodItems = response;
			displayList(foodItems);
			displayFilteredList(foodItems);
		})
		.catch(err => {
			console.log("error", err);
		});
}

function displayList(items) {
	items.forEach((item) => {
		// Create element
		var itemElt = document.createElement('div');
		var cutoff = item.fodmaps_cutoff ? ' - ' + item.fodmaps_cutoff + ' max' : ''
		itemElt.textContent = item.name + cutoff;
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
	var low = '<div class="indicator low"></div>';
	var high = '<div class="indicator high"></div>';
	items.forEach((item, index) => {
		var itemElt = document.createElement('div');
		var cutoff = item.fodmaps_cutoff ? ' - ' + item.fodmaps_cutoff + ' max' : '';
		var indicator = item.fodmaps_indicator === 'low' ? low : high;
		itemElt.innerHTML = indicator + item.name + cutoff;
		itemElt.setAttribute('class', 'filtered-item');
		itemElt.id = 'item_' + index;
		filteredListElt.appendChild(itemElt);
	});
}
