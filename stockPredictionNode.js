var https = require("https");

let d;
var company;
let marketOpen;
var pastP = [];
let date;
let time;
let lastRef;
let year;
let mon;
let day;
let minutes;
let minutesT;
let lastDBTime;
function updateTime(){
    d = new Date();
    year = d.getFullYear();
    mon = d.getMonth()+1;
    day = d.getDate();
    hours = d.getHours(); //for the kdsatp server i don't need to subtract 2
    minutes = d.getMinutes();
/*(minutes<0){
    hours--;
}*/
if(minutes<30){
     minutesT = "00";
}
else{
     minutesT = "30";
}
time = hours+":"+minutesT+":00";

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
date = year+"-"+mon+"-"+day;
}
function getStockPrice(){
return new Promise(function(resolve, reject){
var request = https.request({
    method: "GET",
    host: "www.alphavantage.co", //"api.intrinio.com",
    path: "/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=30min&apikey=4YCOZN9E28NT4HJL", 
    

}, function(response) {
    var json = "";
    response.on('data', function (chunk) {
        json += chunk;
    });
    response.on('end', function() {
        company = JSON.parse(json);
        //console.log(company);
        
        
        updateTime();
        let timeStr = date+' '+time;
        lastRef = company['Meta Data']['3. Last Refreshed'];
        console.log(lastRef);
      
           let openP = company['Time Series (30min)'][timeStr]['4. close']; //[date+' '+time]['4. close'];
         
      
        resolve(openP);
        //return openP;
    });
});
request.end();
});
}
function dataBaseCheck(){
    return new Promise(function(resolve, reject){
    var request = https.request({
        method: "GET",
        host: "www.alphavantage.co", //"api.intrinio.com",
        path: "/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=30min&apikey=4YCOZN9E28NT4HJL", 
        
    
    }, function(response) {
        var json = "";
        response.on('data', function (chunk) {
            json += chunk;
        });
        response.on('end', function() {
            company = JSON.parse(json);
            console.log(company);
            let SMupdateBool; 
           
            
            lastRef = company['Meta Data']['3. Last Refreshed'];
            console.log(lastRef);
            if(lastRef !== lastDBTime){
                SMupdateBool = true;
                lastDBTime = lastRef;
            }
            else{
                SMupdateBool = false;
            }
            
           
            resolve(SMupdateBool);
            //return openP;
        });
    });
    request.end();
    });
    }
    
function getStockVolume(){
    return new Promise(function(resolve, reject){
    var request = https.request({
        method: "GET",
        host: "www.alphavantage.co", //"api.intrinio.com",
        path: "/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=30min&apikey=4YCOZN9E28NT4HJL", 
     
    }, function(response) {
        var json = "";
        response.on('data', function (chunk) {
            json += chunk;
        });
        response.on('end', function() {
            company = JSON.parse(json);
            console.log(company);
            let volume;
            updateTime();
            let timeStr = date+' '+time;
            console.log(timeStr);
            lastRef = company['Meta Data']['3. Last Refreshed'];
            console.log(lastRef);
          //  console.log(company);
           
                volume = company['Time Series (30min)'][timeStr]['5. volume']; //[date+' '+time]['4. close'];
            
            
            resolve(volume);
        });
    });
    request.end();
    });
    }


setInterval(predictPrice, 60000);
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
var previousPrice = 171.0475;
var previousVolume = 1544998;
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
    let DBup = await dataBaseCheck();
    if(DBup){
    numTotal++;
    bigString = {};
    bigString["totalRuns"] = numTotal;

    currentPrice = await getStockPrice();
    currentVolume = await getStockVolume();
    currentIntrest = await getGoogTrendsData();
   
    console.log(currentPrice);
    console.log(currentVolume);
    console.log(currentIntrest);
    bigString["currentPrice"] = currentPrice;
    bigString["currentVolume"] = currentVolume;
    bigString["currentIntrest"] =  currentIntrest;
    bigString["SYStime"] = time;
    bigString["dataBaseTime"] = lastRef;
    let priceDelta = (currentPrice-previousPrice)/previousPrice;
    console.log("Price delta percent: "+priceDelta);
    bigString["priceDelta"] = priceDelta;
    normalizedPriceIndex = 0.5 +(priceDelta*10);//the price delta will be neg already so no nead to like try and add or subtract
    let volumeDelta = (currentVolume-previousVolume)/previousVolume;
    normalizedVolumeIndex = 0.5 + volumeDelta/2;
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
   
    }
    else{
        newPC = 1;
        console.log("Price Will go down");

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
        brain.train(previousInputs, actualPriceChangeArr);
        previousPrice = currentPrice;
        previousVolume = currentVolume;
        previousIntrest = currentIntrest;
        PC = newPC;
        bigString["numCorrect"] = avgCorrect;
        //console.log(bigString.toString());
        previousInputs = inputs;
        console.log("\n");
    }
    
    
}
//Google TRends data
const googleTrends = require('google-trends-api');
d = new Date();
year = d.getFullYear();
mon = d.getMonth()+1;
day = d.getDate();
dw = d.getDay();
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
googleTrends.interestOverTime({keyword: 'apple', catagory: 1179, startTime: new Date(Date.now() - (24 * 60 * 60 * 1000)), granularTimeResolution: true, geo: 'US'})
.then((res) => {
  jsonData = JSON.parse(res);
  resolve(jsonData['default']['timelineData'][0]['value']);
})
.catch((err) => {
  console.log(err);
})
});
}
//end google trends

var https = require("https");

                                                       


//setInterval(updateNN, 30*60*1000);
//getPrice();

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