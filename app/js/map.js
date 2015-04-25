var L = require('leaflet');
var util = require('./utilities');


var sublayers = [];

function run(person) {
	// var person = 'N00001127';
	console.log('map.running / person: ', person);

	load(person);
}

function load(person) {
	var district = util.zeroPad(person.district, 2);

	var filepath = 'assets/districts/' + person.state + district + '_geo.json';
	d3.json(filepath, function(error, data) {
		if (error) {
			console.log(error);
		} else {
			console.log(data);
			render(data);
		}
	});

}

function render(data) {

	var accessToken = 'pk.eyJ1IjoiYmNsaWZ0b24iLCJhIjoicWNXT0Z6OCJ9.JvNO6GIbU8BZ-8LLSEwz2Q';
	var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/bclifton.9f0ca136/{z}/{x}/{y}.png?access_token=' + accessToken, {
	    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
	});


	var map = new L.Map('map', {
	    center: [39.8282, -98.5795],
	    zoom: 2
	  }).addLayer(mapboxTiles);

 	L.geoJson(data).addTo(map);
	// var sublayerOptions = {
	//         sql: "SELECT * FROM property_unique_carto",
	//         cartocss: "#null{"+
	//           "marker-fill-opacity: 0.9;"+
	//           "marker-line-color: #FFF;"+
	//           "marker-line-width: 1.5;"+
	//           "marker-line-opacity: 0;"+
	//           "marker-placement: point;"+
	//           "marker-type: ellipse;"+
	//           "marker-width: 6;"+
	//           "marker-fill: #e6842a;"+
	//           "marker-opacity: 0.75;"+
	//           "marker-allow-overlap: true;"+
	//         "}"
	//   };

}

exports.run = run;