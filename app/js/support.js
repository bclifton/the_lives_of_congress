var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');
var Handlebars = require('handlebars');
var queue = require('queue-async');

var tooltip = require('./tooltip');

var legID;

function run(id) {
	console.log('support.running / id: ', id);
	load(id);
}

function load(id) {

	legID = id;
	queue()
		.defer(d3.csv, 'assets/crp_categories_sector-industries1.csv')
		.defer(d3.json, 'assets/114_legislator_sector_support.json')
		.await(render);

	// d3.csv('assets/crp_categories_sector-industries.csv', function(error, data) {
	// 	comboChart(data);
	// });


	// d3.json('assets/114_top10_oppose_industries.json', function(error, data) {
	// 	if (error) {
	// 		renderError();
	// 	} else {
	// 		opposeChart(data[id]);
	// 	}
	// });

	// d3.json('assets/114_top10_support_industries.json', function(error, data) {
	// 	if (error) {
	// 		renderError();
	// 	} else {
	// 		supportChart(data[id]);
	// 	}
	// });

}

function render(error, categories, data) {
	if (error) {
		renderError(error);
	} else {
		var d = [];
		_.each(data[legID], function(value, key) {
			var t = {};
			t[key] = value;
			d.push(t);
		});

		var c = {};
		_.each(categories, function(entry) {
			if (_.has(c, entry.sector)) {
				c[entry.sector] += 1;
			} else {
				c[entry.sector] = 1;	
			}
			
		});
		var c2 = [];
		_.each(c, function(value, key) {
			var t = {};
			t[key] = value;
			c2.push(t);
		});

		comboChart(categories, d, c2);
	}
}

function renderError(error) {
	var template_source = d3.select("#error-template").html();
	var property_template = Handlebars.compile(template_source);
	var data = {'errorMessage':'There are no known Industry Support.'};
	var html = property_template(data);
	// $('#realestate-description p').empty();
	d3.select('#outsider-support-graphics').html(html);
}


