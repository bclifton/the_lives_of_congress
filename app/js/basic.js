var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');
var states = require('./states');


var currency = d3.format('$,.0f');

function capitalize(string) {
 	// Thank you: https://stackoverflow.com/users/2359289/nicol%C3%B2
    return string.replace(/^./, capitalize.call.bind("".toUpperCase));
}

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
	var state = '<span style="color: rgb(51, 51, 51); font-size: 20px;">(' + states[person.state] + ')</span>';
	var firstElected = '<br><span style="color: rgb(51, 51, 51); font-size: 14px;">First Elected in ' + person.first_elected + ' (' + year + ' years)</span>';
	var fullTitle = person.first_name + ' ' + person.last_name + '<br>' + state;
	$('#legislator-name').html(title + '<br>' + fullTitle + firstElected);
	

	var worth_high = currency(person.net_high);
	var worth_low = currency(person.net_low);
	var estimatedWorth = currency((+person.net_high + +person.net_low) / 2);
	// $('#legislator-worth').append('<p class="networth">' + worth_low + ' - ' + worth_high  + '</p>');
	$('#networth').html(estimatedWorth);

	var committeesMembership = Object.keys(person.committees);
	$('#legislator-committees').empty();
	for (var i = 0; i < committeesMembership.length; i++) {
		var membershipStatus = capitalize(committeesMembership[i].replace('_', ' '));
		var membershipType = 'committee-membership-' + committeesMembership[i];
		$('#legislator-committees').append('<li style="float:left;"><h5>' + membershipStatus +'</h5><ul id="' + membershipType + '"></ul></li>');
		var membership = committeesMembership[i];
		_.each(person.committees[committeesMembership[i]], function(item) {
			$('#' + membershipType + '').append('<li class="committee-name">' + item +'</li>');
		});
	}

	
	

	// $('#info-panel').text(person.name);
}

exports.run = run;