var listElt = document.getElementById('list');
var searchInput = document.getElementById('searchInput');

// Load & display food items
var foodItems;
getFooodItems();

searchInput.addEventListener('keyup', function() {
	var search = searchInput.value;
	foodItems.forEach((foodItem, index) => {
		var itemElt = document.getElementById('item_' + index);
		if (foodItem.name.toLowerCase().includes(search.toLowerCase())) {
			if (!itemElt.classList.contains('displayed')) {
				itemElt.classList.add('displayed');
			}
		} else {
			itemElt.classList.remove('displayed');
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
		itemElt.textContent = item.name;
		itemElt.classList.add('item', 'displayed');
		itemElt.id = 'item_' + index;
		// Find parent element
		var category = item.fodmaps_category.toLowerCase().replace(' ', '');
		var parentElt = document.getElementById(category);
		// Create parent element if not found
		if (!parentElt) {
			parentElt = document.createElement('div');
			parentElt.id = category;
			listElt.append(parentElt);
			// Create category title
			var title = document.createElement('h4');
			title.textContent = item.fodmaps_category;
			parentElt.append(title);
		}
		// Append
		parentElt.appendChild(itemElt);
	});
	
}