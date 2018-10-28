var https = require("https");

var d = new Date();
var year = d.getFullYear();
var mon = d.getMonth()+1;
var day = d.getDate();
var openP;
var company;
var pastP = [];
var hours = d.getHours()+2;
var minutes = d.getMinutes();
if(minutes<30){
    minutes = "00";
}
else{
    minutes = "30";
}
var time = hours+":"+minutes+":00";

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
    host: "www.alphavantage.co", //"api.intrinio.com",
    path: "/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=30min&apikey=4YCOZN9E28NT4HJL", 
    //"/prices?identifier=AAPL&start_date="+date+"&end_date="+date+"&frequency=daily&sort_order=asc&page_number=1&page_size=1",
   /* headers: {
        "Authorization": auth
    }*/

}, function(response) {
    var json = "";
    response.on('data', function (chunk) {
        json += chunk;
    });
    response.on('end', function() {
        company = JSON.parse(json);
        //openP = company['Time Series (30min)'][date+' '+time]['4. close'];
        console.log(company);
        //return openP;
    });
});
const express = require('express'); //create express sender object
const app = express();//create express object
const port = 3000; //set the localhost port

app.get('/', (req, res) => res.send(openP.toString())); //send the data--make sure to convert to a string

app.listen(port, () => console.log(`Listening on port ${port}!`)); //log that you are sending the data
//express 
//ejs
//do it with this URL: https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&interval=1min&apikey=4YCOZN9E28NT4HJL
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