function comboChart(categories, data, catNames) {
	// console.log(catNames);
	// console.log(data);

	var graphic_template_source = d3.select('#support-template').html();
	var graphic_template = Handlebars.compile(graphic_template_source);
	d3.select('#outsider-support-graphics').html(graphic_template());



	var total = catNames.reduce(function(previousValue, currentValue, i) {
		if (i === 1) {
			return d3.values(previousValue)[0] + d3.values(currentValue)[0];
		} else {
			return previousValue + d3.values(currentValue)[0];
		}
	});

	var opposeMax = d3.max(data, function(d) { return d3.values(d)[0].oppose; });
	var supportMax = d3.max(data, function(d) { return d3.values(d)[0].support; });

	var max;
	if (supportMax >= opposeMax) {
		max = supportMax;
	} else {
		max = opposeMax;
	}
	// console.log(max, supportMax, opposeMax);


	var margin = {top: 20, right: 20, bottom: 70, left: 40};
	var width = $('#support-bar-chart').width() - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;
	var rangePadding = 0.1;


	var x = d3.scale.ordinal()
		.domain(categories.map(function(d) { return d.industry; }))
	    .rangeBands([0, width], rangePadding + 0.002, 0);

	var y = d3.scale.linear()
		.domain([-max, max])
	    .range([height, 0]);

	var h = d3.scale.linear()
		.domain([0, max])
		.range([0, height/2]);


	var x2 = d3.scale.ordinal()
		.domain(categories.map(function(d) { 
			return d.sector; 
		}))
		.rangeBands([0, width], rangePadding, 0);

	var xAxis = d3.svg.axis()
	    .scale(x2)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickPadding(2);

	var chart = d3.select("#support-bar-chart")
		.append('svg')
		.attr('class', 'chart')
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")  
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	chart.append("g")
	  	.attr("class", "y axis")
	  	.call(yAxis);



	// chart.append("text")
	//     .attr("class", "y label-support")
	//     .attr("text-anchor", "start")
	//     .attr("y", 6)
	//     .attr('x', 10)
	//     .attr("dy", ".75em")
	//     .text("Number of Supporting Organizations");

	// chart.append("text")
	//     .attr("class", "y label-oppose")
	//     .attr("text-anchor", "start")
	//     .attr("y", height - 10)
	//     .attr('x', 10)
	//     .attr("dy", ".75em")
	//     .text("Number of Opposing Organizations");


	var previous;
	for (var i = 0; i < catNames.length; i++) {
		// var xPos = x.range()[0];
		var xPos = x.range()[0] + rangePadding;
		if (i !== 0) { xPos = previous; }

		// console.log(x.rangeBand(), width);
		var padding = x.rangeBand() * rangePadding;
		var step = x.rangeBand() + padding;

		var categoryLength = d3.values(catNames[i])[0];
		var barWidth = categoryLength * step;

		// console.log('[rect]', 'xpos', xPos, 'categoryLength', categoryLength, 'barWidth', barWidth);

		chart.append('rect')
			.attr('class', 'bar-background')
			.style('stroke', 'white')
			.attr('x', xPos)
			.attr('y', 0)
			.attr('width', barWidth)
			.attr('height', height);

		// for (var j = -max; j <= max; j += 20) {
		// 	chart.append('line')
		// 		.attr('class', function() {
		// 			if (j === 0) {
		// 				return 'zero-line';
		// 			} else {
		// 				return 'h-line';
		// 			}
		// 		})
		// 		.attr('x1', xPos)
		// 		.attr('y1', y(j))
		// 		.attr('x2', barWidth + xPos)
		// 		.attr('y2', y(j));
		// }

		var xLabelPadding = 10;

		chart.append('text')
			.attr('class', 'x-axis-label') 
			.attr('x', barWidth/2 + xPos) 
			.attr('y', function() {
				if (i === 0) { return height + xLabelPadding; }
				if (i === 1) { return height + xLabelPadding + 25; }
				if (i === 2) { return height + xLabelPadding; } 
				if (i === 3) { return height + xLabelPadding + 12.5; }
				if (i === 4) { return height + xLabelPadding + 25; }
				if (i === 5) { return height + xLabelPadding + 12.5; }
				if (i === 7) { return height + xLabelPadding;}
				if (i === 11) { return height + xLabelPadding;}
				else if (i % 2 === 0) { return height + xLabelPadding; } 
				else if (i % 3 === 0) { return height + xLabelPadding + 12.5;} 
				else { return height + xLabelPadding + 25; }
			})
			.attr('dy', '.35em')
			.text(function() {
				return d3.keys(catNames[i]);
			});

		var xLinePadding = 5;
		chart.append('line')
			.attr('class', 'x-axis-tick')
			.attr('x1', barWidth/2 + xPos)
			.attr('y1', height)
			.attr('x2', barWidth/2 + xPos)
			.attr('y2', function() {
				if (i === 0) { return height + xLinePadding; }
				if (i === 1) { return height + xLinePadding + 25; }
				if (i === 2) { return height + xLinePadding; } 
				if (i === 3) { return height + xLinePadding + 12.5; }
				if (i === 4) { return height + xLinePadding + 25; }
				if (i === 5) { return height + xLinePadding + 12.5; }
				if (i === 7) { return height + xLinePadding;}
				if (i === 11) { return height + xLinePadding;}
				else if (i % 2 === 0) { return height + xLinePadding; } 
				else if (i % 3 === 0) { return height + xLinePadding + 12.5;} 
				else { return height + xLinePadding + 25; }
			});

		previous = barWidth + padding + xPos;
	}

    // chart.selectAll('.bar')
    // 	.data(catNames)
    // 	.enter()
    // 	.append('rect')
    // 	.attr('class', 'bar-background')
    // 	.style('stroke', 'white')
    // 	.attr('x', function(d) {
    // 		var t = d3.values(d)[0] * x.rangeBand();
    // 		console.log('t', t, width);
    // 		return t;
    // 		// console.log('default', x2(d3.keys(d)[0]), 'target', d3.values(d)[0] * x.rangeBand());
    // 		// return x2(d3.keys(d)[0]);
    // 	})
    // 	.attr('y', 0)
    // 	.attr('width', function(d) {
    // 		// var v = d3.values(d)[0];
    // 		// console.log(v);
    // 		return d3.values(d)[0] * x.rangeBand();
    // 	})
    // 	.attr('height', height);

	var bar = chart.selectAll(".bar")
	  	.data(data)
		.enter();

	// bar.append('rect')
	// 	.attr('class', 'bar-background')
	// 	.attr('x', function(d) {
	// 		// console.log(d3.keys(d)[0]);
	// 		return x(d3.keys(d)[0]);
	// 	})
	// 	.attr('y', 0)
	// 	.attr('width', x.rangeBand())
	// 	.attr('height', height);

	bar.append("rect")
        .attr('class', 'oppose-bar')
        .attr("x", function(d) { 
        	return x(d3.keys(d)[0]); 
        })
        .attr("y", function(d) {
        	return height/2;
        })
        .attr('width', function(d) {
        	return x.rangeBand();
        })
        .attr('height', function(d) {
        	return h(d3.values(d)[0].oppose);
        })
        .on('mouseover', function(d) {
        	showTooltipOppose(d);
        })
        .on('mousemove', function(d) {
        	showTooltipOppose(d);
        })
        .on('mouseout', function() {
        	tooltip.off();
        });

    bar.append("rect")
        .attr('class', 'support-bar')
        .attr("x", function(d) { 
        	return x(d3.keys(d)[0]); 
        })
        .attr("y", function(d) {
        	return y(d3.values(d)[0].support);
        })
        .attr('width', function(d) {
        	return x.rangeBand();
        })
        .attr('height', function(d) {
        	return height/2 - y(d3.values(d)[0].support);
        })
        .on('mouseover', function(d) {
        	showTooltipSupport(d);
        })
        .on('mousemove', function(d) {
        	showTooltipSupport(d);
        })
        .on('mouseout', function() {
        	tooltip.off();
        });

}

function showTooltipOppose(data) {
	var key = d3.keys(data)[0]
	var val = d3.values(data)[0].oppose;

	var content = '<p><strong>' + key + '</strong> organizations opposed bills ' + val + ' times</p>';
	tooltip.on(content);
}

function showTooltipSupport(data) {
	var key = d3.keys(data)[0]
	var val = d3.values(data)[0].support;

	var content = '<p><strong>' + key + '</strong> organizations supported bills ' + val + ' times</p>';
	tooltip.on(content);
}


exports.run = run;
