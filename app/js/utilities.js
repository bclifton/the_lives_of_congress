var d3 = require('d3');

module.exports = {
	zeroPad: function (num, numZeros) {
		// Thank you: https://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
	    var n = Math.abs(num);
	    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
	    var zeroString = Math.pow(10,zeros).toString().substr(1);
	    if( num < 0 ) {
	        zeroString = '-' + zeroString;
	    }

	    return zeroString+n;
	},

	currency: d3.format('$,.0f')

};