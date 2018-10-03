var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/index.html", function (req, res) {
 res.sendFile( __dirname + "/"+ "index.html" );
})

app.get("/review/:reviewid", function(req, res) {
 let reviewid = req.params.reviewid;
 res.send("The following is a review for the fidget spinner. The review id number is: " + reviewid);
});

app.get("/review/:n/:stars", function(req, res) {
 let stars = req.params.stars;
 let n = req.params.n;
 res.send("/The following is a review for the " + n + ". It received: " + stars + " stars.");
});

app.get("/review/:n/:from_date/:to_date", function(req, res) {
 let n = req.params.n;
 let from_date = req.params.from_date;
 let to_date = req.params.to_date;
 res.send("The following reviews are for " + n + " from " + from_date + " to " + to_date);
});

app.delete("/review/:reviewid", function(req, res) {
 let reviewid = req.params.reviewid;
 res.send("The following review has been deleted. The review id number is: " + reviewid);
});

app.post("/review/:reviewid", function(req, res){
 console.log(req.body);
 res.send("Here is your new review");
});

app.put("/review/:reviewid", function(req, res){
 console.log(req.body);
 res.send("Here is your updated review");
});

app.listen(8080);