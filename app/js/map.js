var _ = require('underscore');
var L = require('leaflet');
var queue = require('queue-async');
var util = require('./utilities');

var map;
var sublayers = [];
var p;

function run(person) {
	// var person = 'N00001127';
	console.log('map.running / person: ', person);

	load(person);
}

function load(person) {
	var district = util.zeroPad(person.district, 2);

	// console.log(person.state + district);

	p = person;

	var districts_filepath = 'assets/districts/' + person.state + district + '_geo.json';
	var locations_filepath = 'assets/property_with_income.csv';

	queue()
		.defer(d3.json, districts_filepath)
		.defer(d3.csv, locations_filepath)
		// .defer(getPerson, person)
		.await(manage);

	// d3.json(filepath, function(error, data) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.log(data);
	// 		render(data);
	// 	}
	// });
}

function findRealEstate(cid, locationsData) {
	var properties = [];
	_.each(locationsData, function(item) {
		if (item.cid === cid) {
			properties.push(item);
		}
	});
	return properties;
}

function manage(error, districtsData, locationsData) {
	if (map != undefined) { map.remove(); } // clears any existing map

	if (error) {
		console.log(error);
	} else {
		render(districtsData, locationsData);
	}
}

function render(districtsData, locationsData) {
	// console.log(locationsData);

	var properties = findRealEstate(p.opensecrets_id, locationsData);

	var accessToken = 'pk.eyJ1IjoiYmNsaWZ0b24iLCJhIjoicWNXT0Z6OCJ9.JvNO6GIbU8BZ-8LLSEwz2Q';
	var mapID = 'bclifton.9f0ca136';
	var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/' + mapID + '/{z}/{x}/{y}.png?access_token=' + accessToken, {
	    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
	    detectRetina: true
	});

	map = new L.Map('map', {
	    center: [39.8282, -98.5795],
	    zoom: 2
	  })
	.addLayer(mapboxTiles);


	// function highlightFeature(e) {
	//  	    var layer = e.target;

	//  	    layer.setStyle({
	//  	        weight: 5,
	//  	        color: '#666',
	//  	        dashArray: '',
	//  	        fillOpacity: 0.7
	//  	    });

	//  	    if (!L.Browser.ie && !L.Browser.opera) {
	//  	        layer.bringToFront();
	//  	    }
	//  	}

	 	// function resetHighlight(e) {
	 	//     geojson.resetStyle(e.target);
	 	// }

 	function zoomToFeature(e) {
 	    map.fitBounds(e.target.getBounds());
 	}

 	function style(feature) {
 		return {
 			fillColor: '#e6842a',
 			fillOpacity: 0.5,
 			weight: 0
 		};
 	}

 	function onEachFeature(feature, layer) {

 	    layer.on({
 	        // mouseover: highlightFeature,
 	        // mouseout: resetHighlight,
 	        click: zoomToFeature
 	    });
 	}

 	var layer = L.geoJson(districtsData, {
 		style: style,
 		onEachFeature: onEachFeature
 	}).addTo(map);


 	map.fitBounds(layer.getBounds());

 	var popup = L.popup({
 		offset: new L.Point(0, -20)
 	});

 	var popup = L.popup();

 	_.each(properties, function(item) {
 		var lat = +item.lat;
 		var lng = +item.lng;
		var marker = L.circleMarker([lat, lng], {
 			radius: 3,
 			color: '#8e6c8a',
 			opacity: 0.5,
 			weight: 0,
 			fillColor: '#8e6c8a',
 			fillOpacity: 0.5
 		}).addTo(map)
 		.on('click', function(e) {
 			popup.setLatLng(e.latlng)
 				.setContent('<img src="http://congress-home.s3.amazonaws.com/images/property/' + item.pfid + '.jpg" class="popup-img"/><br><p class="graph-description">' + item.google_address + '</p>')
 				.openOn(map);
 		});
 	});

}

exports.run = run;