var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');
var queue = require('queue-async');

var currency = d3.format('$,.0f');

function run(id) {
	console.log('financialAssets.running / id: ', id);
	load(id);
}

function load(id) {
	d3.json('assets/N00027694_asset_totals.json', function(error, d) {
		if (error) {
			renderError();
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
	
	$('#assets-bar-chart-title').append(' ' + currency(total));
	var margin = {top: 10, right: 30, bottom: 30, left: 150};
	var width = $('#assets-bar-chart').width() - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

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

	var chart = d3.select("#assets-bar-chart")
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

	chart.selectAll('.bar')
	  	.data(data)
		.enter()
		.append('rect')
	    .attr('class', 'bar')
	    .attr('x', function(d) { return 0; })
	    .attr('y', function(d) { return y(d.sector); })
	    .attr('width', function(d) { return x(d.percent); })
	    .attr('height', y.rangeBand())
	    .append("text")
	    .attr("x", function(d) { return x(d.percent) + 5; })
	    .attr("y", function(d) { return y(d.sector) / 2; })
	    .attr("dy", ".35em")
	    .text(function(d) { return d.percent; });
}

function renderError() {
	console.log('support.renderError');
}

exports.run = run;
