// var cartodb = require('cartodb');
// var secret = require('./secret.js');

var sublayers = [];

function run(id) {
	// var id = 'N00001127';
	console.log('map.running / id: ', id);

	render(id);
}

function render(id) {
	var map = new L.Map('map', {
	    center: [39.8282, -98.5795],
	    zoom: 2
	  });

	L.mapbox.tileLayer('bclifton.9f0ca136', {
	    accessToken: 'pk.eyJ1IjoiYmNsaWZ0b24iLCJhIjoicWNXT0Z6OCJ9.JvNO6GIbU8BZ-8LLSEwz2Q',
	    attribution: ""
	  })
	  .addTo(map);

	var sublayerOptions = {
	        sql: "SELECT * FROM property_unique_carto",
	        cartocss: "#null{"+
	          "marker-fill-opacity: 0.9;"+
	          "marker-line-color: #FFF;"+
	          "marker-line-width: 1.5;"+
	          "marker-line-opacity: 0;"+
	          "marker-placement: point;"+
	          "marker-type: ellipse;"+
	          "marker-width: 6;"+
	          "marker-fill: #e6842a;"+
	          "marker-opacity: 0.75;"+
	          "marker-allow-overlap: true;"+
	        "}"
	  };

	cartodb.createLayer(map, 'http://brianclifton.cartodb.com/api/v2/viz/0aac4b22-d881-11e4-843e-0e0c41326911/viz.json')
	  .addTo(map)
	  .on('done', function(layer){
	    var sublayer = layer.getSubLayer(0);
	    sublayer.set(sublayerOptions);
	    sublayers.push(sublayer);

	    // sublayer.on('featureClick', function(e, latlng, pos, data) {
	    //   console.log('data:', data);
	    // });     
	  })
	  .on('error', function(err) {
	      console.log(err);
	  }); 

}

exports.run = run;