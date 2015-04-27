var $ = require('jquery');
var d3 = require('d3');
var queue = require('queue-async');

function run(id) {
	console.log('support.running / id: ', id);
	load(id);
}

function load(id) {

	d3.json('assets/114_top10_oppose_industries.json', function(error, data) {
		if (error) {
			renderError();
		} else {
			opposeChart(data[id]);
		}
	});

	d3.json('assets/114_top10_support_industries.json', function(error, data) {
		if (error) {
			renderError();
		} else {
			supportChart(data[id]);
		}
	});

}

function render(data) {

}

function renderError() {
	console.log('support.renderError');
}

function supportChart (data) {
	var margin = {top: 20, right: 30, bottom: 30, left: 150};
	var width = $('#support-bar-chart').width() - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	var y = d3.scale.ordinal()
		.domain(data.map(function(d) { return d[0]; }))
	    .rangeRoundBands([0, height], 0.1);

	var x = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d[1]; })])
	    .range([0, width]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var chart = d3.select("#support-bar-chart")
		.append('svg')
		.attr('class', 'chart')
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// chart.append("g")
	//     .attr("class", "x axis")
	//     .attr("transform", "translate(0," + height + ")")
	//     .call(xAxis);

	chart.append("g")
	  	.attr("class", "y axis")
	  	.call(yAxis);

    chart.selectAll(".bar")
      	.data(data)
    	.enter()
    	.append("rect")
        .attr('class', 'bar-background')
        .attr("x", 0)
        .attr("y", function(d) { return y(d[0]); })
        .attr("width", width)
        .attr("height", y.rangeBand());

	chart.selectAll(".bar")
	  	.data(data)
		.enter()
		.append("rect")
	    .attr("class", "support-bar")
	    .attr("x", 0)
	    .attr("y", function(d) { return y(d[0]); })
	    .attr("width", function(d) { return x(d[1]); })
	    .attr("height", y.rangeBand());
}




function opposeChart (data) {
	var margin = {top: 20, right: 30, bottom: 30, left: 150};
	var width = $('#oppose-bar-chart').width() - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	var y = d3.scale.ordinal()
		.domain(data.map(function(d) { return d[0]; }))
	    .rangeRoundBands([0, height], 0.1);


	var x = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d[2]; })])
	    .range([0, width]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var chart = d3.select("#oppose-bar-chart")
		.append('svg')
		.attr('class', 'chart')
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// chart.append("g")
	//     .attr("class", "x axis")
	//     .attr("transform", "translate(0," + height + ")")
	//     .call(xAxis);

	chart.append("g")
	  	.attr("class", "y axis")
	  	.call(yAxis);

	chart.selectAll(".bar")
	  	.data(data)
		.enter()
		.append("rect")
	    .attr('class', 'bar-background')
	    .attr("x", 0)
	    .attr("y", function(d) { return y(d[0]); })
	    .attr("width", width)
	    .attr("height", y.rangeBand());

	chart.selectAll(".bar")
	  	.data(data)
		.enter()
		.append("rect")
	    .attr("class", "oppose-bar")
	    .attr("x", 0)
	    .attr("y", function(d) { return y(d[0]); })
	    .attr("width", function(d) { return x(d[2]); })
	    .attr("height", y.rangeBand());
}

exports.run = run;
