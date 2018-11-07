//lol i need to talk to haynes about normalizing the price and the volume 
//google trends data should already be normalized
var https = require("https");

const myModule = require('./matrix');
const nn = require("./nn");
let brain;
brain  = new nn(3,3,3); //create a NN
function predictPrice(vol, priceDelta, googtrends){
    let inputs = [vol, priceDelta, googTrends];//I'll need to normalize all this stuff :)
    let outputs = brain.predict(inputs);
}
async function getPrice(){
    var ethP = await getEthPrice();
    var ethV = await getEthVol();
    console.log(ethP);
    console.log(ethV);
    

}

setInterval(getPrice, 7000);
//getPrice();
var price;
var pastPrice;
var vol
var ethData;
var pastP = [];
function getEthPrice(){
    return new Promise(function(resolve, reject){
    var requestEthPrice =  https.request({ 
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
  //  console.log(response);
    response.on('end', function() {
        ethData = JSON.parse(json);
        price = ethData['data'][1]['quote']['USD']['price'];
        vol = ethData['data'][1]['total_supply'];
      //  console.log(ethData);
 //       console.log(price);
        resolve(price);
    });
});
requestEthPrice.end();
    });
}
function getEthVol(){
    return new Promise(function(resolve, reject){
    var requestEthPrice =  https.request({ 
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
  //  console.log(response);
    response.on('end', function() {
        ethData = JSON.parse(json);
        price = ethData['data'][1]['quote']['USD']['price'];
        vol = ethData['data'][1]['total_supply'];
      //  console.log(ethData);
 //       console.log(price);
        resolve(vol);
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
    });
}
/* //this works but for now I'm not including it while I do my stuff
const googleTrends = require('google-trends-api');
googleTrends.relatedTopics({keyword: 'Apple', startTime: new Date('2018-10-19'), endTime: new Date(Date.now())})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})*/