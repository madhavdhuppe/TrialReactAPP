const express = require('express')
var bodyParser = require("body-parser");
const fs = require('fs');
const app = express()
const port = 8080

//app.use(bodyParser());
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.send(JSONreadfunction()))

app.post('/',function(req,res){
    JSONwritefunction(req.body)
    res.send("Success");
  });
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function JSONreadfunction(){
    let rawdata = fs.readFileSync('contacts.json');  
    var contacts = JSON.parse(rawdata)
    return contacts;
};

function JSONwritefunction(totalData){

    savingString = JSON.stringify(totalData,null, 2);
    fs.writeFile('contacts.json',savingString,{flag: "w"},function(err){
        if(err) throw err
        console.log('Date written to file, contacts.json')
    })

    return true
};  