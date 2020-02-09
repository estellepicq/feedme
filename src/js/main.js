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
		var itemElt = document.createElement('div');
		itemElt.textContent = item.name;
		itemElt.classList.add('item', 'displayed');
		itemElt.id = 'item_' + index;
		listElt.appendChild(itemElt);
	});
	
}