// i need to talk to haynes about normalizing the price and the volume 
//google trends data should already be normalized
const matrix = require('./matrix');
const nn = require("./nn");
let brain  = new nn(3,3,2); //create a NN
let PC;
let newPC;
let avgCorrect = 0;
let numTotal = 0;
let previousInputs = [0.5,0.5,0.5];
//currents
let bigString = {};
var previousPrice = 200;
var previousVolume = 103099469.5616;
var previousIntrest = 0.5; 
//previous
let currentPrice;
let currentVolume;
let currentIntrest = 50;
//deltas
let deltaPrice;
let deltaVolume;
let deltaInterest;
//normals
let normalizedPriceIndex;
let normalizedVolumeIndex;
let normalizedInterest;
async function updateNN(){
    predictPrice();
    
    

}      

async function predictPrice(){
    numTotal++;
    bigString = {};
    bigString["totalRuns"] = numTotal;
    currentPrice = await getEthPrice();
    currentVolume = await getEthVol();
    currentIntrest = await getGoogTrendsData();
    console.log(currentPrice);
    console.log(currentVolume);
    console.log(currentIntrest);
    bigString["currentPrice"] = currentPrice;
    bigString["currentVolume"] = currentVolume;
    bigString["currentIntrest"] =  currentIntrest;
    let priceDelta = (currentPrice-previousPrice)/previousPrice;
    console.log("Price delta percent: "+priceDelta);
    bigString["priceDelta"] = priceDelta;
    normalizedPriceIndex = 0.5 +(priceDelta*10);//the price delta will be neg already so no nead to like try and add or subtract
    let volumeDelta = (currentVolume-previousVolume)/previousVolume;
    normalizedVolumeIndex = 0.5 + volumeDelta*20;
    normalizedInterest = currentIntrest/100;

    let inputs = [normalizedPriceIndex,normalizedVolumeIndex,normalizedInterest];
    console.log(inputs);
    bigString["inputs"] = inputs;
    let outputs = brain.predict(inputs);
    bigString["outputs"]  = outputs;
    console.log(outputs);
    if(outputs[0]>outputs[1]){ //[0,1] = the price will go down
        newPC = 0; 
        console.log("Price Will go up");
        bigString['prediction'] = "Price Will go up";
    }
    else{
        newPC = 1;
        console.log("Price Will go down");
        bigString['prediction'] = "Price Will go down";

    }

        if(PC == 0){
        if(previousPrice>currentPrice){ //no gradiant here
            //maybe feedback the difference between the normalized pricce deltas and the expected price delta
            console.log("Price was supposed to go up------Price went down---------------");
            actualPriceChangeArr = [0,1];
            bigString["printStatement"] ="Price was supposed to go up------Price went down---------------" + "\n" +"\n";
        }
    
        else{
            console.log("Price was supposed to go up-------price went up------------------");
            actualPriceChangeArr = [1,0];
            avgCorrect++;
            
            bigString["printStatement"] = "Price was supposed to go up------Price went up---------------" + "\n" +"\n";
        }
        }
        else{
            if(previousPrice<currentPrice){ 
                //maybe feedback the difference between the normalized pricce deltas and the expected price delta
                actualPriceChangeArr = [0,1];
                console.log("price was supposed to go down--------price went up------------------");
                
                bigString["printStatement"] = "Price was supposed to go down------Price went up---------------" + "\n" +"\n";
            }
            else{
                console.log("price was supposed to go down----------Price went down---------------");
                avgCorrect++;
                bigString["printStatement"] = "Price was supposed to go down------Price went down---------------" + "\n" +"\n";
                actualPriceChangeArr = [1,0];
            }  
        }
        //here is where i need to normalize my data
      /*  currentPrice = await getEthPrice();
        currentVolume = await getEthVol();
        currentIntrest = await getGoogTrendsData();*/
        //let priceDelta = (currentPrice-previousPrice)/previousPrice;
    /*    if(priceDelta<0){
            normalizedPriceIndex = 0.5 - (priceDelta/2);
        }
        else{
            normalizedPriceIndex = 0.5 + (priceDelta/2);
        }
      //  let volumeDelta = (currentVolume-previousVolume)/previousVolume;
        if(volumeDelta<0){
            normalizedVolumeIndex = 0.5 - (volumeDelta/2);
        }
        else{
            normalizedVolumeIndex = 0.5 + (volumeDelta/2);
        }
        normalizedInterest = currentIntrest/100;
    */
    //    let inputs = [normalizedPriceIndex,normalizedVolumeIndex,normalizedInterest];
    
        brain.train(previousInputs, actualPriceChangeArr);
        previousPrice = currentPrice;
        previousVolume = currentVolume;
        previousIntrest = currentIntrest;
        PC = newPC;
        bigString["IHW"] = brain.getWeightsIH();
        bigString["numCorrect"] = avgCorrect;
        previousInputs = inputs;
        console.log("\n");
       
        
    
}
//Google TRends data
const googleTrends = require('google-trends-api');
var d = new Date();
var year = d.getFullYear();
var mon = d.getMonth()+1;
var day = d.getDate();
var dw = d.getDay();
var jsonData;
if(day<10){
day = "0"+day;
}

async function printData(){
  var interest = await getGoogTrendsData();
  console.log(interest);
}
function getGoogTrendsData(){
return new Promise (function(resolve, reject){
googleTrends.interestOverTime({keyword: 'ethereum', catagory: 1179, startTime: new Date(Date.now() - (24 * 60 * 60 * 1000)), granularTimeResolution: true, geo: 'US'})
.then((res) => {
  jsonData = JSON.parse(res); //stopped here
  resolve(jsonData['default']['timelineData'][0]['value']);
})
.catch((err) => {
  console.log(err);
})
});
}
//end google trends

var https = require("https");

                                                       


setInterval(updateNN, 5000);
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
      //  price = ethData['data'][1]['quote']['USD']['price']; //lol this method sucks if the market cap switches w/ another crypto currency
        var propperPrice = ethData['data'].filter((el) => el.name === "Ethereum")[0]['quote']['USD']['price'];//['quote']['USD']['price'];
    //    console.log("Maga"+propperPrice);
       // vol = ethData['data'][1]['total_supply'];
      //  console.log(ethData);
 //       console.log(price);
        resolve(propperPrice);
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
        ///price = ethData['data'][1]['quote']['USD']['price'];
       // vol = ethData['data'][1]['total_supply']; //this method sucks
 //      //  console.log(ethData);
 //       console.log(price);
        var propperVol = ethData['data'].filter((el) => el.name === "Ethereum")[0]['total_supply'];
      //  console.log("maga"+propperVol);
        resolve(propperVol);
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
const express = require('express'); //create express sender object
const app = express();//create express object
const port = 3030; //set the localhost port
app.get('/', (req, res) => res.json(bigString)); //send the data--make sure to convert to a string
app.listen(port, () => console.log(`Listening on port ${port}!`)); //log that you are sending the data

/* //this works but for now I'm not including it while I do my stuff
const googleTrends = require('google-trends-api');
googleTrends.relatedTopics({keyword: 'Apple', startTime: new Date('2018-10-19'), endTime: new Date(Date.now())})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})*/