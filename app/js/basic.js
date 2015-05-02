var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');
var states = require('./states');
var util = require('./utilities');


function run(person) {
	console.log(person);

	var infoWidth = $('#info-panel').width();
	var w = (infoWidth - 147) / 2;
	$('#portrait').css('margin-left', w).css('margin-right', w);
	$('#portrait').append('<img src="img/' + person.bioguide_id + '.jpg" class="clip-ellipse">');

	var type;
	if (person.type === 'rep') {
		type = 'Representative';
	} else {
		type = 'Senator';
	}

	var year = (new Date().getYear() + 1900) - +person.first_elected;
	var title = '<span class="subhead-highlight" style="font-size: 16px;">' + type + '</span>';
	var state = '<span style="color: rgba(113, 113, 113, 0.75); font-size: 20px;">(' + states[person.state] + ')</span>';
	var firstElected = '<h5 class="subhead-highlight" style="color: rgb(51, 51, 51); font-size: 14px; margin: 10px 0 -5px;">First Elected in ' + person.first_elected + ' (' + year + ' years)</h5>';
	var fullTitle = person.first_name + ' ' + person.last_name + '<br>' + state;
	$('#legislator-name').html(title + '<br>' + fullTitle);
	$('#first-elected').html(firstElected);
	
	

	var worth_high = util.currency(person.net_high);
	var worth_low = util.currency(person.net_low);
	var estimatedWorth = util.currency((+person.net_high + +person.net_low) / 2);
	// $('#legislator-worth').append('<p class="networth">' + worth_low + ' - ' + worth_high  + '</p>');
	$('#networth').html(estimatedWorth);

	var committeesMembership = Object.keys(person.committees);
	// $('#legislator-committees').empty();
	$('#committee-chairman').empty();
	$('#committee-ranking_member').empty();
	$('#committee-exofficio').empty();
	$('#committee-member').empty();

	for (var i = 0; i < committeesMembership.length; i++) {
		var membershipStatus = util.capitalize(committeesMembership[i].replace('_', ' '));
		var membershipType = 'committee-' + committeesMembership[i];


		var target = '#committee-' + committeesMembership[i];
		console.log('target', target);
		$(target).append('<li style="float:left;"><h5>' + membershipStatus +'</h5><ul id="sub-' + membershipType + '"></ul></li>');
		var membership = committeesMembership[i];
		_.each(person.committees[committeesMembership[i]], function(item) {
			$('#sub-' + membershipType + '').append('<li class="committee-name">' + item +'</li>');
		});
	}

	
	

	// $('#info-panel').text(person.name);
}

exports.run = run;