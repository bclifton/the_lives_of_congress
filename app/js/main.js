var director = require('director');

var everyone;

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
}

function loadPerson(id) {
	getEveryone(function(data){
		var person = _.findWhere(data, {bioguide_id: id});
		if (person) {
			// console.log(person);
			
			clearPerson();

			components.map.run(id);
			components.basic.run(person);
			components.support.run(id);
			components.financialassets.run(id);
			components.realestate.run(person.first_name + ' ' + person.last_name);
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

router.init();
