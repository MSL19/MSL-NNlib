const googleTrends = require('google-trends-api');
googleTrends.relatedTopics({keyword: 'Apple', startTime: new Date('2018-10-19'), endTime: new Date(Date.now())})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})