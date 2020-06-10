// Add your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnJlbjk2IiwiYSI6ImNqc2pkNGRvdTA0bm80OW9hOTIxNzB6NG0ifQ.tDovHyl1gFWQ96O3pok0Qg';
var map = new mapboxgl.Map({
    container: 'map', // Specify the container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Specify which map style to use
    center: [-77.0369,38.895], // Specify the starting position
    zoom: 11.5, // Specify the starting zoom
});
// // Create variables to use in getIso()
var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var lon = -77.034;
var lat = 38.899;
var profile = 'walking';
var minutes = 10;
// Create a function that sets up the Isochrone API query then makes an Ajax call
function getIso() {
    var query = urlBase + profile + '/' + lon + ',' + lat + '?contours_minutes=' + minutes + '&polygons=true&access_token=' + mapboxgl.accessToken;
    $.ajax({
    method: 'GET',
    url: query
    }).done(function(data) {
    // Set the 'iso' source's data to what's returned by the API query
    map.getSource('iso').setData(data);
    })
};
// Target the "params" form in the HTML portion of your code
var params = document.getElementById('params');

// When a user changes the value of duration by clicking a button, change the parameter's value and make the API query again
params.addEventListener('change', function(e) {
    if (e.target.name === 'duration') {
        minutes = (e.target.value/2);
        getIso();
    }
});
var marker = new mapboxgl.Marker({
'color': '#314ccd'
});

// Create a LngLat object to use in the marker initialization
// https://docs.mapbox.com/mapbox-gl-js/api/#lnglat
var lngLat = {
lon: lon,
lat: lat
};

map.on('load', function() {
    // Initialize the marker at the query coordinates
    marker.setLngLat(lngLat).addTo(map);
    // When the map loads, add the source and layer
    map.addSource('iso', {
    type: 'geojson',
    data: {
        'type': 'FeatureCollection',
        'features': []
    }
    });
    map.addLayer({
    'id': 'isoLayer',
    'type': 'fill',
    // Use "iso" as the data source for this layer
    'source': 'iso',
    'layout': {},
    'paint': {
        // The fill color for the layer is set to a light purple
        'fill-color': '#5a3fc0',
        'fill-opacity': 0.3
    }
    }, "poi-label");

    // Make the API call
    getIso();
});