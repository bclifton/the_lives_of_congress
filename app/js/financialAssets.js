var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');
var Handlebars = require('handlebars');

var queue = require('queue-async');

var util = require('./utilities');
var tooltip = require('./tooltip');

function run(cid) {
	console.log('financialAssets.running / cid: ', cid);
	load(cid);
}

function load(cid) {
	d3.json('assets/financialassets/' + cid + '_asset_totals.json', function(error, d) {
		if (error) {
			console.log('error');
			renderError(error);
		} else {

			total = 0;
			data = [];
			_.each(d, function(value, key) {
				if (key === 'total_amount_invested') {
					total = value;
				} else {
					temp = {};
					temp.sector = key;
					temp.money = value.money;
					temp.percent = value.percent;
					data.push(temp);
				}
			});

		    render(data, total);
			
		}
	});

}

function render(data, total) {
	
	$('#investments-barchart-title').empty().append(' ' + util.currency(total));

	var graphic_template_source = d3.select('#investments-template').html();
	var graphic_template = Handlebars.compile(graphic_template_source);
	d3.select('#investments-graphics').html(graphic_template());


	var margin = {top: 10, right: 20, bottom: 30, left: 150};
	var width = $('#investments-barchart').width() - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	var sorted = _.last(_.sortBy(data, 'money'), 3);

	var y = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.sector; }))
	    .rangeRoundBands([0, height], 0.1);

	var x = d3.scale.linear()
		.domain([0, 100])
	    .range([0, width]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient('bottom')
	    .tickFormat(function(d) { return d + "%"; });

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient('left');

	var chart = d3.select("#investments-barchart")
		.append('svg')
		.attr('class', 'chart')
	    .attr('width', width + margin.left + margin.right)
	    .attr('height', height + margin.top + margin.bottom)
	  .append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	chart.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis);

	chart.append('g')
	  	.attr('class', 'y axis')
	  	.call(yAxis);

	chart.selectAll('.bar')
	  	.data(data)
		.enter()
		.append('rect')
		.attr('class', 'bar-background')
		.attr('x', function(d) { return 0; })
		.attr('y', function(d) { return y(d.sector); })
		.attr('width', width)
		.attr('height', y.rangeBand());

	
	var bar = chart.selectAll('.bar')
	  	.data(data)
		.enter();

	bar.append('rect')
	    .attr('class', 'bar')
	    .attr('x', function(d) { return 0; })
	    .attr('y', function(d) { return y(d.sector); })
	    .attr('width', function(d) { return x(d.percent); })
	    .attr('height', y.rangeBand())
	    .on('mouseover', function(d) {
	    	showTooltip(d);
	    })
	    .on('mousemove', function(d) {
	    	showTooltip(d);
	    })
	    .on('mouseout', function() {
	    	tooltip.off();
	    });
	
	bar.append("text")
	    .attr("x", function(d) { return x(d.percent) + 5; })
	    .attr("y", function(d) { return y(d.sector) + y.rangeBand()/2; })
	    .attr("dy", ".35em")
	    .text(function(d) {
	    	var r = _.find(sorted, function(i) {
				return i.sector === d.sector;
	    	});

	    	if (r !== undefined) {
	    		return util.currency(r.money);
	    	} else {
	    		return '';
	    	}
	    });
}

function renderError(error) {
	$('#investments-barchart-title').empty();
	var template_source = d3.select("#error-template").html();
	var property_template = Handlebars.compile(template_source);
	var data = {'errorMessage':'There are no known Stock or Mutual Fund assets.'};
	var html = property_template(data);
	$('#investments-description p ').empty();
	d3.select('#investments-graphics').html(html);

}


function showTooltip(data) {
	var title = data.sector;
	var money = util.currency(data.money);
	var percent = util.percent(data.percent);
	var content = '<p><strong>' + title + '</strong>: ' + money + ' (' + percent + '%)</p>';
	tooltip.on(content);
}

exports.run = run;
