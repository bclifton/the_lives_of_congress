var _ = require('underscore');
var $ = require('jquery');
var typeahead = require('typeahead.js');
var director = require('director');

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
			components.financialassets.run(id);
			components.realestate.run(person.opensecrets_id);
		} else {
			//replace with 404 like page
			console.log('person not found');
		}
	});
}


// function filter(query) {
// 	query = query.toLowerCase();

// 	_.each(everyone, function(entry) {
// 		var name = entry.first_name + ' ' + entry.last_name;
// 		if (name.indexOf(query) > -1){
// 			console.log('fuck');
// 		}
// 	});
// }

////////////////////////////////////////////////////////////


var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
 
	// var fullName = person.first_name + ' ' + person.last_name;

 //    $.each(people, function(i, person) {
	//     if (substrRegex.test(person.state)) {
	// 	    matches.push(person.name + ' ' person.state);
	//     }
 //    });

    cb(matches);
  };
};
 
var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];
 
$('#srch-term').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'states',
  source: substringMatcher(states)
});


$('#srch-term')
	.typeahead(/* pass in your datasets and initialize the typeahead */)
	.on('typeahead:selected', onAutocompleted);


function onAutocompleted($e, datum) {
	console.log('autocompleted');
	console.log(datum, $e);

	window.location = '#yourIDhere!';
}


////////////////////////////////////////////////////////////

var routes = {
	'/': home,
	'/About': about,
    '/:id': loadPerson
};

var router = director.Router(routes);

router.init();
