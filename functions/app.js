const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (temVal,orgVal)=>{
    let temperature = temVal.replace("{%tempVal%}", (orgVal.main.temp - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempMin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempMax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%city%}", orgVal.name);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature
};
const server = http.createServer((req,res)=>{
    if (req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=0ec3ce6049f6fab2a65ac3dcf2b61f5f')
        .on('data', (chunk)=> {
            const objData = JSON.parse(chunk)
            const arrData = [objData];
            // console.log(arrData[0].main.temp)
            const realData = arrData.map((val)=> replaceVal(homeFile,val)).join("");
            res.write(realData)
        })
        .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
             console.log('end');
            });
        }
        else{
            res.end("File not found")
        }
    });

server.listen(8000,"0.0.0.0");
