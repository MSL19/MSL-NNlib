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

//var date = year+"-"+(mon)+"-"+(day-14);
//, endTime: new Date(Date.now())
googleTrends.interestOverTime({keyword: 'Apple', endTime: new Date(), granularTimeResolution: true, geo: 'US'})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})