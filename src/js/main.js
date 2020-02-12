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
		if (searchInput.value) {
			searchSection.classList.add('filtering');
		} else {
			searchSection.classList.remove('filtering');
		}
		var itemElt = document.getElementById('item_' + index);
		if (foodItem.name.toLowerCase().includes(search.toLowerCase())) {
			// Add it to filtered list
		}
	});
});

function getFooodItems() {
	Aias.HTTP.GET('http://nutrimetrics.estellepicq.com/food?fodmaps=1', 'json')
		.then(response => {
			foodItems = response;
			this.displayList(foodItems);
		})
		.catch(err => {
			console.log("error", err);
		});
}

function displayList(items) {
	items.forEach((item, index) => {
		// Create element
		var itemElt = document.createElement('div');
		var cutoff = item.fodmaps_cutoff ? ' - ' + item.fodmaps_cutoff : ''
		itemElt.textContent = item.name + cutoff;
		itemElt.setAttribute('class', 'item');
		itemElt.id = 'item_' + index;
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