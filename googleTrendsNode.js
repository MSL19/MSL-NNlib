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
//moment
//all from: https://www.npmjs.com/package/google-trends-api
//var date = year+"-"+(mon)+"-"+(day-14);
//, endTime: new Date(Date.now())
async function printData(){
  var interest = await getGoogTrendsData();
  console.log(interest);
}
function getGoogTrendsData(){
return new Promise (function(resolve, reject){
googleTrends.interestOverTime({keyword: 'ethereum', catagory: 1179, startTime: new Date(Date.now() - (24 * 60 * 60 * 1000)), granularTimeResolution: true, geo: 'US'})
.then((res) => {
  jsonData = JSON.parse(res);
  resolve(jsonData['default']['timelineData'][0]['value']);
})
.catch((err) => {
  console.log(err);
})
});
}
setInterval(printData, 5000);