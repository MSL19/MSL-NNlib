


var https = require("https");

var username = "9094fc9d9fb9254454b77bc312d0aeb4";
var password = "e6cc8925f69e0d16a6079c379e646845";
var auth = "Basic " + new Buffer(username + ':' + password).toString('base64');

var request = https.request({
    method: "GET",
    host: "api.intrinio.com",
    path: "/prices?identifier=AAPL&start_date=2018-10-19&end_date=2018-10-19&frequency=daily&sort_order=asc&page_number=1&page_size=1",
    headers: {
        "Authorization": auth
    }

}, function(response) {
    var json = "";
    response.on('data', function (chunk) {
        json += chunk;
    });
    response.on('end', function() {
        var company = JSON.parse(json);
        var openP = company.data[0].open;
        console.log(openP);
        //return openP;
    });
});
request.end();
