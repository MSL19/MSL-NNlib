let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&interval=1min&apikey=4YCOZN9E28NT4HJL';
let r,g,b;
var price;
var data =  jQuery.ajax({
        url: url,
        dataType: 'json',
        contentType: "application/json",
        success: function(data){
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() +1;
        var day = d.getDate();
        var dw = d.getDay();
        if(dw==6){ //stock don't trade over the weekend
            day--;
        }
        if(dw==0){
            day-=2;
        }
        if(day<10){
            day = "0"+day;
        }
       
        var symbol = data['Meta Data']['2. Symbol'];
        var dateS = year+"-"+mon+"-"+day;
            price = data['Time Series (Daily)'][dateS]['1. open'];
     // console.log(symbol);
     // console.log(data);
       console.log(price);
        }
    }).done(function() {
        console.log(price);
       
        
    });




    