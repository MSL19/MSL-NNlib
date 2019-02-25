/**
 * Name: Max Lewis
 * Project Name: Max Lewis 20% Proj Sem 1
 * Purpose: 
 * This server side code runs on the KDS ATP server
 * Every 30 minutes, it pulls the the price and volume traded of Apple Stock from the Alphavantage API along with the search
 * interest for Apple from Google Trends
 * These three inputs are normalized and then fed into a 3,3,2 Neural Network, which then predicth how the price of the stock 
 * will changed by comparing the values of the final outpur nodes
 * The Stock Data, along with all the various weights and biases from the Neural Network are then added to a JSON object which
 * is braodcasted to kdsatp.org/nnpp/ for the fron end GUI to pull from
 * Date: 12/15/18
 * Collaborators: None
 */
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
function getStockJSON(){ //this pulls the JSON data on Apple stock from Alphavantage and returns the JSON
    return new Promise(function(resolve, reject){
        var request = https.request({
            method: "GET",
            host: "www.alphavantage.co", //"api.intrinio.com",
            path: "/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=30min&apikey=HQ5I4BGWLZBZUPJC", 
            
        
        }, function(response) {
            var json = "";
            response.on('data', function (chunk) {
                json += chunk;
            });
            response.on('end', function() {
                try{
                company = JSON.parse(json);   
                resolve(company); //returning the JSON
                }
                catch(e){
                reject(e);
                }                
            });
        });
        request.end();
        });
         
}
function getStockPrice(company){ //this parses through the JSON array to find the most recent stock price  
    updateTime();
    let timeStr = date+' '+time;
    lastRef = company['Meta Data']['3. Last Refreshed'];
    console.log(lastRef);
        //console.log(company['Time Series (30min)'][1]);
      return company['Time Series (30min)'][lastRef]['4. close']; //[date+' '+time]['4. close'];
     
}
function dataBaseCheck(company){ //this checks to see if the database has been updated
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
    
   return SMupdateBool;
   
    }
  let timeStr = "first";  
function getStockVolume(company){ //this parses through the JSON array to find the most recent stock volumme  
    let volume;
    updateTime();
     timeStr = date+' '+time;
    console.log(timeStr);
    lastRef = company['Meta Data']['3. Last Refreshed'];
    console.log(lastRef);
  //  console.log(company);
   
        volume = company['Time Series (30min)'][lastRef]['5. volume']; //[date+' '+time]['4. close'];
    
    
   return volume;
    
    }


setInterval(predictPrice, 5*60*1000); //this runs the predice price function every 4 minutes
//setInterval(predictPrice, 10000);


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
var previousPrice = 176.0475;
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

