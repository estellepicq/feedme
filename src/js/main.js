var searchInput = document.getElementById('searchInput');
var delay = makeDelay(1000);

searchInput.addEventListener('keyup', function() {
	delay(function() {
		var foodItems = getFodmaps(searchInput.value);
		console.log(foodItems);
	});
});

function makeDelay(ms) {
	var timer = 0;
	return function(callback){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
};

function getFodmaps(searchTerm) {
	Aias.HTTP.GET('http://nutrimetrics.estellepicq.com/food?fodmaps=1&searchTerm=' + "\"" + searchTerm + "\"", "json")
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.log("error", err);
  });
}