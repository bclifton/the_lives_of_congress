var $ = require('jquery');

module.exports = {
    on: function(content) {
        $("#tooltip")
            .html(content)
            .css("visibility", "visible")
            .css('left', (event.pageX + 20) + "px")
            .css('top', (event.pageY - 10) + "px");
    },
    off: function() {
        $("#tooltip").empty();
        $("#tooltip").css("visibility", "hidden");
    }
};