if (document.getElementById('map')) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZXBpY3EiLCJhIjoiY2t1Mno5ejZ0MnVnMjJwcXRyOXQ4dDM1NyJ9.T7uNTlYSENckW1s3CQJ6_g';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [2.597737934632275, 46.62615880227343], // starting position [lng, lat]
    zoom: 4 // starting zoom
  });

  // Create a default Marker and add it to the map.
  const marker1 = new mapboxgl.Marker()
    .setLngLat([-0.5867988938266372, 44.83963850726045])
    .addTo(map);

  // Create a default Marker, colored black, rotated 45 degrees.
  const marker2 = new mapboxgl.Marker()
    .setLngLat([1.4590296153410456, 43.63555466288775])
    .addTo(map);
}

// Savr: sauvegarder les lieux via un geocoding: champ de recherche, enregistrer le resultat de:
// https://nominatim.openstreetmap.org/search.php?q=bordeaux&polygon_geojson=1&format=jsonv2

// Puis sur feedme, récupérer les différentes coordonnées et les afficher sur une map