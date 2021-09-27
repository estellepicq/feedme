var searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
      event.preventDefault();
      redirectSearchUrl();
    }
  });
}

function redirectSearchUrl(selectedFilters) {
  var url = '/?searchText=' + searchInput.value.toLowerCase();
  if (selectedFilters && Object.keys(selectedFilters).length) {
    for (var prop in selectedFilters) {
      url += '&' + prop + '=' + selectedFilters[prop];
    }
  }
  window.location = url;
}

function selectSetting(prop, value) {
  var selectedId = prop + '_' + value;
  var selectedElt = document.getElementById(selectedId);
  selectedElt.classList.toggle('btn-warning');
  selectedElt.classList.toggle('btn-outline-warning');
  selectedElt.toggleAttribute('data-filter-selected');
}

function applyFilters() {
  var selectedFiltersObject = {};
  var selectedFiltersElts = document.querySelectorAll('[data-filter-selected]');
  for (var i = 0; i < selectedFiltersElts.length; i++) {
    const propName = selectedFiltersElts[i].id.split('_')[0];
    const propValue = selectedFiltersElts[i].id.split('_')[1];
    selectedFiltersObject[propName] = propValue;
  }
  redirectSearchUrl(selectedFiltersObject);
}