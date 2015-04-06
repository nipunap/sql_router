/**
 * Created by nipuna on 4/5/15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var fs = require('fs');
var router = express.Router();
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var datam = "";

var readFile = function() {
    var a = null;
    fs.readFile('./logs/Output.txt', function (err, data) {
        if (err) throw err;
        datam = data;
    });
};

var processFile = function(){
    readFile();
    var data ="";
    if(datam){
        var lines = datam.toString().split("\n");
        lines =  lines.filter(function(e){return e});
        for (line in lines) {
            a = (lines[line]).split('|');
            if (a) {
                data += "<tr><td>" + a[0] + "</td><td>" + a[1] + "</td><td>" + a[2] + "</td><td>" + a[3] + "</td></tr>";
            }
        }
        return data;
    }
}

router.route('/status')
    .get(function (request, response) {
        var content = "<div class=\"container\"><table class=\"table table-striped\">";
        var tableHead = "<tr><thead><th>User</th><th>Executed SQL</th><th>Time taken</th><th>Row count</th></thead></tr>";
        var table = processFile();
        var end = "</table></div>";
        var resData = content + tableHead + table + end;
        response.send(resData);
    });

module.exports = router;