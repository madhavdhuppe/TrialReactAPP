const express = require('express')
var bodyParser = require("body-parser");
var mysql = require('mysql');
const fs = require('fs');
const app = express()
const port = 8080

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    insecureAuth : true,
    database: "Contacts"
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var queryResult;

app.get('/', function(req, res) {
    function fetchData(callback) {
      con.query("SELECT * FROM Persons", function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else 
              result = JSON.parse(JSON.stringify(result));
              callback(null, result);
        });
    }
    fetchData(function(err, content) {
        if (err) {
            console.log(err);
            res.send(err);  
            console.log("Do something with your error...");
        } else {
            queryResult= content;
         //   console.log(queryResult);
            res.send(queryResult);
        }
    });
})

app.post('/',function(req,res){
    updateMysqlDatabase(req.body, queryResult)
    res.send("Success");
  });
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function updateMysqlDatabase(totalData,queryResult){
    var values = []
    for (i = queryResult.length; i < totalData.length; i++) { 
        console.log("Inserting new record: " + totalData[i]);
        ab = [totalData[i]._id,totalData[i].Name,totalData[i].Phone]
        values.push(ab);        
    }
    if (values.length>0) {
        var sql = "INSERT INTO Persons VALUES ?";
        con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        });
    }
    return true
};  