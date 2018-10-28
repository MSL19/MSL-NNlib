const googleTrends = require('google-trends-api');
var d = new Date();
var year = d.getFullYear();
var mon = d.getMonth()+1;
var day = d.getDate();
var dw = d.getDay();
if(day<10){
day = "0"+day;
}
//moment
//all from: https://www.npmjs.com/package/google-trends-api
//var date = year+"-"+(mon)+"-"+(day-14);
//, endTime: new Date(Date.now())
googleTrends.interestOverTime({keyword: 'Apple', catagory: 1179, startTime: new Date(Date.now() - (24 * 60 * 60 * 1000)), granularTimeResolution: true, geo: 'US'})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})