var _ = require('underscore');
var $ = require('jquery');
var typeahead = require('typeahead.js');
var director = require('director');
var Handlebars = require('handlebars');
var states = require('./states');

var everyone;

$('#openBtn').click(function(){

	$('#myModal').modal({show:true});
});

var components = {
	map: require('./map'),
	realestate: require('./realestate'),
	support: require('./support'),
	financialassets: require('./financialAssets'),
	basic: require('./basic')
};


function getEveryone(cb) {
	if (!everyone) {
		d3.json('assets/legislator-current_info.json', function(error, data) {
			everyone = data;
			cb(everyone);
		});
	} else {
		cb(everyone);
	}
}

function home() {
	clearPerson();
	console.log('home');
}

function about() {
	clearPerson();
	console.log('about');
}

function clearPerson() {
	$('#properties-wrapper').empty();
	$('#support-bar-chart').empty();
	$('#oppose-bar-chart').empty();
	$('#assets-bar-chart').empty();
	$('#assets-bar-chart-title').empty();
	$('#portrait').empty();
	$('#map').html();
}

function loadPerson(id) {
	getEveryone(function(data){
		var person = _.findWhere(data, {bioguide_id: id});
		if (person) {
			console.log(person);
			clearPerson();

			components.map.run(person);
			components.basic.run(person);
			components.support.run(id);
			components.financialassets.run(person.opensecrets_id);
			components.realestate.run(person.opensecrets_id);
		} else {
			//replace with 404 like page
			console.log('person not found');
		}
	});
}



var routes = {
	'/': home,
	'/About': about,
    '/:id': loadPerson
};

var router = director.Router(routes);


////////////////////////////////////////////////////////////


var matcher = function(everyone) {
  return function findMatches(q, cb) {
    var matches, substrRegex;
    matches = [];
    substrRegex = new RegExp(q, 'i');
 
    

    $.each(everyone, function(i, person) {
    	var state = states[person.state];
    	person.statename = state;
	    if (substrRegex.test(state) || substrRegex.test(person.first_name) || substrRegex.test(person.last_name)) {
	        matches.push(person);
	    }
    });

    cb(matches);
  };
};
 

getEveryone(function() {

	$('#srch-term').typeahead({
	    hint: true,
	    highlight: false,
	    minLength: 1
	},
	{
	    name: 'congress',
	    source: matcher(everyone),
	    limit: 600,
	    display: function(obj) {
	      // console.log(obj)
	      return obj.first_name + ' ' + obj.last_name + ' (' + states[obj.state] + ')';
	    },
	    templates: {
		    empty: [
		      '<div class="empty-message">',
		        'No Results',
		      '</div>'
		    ].join('\n'),
		    suggestion: Handlebars.compile('<div>{{first_name}} {{last_name}} ({{statename}})</div>')
		}
	}).on('typeahead:selected', onAutocompleted);

	router.init();

});
 

function onAutocompleted($e, person) {
	window.location = '#/' + person.bioguide_id;
}





