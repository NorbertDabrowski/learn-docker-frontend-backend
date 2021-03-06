var express = require("express");
var app = express();

var redis = require('redis');
var redisClient = redis.createClient(process.env.REDIS_URL);


const PORT = process.env.PORT || 8001;
const HOST = '0.0.0.0';

redisClient.on("error", function (err) {
    console.log("RedisError " + err);
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);    
    // Pass to next layer of middleware
    next();
});



app.get("/api/values", (req, res) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

app.put("/api/redis", (req, res) => {
    redisClient.incr("someString", function () {
        console.log("redisClient.incr [+1] (" + process.env.REDIS_URL + ")");
        res.json("OK"); 
    });
});

app.delete("/api/redis", (req, res) => {
    redisClient.set("someString", "0", function () {
        console.log("redisClient.set [0] (" + process.env.REDIS_URL + ")");
        res.json("OK"); 
    });
});

app.get("/api/redis", (req, res) => {
    redisClient.get("someString", function (err, v) {
        console.log("redisClient.get [" + v + "] (" + process.env.REDIS_URL + ")");
        res.json(v);
    });
});


app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
