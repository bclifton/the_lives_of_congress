var d3 = require('d3');
var Handlebars = require('handlebars');

var states = require('./states');

var people_assets = {};


function run(id) {
	console.log('realestate.running / id: ', id);
	load(id);
}

function load(id) {
	d3.csv('assets/property_with_income.csv', function(error, data){
		if (error) {
			renderError();
		} else {
			render(data, id);
		}
	});
}

function render(data, id) {

  data = data.map(function(d){
    // d.fullname = d.full_name;
    d.fullname = clean_name(d.name);
    d.address = extract_address(d.google_address);
    return d;
  });

  data = data.sort(sorters.alpha);

  data.forEach(function(d){
    if (people_assets[d.name]){
      people_assets[d.name] ++;
    } else {
      people_assets[d.name] = 1;
    }
  });

  data = {items: data};


  var template_source = d3.select("#property-template").html();
  var property_template = Handlebars.compile(template_source);

  var html = property_template(data);
  d3.select('#properties-wrapper').html(html);
  d3.selectAll('.property')
    .data(data.items)
    .on('click', function(d){
      var me = d3.select(this);
      var embed_url = d.streetview_embed;
      var img = me.select('.main-image');
      var h = me.select('.inner').node().getBoundingClientRect().height;

      var iframe = me.select('.inner')
        .append('iframe')
        .attr('src', embed_url)
        .attr('width', '100%')
        .attr('height', h)
        .attr('frameborder', '0')
        .style('display', 'none');

      iframe.on('load', function(){
        iframe.style('display', 'block');
        img.remove();
      });

      me.on('click', null);

    });

  // d3.select('select[name="sort"]').on('change', function(){
  //   d3.selectAll('.property').sort(sorters[this.value]);
  // });

  // d3.select('.click-filter').on('click', function(d){
  //   d3.event.preventDefault();
  //   var q = d3.select(this).attr('data-q');
  //   var i = document.getElementById('search');
  //   i.value = q;
  //   filter_people(q);
  // });




  // d3.select('input[name="search"]').on('keyup', function(){
  //   filter_people(this.value);
  // });

	filter_people(id);


  function filter_people(id) {

    q = id.toLowerCase();

    if (q.length < 1) {
      LayerActions.all();
    }    
    
    var pfids = {};

    d3.selectAll('.property').each(function(d){
      var name = d.fullname.toLowerCase();
      var city = d.address.city ? d.address.city.toLowerCase() : null;
      var state = d.address.fullstate ? d.address.fullstate.toLowerCase() : null;

      if (name.indexOf(q) > -1 || (city && city.indexOf(q) > -1) || (state && state.indexOf(q) > -1)) {
        pfids[d.pfid.toUpperCase()] = null;
        this.style.display = 'block';
      } else {
        this.style.display = 'none';
      }
    });

    // if (q.length >= 1) {
    //   LayerActions.selection(Object.keys(pfids));
    // }    
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clean_name(name) {
  var parts = name.split(', ');
  return parts[1] + ' ' + parts[0];
}

function extract_address(address) {
  address = address.split(', ');
  var street = address[0];
  var city = address[1] ? address[1] : null;
  var state = address[2] ? address[2].slice(0, 2) : null;
  var fullstate = state && states[state] ? states[state] : null;

  return {
    street: street,
    city: city,
    state: state,
    fullstate: fullstate
  };
}

var sorters = {
  alpha: function(a, b){
    return a.name >= b.name ? 1 : -1;
  },
  quantity: function(a, b){
    var asset_count = people_assets[b.name] - people_assets[a.name];
    if (asset_count !== 0) {
      return asset_count;
    } else {
      return a.name >= b.name ? 1 : -1;
    }
  },
  income: function(a, b){
    var value_diff = b.min_income - a.min_income;
    if (value_diff !== 0) {
      return value_diff;
    } else {
      return a.name >= b.name ? 1 : -1;
    }
  },
  incomeAsc: function(a, b){
    var value_diff = a.min_income - b.min_income;
    if (value_diff !== 0) {
      return value_diff;
    } else {
      return a.name >= b.name ? 1 : -1;
    }
  },
  value: function(a, b){
    var value_diff = b.min_value - a.min_value;
    if (value_diff !== 0) {
      return value_diff;
    } else {
      return a.name >= b.name ? 1 : -1;
    }
  },
  valueAsc: function(a, b){
    var value_diff = a.min_value - b.min_value;
    if (value_diff !== 0) {
      return value_diff;
    } else {
      return a.name >= b.name ? 1 : -1;
    }
  }
};


Handlebars.registerHelper('display_value', function(minv, maxv){
  if (!minv || !maxv) {
    return 'unknown';
  }
  minv = +minv;
  maxv = +maxv;
  if (minv === maxv){
    if (minv === 0) {
      return '$0.0';
    } else {
      return 'Over $' + numberWithCommas(minv-1);
    }
  } else {
    if (minv > 0) minv--;
    return '$' + numberWithCommas(minv) + ' to $' + numberWithCommas(maxv);
  }
});


function renderError() {
	console.log('support.renderError');
}

exports.run = run;
