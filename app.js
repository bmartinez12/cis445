var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoClient = require('mongodb').MongoClient; // initializes the mongodb library and gets a client object

mongoClient.connect("mongodb://omega.unasec.info:27017", function(err, client) { 


  if(!err) {

    const collection = client.db('amazon').collection('reviews');

    console.log("We are connected to mongodb...");

    app.get("/review/:reviewid", function(req, res) {
        console.log("I got a request");
        let reviewid = req.params.reviewid;
        
        collection.aggregate([{$match: {"review.id": reviewid}}]).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }

        res.end();

     }); 
    });
    
    app.get("/review/random/:n/:stars", function(req, res) {
        console.log("I got a request");
        let stars = req.params.stars;
        let n = req.params.n;
        
        collection.aggregate([
            {$match: {"review.star_rating": stars}}
            
            ]).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }

        res.end();

     });
    });
    
    app.get("/review/:n/:from_date/:to_date", function(req, res) {
        console.log("I got a request");
        let from_date = req.params.from_date;
        let to_date = req.params.to_date;
        let n = req.params.n;
        
        let from = new Date(from_date);
        let to = new Date(to_date);
        
        collection.aggregate([
            {$match: {
              $and: [
                {"review.date" : { "$gte"  :  to}},  
                {"review.date" : { "$lte" : from}}
              ]
            }}
            
            ]).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }

        res.end();

     });
    });
    
    app.delete("/review/:reviewid", function(req, res) {
        console.log("I got a request");
        let reviewid = req.params.reviewid;
        
        collection.deleteOne(
            { "review.id" : { $eq: reviewid } } 
            
            ).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }
            
        res.send("The following review has been deleted. The review id number is: " + reviewid);
        res.end();

            });
    });
    
    app.post("/review/:reviewid", function(req, res) {
        console.log(req.body);
        let reviewid = req.params.reviewid;
        db.products.insertOne( { "review.id": reviewid} );

        res.end();
        
    });
    
    app.put("/review/:reviewid", function(req, res) {
        console.log("I got a request");
        let reviewid = req.params.reviewid;
        
        collection.update(
            {"review.id": reviewid},
            { $set: {"review.body": "Your body was updated"} }
            
            ).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }

        res.end();

     }); 
    });
    
    app.get("/review/:from/:to", function(req, res) {
        console.log("I got a request");
        let from_date = req.params.from;
        let to_date = req.params.to;
        let n = req.params.n;
        
        let from = new Date(from_date);
        let to = new Date(to_date);
        
        collection.aggregate([
            {$match: {
              $and: [
                {"review.date" : { "$gte"  :  to}},  
                {"review.date" : { "$lte" : from}}
              ]
            }},
            {  $group : {
                _id: null,
                averageStar: {$avg : "$review.star_rating"}
                }
            }
            
            ]).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }

        res.end();

     }); 
    });
    
    app.get("review/helpful/:prodid", function(req, res) {
        console.log("I got a request");
        let prodid = req.params.prodid;
        
        collection.aggregate([
            {$match: {"product.id": prodid}},
            {$group : {
                _id: null,
                averageVotes: {$avg : "$votes.helpful_votes"}
                }
            }
            ]).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }

        res.end();

     });
    });
    
    app.get("review/helpful/:custid", function(req, res) {
        console.log("I got a request");
        let custid = req.params.custid;
        
        collection.aggregate([
            {$match: {"customer_id": custid}},
            {$group : {
                _id: "$product.category",
                averageStar: {$avg : "$votes.star_rating"},
                averageVotes: {$avg : "$votes.helpful_votes"}
                }
            }
            ]).toArray(function(err, results) { // callback arguments are err or an array of results

                for(var i = 0; i < results.length; i++) {
                   console.log(results[i]);
                   res.send(results[i]);  
                }

        res.end();

     });
    });
    
  app.listen(8080);
  } // end if !err
}); // end mongo connect callback