async function predictPrice(){ //this function only runs of the stock price has updated (this happens every 30 minutes)
    try{
    let comp = await getStockJSON();
    let DBup = dataBaseCheck(comp); //checking if the Database has updated--if not, the NN will not be run
    if(DBup){
    numTotal++;
    bigString = {};
    bigString["totalRuns"] = numTotal;
    let comp = await getStockJSON();
    currentPrice =  getStockPrice(comp);
    currentVolume =  getStockVolume(comp);
    currentIntrest =  await getGoogTrendsData();
   
    console.log(currentPrice);
    console.log(currentVolume);
    console.log(currentIntrest);
    //loging data to the JSON object
    bigString["currentPrice"] = currentPrice;
    bigString["currentVolume"] = currentVolume;
    bigString["currentIntrest"] =  currentIntrest;
    bigString["SYStime"] = time;
    bigString["dataBaseTime"] = lastRef;
    let priceDelta = (currentPrice-previousPrice)/previousPrice;
    console.log("Price delta percent: "+priceDelta);
    bigString["priceDelta"] = priceDelta;
    normalizedPriceIndex = 0.5 +(priceDelta*20);//the price delta will be neg already so no nead to like try and add or subtract
    let volumeDelta = (currentVolume-previousVolume)/previousVolume;
    normalizedVolumeIndex = 0.5 + volumeDelta/2;
    normalizedInterest = currentIntrest/100;

    let inputs = [normalizedPriceIndex,normalizedVolumeIndex,normalizedInterest];
    console.log(inputs);
    //more loging
    bigString["inputs"] = inputs;
    let outputs = brain.predict(inputs);
    bigString["outputs"]  = outputs;
    console.log(outputs);
    bigString["hiddenRaw"]  = brain.getHiddenRaw(inputs);
    bigString["hiddenB"]  = brain.getHiddenB(inputs);
    bigString["hidden"]  = brain.getHidden(inputs);
    bigString["outputsRaw"]  = brain.getOutputRaw(inputs);
    bigString["outputsB"]  = brain.getOutputB(inputs);
    bigString["IHW"] = brain.getWeightsIH();
    bigString["HOW"] = brain.getWeightsHO();
    bigString["BH"] = brain.getBiasH();
    bigString["BO"] = brain.getBiasO();
    if(outputs[0]>outputs[1]){ //comparing the final values of the outputs of the NN to see if the price of the stock will fall or increase
        newPC = 0; 
        console.log("Price Will go up");
   
    }
    else{ 
        newPC = 1;
        console.log("Price Will go down");

    }

        if(PC == 0){
        if(previousPrice>currentPrice+0.01){ //creating accurate logs of wether the NN was right and also setting up arrays to train the NN on
            console.log("Price was supposed to go up------Price went down---------------");
            actualPriceChangeArr = [0,1]; //used to train the NN
            bigString["printStatement"] ="Price was supposed to go up------Price went down---------------" + "\n" +"\n";
        }
    
        else{
            console.log("Price was supposed to go up-------price went up------------------");
            actualPriceChangeArr = [1,0];//used to train the NN 
            avgCorrect++;
            
            bigString["printStatement"] = "Price was supposed to go up------Price went up---------------" + "\n" +"\n";
        }
        }
        else{
            if(previousPrice<currentPrice){ 
                //maybe feedback the difference between the normalized pricce deltas and the expected price delta
                actualPriceChangeArr = [0,1]; //used to train the NN
                console.log("price was supposed to go down--------price went up------------------");
                
                bigString["printStatement"] = "Price was supposed to go down------Price went up---------------" + "\n" +"\n";
            }
            else{
                console.log("price was supposed to go down----------Price went down---------------");
                avgCorrect++;
                bigString["printStatement"] = "Price was supposed to go down------Price went down---------------" + "\n" +"\n";
                actualPriceChangeArr = [1,0]; //used to train the NN
            }  
        }
        brain.train(previousInputs, actualPriceChangeArr); //training the NN by passing in the actual and "ideal" output arrays
        previousPrice = currentPrice;
        previousVolume = currentVolume;
        previousIntrest = currentIntrest;
        PC = newPC;
        bigString["numCorrect"] = avgCorrect;
        //console.log(bigString.toString());
        previousInputs = inputs;
        console.log("\n");
        
        bigString["message"] = "This assumes a $0.01 trading fee"; //this is per Mr. Spahr's advice
        bigString["marketStatus"] = "stockmarket is open right now";
        usersRef = ref.child(timeStr);
        usersRef.set(bigString);

    }
    else{
        bigString["marketStatus"] = "stockmarket is closed right now";
    }
    
    
    
    }
    catch(e){
        console.log("BIG ERROR!!");
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

async function printData(){ //used for debugging Google Trends Data
  var interest = await getGoogTrendsData();
  console.log(interest);
}

function getGoogTrendsData(){ //get search data from the google-trends-api in NODE.js
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

                                                    

const express = require('express'); //create express sender object
const app = express();//create express object
const port = 3030; //set the localhost port
app.get('/', (req, res) => res.json(bigString)); //send the data to the website: https://www.kdsatp.org/nnpp/
app.listen(port, () => console.log(`Listening on port ${port}!`)); //log that you are sending the data

var firebase = require("firebase-admin");
var serviceAccount = require("./wows2-c4ed2-firebase-adminsdk-9w1di-1904845fc1.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount), 
    databaseURL: "https://wows2-c4ed2.firebaseio.com/"
})
var db = firebase.database();
var ref = db.ref(date);
var usersRef = ref.child(timeStr);

