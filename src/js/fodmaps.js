/* Polyfills for IE - classList */
if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
	Object.defineProperty(HTMLElement.prototype, 'classList', {
		get: function () {
			var self = this;
			function update(fn) {
				return function (value) {
					var classes = self.className.split(/\s+/),
						index = classes.indexOf(value);

					fn(classes, index, value);
					self.className = classes.join(" ");
				}
			}

			var ret = {
				add: update(function (classes, index, value) {
					~index || classes.push(value);
				}),

				remove: update(function (classes, index) {
					~index && classes.splice(index, 1);
				}),

				toggle: update(function (classes, index, value) {
					~index ? classes.splice(index, 1) : classes.push(value);
				}),

				contains: function (value) {
					return !!~self.className.split(/\s+/).indexOf(value);
				},

				item: function (i) {
					return self.className.split(/\s+/)[i] || null;
				}
			};

			Object.defineProperty(ret, 'length', {
				get: function () {
					return self.className.split(/\s+/).length;
				}
			});

			return ret;
		}
	});
}
/*** End of polyfill ***/

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
