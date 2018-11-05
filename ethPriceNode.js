var https = require("https");
let brain; //create a NN
function predictPrice(time, priceDelta, trendsDelta){
    let inputs = [time, priceDelta, trendsDelta];//I'll need to normalize all this stuff :)
    let outputs = brain.predict(inputs);
}
var price;
var pastPrice;
var vol
var ethData;
var pastP = [];
var requestEthPrice = https.request({
    method: "GET",
    //https://api.coinmarketcap.com/v2/ticker/1027/
    host: "pro-api.coinmarketcap.com", //"api.intrinio.com",
    path: "/v1/cryptocurrency/listings/latest", 
    //"/prices?identifier=AAPL&start_date="+date+"&end_date="+date+"&frequency=daily&sort_order=asc&page_number=1&page_size=1",
    headers: {
        'X-CMC_PRO_API_KEY': '720dba1b-5c33-4371-97e5-2aa4ff539f37',
    }

}, function ethP(response) {
    var json = "";
    response.on('data', function (chunk) {
        json += chunk;
        
    });
    response.on('end', function() {
        ethData = JSON.parse(json);
        price = ethData['data'][1]['quote']['USD']['price'];

        console.log(price);
        return price;
    });
});
/*const express = require('express'); //create express sender object
const app = express();//create express object
const port = 3000; //set the localhost port

app.get('/', (req, res) => res.send(price.toString())); //send the data--make sure to convert to a string
app.listen(port, () => console.log(`Listening on port ${port}!`)); //log that you are sending the data
//express 
//ejs
//do it with this URL: https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&interval=1min&apikey=4YCOZN9E28NT4HJL
request.end();*/
requestEthPrice.end();
/* //this works but for now I'm not including it while I do my stuff
const googleTrends = require('google-trends-api');
googleTrends.relatedTopics({keyword: 'Apple', startTime: new Date('2018-10-19'), endTime: new Date(Date.now())})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})*/