if (document.getElementById('map')) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZXBpY3EiLCJhIjoiY2t1Mno5ejZ0MnVnMjJwcXRyOXQ4dDM1NyJ9.T7uNTlYSENckW1s3CQJ6_g';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [2.597737934632275, 46.62615880227343], // starting position [lng, lat]
    zoom: 1 // starting zoom
  });

  // Add markers
  if (recipes && recipes.length) {
    recipes.forEach((recipe, i) => {
      if (recipe.placeCoordinates && recipe.placeCoordinates.length) {
        const popupHtml = `<a href="/recipes/${recipe._id}">${recipe.name}</a>`;
        let popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);
           
        let marker = new mapboxgl.Marker()
          .setLngLat(recipe.placeCoordinates)
          .setPopup(popup)
          .addTo(map);
      }
    });
  }
}
