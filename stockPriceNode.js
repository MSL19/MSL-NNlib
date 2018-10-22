var https = require("https");
var username = "9094fc9d9fb9254454b77bc312d0aeb4";
var password = "e6cc8925f69e0d16a6079c379e646845";
var auth = "Basic " + new Buffer(username + ':' + password).toString('base64');
var d = new Date();
var year = d.getFullYear();
var mon = d.getMonth()+1;
var day = d.getDate();
var dw = d.getDay();
if(dw==6){ //stocks don't trade over the weekend
day--;
}
if(dw==0){
day-=2;
}
if(day<10){
day = "0"+day;
}
var date = year+"-"+mon+"-"+day;
var request = https.request({
    method: "GET",
    host: "api.intrinio.com",
    path: "/prices?identifier=AAPL&start_date="+date+"&end_date="+date+"&frequency=daily&sort_order=asc&page_number=1&page_size=1",
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
/* //this works but for now I'm not including it while I do my stuff
const googleTrends = require('google-trends-api');
googleTrends.relatedTopics({keyword: 'Apple', startTime: new Date('2018-10-19'), endTime: new Date(Date.now())})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})*/